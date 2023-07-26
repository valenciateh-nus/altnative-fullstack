import API from './index'

export const retrieveAllDisputes = (statuses) => API.get(`/api/v1/disputes`);

export const searchPendingDisputes = (statuses) => API.get(`/api/v1/pendingDisputes?statuses=${statuses}`);

export const retrieveDisputesForOrder = (orderId) => API.get(`/api/v1/orders/${orderId}/disputes`);

export const retrieveDisputeByDisputeId = (id) => API.get(`/api/v1/disputes/${id}`)

export const retrieveListOfDisputesByUserId = (userId) => API.get(`/api/v1/disputes/user/${userId}`);

export const endDispute = (id) => API.post(`/api/v1/disputes/${id}/end`);

export const acceptDispute = (id) => API.post(`/api/v1/disputes/${id}/accept`); 

export const rejectDispute = (id,formData) => API.post(`/api/v1/disputes/${id}/reject`, formData, {headers : {'Content-Type': 'application/json; charset=utf-8'}}); 