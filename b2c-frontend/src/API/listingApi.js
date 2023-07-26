import API from './index'

export const getListingsByCategoryAndKeyword = (cId, keyword) => API.get(`/api/v1/projectListings/search/?cIds=${cId}&keyword=${keyword}`)

export const getListingsByKeyword = (keyword) => API.get(`/api/v1/projectListings/search/?keyword=${keyword}`)

export const getListingsByCategory = (cId) => API.get(`/api/v1/projectListings/search/?cIds=${cId}`)

export const getAllListings = () => API.get(`/api/v1/projectListings/search`);

export const getRefashionerListingsByKeyword = (username, keyword) => API.get(`/api/v1/projectListings/username/${username}/?keyword=${keyword}`);