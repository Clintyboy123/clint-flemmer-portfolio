import api, { envelope, payload } from './http';

// The home-page services carousel.
export const fetchSlides = () => api.get('/admin/service-slides').then(envelope);
export const createSlide = (values) => api.post('/admin/service-slides', values).then(payload);
export const updateSlide = (id, values) => api.put(`/admin/service-slides/${id}`, values).then(payload);
export const deleteSlide = (id) => api.delete(`/admin/service-slides/${id}`);
export const orderSlides = (ids) => api.put('/admin/service-slides/order', { ids });
