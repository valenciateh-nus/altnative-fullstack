import { useNavigate, useParams } from "react-router";
import React from 'react';
import { apiWrapper, deleteRequestById } from "../API";
import { BLIST, MLIST, PLIST, PREQ } from "./ListingManagementScreen";
import { retrieveProjectListingById, retrieveProjectRequestById } from "../API/projectApi";
import { deleteListingById as deleteMarketplaceListing, getMarketplaceListingById } from "../API/marketplaceApi";
import { ERROR } from "../Redux/actionTypes";
import { Box, Button, Chip, CircularProgress, Container, Dialog, Grid, IconButton, Typography, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";
import ProfileCard from "../Components/ProfileCard";
import { useDispatch, useSelector } from "react-redux";
import { openImageModal } from "../Redux/actions";
import InContainerLoading from '../Components/InContainerLoading';
import { generateChatId, toTitleCase } from "../constants";
import { deleteProjectListingById } from "../API/userApi";
import SuccessModal from "../Components/SuccessModal";
import CustomButton from "../Components/CustomButton";
import ConfirmationDialog from "../Components/ConfirmationDialog";
import moment from "moment";
import { acceptDispute, endDispute, rejectDispute, retrieveDisputeByDisputeId } from "../API/disputeApi";
import { getProjectByOrderId, retrieveOrderById } from "../API/orderApi";
import TopicCard from "../Components/Chat/TopicCard"
import Milestone from "../Components/Milestone/Milestone";
import MilestoneViewOnly from "../Components/Milestone/MilestoneViewOnly";
import { useTheme } from "@mui/styles";
import LoadingModal from "../Components/LoadingModal";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';


export default function OrderDetailsScreen() {
    const params = useParams();
    const[order, setOrder] = React.useState({});
    const[listing, setListing] = React.useState({});
    const[isLoading, setIsLoading] = React.useState(false);
    const[isSuccess, setIsSuccess] = React.useState(false);
    const[isLoadingModal, setIsLoadingModal] = React.useState(false);
    const[isConfirmDialog, setIsConfirmDialog] = React.useState(false);
    const[isRejectionModalOpen, setIsRejectionModalOpen] = React.useState(false);
    const[rejectionReason,setRejectionReason] = React.useState('');
    const currUserData = useSelector((state) => state.currUserData);

    const theme = useTheme();

    const chipStyle = {
        background: theme.palette.secondary.main,
        fontWeight: "bold",
        color: "white",
        padding: 1,
        fontSize: 14
    }
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    React.useEffect(() => {
        console.log("ID: ", params.id);
        if(params.id) {
            getData();
        }
    },[params.id])

    async function getData() {
        setIsLoading(true);
        const orderId = await getOrder();
        if(orderId === null) {
            return;
        }
        await getListing(orderId);
        setIsLoading(false);
    }

    async function getOrder() {
        const orderRes = await apiWrapper(retrieveOrderById(params.id),'',true);
        if(orderRes) {
            setOrder(orderRes.data);
            return orderRes.data.id;
        }
        return null;
    }

    async function getListing(orderId) {
        const listingRes = await apiWrapper(getProjectByOrderId(orderId),'',true);
        if(listingRes) {
            setListing(listingRes.data);
        }
    }

    function handlePhotoModal(images, index) {
        dispatch(openImageModal(images, index))
    }
    

    function handleTopicCardClick() {
        if(listing.refashionee) {
            if(listing.isBusiness) {
                navigate(`/listing/${BLIST}/${listing.id}`)
            } else {
                navigate(`/listing/${PREQ}/${listing.id}`)
            }
        } else if(listing.refashioner) {
            navigate(`/listing/${PLIST}/${listing.id}`)
        } else if(listing.marketplaceListingStatus) {
            navigate(`/listing/${MLIST}/${listing.id}`)
        } else {
            dispatch({type: ERROR, data : 'Invalid topic.'});
        }
    }

    return (
        !isLoading ? <Container>
            <IconButton onClick={() => navigate(-1)}>
                <ArrowBackIos/>
            </IconButton>
            <Typography variant='h3' sx={{mt : 2}}>Order #{order.id || 'NO ID'}</Typography>
            <Typography variant='h5' sx={{mt : 2}}>Details</Typography>
            <Typography variant='body1'>Order ID: {order.id || 'NO ID'}</Typography>
            <Typography variant='body1'>Offer ID: {order.offerId || 'NO ID'}</Typography>
            <Typography variant='body1'>Transaction ID: {'ALT-INV-' + order.transactionId || 'NO ID'}</Typography>
            <Typography variant='h5' sx={{mt : 2}}>Order Price</Typography>
            <Typography variant='body1'>{order.orderPrice || 'NO PRICE'}</Typography>
            <Typography variant='h5' sx={{mt : 2}}>Status</Typography>
            <Chip label={order.orderStatus} sx={chipStyle}/>
            <Typography variant='h5' sx={{mt : 2}}>Proposed Completion Date</Typography>
            <Typography variant='body1'>{moment(order.proposedCompletionDate).format('DD MMM yyyy') || 'NO DATE'}</Typography>
            <Typography variant='h5' sx={{mt : 2}}>Buyer</Typography>
            <Typography variant='body1'>{order.appUserUsername || order.buyerUsername}</Typography>
            <Typography variant='h5' sx={{mt : 2}}>Seller</Typography>
            <Typography variant='body1'>{order.refashionerUsername || order.sellerUsername}</Typography>
            <Typography variant='h5' sx={{mt : 2}}>Listing Detail</Typography>
            <Button onClick = {handleTopicCardClick} disableRipple = {true} sx={{textTransform : "none", textAlign :'left'}}>
                <TopicCard title={listing.title} price = {listing.price} image = {listing.imageList?.length > 0 ? listing.imageList[0]?.url : ''}/>
            </Button>
            <Typography variant='h5' sx={{mt : 2}}>Milestones</Typography>
            {order.id && <MilestoneViewOnly orderId={order.id} isRefashionerPOV={order.appUser?.username === order.refashionerUsername || order.appUser?.username === order.sellerUsername}/>}

            <LoadingModal open={isLoadingModal}/>
        </Container>
        : <InContainerLoading/>
    )

}