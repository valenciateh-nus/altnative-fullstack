import { Alert, Box, Container, CssBaseline, Modal, Paper, Snackbar, Typography, useMediaQuery } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import BottomNav from './Components/BottomNav';
import Sidebar from './Components/Sidebar';
import { drawerWidth } from './constants';
import "./App.css"
import { closeImageModal, logout, setImageIndex, signInJnt, toggleBottomNavBar, setUnreadCount } from './Redux/actions';
import React, { useState } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { ERROR, FEEDBACK } from './Redux/actionTypes';
import { loadStripe } from "@stripe/stripe-js";
import { useTheme } from '@mui/system';
import { onMessageListener } from './Firebase';

import LoginScreen from './Screens/LoginScreen';
import HomeScreen from '../../b2b-frontend/src/Screens/HomeScreen/HomeScreen';
import ChatScreen from '../../b2b-frontend/src/Screens/ChatScreen';
import OrderPage from './Screens/OrderScreen/OrderPage';
import EditProfile from './Screens/ProfileScreen/EditProfile';
import DisputeList from './Screens/DisputeScreen/DisputeList';

import SuccessModal from './Components/SuccessModal';
import CreateListing from './Screens/CreateListing';
import PaymentScreen from './Screens/PaymentScreen';
import UploadScreen from './Screens/UploadScreen';
import CreateRequest from './Screens/CreateRequest';
import Profile from './Screens/ProfileScreen/Profile';
import ProfileScreen from './Screens/ProfileScreen';
import ChangePassword from './Screens/ProfileScreen/ChangePassword';
import ViewReviews from './Screens/ProfileScreen/ViewReviews';
import OrderDetails from './Screens/OrderScreen/OrderDetails';
import DisputeDetails from './Screens/DisputeScreen/DisputeDetails';
import DeadstockListingDetails from './Screens/OrderScreen/DeadstockListingDetails';
import BusinessRequestDetails from './Screens/OrderScreen/BusinessRequestDetails';
import BidderPage from './Screens/OrderScreen/BidderPage';
import UserProfile from './Screens/ProfileScreen/UserProfile';
import EditBusinessProfile from './Screens/ProfileScreen/EditBusinessProfile';
import ReactNotificationComponent from './Components/Notification/ReactNotificationComponent';
import Notification from './Components/Notification/Notification';
import Transactions from './Screens/ProfileScreen/Transactions';
import PaymentMethodScreen from './Screens/ProfileScreen/PaymentMethodScreen';
import DisputeRequestScreen from './Screens/DisputeRequestScreen';
import AboutUs from './Screens/ProfileScreen/AboutUs';

export const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC);

function App() {
  const notHidden = useMediaQuery(theme => theme.breakpoints.up('lg'));
  const state = useSelector((state) => state)
  const error = useSelector((state) => state.error);
  const fBack = useSelector((state) => state.feedback);
  const theme = useTheme();
  const currUserData = useSelector((state) => state.currUserData);
  const token = useSelector((state) => state.token);
  const currUser = useSelector((state) => state.authData);
  const unreadMessages = useSelector((state) => state.unreadCount);
  console.log("RERUNNING");

  const showBottomNavBar = useSelector((state) => state.showBottomNavBar);
  const showNotiToken = useSelector((state) => state.notificationToken);

  const history = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  function handleSnackBadCloseImageViewer() {
    dispatch(closeImageModal());
  }

  function handleSetImageIndex(index) {
    dispatch(setImageIndex(index));
  }

  React.useEffect(() => {
    // getUnreadMessagesCount();
    dispatch(signInJnt());
    dispatch(closeImageModal())
    dispatch(toggleBottomNavBar(true));
    console.log("REDUX STATE: " + JSON.stringify(state));
  },[])

  React.useEffect(() => {
    if(!token) {
      history('/login');
    } else if(currUserData && !currUserData.enabled) {
      history(`/verify/${currUserData.id}`);
    }
  },[token,currUserData])


  const[err, setErr] = React.useState("");
  const[feedback, setFeedback] = React.useState("");
  const[snackBad,setSnackBad] = React.useState(false);
  const[snackFeedback,setSnackFeedback] = React.useState(false);
  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState({title: '', body: '', redirect: null});
  
  onMessageListener().then((payload) => {
    console.log("RECEIVED NOTI", JSON.stringify(payload.data));
    setNotification(payload.data);
    console.log(payload);
  }).catch(err => console.log('failed: ', err));

  React.useEffect(() => {
    if(notification) {
      if(notification.redirect && !location.pathname.includes(notification.redirect?.split('/')[1])) {
        setShow(true);
      }
    }
    
  },[notification,location])

  React.useEffect(() => {
    if (show) {
      setTimeout(() => { 
        setShow(false) 
        setNotification({title: '', body: '', redirect: null});
      }, 4000 );
    }
  }, [show])

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

  React.useEffect(() => {
    if (show) {
      setTimeout(() => { setShow(false) }, 4000 );
    }
  }, [show])

  const onError = (err) => {
    console.log('ERROR: ' + err);
  }

  const selectView = useSelector((state) => state.view);

  const mobileStyle = {
    width: '100%', 
    margin : 0,
    height : `calc(100% - ${showBottomNavBar ? 65 : 0}px)`,
    padding : 0,
    overflow: 'scroll',
    mt : 2,
  }

  const desktopStyle = {
    width: '100%', 
    ml: `${notHidden ? drawerWidth/2 : 0}px`, 
    mt : '2vh',
    marginRight: "0", 
    borderRadius: "2vw 2vw 2vw 2vw",
    background: '#ffeee3',
    height : '95%', padding : '1em',
    overflow: 'scroll',
  }

  return (
    <>
      <CssBaseline />
      <Container maxWidth = 'lg'>
        <Box sx = {{height : '100vh', }}>
        {location.pathname.split('/')[1] !== 'login' && location.pathname.split('/')[1] !== '' ? (notHidden ? <Sidebar /> : <BottomNav />) : null}
          <Box component="main"
            sx = {(notHidden && location.pathname.split('/')[1] !== 'login' && location.pathname.split('/')[1] !== '') ? desktopStyle : mobileStyle}
          >
            <Routes>
              <Route path = "/login" element = {<LoginScreen/>}/>
              <Route path = "/home" element = {<HomeScreen/>}/>
              <Route path = "/order" element = {<OrderPage/>}/>
              <Route path = "/upload" element = {<UploadScreen/>}/>
              <Route path = "/createDeadstockListing" element = {<CreateListing />}>
                <Route path = "/createDeadstockListing/:id" element = {<CreateListing/>} />
              </Route>
              <Route path = "/createBusinessRequest" element = {<CreateRequest />}>
                <Route path = "/createBusinessRequest/:id" element = {<CreateRequest/>} />
              </Route>
              <Route path = "/viewRequestBids" element={<BidderPage/>}>
                <Route path = "/viewRequestBids/:id" element={<BidderPage/>} />
              </Route>
              <Route path = "/chat" element = {<ChatScreen/>}>
                <Route path = "/chat/:chatId" element = {<ChatScreen/>}/>
              </Route>
              <Route path = "/profile/paymentmethod" element = {<PaymentMethodScreen/>}/>
              <Route path = "/profile/edit" element = {<EditProfile/>}/>
              <Route path = "/profile/wallet/transactions" element = {<Transactions/>}/>
              <Route path = "/profile/changePassword" element = {<ChangePassword/>}/>
              <Route path = "/profile" element = {<Profile/>} />
              <Route path = "/listing" element = {<DeadstockListingDetails/>}>
                <Route path = "/listing/:id" element = {<DeadstockListingDetails/>} />
              </Route>
              <Route path = "/request" element = {<BusinessRequestDetails/>}>
                <Route path = "/request/:id" element = {<BusinessRequestDetails/>} />
              </Route>
              <Route path = "/payment/:offerId" element = {<PaymentScreen/>}/>
              <Route path = "/report" element = {<DisputeList/>} />
              <Route path = "/report/:id" element = {<DisputeRequestScreen />} />
              <Route path = "/disputeRequest/:id" element={<DisputeDetails />} />
              <Route path = "/settings" element = {<ProfileScreen />} />
              <Route path = "/viewReviews" element = {<ViewReviews/>} >
                <Route path = "/viewReviews/:id" element = {<ViewReviews/>} />
              </Route>
              <Route path = "/userProfile" element = {<UserProfile/>} >
                <Route path = "/userProfile/:id" element = {<UserProfile/>} />
              </Route>
              <Route path = "/profile/editProfile" element = {<EditBusinessProfile />} />
              <Route path="/about" element={<AboutUs />} />
              <Route exact path = "/" element = {<LoginScreen/>}/>
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
          imagePadding={notHidden ? 100 : 50}
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
        {/* <Snackbar
          open={snackFeedback}
          autoHideDuration={5000}
          onClose={handleSnackFeedbackClose}
        >
           <Alert severity='success'>{feedback}</Alert>
        </Snackbar> */}
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


/*
{state.isViewerOpen && <ImageViewer
          src={ state.selectedImageSet }
          currentIndex={ state.selectedImageIndex }
          disableScroll={ false }
          closeOnClickOutside={ true }
          onClose={handleSnackBadCloseImageViewer()}
        />}
        */