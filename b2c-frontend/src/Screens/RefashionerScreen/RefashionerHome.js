import React, { useEffect } from 'react';
import { Avatar, Box, Button, Card, CardContent, CardHeader, Container, Divider, Grid, SvgIcon, Typography, useMediaQuery } from '@mui/material';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import SearchBox from '../../Components/HomeScreen/SearchBox';
import ViewRefashioner from '../../Components/HomeScreen/ViewRefashioner';
import FeaturedSeries from '../../Components/HomeScreen/FeaturedSeries';
import '../../Components/HomeScreen/stylesheet.css';
import ImagePost from '../../Components/Notus/components/Images/ImagePost';
import logo from '../../Components/HomeScreen/emptyImage.jpeg';
import AlertBox from '../../Components/Refashioner/HomeScreen/AlertBox';
import SalesBox from '../../Components/Refashioner/HomeScreen/SalesBox';
import OngoingProject from '../../Components/Refashioner/HomeScreen/OngoingProject';
import * as orderApi from '../../API/orderApi.js';
import * as userApi from '../../API/userApi.js';
import { useSelector } from 'react-redux';
import InContainerLoading from '../../Components/InContainerLoading';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ViewAllRequestBox from '../../Components/Refashioner/HomeScreen/ViewAllRequestBox';
import ViewRequestsBox from '../../Components/Refashioner/HomeScreen/ViewRequestsBox';

const HomeScreen = () => {
  const list = ["Jeans", "T-shirt", "Dress", "Batik", "Shorts", "Repair", "Embroidery"];
  const currUserData = useSelector((state) => state.currUserData);
  const [loading, setLoading] = React.useState(false);
  const [orders, setOrders] = React.useState([]);
  const navigate = useNavigate();
  const notHidden = useMediaQuery(theme => theme.breakpoints.up('md'));
  const [sales, setSales] = React.useState('');

  useEffect(() => {
    setLoading(true);
    getMySales();
    getMyOrders();
  }, [])

  const getMySales = async () => {
    try {
    await userApi.getSales().then((val) => {
      console.log(val.data);
      setSales(val.data);
    })
  } catch (error) {
    setSales([]);
  }
  }

  const getMyOrders = async () => {
    try {
      await orderApi.getOrders().then((arr) => {
        const array = arr.data;
        array.sort(function (a, b) {
          return new Date(b.orderTime) - new Date(a.orderTime);
        })
        setOrders(arr.data)
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (currUserData.roles.indexOf("USER_REFASHIONER") === -1) {
    navigate('/home', { replace: true });
  }

  const handleReroute = () => {
    navigate('/createListing');
  }

  return (
    <>
      <Helmet>
        <title>Alt.Native | Home</title>
      </Helmet>
      <Box
        sx={{
          minHeight: '100%',
          maxHeight: '100%',
          px: 0.5,
          py: 1,
          overflow: 'scroll',
          marginBottom: 7
        }}
      >
        <Container maxWidth>
          <Grid
            container
            spacing={2}
          >
            <Grid
              item
              lg={12}
              sm={12}
              xl={12}
              xs={12}
            >
            </Grid>
            <Grid
              item
              lg={12}
              sm={12}
              xl={12}
              xs={12}
            >
              <Typography sx={{ fontSize: 25, fontWeight: 'bold', marginTop: 3 }}>
                Welcome back!
              </Typography>
            </Grid>
            <Grid item
              lg={12}
              sm={12}
              xl={12}
              xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Avatar
                  src={currUserData?.avatar?.url}
                  sx={{
                    flexDirection: 'column',
                    bgcolor: '#FB7A56'
                  }} />
                <Typography variant="h6" sx={{ marginLeft: 1, marginTop: 0.5, fontWeight: 'bold' }}>
                  {currUserData?.name}
                </Typography>
              </Box>
              {/* <Box sx={{  display: 'flex', flexDirection: 'row' , float: 'right' }}>
                <Button variant="contained">
                  Create Listing
                </Button>
              </Box> */}
            </Grid>
            <Grid
              item
              lg={12}
              sm={12}
              xl={12}
              xs={12}
            >
              <Divider orientation='horizontal' sx={{ marginBottom: 2 }} />
              <Typography variant="h7" sx={{ fontWeight: 'bold' }}>
                Achievements
              </Typography>
            </Grid>
            <Grid
              item
              lg={4}
              sm={6}
              xl={6}
              xs={6}
            >
              <AlertBox color="#FED279" />
            </Grid>
            <Grid
              item
              lg={4}
              sm={6}
              xl={6}
              xs={6}
            >
              <SalesBox color="#FB7A56" sales={sales}/>
            </Grid>
            {notHidden ? (
            <Grid item lg={4}>
              <Divider orientation='vertical' sx={{ float: 'left'}} />
              <ViewRequestsBox />
            </Grid>
            ) : (
            <Grid item xs={12}>
              <ViewRequestsBox />
            </Grid>
            )}
            {/* <Grid
              item
              lg={6}
              sm={6}
              xl={6}
              xs={6}
            >
              <Divider orientation='horizontal' sx={{ marginBottom: 2 }} />
              <ViewAllRequestBox />
            </Grid> */}
            <Grid
              item
              lg={12}
              sm={12}
              xl={12}
              xs={12}
            >
              <Typography variant="h7" sx={{ fontWeight: 'bold' }}>
                Recent Projects
              </Typography>
            </Grid>
            <Grid
              item
              lg={12}
              sm={12}
              xl={12}
              xs={12}
            >
              {!loading ? (
                (Array.from(orders).slice(0, 3).map((val) => (
                  <OngoingProject title={val.offerTitle} name={val.appUserUsername} completed={val.offerStatus === 'COMPLETED'} created={val.orderTime} deadline={val.proposedCompletionDate} type={val.orderStatus} chat={val.chatAlternateId} refashionee={val.appUserUsername} val={val} id={val.id}/>
                )))
              ) : (
                <InContainerLoading />
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default HomeScreen;