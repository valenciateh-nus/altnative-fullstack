import { useNavigate, useParams } from "react-router";
import React from 'react';
import { apiWrapper, deleteRequestById } from "../API";
import { BLIST, MLIST, PLIST, PREQ } from "./ListingManagementScreen";
import { retrieveProjectListingById, retrieveProjectRequestById } from "../API/projectApi";
import { deleteListingById as deleteMarketplaceListing, getMarketplaceListingById, getMPLFromOrderId } from "../API/marketplaceApi";
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



const DISPUTE_REQUEST_PENDING_REVIEW = 'DISPUTE_REQUEST_PENDING_REVIEW';
const DISPUTE_REQUEST_ACCEPTED = 'DISPUTE_REQUEST_ACCEPTED';
const DISPUTE_REQUEST_REJECTED = 'DISPUTE_REQUEST_REJECTED';
const DISPUTE_REQUEST_REFUND_PENDING = 'DISPUTE_REQUEST_REFUND_PENDING';
const DISPUTE_REQUEST_COMPLETED = 'DISPUTE_REQUEST_COMPLETED';

export default function DisputeDetailsScreen() {
    const params = useParams();
    const [dispute, setDispute] = React.useState({});
    const [order, setOrder] = React.useState({});
    const [listing, setListing] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [isLoadingModal, setIsLoadingModal] = React.useState(false);
    const [isConfirmDialog, setIsConfirmDialog] = React.useState(false);
    const [isRejectionModalOpen, setIsRejectionModalOpen] = React.useState(false);
    const [rejectionReason, setRejectionReason] = React.useState('');
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
        if (params.id) {
            getData();
        }
    }, [params.id])

    const handleChat = () => {
        const chatId = generateChatId(currUserData.id, dispute.appUser.id, null);
        navigate(`/chat/${chatId}?user2=${dispute.appUser.username}`);
    }

    async function getData() {
        setIsLoading(true);
        const orderId = await getDispute();
        if (orderId === null) {
            return;
        }
        await getOrder(orderId);
        await getListing(orderId)
        setIsLoading(false);
    }

    async function getDispute() {
        console.log("GETS HERE2");
        const res = await apiWrapper(retrieveDisputeByDisputeId(params.id), '', true);
        if (res) {
            console.log("DISPUTE DATA: " + res.data)
            setDispute(res.data);
            return res.data.orderId;
        }
        console.log("FAIL TO GET DISPUTE");
        return null;
    }

    async function getOrder(orderId) {
        const orderRes = await apiWrapper(retrieveOrderById(orderId), '', true);
        if (orderRes) {
            setOrder(orderRes.data);
        }
    }

    async function getListing(orderId) {
        const listingRes = await apiWrapper(getProjectByOrderId(orderId), '', true);
        if (listingRes) {
            if (listingRes.data !== '') {
                setListing(listingRes.data);
            } else {
                const listingRes2 = await apiWrapper(getMPLFromOrderId(orderId), '', true);
                if (listingRes2) {
                    setListing(listingRes2.data);
                }
            }
        }
    }

    function handlePhotoModal(images, index) {
        dispatch(openImageModal(images, index))
    }

    function handleCloseSuccess() {
        setIsSuccess(false);
    }

    function handleTopicCardClick() {
        if (listing.refashionee) {
            if (listing.isBusiness) {
                navigate(`/listing/${BLIST}/${listing.id}`)
            } else {
                navigate(`/listing/${PREQ}/${listing.id}`)
            }
        } else if (listing.refashioner) {
            navigate(`/listing/${PLIST}/${listing.id}`)
        } else if (listing.marketplaceListingStatus) {
            navigate(`/listing/${MLIST}/${listing.id}`)
        } else {
            dispatch({ type: ERROR, data: 'Invalid topic.' });
        }
    }

    const handleChangeRejection = (e) => {
        setRejectionReason(e.target.value);
    }

    const handleOnKeyDown = async (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleReject();
        }

    }

    async function handleAccept() {
        setIsLoadingModal(true);
        const res = await apiWrapper(acceptDispute(params.id), '', true);
        if (res) {
            getData();
        }
        setIsConfirmDialog(false);
        setIsLoadingModal(false);
    }

    async function handleReject() {
        setIsLoadingModal(true);
        const res = await apiWrapper(endDispute(params.id, rejectionReason), '', true);
        if (res) {
            getData();
        }
        setIsRejectionModalOpen(false);
        setIsLoadingModal(false);
    }



    return (
        !isLoading ? <Container>
            <IconButton onClick={() => navigate(-1)}>
                <ArrowBackIos />
            </IconButton>
            {dispute?.photos?.length > 0 && <Box sx={{ overflowX: 'scroll', display: 'flex', justifyContent: 'center', alignContent: 'center', mt: 2, mb: 2, height: '300px', width: 'auto' }}>
                <img src={dispute.photos?.length > 0 ? dispute.photos[0]?.url : ''} onClick={() => handlePhotoModal(dispute.photos.map(({ url }) => url), 0)} style={{ background: "none", height: '300px', alignSelf: 'center', cursor: 'pointer' }} />
            </Box>}
            {dispute.appUser && <ProfileCard user={dispute.appUser} />}
            <Typography variant='h5' sx={{ mt: 2 }}>Order Details</Typography>
            <Typography variant='body1'>Order ID: {order.id || 'NO ID'}</Typography>
            <Typography variant='body1'>Offer ID: {order.offerId || 'NO ID'}</Typography>
            <Typography variant='body1'>Transaction ID: {'ALT-INV-' + order.transactionId || 'NO ID'}</Typography>
            <Typography variant='h5' sx={{ mt: 2 }}>Description</Typography>
            <Typography variant='body1'>{dispute.description || 'NO DESCRIPTION'}</Typography>
            <Typography variant='h5' sx={{ mt: 2 }}>Admin Remarks</Typography>
            <Typography variant='body1'>{dispute.adminRemarks || 'NO REMARKS'}</Typography>
            <Typography variant='h5' sx={{ mt: 2 }}>Status</Typography>
            <Chip label={dispute.disputeStatus} sx={chipStyle} />
            {dispute?.rejectRemarks && <><Typography variant='h5' sx={{ mt: 2 }}>Rejection reason</Typography>
                <Typography variant='body1'>{dispute?.rejectRemarks}</Typography></>}

            <Typography variant='h5' sx={{ mt: 2 }}>Listing Detail</Typography>
            <Button onClick={handleTopicCardClick} disableRipple={true} sx={{ textTransform: "none", textAlign: 'left' }}>
                <TopicCard title={listing.title} price={listing.price} image={listing.imageList?.length > 0 ? listing.imageList[0]?.url : ''} />
            </Button>
            <Typography variant='h5' sx={{ mt: 2 }}>Milestones</Typography>
            {order.id && <MilestoneViewOnly orderId={order.id} isRefashionerPOV={dispute.appUser?.username === order.refashionerUsername} />}
            <Box sx={{ display: 'flex', flexDirection: 'row', mt: 2, mb: 2, justifyContent: 'center', alignItems: 'center' }}>
                {isLoading ? <CircularProgress color='secondary' /> :
                    <>
                        {['DISPUTE_REQUEST_PENDING_REVIEW', 'DISPUTE_REQUEST_REJECTED'].includes(dispute.disputeStatus) ?
                            <Box sx={{ display: 'flex', flexDirection: 'row', flexGrow: 1 }}>
                                <CustomButton variant='contained' size='large' fullWidth onClick={() => setIsRejectionModalOpen(true)} sx={{ backgroundColor: 'secondary.light', mr: 2 }}>Reject</CustomButton>
                                <CustomButton variant='contained' size='large' fullWidth onClick={() => setIsConfirmDialog(true)} color='secondary'>Approve</CustomButton>
                            </Box>
                            :
                            <CustomButton variant='contained' size='large' fullWidth disabled={true} sx={{ backgroundColor: 'secondary.light' }}>{dispute.disputeStatus}</CustomButton>
                        }
                    </>}
            </Box>
            <CustomButton onClick={handleChat} variant="contained" fullWidth size='large' color='secondary'>
                Chat with User
            </CustomButton>
            <ConfirmationDialog open={isConfirmDialog} handleClose={() => setIsConfirmDialog(false)}
                handleConfirm={handleAccept} handleCancel={() => setIsConfirmDialog(false)} header={'Confirm Refund?'}
                dialogText={'Are you sure you want to accept this dispute request? This process is irreversible and the funds, if any, will be returned to the disputer.'}
            />
            <Dialog
                open={isRejectionModalOpen}
                onClose={() => setIsRejectionModalOpen(false)}
                aria-labelledby="alert-dialog-final-rejection"
                aria-describedby="alert-dialog-final-rejection"
                onBackdropClick={() => setIsRejectionModalOpen(false)}
            >
                <Box sx={{ backgroundColor: 'primary.main', display: 'flex', flexDirection: 'row', maxWidth: '450px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '15%', minWidth: '64px', paddingTop: '16px' }}>
                        <InfoOutlinedIcon fontSize='large' />
                    </Box>
                    <Box>
                        <DialogTitle id="final-rejection" sx={{ paddingLeft: 0, paddingRight: 0 }}>
                            Confirm Rejection?
                        </DialogTitle>
                        <DialogContent sx={{ padding: 0 }}>
                            <DialogContentText id="alert-dialog-description">
                                You are about to reject this dispute request. Please provide a reason.
                            </DialogContentText>
                            <TextField
                                variant='standard'
                                InputProps={{ disableUnderline: true }} value={rejectionReason}
                                onChange={handleChangeRejection}
                                onKeyDown={handleOnKeyDown}
                                multiline
                                rows={3}
                                fullWidth
                                sx={{ overflowY: 'scroll', backgroundColor: 'white', marginTop: '16px', padding: 1, borderRadius: '4px' }}
                            />
                        </DialogContent>
                        <DialogActions sx={{ marginBottom: '16px' }}>
                            <CustomButton variant='contained' onClick={() => setIsRejectionModalOpen(false)} sx={{ backgroundColor: 'secondary.light' }}>Cancel</CustomButton>
                            <CustomButton variant='contained' color="secondary" onClick={handleReject} autoFocus>
                                Reject
                            </CustomButton>
                        </DialogActions>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '15%', minWidth: '64px', paddingTop: '16px' }} />
                </Box>
            </Dialog>
            <SuccessModal open={isSuccess} onClose={handleCloseSuccess} onCallback={getListing} text='Dispute accepted' />
            <LoadingModal open={isLoadingModal} />
        </Container>
            : <InContainerLoading />
    )

}