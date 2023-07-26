import * as React from 'react';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from '../Components/Stripe/CheckoutForm';
import { Card, CardContent, CircularProgress, Container, Divider, List, ListItemButton, ListItemIcon, ListItemText, MobileStepper, Paper, Typography } from '@mui/material';
import { retrieveOfferById } from '../API/offerApi';
import OfferChatCard from '../Components/Chat/OfferChatCard';
import { useNavigate, useParams } from 'react-router';
import { Box } from '@mui/system';
import { useMediaQuery } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCcVisa,faCcAmex, faCcMastercard, } from '@fortawesome/free-brands-svg-icons'
import CreditCardIcon from '@mui/icons-material/CreditCard';
import {stripePromise} from '../App';
import { apiWrapper } from '../API';
import { createPaymentIntent, getCards } from '../API/stripeApi';
import { useSelector } from 'react-redux';
import { OFFER_ACCEPTED, OFFER_PENDING_PAYMENT, OFFER_PENDING_RESPONSE, OFFER_REJECTED } from '../Components/Chat/OfferStatuses';
import { retrieveDeliveryById } from '../API/deliveryApi';
import DeliveryInfoCard from '../Components/Milestone/DeliveryInfoCard';
import { useSearchParams } from 'react-router-dom';

export default function PaymentScreen() {
    const [clientSecret, setClientSecret] = React.useState();
    const params = useParams();
    const [offer, setOffer] = React.useState();
    const [paymentIntent, setPaymentIntent] = React.useState();
    const [isLoading, setIsLoading] = React.useState(false);
    const mobile = !useMediaQuery(theme => theme.breakpoints.up('md'));
    const [activeStep, setActiveStep] = React.useState(0);
    const [existingPaymentMethods, setExistingPaymentMethods] = React.useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState();
    const currUser = useSelector((state) => state.authData);
    const[searchParams, setSearchParams] = useSearchParams();

    const history = useNavigate();

    React.useEffect(() => {
      if(!params.offerId) {
        history(-1);
      }
      setIsLoading(true);
      runOnce();
    },[])

    React.useEffect(() => {
      if(offer && (offer.offerStatus === OFFER_ACCEPTED || offer.offerStatus === OFFER_REJECTED || offer.trackingNumber) ) {
        console.log("OFFER STATUS: ", offer.offerStatus)
        console.log('CONDITION:', (offer.refashioneeUsername !== currUser?.sub && !offer.marketplaceListing) ? "true" : 'false')
        history(-1);
      }
    },[offer])

    async function loadOffer() {
      try {
          setOffer((await retrieveOfferById(params.offerId)).data);
      } catch (err) {
          console.error("Error retrieving offerId: " + params.offerId, "ERR: ",  err)
          history(-1);
      }
      return;
    }

    async function loadDelivery() {
      try {
        setOffer((await apiWrapper(retrieveDeliveryById(params.offerId),"",true)).data);
      } catch (err) {
          console.error("Error retrieving deliveryId: " + params.offerId, "ERR: ",  err)
          history(-1);
      }
      return;
    }

    async function createPaymentIntentFunction() {
      const res = await apiWrapper(createPaymentIntent({offerId :  offer?.deliveryStatus ? offer.offer.id :offer.id}), null, true);
      console.log("PAYMENT INTENT: " + JSON.stringify(res));
      setPaymentIntent(res.data);
      console.log("CLIENT SECRET: " + res.data['client_secret']);
      setClientSecret(res.data['client_secret']);
      setIsLoading(false);
      return;
    }

    async function loadPaymentMethods() {
      const res = await apiWrapper(getCards(), null, true);
      console.log("CARD DATA: " + JSON.stringify(res));
      setExistingPaymentMethods(res.data.data);
      return res;
    }

    React.useEffect(() => {
      if(activeStep === 1 ) {
        setIsLoading(true);
        createPaymentIntentFunction();
      }
    },[activeStep])

    async function runOnce() {
      if(searchParams.has('delivery')) {
        await loadDelivery();
      } else {
        await loadOffer();
      }
      const payments = await loadPaymentMethods();
      setIsLoading(false);
    }

    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };

    function handleClickSetPaymentMethod(pm) {
      setSelectedPaymentMethod(pm);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

    function cardIcon(brand) {
      switch(brand.toLowerCase()) { 
          case 'visa':
              return <FontAwesomeIcon fontSize={20} icon={faCcVisa} color='#FB7A56' />
          case 'amex':
              return <FontAwesomeIcon fontSize={20} icon={faCcAmex} color='#FB7A56'/>
          case 'mastercard':
              return <FontAwesomeIcon fontSize={20} icon={faCcMastercard} color='#FB7A56'/>
          default:
              return <CreditCardIcon fontSize={20} color='secondary'/>
      }
    }

    function getStepContent() {
      switch (activeStep) {
        case 0:
          return (
            <Box sx={{width: '100%', display : 'flex', justifyContent : 'center', flexDirection : 'column'}}>
            <Typography variant='caption' color='GrayText'>Select a payment method</Typography>
            <List>
                {existingPaymentMethods.length > 0 && existingPaymentMethods.map((pm, i) => (
                    <Paper elevation={1} sx={{marginBottom: 1, backgroundColor : 'transparent', overflow: 'hidden'}} key={i}>
                        <ListItemButton onClick={() => handleClickSetPaymentMethod(pm)}>
                            <ListItemIcon sx={{minWidth: 0, margin: 1}}>
                                {cardIcon(pm.card.brand)}
                            </ListItemIcon>
                            <ListItemText>
                                **** **** **** {pm.card.last4}
                            </ListItemText>
                            <ListItemText sx={{textAlign:'right'}}>
                                Exp: {pm.card.exp_month.toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false})}/{pm.card.exp_year%100}
                            </ListItemText>
                        </ListItemButton>
                    </Paper>
                ))}
                <Paper elevation={1} sx={{marginBottom: 1, backgroundColor : 'transparent',overflow: 'hidden'}}>
                  <ListItemButton onClick={() => handleClickSetPaymentMethod(null)}>
                    <ListItemText>
                      Enter card details
                    </ListItemText>
                  </ListItemButton>
                </Paper>
            </List>
            </Box>
          )
        case 1:
          return (
            <Box sx={{width: '100%', display : 'flex', justifyContent : 'center', flexDirection : 'column'}}>
            <Typography variant='caption' color='GrayText'>{selectedPaymentMethod === null ?  'Enter card details.' : 'Confirm card selection.'}</Typography>
            {clientSecret && <Elements options={options} stripe = {stripePromise}>
                <CheckoutForm clientSecretKey={clientSecret} selectedPaymentMethod={selectedPaymentMethod} handleBack={handleBack} offerId={offer.id} isMPL={offer.marketplaceListing}/>
            </Elements>}
            </Box>
          )
      }
    }

    return (
      <Container maxWidth="xs" sx={{marginTop: mobile ? '10%' : 2}}>
        <Card>
          {!isLoading ? 
          <CardContent>
            <Typography variant='h5' fontWeight={700}>Order Summary</Typography>
              {!offer?.deliveryStatus ? <OfferChatCard offerId={params.offerId} offerObject={offer} showButtons={false} maxWidth={'100%'}/>
              : <DeliveryInfoCard delivery={offer}/>}
            <Box sx={{width: '100%', display : 'flex', justifyContent : 'space-between', marginTop : 2}}>
              <Typography variant='caption' color='GrayText'>Subtotal</Typography>
              <Typography variant='caption' color='GrayText'>SGD${Number(offer?.price || offer?.offer?.price).toFixed(2)}</Typography>
            </Box>
            <MobileStepper
              variant="progress"
              steps={2}
              position="static"
              activeStep={activeStep}
              sx={{ width: '100%', flexGrow: 1, background: 'none', display : 'flex', justifyContent : 'center', alignItems : 'center', marginBottom : 1}}
              LinearProgressProps = {{sx : {backgroundColor : 'secondary.light', '& .MuiLinearProgress-bar' : {backgroundColor : 'secondary.main'}, width : '100%'}}}
            />
            {getStepContent()}
          </CardContent>
          : <CardContent sx={{display : 'flex', justifyContent: 'center', alignItems: "center"}}>
            <CircularProgress color="secondary"/>
          </CardContent>}
        </Card>
      </Container>
    )
}

