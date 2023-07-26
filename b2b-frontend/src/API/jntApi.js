import axios from 'axios';
import { isExpired } from 'react-jwt';
import { signInJnt } from '../Redux/actions';
import { store } from '../Redux/store';

const API = axios.create({baseURL: 'https://cryptic-waters-99211.herokuapp.com/http://uat-jts.jtexpress.sg/jts-service-doorstep'});
const loginToken = btoa(process.env.REACT_APP_JNT);
API.interceptors.request.use((req) => {
    console.log('Starting Request', JSON.stringify(req, null, 2))
    const state = store.getState();
    if(req.url.includes('login')) {
        return req;
    }
    if(state.jntToken != null) {
        if(isExpired(state.jntToken)) {
            store.dispatch(signInJnt());
            console.log("token expired")
        } else {
            req.headers.Authorization = `JWT ${state.jntToken}`;
        }
        
    } else {
        console.log("INTERCEPTOR, NO TOKEN");
    }

    return req;
})

export const signIn = () => API.post('/api/gateway/v1/auth/login',null, {headers : {'Authorization' : `Basic ${loginToken}`}});

export const getStatus = (id) => API.post(`/api/gateway/v1/track/${id}`);

export const getQuotation = (formData) => API.get(`/api/gateway/v1/services/price`, formData);

export const getConnote = (id) => API.get(`/api/gateway/v1/deliveries/connote/${id}/a6`);



