import { Avatar, Button, CardHeader, Chip, CircularProgress, Divider, Grid, IconButton, ImageList, ImageListItem, ListItemSecondaryAction, Modal, SvgIcon, TextField, Typography } from '@mui/material';
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

const category = ["Jeans", "Denim"];
const rating = 4;

const images = ['https://media.lovebonito.com/media/catalog/product/l/n/ln0716-031-1_id9cag7lie8bbdd3.jpg?width=960&height=1344']

const RequestDetails = () => {
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

  useEffect(() => {
    setLoading(true);
    getRequests();
    getOffer();
  }, [])

  const getRequests = async () => {
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
      <Grid Item xs={12} sx={{ height: 300, width: 200, overflow: 'hidden' }}>
        <SvgIcon
          fontSize="medium"
          color="action"
          sx={{ position: 'absolute', float: 'left', top: 30,cursor : 'pointer' }}
          onClick={goBack}
        >
          <ArrowIcon />
        </SvgIcon>
        <Box sx={{ width: '100%' }}>
          <img src={image.url} onClick={() => handlePhotoModal(request.imageList.map(({ url }) => url), 0)} height="100%" width="100%" style={{ background: "none", alignSelf: 'center' }} />
        </Box>
      </Grid>

      <Grid item xs={12} sx={{ marginTop: 3, marginLeft: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='h5' sx={{ fontWeight: '650', display: 'inline', overflowWrap: 'break-word' }}>
            {request.title}
          </Typography>
          {available &&
            <RequestMenuBar isRefashionerPOV={currUserData.id === refashionee.id} id={id} isDraft={request.requestStatus === 'DRAFT'} />
          }
        </Box>
      </Grid>

      <Grid Item xs={12} sx={{ marginLeft: 2 }}>
        {/* {Array.from(request.category).map((val) => ( */}
        <Chip label={category} sx={{ background: '#FB7A56', color: 'white', fontSize: '65%', fontWeight: '600', margin: '5px 3px', padding: '1px 5px', WebkitBorderRadius: '13px' }} />
        {/* ))}  */}
      </Grid>

      <Grid item xs={12} sx={{ marginTop: 2, marginLeft: 2 }}>
        <Divider orientation='horizontal' sx={{ marginBottom: 2 }} />
        <Typography variant='h7' sx={{ fontWeight: '550' }}>
          Description of project
        </Typography>
        <Typography variant='body2'>
          {request.description}
        </Typography>
      </Grid>

      <Grid item xs={12} sx={{ marginTop: 2, marginLeft: 2 }}>
        <Typography variant='h7' sx={{ fontWeight: '550' }}>
          Deadline
        </Typography>
        <Typography variant='body2'>
          {moment(request.proposedCompletionDate).format("DD/MM/yyyy")}
        </Typography>
      </Grid>

      <Grid item xs={12} sx={{ marginTop: 2, marginLeft: 2 }}>
        <Typography variant='h7' sx={{ fontWeight: '550' }}>
          Estimated Price
        </Typography>
        <Typography variant='body2'>
          SGD{request.price}
        </Typography>
      </Grid>

      {(request.requestStatus !== 'DRAFT' && available) &&
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
            This post has been
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
