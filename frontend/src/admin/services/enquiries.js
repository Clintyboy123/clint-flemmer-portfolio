import api, { envelope, payload } from './http';

export const fetchEnquiries = (page = 1, pageSize = 20) =>
  api.get('/admin/enquiries', { params: { page, pageSize } }).then(envelope);
export const fetchEnquiry = (id) => api.get(`/admin/enquiries/${id}`).then(envelope);
export const setEnquiryRead = (id, isRead) => api.patch(`/admin/enquiries/${id}`, { isRead }).then(payload);
export const deleteEnquiry = (id) => api.delete(`/admin/enquiries/${id}`);

// Attachments are streamed by the API behind the session cookie; a plain link downloads them.
export const attachmentUrl = (enquiryId, fileId) => `/api/admin/enquiries/${enquiryId}/files/${fileId}`;
