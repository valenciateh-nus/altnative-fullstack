import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Grid,
  Container,
  Typography,
  Divider,
  Tabs,
  Tab,
  StepConnector,
  SvgIcon
} from "@mui/material";
import { makeStyles, withStyles } from "@mui/styles";
import RefashionerOrder from '../../Components/Refashioner/RefashionerOrder';
import RefashionerRequest from '../../Components/Refashioner/RefashionerRequest';
import Requests from '../../Components/Orders/Requests';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const CustomTab = withStyles({
  root: {
    textTransform: "none"
  }
})(Tab);

const OrderPage = () => {
  const [tabValue, setTabValue] = React.useState(0);
  const currUserData = useSelector((state) => state.currUserData);
  const navigate = useNavigate();

  if (currUserData.roles.indexOf("USER_REFASHIONER") === -1) {
    navigate('/home', { replace: true });
  }

  React.useEffect(() => {
    setTabValue(0);
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

  const handleReroute = () => {
    navigate('createListing');
  }

  return (
    <Box
      sx={{
        minHeight: '100%',
        maxHeight: '100%',
        px: 0,
        py: 2,
        overflow: 'scroll'
      }}
    >
      <Container>
        <Grid
          item
          lg={12}
          sm={12}
          xl={12}
          xs={12}
        >
          <Typography variant='h5' fontWeight={650} ml={0.5}>
            Manage Orders
          </Typography>
          <Divider orientation="horizontal"/>
        </Grid>

        <Grid item xs={12}>
          <Tabs value={tabValue} onChange={handleTabChange} classes={{ "indicator": { background: "none" } }} aria-label="chatTabs" variant="fullWidth" sx={{ "& button[aria-selected='true']": { borderBottom: "5px solid", borderBottomColor: '#FB7A56', color: "secondary.main" }, width: '100%' }}>
            <CustomTab label="Orders" {...a11yProps(0)} style={{ fontWeight: 'bold' }} />
            <CustomTab label="Request"  {...a11yProps(1)} style={{ fontWeight: 'bold' }} />
          </Tabs>
        </Grid>
        <Divider orientation="horizontal" sx={{ marginTop: '-2px' }} />
        {tabValue === 1 ? <RefashionerRequest /> : <RefashionerOrder />}
      </Container>
    </Box>
  );
};

export default OrderPage;