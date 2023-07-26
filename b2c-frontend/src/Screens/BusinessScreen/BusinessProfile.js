import { Box, Avatar, Grid, Typography, Tab, Tabs, Rating, Divider, SvgIcon, MenuItem, Select } from '@mui/material';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ProfileCard from '../../Components/ProfileCard';
import { toTitleCase, MARKET_VIEW, REFASHIONEE_VIEW, REFASHIONER_VIEW } from '../../constants';
import { ArrowLeft as ArrowIcon } from 'react-feather';
import { withStyles } from "@mui/styles";
import ProfileListings from '../../Components/Business/ProfileListings';
import { useTheme } from '@emotion/react';
import About from '../../Components/Business/About';
import ProfileRequests from '../../Components/Business/ProfileRequests';
import { useNavigate, useParams } from 'react-router';
import { toggleView } from '../../Redux/actions';
import * as userApi from '../../API/userApi';

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
  const navigate = useNavigate();
  const currentUser = useSelector(state => state.currUserData);
  const [tabValue, setTabValue] = React.useState(0);
  const [business, setBusiness] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const { id = 0 } = useParams();

  console.log(currentUser);

  console.log(currentUser.roles.find((val) => val === "USER_REFASHIONERS"));

  React.useEffect(() => {
    setLoading(true);
    setTabValue(0);
    getBusiness();
  }, [])

  async function getBusiness() {
    try {
      await userApi.getUserById(id).then((val) => {
        setBusiness(val.data);
      })
    } catch (error) {
      setBusiness([]);
    } finally {
      setLoading(false);
    }
  }

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
    <Grid container spacing={0}>
      <Grid item xs={12} sx={{ ml: 2, mt: 0 }}>
        <Box>
          <SvgIcon
            fontSize="large"
            color="action"
            sx={{ float: 'left', cursor: 'pointer' }}
            onClick={() => navigate(-1)}
          >
            <ArrowIcon />
          </SvgIcon>
        </Box>
      </Grid>
      <Grid item xs={12} sx={{ mt: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', ml: 2, mt: 1 }}>
          <Avatar src={business?.avatar?.url} alt={business.name} sx={{ maxWidth: '70px', maxHeight: '70px', height: '4em', width: '4em', bgcolor: '#FB7A56', marginRight: 2 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='h5'>{business.name}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate(`/viewReviews/${id}`)}>
              <Rating value={business.rating} readOnly sx={{ mr: 1 }} />
              <Typography variant='body1' color='GrayText'>{`(${Math.round(business.rating).toFixed(1)})`}</Typography>
            </Box>
          </Box>
        </Box>
        <Divider orientation="horizontal" sx={{ mt: 3 }} />
      </Grid>
      {currentUser.roles.find((val) => val === "USER_REFASHIONER") !== undefined ? (
        <>
          <Grid item xs={12}>
            <Tabs value={tabValue} onChange={handleTabChange} classes={{ "indicator": { background: "none" } }} aria-label="chatTabs" variant="fullWidth" sx={{ "& button[aria-selected='true']": { borderBottom: "5px solid", borderBottomColor: '#FB7A56', color: "secondary.main" }, width: '100%' }}>
              <CustomTab label="About" {...a11yProps(0)} style={{ fontWeight: 'bold' }} />
              <CustomTab label="Listings"  {...a11yProps(1)} style={{ fontWeight: 'bold' }} />
              <CustomTab label="Requests"  {...a11yProps(2)} style={{ fontWeight: 'bold' }} />
            </Tabs>
          </Grid>
          <Divider orientation="horizontal" sx={{ marginTop: '-2px' }} />
          {tabValue === 1 ? <ProfileListings user={business} /> : (tabValue === 0 ? <About user={business} /> : <ProfileRequests user={business} />)}
        </>
      ) : (
        <>
          <Grid item xs={12}>
            <Tabs value={tabValue} onChange={handleTabChange} classes={{ "indicator": { background: "none" } }} aria-label="chatTabs" variant="fullWidth" sx={{ "& button[aria-selected='true']": { borderBottom: "5px solid", borderBottomColor: '#FB7A56', color: "secondary.main" }, width: '100%' }}>
              <CustomTab label="About" {...a11yProps(0)} style={{ fontWeight: 'bold' }} />
              <CustomTab label="Listings"  {...a11yProps(1)} style={{ fontWeight: 'bold' }} />
            </Tabs>
          </Grid>
          <Divider orientation="horizontal" sx={{ marginTop: '-2px' }} />
          {tabValue === 1 ? <ProfileListings user={business} /> : <About user={business} />}
        </>
      )}
    </Grid>
  );
};

export default Profile;