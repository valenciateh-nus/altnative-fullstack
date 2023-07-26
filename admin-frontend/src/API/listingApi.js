import API from './index'

export const getListingsByCategoryAndKeyword = (cId, keyword) => API.get(`/api/v1/projectListings/search?cIds=${cId}&keyword=${keyword}`)

export const getListingsByKeyword = (keyword) => API.get(`/api/v1/projectListings/search?keyword=${keyword}`)

export const getListingsByCategory = (cId) => API.get(`/api/v1/projectListings/search?cIds=${cId}`)

export const getAllProjectListingsBySearchAvailableOnly = (cIds,keyword) => API.get(`/api/v1/projectListings/search?${cIds.length > 0 ? `cIds=${cIds}&` : ''}${keyword.length > 0 ? `keyword=${keyword}` : ''}`)

export const getAllProjectRequestBySearchAvailableOnly = (cIds,keyword) => API.get(`/api/v1/projectRequests/search?${cIds.length > 0 ? `cIds=${cIds}&` : ''}${keyword.length > 0 ? `keyword=${keyword}` : ''}`);

export const getMarketplaceListingsBySearchAvailableOnly = (cIds,keyword) => API.get(`/api/v1/marketplaceListings/search?${cIds.length > 0 ? `cIds=${cIds}&` : ''}${keyword.length > 0 ? `keyword=${keyword}` : ''}`);

export const getAllProjectListingsBySearch = (cIds,keyword) => API.get(`/api/v1/allProjectListings/search?${cIds.length > 0 ? `cIds=${cIds}&` : ''}${keyword.length > 0 ? `keyword=${keyword}` : ''}`)

export const getAllProjectRequestBySearch = (cIds,keyword) => API.get(`/api/v1/allProjectRequests/search?${cIds.length > 0 ? `cIds=${cIds}&` : ''}${keyword.length > 0 ? `keyword=${keyword}` : ''}`);

export const getMarketplaceListingsBySearch = (cIds,keyword) => API.get(`/api/v1/allMarketplaceListings/search?${cIds.length > 0 ? `cIds=${cIds}&` : ''}${keyword.length > 0 ? `keyword=${keyword}` : ''}`);


export const getCategories = () => API.get('/api/v1/categories');

export const getAllProjectRequestsByUsername = (username) => API.get(`/api/v1/projectRequests/refashionee/${username}`);



