import React from "react";
import { Box, Button, CircularProgress, Divider, Grid, IconButton, InputAdornment, List, ListSubheader, Typography, useMediaQuery,TextField } from "@mui/material";
import { makeStyles} from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";
import ContactCard from "../Components/Chat/ContactCard";
import ChatSection from "../Components/Chat/ChatSection";
import { Navigate, useLocation, useNavigate, useParams } from "react-router";
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client'
import { getUserByUsername, getAllUserChats, apiWrapper } from "../API";
import { getUserProfile, toggleBottomNavBar, setUnreadCount } from "../Redux/actions";
import { useSearchParams } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import { retrieveProjectListingById, retrieveProjectRequestById } from "../API/projectApi";
import {ERROR} from '../Redux/actionTypes'
import { resetMessageCountOwn, resetMesageCount, getChatMessages } from '../API/chatApi';

import { deleteChat, getChat } from "../API/chatApi";
import { Chat } from "@mui/icons-material";
import moment from "moment";
import { getMarketplaceListingById } from "../API/marketplaceApi";
import InContainerLoading from "../Components/InContainerLoading";

const useStyles = makeStyles((theme) => ({
  iconContainer: {
    display : 'flex', 
    justifyContent : 'center'
  },
  root : {
    height : '100%', 
    width : '100%', 
    backgroundColor : 'transparent'
  },
}))

var stompClient = null;

export default function ChatScreen() {
  const styles = useStyles();
  const mobile = !useMediaQuery(theme => theme.breakpoints.up('md'));
  const history = useNavigate();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = React.useState("");
  const [showSearchBar, setShowSearchBar] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const dispatch = useDispatch();

  const currUser = useSelector((state) => state.authData)
  const currUserData = useSelector((state) => state.currUserData);
  const currentNotificationToken = useSelector((state) => state.notificationToken);
  const unreadMessages = useSelector((state) => state.unreadCount);

  //const[chats,setChats] = React.useState(new Map());
  const[chats,setChats] = React.useState(new Map());
  const[selectedChat, setSelectedChat] = React.useState("");
  const[otherUser, setOtherUser] = React.useState({});
  const[selectedTopic, setSelectedTopic] = React.useState({});
  const[newMessage, setNewMessage] = React.useState({});
  const[innerLoading, setInnerLoading] = React.useState(false);
  const[chatLoaded, setIsChatLoaded] = React.useState(new Map());

  const token = useSelector((state) => state.token);

  const location = useLocation();

  function handleSetSelectedChat(chat,user) {
    console.log('setting chat');
    history(`/chat/${chat.chatAlternateId}?user2=${user.username}`)
    setOtherUser(user);
    setSelectedChat(chat.chatAlternateId);
  }

  function handleOnBack() {
    setSelectedChat("");
    history(-1);
  }

  const registerUser = () => {
    let Sock = new SockJS(process.env.REACT_APP_BACKEND_URL +'/ws');
    stompClient= Stomp.over(Sock);
    stompClient.connect({'X-Authorization' : 'Bearer ' + token}, onConnected, onError);
  }

  const onConnected = () => {
    console.log("CONNECTED");
    stompClient.subscribe('/chat/messages/' + currUser.sub, onMessageReceived);
  }

  const onMessageReceived = (payload) => {
    //message : {message : String , sender : User, images : List<Image>, isOffer : boolean, chatId : String}, topic : {...}
    //console.log("RECEIVED MESSAGE: " + payload.body);
    let message = JSON.parse(payload.body);
    console.log("INCOMING MESSAGE: " + JSON.stringify(message))
    setNewMessage(message);
  }

  function sendStompMessage(payload) {
    console.log("payload: " + JSON.stringify(payload));
    setNewMessage(payload.message);
    stompClient.send("/app/messages/" + otherUser.username, {}, JSON.stringify(payload));
  }

  React.useEffect(() => {
    console.log("NEW MESSAGE")
    if(newMessage.chatId) {
      if(newMessage.forceRefresh === true) {
        handleRefresh(newMessage.chatId);
        return;
      }
      addMessage(newMessage);
    }
    setNewMessage({});
  },[newMessage.chatId])

  React.useEffect(() => {
    if(selectedChat) {
      getTopicAndSet(selectedChat);
    } else {
      setSelectedTopic({});
    }
  },[selectedChat])

  React.useEffect(() => {
    if (selectedChat) {
      loadMessages();
      resetCount();
    }
  }, [selectedChat])


  async function loadMessages() {
    
    if(!chatLoaded.has(selectedChat)) {
      setInnerLoading(true);
      
      const res = await apiWrapper(getChatMessages(selectedChat),'',true);
      if(res) {
        console.log("CHAT MESSAGES FOR CHATID: " + res.data);
        var chat = chats.get(selectedChat);
        var newMessages = res.data.concat((chat.messages || []));
        
        chat.messages = newMessages;
        chats.set(selectedChat,chat);
        chatLoaded.set(selectedChat,true);
        setChats(new Map(chats));
      }
      setTimeout(() => { 
        setInnerLoading(false);
      }, 100 );
      
    }
    
  }

  async function resetCount() {
    const chat = chats.get(selectedChat);
    if (currUserData.username === chat.user1.username) {
        console.log("UNREAD: ", unreadMessages);
        console.log("UNREAD FROM 1: ",chat.user1UnreadCount);
        if (chat.user1UnreadCount !== undefined && chat.user1UnreadCount !== null) {
          dispatch(setUnreadCount(unreadMessages-chat.user1UnreadCount));
          chat.user1UnreadCount = 0;
        }
    } else if (currUserData.username === chat.user2.username) {
      console.log("UNREAD: ", unreadMessages);
      console.log("UNREAD FROM 2: ",chat.user2UnreadCount);
      if (chat.user2UnreadCount !== undefined && chat.user2UnreadCount !== null) {
        dispatch(setUnreadCount(unreadMessages-chat.user2UnreadCount));
        chat.user2UnreadCount = 0;
      }    
    }
    const res = await resetMessageCountOwn(chat.chatAlternateId, currUserData.username);
    chats.set(selectedChat, chat)
  }

console.log("CURRENT CHAT: ", chats.get(selectedChat));

  async function getTopicAndSet(id) {
    setInnerLoading(true);
    console.log("GETTING CHAT: ", id)
    const topic = await getTopic(id);
    setSelectedTopic(topic);
    setInnerLoading(false);
  }

  React.useEffect(() => {
    console.log("TOGGLE SHOW NAV");
    dispatch(toggleBottomNavBar(mobile && selectedChat != "" ? false : true));
    
  },[mobile, selectedChat])

  React.useEffect(() => {
    return () => {
      dispatch(toggleBottomNavBar(true));
    }
  },[])

  async function addMessage(message) {
    console.log("CURR CHAT STATE: " + chats.size);
    if(chats.get(message.chatId)) {
      console.log("CHAT EXISTS");
      var chat = chats.get(message.chatId);
      if(chat.messages?.length > 0) {
        chat.messages.push(message);
      } else {
        let temp = [];
        temp.push(message);
        chat.messages = temp;
      }
      
      chat.lastMessage = message;
      chats.set(message.chatId,chat);
      //console.log("NEW CHAT: " + JSON.stringify(chats));
      setChats(new Map(chats));
    } else {
      let list = [];
      list.push(message);
      console.log("CREATING NEW CHAT");
      const otherUser = await apiWrapper(getUserByUsername(message.sender, "", false));
      let topic = await getTopic(message.chatId);
      let newChat = {
        id: chats.size + 1,
        chatAlternateId : message.chatId,
        user1 : currUserData,
        user2 : otherUser.data,
        messages : list,
        topic : topic?.id,
        lastMessage : message,
      }
      //console.log("NEW CHAT: " + JSON.stringify(newChat));
      chats.set(message.chatId, newChat);
      console.log("NEW CHATS: " + JSON.stringify(chats.toJSON))
      setChats(new Map(chats));
    }
    if(message.sender !== currUserData.username && message.chatId !== selectedChat) {
      if (currUserData.username === chat.user1.username ) {
        chat.user1UnreadCount = (chat.user1UnreadCount || 0 ) + 1;
      } else {
        chat.user2UnreadCount = (chat.user2UnreadCount || 0 ) + 1;
      }
      
    } else {
      const res = await resetMessageCountOwn(chat.chatAlternateId, currUserData.username);
    }
  }

  async function getTopic(chatId) {
    let topic = null
    if(chatId.split("_").length >= 3) {
      const topicId = chatId.split("_")[2];
      topic = (await apiWrapper(retrieveProjectListingById(topicId), "", false))?.data;
      if(topic) {
        console.log("PROJLIST DATA: " + JSON.stringify(topic));
      } else {
        console.log("TOPIC IS NULL");
        topic = (await apiWrapper(retrieveProjectRequestById(topicId), "", false))?.data;
        if(topic) {
          console.log("PROJREQ DATA: " + JSON.stringify(topic));
        } else {
          topic = (await apiWrapper(getMarketplaceListingById(topicId), "", false))?.data;
          if(topic) {
            console.log("MPL DATA: " + JSON.stringify(topic));
          }
        }
        
      } 

      if (!topic) {
        dispatch({type: ERROR, data: "PROJECT: " + topicId + " could not be found." })
        console.log("TOPIC NOT FOUND");
        topic = null;
      }
    }
    return topic
  }

  const onError = (err) => {
    console.log('ERROR: ' + err);
  }

  const loadChats = async () => {
    const chatsData = await apiWrapper(getAllUserChats(),"Error occured while fetching user chats: ", true);
    console.log("CHAT DATA" + JSON.stringify(chatsData.data));
    if( Object.entries(chatsData.data).length > 0) {
      //setChats(new Map((Object.entries(chatsData.data))));
      return new Map((Object.entries(chatsData.data)));
    }
    return new Map();
  }

  React.useEffect(() => {
    console.log("RUNNING ONCE");
    setIsLoading(true);
    if(currUser?.sub) {
      dispatch(getUserProfile(currUser.sub));
      inOrder();
      registerUser();
    }
  },[currUser])

  async function inOrder() {
    setIsLoading(true);
    let loadedChats = await loadChats();
    const res = await handleSetSelectedChatFromUrl(loadedChats)
    if(!res) {
      setChats(loadedChats);
    }
    setIsLoading(false);
  }

  async function handleRefresh(chatId) {
    console.log("REFRESHING CHAT: ", chatId);
    const chatRes = await apiWrapper(getChat(chatId));
    if(chatRes) {
      console.log(chatRes);
    }
    const newChats = chats;
    newChats.set(chatId,chatRes.data);
    chats.set(chatId, chatRes.data);
    setChats(new Map(chats));
    getTopicAndSet(chatId);
  }

  React.useEffect(() => {
    if(params.chatId == null || !searchParams.has('user2')) {
      console.log('CHANGE IN URL');
      setSelectedChat('');
      setOtherUser({});
    }
  },[params.chatId, searchParams.get('user2'),location])
  

  async function handleSetSelectedChatFromUrl(loadedChats) {
    if(params.chatId && !loadedChats.has(params.chatId) && searchParams.get('user2')) {
      if(params.chatId.split("_")[0].toString() !== currUserData.id.toString() && params.chatId.split("_")[1].toString() !== currUserData.id.toString()) {
        history("/chat");
        return false;
      }
      const otherUser = await apiWrapper(getUserByUsername(searchParams.get('user2')),"",false); 
      if(!otherUser) {
        history("/chat");
        return false;
      }
      if(otherUser.data.id.toString() === currUserData.id.toString()) {
        history("/chat");
        return false;
      }
      if(params.chatId.split("_")[0].toString() !== otherUser.data.id.toString() && params.chatId.split("_")[1].toString() !== otherUser.data.id.toString()) {
        history("/chat");
        return false;
      }
      let topic;
      if(params.chatId.split('_').length >= 3) {
        topic = await getTopic(params.chatId);
        if(params.chatId.split("_").length >= 3 && topic === null) {
          history("/chat");
          return false;
        }
        if(topic) {
          if(topic.refashioner) {
            if(topic.refashioner.id.toString() !== currUserData.id.toString() && topic.refashioner.id.toString() !== otherUser.data.id.toString()) {
              history("/chat");
              return false;
            }
          }
          if(topic.refashionee) {
            if(topic.refashionee.id.toString() !== currUserData.id.toString() && topic.refashionee.id.toString() !== otherUser.data.id.toString()) {
              history("/chat");
              return false;
            }
          }
      }
      
      }

      let newChat = {
        id: loadedChats.size + 1,
        chatAlternateId : params.chatId,
        user1 : currUserData,
        user2 : otherUser.data,
        messages : [],
        topic : topic?.id,
      }
      console.log("NEWCHAT: " + JSON.stringify(newChat));
      loadedChats.set(params.chatId, newChat);
      setSelectedTopic(topic);
      setChats(new Map(loadedChats));
      setSelectedChat(params.chatId);
      setOtherUser(otherUser.data);

      return true;
    } else if(params.chatId && loadedChats.has(params.chatId)) {
      console.log("CHAT EXISTS, SETTING CHAT")
      setChats(new Map(loadedChats))
      setSelectedChat(params.chatId);
      setOtherUser(loadedChats.get(params.chatId).user1.username == currUser.sub ? loadedChats.get(params.chatId).user2 : loadedChats.get(params.chatId).user1)
      return true;
    }
    setChats(new Map(loadedChats))
    return true;

  }

  async function handleDeleteChat(chatId) {
    console.log("DELETING CHAT....")
    apiWrapper(await deleteChat(chatId));
    chats.delete(chatId);
    setChats(new Map(chats));
    history('/chat');
  }

  const handleOnSearchValueChange = (e) => {
    e.preventDefault();
    setSearchValue(e.target.value);
  }

  return (
    !isLoading && currUser?.sub ? <Box className = {styles.root} id = 'chatScreenRoot'>
      {chats.size > 0 ?
      <Grid container columns = {14} id = 'chatScreenGridContainer' sx = {{height : '100%'}}>
        {((mobile && Object.keys(selectedChat).length === 0) || !mobile) &&
        <Grid item xs = {14} md = {4} id = 'contactsContainer'>
          <List
              subheader={
                <Box>
                <ListSubheader sx = {{display : 'flex', justifyContent : 'space-between', flexGrow : 1,fontWeight : 700, fontSize : '1.5em', color : "black", backgroundColor: `${mobile ? 'white' : 'transparent'}`, paddingTop: `${mobile ? 20 : 0}px`}}>
                  Recent Chats
                  <IconButton onClick={() => setShowSearchBar(!showSearchBar)}>
                    <SearchIcon color={'secondary'}/>
                  </IconButton>
                </ListSubheader>
                
                </Box>
              }
            >
            {showSearchBar && <Box sx={{width : '100%', paddingRight : '16px'}}>
            <TextField placeholder="Search..."
              variant="outlined"
              fullWidth
              value = {searchValue}
              onChange = {handleOnSearchValueChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    edge="end"
                  >
                    <SearchIcon color={'secondary'}/>
                  </IconButton>
                </InputAdornment>
              }
              size='small'
            />
            </Box>}
            <Box paddingRight={'16px'}>
            {chats.size > 0 && [...chats.values()].filter((chat) => ( (chat.user1.name.toLowerCase().includes(searchValue) && chat.user1.username !== currUser.sub) || (chat.user2.username !== currUser.sub && chat.user2.name.toLowerCase().includes(searchValue)) /*|| chat.messages.filter((message) => message.message.toLowerCase().includes(searchValue)).length > 0 */) ? true : false ).slice().sort((a,b) => moment(a.lastMessage?.dateCreated).isBefore(moment(b.lastMessage?.dateCreated)) ? 1 : -1).map((chat) => (
                <ContactCard chat = {chat} user = {chat.user1.username == currUser.sub ? chat.user2 : chat.user1 } key ={chat.id} handleClick={handleSetSelectedChat}/>
              ))}
            </Box>
          </List>
        </Grid>}
        {!mobile && <Divider orientation="vertical" sx ={{marginRight : '-2px'}}/>}
        <>
          {Object.keys(selectedChat).length !== 0 ?
          !innerLoading ?
          <Grid container columns = {14} item md = {10} xs = {14} id = 'messagesContainer' direction='column' sx = {{height : '100%', overflowX: 'hidden'}} wrap={"nowrap"}>
            <ChatSection innerLoading = {innerLoading} handleDeleteChat={handleDeleteChat} selectedTopic={selectedTopic}  selectedChat={chats.get(selectedChat)} otherUser={otherUser} handleOnBack={handleOnBack} setSelectedChat={setSelectedChat} sendStompMessage = {sendStompMessage} handleRefresh={handleRefresh}/>
          </Grid> : <InContainerLoading/>
          :<>{!mobile && 
            <Grid container item columns = {14} md = {10} id = 'messagesContainer' direction='column' sx = {{justifyContent : 'center', alignItems : 'center'}}>
              <Button
              variant="contained"
              disabled = {true}
              sx={{":disabled" : {color : 'white', backgroundColor : 'secondary.main'}}}
              >
                Select a chat to start messaging
              </Button>
              </Grid>
            }</>
          }
        </>
      </Grid> : <Box sx = {{height : '100%', display : 'flex', flexGrow : 1, justifyContent : 'center', alignItems : 'center'}}>
            <Button
              variant="contained"
              disabled = {true}
              sx={{":disabled" : {color : 'white', backgroundColor : 'secondary.main'}}}
              >
                No messages
            </Button>
          </Box>}
    </Box> : <Box sx={{display : 'flex', flexGrow:1, height: '100%', justifyContent : 'center', alignItems : 'center', flexDirection:'column'}}>
      <CircularProgress color='secondary' sx={{marginBottom:2}}/>
      <Typography>Loading chats...</Typography>
      </Box>
  )
}

