import { Box, Grid, SvgIcon, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft as ArrowIcon } from 'react-feather';
import logo from '../../Components/Orders/pileOfClothes.png';

const ErrorPage = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-2);
  }

  return (
    <Grid
      container
      fullWidth
      spacing={0}
      sx={{ overflow: 'scroll', paddingBottom: 2, zIndex: '1' }}
    >
      <Grid item xs={12} sx={{ height: 240, width: 200, overflow: 'hidden' }}>
        <SvgIcon
          fontSize="medium"
          color="action"
          sx={{ position: 'absolute', float: 'left', top: 30 }}
          onClick={goBack}
        >
          <ArrowIcon />
        </SvgIcon>
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
        <Box sx={{ height: 200 , width: 200 }}>
          <img src={logo} sx={{ objectFit: 'fill' }}/>
        </Box>
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
        <Typography variant='h6'>
          This post is no longer available.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ErrorPage;