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
import * as indexApi from '../../API/index.js';
import * as orderApi from '../../API/orderApi.js';
import InContainerLoading from '../InContainerLoading';
import emptyImage from '../HomeScreen/emptyImage.jpeg';
import { useSelector } from 'react-redux';

const Requests = () => {
  const [view, setView] = React.useState('list');
  const [searchValue, setSearchValue] = React.useState('');
  const [orderList, setOrderList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [filterValue, setFilterValue] = React.useState('ALL');
  const currUserData = useSelector((state) => state.currUserData);

  const dummy = [
    {
    id: 123,
    title: 'Make Denim Jacket from Deadstock',
    status: 'ACCEPTED',
    refashioner: currUserData,
    imageList: [{emptyImage}],
    type: 'DEADSTOCK'
  },
]

  useEffect(() => {
    setLoading(true);
    setFilterValue('ALL');
    getOwnOrders();
  }, [])

  useEffect(() => {
    getOrderBySearch();
  }, [searchValue])

  console.log(orderList);

  function compareDate (a,b) {
    return b.orderTime - a.orderTime;
  }

  const getOwnOrders = async () => {
    try {
      await orderApi.getRefashioneeOrders().then((arr) => {
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

  const getOrderBySearch = async () => {
    try {
      if (searchValue === '') {
        await orderApi.getRefashioneeOrders().then((arr) => {
          const array = arr.data;
          console.log(array);
          array.sort(function (a, b) {
            return new Date(b.dateCreated) - new Date(a.dateCreated);
          })
          setOrderList([]);
          setOrderList(array);
        });
      } else {
        await orderApi.getRefashioneeOrdersByKeyword(searchValue).then((arr) => {
          if (arr === null) {
            console.log('no');
          }
          const array = arr.data;
          console.log(array);
          array.sort(function (a, b) {
            return new Date(b.dateCreated) - new Date(a.dateCreated);
          })
          setOrderList([]);
          setOrderList(array);
        })
      }
    } catch (error) {
      setOrderList([]);
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
        await orderApi.getRefashioneeOrders().then((arr) => {
          const array = arr.data;
          array.sort(function(a,b){
            return new Date(b.orderTime) - new Date(a.orderTime);
          })
          setOrderList(array);
        });
      } else {
        await orderApi.getRefashioneeOrdersByStatus(val).then((arr) => {
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
            <MenuItem value={'AWAITING_MATERIALS'} id={'AWAITING_MATERIALS'} onClick={handleFilterChange}>AWAITING_MATERIALS</MenuItem>
            <MenuItem value={'PRODUCT_COMPLETED'} id={'PRODUCT_COMPLETED'} onClick={handleFilterChange}>PRODUCT_COMPLETED</MenuItem>
            <MenuItem value={'AWAITING_DELIVERY'} id={'AWAITING_DELIVERY'} onClick={handleFilterChange}>AWAITING_DELIVERY</MenuItem>
            <MenuItem value={'ON_DELIVERY'} id={'ON_DELIVERY'} onClick={handleFilterChange}>ON_DELIVERY</MenuItem>
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
              {dummy.length === 0 ? (
                <>
                  <Box sx={{ display: 'flex', justifyContent: "center", alignContent: 'center', marginTop: 5 }}>
                    <Typography align="center">You have no {filterValue.toLowerCase()} orders</Typography>
                  </Box>
                </>
              ) :
                (Array.from(dummy).map((val) => (
                    <OrderList order={val}/>
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

export default Requests;