import { Avatar, Button, Box, CardHeader, Chip, Divider, Grid, IconButton, ImageList, ImageListItem, ListItemSecondaryAction, SvgIcon, Typography, useMediaQuery } from '@mui/material';
import { ArrowLeft as ArrowIcon, MessageCircle as MessageIcon, Heart as HeartIcon } from 'react-feather';
import React, { useEffect, useState } from 'react';
import Ratings from '../../Components/Notus/components/Content/Ratings';
import { useDispatch } from 'react-redux';
import { openImageModal } from '../../Redux/actions';
import { Link, useNavigate } from 'react-router-dom';
import OrderMenuBar from '../../Components/Orders/OrderMenubar';
import HeartButton from '../../Components/Orders/HeartButton';

const category = ["Jeans", "Denim"];
const rating = 4;

const list = [
  {
    id: 1,
    title: 'Make Dress Into 2 Piece',
    name: 'Alice'
  },
  {
    id: 2,
    title: 'Make Denim into Jacket',
    name: 'Cassandra',
  },
  {
    id: 3,
    title: 'Embroider Flower on Jacket',
    name: 'Brittany',
  },
  {
    id: 4,
    title: 'Alter waist of Jeans',
    name: 'Maddy',
  },
]

const images = [{ url: 'https://media.lovebonito.com/media/catalog/product/l/n/ln0716-031-1_id9cag7lie8bbdd3.jpg?width=960&height=1344' }]

const OrderDetails = (props) => {
  const notHidden = useMediaQuery(theme => theme.breakpoints.up('md'));
  const navigate = useNavigate();

  // const { id = 0 } = props.match.params;
  // let item = useState(null);

  // useEffect(() => {
  //   if (id) {
  //     item = list.find((val) => val.id === id);
  //     console.log(item);
  //   }
  // }, [id]) 

  const dispatch = useDispatch();
  function handlePhotoModal(images, index) {
    dispatch(openImageModal(images, index))
  }

  return (
    <Grid
      container
      fullWidth
      spacing={0}
      sx={{ overflow: 'scroll', marginBottom: 5, zIndex: '1' }}
    >
      <Grid item lg={12}>
        <SvgIcon
          fontSize="large"
          color="action"
          sx={{ position: 'absolute', float: 'left', top: 35,cursor : 'pointer' }}
          onClick={() => navigate(-1)}
        >
          <ArrowIcon />
        </SvgIcon>
      </Grid>

      <Grid item lg={4} xs={12} container sx={notHidden ? { height: '40vh', width: '100vw', overflow: 'hidden', mt: 20, ml: 5 } : { height: 350, width: '100%', overflow: 'hidden' }}>
        <Grid item lg={12} sx={{ height: 300,display: "flex"  }}>
          <Box sx={{ width: '100%', height: '100%' }}>
            <img src={images[0].url} onClick={() => handlePhotoModal(images.map(({ url }) => url), 0)} height="100%" width="100%" style={{ background: "none", alignSelf: 'center' }} />
          </Box>
        </Grid>

        {/* <Grid item lg={12} sx={{ display: "flex" }}>
          <ImageList cols={2} sx={{ width: 500, height: 450 }}> */}
            {/* {Array.from(listings).filter((val) => val.title.includes(searchValue)).map((list) => (
              <Link to={`/listing/${list.id}`}>
                {console.log(list)}
                <ImageListItem key={list.id} style={{ overflow: 'hidden' }} >
                  {Array.from(list.imageList).slice(0, 1).map((val) => (
                    <img src={val.url} key={val.url} loading="lazy" style={{ maxWidth: 180, minWidth: 180, maxHeight: 180, minHeight: 180, cursor: 'pointer' }} />
                  ))}
                  <ImageListItemBar
                    title={list.title}
                    subtitle={list.refashioner.username}
                    sx={{ background: 'rgba(180, 180, 180, 0.5)', height: '34%' }}
                  />
                </ImageListItem>
              </Link>
            ))} */}
            {/* {Array.from(images).map((list) => (
              <Link to={`/listing/1`}>
                <ImageListItem style={{ overflow: 'hidden' }} >
                  <Box>
                  <img src={list.url} key={list.url} loading="lazy" style={{ maxWidth: 120, minWidth: 120, maxHeight: 120, minHeight: 120, cursor: 'pointer', objectFit: 'contain'}} />
                  </Box>
                </ImageListItem>
              </Link>
            ))}
          </ImageList>
        </Grid> */}
      </Grid>
      <Grid item lg={1} xs={0} />

      <Grid item lg={6} xs={12} container sx={notHidden && { mt: 15, ml: 2 }}>
        <Grid Item xs={9} sx={{ marginTop: 3, marginLeft: 2 }}>
          <Typography variant='h4' sx={{ fontWeight: '650', display: 'inline', overflowWrap: 'break-word' }}>
            Listing's name
          </Typography>
        </Grid>

        <Grid Item xs={2} sx={{ marginTop: 3, marginLeft: 1.5 }}>
          <OrderMenuBar isRefashionerPOV={true} />
        </Grid>

        <Grid Item xs={12} sx={{ marginLeft: 2 }}>
          {Array.from(category).map((val) => (
            <Chip label={val} sx={{ background: '#FB7A56', color: 'white', fontSize: '65%', fontWeight: '600', margin: '5px 3px', padding: '1px 5px', WebkitBorderRadius: '13px' }} />
          ))}
        </Grid>

        <Grid item xs={12} sx={{ marginTop: 1, marginLeft: 2 }}>
          <Typography>
            <CardHeader
              avatar={
                <Avatar
                  sx={{
                    height: '2.0em',
                    width: '2.0em',
                    flexDirection: 'column',
                  }} />
              }
              title={
                <>
                  <Typography variant='h7' sx={{ fontWeight: 'bold' }}>
                    Business's Name
                  </Typography>
                  <Ratings rating={rating} text={rating + "/5"} style={{ display: 'flex' }} />
                </>
              }
              style={{ padding: 0, margin: 0 }}
            />
          </Typography>
        </Grid>

        <Grid item xs={12} lg={10} sx={{ marginTop: 2, marginLeft: 2 }}>
          <Divider orientation='horizontal' sx={{ marginBottom: 2 }} />
          <Typography variant='h7' sx={{ fontWeight: '550' }}>
            Description of listing
          </Typography>
          <Typography variant='body2'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
          </Typography>
        </Grid>

        <Grid item xs={12} lg={12} sx={{ marginTop: 2, marginLeft: 2 }}>
          <Typography variant='h7' sx={{ fontWeight: '550' }}>
            Minimum quantity to order
          </Typography>
          <Typography variant='body2'>
            50
          </Typography>
        </Grid>

        <Grid item xs={12} lg={12} sx={{ marginTop: 2, marginLeft: 2 }}>
          <Typography variant='h7' sx={{ fontWeight: '550' }}>
            Estimated Price / pc
          </Typography>
          <Typography variant='body2'>
            SGD 1.50
          </Typography>
        </Grid>

        <Grid item xs={8} lg={6} sx={{ marginTop: 2, marginLeft: 2, zIndex: '0' }}>
          <Link to="/chat">
            <Button variant="contained" sx={{ background: '#FB7A56', color: 'white', fontWeight: '600', padding: 1, height: '100%', width: '90%' }}>
              <IconButton sx={{ color: 'white' }}>
                <MessageIcon />
              </IconButton>
              Chat with Business
            </Button>
          </Link>
        </Grid>

        <Grid item xs={3} sx={{ marginTop: 2, marginLeft: 0 }}>
          <HeartButton />
        </Grid>
      </Grid >
    </Grid>
  );
};

export default OrderDetails;
