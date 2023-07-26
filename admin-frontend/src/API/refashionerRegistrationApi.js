import API from './index'

export const retrieveAllRefashionerRegistrationRequests = () => API.get(`/api/v1/refashionerRegistrationRequests`);

export const retrieveRefashionerRegistrationRequestById = (id) => API.get(`/api/v1/refashionerRegistrationRequests/${id}`);

export const retrieveRefashionerRegistrationRequestsByUserId = (userId) => API.get(`/api/v1/refashionerRegistrationRequest/user/${userId}`)

export const approveRefashionerRegistrationRequest = (id) => API.put(`/api/v1/refashionerRegistrationRequest/${id}/approve`)

export const approveRefashionerRegistrationRequestWithCertifications = (id, formData) => API.post(`/api/v1/refashionerRegistrationRequestWithCertifications/${id}/approve`,formData)

export const rejectRefashionerRegistrationRequest = (id) => API.post(`/api/v1/refashionerRegistrationRequest/${id}/reject`)