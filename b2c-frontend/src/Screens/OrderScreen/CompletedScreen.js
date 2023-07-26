import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Menu,
  MenuItem,
  Container,
  Grid,
  TextField,
  InputAdornment,
  SvgIcon,
  Button,
  Typography,
  Modal,
  FormLabel,
  Slider,
  CircularProgress
} from '@mui/material';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { ChevronRight as Next, ArrowLeft as ArrowIcon, PlusCircle as PlusIcon } from 'react-feather';
import '../../Components/HomeScreen/stylesheet.css';
import RequestCard from '../../Components/Orders/RequestCard';
import * as indexApi from '../../API/index.js';

const CompletedScreen = () => {
  const { id = 0 } = useParams();
  const [request, setRequest] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setLoading(true);
      getRequest();
    } else {
      navigate('/home', { replace: true });
    }
  }, [])

  const getRequest = async () => {
    try {
      await indexApi.getRequestsById(id).then((val) => setRequest(val.data));
      setLoading(false);
    } catch (error) {
      console.log(error);
      // navigate('/home', {replace:true});
    }
  }

  return (!loading ? (
    <>
      <Helmet>
        <title>Alt.Native</title>
      </Helmet>
      <Box
        sx={{
          minHeight: '100%',
          px: 3,
          py: 3,
          marginBottom: 7
        }}
      >
        <Container maxWidth={false}>
          <Link to="/order">
            <SvgIcon
              fontSize="large"
              color="action"
            >
              <ArrowIcon />
            </SvgIcon>
          </Link>
          <Grid
            container
            spacing={1}
            style={{ marginTop: '1em' }}
          >
            <Grid
              item
              lg={12}
              sm={12}
              xl={12}
              xs={12}
            >
              <Typography style={{ fontSize: '1.7em', fontWeight: '700' }}>
                Your request has been published!
              </Typography>
            </Grid>
            <Grid
              item
              lg={12}
              sm={12}
              xl={12}
              xs={12}
            >
              {/* <RequestGrid title={refashionValue} budget={budget} deadline={deadline} status="pending" review={true}/> */}
              {/* {Array.from(request).map((val) => (
                <Link to={`/requestDetails/${val.id}`}>
                  {console.log(val)}
                  <RequestCard request={val} image={val.imageList[0]} />
                </Link>
              ))} */}
              {request.imageList &&
                <Link to={`/requestDetails/${request.id}`}>
                  <RequestCard request={request} image={request.imageList} />
                </Link>
              }
            </Grid>
            <Grid
              item
              lg={12}
              sm={12}
              xl={12}
              xs={12}
            >
              <Link to='/order'>
                <Button
                  variant="contained"
                  fullWidth
                  style={{ background: '#FB7A56', color: 'white', height: '120%', fontWeight: 'bold', marginTop: 10 }}
                >
                  View all request
                </Button>
              </Link>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  ) : (
    <Box sx={{ display: 'flex', flexGrow: 1, height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <CircularProgress color='secondary' sx={{ marginBottom: 2 }} />
      <Typography>Loading...</Typography>
    </Box>
  )
  );
};

export default CompletedScreen;