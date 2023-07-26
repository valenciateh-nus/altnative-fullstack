import API from './index'

export const getOrders = () => API.get('/api/v1/myRefashionerOrders/search');

export const getProjectByOrderId = (id) => API.get(`/api/v1/orders/${id}/project`);

export const getMarketplaceByOrderId = (id) => API.get(`/api/v1/orders/${id}/marketplaceListings`);

export const getRequestOffers = () => API.get('/api/v1/myOffers/search');

export const getRequestOffersByKeyword = (keyword) => API.get(`/api/v1/myOffers/search/?keyword=${keyword}`);

export const getRequestOffersByStatus= (status) => API.get(`/api/v1/myOffers/search/?statuses=${status}`);

export const getRefashioneeOrders = () => API.get('/api/v1/myRefashioneeOrders/search');

export const getRefashioneeOrdersByStatus = (status) => API.get(`/api/v1/myRefashioneeOrders/search/?status=${status}`);

export const getRefashioneeOrdersByKeyword = (keyword) => API.get(`/api/v1/myRefashioneeOrders/search/?keyword=${keyword}`);

export const getOrderById = (id) => API.get(`/api/v1/orders/${id}`);