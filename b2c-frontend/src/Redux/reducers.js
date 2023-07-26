import { AUTH, LOGOUT, ERROR, OPEN_IMAGE_MODAL, CLOSE_IMAGE_MODAL, SET_IMAGE_INDEX, SET_USER_PROFILE, TOGGLE_BOTTOM_NAV_BAR, TOGGLE_VIEW, FEEDBACK, JNT_AUTH, GET_CHAT_NOTIFICATIONS, NOTI, SUB_OBJ} from "./actionTypes";
import {REFASHIONEE_VIEW} from "../constants";

const INITAL_STATE = {
    showBottomNavBar : true,
    authData : null,
    refresh_token : null,
    selectedImageSet : [],
    selectedImageIndex : 0,
    isViewerOpen : false,
    token : null,
    view : REFASHIONEE_VIEW,
    notificationToken : null,
    jntToken : null,
    unreadCount : 0,
}

export default function reducers(state = INITAL_STATE, {type, data}) {
    switch(type) {
        case AUTH:
            return {...state, authData : data.authData, token : data.access_token, refresh_token: data.refresh_token, error : null, view : REFASHIONEE_VIEW};
        case JNT_AUTH:
            return {...state, jntToken : data.token}
        case LOGOUT:
            return {authData : null, token : null, refresh_token : null, error : null, notificationToken : null};
        case ERROR:
            return {...state, error : data};
        case OPEN_IMAGE_MODAL:
            return {...state, selectedImageSet: data.images? data.images : [], selectedImageIndex: data.index ? data.index : 0, isViewerOpen: true };
        case SET_IMAGE_INDEX:
            return {...state, selectedImageIndex : data.index}
        case CLOSE_IMAGE_MODAL:
            return {...state, selectedImageSet: [], selectedImageIndex: 0, isViewerOpen: false};
        case SET_USER_PROFILE:
            return {...state, currUserData: data};
        case TOGGLE_BOTTOM_NAV_BAR:
            return {...state, showBottomNavBar : data};
        case TOGGLE_VIEW:
            return {...state, view : data}
        case FEEDBACK:
            return {...state, feedback : data}
        case NOTI:
            return {...state, notificationToken: data}
        case GET_CHAT_NOTIFICATIONS:
            return {...state, unreadCount : data}
        default:
            return state;
    }
}