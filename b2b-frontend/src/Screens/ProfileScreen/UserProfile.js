import { Box, Avatar, Grid, Typography, Tab, Tabs, Rating, Divider, SvgIcon, MenuItem, Select, Chip } from '@mui/material';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ProfileCard from '../../Components/ProfileCard';
import { toTitleCase, MARKET_VIEW, REFASHIONEE_VIEW, REFASHIONER_VIEW, SWAP_VIEW } from '../../constants';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { withStyles } from "@mui/styles";
import ProfileItem from '../../Components/Profile/ProfileItem';
import ProfileListings from '../../Components/Profile/ProfileListings';
import { useTheme } from '@emotion/react';
import About from '../../Components/Profile/About';
import { useNavigate, useParams } from 'react-router';
import { getUserProfile, logout, refreshToken, toggleView } from '../../Redux/actions';
import InContainerLoading from '../../Components/InContainerLoading';
import { ERROR } from '../../Redux/actionTypes';
import * as userApi from '../../API/userApi';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProfileRequests from '../../Components/Profile/ProfileRequests';

const CustomTab = withStyles({
  root: {
    textTransform: "none"
  }
})(Tab);

const UserProfile = () => {
  const view = useSelector((state) => state.view);
  const dispatch = useDispatch();
  const [selectValue, setSelectValue] = React.useState(view === REFASHIONEE_VIEW ? 'Refashionee' : (view === REFASHIONER_VIEW ? 'Refashioner' : 'Marketplace'));
  const theme = useTheme();
  const navigate = useNavigate();
  const authData = useSelector((state) => state.authData);
  const currentUser = useSelector(state => state.currUserData);
  const [tabValue, setTabValue] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [user, setUser] = useState([]);
  const { id = 0 } = useParams();

  React.useEffect(() => {
    setTabValue(0);
    if (id === 0 || id == currentUser.id) {
      navigate('/profile');
    } else if (id != 0) {
      setIsLoading(true);
      try {
        userApi.getUserById(id).then((val) => {
          setUser(val.data);
        })
      } catch (error) {
        setUser([]);
      }
      setIsLoading(false);
    }
  }, [])

  React.useEffect(() => {
    if (user?.accountStatus === 'SUSPENDED') {
      dispatch(logout());
      navigate('/login');
      dispatch({ type: ERROR, data: 'Your account has been suspended' });
    } else if (user) {
      dispatch(refreshToken());
    }
  }, [user])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    user && !isLoading ? <Grid container spacing={0}>
      <Grid item xs={12} sx={{ mt: 0 }}>
        <SvgIcon
          fontSize="large"
          color="action"
          onClick={() => navigate(-1)}
          sx={{ cursor: 'pointer' }}
        >
          <ArrowBackIcon />
        </SvgIcon>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', ml: 2, mt: 1 }}>
          <Avatar src={user?.avatar?.url} alt={user.name} sx={{ maxWidth: '70px', maxHeight: '70px', height: '4em', width: '4em', bgcolor: '#FB7A56', marginRight: 2 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='h5'>
              {user?.name && toTitleCase(user?.name)}
              {user?.roles?.includes("USER_REFASHIONER") &&
                <Chip label="Refashioner" variant="outlined" color="secondary" sx={{ ml: 1, mb: 0.5, fontWeight: 550, height: "100%", padding: '3px 0' }} />
              }
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer'}} onClick={() => navigate(`/viewReviews/${id}`)}>
              <Rating value={user.rating} readOnly sx={{ mr: 1 }}  />
              <Typography variant='body1' color='GrayText'>{`(${Math.round(user.rating).toFixed(1)})`}</Typography>
            </Box>
          </Box>
        </Box>
        <Divider orientation="horizontal" sx={{ mt: 3 }} />
      </Grid>
      {user.roles?.includes('USER_BUSINESS') ? (
        <>
          <Grid item xs={12}>
            <Tabs value={tabValue} onChange={handleTabChange} classes={{ "indicator": { background: "none" } }} aria-label="chatTabs" variant="fullWidth" sx={{ "& button[aria-selected='true']": { borderBottom: "5px solid", borderBottomColor: '#FB7A56', color: "secondary.main" }, width: '100%' }}>
              <CustomTab label="About" {...a11yProps(0)} style={{ fontWeight: 'bold' }} />
              <CustomTab label="Requests"  {...a11yProps(1)} style={{ fontWeight: 'bold' }} />
              <CustomTab label="Listings"  {...a11yProps(2)} style={{ fontWeight: 'bold' }} />
            </Tabs>
          </Grid>
          <Divider orientation="horizontal" sx={{ marginTop: '-2px' }} />
          {tabValue === 1 ? <ProfileRequests id={id} username={user.username} /> : (tabValue === 2 ? <ProfileListings id={id} username={user.username}/> : <About id={id} user={user} />)}
        </>
      ) : (
        <>
          <Grid item xs={12}>
            <Tabs value={tabValue} onChange={handleTabChange} classes={{ "indicator": { background: "none" } }} aria-label="chatTabs" variant="fullWidth" sx={{ "& button[aria-selected='true']": { borderBottom: "5px solid", borderBottomColor: '#FB7A56', color: "secondary.main" }, width: '100%' }}>
              <CustomTab label="About"  {...a11yProps(0)} style={{ fontWeight: 'bold' }} />
            </Tabs>
          </Grid>
          <Divider orientation="horizontal" sx={{ marginTop: '-2px' }} />
          {tabValue === 0 && <About id={id} user={user}/>}
        </>
      )}
    </Grid> : <InContainerLoading text='Loading profile...' />
  );
};

export default UserProfile;