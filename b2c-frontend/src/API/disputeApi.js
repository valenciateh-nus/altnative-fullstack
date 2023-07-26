import API from './index'

export const createDispute = (orderId, formData) => API.post(`/api/v1/orders/${orderId}/disputes`, formData)

export const retrieveDisputeById = (disputeId) => API.get(`/api/v1/disputes/${disputeId}`)

export const retrieveDisputesByUserId = (userId) => API.get(`/api/v1/disputes/user/${userId}`)

export const retrieveDisputeByStatus = (status) => API.get(`/api/v1/pendingDisputes/?statuses=${status}`)

export const deleteDisputeById = (id) => API.delete(`/api/v1/dispute/${id}`)

export const acceptDispute= (disputeId) => API.post(`/api/v1/disputes/${disputeId}/accept`)

export const rejectDispute= (disputeId, remarks) => API.post(`/api/v1/disputes/${disputeId}/reject?rejectRemarks=${remarks}`)

export const refundOrder = (disputeId) => API.post(`/api/v1/checkout/refund/process/${disputeId}`)
