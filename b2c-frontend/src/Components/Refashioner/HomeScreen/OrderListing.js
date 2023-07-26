import { Card, Chip, Grid, ImageListItem, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';


const OrderListing = ({ status, orderId, title, completed, price }) => {
  const chipColor = () => {
    return status == 'Pending' ? "#FB7A56" : "#FED279"
  }

  return (
    <Box sx={{ marginBottom: 2 }}>
      <Chip
        label={status}
        key={status}
        style={ status == 'Pending' ? {
          background: "#FB7A56",
          fontWeight: "550",
          color: "white",
          padding: "0.5vh 0.25vw",
          margin: "0 0 0.5em",
          borderRadius: 12,
        } : {
          background: "#FED279",
          fontWeight: "550",
          color: "white",
          padding: "0.5vh 0.25vw",
          margin: "0 0 0.5em",
          borderRadius: 12,
        }}
      />
      <Card
        sx={{
          width: '99%',
          px: 2,
          py: 2,
          boxShadow: '2px',
          cursor: "pointer"
        }}
      >
        <Grid container spacing={2} sx={{ height: '100%' }}>

          <Grid Item xs={3} lg={2} item sx={{ verticalAlign: 'center'}}>
            <ImageListItem key={'image'} style={{ width: 60, height: 60, overflow: 'hidden'}}>
              <img src={'https://osn-images.com/22207/square-back-rayon-dress.jpg'} loading="lazy" />
            </ImageListItem>
          </Grid>

          <Grid item xs={6} lg={7} sm container sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
            <Grid item xs={12} sx={{ marginTop: '1%'}}>
              <Typography sx={{ overflowWrap: 'break-word', fontSize: '0.7rem' }}>
                {orderId}
              </Typography>
              <Typography sx={{ overflowWrap: 'break-word', fontSize: '0.7rem', fontWeight: "bold" }}>
                {title}
              </Typography>
              <Typography sx={{ overflowWrap: 'break-word', fontSize: '0.7rem' }}>
                {completed ? 'Completed' : 'In Progress'}
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={3} sm container sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
            <Typography sx={{ overflowWrap: 'break-word', fontSize: 15, fontWeight: "bold", marginLeft: 1}}>
              SGD{price}
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default OrderListing;