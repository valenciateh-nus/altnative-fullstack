import React, { useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  TextField,
  CircularProgress,
  Typography
} from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import OrderGrid from './OrderGrid';
import OrderList from './OrderList';
import { Link } from 'react-router-dom';
import * as marketplaceApi from '../../API/marketplaceApi';
import * as orderApi from '../../API/orderApi.js';
import InContainerLoading from '../InContainerLoading';
import emptyImage from '../HomeScreen/emptyImage.jpeg';
import { useSelector } from 'react-redux';
import DeadstockList from './DeadstockList';

const Deadstocks = () => {
  const [view, setView] = React.useState('list');
  const [searchValue, setSearchValue] = React.useState('');
  const [orderList, setOrderList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [filterValue, setFilterValue] = React.useState('ALL');
  const currUserData = useSelector((state) => state.currUserData);

  useEffect(() => {
    setLoading(true);
    setFilterValue('ALL');
    getOwnOrders();
  }, [])

  useEffect(() => {
    refreshResults(filterValue);
  }, [searchValue])

  console.log(orderList);

  function compareDate (a,b) {
    return b.orderTime - a.orderTime;
  }

  const getOwnOrders = async () => {
    try {
      await marketplaceApi.getMarketplaceOrders().then((arr) => {
        console.log(arr.data);
        const array = arr.data;
        array.sort(function(a,b){
          return new Date(b.orderTime) - new Date(a.orderTime);
        })
        setOrderList(array);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
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
    setLoading(true)
    const val = e.target.id;
    setFilterValue(val);
    refreshResults(val);
  }
  
  const refreshResults = async (val) => {
    try {
      if (val === 'ALL') {
        await marketplaceApi.getMarketplaceOrdersByKeyword(searchValue).then((arr) => {
          const array = arr.data;
          array.sort(function(a,b){
            return new Date(b.orderTime) - new Date(a.orderTime);
          })
          setOrderList(array);
        });
      } else {
        await marketplaceApi.getMarketplaceOrdersByKeywordStatus(val, searchValue).then((arr) => {
          const array = arr.data;
          array.sort(function(a,b){
            return new Date(b.orderTime) - new Date(a.orderTime);
          })
          setOrderList(array);
      })
    }
  } catch (error) {
    console.log(error);
    setOrderList([]);
  } finally {
    setLoading(false);
  }
  }

  console.log(orderList);

  return (!loading ? (
    <Box
      sx={{
        minHeight: '100%',
        maxHeight: '100%',
        px: 0.5,
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
            <MenuItem value={'ACCEPTED'} id={'ACCEPTED'} onClick={handleFilterChange}>ACCEPTED</MenuItem>
            <MenuItem value={'AWAITING_MATERIALS'} id={'AWAITING_MATERIALS'} onClick={handleFilterChange}>AWAITING MATERIALS</MenuItem>
            <MenuItem value={'PRODUCT_COMPLETED'} id={'PRODUCT_COMPLETED'} onClick={handleFilterChange}>PRODUCT COMPLETED</MenuItem>
            <MenuItem value={'AWAITING_DELIVERY'} id={'AWAITING_DELIVERY'} onClick={handleFilterChange}>AWAITING DELIVERY</MenuItem>
            <MenuItem value={'ON_DELIVERY'} id={'ON_DELIVERY'} onClick={handleFilterChange}>ON DELIVERY</MenuItem>
            <MenuItem value={'RECEIVED'} id={'RECEIVED'} onClick={handleFilterChange}>RECEIVED</MenuItem>
            <MenuItem value={'CANCELLED'} id={'CANCELLED'} onClick={handleFilterChange}>CANCELLED</MenuItem>
            <MenuItem value={'COMPLETED'} id={'COMPLETED'} onClick={handleFilterChange}>COMPLETED</MenuItem>
          </Select>
          <ToggleButtonGroup
            size="medium"
            value={view}
            exclusive
            onChange={handleChange}
            style={{ float: 'right' }}
          >
            <ToggleButton value="list" key="list">
              <ViewListIcon />
            </ToggleButton>
            <ToggleButton value="grid" key="grid">
              <ViewModuleIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
        <Grid
          item
          lg={12}
          xs={12}
          style={{ overflow: 'scroll' }}
        >
          {view === 'list' ? (
            <>
              {orderList.length === 0 ? (
                <>
                  <Box sx={{ display: 'flex', justifyContent: "center", alignContent: 'center', marginTop: 5 }}>
                    <Typography align="center">You have no {filterValue.toLowerCase()} orders</Typography>
                  </Box>
                </>
              ) :
                (Array.from(orderList).map((val) => (
                    <DeadstockList order={val}/>
                )))
              }
            </>
          ) : (
            <>
              {orderList.length === 0 ? (
                <>
                  <Box sx={{ display: 'flex', justifyContent: "center", alignContent: 'center', marginTop: 5 }}>
                    <Typography align="center">You have no {filterValue.toLowerCase()} orders</Typography>
                  </Box>
                </>
              ) : (
                <Grid
                  container
                  spacing={2}
                >
                  {Array.from(orderList).map((val) => (
                    <OrderGrid title={val.offerTitle} name={val.refashionerUsername} status={val.orderStatus} id={val.id} chat={val.chatAlternateId}/>
                  ))}
                </Grid>
              )
              }
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  ) : (
    <InContainerLoading/>
  )
  );
};

export default Deadstocks;