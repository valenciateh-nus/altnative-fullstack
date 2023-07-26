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
import * as indexApi from '../../API/index';
import InContainerLoading from '../../Components/InContainerLoading';
import ChatWithBusinessButton from '../../Components/Orders/ChatWithBusinessButton';
import ProfileCard from '../../Components/ProfileCard';

const BusinessRequestDetails = () => {
  const notHidden = useMediaQuery(theme => theme.breakpoints.up('md'));
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [listing, setListing] = React.useState([]);
  const [image, setImage] = React.useState([]);
  const { id = 0 } = useParams();
  const currUserData = useSelector((state) => state.currUserData);
  const [listingUser, setListingUser] = React.useState([]);

  useEffect(() => {
    setLoading(true);
    getListingById();
  }, [])

  const getListingById = async () => {
    try {
      await indexApi.getRequestsById(id).then((val) => {
        console.log(id);
        console.log(val.data);
        setListing(val.data);
        setImage(val.data.imageList);
        setListingUser(val.data.refashionee);
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
              <img src={img.url} onClick={() => handlePhotoModal(image.map(({ url }) => url), 0)} height={300} width="100%" style={{ cursor: 'pointer', background: "none", alignSelf: 'center' }} />
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

      <Grid item lg={6} xs={12} container sx={notHidden && { mt: 5, ml: 2 }}>
        <Grid Item xs={9} sx={{ marginTop: 3, marginLeft: 2 }}>
          <Typography variant='h4' sx={{ fontWeight: '650', display: 'inline', overflowWrap: 'break-word' }}>
            {listing.title}
          </Typography>
        </Grid>

        <Grid Item xs={2} sx={{ marginTop: 3, marginLeft: 1.5 }}>
          <OrderMenuBar isBusinessPOV={currUserData.username === listingUser.username} listing={listing} />
        </Grid>

        <Grid Item xs={12} sx={{ marginLeft: 1.5 }}>
          {listing.requestStatus === 'DRAFT' &&
            <Chip label="DRAFT" color="info" sx={{ color: 'white', fontSize: '75%', fontWeight: '600', margin: '5px 3px', padding: '1px 5px', WebkitBorderRadius: '13px' }} />
          }
          <Chip label="Business Request" color="primary" sx={{ color: 'white', fontSize: '75%', fontWeight: '600', margin: '5px 3px', padding: '1px 5px', WebkitBorderRadius: '13px' }} />
          <Chip label={listing.category.categoryName} color="secondary" sx={{ color: 'white', fontSize: '75%', fontWeight: '600', margin: '5px 3px', padding: '1px 5px', WebkitBorderRadius: '13px' }} />
        </Grid>

        <Grid Item xs={12} sx={{ marginLeft: 2 }}>
          {Array.from(listing.category).map((val) => (
            <Chip label={val} sx={{ background: '#FB7A56', color: 'white', fontSize: '65%', fontWeight: '600', margin: '5px 3px', padding: '1px 5px', WebkitBorderRadius: '13px' }} />
          ))}
        </Grid>

        <Grid item xs={12} sx={{ marginTop: 1, marginLeft: 2 }}>
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
                    {listing.refashionee.name}
                  </Typography>
                  <Ratings rating={listing.refashionee.rating} text={listing.refashionee.rating + "/5"} style={{ display: 'flex' }} />
                </>
              }
              style={{ padding: 0, margin: 0 }}
            />
          </Typography> */}
          <ProfileCard user={listing.refashionee} />
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

        <Grid item xs={12} lg={10} sx={{ marginTop: 2, marginLeft: 2 }}>
          <Typography variant='h6' sx={{ fontWeight: '550', fontSize: 18 }}>
            Deadline
          </Typography>
          <Typography variant='body1'>
            {listing.proposedCompletionDate}
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
            Estimated Price / pc
          </Typography>
          <Typography variant='body1' sx={{ fontSize: 17 }}>
          SGD {Math.round(listing.price) !== listing.price ? Number(listing.price).toFixed(2) : listing.price}
          </Typography>
        </Grid>

        {currUserData.id === listingUser.id && (
          <Grid item xs={12} sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: "center"}}>
            <Button variant="contained" color="primary" sx={{ width: '90%', mb: 1, color:'white', fontSize: 15, fontWeight: 600}} onClick={() => navigate(`/viewRequestBids/${id}`)} >
              View bids
            </Button>
          </Grid>
        )}

        {listing.available ? (
          <>
            {currUserData.id != listingUser.id && (
              <>
                <Grid item xs={8} lg={6} sx={{ marginTop: 2, marginLeft: 2, zIndex: '0' }}>
                  <ChatWithBusinessButton request={listing} />
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
      </Grid >
    </Grid>
  ) : (
    <InContainerLoading />
  )
  )
}

export default BusinessRequestDetails;
