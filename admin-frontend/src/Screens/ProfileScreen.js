import React from 'react';
import { Box, Container, Typography, Button, ButtonGroup, Divider, Avatar, Grid, Card, CardContent, Rating, ListItemButton, ListItemIcon, ListItemText, List, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText, SvgIcon } from '@mui/material';
import { makeStyles } from "@mui/styles";
import { useNavigate, useParams } from 'react-router-dom';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch, useSelector } from 'react-redux';
import { toggleView, logout, getUserProfile, refreshToken } from '../Redux/actions';
import { MARKET_VIEW, REFASHIONEE_VIEW, REFASHIONER_VIEW, toTitleCase } from '../constants';
import { deactivateAccount, retrieveRefashionerRegistrationRequestsByUserId } from '../API/userApi';
import { apiWrapper } from '../API';
import InContainerLoading from '../Components/InContainerLoading';
import { Search as SearchIcon, ArrowLeft as ArrowIcon, PlusCircle as PlusIcon } from 'react-feather';

import firebase from "firebase/app";
import '@firebase/messaging';

export default function ProfileScreen() {
    let navigate = useNavigate();
    const dispatch = useDispatch();

    const view = useSelector((state) => state.view);
    const currentUser = useSelector(state => state.currUserData);
    const authData = useSelector((state) => state.authData);
    const [rrr, setRRR] = React.useState([]);
    const [isDeactivateModalOpen, setIsDeactivateModalOpen] = React.useState(false);

    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        if (authData) {
            setIsLoading(true);
            try {
                dispatch(getUserProfile(authData.sub));
            } catch (error) {
                dispatch(logout());
                navigate('/login');
                console.log(error);
            }

            setIsLoading(false);
        }
    }, [])

    React.useEffect(() => {
        if (currentUser && currentUser.roles.length !== authData.roles.length) {
            dispatch(refreshToken());
        }
    }, [currentUser])

    React.useEffect(() => {
        if (currentUser?.id) {
            getRRR();
        }
    }, [currentUser?.id])

    async function getRRR() {
        setIsLoading(true);
        const res = await apiWrapper(retrieveRefashionerRegistrationRequestsByUserId(currentUser.id), "", false);
        if (res) {
            setRRR(res.data);
        }
        setIsLoading(false);
    }

    function handleSwitchModes(view) {
        dispatch(toggleView(view));
        if (view === MARKET_VIEW) {
            navigate('/marketplace');
        }
    }

    function userLogout() {
        firebase.messaging().deleteToken();
        dispatch(logout());
        navigate('/login')
    }

    async function handleDeactivateAccount() {
        const res = await apiWrapper(deactivateAccount(authData.sub));
        if (res) {
            userLogout();
        }
    }

    return (
        currentUser && !isLoading ? <Container sx={{ mb: 2 }}>
            {/* <ProfileCard user={currentUser}/> */}
            <SvgIcon
                fontSize="large"
                color="action"
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate(-1)}
            >
                <ArrowIcon />
            </SvgIcon>
            <Typography fontWeight={600} sx={{ fontSize: 35, display: 'flex', alignContent: 'center', justifyContent: 'center' }}>Settings</Typography>
            <Typography variant='h6' color='GrayText'>Account Settings</Typography>
            <List>
                <ListItemButton onClick={() => navigate("/profile/edit")}>
                    <ListItemIcon sx={{ minWidth: 0, mr: 1 }}>
                        <PermIdentityOutlinedIcon fontSize='medium' />
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{ sx: { fontSize: '1.1em' } }}>
                        Edit profile
                    </ListItemText>
                    <ListItemIcon sx={{ minWidth: 0 }}>
                        <ArrowForwardIosOutlinedIcon />
                    </ListItemIcon>
                </ListItemButton>
                {/* <ListItemButton onClick={() => navigate("/profile/wallet")}>
                    <ListItemIcon sx={{minWidth : 0, mr: 1}}>
                        <AccountBalanceWalletOutlinedIcon fontSize='medium'/>
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{sx : {fontSize : '1.1em'}}}>
                        My Wallet
                    </ListItemText>
                    <ListItemIcon sx={{minWidth : 0}}>
                    <ArrowForwardIosOutlinedIcon />
                    </ListItemIcon>
                </ListItemButton> */}
                {/* <ListItemButton>
                    <ListItemIcon sx={{minWidth : 0, mr: 1}}>
                        <CheckroomIcon fontSize='medium'/>
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{sx : {fontSize : '1.1em'}}}>
                        Style Quiz
                    </ListItemText>
                    <ListItemIcon sx={{minWidth : 0}}>
                    <ArrowForwardIosOutlinedIcon />
                    </ListItemIcon>
                </ListItemButton> */}
                <ListItemButton onClick={() => navigate("/profile/changepassword")}>
                    <ListItemIcon sx={{ minWidth: 0, mr: 1 }}>
                        <LockOutlinedIcon fontSize='medium' />
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{ sx: { fontSize: '1.1em' } }}>
                        Change Password
                    </ListItemText>
                    <ListItemIcon sx={{ minWidth: 0 }}>
                        <ArrowForwardIosOutlinedIcon />
                    </ListItemIcon>
                </ListItemButton>

            </List>
            <Typography variant='h6' color='GrayText' sx={{ mt: 2, mb: 2 }}>More</Typography>
            <Divider orientation='horizontal' />
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

                <ListItemButton onClick={userLogout}>
                    <ListItemIcon sx={{ minWidth: 0, mr: 1 }}>
                        <LogoutIcon fontSize='medium' />
                    </ListItemIcon>
                    <ListItemText primaryTypographyProps={{ sx: { fontSize: '1.1em' } }}>
                        Logout
                    </ListItemText>
                    <ListItemIcon sx={{ minWidth: 0 }}>
                        <ArrowForwardIosOutlinedIcon />
                    </ListItemIcon>
                </ListItemButton>
               
            </List>
            
        </Container> : <InContainerLoading text='Loading profile...' />

    )
}

