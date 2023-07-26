import API from './index'

//{addOn : {}, date : Date, details : String, images : File[], milestonEnum: MilestoneType}
export const createMilestone = (formData, orderId) => API.post(`/api/v1/orders/${orderId}/createMilestone`, formData);

//{milestone : milestone}
export const editMilestone = (formData) => API.put('/api/v1/milestone/update',formData);

export const retrieveMilestones = (orderId,token) => API.get(`/api/v1/orders/${orderId}/milestones?token=${token}`)

export const approveFinalProduct = (orderId, formData) => API.put(`/api/v1/orders/${orderId}/approveFinalProduct`, formData,{headers : {'Content-Type': 'application/json; charset=utf-8'}});

export const rejectFinalProduct = (orderId, formData) => API.put(`/api/v1/orders/${orderId}/rejectFinalProduct`, formData,{headers : {'Content-Type': 'application/json; charset=utf-8'}});