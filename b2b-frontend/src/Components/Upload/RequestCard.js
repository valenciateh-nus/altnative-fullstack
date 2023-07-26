import { Card, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import logo from '../Images/RequestImage.png';
import { useNavigate } from 'react-router';

const RequestCard = () => {
  const navigate = useNavigate();

  return (
    <Card sx={{ width: '80%', height: '100%', px: 3, py:2, cursor: 'pointer' }} onClick={() => navigate('/createBusinessRequest')}>
      <Grid container spacing={2}>
      <Grid item xs={12} sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box
              sx={{
                width: '90%',
                height: 320
              }}
            >
              <img alt="View Refashioner" src={logo} style={{ height: 350, width: 350, objectFit: 'contain' }} />
            </Box>
          </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 3}}>
          <Typography fontWeight={650} fontSize={20} align="center">
            Create Business Project Request
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 0 }}>
          <Typography align="center" sx={{ fontSize: 15 }}>
            Create a Business Project Request to find refashioners who are the right designers and seamstress for your business idea! 
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

export default RequestCard;