import axios from 'axios';
import { isExpired } from 'react-jwt';
import { logout } from '../Redux/actions';
import { ERROR } from '../Redux/actionTypes';
import { store } from '../Redux/store';

const API = axios.create({baseURL: process.env.REACT_APP_BACKEND_URL});
API.interceptors.request.use((req) => {
    console.log('Starting Request', JSON.stringify(req, null, 2))
    const state = store.getState();
    if(state.token != null) {
        if(isExpired(state.token)) {
            store.dispatch(logout());
            console.log("token expired")
        }
        req.headers.Authorization = `Bearer ${state.token}`;
    } else {
        console.log("INTERCEPTOR, NO TOKEN");
    }
    return req;
})

API.interceptors.response.use((res) => {
    console.log('Response:', JSON.stringify(res, null, 2))
    return res
})

export default API;

//{username : string, password : string}
export const signIn = (formData) => API.post('/login', formData);
//{username : string, password : string, firstName : string, lastName : string}
export const signUp = (formData) => API.post('/api/v1/register', formData);

export const createRequest = (formData, cId) => API.post(`/api/v1/publishProjectRequests?cId=${cId}`, formData);

export const submitRequest = (formData, pId) => API.post(`/api/v1/publishProjectRequests?pId=${pId}`, formData);

export const createDraftRequest = (cId, formData) => API.post(`/api/v1/saveProjectRequests?cId=${cId}`, formData);

export const updateDraftRequest = (pId, formData) => API.post(`/api/v1/saveProjectRequests?pId=${pId}`, formData);

export const addImageToRequest = (projectRequestId, files) => API.post(`/api/v1/projectRequest/${projectRequestId}`, files);

export const deleteImageFromRequest = (projectRequestId, imageId) => API.post(`/api/v1/projectRequest/${projectRequestId}/image/${imageId}`);

export const getCategory = () => API.get('/api/v1/categories');

export const getUserByUsername = (username) => API.get(`/api/v1/users/${username}`);

export const getAllUserChats = () => API.get('/api/v1/getAllChats');

export const uploadImage = (formData) => API.post('/images/upload', formData, {headers : {"Content-Type" : "multipart/form-data"}});

export const uploadImageToProjectRequest = (pId, formData) => API.post(`/projectRequest/${pId}`, formData, {headers : {"Content-Type" : "multipart/form-data"}});

export const createEcommListing = (formData) => API.post(`/api/v1/marketplaceListing`, formData);

export const getRequests = () => API.get('/api/v1/myProjectRequests/search');

export const getRequestsByStatus = (status) => API.get(`/api/v1/myProjectRequests/search?statuses=${status}`);

export const getRequestsByCategory = (cId) => API.get(`/api/v1/projectRequests/search?cId=${cId}`);

export const getRequestsByKeyword = (keyword) => API.get(`/api/v1/myProjectRequests/search?keyword=${keyword}`);

export const getAllRequests = () => API.get('/api/v1/projectRequests/search');

export const getRequestsById = (id) => API.get(`/api/v1/projectRequests/${id}`);

export const deleteRequestById = (id) => API.delete(`/api/v1/projectRequests/delete/${id}`);

export const updateProjectRequest = (formData, id) => API.post(`/api/v1/projectRequests/${id}`, formData);

export const getListingsByCategoryAndKeyword = (cId, keyword) => API.get(`/api/v1/projectListings/search2/?cIds=${cId}&keyword=${keyword}`)

export const getListingsByCategory = (cId) => API.get(`/api/v1/projectListings/search2/?cIds=${cId}`)

export const getListingsByKeyword = (keyword) => API.get(`/api/v1/projectListings/search2/?keyword=${keyword}`)

export const getAllListings = () => API.get(`/api/v1/projectListings/search2`)

export const getCategoryById = (cId) => API.get(`/api/v1/categories/${cId}`)

export const getCategoryByName = (cId) => API.get(`/api/v1/categories/${cId}`)

export const createRefashionerRegistrationRequest = (formData) => API.post(`/api/v1/refashionerRegistrationRequest`, formData);

export const getAllRequestBySearch = (keyword) => API.get(`/api/v1/projectRequests/search?keyword=${keyword}`);

export const refreshToken = () => API.get('/api/v1/token/refresh');

export async function apiWrapper(apiCall, errMessage = "", dispatchError) {
    try {
        return await apiCall;
    } catch (error) {
        const data = error?.response?.data?.message
        console.log("ERROR MSG: " + JSON.stringify(error));
        console.log("ERROR DATA: " + JSON.stringify(error.response));
        if(dispatchError) {
            store.dispatch({type : ERROR, data: (errMessage + (errMessage && ", ") + (typeof error?.response.data === 'string' ? error.response.data : "Unknown error occured."))})
        }
    }
    return null;
}