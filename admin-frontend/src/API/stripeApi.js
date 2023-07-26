import API from './index'

export const createPaymentIntent = (formData) => API.post(`/api/v1/checkout/payment-intent`,formData);

export const createSetupIntent = () => API.post(`/api/v1/checkout/setup-intent`); 

export const saveCard = (id) => API.post(`/api/v1/checkout/saveCard/${id}`); 

export const removeCard = (id) => API.post(`/api/v1/checkout/removeCard/${id}`); 

export const getCards = () => API.post('/api/v1/checkout/getCards');

export const placeOrder = (offerId) => API.post(`/api/v1/checkout/purchase/${offerId}`)

export const placeOrderMPL = (offerId) => API.post(`/api/v1/checkout/purchaseMpl/${offerId}`)

export const placeOrderAO = (orderId, offerId) => API.post(`/api/v1/checkout/orders/${orderId}/purchaseAddOn/${offerId}`);