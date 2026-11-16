import api, { envelope, payload } from './http';

export const fetchContent = () => api.get('/admin/content').then(envelope);
export const saveContent = (key, data) => api.put(`/admin/content/${encodeURIComponent(key)}`, { data }).then(payload);
