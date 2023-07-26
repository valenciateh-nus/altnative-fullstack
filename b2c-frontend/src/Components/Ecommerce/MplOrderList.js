import React from 'react';
import { Card, Grid, Typography, Box, Avatar, CardHeader, ImageList, ImageListItem, Chip, SvgIcon, CircularProgress } from '@mui/material';
import { Image } from '@mui/icons-material';
import { Clock, DollarSign, User } from 'react-feather';
import * as marketplaceApi from '../../API/marketplaceApi.js';
import InContainerLoading from '../InContainerLoading.js';
import { Link } from 'react-router-dom';

const MplOrderList = ({ oId }) => {
  const [listing, setListing] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [image, setImage] = React.useState([]);
  const [category, setCategory] = React.useState([]);
  const [user2, setUser2] = React.useState([]);

  console.log(oId);

  React.useEffect(() => {
    getMPL();
  }, [])

  const getMPL = async () => {
    try {
      await marketplaceApi.getMPLFromOrderId(oId).then((arr) => {
        setListing(arr.data);
        setImage(arr.data.imageList);
        setCategory(arr.data.category);
        setUser2(arr.data.appUser);
      })
    } catch (error) {
      setListing([]);
    }
  }

  console.log(listing);

  return (
    <Link to={`/marketplaceListing/${listing.id}`}>
      <Card
        sx={{
          width: '99%',
          px: 2,
          py: 3,
          boxShadow: '2px',
          marginBottom: 2
        }}
      >
        <Grid container spacing={6} sx={{ height: '100%' }}>
          <Grid Item xs={4} item>
            <ImageListItem key={'image'} style={{ width: 90, height: 90, overflow: 'hidden' }} >
              {Array.from(image).slice(0, 1).map((val) => (
                <img src={val.url} key={val.url} loading="lazy" style={{ cursor: 'pointer' }} />
              ))}
            </ImageListItem>
          </Grid>
          <Grid item xs={8} sm container>
            <Grid item xs={12} container spacing={0}>
              <Grid item xs={12} >
                <Typography sx={{ overflowWrap: 'break-word', fontSize: 15, fontWeight: "bold" }}>
                  {listing.title}
                </Typography>
                {/* <Chip label={order.offerType} sx={{ background: '#FB7A56', color: 'white', fontWeight: 'bold', fontSize: '0.5em', height: 20, bottom: 0, padding: 0, marginTop: '5px' }} /> */}
                <Chip label={category.categoryName} sx={{ background: '#FB7A56', color: 'white', fontWeight: 'bold', fontSize: 10, height: 20, bottom: 0, padding: 0, marginTop: '5px' }} />
                {/* {!listing.available && (
                <Chip label="DELETED" color="error" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.5em', height: 20, bottom: 0, padding: 0, marginTop: '5px', marginRight: '3px'}} />
              )} */}
              </Grid>
              <Grid item xs={12} sx={{ marginTop: '5px' }}>
                <Typography sx={{ overflowWrap: 'break-word', fontSize: 13 }}>
                  <SvgIcon
                    fontSize="small"
                    color="action"
                    sx={{ color: '#FB7A56', margin: '1px 5px' }}
                  >
                    <DollarSign />
                  </SvgIcon>
                  SGD{listing.price}
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ marginTop: '5px' }}>
                <Typography sx={{ overflowWrap: 'break-word', fontSize: 13 }}>
                  <SvgIcon
                    fontSize="small"
                    color="action"
                    sx={{ color: '#FB7A56', margin: '1px 5px' }}
                  >
                    <User />
                  </SvgIcon>
                  {user2.username}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Link>
  );
};

export default MplOrderList;