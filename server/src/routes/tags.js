const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/tags
router.get('/', (req, res) => {
  const tags = db.prepare('SELECT * FROM tags WHERE user_id = ? ORDER BY name ASC').all(req.user.id);
  res.json({ tags });
});

// POST /api/tags
router.post('/', (req, res) => {
  const { name, color } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Tag name is required' });
  }

  const existing = db.prepare('SELECT id FROM tags WHERE user_id = ? AND LOWER(name) = ?')
    .get(req.user.id, name.trim().toLowerCase());
  
  if (existing) {
    return res.status(400).json({ error: 'Tag with this name already exists' });
  }

  const stmt = db.prepare('INSERT INTO tags (user_id, name, color) VALUES (?, ?, ?)');
  const result = stmt.run(req.user.id, name.trim(), color || '#6366f1');

  const newTag = db.prepare('SELECT * FROM tags WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ tag: newTag });
});

// DELETE /api/tags/:id
router.delete('/:id', (req, res) => {
  const tag = db.prepare('SELECT * FROM tags WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!tag) {
    return res.status(404).json({ error: 'Tag not found' });
  }

  db.prepare('DELETE FROM tags WHERE id = ?').run(req.params.id);
  res.json({ message: 'Tag deleted successfully', id: Number(req.params.id) });
});

module.exports = router;
