import React, { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';
import { storeNotiToken } from "../../Redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client'
import { getAllUserChats } from '../../API';
import {setUnreadCount} from '../../Redux/actions';


export var stompClient = null;
export default function Notification() {
  const[selectedTopic, setSelectedTopic] = React.useState({});

  const currentNotificationToken = useSelector((state) => state.notificationToken);
  const token = useSelector((state) => state.token);
  const currUser = useSelector((state) => state.authData);
  const dispatch = useDispatch();
  const location = useLocation();
  const unreadMessages = useSelector((state) => state.unreadCount);
  const [newMessage, setNewMessage] = React.useState({});

  const notifRef = useRef();
  notifRef.current = currentNotificationToken;
  const userfRef = useRef();
  userfRef.current = currUser?.sub;
  const locationRef = useRef();
  locationRef.current = location;
  
  const [isTokenFound, setTokenFound] = useState(false);  

  React.useEffect(() => {
    if(newMessage?.chatId) {
      console.log("RUNNINGGGG");
      let newCount = unreadMessages || 0;
      console.log("CALLED, UNREAD COUNT: ", unreadMessages);
      if(newMessage.sender !== currUser.sub && !location.pathname.includes(newMessage.chatId) && newMessage.receiver === currUser.sub) {
        console.log("LOCATION: " + location.pathname);
        dispatch(setUnreadCount(newCount+1));
        
      }
      setNewMessage({})
    }
  },[location.pathname,unreadMessages,newMessage])

  React.useEffect(() => {
    console.log("RUNNING ONCE2");
    let data;
    async function tokenFunc() {
      data = dispatch(storeNotiToken(setTokenFound));
      if (data) {
        console.log("Token is", data);
      }
      return data;
    }
    if(currUser?.sub) {
      registerUser();
      tokenFunc();
      getInitialUnreadMessagesCount();
    }
  },[JSON.stringify(currUser)])   

  const registerUser = async () => {
    let Sock = new SockJS(process.env.REACT_APP_BACKEND_URL +'/ws');
    stompClient= Stomp.over(Sock);
    stompClient.connect({'X-Authorization' : 'Bearer ' + token}, onConnected, onError);
  }
  
  const onConnected = () => {
    console.log("CONNECTED");
    stompClient.subscribe('/chat/messages/notification/' + currUser.sub, onMessageReceived);
  }

  async function getInitialUnreadMessagesCount() {
    console.log("UNREAD MESSAGES");
    let unread = 0;
    const chats = await getAllUserChats().then((val) => {
      console.log("start");
      for (const c in val.data) {
        const chat = val.data[c];
        if (chat.user1.username === currUser.sub) {
          unread = unread + chat.user1UnreadCount;
          console.log("UNREAD MESSAGES", chat.user1UnreadCount);
        } else if (chat.user2.username === currUser.sub) {
          unread = unread + chat.user2UnreadCount;
          console.log("UNREAD MESSAGES", chat.user2UnreadCount);
        }
      }
      console.log("done")
      // alert("UNREAD: ", unread);
      // alert("UNREAD STATE: ", unreadMessages);
    });
    console.log("dispatch")
    dispatch(setUnreadCount(unread));
  }

  // async function getUnreadMessagesCount() {
  //   console.log("UNREAD MESSAGES");
  //   let unread = unreadMessages;
  //   const chats = await getAllUserChats().then((val) => {
  //     console.log(val.data);
  //     for (const c in val.data) {
  //       const chat = val.data[c];
  //       if (chat.user1.username === currUser.sub) {
  //         unread = unread + chat.user1UnreadCount;
  //         console.log("UNREAD MESSAGES", chat.user1UnreadCount);
  //       } else if (chat.user2.username === currUser.sub) {
  //         unread = unread + chat.user2UnreadCount;
  //         console.log("UNREAD MESSAGES", chat.user2UnreadCount);
  //       }
  //     }
  //     dispatch(setUnreadCount(unread));
  //   });
  // }
  
  
  const onMessageReceived = async (payload) => {
    //message : {message : String , sender : User, images : List<Image>, isOffer : boolean, chatId : String}, topic : {...}
    //console.log("RECEIVED MESSAGE: " + payload.body);
    let message = JSON.parse(payload.body);
    // getUnreadMessagesCount();
    setNewMessage(message);
    //if (message.receiver == userfRef.current && !locationRef.current.pathname.includes('chat')) {
    //   try {
    //     await userApi.getUserByUsername(message.sender).then((val) => {
    //       if (!message.offer) {
    //         notificationApi.sendTargetedNotification({ target: notifRef.current, title: val.data.name, message: message.message });
    //       } else {
    //         notificationApi.sendTargetedNotification({ target: notifRef.current, title: val.data.name, message: "has sent you an offer." });
    //       }
    //   })
    // } catch (error) {
    // }
  //}
}

  const onError = (err) => {
    console.log('ERROR: ' + err);
  }

  return <></>;
  };
