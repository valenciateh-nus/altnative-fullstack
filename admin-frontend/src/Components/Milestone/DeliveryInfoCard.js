import { Card, CardContent, Divider, Box, Typography, Link } from "@mui/material";
import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { apiWrapper } from "../../API";
import { createJNTDelivery, createOfferForDelivery } from "../../API/deliveryApi";
import { getConnote } from "../../API/jntApi";
import CustomButton from "../CustomButton";
import InContainerLoading from "../InContainerLoading";

const dummyConnote = 'https://uat-jts.jtexpress.sg/jts-service-label/api/gateway/v1/print/6c589646a80e4a4c850c1426fe499f6e/A6'

export default function DeliveryInfoCard({delivery, redacted = false, handleRefresh}) {
    const[connote, setConnote] = React.useState();
    const[isLoading,setIsLoading] = React.useState(false);
    const[isLoadingModal, setIsLoadingModal] = React.useState(false);

    const jntToken = useSelector((state) => state.jntToken);
    const navigate = useNavigate();
 
    React.useEffect(() => {
        if(delivery.trackingNumber && !redacted) {
            getConnoteFunc();
        }
    },[delivery])

    async function getConnoteFunc() {
        setIsLoading(true);
        const res = await apiWrapper(getConnote(delivery.trackingNumber),'Could not fetch connote',false);
        if(res?.data) {
            setConnote(res.data.connote_label_url);
        }
        setIsLoading(false);
    }

    async function placeJNTDelivery() {
        setIsLoadingModal(true);
        //const res = await apiWrapper(createJNTDelivery(jntToken,delivery.id),'',true);
        const res = await apiWrapper(createOfferForDelivery(delivery.id));
        if(res) {
            console.log("SUCCESS CREATE JNT")
            navigate(`/payment/${delivery.id}?delivery=true`)
            //handleRefresh();
        }
        setIsLoadingModal(false);

    }

    return (
        <Card>
            <CardContent>
                {!isLoading ? <>
                <Typography fontWeight={600} variant='body1'>
                    Delivery Information
                </Typography>
                <Divider orientaition = 'horizontal' sx={{mb:2,mt:1}}/>
                {delivery.trackingNumber && <Box sx={{display : 'flex',flexDirection : 'column', wordBreak : 'break-word',mb:1}}>
                    <Typography variant='body2'>
                        Reference number: 
                    </Typography>
                     <Typography variant='body2' fontWeight={600}>
                        {delivery.trackingNumber || 'PENDING'}
                    </Typography>
                </Box>}
                {!redacted && <Box sx={{display : 'flex', flexDirection : 'column', wordBreak : 'break-word', mb:1}}>
                    <Typography variant='body2' >
                        Pick-up: 
                    </Typography>
                    <Typography variant='body2'fontWeight={600}>
                        {delivery.originAddress}
                    </Typography>
                </Box>}
                <Box sx={{display : 'flex',flexDirection : 'column', wordBreak : 'break-word',mb:1}}>
                    <Typography variant='body2'>
                        Drop-off: 
                    </Typography>
                    <Typography variant='body2' fontWeight={600}>
                        {delivery.destinationAddress?.length > 0 ? delivery.destinationAddress : 'PENDING'}
                    </Typography>
                </Box>
                {!redacted && <Box sx={{display : 'flex', flexDirection : 'column', wordBreak : 'break-word',mb:1}}>
                    <Typography variant='body2'>
                        Expected Pick-up date:
                    </Typography>
                    <Typography variant='body2' fontWeight={600}>
                        {moment(delivery.arrangedDate).format('DD MMM yyyy')}
                    </Typography>
                </Box>}
                {connote && !redacted && <Box sx={{display : 'flex',flexDirection : 'column', wordBreak : 'break-word',mb:1}}>
                    <Typography variant='body2'>
                        Waybill:
                    </Typography>
                    <Typography variant='body2' color='error' fontWeight={700}>**Please print and attach to your parcel**</Typography>
                     <Link variant='body2' fontWeight={600} href={connote} color='secondary' target="_blank">
                        {connote || 'PENDING'}
                    </Link>
                    
                </Box>}
                {!redacted && !delivery.trackingNumber && delivery.destinationAddress && typeof handleRefresh === 'function' && 
                    <CustomButton variant='contained' color='secondary' fullWidth onClick={placeJNTDelivery}>
                        Schedule delivery
                    </CustomButton>
                }
                </> : <InContainerLoading mt={2}/>}
            </CardContent>
        </Card>
    )
}