import api from './api';

// Everything the site frame needs (settings, page content, service slides) in one call.
export const getSite = () => api.get('/site').then((r) => r.data.data);
