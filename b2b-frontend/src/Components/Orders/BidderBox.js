import React from 'react';
import { Card, Grid, Typography, Box, Avatar, CardHeader, ImageList, ImageListItem, SvgIcon, Divider, Chip, Button } from '@mui/material';
import { Clock, DollarSign } from 'react-feather';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import * as offerApi from '../../API/offerApi.js';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { ERROR } from "../../Redux/actionTypes";
import ChatWithRefashionerButton from './ChatWithRefashionerButton';
import ChatWithRefashionerButtonOffer from './ChatWithRefashionerButtonOffer.js';

const BidderBox = ({ offer, requestId }) => {

  console.log(offer);

  return (
    <Card
      sx={{
        px: 2,
        py: 0.5,
        boxShadow: '2px',
        margin: '10px 0',
        paddingBottom: 2
      }}
    >
      <Grid container fullWidth spacing={1}>
        <Grid item xs={12}>
          <CardHeader
            avatar={
              <Avatar 
              src={offer.appUser.avatar && offer.appUser.avatar.url}
              sx={{ height: 50, width: 50 }} 
              />}
            title={offer.appUser.username}
            titleTypographyProps={{ variant: "h7", component: "span", fontWeight: 600 }}
          />
          <Divider orientation='row' />
        </Grid>
        <Grid item xs={12} sx={{ marginTop: 1, marginBottom: 1  }}>
            <Typography sx={{ overflowWrap: 'break-word', fontSize: 13, fontWeight: 550, display: 'inline'}}>
              <SvgIcon
                fontSize="medium"
                color="action"
                sx={{ color: '#FB7A56', margin: '-7px 5px' }}
              >
                <Clock />
              </SvgIcon>
              {offer.proposedCompletionDate}
            </Typography>
            <Typography sx={{ overflowWrap: 'break-word', fontSize: 13 , fontWeight: 550, display: 'inline', marginLeft: 1 }}>
              <SvgIcon
                fontSize="medium"
                color="action"
                sx={{ color: '#FB7A56', margin: '-7px 5px' }}
              >
                <PaidOutlinedIcon />
              </SvgIcon>
              SGD{offer.price}
            </Typography>
        </Grid>
        <Grid item xs={12}>
        <Chip label={offer.offerStatus} color={offer.offerStatus === 'REJECTED' ? 'error' : (offer.offerStatus === 'ACCEPTED' ? 'success' : 'secondary')} sx={{ color: 'white', fontWeight: 'bold', fontSize: 9, height: '2em', bottom: 0, padding: 0, float: 'left', marginLeft: 1}} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2" sx={{ px: 2, margin: '10px 0' }}>
            {offer.description}
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center'}}>
          <ChatWithRefashionerButtonOffer offer={offer} requestId={requestId}/>
        </Grid>
      </Grid>

    </Card>
  );
};

export default BidderBox;