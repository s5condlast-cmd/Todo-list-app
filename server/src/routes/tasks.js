const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// Helper to attach tags to tasks
function attachTagsToTasks(tasks) {
  if (!tasks.length) return [];
  const taskIds = tasks.map(t => t.id);
  const placeholders = taskIds.map(() => '?').join(',');
  
  const tagsQuery = `
    SELECT tt.task_id, t.id, t.name, t.color
    FROM task_tags tt
    JOIN tags t ON tt.tag_id = t.id
    WHERE tt.task_id IN (${placeholders})
  `;
  const taskTags = db.prepare(tagsQuery).all(...taskIds);

  const tagMap = {};
  for (const row of taskTags) {
    if (!tagMap[row.task_id]) tagMap[row.task_id] = [];
    tagMap[row.task_id].push({ id: row.id, name: row.name, color: row.color });
  }

  return tasks.map(task => ({
    ...task,
    is_complete: Boolean(task.is_complete),
    tags: tagMap[task.id] || []
  }));
}

// GET /api/tasks (list with filters, search, and sorting)
router.get('/', (req, res) => {
  const userId = req.user.id;
  const { status, priority, tagId, search, sort } = req.query;

  let query = `
    SELECT DISTINCT t.*
    FROM tasks t
    LEFT JOIN task_tags tt ON t.id = tt.task_id
    WHERE t.user_id = ?
  `;
  const params = [userId];

  // Status Filter
  if (status === 'completed') {
    query += ' AND t.is_complete = 1';
  } else if (status === 'pending') {
    query += ' AND t.is_complete = 0';
  } else if (status === 'due_today') {
    const today = new Date().toISOString().split('T')[0];
    query += ' AND t.due_date = ?';
    params.push(today);
  } else if (status === 'overdue') {
    const today = new Date().toISOString().split('T')[0];
    query += ' AND t.due_date < ? AND t.is_complete = 0';
    params.push(today);
  }

  // Priority Filter
  if (priority && ['low', 'medium', 'high', 'urgent'].includes(priority)) {
    query += ' AND t.priority = ?';
    params.push(priority);
  }

  // Tag Filter
  if (tagId) {
    query += ' AND tt.tag_id = ?';
    params.push(tagId);
  }

  // Search Filter
  if (search && search.trim()) {
    query += ' AND (t.title LIKE ? OR t.description LIKE ?)';
    const term = `%${search.trim()}%`;
    params.push(term, term);
  }

  // Sorting
  if (sort === 'dueDate') {
    query += ' ORDER BY CASE WHEN t.due_date IS NULL THEN 1 ELSE 0 END, t.due_date ASC, t.created_at DESC';
  } else if (sort === 'priority') {
    query += ` ORDER BY CASE t.priority
      WHEN 'urgent' THEN 1
      WHEN 'high' THEN 2
      WHEN 'medium' THEN 3
      WHEN 'low' THEN 4
      ELSE 5 END ASC, t.created_at DESC`;
  } else { // default createdAt
    query += ' ORDER BY t.created_at DESC';
  }

  const rows = db.prepare(query).all(...params);
  const tasks = attachTagsToTasks(rows);

  res.json({ tasks });
});

// GET /api/tasks/:id
router.get('/:id', (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const [formattedTask] = attachTagsToTasks([task]);
  res.json({ task: formattedTask });
});

// POST /api/tasks
router.post('/', (req, res) => {
  const { title, description, due_date, priority, tagIds } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  if (title.length > 255) {
    return res.status(400).json({ error: 'Task title must be 255 characters or fewer' });
  }

  const validPriorities = ['low', 'medium', 'high', 'urgent'];
  const taskPriority = validPriorities.includes(priority) ? priority : 'medium';
  const taskDueDate = due_date || null;

  const insertStmt = db.prepare(`
    INSERT INTO tasks (user_id, title, description, due_date, priority)
    VALUES (?, ?, ?, ?, ?)
  `);

  const result = insertStmt.run(
    req.user.id,
    title.trim(),
    description ? description.trim() : '',
    taskDueDate,
    taskPriority
  );

  const taskId = result.lastInsertRowid;

  // Insert tag associations if present
  if (Array.isArray(tagIds) && tagIds.length > 0) {
    const insertTag = db.prepare('INSERT OR IGNORE INTO task_tags (task_id, tag_id) VALUES (?, ?)');
    for (const tagId of tagIds) {
      insertTag.run(taskId, tagId);
    }
  }

  const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
  const [formatted] = attachTagsToTasks([newTask]);

  res.status(201).json({ task: formatted });
});

// PUT /api/tasks/:id
router.put('/:id', (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { title, description, is_complete, due_date, priority, tagIds } = req.body;

  if (title !== undefined && (!title || !title.trim())) {
    return res.status(400).json({ error: 'Task title cannot be empty' });
  }

  const updatedTitle = title !== undefined ? title.trim() : task.title;
  const updatedDesc = description !== undefined ? description.trim() : task.description;
  const updatedIsComplete = is_complete !== undefined ? (is_complete ? 1 : 0) : task.is_complete;
  const updatedDueDate = due_date !== undefined ? (due_date || null) : task.due_date;
  const validPriorities = ['low', 'medium', 'high', 'urgent'];
  const updatedPriority = priority && validPriorities.includes(priority) ? priority : task.priority;

  const updateStmt = db.prepare(`
    UPDATE tasks
    SET title = ?, description = ?, is_complete = ?, due_date = ?, priority = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND user_id = ?
  `);

  updateStmt.run(updatedTitle, updatedDesc, updatedIsComplete, updatedDueDate, updatedPriority, req.params.id, req.user.id);

  // Update tags if tagIds is provided
  if (Array.isArray(tagIds)) {
    db.prepare('DELETE FROM task_tags WHERE task_id = ?').run(req.params.id);
    const insertTag = db.prepare('INSERT OR IGNORE INTO task_tags (task_id, tag_id) VALUES (?, ?)');
    for (const tagId of tagIds) {
      insertTag.run(req.params.id, tagId);
    }
  }

  const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  const [formatted] = attachTagsToTasks([updatedTask]);

  res.json({ task: formatted });
});

// DELETE /api/tasks/:id
router.delete('/:id', (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  res.json({ message: 'Task deleted successfully', id: Number(req.params.id) });
});

module.exports = router;
