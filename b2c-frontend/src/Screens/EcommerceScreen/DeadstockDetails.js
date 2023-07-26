import { Avatar, Button, Box, CardHeader, Chip, Divider, Grid, IconButton, ImageList, ImageListItem, ListItemSecondaryAction, SvgIcon, Typography, useMediaQuery } from '@mui/material';
import { ArrowLeft as ArrowIcon, MessageCircle as MessageIcon, Heart as HeartIcon } from 'react-feather';
import React, { useEffect, useState } from 'react';
import Ratings from '../../Components/Notus/components/Content/Ratings';
import { useDispatch, useSelector } from 'react-redux';
import { openImageModal } from '../../Redux/actions';
import { Link, useNavigate } from 'react-router-dom';
import OrderMenuBar from '../../Components/Orders/OrderMenubar';
import HeartButton from '../../Components/Orders/HeartButton';
import { useParams } from 'react-router';
import * as marketplaceApi from '../../API/marketplaceApi';
import InContainerLoading from '../../Components/InContainerLoading';
import MarketplaceImg from '../../Components/Images/MarketplaceImage.png';
import EcommerceMenuBar from '../../Components/Ecommerce/EcommerceMenuBar';
import ChatWithBusinessButton from '../../Components/Orders/ChatWithBusinessButton';

const DeadstockDetails = () => {
  const notHidden = useMediaQuery(theme => theme.breakpoints.up('md'));
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [listing, setListing] = React.useState([]);
  const [image, setImage] = React.useState([]);
  const [listingUser, setListingUser] = React.useState('');
  const { id = 0 } = useParams();
  const currUserData = useSelector((state) => state.currUserData);
  const [favourites, setFavourites] = React.useState([]);
  const [favorited, setFavourited] = React.useState([]);

  useEffect(() => {
    setLoading(true);
    getListingById();
    getFavorite();
  }, [])

  const getListingById = async () => {
    try {
      await marketplaceApi.getMarketplaceListingById(id).then((val) => {
        console.log(id);
        console.log(val.data);
        setListing(val.data);
        setImage(val.data.imageList);
        setListingUser(val.data.appUser )
      })
    } catch (error) {
      alert('fail');
      setListing([]);
    } finally {
      setLoading(false);
    }
  }

  const dispatch = useDispatch();
  function handlePhotoModal(images, index) {
    dispatch(openImageModal(images, index))
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
      fullWidth
      spacing={0}
      sx={{ overflow: 'scroll', marginBottom: 5, zIndex: '1' }}
    >
      <Grid item lg={12}>
        <SvgIcon
          fontSize="large"
          color="action"
          sx={{ position: 'absolute', float: 'left', top: 35 }}
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

      {/* <Grid item lg={4} xs={12} container sx={notHidden ? { overflow: 'hidden', mt: 20, ml: 5 } : { overflow: 'hidden' }}> */}
      <Grid item lg={4} xs={12} container sx={notHidden ? { mt: 15, ml: 5, overflow: 'hidden'} : { overflow: 'hidden' }}>
        <Grid item lg={12} sx={{ height: 300, display: "flex" }}>
          <Box sx={{ width: '100%', height: '100%' }}>
            {Array.from(image).slice(0,1).map((img) => (
              <img src={img.url} onClick={() => handlePhotoModal(image.map(({ url }) => url), 0)} height={300} width="100%" style={{ background: "none", alignSelf: 'center' }} />
            ))}
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

      <Grid item lg={6} xs={12} container sx={notHidden && { mt: 0, ml: 2 }}>
        <Grid Item xs={9} sx={{ marginTop: 3, marginLeft: 2 }}>
          <Typography variant='h4' sx={{ fontWeight: '650', display: 'inline', overflowWrap: 'break-word' }}>
            {listing.title}
          </Typography>
        </Grid>

        <Grid Item xs={2} sx={{ marginTop: 3, marginLeft: 1.5 }}>
          {listingUser.username === currUserData.username && <EcommerceMenuBar id={id} isSellerPov={true} />}
        </Grid>

        <Grid Item xs={12} sx={{ marginLeft: 2}}>
        <Chip label="Deadstock Listing" color="primary" sx={{ color: 'white', fontSize: '75%', fontWeight: '600', margin: '5px 3px', padding: '1px 5px', WebkitBorderRadius: '13px' }} />
        <Chip label={listing?.category?.categoryName} color="secondary" sx={{ color: 'white', fontSize: '75%', fontWeight: '600', margin: '5px 3px', padding: '1px 5px', WebkitBorderRadius: '13px' }} />
{/* 
          {Array.from(listing.category).map((val) => (
            <Chip label={val.categoryName} sx={{ background: '#FB7A56', color: 'white', fontSize: '65%', fontWeight: '600', margin: '5px 3px', padding: '1px 5px', WebkitBorderRadius: '13px' }} />
          ))} */}
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
                    {listing?.appUser?.name}
                  </Typography>
                  <Ratings rating={listing?.appUser?.rating} text={listing?.appUser?.rating + "/5"} style={{ display: 'flex' }} />
                </>
              }
              style={{ padding: 0, margin: 0, cursor: 'pointer' }}
              onClick={() => navigate(`/businessProfile/${listing?.appUser?.id}`)}
            />
          </Typography>
        </Grid>

        <Grid item xs={12} lg={10} sx={{ marginTop: 2, marginLeft: 2 }}>
          <Divider orientation='horizontal' sx={{ marginBottom: 2 }} />
          <Typography variant='h6' sx={{ fontWeight: '550', fontSize: 18 }}>
            Description of listing
          </Typography>
          <Typography variant='body1'>
            {listing?.description}
          </Typography>
        </Grid>

        <Grid item xs={12} lg={12} sx={{ marginTop: 2, marginLeft: 2 }}>
          <Typography variant='h6' sx={{ fontWeight: '550', fontSize: 18 }}>
            Total quantity to order
          </Typography>
          <Typography variant='body1' sx={{ fontSize: 17 }}>
            {listing?.quantity}
          </Typography>
        </Grid>

        <Grid item xs={12} lg={12} sx={{ marginTop: 2, marginLeft: 2 }}>
          <Typography variant='h6' sx={{ fontWeight: '550', fontSize: 18  }}>
            Minimum quantity to order
          </Typography>
          <Typography variant='body1' sx={{ fontSize: 17 }}>
            {listing?.minimum}
          </Typography>
        </Grid>

        <Grid item xs={12} lg={12} sx={{ marginTop: 2, marginLeft: 2 }}>
          <Typography variant='h6' sx={{ fontWeight: '550' , fontSize: 18 }}>
            Price / pc
          </Typography>
          <Typography variant='body1' sx={{ fontSize: 17 }}>
            {listing?.price}
          </Typography>
        </Grid>

        {currUserData.id != listingUser?.id && (
          <>
            <Grid item xs={8} lg={6} sx={{ marginTop: 2, marginLeft: 2, zIndex: '0', mb: 1 }}>
              <ChatWithBusinessButton listing={listing} />
            </Grid>

            <Grid item xs={3} sx={{ marginTop: 2, marginLeft: 0, mb: 1 }}>
            <Button variant="contained" color={favorited ? 'secondary' : 'primary'} sx={{ color: 'white', fontWeight: '600', padding: 1, height: '100%', width: '90%' }} onClick={handleClick}>
              <IconButton sx={{ color: 'white' }}>
                <HeartIcon fill="white" size="30px" />
              </IconButton>
            </Button>
          </Grid>
          </>
        )}
      </Grid >
    </Grid>
  ) : (
    <InContainerLoading />
  )
)}

export default DeadstockDetails;
