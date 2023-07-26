import { Box, Avatar, Grid, Typography, Tab, Tabs, Rating, Divider, SvgIcon, MenuItem, Select } from '@mui/material';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ProfileCard from '../../Components/ProfileCard';
import { toTitleCase, MARKET_VIEW, REFASHIONEE_VIEW, REFASHIONER_VIEW } from '../../constants';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { withStyles } from "@mui/styles";
import ProfileItem from '../../Components/Profile/ProfileItem';
import ProfileListings from '../../Components/Profile/ProfileListings';
import { useTheme } from '@emotion/react';
import About from '../../Components/Profile/About';
import ProfileRequests from '../../Components/Profile/ProfileRequests';
import { useNavigate } from 'react-router';
import { getUserProfile, logout, refreshToken, toggleView } from '../../Redux/actions';

const CustomTab = withStyles({
  root: {
    textTransform: "none"
  }
})(Tab);

const Profile = () => {
  const view = useSelector((state) => state.view);
  const dispatch = useDispatch();
  const [selectValue, setSelectValue] = React.useState(view === REFASHIONEE_VIEW ? 'Refashionee' : (view === REFASHIONER_VIEW ? 'Refashioner' : 'Marketplace'));
  const theme = useTheme();
  const authData = useSelector((state) => state.authData);
  const navigate = useNavigate();
  const currentUser = useSelector(state => state.currUserData);
  const [tabValue, setTabValue] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

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
      navigate('/marketplace');
    }
  }

  return (
    <Grid container spacing={0}>
      <Grid item xs={12} sx={{ mr: 2, mt: 0 }}>
        <Box>
          <SvgIcon
            fontSize="large"
            color="action"
            sx={{ float:'right',cursor : 'pointer'}}
            onClick={() => navigate('/settings')}
          >
            <SettingsOutlinedIcon />
          </SvgIcon>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', ml: 2, mt: 1 }}>
          <Avatar src={currentUser?.avatar?.url} alt={currentUser.name} sx={{ maxWidth: '70px', maxHeight: '70px', height: '4em', width: '4em', bgcolor: '#FB7A56', marginRight: 2 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='h5'>{toTitleCase(currentUser.name)}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer'}} onClick={() => navigate("/viewReviews")}>
              <Rating value={currentUser.rating} readOnly sx={{ mr: 1 }}/>
              <Typography variant='body1' color='GrayText'>{`(${Math.round(currentUser.rating).toFixed(1)})`}</Typography>
            </Box>
          </Box>
        </Box>
        <Divider orientation="horizontal" sx={{ mt: 3 }} />
      </Grid>
      <Grid item xs={12}>
        <Tabs value={tabValue} onChange={handleTabChange} classes={{ "indicator": { background: "none" } }} aria-label="chatTabs" variant="fullWidth" sx={{ "& button[aria-selected='true']": { borderBottom: "5px solid", borderBottomColor: '#FB7A56', color: "secondary.main" }, width: '100%' }}>
          <CustomTab label="Profile" {...a11yProps(0)} style={{ fontWeight: 'bold' }} />
          <CustomTab label="Listings"  {...a11yProps(1)} style={{ fontWeight: 'bold' }} />
          <CustomTab label="Requests"  {...a11yProps(2)} style={{ fontWeight: 'bold' }} />
          <CustomTab label="About"  {...a11yProps(3)} style={{ fontWeight: 'bold' }} />
        </Tabs>
      </Grid>
      <Divider orientation="horizontal" sx={{ marginTop: '-2px' }} />
      {tabValue === 1 ? <ProfileListings /> : (tabValue === 0 ? <ProfileItem /> : (tabValue === 2 ? <ProfileRequests /> : <About />))}
    </Grid>
  );
};

export default Profile;