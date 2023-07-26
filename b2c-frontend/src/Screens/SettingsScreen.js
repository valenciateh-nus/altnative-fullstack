import React from 'react';
import { Box, Container, Typography, Button, ButtonGroup, Divider, Avatar, Grid, Card, CardContent, Rating, ListItemButton, ListItemIcon, ListItemText, List, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, SvgIcon } from '@mui/material';
import { makeStyles } from "@mui/styles";
import { useNavigate, useParams } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LoopOutlinedIcon from '@mui/icons-material/LoopOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ApprovalIcon from '@mui/icons-material/Approval';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { useDispatch, useSelector } from 'react-redux';
import { toggleView, logout, getUserProfile,refreshToken } from '../Redux/actions';
import { MARKET_VIEW, REFASHIONEE_VIEW, REFASHIONER_VIEW, SWAP_VIEW, toTitleCase } from '../constants';
import { deactivateAccount, retrieveRefashionerRegistrationRequestsByUserId } from '../API/userApi';
import { apiWrapper } from '../API';
import LoadingModal from '../Components/LoadingModal';
import { createProjectListing } from '../API/projectApi';
import ProfileCard from '../Components/ProfileCard';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import CustomButton from '../Components/CustomButton';
import InContainerLoading from '../Components/InContainerLoading';
import { Search as SearchIcon, ArrowLeft as ArrowIcon, PlusCircle as PlusIcon } from 'react-feather';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

export default function SettingsScreen() {
    let navigate = useNavigate();
    const dispatch = useDispatch();

    const view = useSelector((state) => state.view);
    const currentUser = useSelector(state => state.currUserData);
    const authData = useSelector((state) => state.authData);
    const [rrr,setRRR] = React.useState([]);
    const [isDeactivateModalOpen, setIsDeactivateModalOpen] = React.useState(false);
 
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        if(authData) {
            setIsLoading(true);
            try {
                dispatch(getUserProfile(authData.sub));
            } catch(error) {
                dispatch(logout());
                navigate('/login');
                console.log(error);
            }
            
            setIsLoading(false);
        }
    },[])

    React.useEffect(() => {
        if(currentUser && currentUser.roles.length !== authData.roles.length) {
            dispatch(refreshToken());
        }
    },[currentUser])

    React.useEffect(() => {
        if(currentUser?.id) {
            getRRR();
        }
    },[currentUser?.id])

    async function getRRR() {
        setIsLoading(true);
        const res = await apiWrapper(retrieveRefashionerRegistrationRequestsByUserId(currentUser.id),"",false);
        if(res) {
            setRRR(res.data);
        }
        setIsLoading(false);
    }

    function handleSwitchModes(view) {
        dispatch(toggleView(view));
        if(view === MARKET_VIEW) {
            navigate('/marketplace');
        }
        if(view === SWAP_VIEW) {
            navigate('/swap')
        }
    }

    function userLogout() {
        dispatch(logout());
        navigate('/login')
    }

    async function handleDeactivateAccount() {
        const res = await apiWrapper(deactivateAccount(authData.sub));
        if(res) {
            userLogout();
        }
    }

    return (
        currentUser && !isLoading ? <Container sx={{mb : 2}}>
            {/* <ProfileCard user={currentUser}/> */}
                <SvgIcon
                  fontSize="large"
                  color="action"
                  onClick={() => navigate(-1)}
                  style={{ cursor: 'pointer' }}
                >
                  <ArrowIcon />
                </SvgIcon>
            <Typography fontWeight={600} sx={{ fontSize: 35 }}>Settings</Typography>
            <Typography variant='h6' color = 'GrayText'>Account Settings</Typography>
            <List>
                <ListItemButton onClick={() => navigate("/profile/edit")}>
                    <ListItemIcon sx={{minWidth : 0, mr: 1}}>
                        <PermIdentityOutlinedIcon fontSize='medium'/>
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{sx : {fontSize : '1.1em'}}}>
                        Edit personal details
                    </ListItemText>
                    <ListItemIcon sx={{minWidth : 0}}>
                    <ArrowForwardIosOutlinedIcon />
                    </ListItemIcon>
                </ListItemButton>
                {/* {view === REFASHIONER_VIEW && 
                <ListItemButton onClick={() => navigate("/userprofile/edit")}>
                    <ListItemIcon sx={{minWidth : 0, mr: 1}}>
                        <GppGoodOutlinedIcon fontSize='medium'/>
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{sx : {fontSize : '1.1em'}}}>
                        Edit my portfolio
                    </ListItemText>
                    <ListItemIcon sx={{minWidth : 0}}>
                    <ArrowForwardIosOutlinedIcon />
                    </ListItemIcon>
                </ListItemButton>} */}
    
                <ListItemButton onClick={() => navigate("/profile/changepassword")}>
                    <ListItemIcon sx={{minWidth : 0, mr: 1}}>
                        <LockOutlinedIcon fontSize='medium'/>
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{sx : {fontSize : '1.1em'}}}>
                        Change Password
                    </ListItemText>
                    <ListItemIcon sx={{minWidth : 0}}>
                    <ArrowForwardIosOutlinedIcon />
                    </ListItemIcon>
                </ListItemButton>
                <ListItemButton onClick={() => navigate("/profile/bankdetails")}>
                    <ListItemIcon sx={{minWidth : 0, mr: 1}}>
                        <AccountBalanceIcon fontSize='medium'/>
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{sx : {fontSize : '1.1em'}}}>
                        Edit Bank Details
                    </ListItemText>
                    <ListItemIcon sx={{minWidth : 0}}>
                    <ArrowForwardIosOutlinedIcon />
                    </ListItemIcon>
                </ListItemButton>
                {(view === REFASHIONEE_VIEW || view === MARKET_VIEW) && <>
                <ListItemButton onClick={() => navigate("/profile/mymeasurements")}>
                    <ListItemIcon sx={{minWidth : 0, mr: 1}}>
                        <SellOutlinedIcon fontSize='medium'/>
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{sx : {fontSize : '1.1em'}}}>
                        My Measurement
                    </ListItemText>
                    <ListItemIcon sx={{minWidth : 0}}>
                    <ArrowForwardIosOutlinedIcon />
                    </ListItemIcon>
                </ListItemButton>
                {/* <ListItemButton onClick={() => navigate("/profile/favourites")}>
                    <ListItemIcon sx={{minWidth : 0, mr: 1}}>
                        <FavoriteBorderOutlinedIcon fontSize='medium'/>
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{sx : {fontSize : '1.1em'}}}>
                        Favourites
                    </ListItemText>
                    <ListItemIcon sx={{minWidth : 0}}>
                    <ArrowForwardIosOutlinedIcon />
                    </ListItemIcon>
                </ListItemButton> */}
                </>}
                {/* <ListItemButton onClick={() => navigate("/profile/paymentmethod")}>
                    <ListItemIcon sx={{minWidth : 0, mr: 1}}>
                        <AttachMoneyOutlinedIcon fontSize='medium'/>
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{sx : {fontSize : '1.1em'}}}>
                        Add Payment Method
                    </ListItemText>
                    <ListItemIcon sx={{minWidth : 0}}>
                    <ArrowForwardIosOutlinedIcon />
                    </ListItemIcon>
                </ListItemButton> */}
                <ListItemButton onClick={() => navigate("/report")}>
                    <ListItemIcon sx={{minWidth : 0, mr: 1}}>
                        <BorderColorOutlinedIcon fontSize='medium'/>
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{sx : {fontSize : '1.1em'}}}>
                        View my dispute requests
                    </ListItemText>
                    <ListItemIcon sx={{minWidth : 0}}>
                    <ArrowForwardIosOutlinedIcon />
                    </ListItemIcon>
                </ListItemButton>
                {view === REFASHIONER_VIEW && <ListItemButton>
                    <ListItemIcon sx={{minWidth : 0, mr: 1}}>
                        <AttachMoneyIcon fontSize='medium'/>
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{sx : {fontSize : '1.1em'}}}>
                        View Transaction History
                    </ListItemText>
                    <ListItemIcon sx={{minWidth : 0}}>
                    <ArrowForwardIosOutlinedIcon />
                    </ListItemIcon>
                </ListItemButton>}
                {!isLoading && !authData.roles.includes('USER_REFASHIONER') && rrr.length === 0 && <ListItemButton onClick={() => navigate("/refashioner/start")}>
                    <ListItemIcon sx={{minWidth : 0, mr: 1}}>
                        <ApprovalIcon fontSize='medium'/>
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{sx : {fontSize : '1.1em'}}}>
                        Refashioner Application
                    </ListItemText>
                    <ListItemIcon sx={{minWidth : 0}}>
                    <ArrowForwardIosOutlinedIcon />
                    </ListItemIcon>
                </ListItemButton>}
                {!isLoading && !authData.roles.includes('USER_REFASHIONER') && rrr.length > 0 && <ListItemButton onClick={() => navigate("/profile/myrefashionrequests")}>
                    <ListItemIcon sx={{minWidth : 0, mr: 1}}>
                        <ApprovalIcon fontSize='medium'/>
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{sx : {fontSize : '1.1em'}}}>
                        View My Refashioner Applications
                    </ListItemText>
                    <ListItemIcon sx={{minWidth : 0}}>
                    <ArrowForwardIosOutlinedIcon />
                    </ListItemIcon>
                </ListItemButton>}
            </List>
            <Typography variant='h6' color = 'GrayText' sx={{mt: 2, mb : 2}}>More</Typography>
            <Divider orientation='horizontal'/>
            <List>
                {/* <ListItemButton>
                    <ListItemIcon sx={{minWidth : 0, mr: 1}}>
                        <InfoOutlinedIcon fontSize='medium'/>
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{sx : {fontSize : '1.1em'}}}>
                        About us
                    </ListItemText>
                    <ListItemIcon sx={{minWidth : 0}}>
                    <ArrowForwardIosOutlinedIcon />
                    </ListItemIcon>
                </ListItemButton> */}
                {authData.roles.includes('USER_REFASHIONER') && view === REFASHIONEE_VIEW && <ListItemButton onClick={() => handleSwitchModes(REFASHIONER_VIEW)}>
                    <ListItemIcon sx={{minWidth : 0, mr: 1}}>
                        <LoopOutlinedIcon fontSize='medium'/>
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{sx : {fontSize : '1.1em'}}}>
                        Switch to Refashioner Mode
                    </ListItemText>
                    <ListItemIcon sx={{minWidth : 0}}>
                    <ArrowForwardIosOutlinedIcon />
                    </ListItemIcon>
                </ListItemButton>}
                {view !== REFASHIONEE_VIEW && <ListItemButton onClick={() => handleSwitchModes(REFASHIONEE_VIEW)}>
                    <ListItemIcon sx={{minWidth : 0, mr: 1}}>
                        <LoopOutlinedIcon fontSize='medium'/>
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{sx : {fontSize : '1.1em'}}}>
                        Switch to Refashionee Mode
                    </ListItemText>
                    <ListItemIcon sx={{minWidth : 0}}>
                    <ArrowForwardIosOutlinedIcon />
                    </ListItemIcon>
                </ListItemButton>}
                {view !== MARKET_VIEW && <ListItemButton onClick={() => handleSwitchModes(MARKET_VIEW)} >
                    <ListItemIcon sx={{minWidth : 0, mr: 1}}>
                        <StorefrontOutlinedIcon fontSize='medium'/>
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{sx : {fontSize : '1.1em'}}}>
                        Visit Marketplace
                    </ListItemText>
                    <ListItemIcon sx={{minWidth : 0}}>
                    <ArrowForwardIosOutlinedIcon />
                    </ListItemIcon>
                </ListItemButton>}
                {view !== SWAP_VIEW && <ListItemButton onClick={() => handleSwitchModes(SWAP_VIEW)} >
                    <ListItemIcon sx={{minWidth : 0, mr: 1}}>
                        <StorefrontOutlinedIcon fontSize='medium'/>
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{sx : {fontSize : '1.1em'}}}>
                        Visit Swap Plaza
                    </ListItemText>
                    <ListItemIcon sx={{minWidth : 0}}>
                    <ArrowForwardIosOutlinedIcon />
                    </ListItemIcon>
                </ListItemButton>}
                {/* <ListItemButton onClick={userLogout}>
                    <ListItemIcon sx={{minWidth : 0, mr: 1}}>
                        <LogoutIcon fontSize='medium'/>
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{sx : {fontSize : '1.1em'}}}>
                        Logout
                    </ListItemText>
                    <ListItemIcon sx={{minWidth : 0}}>
                    <ArrowForwardIosOutlinedIcon />
                    </ListItemIcon>
                </ListItemButton> */}
                <ListItemButton onClick={() => setIsDeactivateModalOpen(true)}>
                    <ListItemIcon sx={{minWidth : 0, mr: 1, color: "#DE0000"}}>
                        <PersonRemoveIcon fontSize='medium'/>
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{sx : {fontSize : '1.1em', color: '#DE0000'}}}>
                        Deactivate Account
                    </ListItemText>
                    <ListItemIcon sx={{minWidth : 0}}>
                    <ArrowForwardIosOutlinedIcon />
                    </ListItemIcon>
                </ListItemButton>
            </List>
            <Dialog
                open={isDeactivateModalOpen}
                onClose={() => setIsDeactivateModalOpen(false)}
                aria-labelledby="alert-dialog-delivery-confirmation"
                aria-describedby="alert-dialog-delivery-confirmation"
                onBackdropClick = {() => setIsDeactivateModalOpen(false)}
            >
                <Box sx={{backgroundColor : 'primary.main'}}>
                    <DialogTitle id="delivery-confirmation">
                        Confirm Deactive Account?
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                           Deactivating your account is irreversible. Are you sure you want to continue?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <CustomButton variant='contained' sx={{backgroundColor:'secondary.light'}} onClick={() => setIsDeactivateModalOpen(false)} autoFocus>No</CustomButton>
                        <CustomButton variant='contained' color="secondary" onClick={handleDeactivateAccount}>
                            {"Confirm"}
                        </CustomButton>
                    </DialogActions>
                </Box> 
            </Dialog>
        </Container> : <InContainerLoading text='Loading profile...'/>
        
    )
}

