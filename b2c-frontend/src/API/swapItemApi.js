import API, { apiWrapper } from './index'

export const createSwapItem = (cId, formData) => API.post(`/api/v1/swapItem/category/${cId}`, formData);

export const retrieveSwapItems = () => API.get(`/api/v1/swapItems`);

export const retrieveSwapItemById = (itemId) => API.get(`/api/v1/swapItem/${itemId}`);