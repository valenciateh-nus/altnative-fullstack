import { Avatar, Button, CardHeader, Chip, Divider, Grid, IconButton, ImageList, ImageListItem, ListItemSecondaryAction, SvgIcon, Typography } from '@mui/material';
import { ArrowLeft as ArrowIcon, MessageCircle as MessageIcon, Heart as HeartIcon } from 'react-feather';
import React, { useEffect, useState } from 'react';
import Ratings from '../../Components/Notus/components/Content/Ratings';
import { useDispatch } from 'react-redux';
import { openImageModal } from '../../Redux/actions';
import { Link } from 'react-router-dom';
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
    id:3, 
    title: 'Embroider Flower on Jacket',
    name: 'Brittany',
  },
  {
    id:4,
    title: 'Alter waist of Jeans',
    name: 'Maddy',
  },
]

const images = ['https://media.lovebonito.com/media/catalog/product/l/n/ln0716-031-1_id9cag7lie8bbdd3.jpg?width=960&height=1344']

const OrderDetails = (props) => {

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
    dispatch(openImageModal(images,index))
  }

  return (
    <Grid
      container
      fullWidth
      spacing={0}
      sx={{ overflow: 'scroll', marginBottom: 5, zIndex: '1'}}
    >
      <Grid Item xs={12} sx={{ height: '40vh', width: '100vw', overflow: 'hidden'}}>
        <Link to="/order">
          <SvgIcon
            fontSize="medium"
            color="action"
            sx={{ position: 'absolute', float: 'left', top: 30 }}
          >
            <ArrowIcon />
          </SvgIcon>
        </Link>
          <img src={images[0]} onClick={() => handlePhotoModal(images.map(({ url }) => url), 0)} height="100%" width="100%" style={{ background: "none", alignSelf: 'center' }} />
          {/* {images &&
          <ImageList cols = {3} sx={{width: 200, height : 200}}>
            {images.map((img,i) => (
              <ImageListItem key={i} style={{width:100, height: 100, overflow : 'hidden'}} >
                <img src={`${img}`} loading="lazy" onClick={() => handlePhotoModal(images.map(({ url }) => url), i)} style={{cursor:'pointer'}}/>
              </ImageListItem>
            ))}
          </ImageList>
        } */}
      </Grid>

      <Grid Item xs={9} sx={{ marginTop: 3, marginLeft: 2 }}>
        <Typography variant='h4' sx={{ fontWeight: '650', display: 'inline', overflowWrap: 'break-word'}}>
          Project's name
        </Typography>
      </Grid>

      <Grid Item xs={2} sx={{ marginTop: 3, marginLeft: 1.5 }}>
        <OrderMenuBar isRefashionerPOV={true}/>
      </Grid>

      <Grid Item xs={12} sx={{ marginLeft: 2 }}>
        {Array.from(category).map((val) => (
          <Chip label={val} sx={{ background: '#FB7A56', color: 'white', fontSize: '65%', fontWeight: '600', margin: '5px 3px', padding: '1px 5px', WebkitBorderRadius: '13px' }} />
        ))}
      </Grid>

      <Grid item xs={12} sx={{ marginTop: 1, marginLeft: 2}}>
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
                  Refashioner's Name
                </Typography>
                <Ratings rating={rating} text={rating + "/5"} style={{ display: 'flex' }} />
              </>
            }
            style={{ padding: 0, margin: 0 }}
          />
        </Typography>
      </Grid>

      <Grid item xs={12} sx={{ marginTop: 2, marginLeft: 2 }}>
      <Divider orientation='horizontal' sx={{marginBottom:2}}/>
        <Typography variant='h7' sx={{ fontWeight: '550' }}>
          Description of project
        </Typography>
        <Typography variant='body2'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
        </Typography>
      </Grid>

      <Grid item xs={12} sx={{ marginTop: 2, marginLeft: 2 }}>
        <Typography variant='h7' sx={{ fontWeight: '550' }}>
          Estimated Price
        </Typography>
        <Typography variant='body2'>
          SGD 10-15
        </Typography>
      </Grid>

      <Grid item xs={8} sx={{ marginTop: 2, marginLeft: 2, zIndex: '0'}}>
        <Link to="/chat">
        <Button variant="contained" sx={{ background: '#FB7A56', color: 'white', fontWeight: '600', padding: 1 ,height: '100%', width: '90%'}}>
          <IconButton sx={{ color: 'white'}}>
            <MessageIcon />
          </IconButton>
          Chat with Refashioner
        </Button>
        </Link>
      </Grid>

      <Grid item xs={3} sx={{ marginTop: 2, marginLeft: 0 }}>
        <HeartButton />
      </Grid>
    </Grid >
  );
};

export default OrderDetails;
