import api from './api';

// Price categories in page order, each with its rows.
export const getPricing = () => api.get('/pricing').then((r) => r.data.data);
