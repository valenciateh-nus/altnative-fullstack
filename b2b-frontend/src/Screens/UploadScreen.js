import React from 'react';
import { Grid, Typography } from '@mui/material';
import RequestCard from '../Components/Upload/RequestCard';
import ListingCard from '../Components/Upload/ListingCard';
const UploadScreen = () => {
  return (
    <Grid container spacing={2}>
      <Grid item lg={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5}}>
        <Typography fontWeight={650} fontSize={33}>
          What would you like to create?
        </Typography>
      </Grid>
      <Grid item lg={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5}}>
        <ListingCard />
      </Grid>
      <Grid item lg={6} sx={{ height: 570, display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 5}}>
        <RequestCard />
      </Grid>
    </Grid>
  );
};

export default UploadScreen;