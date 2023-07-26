import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import React from 'react';
import logo from './RequestBox.png'
const ViewAllRequestBox = () => {
  return (
    <Card sx={{ height: 300, cursor: 'pointer'}}>
      <CardContent>
        <Grid
          container
          spacing={3}
        >
          <Grid item xs={6}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', marginTop: 0.5 }}>
              View All Refashionee Requests
            </Typography>
          </Grid>
          <Grid item={6} sx={{ position: 'relative', width: '100%', height: 280 }}>
            <Box
              sx={{
                // width: { xs: "40vw", s: '15vw', md: '20vw', lg: '100%' },
                width: '100%',
                position: 'absolute',
                bottom: 0,
                right: 0,
                height: '100%',
              }}
            >
              <img alt="View Refashioner" src={logo} style={{  width:'30%', objectFit: 'fill' }} />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ViewAllRequestBox;