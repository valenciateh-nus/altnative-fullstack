import API from './index'

export const createDelivery = (orderId, formData) => API.post(`/api/v1/orders/${orderId}/createDelivery`, formData)

export const updateDelivery = (formData) => API.put(`/api/v1/delivery/update`, formData)

export const retrieveDeliveryById = (id) => API.get(`/api/v1/delivery/${id}`);

export const createJNTDelivery = (token,deliveryId) => API.post(`/api/v1/delivery/createJNTDelivery?token=${token}&deliveryId=${deliveryId}`);

export const createOfferForDelivery = (deliveryId) => API.post(`/api/v1/order/delivery/${deliveryId}`)

export const placeDeliveryOrder = (deliveryId, token) => API.post(`/api/v1/checkout/payForDelivery/${deliveryId}?token=${token}`)