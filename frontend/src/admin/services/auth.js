import api, { payload } from './http';

export const getMe = () => api.get('/auth/me').then(payload);
export const login = (values) => api.post('/auth/login', values).then(payload);
export const logout = () => api.post('/auth/logout');
export const changePassword = (values) => api.put('/auth/password', values).then(payload);
