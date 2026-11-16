import api, { envelope, payload } from './http';

export const fetchPriceCategories = () =>
  api
    .get('/admin/price-categories')
    .then(envelope)
    .then((env) => ({ ...env, data: (env.data || []).map((c) => ({ ...c, items: c.items || [] })) }));
export const createPriceCategory = (values) => api.post('/admin/price-categories', values).then(payload);
export const updatePriceCategory = (id, values) => api.put(`/admin/price-categories/${id}`, values).then(payload);
export const deletePriceCategory = (id) => api.delete(`/admin/price-categories/${id}`);
export const orderPriceCategories = (ids) => api.put('/admin/price-categories/order', { ids });

export const createPriceItem = (values) => api.post('/admin/price-items', values).then(payload);
export const updatePriceItem = (id, values) => api.put(`/admin/price-items/${id}`, values).then(payload);
export const deletePriceItem = (id) => api.delete(`/admin/price-items/${id}`);
export const orderPriceItems = (categoryId, ids) => api.put('/admin/price-items/order', { categoryId, ids });
