import { Container, Divider, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import BidderList from './BidderList';

const ViewBidders = ({offers}) => {
  return (
    <Box
      sx={{
        minHeight: '100%',
        maxHeight: '100%',
        px: 1,
        py: 7,
        overflow: 'scroll'
      }}
    >
      <Container>
          <Grid
            item
            lg={12}
            sm={12}
            xl={12}
            xs={12}
            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            <div style={{ width: '100%', borderBottom: '0.1px solid rgba(180 , 180, 180, .3)' }}>
              <Typography variant='h6' sx={{ fontWeight: '550' }}>
                List of bidders
              </Typography>
            </div>
          </Grid>
          <Divider orientation="horizontal" sx={{ marginTop: '-2px' }} />
          {Array.from(offers).map((o) => (
            <BidderList bid={o}/>
          ))}
      </Container>
    </Box>
  );
};

export default ViewBidders;