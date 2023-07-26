import * as React from 'react';
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Box, Button, CircularProgress, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Modal, Card, CardContent } from '@mui/material';
import CustomButton from '../CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import { ERROR } from '../../Redux/actionTypes';
import { Paper } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCcVisa,faCcAmex, faCcMastercard, } from '@fortawesome/free-brands-svg-icons'
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { placeOrder, placeOrderAO, placeOrderMPL } from '../../API/stripeApi';
import { apiWrapper } from '../../API/index';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { placeDeliveryOrder } from '../../API/deliveryApi';

export default function CheckoutForm({clientSecretKey, selectedPaymentMethod={}, handleBack, offerId, isMPL}) {
    const[searchParams, setSearchParams] = useSearchParams();
    const stripe = useStripe();
    const elements = useElements();
    const [message,setMessage] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [orderTransactionId, setOrderTransactionId] = React.useState('');
    const jntToken = useSelector((state) => state.jntToken);
    let timer = null;

    const navigate = useNavigate();

    const dispatch = useDispatch();

    React.useEffect(() => {
      return () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
    },[errorMessage])

    React.useEffect(() => {
      if(isSuccess) {
        console.log('should redirect');
        
        return () => clearTimeout(timer);
      }
    }, [timer])

    function cardIcon(brand) {
      switch(brand.toLowerCase()) {
          case 'visa':
              return <FontAwesomeIcon fontSize={20} icon={faCcVisa} color='#FB7A56' />
          case 'amex':
              return <FontAwesomeIcon fontSize={20} icon={faCcAmex} color='#FB7A56'/>
          case 'mastercard':
              return <FontAwesomeIcon fontSize={20} icon={faCcMastercard} color='#FB7A56'/>
          default:
              return <CreditCardIcon fontSize='medium' color='secondary'/>
      }
    }

    React.useEffect(() => {
        if (!stripe) {
          return;
        }
    
        const clientSecret = clientSecretKey;

        if (!clientSecret) {
          return;
        }
    
        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
          switch (paymentIntent.status) {
            case "succeeded":
              setIsSuccess(true);
              break;
            default:
              console.log("STATUS: " + paymentIntent.status);
              break;
          }
        });

      }, [stripe]);

      const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("MAKING PAYMENT");
    
        if (!stripe || !elements) {
          return;
        }
    
        setIsLoading(true);

        let stripeRes;

        if(!selectedPaymentMethod) {
          stripeRes = await stripe.confirmPayment({
            elements,
            redirect: 'if_required'
          });
        } else {
          stripeRes = await stripe.confirmCardPayment(clientSecretKey, {
            payment_method: selectedPaymentMethod.id,
          });
        }

        if (stripeRes.error) {
          dispatch({type: ERROR, data : stripeRes.error.message});
        } else {
          //let res = await apiWrapper(placeOrder(offerId), "Error creating order. Please contact admin for assistance.", true);
          let res;
          if(searchParams.has('delivery') === true) {
            res = await apiWrapper(placeDeliveryOrder(offerId,jntToken),  "Error occurred while paying for delivery. Please contact admin for assistance.", true);
          } else if(searchParams.has('order') === true) {
            res = await apiWrapper(placeOrderAO(searchParams.get('order'),offerId), "Error creating AddOn order. Please contact admin for assistance.", true);
          } else {
            res = await apiWrapper(placeOrder(offerId), "Error creating order. Please contact admin for assistance.", true);
          }
          // if(isMPL) {
          //   res = await apiWrapper(placeOrderMPL(offerId), "Error creating Market order. Please contact admin for assistance.", true);
          // } else {
          //   res = await apiWrapper(placeOrder(offerId), "Error creating Project order. Please contact admin for assistance.", true);
          // }
          console.log("ORDER: ", JSON.stringify(res));
          
          if(!res) {
            dispatch({type: ERROR, data : "Error creating order. Please contact admin for assistance."});
          } else {
            setOrderTransactionId(res.data.order2.id);
            setIsSuccess(true);
            timer = setTimeout(() => {navigate(-1)}, 3000);
          }
        }
    
        setIsLoading(false);
      };

      return (
        <>
        <Box component='form' onSubmit={handleSubmit}>
            {!selectedPaymentMethod ? <PaymentElement/> : 
              <Paper elevation={1} sx={{marginBottom: 1, backgroundColor : 'transparent', overflow: 'hidden'}}>
                  <ListItem>
                      <ListItemIcon sx={{minWidth: 0, margin: 1}}>
                          {cardIcon(selectedPaymentMethod.card.brand)}
                      </ListItemIcon>
                      <ListItemText>
                          **** **** **** {selectedPaymentMethod.card.last4}
                      </ListItemText>
                      <ListItemText sx={{textAlign:'right'}}>
                          Exp: {selectedPaymentMethod.card.exp_month.toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false})}/{selectedPaymentMethod.card.exp_year%100}
                      </ListItemText>
                  </ListItem>
              </Paper>}
            {!isLoading ?
            <CustomButton type="submit" disabled={ isLoading ||!stripe || !elements} variant='contained' fullWidth color ='secondary' sx={{marginTop : 2, marginBottom : 1}}>
                Make Payment
            </CustomButton>
            : <Box sx={{display : 'flex', width: '100%', justifyContent : 'center', alignItems : 'center', marginTop : 2, flexDirection : 'column'}}>
                <CircularProgress size={30} color='secondary'/>
              </Box>}
            <CustomButton disabled={isLoading || !stripe || !elements} variant='contained' fullWidth sx={{marginTop : 2, marginBottom : 1, backgroundColor : 'secondary.light'}} onClick={handleBack}>
                Back
            </CustomButton>
        </Box>
        <Modal open={isSuccess} sx= {{display : 'flex', justifyContent: 'center', alignItems : 'center'}}>
          <Card>
            <CardContent sx={{display: 'flex', justifyContent : 'center', alignItems : 'center', flexDirection : 'column', margin : 2, ":last-child" : {paddingBottom : 2}}}>
              <CheckCircleIcon color='success' sx={{fontSize : 60}}/>
              <Typography sx={{paddingTop: 2}} fontWeight={700} gutterBottom>Order created: ALT-INV-{orderTransactionId}</Typography>
              <Typography variant='body2' color='GrayText'>Redirecting back to chat...</Typography>
            </CardContent>
          </Card>
        </Modal>
        </>
      );

}