import API, { apiWrapper } from './index'

export const saveTopRefashioners = (formData) => API.post(`api/v1/save/topRefashioners`, formData);
export const saveTopSearches = (formData) => API.post(`api/v1/save/topSearches`, formData);

export const retrieveTopRefashioners = () => API.get(`/api/v1/topRefashioners`);
export const retrieveTopSearches = () => API.get(`/api/v1/topSearches`);

export const retrieveRefunds = (formData) => API.post(`api/v1/refunds`, formData, {headers : {'Content-Type': 'application/json; charset=utf-8'} });
export const retrieveNetRevenue = (formData) => API.post(`api/v1/revenue`, formData, {headers : {'Content-Type': 'application/json; charset=utf-8'} });