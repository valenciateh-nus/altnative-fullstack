import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { useSelector } from 'react-redux';
import * as offerApi from '../../API/offerApi';
import InContainerLoading from '../InContainerLoading';
import BidCard from './BidCard';

const BidList = () => {
  const [bids, setBids] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const currUserData = useSelector((state) => state.currUserData);

  React.useEffect(() => {
    setLoading(true);
    getOffers();
  }, [])

  async function getOffers() {
    try {
      await offerApi.retrieveMyOffers().then((val) => {
        console.log(val.data);
        setBids(val.data);
      })
    } catch (error) {
      setBids([]);
    } finally {
      setLoading(false);
    }
  }

  return (!loading ? (
    <Box sx={{ display: 'flex', maxHeight: 380, height: '50vh', overflowX: 'scroll' }}>
      {bids.length > 0 ? (
        (Array.from(bids).map((bid) => (
          <BidCard bid={bid} />
        )))
      ) : (
        <Box sx={{ maxHeight: 380, display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Button
          variant="contained"
          disabled={true}
          sx={{ ":disabled": { color: 'white', backgroundColor: 'secondary.main' } }}
        >
          No bids
        </Button>
      </Box>
      )
      }
    </Box>
  ) : (
    <InContainerLoading />
  ));
};

export default BidList;