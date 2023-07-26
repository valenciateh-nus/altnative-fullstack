import React from 'react';
import { Card, Grid, Typography, Box, Avatar, CardHeader, ImageList, ImageListItem, Chip, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { Image } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import * as orderApi from '../../API/orderApi.js';
import * as userApi from '../../API/userApi.js';
import { useTheme } from '@emotion/react';
import { useDispatch, useSelector } from 'react-redux';

const DisputeList = ({ currOrder, orderId = 0 }) => {
  const [project, setProject] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [image, setImage] = React.useState([]);
  const [orderImage, setOrderImage] = React.useState([]);
  const [avatar, setAvatar] = React.useState([]);
  const [order, setOrder] = React.useState([]);
  const [refashionerUsername, setRefashionerUsername] = React.useState([]);
  const currUserData = useSelector((state) => state.currUserData);
  const theme = useTheme();
  const navigate = useNavigate();

  React.useEffect(() => {
    setLoading(true);
    getUser();
    retrieveOrder();
    retrieveProject();
  }, []);

  const getUser = async (username) => {
    try {
      await userApi.getUserByUsername(username).then((val) => {
        setAvatar(val.data.avatar);
      })
    } catch (error) {
      setAvatar([])
    };
  }

  const retrieveOrder = async () => {
    try {
      let oId = 0;
      if (orderId != 0) {
        oId = orderId;
      } else {
        oId = currOrder.id;
      }
      await orderApi.getOrderById(oId).then((val) => {
        console.log(val.data);
        setOrder(val.data);
        setOrderImage(val.data.imageList);
        setRefashionerUsername(val.data.refashionerUsername);
        getUser(val.data.refashionerUsername);
      })
    } catch (error) {
      setOrder([]);
    }
  }

  const retrieveProject = async () => {
    try {
      let oId = 0;
      if (orderId != 0) {
        oId = orderId;
      } else {
        oId = order.id;
      }
      await orderApi.getProjectByOrderId(oId).then((val) => {
        setProject(val.data);
        setImage(val.data.imageList);
      })
    } catch (error) {
      setProject([]);
    } finally {
      setLoading(false);
    }
  }

  const handleReroute = () => {
    if (refashionerUsername !== currUserData.username) {
      navigate(`/chat/${order.chatAlternateId}?user2=${refashionerUsername}`);
    } else {
      navigate(`/chat/${order.chatAlternateId}?user2=${order.appUserUsername}`);
    }
  }

  console.log(project);

  return (!loading ? (
    <Card
      onClick={handleReroute}
      sx={{
        height: '9em',
        width: '99%',
        px: 2,
        py: 3,
        boxShadow: '2px',
        marginBottom: 2,
        overflow: 'scroll'
      }}
    >
      <Grid container spacing={2}>
        <Grid xs={4} lg={2} item>
          <ImageListItem key={'image'} style={{ width: 90, height: 90, overflow: 'hidden' }} >
            {Array.from(image).slice(0, 1).map((val) => (
              <img src={val.url} key={val.url} loading="lazy" style={{ cursor: 'pointer' }} />
            ))}
          </ImageListItem>
        </Grid>
        <Grid item xs={8} lg={10} container sx={{ width: '100%', overflowWrap: 'break-word' }}>
          <Grid item xs={12} container spacing={2} style={{ width: '50%' }}>
            <Grid item xs={12}>
              <Typography sx={{ overflowWrap: 'break-word', fontSize: 17, fontWeight: 650 }}>
                {order.offerTitle}
              </Typography>
              <Chip label={order.orderStatus} sx={{ background: '#FB7A56', color: 'white', fontWeight: 'bold', fontSize: 10, height: '2em', bottom: 0, padding: 0, marginTop: '5px' }} />
              <Chip label={order.offerType} color={order.type === 'REQUEST' ? 'info' : 'primary'} sx={{ color: 'white', fontWeight: 'bold', fontSize: 10, height: '2em', bottom: 0, padding: 0, marginTop: '5px', ml: 1 }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ overflowWrap: 'break-word', display: 'inline' }}>
                <CardHeader
                  avatar={
                    <Avatar
                      src={avatar ? avatar.url : ''}
                      sx={{
                        height: 25,
                        width: 25,
                        flexDirection: 'column',
                      }} />
                  }
                  title={refashionerUsername}
                  style={{ padding: 0, margin: 0 }}
                />
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  ) : (
    <Box sx={{ display: 'flex', flexGrow: 1, height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <CircularProgress color='secondary' sx={{ marginTop: 15 }} />
      <Typography>Loading...</Typography>
    </Box>
  )
  );
};

export default DisputeList;