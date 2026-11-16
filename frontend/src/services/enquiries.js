import api from './api';

// Sends the contact form as multipart/form-data (it can carry reference files).
// Axios sets the multipart boundary itself once the JSON default header is cleared.
export const sendEnquiry = (formData) =>
  api.post('/enquiries', formData, { headers: { 'Content-Type': undefined }, timeout: 60000 }).then((r) => r.data.data);
