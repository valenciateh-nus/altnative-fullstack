import React from 'react';
import { Card, Grid, Typography, Box, Avatar, CardHeader, ImageList, ImageListItem, Chip, SvgIcon, Badge } from '@mui/material';
import { Image } from '@mui/icons-material';
import { Clock, DollarSign } from 'react-feather';
import moment from 'moment';
import * as offerApi from '../../API/offerApi.js';

const RequestList = ({ title = '0', deadline = null, budget = '0', status = '', image, id }) => {
  const [offers, setOffers] = React.useState([]);

  React.useEffect(() => {
    getOffers();
  }, [])

  const getOffers = async() => {
    try {
      await offerApi.retrieveOfferByReqId(id).then((arr) => {
        setOffers(arr.data);
      });
    } catch (error) {
      setOffers([]);
    }
  }

  return (
    <Card
      sx={{
        width: '99%',
        px: 2,
        py: 2,
        boxShadow: '2px',
        marginBottom: 2
      }}
    >
      <Grid container spacing={6} sx={{ height: '100%' }}>
        <Grid Item xs={4} item>
          <ImageListItem key={'image'} style={{ width: 95, height: 95, overflow: 'hidden' }} >
            <img src={image[0]?.url} loading="lazy" style={{ cursor: 'pointer' }} />
          </ImageListItem>
        </Grid>
        <Grid item xs={8} sm container>
          <Grid item xs={12} container spacing={0} sx={{ marginLeft: 1 }}>
            <Grid item xs={11} >
              <Typography sx={{ overflowWrap: 'break-word', fontSize: 15, fontWeight: "bold" }}>
                {title}
              </Typography>
              <Chip label={status} sx={{ background: '#FB7A56', color: 'white', fontWeight: 'bold', fontSize: 10, height: '2em', bottom: 0, padding: 0, marginTop: 0.5 }} />
            </Grid>
            <Grid item xs={1} >
              <Badge badgeContent={offers.length} color="secondary" max={100} sx={{
                "& .MuiBadge-badge": {
                  color: "white",
                  fontSize: 11,
                  fontWeight: 'bold'
                }
              }} />
            </Grid>
            <Grid item xs={12} sx={{ marginTop: '5px' }}>
              <Typography sx={{ overflowWrap: 'break-word', fontSize: 12 }}>
                <SvgIcon
                  fontSize="small"
                  color="action"
                  sx={{ color: '#FB7A56', margin: '1px 5px' }}
                >
                  <Clock />
                </SvgIcon>
                {deadline ? moment(deadline).format("DD/MM/YYYY") : 'No Deadline Set'}
              </Typography>
              <Typography sx={{ overflowWrap: 'break-word', fontSize: 12 }}>
                <SvgIcon
                  fontSize="small"
                  color="action"
                  sx={{ color: '#FB7A56', margin: '1px 5px' }}
                >
                  <DollarSign />
                </SvgIcon>
                SGD{budget}
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ marginTop: '0' }}>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default RequestList;