import React from 'react';
import { Card, Grid, Typography, Box, Avatar, CardHeader, ImageList, ImageListItem, Chip, SvgIcon } from '@mui/material';
import { Image } from '@mui/icons-material';
import { Clock, DollarSign, User } from 'react-feather';

const ListingList = ({ title = '0', deadline = '0', budget = '0', category = '', name, image, status, available}) => {
  console.log(image);

  return (
    <Card
      sx={{
        width: '99%',
        px: 2,
        py: 3,
        boxShadow: '2px',
        marginBottom: 2
      }}
    >
      <Grid container spacing={6} sx={{ height: '100%'}}>
        <Grid item xs={4}>
          <ImageListItem key={'image'} style={{width: 90, height: 90, overflow: 'hidden' }} >
            <img src={image? image[0]?.url : null} loading="lazy" style={{ cursor: 'pointer' }} />
          </ImageListItem>
        </Grid>
        <Grid item xs={8} sm container>
          <Grid item xs={12} container spacing={0}>
            <Grid item xs={12} >
              <Typography sx={{ overflowWrap: 'break-word', fontSize: 15, fontWeight: "bold" }}>
                {title}
              </Typography>
              {status === 'DRAFT' && (
                <Chip label={status} color="primary" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.5em', height: 20, bottom: 0, padding: 0, marginTop: '5px', marginRight: '3px'}} />
              )}
              {!available && (
                <Chip label="DELETED" color="error" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.5em', height: 20, bottom: 0, padding: 0, marginTop: '5px', marginRight: '3px'}} />
              )}
              <Chip label={category} sx={{ background: '#FB7A56', color: 'white', fontWeight: 'bold', fontSize: '0.5em', height: 20, bottom: 0, padding: 0, marginTop: '5px'}} />
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
                SGD {budget != Math.round(budget) ? Number(budget).toFixed(2) : budget}
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
                {name}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ListingList;