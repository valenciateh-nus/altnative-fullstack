import * as React from 'react';
import { Elements } from "@stripe/react-stripe-js";
import SetupForm from '../../Components/Stripe/SetupForm';
import { Card, CardContent, CircularProgress, Container, Divider, IconButton, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Paper, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import { Box } from '@mui/system';
import { useMediaQuery } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCcVisa,faCcAmex, faCcMastercard, } from '@fortawesome/free-brands-svg-icons'
import CustomButton from '../../Components/CustomButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { apiWrapper } from '../../API';
import {stripePromise} from '../../App';
import { createSetupIntent, getCards, removeCard } from '../../API/stripeApi';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function PaymentMethodScreen() {
    const [clientSecret, setClientSecret] = React.useState();
    const [existingPaymentMethods, setExistingPaymentMethods] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const mobile = !useMediaQuery(theme => theme.breakpoints.up('md'));
    const [editMode, setEditMode] = React.useState(false);
    const [isRefresh, setIsRefresh] = React.useState(true);

    const history = useNavigate();

    React.useEffect(() => {
      if(isRefresh) {
        setIsLoading(true);
        runOnce();
      }
    },[isRefresh])

    async function onCreateSetupIntent() {
     const res = await apiWrapper(createSetupIntent(), null, true);
     console.log("SETUP INTENT: " + JSON.stringify(res));
     return res;
    }

    async function fetchPaymentMethods() {
        const res = await apiWrapper(getCards(), null, true);
        console.log("CARD DATA: " + JSON.stringify(res));
        setExistingPaymentMethods(res.data.data);
        return res;
    }

    async function runOnce() {
      const setupIntentRes = await onCreateSetupIntent();
      setClientSecret(setupIntentRes.data['client_secret'])
      const payments = await fetchPaymentMethods();
      setIsLoading(false);
      setIsRefresh(false);
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

    async function handleDelete(pmId) {
       //setIsLoading(true);
        const res = await apiWrapper(removeCard(pmId),"", true);
        await fetchPaymentMethods();
       // setIsLoading(false);
    }


    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };

    return (
      <Container>
        <IconButton onClick={() => history(-1)}>
            <ArrowBackIcon />
        </IconButton>  
        <Card>
          {!isLoading ? 
          <CardContent>
            <Typography variant='h5' fontWeight={700}>Add Payment Method</Typography>
            <Divider orientation="horizontal" sx={{marginTop: 2, marginBottom: 2}}/>
            {clientSecret && <Elements options={options} stripe = {stripePromise}>
                <SetupForm clientSecretKey={clientSecret} refreshSetupIntent={setIsRefresh}/>
            </Elements>}
            {existingPaymentMethods.length > 0 && 
            <Box sx={{marginTop: 2}}>
            <Box sx={{display : 'flex', flexDirection : 'row', justifyContent : 'space-between', flexGrow : 1}}>
            <Typography variant='h6' fontWeight={600}>Existing Payment Methods</Typography>
            <CustomButton variant='contained' sx={{backgroundColor : `${editMode ? 'secondary.main' : 'secondary.light'}`}} onClick={() => setEditMode(!editMode)}>Edit</CustomButton>
            </Box>
            <Divider orientation="horizontal" sx={{marginTop: 2, marginBottom: 2}}/>
            <List>
                {existingPaymentMethods.map((pm, i) => (
                    <Paper elevation={1} sx={{marginBottom: 1, backgroundColor : 'transparent'}} key={i}>
                        <ListItem>
                            <ListItemIcon sx={{minWidth: 0, margin: 1}}>
                                {cardIcon(pm.card.brand)}
                            </ListItemIcon>
                            <ListItemText>
                                **** **** **** {pm.card.last4}
                            </ListItemText>
                            <ListItemText sx={{textAlign:'right'}}>
                                Exp: {pm.card.exp_month.toLocaleString('en-US', {minimumIntegerDigits: 2,useGrouping: false})}/{pm.card.exp_year%100}
                            </ListItemText>
                            {editMode && <IconButton edge="end" aria-label={`delete-${i}`} onClick={() => handleDelete(pm.id)}>
                                <DeleteIcon color = 'secondary'/>
                            </IconButton>}
                        </ListItem>
                        
                    </Paper>
                ))}
            </List>
            </Box>}
          </CardContent>
          : <CardContent sx={{display : 'flex', justifyContent: 'center', alignItems: "center"}}>
            <CircularProgress color="secondary"/>
          </CardContent>}
        </Card>
      </Container>
    )
}

