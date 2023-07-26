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
  StepConnector,
  SvgIcon
} from "@mui/material";
import { makeStyles, withStyles} from "@mui/styles";
import RefashionerOrder from '../../Components/Refashioner/RefashionerOrder';
import RefashionerRequest from '../../Components/Refashioner/RefashionerRequest';
import Requests from '../../Components/Orders/Requests';
import ViewAllRequests from '../../Components/Refashioner/ViewRequest/ViewAllRequests';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { ArrowLeft as ArrowIcon } from 'react-feather';

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
    navigate('/home', {replace: true});
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
      <Grid item xs={12} lg={12}>
        <SvgIcon
          fontSize="large"
          color="action"
          onClick={() => navigate(-1)}
        >
          <ArrowIcon />
        </SvgIcon>
      </Grid>
          <Grid
            item
            lg={12}
            sm={12}
            xl={12}
            xs={12}
            sx={{ mt: 1 }}
          >
            <Typography variant='h5' fontWeight={650} ml={0.5}>
              View All Requests
            </Typography>
          </Grid>
          {/* <Grid item xs={12}>
            <Tabs value={tabValue} onChange={handleTabChange} classes={{ "indicator": { background: "none" } }} aria-label="chatTabs" sx={{ width: '100%' }} variant="fullWidth" sx={{ "& button[aria-selected='true']": { borderBottom: "5px solid", borderBottomColor: '#FB7A56', color: "secondary.main" } }}>
              <CustomTab label="Orders" {...a11yProps(0)} style={{ fontWeight: 'bold'}}/>
              <CustomTab label="Request"  {...a11yProps(1)} style={{ fontWeight: 'bold'}}/>
            </Tabs>
          </Grid> */}
          <Divider orientation="horizontal"/>
            <ViewAllRequests />
      </Container>
    </Box>
  );
};

export default OrderPage;