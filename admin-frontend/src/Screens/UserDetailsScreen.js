import React from 'react'
import { Chip, Box, Container, Grid, Typography, List, ListItemButton, ListItem, ListItemText, Paper, IconButton, ListItemIcon, CircularProgress, Button, TextField } from '@mui/material'
import ProfileCard from '../Components/ProfileCard';
import { openImageModal } from '../Redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import { CustomList } from '../Components/CustomList';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CustomButton from '../Components/CustomButton';
import { apiWrapper, getRequests } from '../API/index';
import { approveRefashionerRegistrationRequest, rejectRefashionerRegistrationRequest, approveRefashionerRegistrationRequestWithCertifications } from '../API/refashionerRegistrationApi';
import SuccessModal from '../Components/SuccessModal';
import moment from 'moment';
import ConfirmationDialog from '../Components/ConfirmationDialog';
import LoadingModal from '../Components/LoadingModal';
import { retrieveProjectListingById, retrieveProjectListingsByRefashionerId, retrieveReviewsByUserId, suspendUser, unblockUser } from '../API/userApi';
import ViewReviews from '../Components/Accounts/ViewReviews';
import ViewProjectListings from '../Components/Accounts/ViewProjectListings';
import { getUserById } from '../API/userApi';
import { useNavigate, useParams } from 'react-router';
import { ArrowBackIos, MessageOutlined, PanoramaSharp } from '@mui/icons-material';
import InContainerLoading from '../Components/InContainerLoading';
import EnhancedTable from '../Components/Listings/ListingsTable';
import * as RequestsTable  from '../Components/Requests/RequestsTable';
import { MLIST, mListRowNames, PLIST, pListRowNames, PREQ, pReqRowNames } from './ListingManagementScreen';
import { getAllProjectRequestsByUsername } from '../API/listingApi';
import { retrieveAllMarketplaceListingsByUsername } from '../API/marketplaceApi';
import { generateChatId } from '../constants';
import { useTheme } from '@mui/styles';
import { disputeRowNames, DISPUTE_REQ } from './RequestsManagementScreen';
import { retrieveListOfDisputesByUserId } from '../API/disputeApi';


export default function UserDetailsScreen() {
    const[isSuccess, setIsSuccess] = React.useState(false);
    const[isLoading, setIsLoading] = React.useState(false);
    const[isSuspendModal, setIsSuspendModal] = React.useState(false);
    const[isReactivateModal, setIsReactivateModal] = React.useState(false);
    const[reviews, setReviews] = React.useState([]);
    const[listings, setListings] = React.useState([]);
    const[requests, setRequests] = React.useState([]);
    const[mktListings, setMktListings] = React.useState([]);
    const[disputes, setDisputes] = React.useState([]);
    const[user, setUser] = React.useState([]);
    const currUserData = useSelector((state) => state.currUserData);
    const theme = useTheme();


    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const chipStyle = {
        background: theme.palette.secondary.main,
        fontWeight: "bold",
        color: "white",
        padding: 1,
        fontSize: 14
    }

    const handleChat = () => {
        const chatId = generateChatId(currUserData.id, user.id, null);
        navigate(`/chat/${chatId}?user2=${user.username}`);
    }

    React.useEffect(() => {
        console.log("ID: ", params.id)
        if(params.id !== null) {
            getUserData();
        }
    }, [params.id])

    async function getUserData() {
        let userId = params.id;
        setIsLoading(true);
        const userRes = await apiWrapper(getUserById(userId))
        if(userRes) {
            setUser(userRes.data);
            const reviewsRes = await apiWrapper(retrieveReviewsByUserId(userId),"",false);
            if(reviewsRes) {
                setReviews(reviewsRes.data);
            }

            const requestsRes = await apiWrapper(getAllProjectRequestsByUsername(userRes.data.username));

            const mktRes = await apiWrapper(retrieveAllMarketplaceListingsByUsername(userRes.data.username));

            const dispReq = await apiWrapper(retrieveListOfDisputesByUserId(userId));

            if(mktRes) {
                setMktListings(mktRes.data);
            }

            if(requestsRes) {
                setRequests(requestsRes.data);
            }

            if(userRes.data.roles.includes('USER_REFASHIONER')) {
                const listingRes = await apiWrapper(retrieveProjectListingsByRefashionerId(userId),"",false);
                if(listingRes) {
                    setListings(listingRes.data);
                }
            }

            if(dispReq) {
                console.log("DISPUTE REQUESTS:" + JSON.stringify(dispReq.data));
                setDisputes(dispReq.data);
            }

            
        }
        setIsLoading(false);
    }

    function handleCloseSuccess() {
        setIsSuccess(false);
    }

    const handleSuspend = async () => {
        setIsLoading(true);
        let responses = []
        await suspendUserFunc();
        setIsLoading(false);
        setIsSuccess(true);
        setIsSuspendModal(false);
    }

    const handleReactivate = async () => {
        setIsLoading(true);
        let responses = []
        await reactivateUserFunc();
        setIsLoading(false);
        setIsSuccess(true);
        setIsReactivateModal(false);
    }

    async function suspendUserFunc() {
        const username = user.username;
        const res = await apiWrapper(suspendUser(username),"", false);
        if(res) {
            console.log("Successfully suspended: " + username);
            return "Successfully suspended: " + username;
        } 
        return "Error occurred while suspending: " + username + ". Please ensure user is not already suspended.";
    }

    async function reactivateUserFunc() {
        const username = user.username;
        const res = await apiWrapper(unblockUser(username),"", false);
        if(res) {
            console.log("Successfully reactivated: " + username);
        } 
        return "Error occurred while reactivating: " + username + ". Please ensure user is not already active.";
    }

    return (
        user.id ? <Container>
            <IconButton onClick={() => navigate(-1)}>
                <ArrowBackIos/>
            </IconButton>
            <ProfileCard user={user}/>
            <Box>
                <Typography variant='h5' gutterBottom>User Details</Typography> 
                <Box sx={{display : 'flex', flexDirection : 'column', mt:2}}>
                    <TextField
                        value={user.name}
                        label={'Name' || 'No Name'}
                        fullWidth
                        disabled={true}
                        placeholder = {'No Name'}
                        variant = 'outlined'
                        sx={{mb: 2}}
                    />
                    <TextField
                        value={user.username || 'No Email Address'}
                        label={'Email Address'}
                        fullWidth
                        disabled={true}
                        variant = 'outlined'
                        placeholder = {'No Email'}
                        sx={{mb: 2}}
                    />
                    <TextField
                        value={user.phoneNumber || 'No Phone Number'}
                        label={'Phone Number'}
                        fullWidth
                        disabled={true}
                        variant = 'outlined'
                        sx={{mb: 2}}
                    />
                    <TextField
                        value={user.address?.replaceAll('|', ' ') || 'No Address'}
                        label={'Address'}
                        fullWidth
                        disabled={true}
                        variant = 'outlined'
                        sx={{mb: 2}}
                    />
                </Box>
                <Typography variant='h5' gutterBottom>Banking Details</Typography>
                {user.bankAccountDetails && user.bankAccountDetails.verified ? <>
                <Box sx={{display : 'flex', flexDirection : 'column', mt:2}}>
                    <TextField
                        fullWidth
                        label="Name as per bank statement"
                        variant = 'outlined'
                        sx={{mb: 2}}
                        disabled={true}
                        value={user.bankAccountDetails.bankAccountName}
                    />
                    <TextField
                        fullWidth
                        id="bankAccountNo"
                        label="Account number"
                        name="bankAccountNo"
                        variant = 'outlined'
                        sx={{mb: 2}}
                        disabled={true}
                        placeholder = 'Account Number'
                        value={user.bankAccountDetails.bankAccountNo}
                    />
                    <TextField
                        fullWidth
                        id="bankAccountBranch"
                        label="Bank Branch"
                        name="bankAccountBranch"
                        variant = 'outlined'
                        sx={{mb: 2}}
                        disabled={true}
                        placeholder = 'Branch'
                        value={user.bankAccountDetails.bankAccountBranch}
                    />
                </Box></> : <Typography variant='text'>{'No Banking Details'}</Typography>}
                <Typography variant='h5' gutterBottom>User Description</Typography>
                <Typography variant='text'>{user.refashionerDesc ? user.refashionerDesc : 'No Description'}</Typography>
                {user.expertises.length > 0 && <>
                <Typography variant='h5' sx={{mt : 3, mb : 1}}>Expertise</Typography>
                <Grid container spacing={1}>
                    {user.expertises.map((expertise,i) =>
                        <Grid item xs='auto' key={i}>
                            <Chip
                                label={expertise.name + ' - ' + expertise.experienceLevel}
                                sx={chipStyle}
                                size = 'medium'
                            />
                        </Grid>)
                    }
                </Grid></>}
                {user.traits.length > 0 && <>
                <Typography variant='h5' sx={{mt : 3, mb : 1}}>Personality</Typography>
                <Grid container spacing={1}>
                    {user.traits.map((trait,i) =>
                        <Grid item xs='auto' key={i}>
                            <Chip
                                label={trait}
                                sx={chipStyle}
                                
                            />
                        </Grid>)
                    }
                </Grid></>}
                {user.approvedCertifications.length > 0 && <>
                <Typography variant='h5' sx={{mt : 3}}>Certifications</Typography>
                <Grid container spacing={1}>
                    {user.approvedCertifications.map((cert,i) =>
                        <Grid item xs='auto' key={i}>
                            <Chip
                                label={cert}
                                sx={chipStyle}
                            />
                        </Grid>)
                    }
                </Grid>    
                </>}
                <Typography variant='h5' sx={{mt : 3}}>Available Project Requests</Typography>
                <EnhancedTable rows = {requests} rowNames = {pReqRowNames} handleRefresh={getUserData} type = {PREQ}/>

                {user.roles.includes("USER_REFASHIONER") && <>
                    <Typography variant='h5' sx={{mt : 3}}>Available Project Listings</Typography>
                    <EnhancedTable rows = {listings} rowNames = {pListRowNames} handleRefresh={getUserData} type = {PLIST}/>
                </>}
                <Typography variant='h5' sx={{mt : 3}}>Available Marketplace Listings</Typography>
                <EnhancedTable rows = {mktListings} rowNames = {mListRowNames} handleRefresh={getUserData} type = {MLIST}/>
                
                <Typography variant='h5' sx={{mt : 3}}>Disputes Filed</Typography>
                <RequestsTable.default rows = {disputes} rowNames={disputeRowNames} type={DISPUTE_REQ} />

                <ViewReviews reviews={reviews}/>
                <Box sx={{display : 'flex', flexDirection : 'row', mt:2, mb:2, justifyContent: 'center', alignItems: 'center'}}>
                    {isLoading ? <CircularProgress color='secondary'/> 
                    : <>
                        {user.accountStatus === 'SUSPENDED' ? 
                            <CustomButton variant='contained' size='large' fullWidth onClick={() => setIsReactivateModal(true)} color = 'secondary'>Reactivate</CustomButton>
                        : <CustomButton variant='contained' size='large' fullWidth sx={{backgroundColor:'secondary.light'}} onClick={() => setIsSuspendModal(true)}>Suspend</CustomButton>}
                    </>}
                </Box>   
                <CustomButton onClick={handleChat} variant="contained" fullWidth size='large' color='secondary'>
                    Chat with User
                </CustomButton>
            </Box>
            <ConfirmationDialog open={isSuspendModal} handleClose={() => setIsSuspendModal(false)} 
                handleConfirm = {handleSuspend} handleCancel = {() => setIsSuspendModal(false)} header = {'Confirm Delete?'} 
                dialogText = {'Are you sure you want to Suspend the selected users? Selected users will no longer have access to their accounts.'}
            />
            <ConfirmationDialog open={isReactivateModal} handleClose={() => setIsReactivateModal(false)} 
                handleConfirm = {handleReactivate} handleCancel = {() => setIsReactivateModal(false)} header = {'Confirm Reactivation?'} 
                dialogText = {'Are you sure you want to reactivate the selected users? Selected users will regain access to their accounts.'}
            />
            <LoadingModal open = {isLoading}/>
            <SuccessModal open = {isSuccess} onClose={handleCloseSuccess} onCallback={getUserData}/> 
            
        </Container>
        : <InContainerLoading/>
    )
}
