import api, { envelope } from './http';

export const fetchDashboard = () => api.get('/admin/dashboard').then(envelope);
