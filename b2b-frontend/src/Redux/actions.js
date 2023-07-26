import { AUTH, ERROR, ADD, REMOVE, OPEN_IMAGE_MODAL, CLOSE_IMAGE_MODAL, LOGOUT, SET_IMAGE_INDEX, SET_USER_PROFILE, TOGGLE_BOTTOM_NAV_BAR, TOGGLE_VIEW, FEEDBACK, JNT_AUTH, GET_CHAT_NOTIFICATIONS, NOTI } from "./actionTypes.js";

import * as api from '../API/index.js';
import * as jntApi from '../API/jntApi';
import { decodeToken } from "react-jwt";
import { getToken } from '../Firebase';
import { MARKET_VIEW, REFASHIONEE_VIEW, REFASHIONER_VIEW } from "../constants.js";

export const signIn = (formData, router) => async (dispatch) => {
    try {
        console.log("SIGNINACTION: ", formData)
        const { data } = await api.signIn(formData);
        console.log("ACCESS_TOKEN: " + JSON.stringify(data.access_token));
        const authData = decodeToken(data.access_token);
        data.authData = authData;
        if(!data.authData.roles.includes("USER_BUSINESS")) {
            console.log("INVALID ACCESS");
            return dispatch({type : ERROR, data: "Unauthorized access"});
            
        }
        dispatch({type : AUTH, data});

        router("/home");
    } catch (error) {
        console.log("ERROR MSG: " + error.message);
        console.log("ERROR RESP: " + JSON.stringify(error.response))
        dispatch({type : ERROR, data : "Invalid username or password."})
    }
}

export const signInJnt = () => async (dispatch) => {
    try {
        const {data} = await jntApi.signIn();   
        console.log("JNT TOKEN: ", JSON.stringify(data));     
        dispatch({type : JNT_AUTH, data});
    } catch (error) {
        console.log("ERROR MSG: " + error.message);
        console.log("ERROR RESP: " + JSON.stringify(error.response))
        dispatch({type : ERROR, data : "JNT LOGIN FAIL"})
    }
}

export const signInWithJWT = (token, router) => async (dispatch) => {
    const data = decodeToken(token);
    dispatch({type: AUTH, data})
    router("/");
}

export const signUp = (formData) => async (dispatch) => {
    try {
        console.log("SIGNINACTION: ", formData)
        const signUpRes = await api.signUp(formData);
        if(signUpRes) {
            console.log("DATA: " + JSON.stringify(signUpRes.data));
            const { data } = await api.signIn({username: formData.username, password : formData.password});
            console.log("ACCESS_TOKEN: " + JSON.stringify(data.access_token));
            data.authData = decodeToken(data.access_token)
            dispatch({type : AUTH, data});
            return data;
        }
        //router("/login");
        return null;
    } catch (error) {
        console.log(error);
        //const data = error?.response?.data?.message
        //console.log("ERROR MSG: " + data != null ? data : error);
        dispatch({type : ERROR, data : "Error occured while signing up: " + error.response?.data ? error.response.data : error.message})
    }
}

export const refreshToken = () => async (dispatch) => {
    const { data } = await api.refreshToken();
    console.log("REFRESHING TOKEN: " + JSON.stringify(data.access_token));
    data.authData = decodeToken(data.access_token)
    dispatch({type : AUTH, data});
}

export const storeNotiToken = (setTokenFound) => async (dispatch) => {
    // alert("here");
    const data = await getToken(setTokenFound);
    // alert(data);
    console.log("NOTIFICATION TOKEN: " + JSON.stringify(data));
    dispatch({type : NOTI, data});
}

// export const storeSubObj = (subObj) => async (dispatch) => {
//     // alert(data);
//     console.log("SUB OBJ: " + JSON.stringify(subObj));
//     dispatch({type : SUB_OBJ, data: subObj});
// }

export const logout = () => dispatch => {
    dispatch({type: LOGOUT});
}

export const openImageModal = (images, index) => (dispatch) => {
    let data = {
        images : images,
        index : index,
    }
    //console.log(JSON.stringify(data));
    dispatch({type: OPEN_IMAGE_MODAL, data});
    
};

export const closeImageModal = () => (dispatch) => {
    dispatch({type: CLOSE_IMAGE_MODAL});
}

export const setImageIndex = (index) => (dispatch) => {
    let data = {
        index : index
    }
    dispatch({type: SET_IMAGE_INDEX, data});
}

export const createRequest = (formData, router) => async (dispatch) => {
    console.log(formData);
}

export const getUserProfile = (username) => async (dispatch) => {
    try {
        const { data } = await api.getUserByUsername(username);
        console.log("DATA: " + JSON.stringify(data));
        dispatch({type : SET_USER_PROFILE, data});
    } catch (error) {
        console.log(error);
        dispatch(logout());
        dispatch({type : ERROR, data: "Error fetching own profile: " + error.message});
        //dispatch(logout());
        //const data = error?.response?.data?.message
        //console.log("ERROR MSG: " + data != null ? data : error);
        //dispatch({type : ERROR, data: "Error fetching own profile: " + error.message})
    }
}

export const toggleView = (view) => (dispatch) => {
    if(view === REFASHIONEE_VIEW || view === REFASHIONER_VIEW || view === MARKET_VIEW ) {
        dispatch({type: TOGGLE_VIEW, data: view})
    }
}

export const toggleBottomNavBar = (toggle) => (dispatch) => {
    dispatch({type: TOGGLE_BOTTOM_NAV_BAR, data : toggle});
}

export const showFeedback = (feedback) => (dispatch) => {
    console.log("FEEDBACK ACTION: ", feedback);
    dispatch({type: FEEDBACK, data : feedback});
}

export const setUnreadCount = (unreadCount = 0) => (dispatch) => {
    console.log("UNREAD MESSAGE COUNT: ", unreadCount);
    if(unreadCount < 0) {
        unreadCount = 0;
    }
    dispatch({type: GET_CHAT_NOTIFICATIONS, data : unreadCount});
}
