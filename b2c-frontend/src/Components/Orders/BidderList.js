import React from 'react';
import { Card, Grid, Typography, Box, Avatar, CardHeader, ImageList, ImageListItem, SvgIcon, Divider, Chip, Button } from '@mui/material';
import { Clock, DollarSign } from 'react-feather';
import * as offerApi from '../../API/offerApi.js';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { ERROR } from "../../Redux/actionTypes";

const BidderList = ({ bid }) => {
  const { id = 0 } = useParams();
  const dispatch = useDispatch();

  const rejectOffer = async (e) => {
    console.log(id);
    console.log(e.target.id);
    await rejectRequestOffer(id, e.target.id);
  }

  async function rejectRequestOffer(reqId, oId) {
    console.log('reject request offer')
    try {
      await offerApi.rejectOffer(reqId,"");
      //alert('success');
    } catch (error) {
      const data = error?.response?.data?.message
      console.log("ERROR MSG: " + JSON.stringify(error));
      dispatch({ type: ERROR, data })
    }
  }

  return (
    <Card
      sx={{
        px: 2,
        py: 2,
        boxShadow: '2px',
        margin: '2em 0',
        paddingBottom: 5
      }}
    >
      <Grid container fullWidth spacing={1}>
        <Grid item xs={5} container sx={{ overflowWrap: 'break-word' }}>
          <Grid item xs={3} s={2}>
            <Avatar sx={{
              height: '1.5em',
              width: '1.5em',
            }}/>
          </Grid>
          <Grid item xs={9} s={10}>
            <Typography sx={{ fontSize: '0.7em', marginTop: 0.8, marginLeft: 1}}>
              {bid.appUser.name}
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={7} sx={{ marginTop: '5px', display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
          <Typography sx={{ overflowWrap: 'break-word', fontSize: '0.7rem' }}>
            <SvgIcon
              fontSize="small"
              color="action"
              sx={{ color: '#FB7A56', margin: '1px 5px' }}
            >
              <Clock />
            </SvgIcon>
            {bid.proposedCompletionDate}
          </Typography>
          <Typography sx={{ overflowWrap: 'break-word', fontSize: '0.7rem' }}>
            <SvgIcon
              fontSize="small"
              color="action"
              sx={{ color: '#FB7A56', margin: '1px 5px' }}
            >
              <DollarSign />
            </SvgIcon>
            SGD{bid.price}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography sx={{ fontWeight: 550, fontSize: 13}}>
            Description
          </Typography>
          <Typography sx={{ fontSize: 11 }}>
            {bid.description}
          </Typography>
        </Grid>
        <Grid Item xs={6} sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center', position: 'relative', marginTop: 2 }}>
          <Button variant="contained" sx={{ width: '90%', fontSize: '10px', height: '3em', position: 'absolute', fontWeight: 'bold' }}>
            Accept
          </Button>
        </Grid>
        <Grid Item xs={6} sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center', position: 'relative', marginTop: 2 }}>
          <Button 
            id={bid.id}
            onClick={rejectOffer}
            variant="contained" 
            sx={{ width: '90%', fontSize: '10px', height: '3em', position: 'absolute', background: '#FB7A56', fontWeight: 'bold', color: 'white' }}>
            Reject
          </Button>
        </Grid>
      </Grid>

    </Card>
  );
};

export default BidderList;