import { Alert, Box, Container, CssBaseline, Modal, Paper, Snackbar, Typography, useMediaQuery } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import { useState } from 'react';
import { onMessageListener } from './Firebase';

import BottomNav from './Components/BottomNav';
import Notification from "./Components/Notification/Notification";
import ReactNotificationComponent from "./Components/Notification/ReactNotificationComponent";
import Sidebar from './Components/Sidebar';
import { drawerWidth } from './constants';
import ChatScreen from './Screens/ChatScreen';
import PaymentScreen from './Screens/PaymentScreen';
import EditProfile from './Screens/ProfileScreen/EditProfile';
import LoginScreen from './Screens/LoginScreen';
import SettingsScreen from './Screens/SettingsScreen';
import CreateListing from './Screens/CreateListing';
import HomeScreen from './Screens/HomeScreen/HomeScreen';
import RefashionScreen from './Screens/HomeScreen/RefashionScreen';
import SearchScreen from './Screens/HomeScreen/SearchScreen';
import ViewSomeRefashioner from './Screens/HomeScreen/ViewSomeRefashioner';
import ChangePassword from './Screens/ProfileScreen/ChangePassword';
import "./App.css"
import Favourites from './Screens/ProfileScreen/Favourites';
import CreateProjectListingScreen from './Screens/OrderScreen/CreateProjectListingScreen';
import { closeImageModal, logout, setImageIndex, signInJnt, toggleBottomNavBar, setUnreadCount } from './Redux/actions';
import React from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import OrderPage from './Screens/OrderScreen/OrderPage';
import MyMeasurements from './Screens/ProfileScreen/MyMeasurements';
import PaymentMethod from './Screens/ProfileScreen/PaymentMethod';
import OrderDetails from './Screens/OrderScreen/OrderDetails';
import RequestDetails from './Screens/OrderScreen/RequestDetails';
import UserProfile from './Screens/ProfileScreen/UserProfile';
import SearchResultsScreen from './Screens/HomeScreen/SearchResultsScreen';
import ListingScreen from './Screens/ListingScreen';
import PendingReview from './Screens/OrderScreen/PendingReview';
import EcommHome from './Screens/EcommerceScreen/HomeScreen';
import Listing from './Screens/EcommerceScreen/Listing'
import CreateEcommListing from './Screens/EcommerceScreen/CreateEcommListing';
import CreateProjectRequest from './Screens/OrderScreen/CreateProjectRequest';
import RefashionerHome from './Screens/RefashionerScreen/RefashionerHome';
import RefashionerScreen from './Screens/RefashionerScreen';
import EarningsPage from './Screens/RefashionerScreen/EarningsPage';
import RefashionerOrderPage from './Screens/RefashionerScreen/OrderPage';
import RefashionerRequestDetails from './Screens/RefashionerScreen/RequestDetails';
import { ERROR, FEEDBACK } from './Redux/actionTypes';
import GetStartedPage from './Screens/RefashionerScreen/GetStartedPage';

import CompletedScreen from './Screens/OrderScreen/CompletedScreen';
import MarketplaceOrder from './Screens/EcommerceScreen/MarketplaceOrder';
import RefashionerRequestPage from './Screens/RefashionerScreen/RefashionerRequestPage';
import PaymentMethodScreen from './Screens/ProfileScreen/PaymentMethodScreen';
import Transactions from './Screens/ProfileScreen/Transactions';

import { loadStripe } from "@stripe/stripe-js";
import EditListing from './Screens/EditListing';
import RefashionRequestsScreen from './Screens/ProfileScreen/RefashionRequestsScreen';
import BidderPage from './Screens/OrderScreen/BidderPage';
import Search2ResultsScreen from './Screens/HomeScreen/Search2ResultScreen';
import Search2Screen from './Screens/HomeScreen/Search2Screen';
import EditRefashionerProfile from './Screens/ProfileScreen/EditRefashionerProfile';
import ErrorPage from './Screens/OrderScreen/ErrorPage';
import SuccessModal from './Components/SuccessModal';
import WidthdrawPage from './Screens/ProfileScreen/WidthdrawPage';
import TopupPage from './Screens/ProfileScreen/TopupPage';
import DisputeRequestScreen from './Screens/DisputeRequestScreen';
import DisputeList from './Screens/DisputeScreen/DisputeList';
import DisputeDetails from './Screens/DisputeScreen/DisputeDetails';
import Profile from './Screens/ProfileScreen/Profile';
import ViewReviews from './Screens/ProfileScreen/ViewReviews';
import DeadstockDetails from './Screens/EcommerceScreen/DeadstockDetails';
import DisputeRefundForm from './Components/Dispute/DisputeRefundForm';
import WelcomeScreen from './Screens/WelcomeScreen';
import BusinessProfile from './Screens/BusinessScreen/BusinessProfile'
import ViewBusiness from './Screens/HomeScreen/ViewBusiness';
import CreateSwap from './Screens/SwapScreen/CreateSwap';
import BankDetails from './Screens/ProfileScreen/BankDetails';
import SwapScreen from './Screens/SwapScreen/SwapScreen';
import SwapOrder from './Screens/SwapScreen/SwapOrder';
import SwapRequest from './Screens/SwapScreen/SwapRequest'
import SwapItem from './Screens/SwapScreen/SwapItem';
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

  // async function getInitialUnreadMessagesCount() {
  //   console.log("UNREAD MESSAGES");
  //   let unread = 0;
  //   const chats = await getAllUserChats().then((val) => {
  //     console.log("start");
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
  //     console.log("done")
  //     // alert("UNREAD: ", unread);
  //     // alert("UNREAD STATE: ", unreadMessages);
  //   });
  //   console.log("dispatch")
  //   dispatch(setUnreadCount(unread));
  // }

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
        console.log('SHOWING, REDIRECT: ', notification.redirect?.split('?')[0])
        console.log('SHOWING, CURRPATH: ', location.pathname.split('?')[0])
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

  // React.useEffect(() => {
  //   console.log("RUNNING ONCE");
  //   if(currUser?.sub) {
  //     registerUser();
  //     getInitialUnreadMessagesCount();
  //   }
  // },[currUser])

  // var stompClient = null;

  // const registerUser = () => {
  //   let Sock = new SockJS(process.env.REACT_APP_BACKEND_URL +'/ws');
  //   stompClient= Stomp.over(Sock);
  //   stompClient.connect({'X-Authorization' : 'Bearer ' + token}, onConnected, onError);
  // }

  const onError = (err) => {
    console.log('ERROR: ' + err);
  }

  // const onConnected = () => {
  //   console.log("CONNECTED");
  //   stompClient.subscribe('/chat/messages/' + currUser.sub, onMessageReceived);
  // }
  
  // const onMessageReceived = (payload) => {
  //   //message : {message : String , sender : User, images : List<Image>, isOffer : boolean, chatId : String}, topic : {...}
  //   //console.log("RECEIVED MESSAGE: " + payload.body);
  //   let message = JSON.parse(payload.body);
  //   console.log("MESSAGE RECEIVED!!!");
  // //   console.log("unread", unreadMessages);
  // //   console.log("INCREASE COUNT: ", unreadMessages + 1)
  // //   dispatch(setUnreadCount(unreadMessages+1));
  // // }
  //   getUnreadMessagesCount();
  // }

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
    width: `90%`, 
    ml: `calc(5% + ${notHidden ? drawerWidth/2 : 0}px)`, 
    mt : '2vh',
    borderRadius: "2vw 2vw 2vw 2vw",
    background: theme.palette.primary.veryLight,
    height : '95%', padding : '1em',
    overflow: 'scroll',
  }

  return (
    <>
      <CssBaseline />
      <Container maxWidth = 'lg'>
        <Box sx = {{height : '100vh', }}>
        {!['login','verify'].includes(location.pathname.split('/')[1]) && location.pathname.split('/')[1] !== '' ? (notHidden ? <Sidebar /> : <BottomNav />) : null}
          <Box component="main"
            sx = {(notHidden && !['login','verify'].includes(location.pathname.split('/')[1]) && location.pathname.split('/')[1] !== '') ? desktopStyle : mobileStyle}
          >
            <Routes>
              <Route path = "/login" element = {<LoginScreen/>}/>
              <Route path = "/verify" element = {<WelcomeScreen/>}>
                <Route path = "/verify/:id" element = {<WelcomeScreen/>}/>
              </Route>
              <Route path="/newProfile" element={<Profile />}/>
              <Route path="/profile" element={<Profile />}/>
              <Route path="/settings" element={<SettingsScreen />}/>
              <Route path="/profile/wallet/transactions" element={<Transactions />} />
              <Route path="/profile/wallet/widthdraw" element={<WidthdrawPage />} />
              <Route path="/profile/wallet/topup" element={<TopupPage />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/profile/changepassword" element={<ChangePassword/>} />
              <Route path="/profile/mymeasurements" element={<MyMeasurements/>} />
              <Route path="/profile/favourites" element={<Favourites/>} />
              <Route path="/profile/paymentmethod" element={<PaymentMethodScreen/>} />
              <Route path="/profile/:username" element={<RefashionerScreen />} />
              <Route path="/profile/bankdetails" element={<BankDetails/>} />
              <Route path="/userprofile" element={<UserProfile/>} />
              <Route path="/userprofile/:id" element={<UserProfile/>} />
              <Route path="/profile/editProfile" element={<EditRefashionerProfile />} />
              <Route path="/createlisting" element={<CreateListing />} />
              <Route path="/listing/:id" element={<ListingScreen />} /> 
              <Route path="/listing/:id/edit" element={<EditListing />} />
              <Route path="/profile/myrefashionrequests" element = {<RefashionRequestsScreen/>}/>
              <Route path = "/report" element = {<DisputeList/>} />
              <Route path = "/report/:id" element = {<DisputeRequestScreen/>} />
              <Route path = "/disputeRequest/:id" element = {<DisputeDetails/>} />
              <Route path = "/disputeRequest" element = {<DisputeDetails/>} />
              <Route path = "/chat" element = {<ChatScreen/>}>
                {/*
                  To generate chatId, use generateChatId() function under constants.js. It takes in the currentUserId, the other userId, and a projectId if any, else null.
                  pass in chatId followed by the username of user you want to chat with. e.g. useNavigate('/chat/1_2_3?user2=someOtherUsername') 
                */}
                <Route path = "/chat/:chatId" element = {<ChatScreen/>}/>
              </Route>
              <Route path = "/home" element = {<HomeScreen/>}/>
              <Route path = "/search" element = {<SearchScreen/>}/>
              <Route path = "/search2" element = {<Search2Screen/>}/>
              <Route path = "/view" element = {<ViewSomeRefashioner/>}/>
              <Route path = "/refashion" element = {<RefashionScreen/>}/>
              <Route path = "/upload" element = {<CreateProjectRequest/>}>
                <Route path = "/upload/:id" element = {<CreateProjectRequest/>}/>
              </Route>
              <Route path = "/complete/:id" element={<CompletedScreen/>} />
              <Route path = "/order" element = {<OrderPage/>} />
              <Route path = "/orderDetails" element = {<OrderDetails/>}>
                <Route path = "/orderDetails/:id" element = {<OrderDetails/>}/>
              </Route>
              <Route path = "/requestDetails404" element = {<ErrorPage/>} />
              <Route path = "/requestDetails" element = {<RequestDetails/>}>
                <Route path = "/requestDetails/:id" element = {<RequestDetails/>}/>
              </Route>
              <Route path = "/searchResults/:id/:keyword" element ={<SearchResultsScreen />} />
              <Route path = "/searchResults/:id" element ={<SearchResultsScreen />} />
              <Route path = "/searchResults2/:id/:keyword" element ={<Search2ResultsScreen />} />
              <Route path = "/searchResults2/:id" element ={<Search2ResultsScreen />} />
              <Route path = "/viewReviews" element={<ViewReviews/>} />
              <Route path = "/viewReviews/:id" element={<ViewReviews/>} />
              <Route path = "/pendingReview" element={<PendingReview/>} />
              <Route path = "/marketplace" element={<EcommHome/>} />
              <Route path = "/marketplaceOrder" element={<MarketplaceOrder/>} />
              <Route path="/createEcommListing/:id" element={<CreateEcommListing/>} />
              <Route path="/createEcommListing" element={<CreateEcommListing/>} />
              <Route path = "/marketplaceListing" element = {<Listing/>}>
                <Route path = "/marketplaceListing/:id" element = {<Listing/>}/>
              </Route>
              <Route path="/deadstockListing/:id" element={<DeadstockDetails />} /> 
              <Route path = "/refashioner/start" element = {<GetStartedPage/>}/>
              <Route path = "/refashioner/home" element = {<RefashionerHome/>}/>
              <Route path = "/refashioner/earnings" element = {<EarningsPage/>}/>
              <Route path = "/refashioner/order" element = {<RefashionerOrderPage/>}/>
              <Route path = "/refashioner/requestDetails" element = {<RefashionerRequestDetails/>}>
                <Route path = "/refashioner/requestDetails/:id" element = {<RefashionerRequestDetails/>} />
              </Route>
              <Route path = "/refashioner/viewRequests" element = {<RefashionerRequestPage/>}/>
              <Route path = "/payment/:offerId" element = {<PaymentScreen/>}/>
              <Route path = "/viewRequestOffers" element={<BidderPage/>}>
                <Route path = "/viewRequestOffers/:id" element={<BidderPage/>} />
              </Route>
              <Route path = "/businessRequestDetails" element = {<RefashionerRequestDetails/>}>
                <Route path = "/businessRequestDetails/:id" element = {<RefashionerRequestDetails/>} />
              </Route>
              <Route path="/BusinessProfile" element={<BusinessProfile />}>
                <Route path="/BusinessProfile/:id" element={<BusinessProfile />} />
              </Route>
              <Route path="/viewBusiness" element={<ViewBusiness />} />
              <Route exact path = "/" element = {<LoginScreen/>}/>
              <Route path='/swap' element={<SwapScreen />} />
              <Route path='/swap/create' element={<CreateSwap />} />
              <Route path='/swap/order' element={<SwapOrder />} />
              <Route path='/swapRequest/:id' element={<SwapRequest />} />
              <Route path='/swapItem/:id' element={<SwapItem />} />
              <Route path='/about' element={<AboutUs />} />
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