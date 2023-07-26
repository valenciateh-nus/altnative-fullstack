import React, { useEffect } from 'react';

// Library Imports
import { Box, Card, CardContent, CircularProgress, Container, Grid, Typography } from '@mui/material';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

// Components Imports
import ImagePost from '../../Components/Notus/components/Images/ImagePost';
import SearchBox from '../../Components/HomeScreen/SearchBox';
import ViewRefashioner from '../../Components/HomeScreen/ViewRefashioner';
import FeaturedSeries from '../../Components/HomeScreen/FeaturedSeries';
import logo from '../../Components/HomeScreen/emptyImage.jpeg';
import Category from '../../Components/HomeScreen/Category';
import ViewBusiness from '../../Components/HomeScreen/ViewBusiness';
import VisitMarketplace from '../../Components/HomeScreen/VisitMarketplace';
import '../../Components/HomeScreen/stylesheet.css';

// Redux
import { toggleBottomNavBar } from '../../Redux/actions';
import { useDispatch } from 'react-redux';

// API Call
import * as indexApi from '../../API/index.js';

// Google Analytics
import ReactGa from 'react-ga';


const HomeScreen = () => {
  const [categoryList, setCategoryList] = React.useState([]);

  //console.log("CATEGORIES" , categoryList);
  const dispatch = useDispatch();
  useEffect(() => {
    indexApi.getCategory().then((arr) => setCategoryList(arr.data));
    dispatch(toggleBottomNavBar(true));
  }, [])

  // Google Analytics
  useEffect(() => {
    ReactGa.initialize('UA-223374225-1')
    console.log("sending data to GA");
    ReactGa.pageview('/home');
  }, [])


  return (
    <>
      <Helmet>
        <title>Alt.Native | Home</title>
      </Helmet>
      <Box
        sx={{
          minHeight: '100%',
          maxHeight: '100%',
          px: 3,
          py: 3,
          overflow: 'scroll',
          marginBottom: 7,
        }}
      >
        <Container>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              lg={12}
              sm={12}
              xl={12}
              xs={12}
            >
              <Typography variant='h4' fontWeight='bold'>Get Started!</Typography>
            </Grid>
            <Grid
              item
              lg={6}
              sm={6}
              xl={6}
              xs={6}
            >
              <SearchBox text="I have this, what can I refashion?" color="#FED279" linkTo="/search" />
            </Grid>
            <Grid
              item
              lg={6}
              sm={6}
              xl={6}
              xs={6}
            >
              <SearchBox text="I want this, what do I need?" color="#FB7A56" linkTo="/search2" />
            </Grid>
            <Grid
              item
              lg={12}
              sm={12}
              xl={12}
              xs={12}
            >
              <Typography variant='h5' fontWeight='bold'>Search by Categories</Typography>
            </Grid>
              <Category />
            <Grid
              item
              lg={4}
              sm={12}
              xl={4}
              xs={12}
            >
              {/* <Typography variant='h6' fontWeight='bold'>See Businesses on Alt.Native!</Typography> */}
              {/* <ImagePost src={logo} /> */}
              <ViewBusiness />
            </Grid>
            <Grid
              item
              lg={4}
              md={12}
              xl={4}
              xs={12}
            >
              <ViewRefashioner text="We got you, you're in good hands" />
            </Grid>
            <Grid
              item
              lg={4}
              md={12}
              xl={4}
              xs={12}
            >
              {/* <Typography variant='h5' fontWeight='bold'>Featured Series</Typography>
              <FeaturedSeries /> */}
              <VisitMarketplace />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default HomeScreen;