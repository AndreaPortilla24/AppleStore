import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({ baseURL: API_URL });

// Inject token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ===== Auth =====
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
};

// ===== Productos =====
export const productosApi = {
  getAll: () => api.get('/productos'),
  getAllAdmin: () => api.get('/productos/all'),
  getById: (id) => api.get(`/productos/${id}`),
  getByCategoria: (cat) => api.get(`/productos/categoria/${cat}`),
  getCategorias: () => api.get('/productos/categorias'),
  create: (data) => api.post('/productos', data),
  update: (id, data) => api.put(`/productos/${id}`, data),
  delete: (id) => api.delete(`/productos/${id}`),
};

// ===== Pedidos =====
export const pedidosApi = {
  getAll: () => api.get('/pedidos'),
  getMisPedidos: () => api.get('/pedidos/mis-pedidos'),
  getById: (id) => api.get(`/pedidos/${id}`),
  create: (data) => api.post('/pedidos', data),
  updateEstado: (id, estado) => api.put(`/pedidos/${id}/estado?estado=${estado}`),
  cancelar: (id) => api.delete(`/pedidos/${id}`),
};

// ===== Equipos =====
export const equiposApi = {
  getAll: () => api.get('/equipos'),
  getMisEquipos: () => api.get('/equipos/mis-equipos'),
  register: (data) => api.post('/equipos', data),
};

// ===== Servicios =====
export const serviciosApi = {
  getAll: () => api.get('/servicios'),
  getMisSolicitudes: () => api.get('/servicios/mis-solicitudes'),
  crear: (data) => api.post('/servicios', data),
  updateEstado: (id, estado) => api.put(`/servicios/${id}/estado?estado=${estado}`),
  cancelar: (id) => api.delete(`/servicios/${id}`),
};

// ===== Asignaciones =====
export const asignacionesApi = {
  getAll: () => api.get('/asignaciones'),
  asignar: (data) => api.post('/asignaciones', data),
  finalizar: (id) => api.put(`/asignaciones/${id}/finalizar`),
};

// ===== Usuarios =====
export const usuariosApi = {
  getAll: () => api.get('/usuarios'),
  getTecnicos: () => api.get('/usuarios/tecnicos'),
  cambiarRol: (id, rol) => api.put(`/usuarios/${id}/rol?rol=${rol}`),
  eliminar: (id) => api.delete(`/usuarios/${id}`),
};

// ===== Audit =====
export const auditApi = {
  getAll: () => api.get('/audit'),
  getByUsuario: (id) => api.get(`/audit/usuario/${id}`),
};

// ===== Reportes =====
export const reportesApi = {
  getConsolidado: () => api.get('/reportes/consolidado'),
};

export default api;
