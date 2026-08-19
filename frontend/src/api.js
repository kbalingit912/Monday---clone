import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const projectsAPI = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (name, description) => api.post('/projects', { name, description }),
  update: (id, name, description) => api.put(`/projects/${id}`, { name, description }),
  delete: (id) => api.delete(`/projects/${id}`),
};

export const boardsAPI = {
  getByProject: (projectId) => api.get(`/boards/project/${projectId}`),
  getById: (id) => api.get(`/boards/${id}`),
  create: (projectId, name) => api.post('/boards', { projectId, name }),
  initColumns: (boardId) => api.post(`/boards/${boardId}/init-columns`),
  update: (id, name) => api.put(`/boards/${id}`, { name }),
  delete: (id) => api.delete(`/boards/${id}`),
};

export const tasksAPI = {
  getByColumn: (columnId) => api.get(`/tasks/column/${columnId}`),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (columnId, title, description, position, metadata) =>
    api.post('/tasks', { columnId, title, description, position, ...metadata }),
  update: (id, title, description, columnId, position, metadata) =>
    api.put(`/tasks/${id}`, { title, description, columnId, position, ...metadata }),
  delete: (id) => api.delete(`/tasks/${id}`),
};

export default api;
