import API from './index'

export const retrieveListOfSwapRequests = () => API.get(`/api/v1/swapRequests`);

export const retrieveSwapRequestById = (swapRequestId) => API.get(`api/v1/swapRequest/${swapRequestId}`);

export const approveSwapRequest = (swapRequestId, creditsAwarded) => API.post(`/api/v1/swapRequest/${swapRequestId}/approved/credits/${creditsAwarded}`);

export const rejectSwapRequest = (swapRequestId, remarks) => API.post(`/api/v1/swapRequest/${swapRequestId}/rejected?remarks=${remarks}`);

export const rejectSwapRequestWithCredits = (swapRequestId, remarks, creditsAwarded) => API.post(`/api/v1/swapRequest/${swapRequestId}/rejected/credits/${creditsAwarded}?remarks=${remarks}`);

export const deleteSwapRequest = (swapRequestId) => API.delete(`/api/v1/swapRequest/${swapRequestId}`);

export const followUpRejectedItem = (swapRequestId, followUpStatus) => API.post(`/api/v1/swapRequest/${swapRequestId}/followUp`, followUpStatus);

export const updateFollowUpStatusToComplete = (swapRequestId) => API.post(`api/v1/swapRequest/${swapRequestId}/complete`);