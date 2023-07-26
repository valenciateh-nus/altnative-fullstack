import { CircularProgress, Container, Divider, Grid, SvgIcon, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { Search as SearchIcon, ArrowLeft as ArrowIcon, PlusCircle as PlusIcon } from 'react-feather';
import { Link } from 'react-router-dom';
import RequestList from '../../Components/Orders/RequestList';
import * as indexApi from '../../API/index.js';
import { useParams } from 'react-router';
import BidderBox from '../../Components/Orders/BidderBox';
import * as offerApi from '../../API/offerApi.js';

const BidderPage = () => {
  const [request, setRequest] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [offers, setOffers] = React.useState([]);
  const { id = 0 } = useParams();
  let res = null;
  console.log(id);

  React.useEffect(() => {
    setLoading(true);
    loadRequest();
    getOffers();
  }, [])

  const getOffers = async() => {
    try {
      await offerApi.retrieveOfferByReqId(id).then((arr) => {
        setOffers(arr.data);
      });
    } catch (error) {
      console.log(error);
      setOffers([]);
    } finally {
      setLoading(false);
    }
  }

  const loadRequest = async () => {
    try {
      await indexApi.getRequestsById(id).then((arr) => {
        setRequest(arr.data);
      })
    } catch (error) {
      setRequest([]);
    }
  }

  console.log(request);

  return (!loading ? (
    <Box>
      <Container maxWidth={false}>
        <Link to="/order">
          <SvgIcon
            fontSize="large"
            color="action"
            sx={{cursor : 'pointer'}}
          >
            <ArrowIcon />
          </SvgIcon>
        </Link>
        <Grid container>
          <Grid item xs={12} sx={{ marginTop: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 650 }}>
              Review Refashioners
            </Typography>
            <Divider orientation="row" />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 1 }}>
            {request !== [] && request.length !== 0 ? (
              <RequestList title={request.title} budget={request.price} deadline={request.proposedCompletionDate} status={request.requestStatus} image={request.imageList}/>
            ) : (
              <Box sx={{ display: 'flex', alignContent: 'center', justifyContent: "center", marginTop: 15}}>
                <Typography>
                  Request not found.
                </Typography>
              </Box>
            )}
            <Divider orientation="row" />
          </Grid>
          <Grid item xs={12}>
            {Array.from(offers).map((val) => (
              <BidderBox offer={val} requestId={request.id}/>
            ))}
          </Grid>
        </Grid>
      </Container>
    </Box>
  ) : (
    <Box sx={{ display: 'flex', flexGrow: 1, height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <CircularProgress color='secondary' sx={{ marginBottom: 2 }} />
      <Typography>Loading...</Typography>
    </Box>
  ));
};

export default BidderPage;