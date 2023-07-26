import React, {useState} from 'react';
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
import { makeStyles, withStyles} from "@mui/styles";
import Deadstocks from '../../Components/Orders/Deadstocks';
import Requests from '../../Components/Orders/Requests';

const CustomTab = withStyles({
  root: {
    textTransform: "none"
  }
})(Tab);

const OrderPage = () => {

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
            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            {/* <div style={{ width: '100%', borderBottom: '0.1px solid rgba(180 , 180, 180, .3)' }}>
              <h1 style={{ fontSize: '25px', marginLeft: '5px'}}>
                <b>My Orders</b>
              </h1>
            </div> */}
            <Typography variant="h4" fontWeight={660}> 
              My Orders
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Tabs value={tabValue} onChange={handleTabChange} classes={{ "indicator": { background: "none" } }} aria-label="chatTabs" variant="fullWidth" sx={{ "& button[aria-selected='true']": { borderBottom: "5px solid", borderBottomColor: '#FB7A56', color: "secondary.main" }, width: '100%'}}>
              <CustomTab label="Deadstock" {...a11yProps(0)} style={{ fontWeight: 'bold'}}/>
              <CustomTab label="Business Requests"  {...a11yProps(1)} style={{ fontWeight: 'bold'}}/>
            </Tabs>
          </Grid>
          <Divider orientation="horizontal" sx={{ marginTop: '-2px' }} />
            {tabValue === 1 ? <Requests /> : <Deadstocks /> }
      </Container>
    </Box>
  );
};

export default OrderPage;