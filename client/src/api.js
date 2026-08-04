const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

function getAuthHeader() {
  const token = localStorage.getItem('todo_jwt_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.error || 'An unexpected error occurred');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  register: (name, email, password) => request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  googleLogin: (email, name, googleId) => request('/auth/google', { method: 'POST', body: JSON.stringify({ email, name, googleId }) }),
  getProfile: () => request('/auth/me'),

  // Tasks
  getTasks: (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.append('status', params.status);
    if (params.priority) query.append('priority', params.priority);
    if (params.tagId) query.append('tagId', params.tagId);
    if (params.search) query.append('search', params.search);
    if (params.sort) query.append('sort', params.sort);
    return request(`/tasks?${query.toString()}`);
  },
  getTask: (id) => request(`/tasks/${id}`),
  createTask: (taskData) => request('/tasks', { method: 'POST', body: JSON.stringify(taskData) }),
  updateTask: (id, updates) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),

  // Tags
  getTags: () => request('/tags'),
  createTag: (tagData) => request('/tags', { method: 'POST', body: JSON.stringify(tagData) }),
  deleteTag: (id) => request(`/tags/${id}`, { method: 'DELETE' })
};
