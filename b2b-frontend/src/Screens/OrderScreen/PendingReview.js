import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  SvgIcon,
  Button,
  Typography
} from '@mui/material';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ChevronRight as Next, ArrowLeft as ArrowIcon, PlusCircle as PlusIcon } from 'react-feather';
import '../../Components/HomeScreen/stylesheet.css';
import RequestCard from '../../Components/Orders/RequestCard';

const PendingReview = () => {
  return (
    <>
        <Helmet>
          <title>Alt.Native</title>
        </Helmet>
        <Box
          sx={{
            minHeight: '100%',
            px: 3,
            py: 3
          }}
        >
          <Container maxWidth={false}>
          <Link to="/home">
                  <SvgIcon
                    fontSize="large"
                    color="action"
                    sx={{cursor : 'pointer'}}
                  >
                    <ArrowIcon />
                  </SvgIcon>
                </Link>
          <Grid
              container
              spacing={1}
              style={{ marginTop: '1em'}}
            >
              <Grid
                item
                lg={12}
                sm={12}
                xl={12}
                xs={12}
              >
                <Typography style={{ fontSize: '1.7em', fontWeight: '700' }}>
                  We're reviewing your request!
                </Typography>
              </Grid>
              <Grid
                item
                lg={12}
                sm={12}
                xl={12}
                xs={12}
              >
                <RequestCard />
              </Grid>
              <Grid
                item
                lg={12}
                sm={12}
                xl={12}
                xs={12}
              >
              <Link to="/order">
                <Button
                  variant="contained"
                  fullWidth
                  style={{ background: '#FB7A56', color: 'white', height: '120%', fontWeight: 'bold', marginTop: '1em'}}
                >
                  View all request
                </Button>
                </Link>
              </Grid>
              </Grid>
          </Container>
        </Box>
      </>
  );
};

export default PendingReview;