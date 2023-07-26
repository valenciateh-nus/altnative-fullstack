import { Box, Avatar, Grid, Typography, Tab, Tabs, Rating, Divider, SvgIcon, MenuItem, Select } from '@mui/material';
import React from 'react';
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
import ProfileRequest from '../../Components/Profile/ProfileRequest';

const CustomTab = withStyles({
  root: {
    textTransform: "none"
  }
})(Tab);

const Profile = () => {
  const view = useSelector((state) => state.view);
  const dispatch = useDispatch();
  const [selectValue, setSelectValue] = React.useState(view === REFASHIONEE_VIEW ? 'Refashionee' : (view === REFASHIONER_VIEW ? 'Refashioner' : (view === MARKET_VIEW ? 'Marketplace' : 'Swap')));
  const theme = useTheme();
  const navigate = useNavigate();
  const authData = useSelector((state) => state.authData);
  const currentUser = useSelector(state => state.currUserData);
  const [tabValue, setTabValue] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const { id = 0 } = useParams();

  console.log(currentUser);

  React.useEffect(() => {
    setTabValue(0);
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
    if (currentUser?.accountStatus === 'SUSPENDED') {
      dispatch(logout());
      navigate('/login');
      dispatch({ type: ERROR, data: 'Your account has been suspended' });
    } else if (currentUser && currentUser.roles.length !== authData.roles.length) {
      dispatch(refreshToken());
    }
  }, [currentUser])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (event) => {
    setSelectValue(event.target.value);
    if (event.target.value === 'Refashionee') {
      dispatch(toggleView(REFASHIONEE_VIEW));
    } else if (event.target.value === 'Refashioner') {
      dispatch(toggleView(REFASHIONER_VIEW));
    } else if (event.target.value === 'Marketplace') {
      dispatch(toggleView(MARKET_VIEW));
    } else if (event.target.value === 'Swap') {
      dispatch(toggleView(SWAP_VIEW));
    }
  }

  return (
    currentUser && !isLoading ? <Grid container spacing={0}>
      <Grid item xs={12} sx={{ mr: 1, mt: 2 }}>
        <Box>
          <SvgIcon
            fontSize="large"
            color="action"
            sx={{ float: 'right', cursor: 'pointer' }}
            onClick={() => navigate('/settings')}
          >
            <SettingsOutlinedIcon />
          </SvgIcon>
          <Select
            value={selectValue}
            onChange={handleChange}
            sx={{ float: 'right', mr: 1, height: 34, minWidth: 100, fontSize: 13, borderRadius: 20, background: 'transparent' }}>
            <MenuItem value="Refashionee" sx={{ pl: 1 }} id='refashionee-profile-selector'>Refashionee</MenuItem>
            {authData.roles?.includes('USER_REFASHIONER') && <MenuItem value="Refashioner" sx={{ pl: 1 }} id='refashioner-profile-selector'>Refashioner</MenuItem>}
            <MenuItem value="Marketplace" sx={{ pl: 1 }} id='marketplace-profile-selector'>Marketplace</MenuItem>
            <MenuItem value="Swap" sx={{ pl: 1 }} id='swap-profile-selector'>Swap</MenuItem>
          </Select>
        </Box>
      </Grid>
      <Grid item xs={12} sx={{ mt: -1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', ml: 2, mt: 1 }}>
          <Avatar src={currentUser?.avatar?.url} alt={currentUser.name} sx={{ maxWidth: '70px', maxHeight: '70px', height: '4em', width: '4em', bgcolor: '#FB7A56', marginRight: 2 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='h5'>{toTitleCase(currentUser.name)}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Rating value={currentUser.rating} readOnly sx={{ mr: 1 }} />
              <Typography variant='body1' color='GrayText'>{`(${Math.round(currentUser.rating).toFixed(1)})`}</Typography>
            </Box>
          </Box>
        </Box>
        <Divider orientation="horizontal" sx={{ mt: 3 }} />
      </Grid>
      {authData.roles?.includes('USER_REFASHIONER') ? (
        <>
          <Grid item xs={12}>
            <Tabs value={tabValue} onChange={handleTabChange} classes={{ "indicator": { background: "none" } }} aria-label="chatTabs" variant="fullWidth" sx={{ "& button[aria-selected='true']": { borderBottom: "5px solid", borderBottomColor: '#FB7A56', color: "secondary.main" }, width: '100%' }}>
              <CustomTab label="Profile" {...a11yProps(0)} style={{ fontWeight: 'bold' }} />
              <CustomTab label="Requests"  {...a11yProps(1)} style={{ fontWeight: 'bold' }} />
              <CustomTab label="Listings"  {...a11yProps(2)} style={{ fontWeight: 'bold' }} />
              <CustomTab label="About"  {...a11yProps(3)} style={{ fontWeight: 'bold' }} />
            </Tabs>
          </Grid>
          <Divider orientation="horizontal" sx={{ marginTop: '-2px' }} />
          {tabValue === 1 ? <ProfileRequest /> : (tabValue === 2 ? <ProfileListings /> : (tabValue === 0 ? <ProfileItem /> : <About />))}
        </>
      ) : (
        <>
          <Grid item xs={12}>
            <Tabs value={tabValue} onChange={handleTabChange} classes={{ "indicator": { background: "none" } }} aria-label="chatTabs" variant="fullWidth" sx={{ "& button[aria-selected='true']": { borderBottom: "5px solid", borderBottomColor: '#FB7A56', color: "secondary.main" }, width: '100%' }}>
              <CustomTab label="Profile" {...a11yProps(0)} style={{ fontWeight: 'bold' }} />
              <CustomTab label="Requests"  {...a11yProps(1)} style={{ fontWeight: 'bold' }} />
            </Tabs>
          </Grid>
          <Divider orientation="horizontal" sx={{ marginTop: '-2px' }} />
          {tabValue === 1 ? <ProfileRequest /> : <ProfileItem />}
        </>
      )}
    </Grid> : <InContainerLoading text='Loading profile...' />
  );
};

export default Profile;