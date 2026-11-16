import api, { envelope, payload } from './http';

export const fetchSettings = () => api.get('/admin/settings').then(envelope);
export const saveSettings = (values) => api.put('/admin/settings', values).then(payload);
