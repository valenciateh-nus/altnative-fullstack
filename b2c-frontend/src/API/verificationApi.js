import API from './index'


export const getNewToken = (userId) => API.put(`/api/v1/token/getNewToken?userId=${userId}`);

export const verifyUserToken = (token) => API.get(`/api/v1/token/confirm?token=${token}`);