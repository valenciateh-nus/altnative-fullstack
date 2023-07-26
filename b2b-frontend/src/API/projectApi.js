import API from './index'

export const createProjectRequest = (formData) => API.post(`/api/v1/projectRequests`,formData)

export const createProjectRequestAsDraft = (formData) =>  API.post(`/api/v1/projectRequests/draft`,formData)

export const retrieveProjectRequestById = (reqId) => API.get(`/api/v1/projectRequests/${reqId}`)

export const editProjectRequestInDraft = (formData) => API.put(`/api/v1/projectRequest/edit`, formData)

export const submitProjectRequestInDraft = (reqId) => API.post(`/api/v1/projectRequest/${reqId}/submit`)

export const updateProjectRequest = (formData) => API.post(`/api/v1/projectRequest/update`, formData)

export const createProjectListing = (cId,formData) => API.post(`/api/v1/categories/${cId}/projectListing`,formData)

export const retrieveProjectListingById = (listId) => API.get(`/api/v1/projectListing/${listId}`)

export const updateProjectListing = (formData) => API.get(`/api/v1/projectListing`, formData)

export const getAllRequestBySearch = (keyword) => API.get(`/api/v1/projectRequests/search/?keyword=${keyword}`);

export const getAllRequests = () => API.get('/api/v1/projectRequests/search');

export const getAllRequestByCategory = (cId) => API.get(`/api/v1/projectRequests/search/?cIds=${cId}`);

