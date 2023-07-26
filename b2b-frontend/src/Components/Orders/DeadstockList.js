import React, { useState } from 'react';
import { Card, Grid, Typography, Box, Avatar, CardHeader, ImageList, ImageListItem, Chip, SvgIcon } from '@mui/material';
import { Image } from '@mui/icons-material';
import { Clock, DollarSign, User } from 'react-feather';
import * as marketplaceApi from '../../API/marketplaceApi';
import InContainerLoading from '../InContainerLoading';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

const DeadstockList = ({ order }) => {
  console.log(order);
  const [loading, setLoading] = useState(false);
  const [deadstock, setDeadstock] = useState([]);
  const [image, setImage] = useState([]);
  const currUserData = useSelector((state) => state.currUserData);
  const navigate = useNavigate();

  React.useEffect(() => {
    setLoading(true);
    getDeadstockListing();
  }, [])

  async function getDeadstockListing() {
    try {
      await marketplaceApi.getMPLFromOrderId(order.id).then((val) => {
        setDeadstock(val.data);
        setImage(val.data.imageList)
      })
    } catch (error) {
      setDeadstock([]);
    } finally {
      setLoading(false);
    }
  }

  const handleReroute = () => {
    // navigate(`/chat/${order.chatAlternateId}?user2=${order.buyerUsername}`);
    navigate(`/listing/${deadstock.id}`);
  }

  return (!loading ? (
    <Card
      onClick={handleReroute}
      sx={{
        width: '99%',
        px: 2,
        py: 3,
        boxShadow: '2px',
        marginBottom: 2
      }}
    >
      <Grid container spacing={6} sx={{ height: '100%'}}>
        <Grid Item xs={4}item>
          <ImageListItem key={'image'} style={{ width: 90, height: 90, overflow: 'hidden' }} >
            <img src={image? image[0]?.url : null} loading="lazy" style={{ cursor: 'pointer' }} />
          </ImageListItem>
        </Grid>
        <Grid item xs={8} sm container>
          <Grid item xs={12} container spacing={0}>
            <Grid item xs={12} >
              <Typography sx={{ overflowWrap: 'break-word', fontSize: 15, fontWeight: "bold" }}>
                {deadstock.title}
              </Typography>
              <Chip label={order.orderStatus} color="primary" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.5em', height: 20, bottom: 0, padding: 0, marginTop: '5px', marginRight: '3px'}} />
              <Chip label={deadstock?.category?.categoryName} sx={{ background: '#FB7A56', color: 'white', fontWeight: 'bold', fontSize: '0.5em', height: 20, bottom: 0, padding: 0, marginTop: '5px'}} />
            </Grid>
            <Grid item xs={12} sx={{ marginTop: '5px'}}>
              <Typography sx={{ overflowWrap: 'break-word', fontSize: 13 }}>
                <SvgIcon
                  fontSize="small"
                  color="action"
                  sx={{ color: '#FB7A56', margin: '1px 5px'}}
                >
                  <DollarSign />
                </SvgIcon>
                SGD{order.orderPrice}
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ marginTop: '5px'}}>
              <Typography sx={{ overflowWrap: 'break-word', fontSize: 13 }}>
                <SvgIcon
                  fontSize="small"
                  color="action"
                  sx={{ color: '#FB7A56', margin: '1px 5px'}}
                >
                  <User />
                </SvgIcon>
                {order.buyerUsername}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  ) : (
    <InContainerLoading />
  )
  );
};

export default DeadstockList;