 import React, { useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { Link } from 'react-router-dom';
import ListingList from './ListingList';
import * as marketplaceApi from '../../API/marketplaceApi.js';
import { submitProjectRequestInDraft } from '../../API/projectApi';
import DraftList from './DraftList';
import InContainerLoading from '../InContainerLoading';
import MplOrderList from './MplOrderList';
import { useSelector } from 'react-redux';

const OwnOrders = () => {
  const [view, setView] = React.useState('list');
  const [searchValue, setSearchValue] = React.useState('');
  const [orders, setOrders] = React.useState([]);
  const [category, setCategory] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [filterValue, setFilterValue] = React.useState('ALL');
  const currUserData = useSelector((state) => state.currUserData);

  useEffect(() => {
    setLoading(true);
    getAllOrders();
  }, [])

  useEffect(() => {
    refreshResults(filterValue);
  }, [searchValue])

  const getAllOrders = async () => {
    if (searchValue === '') {
      try {
        await marketplaceApi.getMarketplaceOrders().then((arr) => {
          const array = arr.data;
          array.sort(function (a, b) {
            return new Date(b.orderTime) - new Date(a.orderTime);
          })
          setOrders([]);
          setOrders(array);
        })
      } catch (error) {
        setOrders([]);
      }
    } else {
      try {
        await marketplaceApi.getMarketplaceOrdersByKeyword(searchValue).then((arr) => {
          const array = arr.data;
          console.log(array);
          console.log(array);
          array.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.dateCreated) - new Date(a.dateCreated);
          })
          setOrders([]);
          setOrders(array);
        })
      } catch (error) {
        setOrders([]);
      }
    }
    setLoading(false);
  }

  const getBuyerOrders = async () => {
    console.log('buyer');
    if (searchValue === '') {
      try {
        await marketplaceApi.getMarketplaceOrders().then((arr) => {
          const array = arr.data;
          array.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.dateCreated) - new Date(a.dateCreated);
          })
          setOrders([]);
          setOrders(array.filter((item) => item.buyerUsername === currUserData.username));
        });
      } catch (error) {
        setOrders([]);
      }
    } else {
      try {
        await marketplaceApi.getMarketplaceOrdersByKeyword(searchValue).then((arr) => {
          const array = arr.data;
          array.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.dateCreated) - new Date(a.dateCreated);
          })
          setOrders([]);
          setOrders(array.filter((item) => item.buyerUsername === currUserData.username));
        })
      } catch (error) {
        setOrders([]);
      }
    }
  }


  const getSellerOrders = async () => {
    if (searchValue === '') {
      try {
        await marketplaceApi.getMarketplaceOrders().then((arr) => {
          const array = arr.data;
          setOrders([]);
          setOrders(array.filter((item) => item.sellerUsername === currUserData.username));
        });
      } catch (error) {
        setOrders([]);
      }
    } else {
      try {
        await marketplaceApi.getMarketplaceOrdersByKeyword(searchValue).then((arr) => {
          const array = arr.data;
          array.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.dateCreated) - new Date(a.dateCreated);
          })
          setOrders([]);
          setOrders(array.filter((item) => item.sellerUsername === currUserData.username));
        })
      } catch (error) {
        setOrders([]);
      }
    }
  }

  const handleChange = (event, nextView) => {
    setView(nextView);
  }

  const handleFormChange = (e) => {
    setSearchValue(e.target.value);
  }

  const handleFilterChange = (e) => {
    console.log(e.target.id);
    const val = e.target.id;
    setFilterValue(val);
    setLoading(true);
    refreshResults(val);
  }

  const refreshResults = async (val) => {
    console.log(val);
    try {
      if (val === 'ALL') {
        getAllOrders();
      } else if (val === 'AS_BUYER') {
        getBuyerOrders();
      } else {
        getSellerOrders();
      }
    } catch (error) {
      console.log(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  return (!loading ? (
    <Box
      sx={{
        minHeight: '100%',
        maxHeight: '100%',
        px: 1,
        py: 2,
        overflow: 'scroll'
      }}>
      <Grid
        container
        spacing={2}
      >
        <Grid
          item
          lg={12}
          xs={12}
          style={{ overflow: 'scroll', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <TextField
            id='search-bar'
            placeholder='Search Projects'
            style={{ width: '90%' }}
            value={searchValue}
            onChange={handleFormChange}
          />
          <Button value="Search" style={{ background: '#FB7A56', color: 'white', height: '100%', width: '6em', marginLeft: '-0.8em', WebkitBorderRadius: ".5vw" }}>
            Search
          </Button>
        </Grid>
        <Grid
          item
          lg={12}
          xs={12}
          style={{ overflow: 'scroll' }}
        >
          <Select
            labelId="filter-select"
            label="filter"
            value={filterValue}
            style={{ float: 'left', height: '80%', width: '40%', border: '1px solid black', WebkitBorderRadius: ".5vw" }}
          >
            <MenuItem value={'ALL'} id={'ALL'} onClick={handleFilterChange}>ALL</MenuItem>
            <MenuItem value={'AS_BUYER'} id={'AS_BUYER'} onClick={handleFilterChange}>AS BUYER</MenuItem>
            <MenuItem value={'AS_SELLER'} id={'AS_SELLER'} onClick={handleFilterChange}>AS SELLER</MenuItem>
          </Select>
        </Grid>
        <Grid
          item
          lg={12}
          xs={12}
          style={{ overflow: 'scroll' }}
        >
          {orders.length > 0 ? (
            (Array.from(orders).map((val) => (
              <MplOrderList oId={val.id} />
            )))
          ) : (
            <Box sx={{ display: 'flex', justifyContent: "center", alignContent: 'center', marginTop: 15 }}>
                <Typography>You have no orders</Typography>
              </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  ) : (
    <InContainerLoading />
  )
  );
};

export default OwnOrders;