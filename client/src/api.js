// Static localStorage API — Works without a backend server (GitHub Pages compatible)

const STATIC_MODE = true;

const LS = {
  USER: 'tp_user',
  TASKS: 'tp_tasks',
  TAGS: 'tp_tags',
  NEXT_ID: 'tp_next_id',
};

function getLS(key, fallback = null) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; }
  catch { return fallback; }
}
function setLS(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

function nextId() {
  const id = getLS(LS.NEXT_ID, 100);
  setLS(LS.NEXT_ID, id + 1);
  return id;
}

function getTasks() { return getLS(LS.TASKS, []); }
function saveTasks(t) { setLS(LS.TASKS, t); }
function getTags() { return getLS(LS.TAGS, []); }
function saveTags(t) { setLS(LS.TAGS, t); }

// Auth
function sRegister(name, email, password) {
  const user = { id: nextId(), name, email };
  setLS(LS.USER, user);
  localStorage.setItem('todo_jwt_token', 'static_' + user.id);
  return { token: 'static_' + user.id, user };
}

function sLogin(email, password) {
  const u = getLS(LS.USER);
  if (u && u.email === email) {
    localStorage.setItem('todo_jwt_token', 'static_' + u.id);
    return { token: 'static_' + u.id, user: u };
  }
  return sRegister(email.split('@')[0], email, password);
}

function sGoogleLogin(email, name) {
  const user = { id: nextId(), name, email };
  setLS(LS.USER, user);
  localStorage.setItem('todo_jwt_token', 'static_' + user.id);
  return { token: 'static_' + user.id, user };
}

function sProfile() {
  const user = getLS(LS.USER);
  if (!user) throw new Error('Not authenticated');
  return { user };
}

// Tasks
function sGetTasks(params = {}) {
  let tasks = getTasks();
  const today = new Date().toISOString().split('T')[0];
  if (params.status === 'pending') tasks = tasks.filter(t => !t.is_complete);
  if (params.status === 'completed') tasks = tasks.filter(t => t.is_complete);
  if (params.status === 'due_today') tasks = tasks.filter(t => t.due_date === today);
  if (params.status === 'overdue') tasks = tasks.filter(t => t.due_date && t.due_date < today && !t.is_complete);
  if (params.priority) tasks = tasks.filter(t => t.priority === params.priority);
  if (params.tagId) tasks = tasks.filter(t => t.tags && t.tags.some(tag => tag.id == params.tagId));
  if (params.search) {
    const q = params.search.toLowerCase();
    tasks = tasks.filter(t => t.title.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q));
  }
  return tasks;
}

function sCreateTask(data) {
  const tasks = getTasks();
  const allTags = getTags();
  const tagIds = data.tagIds || [];
  const task = {
    id: nextId(),
    title: data.title,
    description: data.description || '',
    is_complete: 0,
    due_date: data.due_date || null,
    priority: data.priority || 'medium',
    tags: allTags.filter(t => tagIds.includes(t.id)),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  tasks.push(task);
  saveTasks(tasks);
  return task;
}

function sUpdateTask(id, updates) {
  const tasks = getTasks();
  const allTags = getTags();
  const idx = tasks.findIndex(t => t.id == id);
  if (idx === -1) throw new Error('Task not found');
  if (updates.tagIds) {
    updates.tags = allTags.filter(t => updates.tagIds.includes(t.id));
    delete updates.tagIds;
  }
  tasks[idx] = { ...tasks[idx], ...updates, updated_at: new Date().toISOString() };
  saveTasks(tasks);
  return tasks[idx];
}

function sDeleteTask(id) {
  saveTasks(getTasks().filter(t => t.id != id));
  return { message: 'Deleted' };
}

// Tags
function sCreateTag(data) {
  const tags = getTags();
  const tag = { id: nextId(), name: data.name, color: data.color || '#6366f1' };
  tags.push(tag);
  saveTags(tags);
  return tag;
}

function sDeleteTag(id) {
  saveTags(getTags().filter(t => t.id != id));
  saveTasks(getTasks().map(t => ({ ...t, tags: (t.tags || []).filter(tag => tag.id != id) })));
  return { message: 'Deleted' };
}

// Unified API
export const api = {
  register: (name, email, pw) => Promise.resolve(sRegister(name, email, pw)),
  login: (email, pw) => Promise.resolve(sLogin(email, pw)),
  googleLogin: (email, name, gid) => Promise.resolve(sGoogleLogin(email, name)),
  getProfile: () => Promise.resolve(sProfile()),

  getTasks: (p = {}) => Promise.resolve(sGetTasks(p)),
  getTask: (id) => Promise.resolve(getTasks().find(t => t.id == id) || {}),
  createTask: (d) => Promise.resolve(sCreateTask(d)),
  updateTask: (id, u) => Promise.resolve(sUpdateTask(id, u)),
  deleteTask: (id) => Promise.resolve(sDeleteTask(id)),

  getTags: () => Promise.resolve(getTags()),
  createTag: (d) => Promise.resolve(sCreateTag(d)),
  deleteTag: (id) => Promise.resolve(sDeleteTag(id)),
};
