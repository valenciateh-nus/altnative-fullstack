import API from './index'

export const createMarketplaceListing = (formData, cId) => API.post(`/api/v1/publishMarketplaceListings/?cId=${cId}`, formData);

export const createMarketplaceDraft = (formData, cId) => API.post(`/api/v1/saveMarketplaceListings/?cId=${cId}`, formData);

export const getMarketplaceListings = () => API.get('/api/v1/marketplaceListings/search');

export const getMarketplaceListingsByKeyword = (keyword) => API.get(`/api/v1/marketplaceListings/search/?keyword=${keyword}`);

export const getFilteredMarketplaceListings = (deadstock) => API.get(`/api/v1/marketplaceListings/search/?isDeadstock=${deadstock}`);

export const getFilteredMarketplaceListingsByKeyword = (deadstock, keyword) => API.get(`/api/v1/marketplaceListings/search/?isDeadstock=${deadstock}&keyword=${keyword}`);

export const getOwnMarketplaceListings = () => API.get('/api/v1/myMarketplaceListings/search');

export const getOwnMarketplaceListingsByCategory = (cId) => API.get(`/api/v1/myMarketplaceListings/search/?cId=${cId}`);

export const getOwnMarketplaceListingsByKeyword = (keyword) => API.get(`/api/v1/myMarketplaceListings/search/?keyword=${keyword}`);

export const getMarketplaceListingById = (id) =>  API.get(`/api/v1/marketplaceListings/${id}`);

export const deleteListingById = (id) =>  API.delete(`/api/v1/marketplaceListing/deleteById/${id}`);

export const submitDraft = (formData, mId) => API.post(`/api/v1/publishMarketplaceListings?mId=${mId}`, formData);

export const getDrafts = () => API.get('/api/v1/marketplaceListings/drafts');

export const getPublished = () => API.get('/api/v1/marketplaceListings/published');

export const updateMarketplaceListing = (mId, formData) => API.post(`/api/v1/marketplaceListing/${mId}/update`, formData);

export const updateMarketplaceListingDraft = (formData, mId) => API.post(`/api/v1/saveMarketplaceListings/?mId=${mId}`, formData);

export const addImageToListing = (imageData, mId) => API.post(`/api/v1/marketplaceListing/${mId}`, imageData);

export const deleteImageFromListing = (iId, mId) => API.post(`/api/v1/marketplaceListing/${mId}/image/${iId}`);

export const getMarketplaceOrders = () => API.get('api/v1/myMplOrders/search');

export const getMarketplaceOrdersByKeyword = (keyword) => API.get(`api/v1/myMplOrders/search/?keyword=${keyword}`);

export const getMPLFromOrderId = (orderId) => API.get(`/api/v1/orders/${orderId}/marketplaceListings`);

export const getFavorite = () => API.get('/api/v1/marketplaceListing/favourites');

export const addFavorite = (mId) => API.post(`/api/v1/marketplaceListing/favourite/${mId}`);

export const removeFavorite = (mId) => API.post(`/api/v1/marketplaceListing/unfavourite/${mId}`);

export const getMPLFromUsername = (username) => API.get(`/api/v1/marketplaceListings/user/${username}`)

export const getPublishedMPLFromUsername = (username) => API.get(`/api/v1/marketplaceListings/username/${username}`)

export const getPublishedMPLByKeyword = (username, keyword) => API.get(`/api/v1/marketplaceListings/username/${username}/?keyword=${keyword}`)
