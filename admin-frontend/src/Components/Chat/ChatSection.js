import React from "react";
import { Avatar, Box, Grid, IconButton, Typography, Divider, Tabs, Tab } from "@mui/material";
import { makeStyles, withStyles} from "@mui/styles";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from "react-router";
import Milestone from "../Milestone/Milestone";
import ChatBox from "./ChatBox";
import { useSelector } from "react-redux";
import MilestoneMenubar from "../Milestone/MilestoneMenubar";
import ChatMoreMenu from "./ChatMoreMenu";
import CustomButton from "../CustomButton";
import OfferBar from "./OfferBar";
import { createOfferForListing, createOfferForMPL, createOfferForRequest } from "../../API/offerApi";
import MilestoneOrderList from "../Milestone/MilestoneOrderList";

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
const CustomTab = withStyles({
  root: {
    textTransform: "none"
  }
})(Tab);


  

export default function ChatSection({selectedChat = {messages: []}, selectedTopic = {}, otherUser, handleOnBack, setSelectedChat, sendStompMessage, handleDeleteChat, handleRefresh, innerLoading = false}) {
    const styles = useStyles();
    const messsagesEndRef = React.useRef(null);
    const currUser = useSelector((state) => state.authData)
    const currUserData = useSelector((state) => state.currUserData);

    const [tabValue, setTabValue] = React.useState(1);

    const[expandTopBar, setExpandTopBar] = React.useState(false);

    React.useEffect(() => {
        console.log("SELECTEDCHAT: " + JSON.stringify(selectedChat));
    },[selectedChat])

    const tabsRef = React.useCallback(node => {
        if (node !== null) {
            setExpandTopBar(true)
        } else {
            setExpandTopBar(false)
        }
    }, []);
      
    const approveDenyRef = React.useCallback(node => {
        if (node !== null) {
            setExpandTopBar(true)
        } else {
            setExpandTopBar(false)
        }
    }, []);

    React.useEffect(() => {
        if(tabsRef) {
            console.log('tabs exist')
        } else if(approveDenyRef) {
            console.log('approve-deny exists')
        }
    },[tabsRef,approveDenyRef])

    React.useEffect(() => {
        setTabValue(1);
    },[otherUser])

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    function a11yProps(index) {
        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    console.log("other user", otherUser);


    const history = useNavigate();

    async function createOffer(offer) {
        console.log("GETS OFFER:" + JSON.stringify(offer))
        offer.refashioneeUsername = otherUser.username;
        offer.buyerUsername = otherUser.username;
        if(selectedTopic?.id) {
            let res = null;
            try {
                if(selectedTopic.refashioner) {
                    res = await createOfferForListing(selectedTopic.id, offer)
                } else if(selectedTopic.refashionee) {
                    res = await createOfferForRequest(selectedTopic.id, offer)
                } else {
                    res = await createOfferForMPL(selectedTopic.id, {quantity : offer.quantity, buyer : otherUser.username})
                }
                console.log("RES: " + JSON.stringify(res.data));
                let messagePayload = {
                    message : {
                        message : res.data.id.toString(),
                        sender : currUserData.username,
                        images : null,
                        offer : true,
                        chatId : selectedChat.chatAlternateId,
                    },
                    topic : selectedTopic.id,
                    images: [],
                }
                sendStompMessage(messagePayload);
                return true;
            } catch (error) {
                console.error(error);
            }
        }
        return "An error occurred while sending an offer";

    }

    async function sendDeclineProject() {
        let messagePayload = {
            message : {
                message : 'Sorry, I am not interested in your request at the moment.',
                sender : currUserData.username,
                images : null,
                offer : false,
                chatId : selectedChat.chatAlternateId,
            },
            topic : selectedTopic.id,
            images: [],
        }
        sendStompMessage(messagePayload);
        return true;

    }

    return (
        <>
            <Grid item container xs={expandTopBar? 1 : 1.8} id='messagesTopBar' sx={{ justifyContent: 'center', alignItems: 'center'}} direction='row'>
                <Grid item xs={1} className={styles.iconContainer}>
                    <IconButton onClick={handleOnBack}>
                        <ArrowBackIcon />
                    </IconButton>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ flexDirection: 'row', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Box sx= {{cursor : 'pointer', display : 'flex', flexDirection : 'row', justifyContent : 'center', alignItems : 'center'}} onClick={() => history('/user/' + otherUser.id)}>
                            <Avatar src={otherUser.avatar?.url} alt={otherUser.name} />
                            <Typography sx={{ paddingLeft: 1 }} fontWeight={700}>{otherUser.name}</Typography>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={1} className={styles.iconContainer}>
                    <ChatMoreMenu otherUser={otherUser} topic = {selectedTopic} isMpl = {selectedTopic?.marketplaceListingStatus} canOffer={(selectedTopic?.id && selectedTopic.available && ( (selectedTopic.refashionee && selectedTopic.refashionee.username !== currUser.sub) || (selectedTopic.refashioner?.username === currUser.sub)))} canDelete={(selectedChat.orders?.length === 0 || !selectedChat.topic || !selectedChat.orders) && selectedChat.messages?.length > 0 } chatId = {selectedChat.chatAlternateId} handleDeleteChat={handleDeleteChat} createOffer={createOffer}/>
                </Grid>
            </Grid>
            {selectedChat.orders?.length > 0 ? <Grid item xs={0.5}> {/*Offer has been accepted*/}
                <Tabs id='tabs-container' ref={tabsRef} value={tabValue} onChange={handleTabChange} classes = {{"indicator": {background: "none"}} } aria-label="chatTabs" variant="fullWidth" sx = {{"& button[aria-selected='true']": {borderBottom : "5px solid", borderBottomColor : '#FB7A56', color : "secondary.main"}, width : '100%'}}>
                    <CustomTab label="Milestone" {...a11yProps(0)}/>
                    <CustomTab label="Chat"  {...a11yProps(1)}/>
                </Tabs>
            </Grid> : /* offer has not been accepted*/
                (selectedTopic?.id && selectedTopic.available ? //has a topic
                    (((selectedTopic.refashionee && selectedTopic.refashionee?.username !== currUser.sub) || (selectedTopic.refashioner && selectedTopic.refashioner?.username === currUser.sub) || (selectedTopic.appUser && selectedTopic.appUser?.username === currUser.sub)) ? //is project request and user is not the requester
                    <Grid item xs={0.5} sx={{paddingLeft: 3, paddingRight: 3}} id='approve-deny-button-container' ref = {approveDenyRef} >
                        <OfferBar createOffer={createOffer} showDeny={true} isMpl={selectedTopic?.marketplaceListingStatus} topic={selectedTopic} handleDecline={sendDeclineProject} isBusiness={selectedTopic.business}/>
                    </Grid>: null)
                : null)
            }
            <Divider orientation="horizontal" sx={{ marginTop: '-2px' }} />
            {tabValue === 1 ? <ChatBox loading = {innerLoading} selectedChat={selectedChat} selectedTopic = {selectedTopic} sendStompMessage={sendStompMessage} otherUser={otherUser} handleRefresh={handleRefresh}/> : 
            <>
                    <MilestoneOrderList orders={selectedChat.orders} otherUser={otherUser}/>
                {/* <Grid item container xs = {1} justifyContent={'flex-end'}>
                    <MilestoneMenubar isRefashionerPOV={selectedTopic?.refashioner?.username === currUser?.sub ? true : false}/>
                </Grid>
                <Grid container item xs = {11} sx={{justifyContent: 'center', overflow : 'scroll', textOverflow:'scroll'}} >
                    <Milestone/>
                </Grid> */}
            </>}
        </>
    )
}

/*
<Grid item xs={1} className={styles.iconContainer}>
                        <input
                            accept="image/*"
                            hidden
                            id="camera-button"
                            type="file"
                            capture='camera'
                        />
                        <label htmlFor="camera-button">
                            <IconButton component='span'>
                                <CameraAltIcon />
                            </IconButton>
                        </label>
                    </Grid>
*/