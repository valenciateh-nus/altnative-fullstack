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
  StepConnector
} from "@mui/material";
import { makeStyles, withStyles } from "@mui/styles";
import OwnListings from '../../Components/Ecommerce/OwnListings';
import MarketplaceImg from '../../Components/Images/MarketplaceImage.png';
import OwnOrders from '../../Components/Ecommerce/OwnOrders';


const CustomTab = withStyles({
  root: {
    textTransform: "none"
  }
})(Tab);

const MarketplaceOrder = () => {
  const [tabValue, setTabValue] = React.useState(0);

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

  return (
    <Box
      sx={{
        minHeight: '100%',
        maxHeight: '100%',
        px: 1,
        py: 7,
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
          style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              MarketPlace
            </Typography>
            <Box
              sx={{
                height: 70,
                width: 70,
                position: 'relative',
                top: -20,
                right: 0,
              }}
            >
              <img alt="Marketplace Image" src={MarketplaceImg} style={{ objectFit: 'contain' }} />
            </Box>
          </Grid>
          {/* <Grid item xs={12}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Manage Orders
            </Typography>
          <div style={{ width: '100%', borderBottom: '0.1px solid rgba(180 , 180, 180, .3)' }}>
            <h1 style={{ fontSize: '25px', marginLeft: '5px' }}>
              <b>Manage Orders</b>
            </h1>
          </div>
          </Grid> */}
        </Grid>
        <Grid item xs={12}>
          <Tabs value={tabValue} onChange={handleTabChange} classes={{ "indicator": { background: "none" } }} aria-label="chatTabs" variant="fullWidth" sx={{ "& button[aria-selected='true']": { borderBottom: "5px solid", borderBottomColor: '#FB7A56', color: "secondary.main" } , width: '100%'}}>
            <CustomTab label="My Orders" {...a11yProps(0)} style={{ fontWeight: 'bold' }} />
            {/* <CustomTab label="My Listings" {...a11yProps(1)} style={{ fontWeight: 'bold' }} /> */}
          </Tabs>
        </Grid>
        <Divider orientation="horizontal" sx={{ marginTop: '-2px' }} />
        {/* {tabValue === 1 ? <OwnListings /> : <OwnOrders /> } */}
        <OwnOrders />
      </Container>
    </Box>
  );
};

export default MarketplaceOrder;