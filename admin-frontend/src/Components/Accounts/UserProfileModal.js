import React from 'react'
import { Chip, Box, Container, Grid, Typography, List, ListItemButton, ListItem, ListItemText, Paper, IconButton, ListItemIcon, CircularProgress, Button, TextField } from '@mui/material'
import ProfileCard from '../ProfileCard';
import { openImageModal } from '../../Redux/actions';
import { useDispatch } from 'react-redux';
import { CustomList } from '../CustomList';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CustomButton from '../CustomButton';
import { apiWrapper } from '../../API';
import { approveRefashionerRegistrationRequest, rejectRefashionerRegistrationRequest, approveRefashionerRegistrationRequestWithCertifications } from '../../API/refashionerRegistrationApi';
import SuccessModal from '../SuccessModal';
import moment from 'moment';
import ConfirmationDialog from '../ConfirmationDialog';
import LoadingModal from '../LoadingModal';
import { retrieveProjectListingById, retrieveProjectListingsByRefashionerId, retrieveReviewsByUserId, suspendUser, unblockUser } from '../../API/userApi';
import ViewReviews from './ViewReviews';
import ViewProjectListings from './ViewProjectListings';
import { useTheme } from '@mui/styles';


export default function UserProfileModal({user = {}, handleRefresh}) {
    const theme = useTheme();
    const[isSuccess, setIsSuccess] = React.useState(false);
    const[isLoading, setIsLoading] = React.useState(false);
    const [isSuspendModal, setIsSuspendModal] = React.useState(false);
    const [isReactivateModal, setIsReactivateModal] = React.useState(false);
    const[reviews, setReviews] = React.useState([]);
    const[listings, setListings] = React.useState([]);

    const dispatch = useDispatch();

    const chipStyle = {
        background: theme.palette.secondary.main,
        fontWeight: "bold",
        color: "white",
        padding: 1,
        fontSize: 14
    }

    React.useEffect(() => {
        runOnce();
    }, [])

    async function runOnce() {
        setIsLoading(true);
        const reviewsRes = await apiWrapper(retrieveReviewsByUserId(user.id),"",false);
        if(reviewsRes) {
            setReviews(reviewsRes.data);
        }
        if(user.roles.includes('USER_REFASHIONER')) {
            const listingRes = await apiWrapper(retrieveProjectListingsByRefashionerId(user.id),"",false);
            if(listingRes) {
                setListings(listingRes.data);
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
        //console.log("DELETING: ", JSON.stringify(selected));
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
        <Container>
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
                {user.roles.includes("USER_REFASHIONER") && <ViewProjectListings projectListings={listings}/>}
                <ViewReviews reviews={reviews}/>
                <Box sx={{display : 'flex', flexDirection : 'row', mt:2, mb:2, justifyContent: 'center', alignItems: 'center'}}>
                    {isLoading ? <CircularProgress color='secondary'/> 
                    : <>
                        {user.accountStatus === 'SUSPENDED' ? 
                            <CustomButton variant='contained' size='large' fullWidth onClick={() => setIsReactivateModal(true)} color = 'secondary'>Reactivate</CustomButton>
                        : <CustomButton variant='contained' size='large' fullWidth sx={{backgroundColor:'secondary.light'}} onClick={() => setIsSuspendModal(true)}>Suspend</CustomButton>}
                    </>}
                </Box>   
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
            <SuccessModal open = {isSuccess} onClose={handleCloseSuccess} onCallback={handleRefresh}/> 
            
        </Container>
    )
}
