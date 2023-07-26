import { Button, Container, Box, Grid, Typography, IconButton, Chip, Divider } from '@mui/material'
import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { makeStyles } from "@mui/styles";

import MarketplaceImg from '../../Components/Images/MarketplaceImage.png';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
//import HeartButton from '../Components/Orders/HeartButton';
import DefaultImage from '../../assets/EmptyListing.png';
import MoreVertIcon from '@mui/icons-material/MoreVert';
//import CustomButton from "../Components/CustomButton";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

import { useDispatch, useSelector } from 'react-redux';
import { ERROR, showFeedback } from "../../Redux/actionTypes";
import { openImageModal } from '../../Redux/actions';
import ChatWithRefashionerListingButton from '../../Components/Orders/ChatWithRefashionerListingButton';
import ProfileCard from '../../Components/ProfileCard';
import InContainerLoading from '../../Components/InContainerLoading';
import SuccessModal from '../../Components/SuccessModal';
// API Imports
import * as swapRequestApi from '../../API/swapRequestApi.js';

const useStyles = makeStyles((theme) => ({
    Box: {
        marginTop: '2px',
        marginBottom: '2px'
    },
    modalBox: {
        width: '100%',
        minHeight: '18em',
        background: 'white',
        padding: "2em",
        borderRadius: '1em',
        border: '0.1em solid #FB7A56',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    }
}));

const dummy = {
    id: 1,
    title: "nice jeans",
    description: "blue jeans with flower pattern and very cool yakult glass of water and nice bottle of yakult",
    dateCreated: new Date(),
    credits: 50,
    itemCondition: "Good",
    imageList: [DefaultImage, DefaultImage],
    category: {
        categoryName: "Shorts",
        id: 1,
    },
    refashioner: {
        id: 2,
        name: "Aaron"
    },
};


export default function SwapRequest() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const styles = useStyles();
    const { id } = useParams();

    const [loading, setLoading] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);

    // Retrive currentUser username from Redux
    const currentUser = useSelector((state) => state.currUserData);

    const [swapRequest, setSwapRequest] = React.useState(dummy);

    function handlePhotoModal(images, index) {
        dispatch(openImageModal(images, index))
    }


    React.useEffect(() => {
        setLoading(true);
        getSwapRequestDetails();
    }, [])

    const getSwapRequestDetails = async () => {
        try {

            await swapRequestApi.retrieveSwapRequestById(id).then((res) => {
                console.log(res.data);
                setSwapRequest(res.data);
            })

        } catch (error) {
            const data = error?.response?.data?.message
            console.log("ERROR MSG: " + JSON.stringify(error));
            dispatch({ type: ERROR, data })
            setSwapRequest([]);

        } finally {
            setLoading(false);
        }
    }

    async function followUpRejectedSwapRequest(followUpStatus) {
        
        try {
            await swapRequestApi.followUpRejectedItem(id, JSON.stringify(followUpStatus) ).then((res) => {
                console.log(res.data);
                setIsSuccess(true);
                getSwapRequestDetails();
            })
        } catch (error) {
            const data = error?.response?.data?.message
            console.log("ERROR MSG: " + JSON.stringify(error));
            dispatch({ type: ERROR, data })
        }

    }


    return (!loading ?
        (<Container>
            <Grid container spacing={2} justifyContent="space-between">
                <Grid item xs='auto'>
                    <Button onClick={() => navigate(-1)}>
                        <ArrowBackIcon fontSize='large' color='action' />
                    </Button>
                </Grid>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 5, marginBottom: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Swap Request
                </Typography>
                <Box
                    sx={{
                        height: 80,
                        width: 80,
                        position: 'relative',
                        top: -20,
                        right: 0,
                    }}
                >
                    <img alt="Marketplace Image" src={MarketplaceImg} style={{ objectFit: 'contain' }} />
                </Box>
            </Grid>
            <Box>
                <Box className={styles.Box}>
                    <Box sx={{ overflowX: 'scroll', display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                        <img src={swapRequest.imageList[0].url}
                            onClick={() => handlePhotoModal(swapRequest.imageList.map(({ url }) => url), 0)}
                            height="100%" width="100%"
                            style={{ maxWidth: 400, background: "none", alignSelf: 'center', objectFit: 'contain' }}
                        />
                    </Box>
                </Box>
            </Box>
            <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                    <Typography variant='h4' fontWeight={600}>{swapRequest.itemName}</Typography>
                    {/*{currentUser.id === swapItem.refashioner.id &&
                        <Grid item xs='auto'>
                            <IconButton>
                                <MoreVertIcon fontSize='large' />
                            </IconButton>
                        </Grid>
                    } */}
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Chip
                    label={swapRequest.category.categoryName}
                    sx={{ background: '#FB7A56', color: 'white', fontSize: '65%', fontWeight: '600', marginBottom: 1, padding: '1px 5px', WebkitBorderRadius: '13px' }}
                />
            </Grid>
            {/* <ProfileCard user={swapItem.refashioner} /> */}
            <Grid item xs={12}>
                <Divider sx={{ mb: 5 }} />
            </Grid>
            <Grid item xs={12}>
                <Typography variant='h6' gutterBottom>
                    Description
                </Typography>
                <Typography variant='body2' gutterBottom>
                    {swapRequest.itemDescription}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant='h6' gutterBottom>
                    Item Condition
                </Typography>
                <Typography variant='body2' gutterBottom>
                    {swapRequest.itemCondition}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography variant='h6' gutterBottom>
                    Swap Request Status
                </Typography>
                <Typography variant='body2' gutterBottom>
                    {swapRequest.swapRequestStatus}
                </Typography>
            </Grid>
            {swapRequest.adminRemarks &&
                <Grid item xs={12}>
                    <Typography variant='h6' gutterBottom>
                        Reject Reason
                    </Typography>
                    <Typography variant='body2' gutterBottom>
                        {swapRequest.adminRemarks}
                    </Typography>
                </Grid>

            }
            {swapRequest.creditsToAppUser &&
                <Grid item xs={12}>
                    <Typography variant='h6' gutterBottom>
                        Credits Received
                    </Typography>
                    <Typography variant='body2' gutterBottom>
                        {swapRequest.creditsToAppUser}
                    </Typography>
                </Grid>
            }

            {swapRequest.followUpStatus &&
                <Grid item xs={12}>
                    <Typography variant='h6' gutterBottom>
                        Follow up status
                    </Typography>
                    <Typography variant='body2' gutterBottom>
                        {swapRequest.followUpStatus}
                    </Typography>
                </Grid>
            }

            {swapRequest.selfCollectionDate &&
                <Grid item xs={12}>
                    <Typography variant='h6' gutterBottom>
                        Self Collection Date
                    </Typography>
                    <Typography variant='body2' gutterBottom>
                        {swapRequest.selfCollectionDate}
                    </Typography>
                </Grid>
            }
            {swapRequest.followUpStatus === "PENDING_RESPONSE" &&
                <Box>
                    {swapRequest.creditsToAppUser &&
                        <Grid container spacing={2}>
                            <Grid item xs={6} sx={{ display: "flex", justifyContent: "center", alignContent: "center", marginTop: 4, marginBottom: 0.5 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{ background: '#FB7A56', color: 'white', fontWeight: '600', padding: 1 }}
                                    onClick={() => followUpRejectedSwapRequest("DONATE_PENDING")}
                                >
                                    Donate
                                </Button>
                            </Grid>
                            <Grid item xs={6} sx={{ display: "flex", justifyContent: "center", alignContent: "center", marginTop: 4, marginBottom: 0.5 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{ background: '#FB7A56', color: 'white', fontWeight: '600', padding: 1 }}
                                    onClick={() => followUpRejectedSwapRequest("SELF_COLLECTION_PENDING")}
                                >
                                    Self Pickup
                                </Button>
                            </Grid>
                        </Grid>
                    }
                    {!swapRequest.creditsToAppUser &&
                        <Grid container spacing={2}>
                            <Grid item xs={6} sx={{ display: "flex", justifyContent: "center", alignContent: "center", marginTop: 4, marginBottom: 0.5 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{ background: '#FB7A56', color: 'white', fontWeight: '600', padding: 1 }}
                                    onClick={() => followUpRejectedSwapRequest("DISCARD")}
                                >
                                    Discard
                                </Button>
                            </Grid>

                            <Grid item xs={6} sx={{ display: "flex", justifyContent: "center", alignContent: "center", marginTop: 4, marginBottom: 0.5 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{ background: '#FB7A56', color: 'white', fontWeight: '600', padding: 1 }}
                                    onClick={() => followUpRejectedSwapRequest("SELF_COLLECTION_PENDING")}
                                >
                                    Self Pickup
                                </Button>
                            </Grid>
                        </Grid>
                    }

                </Box>
            }
            <SuccessModal open={isSuccess} onClose={() => setIsSuccess(false)} />
        </Container >)
        :
        (<Container>
            <InContainerLoading />
        </Container>)
    )
}
