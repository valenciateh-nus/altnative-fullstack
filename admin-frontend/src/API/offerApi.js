import API from './index'

export const createOfferForListing = (listId,formData) => API.post(`/api/v1/projectListings/${listId}/offers`,formData)

export const createOfferForRequest = (reqId,formData) => API.post(`/api/v1/projectRequests/${reqId}/offers`,formData)

export const createOfferForMPL = (mktId, formData) => API.post(`/api/v1/marketplaceListing/${mktId}/makeOffer`, formData)


export const retrieveOfferByListId = (listId) => API.get(`/api/v1/projectListings/${listId}/offers`)

export const retrieveOfferByReqId = (id) => API.get(`/api/v1/projectRequests/${id}/offers`)

export const retrieveOfferById = (id) => API.get(`/api/v1/offers/${id}`);



export const acceptOfferForListing = (listId) => API.post(`/api/v1/offers/${listId}/accept`)

export const rejectOffer = (listId, formData) => API.post(`/api/v1/offers/${listId}/reject`,formData,{headers : {'Content-Type': 'application/json; charset=utf-8'}})


