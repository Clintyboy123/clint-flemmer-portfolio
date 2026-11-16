import api from './api';

// Work categories in page order, each with its works.
export const getWorks = () => api.get('/works').then((r) => r.data.data);
