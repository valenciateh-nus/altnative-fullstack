import { Avatar, Button, Box, CardHeader, Chip, Divider, Grid, IconButton, ImageList, ImageListItem, ListItemSecondaryAction, SvgIcon, Typography, useMediaQuery, Rating } from '@mui/material';
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
import ChatWithBusinessButton from '../../Components/Orders/ChatWithBusinessButton';
import ListingMenuBar from '../../Components/Orders/ListingMenuBar';
import { toTitleCase } from '../../constants';

const DeadstockListingDetails = () => {
  const notHidden = useMediaQuery(theme => theme.breakpoints.up('md'));
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [listing, setListing] = React.useState([]);
  const [image, setImage] = React.useState([]);
  const [listingUser, setListingUser] = React.useState([]);
  const { id = 0 } = useParams();
  const currUserData = useSelector((state) => state.currUserData);

  useEffect(() => {
    setLoading(true);
    getListingById();
  }, [])

  const getListingById = async () => {
    try {
      await marketplaceApi.getMarketplaceListingById(id).then((val) => {
        console.log(id);
        console.log(val.data);
        setListing(val.data);
        setImage(val.data.imageList);
        setListingUser(val.data.appUser);
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
          sx={{ position: 'absolute', float: 'left', top: 35,cursor : 'pointer' }}
          onClick={() => navigate(-1)}
        >
          <ArrowIcon />
        </SvgIcon>
      </Grid>

      {/* <Grid item lg={4} xs={12} container sx={notHidden ? { overflow: 'hidden', mt: 20, ml: 5 } : { overflow: 'hidden' }}> */}
      <Grid item lg={4} xs={12} container sx={notHidden ? { mt: 20, ml: 5, overflow: 'hidden' } : { overflow: 'hidden' }}>
        <Grid item lg={12} sx={{ height: 300, display: "flex" }}>
          <Box sx={{ width: '100%', height: '100%' }}>
            {Array.from(image).slice(0, 1).map((img) => (
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

      <Grid item lg={6} xs={12} container sx={notHidden && { mt: 15, ml: 2 }}>
        <Grid Item xs={9} sx={{ marginTop: 3, marginLeft: 2 }}>
          <Typography variant='h4' sx={{ fontWeight: '650', display: 'inline', overflowWrap: 'break-word' }}>
            {listing.title}
          </Typography>
        </Grid>

        <Grid Item xs={2} sx={{ marginTop: 3, marginLeft: 1.5 }}>
          <ListingMenuBar isBusinessPOV={currUserData.username === listingUser.username} listing={listing}/>
        </Grid>

        <Grid Item xs={12} sx={{ marginLeft: 2 }}>
          {listing.marketplaceListing === 'DRAFT' &&
            <Chip label="DRAFT" color="info" sx={{ color: 'white', fontSize: '75%', fontWeight: '600', margin: '5px 3px', padding: '1px 5px', WebkitBorderRadius: '13px' }} />
          }
          <Chip label="Deadstock Listing" color="primary" sx={{ color: 'white', fontSize: '75%', fontWeight: '600', margin: '5px 3px', padding: '1px 5px', WebkitBorderRadius: '13px' }} />
          <Chip label={listing.category.categoryName} color="secondary" sx={{ color: 'white', fontSize: '75%', fontWeight: '600', margin: '5px 3px', padding: '1px 5px', WebkitBorderRadius: '13px' }} />
          {/* 
          {Array.from(listing.category).map((val) => (
            <Chip label={val.categoryName} sx={{ background: '#FB7A56', color: 'white', fontSize: '65%', fontWeight: '600', margin: '5px 3px', padding: '1px 5px', WebkitBorderRadius: '13px' }} />
          ))} */}
        </Grid>

        <Grid item xs={12} sx={{ marginTop: 1, marginLeft: 2 }}>
        {/* <ProfileCard user={listing.appUser} /> */}

        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', ml: 0, mt: 1, cursor: 'pointer'}} onClick={() => navigate(`/userProfile/${listing.appUser.id}`)}>
          <Avatar src={listing?.appUser?.avatar?.url} alt={listing.appUser.name} sx={{ maxWidth: '50px', maxHeight: '50px', height: '4em', width: '4em', bgcolor: '#FB7A56', marginRight: 2 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='h6'>{toTitleCase(listing.appUser.name)}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Rating value={listing.appUser.rating} readOnly sx={{ mr: 1 }} />
              <Typography variant='body1' color='GrayText'>{`(${Math.round(listing.appUser.rating).toFixed(1)})`}</Typography>
            </Box>
          </Box>
        </Box>

          {/* <Typography>
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
                    {listing.appUser.name}
                  </Typography>
                  <Ratings rating={listing.appUser.rating} text={listing.appUser.rating + "/5"} style={{ display: 'flex' }} />
                </>
              }
              style={{ padding: 0, margin: 0 }}
            />
          </Typography> */}
        </Grid>

        <Grid item xs={12} lg={10} sx={{ marginTop: 2, marginLeft: 2 }}>
          <Divider orientation='horizontal' sx={{ marginBottom: 2 }} />
          <Typography variant='h6' sx={{ fontWeight: '550', fontSize: 18 }}>
            Description of listing
          </Typography>
          <Typography variant='body1'>
            {listing.description}
          </Typography>
        </Grid>

        <Grid item xs={12} lg={12} sx={{ marginTop: 2, marginLeft: 2 }}>
          <Typography variant='h6' sx={{ fontWeight: '550', fontSize: 18 }}>
            Total quantity to order
          </Typography>
          <Typography variant='body1' sx={{ fontSize: 17 }}>
            {listing.quantity}
          </Typography>
        </Grid>

        <Grid item xs={12} lg={12} sx={{ marginTop: 2, marginLeft: 2 }}>
          <Typography variant='h6' sx={{ fontWeight: '550', fontSize: 18 }}>
            Minimum quantity to order
          </Typography>
          <Typography variant='body1' sx={{ fontSize: 17 }}>
            {listing.minimum}
          </Typography>
        </Grid>

        <Grid item xs={12} lg={12} sx={{ marginTop: 2, marginLeft: 2 }}>
          <Typography variant='h6' sx={{ fontWeight: '550', fontSize: 18 }}>
            Price / pc
          </Typography>
          <Typography variant='body1' sx={{ fontSize: 17 }}>
            SGD {Math.round(listing.price) !== listing.price ? Number(listing.price).toFixed(2) : listing.price}
          </Typography>
        </Grid>

        {listing.available ? (
          <>
            {currUserData.id != listingUser.id && (
              <>
                <Grid item xs={8} lg={6} sx={{ marginTop: 2, marginLeft: 2, zIndex: '0' }}>
                  <ChatWithBusinessButton listing={listing} />
                </Grid>

                <Grid item xs={3} sx={{ marginTop: 2, marginLeft: 0 }}>
                  <HeartButton />
                </Grid>
              </>
            )}
          </>
        ) : (
          <Grid item xs={12} lg={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 5 }}>
            <Typography align="center" fontWeight={550} color="red">
              This listing has been deleted.
            </Typography>
          </Grid>
        )}
        
        {(!listing.instock && listing.available) && (
        <>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", alignContent: "center", marginTop: 4, marginBottom: 0.5 }}>
        <Button disabled={true} variant="contained" sx={{ ":disabled": { color: 'white', backgroundColor: '#bf1d17' }, color: 'white', fontWeight: '600', padding: 1, height: '100%', width: '90%' }} >
          Out Of Stock
        </Button>
      </Grid>
      </>
      )}
      </Grid >
    </Grid>
  ) : (
    <InContainerLoading />
  )
  )
}

export default DeadstockListingDetails;
