import api from '../../services/api';

// Shared helpers for the admin's API calls. Everything goes through the site's one Axios instance.
// Load functions return the response envelope ({ data, meta }) so they plug straight into useApi;
// save functions return just the saved record.
export const envelope = (response) => response.data;
export const payload = (response) => response.data.data;

export default api;
