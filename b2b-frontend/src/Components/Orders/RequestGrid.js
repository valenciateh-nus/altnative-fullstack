import React from 'react';
import { Card, Grid, Typography, Box, Avatar, CardHeader, ImageListItem, SvgIcon, Chip, Badge } from '@mui/material';
import { Clock, DollarSign } from 'react-feather';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as offerApi from '../../API/offerApi.js';

const RequestGrid = ({ title, deadline, budget, status, review = false, id, image}) => {
  const view = useSelector((state) => state.view);
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
    <Grid
      item
      sm={4}
      xs={6}
      sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center', margin: '2px 0'}}
    >
      <Link to={view === 'REFASHIONEE_VIEW' ? `/requestDetails/${id}` : `/refashioner/requestDetails/${id}`}>
        <Card sx={{ width: '100%', padding: 1, marginLeft: -0.5}}>
          <Grid container sx={{ width: '100%', display: 'flex', alignContent: 'center', justifyContent: 'center', marginTop: '.8em' }}>
            <Grid item xs={12} sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
              <ImageListItem key={'image'} style={{ width: 100, height: 100, overflow: 'hidden' }} >
                <img src={image[0].url} loading="lazy" style={{ cursor: 'pointer', zIndex: '999' }} />
              </ImageListItem>
            </Grid>
            <Badge badgeContent={offers.length} color="secondary" max={100} sx={{
                "& .MuiBadge-badge": {
                  color: "white",
                  fontSize: 11,
                  fontWeight: 'bold',
                  right: 8,
                }
              }} />
            <Grid item xs={12} sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center', textAlign: 'center', margin: '0 10px' }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: 13 }}>
                {title}
              </Typography>
            </Grid>
            <Grid item xs={11} sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
              <Chip label={status} sx={{ background: '#FB7A56', color: 'white', fontWeight: 'bold', fontSize: 9, height: '100%', bottom: 0, padding: 0, marginTop: '5px' }} />
            </Grid>
            <Grid item xs={12} sx={{ marginTop: '.7em', marginLeft: '5px' }}>
              <Typography sx={{ overflowWrap: 'break-word', fontSize: 12 }}>
                <SvgIcon
                  fontSize="small"
                  color="action"
                  sx={{ color: '#FB7A56', margin: '1px 5px', fontSize: 14 }}
                >
                  <Clock />
                </SvgIcon>
                {deadline}
              </Typography>
              <Typography sx={{ overflowWrap: 'break-word', fontSize: 12 }}>
                <SvgIcon
                  fontSize="small"
                  color="action"
                  sx={{ color: '#FB7A56', margin: '1px 5px', fontSize: 14}}
                >
                  <DollarSign />
                </SvgIcon>
                SGD{budget}
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </Link>
    </Grid>
  );
};

export default RequestGrid;