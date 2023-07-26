import { Box, Button, CircularProgress, Divider, Grid, IconButton, ImageList, ImageListItem, TextField, Typography, useMediaQuery } from '@mui/material';
import moment from 'moment';
import * as React from 'react'
import { useNavigate } from 'react-router'
import ChatMessage from './ChatMessage';
import TopicCard from './TopicCard';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';
import Picker from 'emoji-picker-react';
import useComponentVisible from '../../Hooks/useComponentVisible';
import { openImageModal, setUnreadCount } from '../../Redux/actions';
import { uploadImage } from '../../API';
import { ERROR } from '../../Redux/actionTypes';
import { resetMesageCount } from '../../API/chatApi';

const useStyles = makeStyles((theme) => ({
    iconContainer: {
      display : 'flex', 
      justifyContent : 'center'
    },
}))

export default function ChatBox({selectedChat, selectedTopic ,otherUser, sendStompMessage, handleRefresh, loading = true}) {
    const styles = useStyles();
    const history = useNavigate();
    const messagesEndRef = React.useRef(null);
    const currUser = useSelector((state) => state.authData)
    const currUserData = useSelector((state) => state.currUserData);
    const unreadMessages = useSelector((state) => state.unreadCount);

    const dispatch = useDispatch();

    const[textValue, setTextValue] = React.useState("");
    const[attachments, setAttachments] = React.useState([]);
    const[isLoading, setIsLoading] = React.useState(false);
    const[firstScroll, setFirstScroll] = React.useState(false);

    const [pickerRef,isPickerVisible,setIsPickerVisible] = useComponentVisible(false);

    const notHidden = useMediaQuery(theme => theme.breakpoints.up('md'));

    const showBottomGutter = useSelector((state) => state.showBottomNavBar);

    const[isKeyboardOpen, setIsKeyboardOpen] = React.useState(false);

    const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block:"start" })}

    const sendMessage = async() =>{
        //message : {message : String , Sender : User, images : List<Image>, isOffer : boolean, chatId : String}, topic : {...}
        setIsLoading(true);
        let images = await uploadImages();
        console.log("UPLOADED IMAGES:" + JSON.stringify(images));
        let messagePayload = {
            message : {
                message : textValue,
                sender : currUserData.username,
                images : images,
                offer : false,
                chatId : selectedChat.chatAlternateId,
            },
            topic : selectedTopic?.id,
            images: [],
        }
        sendStompMessage(messagePayload);
        setAttachments([]);
        setIsLoading(false);
    }

    function handleSendOfferRejectionMessage() {
        handleRefresh(selectedChat.chatAlternateId);
        //sendStompMessage(messagePayload);
    }

    async function uploadImages() {
        let images = [];
        for(const image of attachments) {
            try {
                const formData = new FormData();
                formData.append("file", image);
                const { data } = await uploadImage(formData);
                console.log("DATA: " + JSON.stringify(data));
                images.push(data);
            } catch (error) {
                console.log(error);
            }
        }

        return images;
    }

    React.useEffect(() => {
        if(loading === false && selectedChat.messages) {
        setTimeout(() => {         
            console.log("scrolling to bottom init len: ", selectedChat.messages?.length || 0)
            document.getElementById("messagesEndRef").scrollIntoView();
            
          }, 100 );
        }
        setFirstScroll(true);
    },[loading,selectedChat.messages])

    React.useEffect(() => {
        window.visualViewport.addEventListener("resize", handleChangeViewSize)
        return () => window.visualViewport.removeEventListener ("resize", handleChangeViewSize)
    },[])

    React.useEffect(() => {
        if(selectedChat.lastMessage && firstScroll) {
            console.log("scrolling to bottom on lastMessage");
            scrollToBottom()
            
        }
    }, [selectedChat.lastMessage]);


    // React.useEffect(() => {
    //     if(selectedChat.lastMessage) {
    //         console.log("scrolling to bottom: ", selectedChat.messages?.length);
    //         scrollToBottom()
    //     }
    // }, [selectedChat.lastMessage]);

    // React.useEffect(() => {
    //     console.log("RUN ONCE");
    //     resetCount();
    // }, [])

    // async function resetCount() {
    //     if (currUserData.username === selectedChat.user1.username) {
    //         dispatch(setUnreadCount(unreadMessages-selectedChat.user1UnreadCount));
    //     } else if (currUserData.username === selectedChat.user2.username) {
    //         dispatch(setUnreadCount(unreadMessages-selectedChat.user2UnreadCount));
    //     }
    //     const res = await resetMesageCount(selectedChat.chatAlternateId);
    // }

    const handleChangeViewSize = () => {
        if(window.visualViewport.height > 500) {
            setIsKeyboardOpen(false);
        } else {
            setIsKeyboardOpen(true);
        }
    }

    React.useEffect(() => {
        console.log("CURR ATTACHMENTS: " + attachments.length);
    },[attachments])

    const handleFormChange = (e) => {
        setTextValue(e.target.value);
    };

    const handleSubmit = async() => {
        if(textValue.trim() !== "") {
            console.log('submitting: ', textValue);
            sendMessage();
        }
        setTextValue("");
        
    };

    const handleOnKeyDown = async(e) => {
        if(e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            await handleSubmit();
        }

    }

    const handleAttachmentChange = (e) => {
        console.log('files:', e.target.files);
        setAttachments(Array.from(e.target.files));
    }



    function handlePhotoModal(images, index) {
        dispatch(openImageModal(images,index))
    }

    const onEmojiClick = (event, emojiObject) => {
        setTextValue(textValue + emojiObject.emoji);
    };

    function handleTopicCardClick() {
        if(selectedTopic.refashionee) {
            if(currUser.sub === selectedTopic.refashionee.username) {
                history(`/requestDetails/${selectedTopic.id}`)
            } else {
                history(`/refashioner/requestDetails/${selectedTopic.id}`)
            }
        } else if(selectedTopic.refashioner) {
            history(`/listing/${selectedTopic.id}`)
        } else if(selectedTopic.marketplaceListingStatus) {
            history(`/marketplaceListing/${selectedTopic.id}`)
        } else {
            dispatch({type: ERROR, data : 'Invalid topic.'});
        }
    }

    return (
        <>
            <Grid item xs={11} id='messages' sx={{ overflowY: 'scroll', paddingLeft: 1 }}>
                {selectedTopic?.id && 
                <Grid
                    item
                    container
                    justifyContent={currUser.sub !== otherUser.username ? 'flex-start' : 'flex-end'}
                >
                    <Button onClick = {handleTopicCardClick} disableRipple = {true} sx={{textTransform : "none", textAlign :'left'}}>
                        <TopicCard image = {selectedTopic.imageList?.length > 0 ? selectedTopic.imageList[0].url : ''} title = {selectedTopic.title} price = {selectedTopic.price}/>
                    </Button>
                </Grid>
                }
                {selectedChat && selectedChat.messages?.length > 0 ? selectedChat.messages?.map((message,idx) => (
                    <ChatMessage
                        avatar={message.sender == otherUser.username ? otherUser.avatar?.url : null}
                        side={message.sender === currUser?.sub ? 'right' : 'left'}
                        messages={[message.message]}
                        images={message?.images ? message.images : null}
                        timestamp={moment(message.dateCreated).format("hh:mm")} 
                        isOffer = {message.offer}
                        isLast = {selectedChat.messages?.length - 1 === idx && !loading}
                        handleSendOfferRejectionMessage={handleSendOfferRejectionMessage}
                        key={selectedChat.id + '-' + idx}
                    />
                )) : null
                }
                <div ref={messagesEndRef} id="messagesEndRef"/>
                

            </Grid>
            <Divider orientation="horizontal" sx={{ marginTop: '-2px' }} />
            {attachments.length > 0 && <Grid item xs = {1}>
            <Box sx = {{display : 'flex', flexDirection : 'row', overflowX : 'scroll', padding: 2}}>
                {<ImageList cols = {attachments.length}>
                    {attachments.map((img,i) => (
                    <ImageListItem key={i} style={{width:100, height: 100, overflow : 'hidden'}} >
                        <img src={URL.createObjectURL(img)} loading="lazy" onClick={() => handlePhotoModal(attachments.map(img => URL.createObjectURL(img)), i)} style={{cursor:'pointer'}}/>
                    </ImageListItem>
                    ))}
                </ImageList>}
            </Box>
            </Grid>}
            <Grid container item xs={1} columns = {14} spacing={2} sx={{ paddingLeft: 1, paddingRight: 1, justifyContent: 'center', alignItems: 'flex-end' }} direction='row' id='chatInputContainer'>
                {notHidden && <Grid item xs={1} className={styles.iconContainer}>
                    <IconButton onClick={() => setIsPickerVisible(!isPickerVisible)}>
                        <SentimentSatisfiedAltIcon />
                    </IconButton>
                </Grid>}
                <Grid item xs={notHidden ? 12 : 13}>
                    <TextField 
                        variant='standard' fullWidth placeholder="Write a message" 
                        InputProps={{ disableUnderline: true }} value={textValue} 
                        onChange={handleFormChange}
                        onKeyDown={handleOnKeyDown}
                        multiline
                        maxRows={10}
                        sx={{overflowY: 'scroll'}}
                    />
                </Grid>
                {!isLoading ? <Grid item xs={1} className={styles.iconContainer}>
                    <input
                        accept="image/*"
                        hidden
                        id="attachments-button"
                        type="file"
                        multiple
                        onChange={handleAttachmentChange}
                    />
                    <label htmlFor="attachments-button">
                    <IconButton component='span'>
                        <AttachFileIcon />
                    </IconButton>
                    </label>
                </Grid> : <Grid item xs={1} className={styles.iconContainer} sx={{paddingBottom : 1}}><CircularProgress color="secondary" size = {20}/></Grid>}
            </Grid>
            {!showBottomGutter && !isKeyboardOpen && <Grid item xs={1}/>}
            <div ref={pickerRef} onKeyDown={handleOnKeyDown}>
                {isPickerVisible && <Picker
                    pickerStyle={{ width: '100%' }}
                    disableAutoFocus
                    native
                    onEmojiClick={onEmojiClick} 
                />}
            </div>
        </>
    )
}