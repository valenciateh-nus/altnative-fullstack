import { Avatar, Button, CardHeader, Chip, Divider, Grid, CircularProgress, IconButton, ImageList, ImageListItem, ListItemSecondaryAction, Modal, SvgIcon, TextField, Typography, useMediaQuery } from '@mui/material';
import { ArrowLeft as ArrowIcon, MessageCircle as MessageIcon, Heart as HeartIcon, Divide } from 'react-feather';
import React, { useEffect } from 'react';
import ImagePost from '../../Components/Notus/components/Images/ImagePost';
import Ratings from '../../Components/Notus/components/Content/Ratings';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { openImageModal } from '../../Redux/actions';
import { Link } from 'react-router-dom';
import OrderMenuBar from '../../Components/Orders/OrderMenubar';
import { Box } from '@mui/system';
import MakeOffer from '../../Components/Orders/MakeOffer';
import RequestMenuBar from '../../Components/Orders/RequestMenuBar';
import ViewBidders from '../../Components/Orders/ViewBidders';
import * as indexApi from '../../API/index.js';
import moment from 'moment';
import ChatWithRefashionerButton from '../../Components/Orders/ChatWithRefashionerButton';
import { SET_USER_PROFILE } from '../../Redux/actionTypes';

// Google Analytics
import ReactGa from 'react-ga';
import ChatWithBusinessButton from '../../Components/Orders/ChatWithBusinessButton';
import ProfileCard from '../../Components/ProfileCard';

const category = ["Jeans", "Denim"];
const rating = 4;

const images = ['https://media.lovebonito.com/media/catalog/product/l/n/ln0716-031-1_id9cag7lie8bbdd3.jpg?width=960&height=1344']

const RequestDetails = () => {
  const notHidden = useMediaQuery(theme => theme.breakpoints.up('lg'));
  const [open, setOpen] = React.useState(false);
  const { id = 0 } = useParams();
  const [request, setRequest] = React.useState([]);
  const [category, setCategory] = React.useState('');
  const [image, setImage] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [refashionee, setRefashionee] = React.useState([]);
  const currUserData = useSelector((state) => state.currUserData);
  const navigate = useNavigate();

  if (currUserData.roles.indexOf("USER_REFASHIONER") === -1) {
    navigate('/home', { replace: true });
  }

  useEffect(() => {
    setLoading(true);
    getRequest();
  }, [])

  // Google Analytics
  useEffect(() => {
    ReactGa.initialize('UA-223374225-1')
    console.log("sending data to GA");
    ReactGa.pageview('/request/' + id);
  }, [])

  const getRequest = async () => {
    try {
      console.log('before false', request);
      await indexApi.getRequestsById(id).then((val) => {
        if (val.data.available) {
          setRequest(val.data);
          console.log(val.data);
          setCategory(val.data.category.categoryName);
          setImage(val.data.imageList);
          setRefashionee(val.data.refashionee);
        } else {
          console.log("NOT FOUND");
          navigate('/requestDetails404')
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      console.log('before false', request);
      setLoading(false);
    }
  }

  const dispatch = useDispatch();
  function handlePhotoModal(images, index) {
    dispatch(openImageModal(images, index))
  }

  // useEffect(() => {
  //   indexApi.getRequests().then((arr) => setRequestList(arr.data));
  // }, [])

  return (!loading ? (
    <Grid
      container
      spacing={0}
      sx={{ overflow: 'scroll', marginBottom: 10, zIndex: '1' }}
    >
      <Grid item lg={12}>
        <SvgIcon
          fontSize="large"
          color="action"
          sx={{ position: 'absolute', float: 'left', top: 35, cursor: 'pointer' }}
          onClick={() => navigate(-1)}
        >
          <ArrowIcon />
        </SvgIcon>
      </Grid>

      <Grid item lg={4} xs={12} container sx={notHidden ? { mt: 20, ml: 5, overflow: 'hidden' } : { overflow: 'hidden' }}>
        <Grid item lg={12} sx={{ height: 300, display: "flex" }}>
          <Box sx={{ width: '100%', maxHeight: 300 }}>
            <img src={request?.imageList[0]?.url} onClick={() => handlePhotoModal(request.imageList.map(({ url }) => url), 0)} style={{ height: 300, width: '100%', background: "none", alignSelf: 'center', objectFit: 'cover' }} />
          </Box>
        </Grid>
      </Grid>

      <Grid item lg={1} xs={0} />

      <Grid item lg={6} xs={12} container sx={notHidden && { mt: 7, ml: 2 }}>
      <Grid item xs={12} sx={{ marginTop: 3, marginLeft: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='h4' sx={{ fontWeight: '650', display: 'inline', overflowWrap: 'break-word' }}>
            {request.title}
          </Typography>
          <RequestMenuBar isRefashionerPOV={true} id={id} isDraft={request.requestStatus === 'DRAFT'} />
        </Box>
      </Grid>

      <Grid item xs={12} sx={{ marginLeft: 2 }}>
        {/* {Array.from(category).map((val) => ( */}
        <Chip label={category} sx={{ background: '#FB7A56', color: 'white', fontSize: '65%', fontWeight: '600', margin: '5px 3px', padding: '1px 5px', WebkitBorderRadius: '13px' }} />
        {/* ))} */}
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
          {moment(request.proposedCompletionDate).format("DD/MM/YYYY")}
        </Typography>
      </Grid>

      {!request.business ? (
        <Grid item xs={12} sx={{ marginTop: 2, marginLeft: 2 }}>
          <Typography variant='h6' sx={{ fontWeight: '550', fontSize: 18 }}>
            Estimated Price
          </Typography>
          <Typography variant='body1' sx={{ fontSize: 17 }}>
            SGD{request.price}
          </Typography>
        </Grid>
      ) : (
        <>
          <Grid item xs={12} lg={12} sx={{ marginTop: 2, marginLeft: 2 }}>
            <Typography variant='h6' sx={{ fontWeight: '550', fontSize: 18 }}>
              Total quantity to order
            </Typography>
            <Typography variant='body1' sx={{ fontSize: 17 }}>
              {request.quantity}
            </Typography>
          </Grid>

          <Grid item xs={12} lg={12} sx={{ marginTop: 2, marginLeft: 2 }}>
            <Typography variant='h6' sx={{ fontWeight: '550', fontSize: 18 }}>
              Minimum quantity to order
            </Typography>
            <Typography variant='body1' sx={{ fontSize: 17 }}>
              {request.minimum}
            </Typography>
          </Grid>

          <Grid item xs={12} lg={12} sx={{ marginTop: 2, marginLeft: 2 }}>
            <Typography variant='h6' sx={{ fontWeight: '550', fontSize: 18 }}>
              Estimated Price / pc
            </Typography>
            <Typography variant='body1' sx={{ fontSize: 17 }}>
            SGD {Math.round(request.price) !== request.price ? Number(request.price).toFixed(2) : request.price}
            </Typography>
          </Grid>
        </>
      )}

      <Grid item xs={12} sx={{ marginTop: 2, display: 'flex', alignContent: 'center', justifyContent: 'center', marginTop: 1, marginBottom: 1}}>
        {!request.business ? (
          <ChatWithRefashionerButton request={request} title={"Chat With Refashionee"} />
        ) : (
          <ChatWithBusinessButton request={request} />
        )}
      </Grid>
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

export default RequestDetails;
