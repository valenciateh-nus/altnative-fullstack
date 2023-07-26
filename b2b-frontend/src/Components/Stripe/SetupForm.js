import * as React from 'react';
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import CustomButton from '../CustomButton';
import { useDispatch } from 'react-redux';
import { ERROR } from '../../Redux/actionTypes';
import { apiWrapper } from '../../API';
import { saveCard } from '../../API/stripeApi';

export default function SetupForm({clientSecretKey, refreshSetupIntent}) {
    const stripe = useStripe();
    const elements = useElements();
    const [message,setMessage] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    const dispatch = useDispatch();

    React.useEffect(() => {
      if(errorMessage.length > 0) {
        dispatch({type : ERROR, data:errorMessage})
        setErrorMessage("");
      }
    },[errorMessage])


      const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("MAKING PAYMENT");
    
        if (!stripe || !elements) {
          return;
        }
    
        setIsLoading(true);
    
        const stripeRes = await stripe.confirmSetup({
          elements,
          redirect: 'if_required',
        });

        console.log("Stripe Res: ", stripeRes.setupIntent.id);

        

        if (stripeRes.error) {
          setErrorMessage(stripeRes.error.message);
          //dispatch({type: ERROR, data : error.message});
        } else {
            const setupId = stripeRes.setupIntent.id
          const saveRes = await apiWrapper(saveCard(setupId), "Error occurred while trying to save card details.", true);
          if(saveRes) {
            refreshSetupIntent(true);
            console.log("add payment method success");
          } else {
            //delete payment setup
          }
        }
    
        setIsLoading(false);
      };

      return (
        <Box component='form' onSubmit={handleSubmit}>
            <PaymentElement/>
            {!isLoading ?
            <CustomButton type="submit" disabled={isLoading || !stripe || !elements} variant='contained' fullWidth color ='secondary' sx={{marginTop : 2, marginBottom : 1}}>
                Add Payment Method
            </CustomButton>
            : <Box sx={{display : 'flex', width: '100%', justifyContent : 'center', alignItems : 'center', marginTop : 2, flexDirection : 'column'}}>
              <CircularProgress size={30} color='secondary'/>
              {/*<Typography>{message}</Typography>*/}
              </Box>}
        </Box>
      );

}