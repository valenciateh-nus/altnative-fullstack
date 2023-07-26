import API from './index'

export const createAddOnForOrder = (orderId,formData) => API.post(`/api/v1/orders/${orderId}/addOn`,formData)
export const createOfferForAddOn = (orderId, formData) => API.post(`/api/v1/order/${orderId}/addOnOffer`,formData)
export const rejectAddOnOffer = (orderId, addOnOfferId, formData) => API.post(`/api/v1/orders/${orderId}/addOn/${addOnOfferId}/reject`,formData,{headers : {'Content-Type': 'application/json; charset=utf-8'}})

 