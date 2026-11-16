import api, { envelope, payload } from './http';

export const fetchWorkCategories = () =>
  api
    .get('/admin/work-categories')
    .then(envelope)
    .then((env) => ({ ...env, data: (env.data || []).map((c) => ({ ...c, tags: c.tags || [], works: c.works || [] })) }));
export const createWorkCategory = (values) => api.post('/admin/work-categories', values).then(payload);
export const updateWorkCategory = (id, values) => api.put(`/admin/work-categories/${id}`, values).then(payload);
export const deleteWorkCategory = (id) => api.delete(`/admin/work-categories/${id}`);
export const orderWorkCategories = (ids) => api.put('/admin/work-categories/order', { ids });

export const createWork = (values) => api.post('/admin/works', values).then(payload);
export const updateWork = (id, values) => api.put(`/admin/works/${id}`, values).then(payload);
export const deleteWork = (id) => api.delete(`/admin/works/${id}`);
export const orderWorks = (categoryId, ids) => api.put('/admin/works/order', { categoryId, ids });
