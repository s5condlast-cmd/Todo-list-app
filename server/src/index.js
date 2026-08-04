const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'taskpulse_secret_key_2026';

app.use(cors());
app.use(express.json());

// Serve static client build files in production
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// --- AUTHENTICATION ENDPOINTS ---

// Register
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    const userEmail = email.toLowerCase().trim();
    const hashedPassword = bcrypt.hashSync(password, 10);

    const checkUser = db.prepare(`SELECT id FROM users WHERE email = ?`).get(userEmail);
    if (checkUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    const info = db.prepare(`INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)`).run(userEmail, hashedPassword, name.trim());
    const userId = info.lastInsertRowid;

    const token = jwt.sign({ id: userId, email: userEmail, name: name.trim() }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: userId, email: userEmail, name: name.trim() }
    });
  } catch (e) {
    console.error('Registration Error:', e.message);
    res.status(500).json({ error: 'Server error creating account: ' + e.message });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const userEmail = email.toLowerCase().trim();
    const user = db.prepare(`SELECT * FROM users WHERE email = ?`).get(userEmail);
    
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const validPassword = bcrypt.compareSync(password, user.password_hash);
    if (!validPassword) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (e) {
    console.error('Login Error:', e.message);
    res.status(500).json({ error: 'Database authentication error' });
  }
});

// Google OAuth Login / Instant One-Tap Endpoint
app.post('/api/auth/google', (req, res) => {
  const { email, name, googleId } = req.body;
  const userEmail = email ? email.toLowerCase().trim() : 'google.user@taskpulse.io';
  const userName = name || 'Google Account User';

  try {
    let user = db.prepare(`SELECT * FROM users WHERE email = ?`).get(userEmail);

    if (!user) {
      // Create new Google user account
      const dummyPassword = bcrypt.hashSync(googleId || 'google_oauth_secret', 10);
      const info = db.prepare(`INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)`).run(userEmail, dummyPassword, userName);
      const userId = info.lastInsertRowid;
      user = { id: userId, email: userEmail, name: userName };
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      message: 'Google login successful',
      token,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (e) {
    console.error('Google Auth Error:', e.message);
    res.status(500).json({ error: 'Google authentication error: ' + e.message });
  }
});

// Verify Current Token / Profile
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// --- TASKS API ENDPOINTS ---

// Get all tasks for user with filters & sorting
app.get('/api/tasks', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { status, priority, tagId, search, sort } = req.query;

  let query = `
    SELECT t.*, 
      GROUP_CONCAT(tg.id) as tag_ids,
      GROUP_CONCAT(tg.name) as tag_names,
      GROUP_CONCAT(tg.color) as tag_colors
    FROM tasks t
    LEFT JOIN task_tags tt ON t.id = tt.task_id
    LEFT JOIN tags tg ON tt.tag_id = tg.id
    WHERE t.user_id = ?
  `;
  const params = [userId];

  if (status === 'completed') {
    query += ` AND t.is_complete = 1`;
  } else if (status === 'pending') {
    query += ` AND t.is_complete = 0`;
  } else if (status === 'due_today') {
    const today = new Date().toISOString().split('T')[0];
    query += ` AND t.due_date = ? AND t.is_complete = 0`;
    params.push(today);
  } else if (status === 'overdue') {
    const today = new Date().toISOString().split('T')[0];
    query += ` AND t.due_date < ? AND t.is_complete = 0`;
    params.push(today);
  }

  if (priority) {
    query += ` AND t.priority = ?`;
    params.push(priority);
  }

  if (search) {
    query += ` AND (t.title LIKE ? OR t.description LIKE ?)`;
    params.push(`%${search}%`, `%${search}%`);
  }

  if (tagId) {
    query += ` AND t.id IN (SELECT task_id FROM task_tags WHERE tag_id = ?)`;
    params.push(tagId);
  }

  query += ` GROUP BY t.id`;

  // Sorting
  if (sort === 'dueDate') {
    query += ` ORDER BY t.due_date IS NULL ASC, t.due_date ASC, t.created_at DESC`;
  } else if (sort === 'priority') {
    query += ` ORDER BY CASE t.priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 ELSE 4 END ASC, t.created_at DESC`;
  } else {
    query += ` ORDER BY t.created_at DESC`;
  }

  try {
    const rows = db.prepare(query).all(...params);

    const formattedTasks = rows.map(r => {
      let tags = [];
      if (r.tag_ids) {
        const ids = r.tag_ids.split(',');
        const names = r.tag_names.split(',');
        const colors = r.tag_colors.split(',');
        tags = ids.map((id, index) => ({
          id: parseInt(id),
          name: names[index],
          color: colors[index]
        }));
      }

      return {
        id: r.id,
        user_id: r.user_id,
        title: r.title,
        description: r.description,
        is_complete: Boolean(r.is_complete),
        due_date: r.due_date,
        priority: r.priority,
        created_at: r.created_at,
        tags
      };
    });

    res.json(formattedTasks);
  } catch (e) {
    console.error('Get Tasks Error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// Create task
app.post('/api/tasks', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { title, description, due_date, priority, tagIds } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  try {
    const info = db.prepare(
      `INSERT INTO tasks (user_id, title, description, due_date, priority) VALUES (?, ?, ?, ?, ?)`
    ).run(userId, title, description || '', due_date || null, priority || 'medium');

    const taskId = info.lastInsertRowid;

    if (tagIds && Array.isArray(tagIds) && tagIds.length > 0) {
      const stmt = db.prepare(`INSERT INTO task_tags (task_id, tag_id) VALUES (?, ?)`);
      tagIds.forEach(tId => stmt.run(taskId, tId));
    }

    res.status(201).json({
      id: taskId,
      user_id: userId,
      title,
      description: description || '',
      is_complete: false,
      due_date: due_date || null,
      priority: priority || 'medium',
      tags: []
    });
  } catch (e) {
    console.error('Create Task Error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// Update task
app.put('/api/tasks/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;
  const { title, description, is_complete, due_date, priority, tagIds } = req.body;

  try {
    const info = db.prepare(
      `UPDATE tasks SET 
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        is_complete = COALESCE(?, is_complete),
        due_date = ?,
        priority = COALESCE(?, priority)
       WHERE id = ? AND user_id = ?`
    ).run(
      title !== undefined ? title : null, 
      description !== undefined ? description : null, 
      is_complete !== undefined ? (is_complete ? 1 : 0) : null, 
      due_date !== undefined ? due_date : null, 
      priority !== undefined ? priority : null, 
      taskId, 
      userId
    );

    if (info.changes === 0) return res.status(404).json({ error: 'Task not found or unauthorized' });

    if (tagIds && Array.isArray(tagIds)) {
      db.prepare(`DELETE FROM task_tags WHERE task_id = ?`).run(taskId);
      if (tagIds.length > 0) {
        const stmt = db.prepare(`INSERT INTO task_tags (task_id, tag_id) VALUES (?, ?)`);
        tagIds.forEach(tId => stmt.run(taskId, tId));
      }
    }

    res.json({ message: 'Task updated successfully' });
  } catch (e) {
    console.error('Update Task Error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// Delete task
app.delete('/api/tasks/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;

  try {
    const info = db.prepare(`DELETE FROM tasks WHERE id = ? AND user_id = ?`).run(taskId, userId);
    if (info.changes === 0) return res.status(404).json({ error: 'Task not found or unauthorized' });

    db.prepare(`DELETE FROM task_tags WHERE task_id = ?`).run(taskId);
    res.json({ message: 'Task deleted successfully' });
  } catch (e) {
    console.error('Delete Task Error:', e.message);
    res.status(500).json({ error: e.message });
  }
});

// --- TAGS API ENDPOINTS ---

// Get all tags for user
app.get('/api/tags', authenticateToken, (req, res) => {
  const userId = req.user.id;
  try {
    const rows = db.prepare(`SELECT * FROM tags WHERE user_id = ? ORDER BY name ASC`).all(userId);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Create tag
app.post('/api/tags', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { name, color } = req.body;

  if (!name) return res.status(400).json({ error: 'Tag name is required' });

  try {
    const info = db.prepare(
      `INSERT INTO tags (user_id, name, color) VALUES (?, ?, ?)`
    ).run(userId, name, color || '#6366f1');

    res.status(201).json({ id: info.lastInsertRowid, user_id: userId, name, color: color || '#6366f1' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete tag
app.delete('/api/tags/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const tagId = req.params.id;

  try {
    const info = db.prepare(`DELETE FROM tags WHERE id = ? AND user_id = ?`).run(tagId, userId);
    db.prepare(`DELETE FROM task_tags WHERE tag_id = ?`).run(tagId);
    res.json({ message: 'Tag deleted successfully' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Catch-all fallback for SPA routing in production
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 TaskPulse backend running on http://localhost:${PORT}`);
});
