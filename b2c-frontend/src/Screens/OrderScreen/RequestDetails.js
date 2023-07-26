import { Avatar, Button, CardHeader, Chip, CircularProgress, Divider, Grid, IconButton, ImageList, ImageListItem, ListItemSecondaryAction, Modal, SvgIcon, TextField, Typography, useMediaQuery } from '@mui/material';
import { ArrowLeft as ArrowIcon, MessageCircle as MessageIcon, Heart as HeartIcon, Divide } from 'react-feather';
import React, { useEffect } from 'react';
import ImagePost from '../../Components/Notus/components/Images/ImagePost';
import Ratings from '../../Components/Notus/components/Content/Ratings';
import { useDispatch, useSelector } from 'react-redux';
import { openImageModal } from '../../Redux/actions';
import { Link } from 'react-router-dom';
import OrderMenuBar from '../../Components/Orders/OrderMenubar';
import { Box } from '@mui/system';
import MakeOffer from '../../Components/Orders/MakeOffer';
import RequestMenuBar from '../../Components/Orders/RequestMenuBar';
import ViewBidders from '../../Components/Orders/ViewBidders';
import * as indexApi from '../../API/index.js';
import * as offerApi from '../../API/offerApi.js';
import { useNavigate, useParams } from 'react-router';
import moment from 'moment';
import RefashionerRequest from '../../Components/Refashioner/RefashionerRequest';
import ProfileCard from '../../Components/ProfileCard';
import ChatWithRefashionerButton from '../../Components/Orders/ChatWithRefashionerButton';
import ChatWithBusinessButton from '../../Components/Orders/ChatWithBusinessButton';

const category = ["Jeans", "Denim"];
const rating = 4;

const images = ['https://media.lovebonito.com/media/catalog/product/l/n/ln0716-031-1_id9cag7lie8bbdd3.jpg?width=960&height=1344']

const RequestDetails = () => {
  const notHidden = useMediaQuery(theme => theme.breakpoints.up('lg'));
  const [open, setOpen] = React.useState(false);
  const { id = 0 } = useParams();
  const [request, setRequest] = React.useState([]);
  const [category, setCategory] = React.useState('');
  const [offers, setOffers] = React.useState([]);
  const [image, setImage] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [available, setAvailable] = React.useState(true);
  const [refashionee, setRefashionee] = React.useState([]);
  const currUser = useSelector((state) => state.authData)
  const currUserData = useSelector((state) => state.currUserData);

  const dispatch = useDispatch();
  const history = useNavigate();
  function handlePhotoModal(images, index) {
    dispatch(openImageModal(images, index))
  }

  console.log(request);
  console.log(id);
  console.log(request.imageList);

  React.useEffect(() => {
    console.log("here1");
    setLoading(true);
    getRequests();
    getOffer();
  }, [])

  const getRequests = async () => {
    console.log("here");
    await indexApi.getRequestsById(id).then((val) => {
      console.log("VAL: " + JSON.stringify(val));
      setRequest(val.data);
      console.log(val.data);
      setCategory(val.data.category.categoryName);
      setImage(val.data.imageList[0]);
      setRefashionee(val.data.refashionee);
      setAvailable(val.data.available);
    });
  }

  const getOffer = async () => {
    try {
      await offerApi.retrieveOfferByReqId(id).then((offer) => {
        console.log("OFFERS: " + JSON.stringify(offer))
        setOffers(offer.data);
      })
    } catch (error) {
      setOffers([])
    } finally {
      setLoading(false);
    }
  }

  const handleClick = () => {
    history(`/viewRequestOffers/${id}`);
  }

  const goBack = () => {
    history(-1);
  }

  console.log(request);

  return (!loading ? (
    <Grid
      container
      fullWidth
      spacing={0}
      sx={{ overflow: 'scroll', paddingBottom: 2, zIndex: '1' }}
    >

      <Grid item lg={12}>
        <SvgIcon
          fontSize="large"
          color="action"
          sx={{ position: 'absolute', float: 'left', top: 35, cursor: 'pointer' }}
          onClick={() => history(-1)}
        >
          <ArrowIcon />
        </SvgIcon>
      </Grid>

      <Grid item lg={4} xs={12} container sx={notHidden ? { mt: 20, ml: 5, overflow: 'hidden' } : { overflow: 'hidden' }}>
        <Grid item lg={12} sx={{ height: 300, display: "flex" }}>
          <Box sx={{ width: '100%', maxHeight: 300 }}>
            <img src={image.url} onClick={() => handlePhotoModal(request.imageList.map(({ url }) => url), 0)} style={{ height: 300, width: '100%', background: "none", alignSelf: 'center', objectFit: 'cover' }} />
          </Box>
        </Grid>
      </Grid>

      <Grid item lg={1} xs={0} />

      <Grid item lg={6} xs={12} container sx={notHidden && { mt: 15, ml: 2 }}>
        <Grid item xs={12} sx={{ marginTop: 3, marginLeft: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant='h4' sx={{ fontWeight: '650', display: 'inline', overflowWrap: 'break-word' }}>
              {request.title}
            </Typography>
            {available &&
              <RequestMenuBar isRefashionerPOV={currUserData.id === refashionee.id} id={id} isDraft={request.requestStatus === 'DRAFT'} />
            }
          </Box>
        </Grid>

        <Grid item xs={12} sx={{ marginLeft: 2 }}>
          {request.requestStatus === 'DRAFT' &&
            <Chip label="DRAFT" color="info" sx={{ color: 'white', fontSize: '85%', fontWeight: '600', margin: '5px 3px', padding: '1px 5px', WebkitBorderRadius: '13px' }} />
          }
          {/* {Array.from(request.category).map((val) => ( */}
          <Chip label={category} sx={{ background: '#FB7A56', color: 'white', fontSize: '85%', fontWeight: '600', margin: '5px 3px', padding: '1px 5px', WebkitBorderRadius: '13px' }} />
          {/* ))}  */}

        </Grid>

        <Grid item xs={12} sx={{ marginTop: 1 }}>
          {/* {console.log(refashionee)} */}
          {request?.refashionee &&
            <ProfileCard user={request?.refashionee} />
          }
        </Grid>

        <Grid item xs={12} sx={{ marginTop: 2, marginLeft: 2 }}>
          <Divider orientation='horizontal' sx={{ marginBottom: 2 }} />
          <Typography variant='h6' sx={{ fontWeight: '550', fontSize: 18 }}>
            Description of project
          </Typography>
          <Typography variant='body1' sx={{ fontSize: 17 }}>
            {request.description}
          </Typography>
        </Grid>

        <Grid item xs={12} sx={{ marginTop: 2, marginLeft: 2 }}>
          <Typography variant='h6' sx={{ fontWeight: '550', fontSize: 18 }}>
            Deadline
          </Typography>
          <Typography variant='body1' sx={{ fontSize: 17 }}>
            {moment(request.proposedCompletionDate).format("DD/MM/yyyy")}
          </Typography>
        </Grid>

        <Grid item xs={12} sx={{ marginTop: 2, marginLeft: 2 }}>
          <Typography variant='h6' sx={{ fontWeight: '550', fontSize: 18 }}>
            Estimated Price
          </Typography>
          <Typography variant='body1' sx={{ fontSize: 17 }}>
            SGD {Math.round(request.price) !== request.price ? Number(request.price).toFixed(2) : request.price}
          </Typography>
        </Grid>
      </Grid>

      <Grid item xs={12} sx={{display: "flex", justifyContent: "center", alignContent: "center", marginTop: 2}}>
      {request?.refashionee?.username !== currUserData.username && (
        <>
          {!request.business ? (
            <ChatWithRefashionerButton request={request} title={"Chat With Refashioner"} />
          ) : (
            <ChatWithBusinessButton request={request} />
          )}
        </>
      )}
      </Grid>

      {(request.requestStatus !== 'DRAFT' && available && request?.refashionee?.username === currUserData.username) &&
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", alignContent: "center", marginTop: 2 }}>
          {/* <Link to={`/viewRequestOffers/${id}`} sx={{ width: '100%' }}> */}
          <Button variant="contained" color="primary" sx={{ width: '90%', color: 'white' }} onClick={handleClick}>
            <Typography variant="h8" sx={{ fontWeight: 600 }}>
              View Bidders
            </Typography>
          </Button>
          {/* </Link> */}
        </Grid>
      }
      {!available &&
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", alignContent: "center", marginTop: 4 }}>
          <Typography variant="subtitle1">
            This post has been deleted.
          </Typography>
        </Grid>
      }
    </Grid >
  ) : (
    <Box sx={{ display: 'flex', flexGrow: 1, height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <CircularProgress color='secondary' sx={{ marginBottom: 2 }} />
      <Typography>Loading...</Typography>
    </Box>
  )
  );
};

export default RequestDetails;
