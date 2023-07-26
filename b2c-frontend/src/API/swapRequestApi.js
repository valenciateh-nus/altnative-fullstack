import API, { apiWrapper } from './index'

export const createSwapRequests = (cId, formData) => API.post(`/api/v1/swapRequest/category/${cId}`, formData);

export const retrieveOwnSwapRequests = () => API.get(`/api/v1/ownSwapRequests`);

export const retrieveSwapRequestById = (swapRequestId) => API.get(`api/v1/swapRequest/${swapRequestId}`);

export const followUpRejectedItem = (swapRequestId, followUpStatus) => API.post(`/api/v1/swapRequest/${swapRequestId}/followUp`, followUpStatus, {headers : {'Content-Type': 'application/json; charset=utf-8'}} );

export const updateFollowUpStatusToComplete = (swapRequestId) => API.post(`api/v1/swapRequest/${swapRequestId}/complete`);