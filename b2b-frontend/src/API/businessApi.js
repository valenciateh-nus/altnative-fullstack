import API from './index'

export const editWebsite = (website) => API.put(`/api/v1/business/website`, website, {headers : {'Content-Type': 'application/json; charset=utf-8'}})

export const editDescription = (desc) => API.put(`/api/v1/business/description`, desc, {headers : {'Content-Type': 'application/json; charset=utf-8'}})

