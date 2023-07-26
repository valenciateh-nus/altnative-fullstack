import { Alert, Box, Container, CssBaseline, Modal, Paper, Snackbar, Typography, useMediaQuery } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import { drawerWidth } from './constants';
import ChatScreen from './Screens/ChatScreen';
import { closeImageModal, setImageIndex, signInJnt, toggleBottomNavBar } from './Redux/actions';
import React from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { ERROR, FEEDBACK } from './Redux/actionTypes';
import "./App.css"

import { loadStripe } from "@stripe/stripe-js";
import SuccessModal from './Components/SuccessModal';
import LoginScreen from './Screens/LoginScreen';
import { useTheme } from '@mui/system';
import AccountManagementScreen from './Screens/AccountManagementScreen';
import RequestsManagementScreen from './Screens/RequestsManagementScreen';
import ListingManagementScreen from './Screens/ListingManagementScreen';
import UserDetailsScreen from './Screens/UserDetailsScreen';
import ListingsDetailsScreen from './Screens/ListingDetailsScreen';
import DashboardScreen from './Screens/DashboardScreen';
import DisputeDetailsScreen from './Screens/DisputeDetailsScreen';
import TransactionsManagementScreen from './Screens/TransactionsManagementScreen';
import OrderDetailsScreen from './Screens/OrderDetailsScreen';
import ProfileScreen from './Screens/ProfileScreen';
import EditProfile from './Screens/ProfileScreen/EditProfile';
import ChangePassword from './Screens/ProfileScreen/ChangePassword';

import { onMessageListener } from './Firebase';
import Notification from "./Components/Notification/Notification";
import ReactNotificationComponent from "./Components/Notification/ReactNotificationComponent";



export const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC);

function App() {
  const notHidden = useMediaQuery(theme => theme.breakpoints.up('md'));
  const theme = useTheme();
  const state = useSelector((state) => state)
  const token = useSelector((state) => state.token)
  const error = useSelector((state) => state.error);
  const fBack = useSelector((state) => state.feedback);
  const authData = useSelector((state) => state.authData);
  const [notification, setNotification] = React.useState({title: '', body: '', redirect: null});
  const [show,setShow] = React.useState(false);
  

  const history = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  onMessageListener().then((payload) => {
    console.log("RECEIVED NOTI", JSON.stringify(payload.data));
    setNotification(payload.data);
  }).catch(err => console.log('failed: ', err));

  React.useEffect(() => {
    if(notification) {
      if(notification.redirect && !location.pathname.includes(notification.redirect?.split('/')[1])) {
        console.log('SETTING SHOW');
        setShow(true);
      }
    }
    
  },[notification,location])

  React.useEffect(() => {
    if (show) {
      setTimeout(() => { 
        setShow(false) 
        console.log('TURNING SHOW OFF');
        setNotification({title: '', body: '', redirect: null});
      }, 4000 );
    }
  }, [show])

  function handleSnackBadCloseImageViewer() {
    dispatch(closeImageModal());
  }

  function handleSetImageIndex(index) {
    dispatch(setImageIndex(index));
  }

  React.useEffect(() => {
    if(state.token === null) {
      history('/login');
    }
    dispatch(signInJnt());
    dispatch(closeImageModal())
    dispatch(toggleBottomNavBar(true));
    console.log("REDUX STATE: " + JSON.stringify(state));
  },[])

  React.useEffect(() => {
    if(state.token === null) {
      history('/login');
    }
  },[token])


  const[err, setErr] = React.useState("");
  const[feedback, setFeedback] = React.useState("");
  const[snackBad,setSnackBad] = React.useState(false);
  const[snackFeedback,setSnackFeedback] = React.useState(false);

  function handleSnackBadClose() {
    setErr("");
    dispatch({type: ERROR, data : null})
    setSnackBad(false);
  }

  function handleSnackFeedbackClose() {
    setFeedback("");
    dispatch({type: FEEDBACK, data : null})
    setSnackFeedback(false);
  }

  React.useEffect(() => {
    if(error) {
      setErr(error);
      setSnackBad(true);
    }
  },[error])

  React.useEffect(() => {
    if(fBack) {
      setFeedback(fBack);
      setSnackFeedback(true);
    }
  },[fBack])

  const mobileStyle = {
    width: '100%', 
    margin : 0,
    marginRight: "0", borderRadius: "2vw 2vw 2vw 2vw",
    height : '95%', padding : '1em',
    overflow: 'scroll',
  }

  const desktopStyle = {
    width: '100%', 
    ml: `${notHidden ? drawerWidth/2 : 0}px`, 
    mt : '2vh',
    marginRight: "0", borderRadius: "2vw 2vw 2vw 2vw",
    background: theme.palette.primary.veryLight,
    height : '95%', padding : '1em',
    overflow: 'scroll',
  }

  return (
    <>
      <CssBaseline />
      <Container maxWidth = 'lg'>
        <Box sx = {{height : '100vh', }}>
        {location.pathname.split('/')[1] !== 'login' && location.pathname.split('/')[1] !== '' &&  <Sidebar />}
          <Box component="main"
            sx = {(notHidden && location.pathname.split('/')[1] !== 'login' && location.pathname.split('/')[1] !== '') ? desktopStyle : mobileStyle}
          >
            <Routes>
              <Route path = "/login" element = {<LoginScreen/>}/>
              <Route path = "/" element = {<LoginScreen/>}/>
              <Route path = "/chat" element = {<ChatScreen/>}>
                {/*
                  To generate chatId, use generateChatId() function under constants.js. It takes in the currentUserId, the other userId, and a projectId if any, else null.
                  pass in chatId followed by the username of user you want to chat with. e.g. useNavigate('/chat/1_2_3?user2=someOtherUsername') 
                */}
                <Route path = "/chat/:chatId" element = {<ChatScreen/>}/>
              </Route>
              <Route path = "/dashboard" element = {<DashboardScreen />} />
              <Route path = "/listingsManagement" element = {<ListingManagementScreen/>}/>
              <Route path = "/accountManagement" element = {<AccountManagementScreen/>}/>
              <Route path = "/requests" element = {<RequestsManagementScreen/>}/>
              <Route path = "/user/:id" element = {<UserDetailsScreen/>}/>
              <Route path = "/listing/:type/:id" element = {<ListingsDetailsScreen/>}/>
              <Route path = "/dispute/:id" element = {<DisputeDetailsScreen/>}/>
              <Route path = "/order/:id" element = {<OrderDetailsScreen/>}/>
              <Route path = "/transactions" element = {<TransactionsManagementScreen/>}/>
              <Route path = "/profile" element = {<ProfileScreen />} />
              <Route path = "/profile/edit" element = {<EditProfile />}/>
              <Route path = "/profile/changepassword" element = {<ChangePassword />} />
            </Routes>
            
          </Box>
        </Box>
      </Container>
        {state.isViewerOpen && <Lightbox
          mainSrc={ state.selectedImageSet[state.selectedImageIndex] }
          nextSrc={ state.selectedImageSet[(state.selectedImageIndex + 1) % state.selectedImageSet.length] }
          prevSrc={ state.selectedImageSet[(state.selectedImageIndex + state.selectedImageSet.length - 1) % state.selectedImageSet.length] }
          onCloseRequest={handleSnackBadCloseImageViewer}
          onMovePrevRequest={() => handleSetImageIndex((state.selectedImageIndex + state.selectedImageSet.length - 1) % state.selectedImageSet.length)}
          onMoveNextRequest={() => handleSetImageIndex((state.selectedImageIndex + 1) % state.selectedImageSet.length)}
          reactModalStyle={{'overlay':{zIndex:1300}}}
          imagePadding={100}
          imageTitle={`${state.selectedImageIndex + 1} of ${state.selectedImageSet.length}`}
        />
        }
        <Snackbar
          open={snackBad}
          autoHideDuration={5000}
          onClose={handleSnackBadClose}
        >
           <Alert severity="error">ERROR: {err}</Alert>
        </Snackbar>
        <SuccessModal text={feedback} open={snackFeedback} onClose = {handleSnackFeedbackClose}/>
        {show && (
          <>
        <ReactNotificationComponent
          title={notification.title}
          body={notification.body}
          redirect={notification.redirect}
          navigate = {history}
          />
        </>)}
      <Notification />

    </>
  );
}

export default App;