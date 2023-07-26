import { Avatar, Button, Box, CardHeader, Chip, Divider, Grid, IconButton, ImageList, ImageListItem, ListItemSecondaryAction, SvgIcon, Typography, CircularProgress, useMediaQuery } from '@mui/material';
import { ArrowLeft as ArrowIcon, MessageCircle as MessageIcon, Heart as HeartIcon } from 'react-feather';
import React, { useEffect, useState } from 'react';
import Ratings from '../../Components/Notus/components/Content/Ratings';
import { useDispatch, useSelector } from 'react-redux';
import { openImageModal, setImageIndex } from '../../Redux/actions';
import { Link } from 'react-router-dom';
import OrderMenuBar from '../../Components/Orders/OrderMenubar';
import HeartButton from '../../Components/Orders/HeartButton';
import MarketplaceImg from '../../Components/Images/MarketplaceImage.png';
import EcommerceMenuBar from '../../Components/Ecommerce/EcommerceMenuBar';
import { useNavigate, useParams } from 'react-router';
import * as marketplaceApi from '../../API/marketplaceApi.js';
import ChatWithRefashionerButton from '../../Components/Orders/ChatWithRefashionerButton';

// Google Analytics
import ReactGa from 'react-ga';

const Listing = (props) => {
  const notHidden = useMediaQuery(theme => theme.breakpoints.up('md'));
  const { id = 0 } = useParams();
  const [listing, setListing] = React.useState([]);
  const [category, setCategory] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [image, setImage] = React.useState([]);
  const [favourites, setFavourites] = React.useState([]);
  const [favorited, setFavourited] = React.useState([]);
  const [listingUsername, setListingUsername] = React.useState('');
  const [listingUserRating, setListingUserRating] = React.useState(0);
  const [listingUser, setListingUser] = React.useState([]);
  const [available, setAvailable] = useState(true);
  const [instock, setInstock] = useState(true);
  const [userId, setUserId] = React.useState('');

  const currUserData = useSelector((state) => state.currUserData);

  const navigate = useNavigate(-1);

  useEffect(() => {
    setLoading(true);
    getCurrListing();
    getFavorite();
  }, [])

  // Google Analytics
  useEffect(() => {
    ReactGa.initialize('UA-223374225-1')
    console.log("sending data to GA");
    ReactGa.pageview('/marketplaceListing/' + id);
  }, [])

  console.log(listing);

  const dispatch = useDispatch();
  function handlePhotoModal(images, index) {
    dispatch(openImageModal(images, index))
  }

  const getCurrListing = async () => {
    try {
      await marketplaceApi.getMarketplaceListingById(id).then((val) => {
        console.log(val);
        setListing(val.data);
        setCategory(val.data.category.categoryName);
        setImage(val.data.imageList[0]);
        setListingUsername(val.data.appUser.username);
        setListingUserRating(val.data.appUser.rating);
        setListingUser(val.data.appUser.avatar);
        setAvailable(val.data.available);
        setInstock(val.data.instock);
        setUserId(val.data.appUser.id);
      })
    } catch (error) {
      setListing([]);
    }
  }


  const getFavorite = async () => {
    try {
      await marketplaceApi.getFavorite().then((arr) => {
        setFavourites(arr.data);
        console.log(arr.data);
        setFavourited(arr.data.findIndex((val) => val.id == id) !== -1);
      })
    } catch (error) {
      setFavourites([]);
    } finally {
      setLoading(false);
    }
  }

  const handleClick = (e) => {
    if (favorited) { //alr favorite
      marketplaceApi.removeFavorite(id).then((val) => {
        setFavourited(false);
      })
    } else { //new fav
      marketplaceApi.addFavorite(id).then((val) => {
        setFavourited(true);
      })
    }
  }

  return (!loading ? (
    <Grid
      container
      spacing={0}
      sx={{ overflow: 'scroll', marginBottom: 10, zIndex: '1' }}
    >
      <Grid item xs={12}>
        <SvgIcon
          fontSize="medium"
          color="action"
          sx={{ position: 'absolute', float: 'left', top: 30, cursor: 'pointer' }}
          onClick={() => navigate(-1)}
        >
          <ArrowIcon />
        </SvgIcon>
      </Grid>

      <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 5, marginBottom: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          MarketPlace
        </Typography>
        <Box
          sx={{
            height: 80,
            width: 80,
            position: 'relative',
            top: -20,
            right: 0,
          }}
        >
          <img alt="Marketplace Image" src={MarketplaceImg} style={{ objectFit: 'contain' }} />
        </Box>
      </Grid>

      <Grid item lg={4} xs={12} container sx={notHidden ? { mt: 0, ml: 5, overflow: 'hidden'} : { overflow: 'hidden' }}>

      <Grid item xs={12} sx={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
        <img src={image.url} onClick={() => handlePhotoModal(listing.imageList.map(({ url }) => url), 0)} height="100%" width="100%" style={{ maxHeight: 400, maxWidth: 400, background: "none", alignSelf: 'center', objectFit: 'contain' }} />
      </Grid>
      </Grid>

      <Grid item lg={1} xs={0} />

<Grid item lg={6} xs={12} container sx={notHidden && { mt: 0, ml: 2 }}>
      <Grid item xs={12} sx={{ marginTop: 3, marginLeft: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='h4' sx={{ fontWeight: '650', display: 'inline', overflowWrap: 'break-word' }}>
            {listing.title}
          </Typography>
          {listingUsername === currUserData.username && <EcommerceMenuBar id={id} isSellerPov={true} />}
        </Box>
      </Grid>

      <Grid item xs={12} sx={{ marginLeft: 2, marginBottom: 1 }}>
        <Typography variant='h6'>
          SGD{listing.price}
        </Typography>
      </Grid>

      <Grid item xs={12} sx={{ marginLeft: 2 }}>
        {/* {Array.from(listing.category).map((val) => ( */}
        {listing.marketplaceListingStatus === 'DRAFT' &&
          (
            <>
              <Chip label="DRAFT" color="primary" sx={{ color: 'white', fontSize: '65%', fontWeight: '600', marginBottom: 1, padding: '1px 5px', WebkitBorderRadius: '13px' }} />
              &nbsp;
            </>

          )
        }
        <Chip label={category} sx={{ background: '#FB7A56', color: 'white', fontSize: '65%', fontWeight: '600', marginBottom: 1, padding: '1px 5px', WebkitBorderRadius: '13px' }} />
        {/* ))} */}
      </Grid>

      <Grid item xs={12} sx={{ marginTop: 1, marginLeft: 2 }}>
        <Typography>
          <CardHeader
            avatar={
              <Avatar
                src={listingUser ? listingUser.url : ''}
                sx={{
                  height: '2.0em',
                  width: '2.0em',
                  flexDirection: 'column',
                }} />
            }
            title={
              <>
                <Typography variant='h7' sx={{ fontWeight: 'bold' }}>
                  {listingUsername}
                </Typography>
                <Ratings rating={listingUserRating} text={listingUserRating + "/5"} style={{ display: 'flex' }} />
              </>
            }
            style={{ padding: 0, margin: 0, cursor: 'pointer' }}
            onClick={() => navigate(`/userProfile/${userId}`)}
          />
        </Typography>
      </Grid>

      <Grid item xs={12} sx={{ marginTop: 2, marginLeft: 2 }}>
        <Divider orientation='horizontal' sx={{ marginBottom: 2 }} />
        <Typography variant='h7' sx={{ fontWeight: '550' }}>
          Description
        </Typography>
        <Typography variant='body2'>
          {listing.description}
        </Typography>
      </Grid>

      <Grid item xs={12} sx={{ marginTop: 2, marginLeft: 2 }}>
        <Typography variant='h7' sx={{ fontWeight: '550' }}>
          Quantity
        </Typography>
        <Typography variant='body2'>
          {listing.quantity}
        </Typography>
      </Grid>

      <Grid item xs={12} sx={{ marginTop: 2, marginLeft: 2 }}>
        <Typography variant='h7' sx={{ fontWeight: '550' }}>
          Minimum to purchase
        </Typography>
        <Typography variant='body2'>
          {listing.minimum}
        </Typography>
      </Grid>

      {(listingUsername !== currUserData.username && available && listing.instock) &&
        <>
          <Grid item xs={8} sx={{ marginTop: 2, marginLeft: 2, zIndex: '0', mb: 1 }}>
            <ChatWithRefashionerButton mpl={listing} title="Chat with Seller" />
          </Grid>
          <Grid item xs={3} sx={{ marginTop: 2, marginLeft: 0, mb: 1  }}>
            <Button variant="contained" color={favorited ? 'secondary' : 'primary'} sx={{ color: 'white', fontWeight: '600', padding: 1, height: '100%', width: '90%' }} onClick={handleClick}>
              <IconButton sx={{ color: 'white' }}>
                <HeartIcon fill="white" size="30px" />
              </IconButton>
            </Button>
          </Grid>
        </>
      }
      {!available && (
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", alignContent: "center", marginTop: 4 }}>
          <Typography variant="subtitle1">
            This post has been deleted.
          </Typography>
        </Grid>
      )
      }

      {(!instock && available) && (
        <>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", alignContent: "center", marginTop: 4, marginBottom: 0.5 }}>
        <Button disabled={true} variant="contained" sx={{ ":disabled": { color: 'white', backgroundColor: '#bf1d17' }, color: 'white', fontWeight: '600', padding: 1, height: '100%', width: '90%' }} >
          Out Of Stock
        </Button>
      </Grid>
      </>
      )}
            </Grid>

    </Grid >
  ) : (
    <Box sx={{ display: 'flex', flexGrow: 1, height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <CircularProgress color='secondary' sx={{ marginBottom: 2 }} />
      <Typography>Loading...</Typography>
    </Box>
  )
  );
};

export default Listing;
