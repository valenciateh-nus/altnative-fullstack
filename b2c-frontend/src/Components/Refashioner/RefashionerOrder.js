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
import OngoingProject from './HomeScreen/OngoingProject';
import RequestList from '../Orders/RequestList';
import RefashionerOrderGrid from './RefashionOrderGrid';
import * as orderApi from '../../API/orderApi.js';
import { useSelector } from 'react-redux';
import moment from 'moment';
import InContainerLoading from '../InContainerLoading';

const RefashionerOrder = () => {
  const [view, setView] = React.useState('list');
  const [searchValue, setSearchValue] = React.useState('');
  const [filterValue, setFilterValue] = React.useState('ALL');
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const currUser = useSelector((state) => state.authData)
  const currUserData = useSelector((state) => state.currUserData);
  console.log(currUser);
  console.log(new Date(2022,2,28));

  useEffect(() => {
    setLoading(true);
    getMyOrders();
  }, [])

  const getMyOrders = async () => {
    try {
      await orderApi.getOrders().then((arr) => {
        const array = arr.data;
        array.sort(function(a,b){
          return new Date(b.orderTime) - new Date(a.orderTime);
        })
        setOrders(arr.data)
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  console.log(orders);

  const handleChange = (event, nextView) => {
    setView(nextView);
  }

  const handleFormChange = (e) => {
    setSearchValue(e.target.value);
    refreshResults(filterValue, e.target.value);
  }

  const handleFilterChange = (e) => {
    console.log("FILTER ", e.target.value);
    setLoading(true)
    const val = e.target.value;
    setFilterValue(e.target.value);
    refreshResults(e.target.value, searchValue);
  }

  const refreshResults = async (val, search) => {
    try {
      console.log("FILTER ", val);
      if (searchValue === '') {
        if (val === 'ALL') {
          await orderApi.getRefashioneeOrders().then((arr) => {
            const array = arr.data;
            console.log(array);
            array.sort(function (a, b) {
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              return new Date(b.dateCreated) - new Date(a.dateCreated);
            })
            setOrders([]);
            setOrders(array);
          });
        } else {
          const statuses = [];
          statuses.push(val);
          console.log(statuses);
          await orderApi.getRefashionerOrdersByStatus(val).then((arr) => {
            console.log(arr.data);
            const array = arr.data;
            array.sort(function (a, b) {
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              return new Date(b.dateCreated) - new Date(a.dateCreated);
            })
            setOrders([]);
            setOrders(array);
          })
        }
      } else {
      if (val === 'ALL') {
        await orderApi.getRefashionerOrdersByKeyword(search).then((arr) => {
          const array = arr.data;
          console.log(array);
          array.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.dateCreated) - new Date(a.dateCreated);
          })
          setOrders([]);
          setOrders(array);
        });
      } else {
        const statuses = [];
        statuses.push(val);
        console.log(statuses);
        await orderApi.getRefashionerOrdersByStatusKeyword(val, search).then((arr) => {
          console.log(arr.data);
          const array = arr.data;
          array.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.dateCreated) - new Date(a.dateCreated);
          })
          setOrders([]);
          setOrders(array);
        })
      }
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
            onChange={handleFilterChange}
            style={{ float: 'left', height: '80%', width: '40%', border: '1px solid black', WebkitBorderRadius: ".5vw" }}
          >
            <MenuItem value={'ALL'}>ALL</MenuItem>
            <MenuItem value={'ACCEPTED'}>ACCEPTED</MenuItem>
            <MenuItem value={'PENDING_RESPONSE'}>PENDING RESPONSE</MenuItem>
            <MenuItem value={'PENDING_PAYMENT'} id={'PENDING_PAYMENT'}>PENDING_PAYMENT</MenuItem>
            <MenuItem value={'CANCELLED'} id={'CANCELLED'}>CANCELLED</MenuItem>
         
          </Select>
          {/* <ToggleButtonGroup
            size="medium"
            value={view}
            exclusive
            onChange={handleChange}
            style={{ float: 'right' }}
          >
            <ToggleButton value="list" key="list" >
              <ViewListIcon />
            </ToggleButton>
            <ToggleButton value="grid" key="grid">
              <ViewModuleIcon />
            </ToggleButton>
          </ToggleButtonGroup> */}
        </Grid>
        <Grid
          item
          lg={12}
          xs={12}
          style={{ overflow: 'scroll' }}
        >
          {view === 'list' ? (
            <>
              {orders.length === 0 ? (
                  <Box sx={{ display: 'flex', justifyContent: "center", alignContent: 'center', marginTop: 5 }}>
                    <Typography>You have no orders.</Typography>
                  </Box>
              ) :
                (Array.from(orders).map((val) => (
                   <OngoingProject title={val.offerTitle} name={val.appUserUsername} completed={val.offerStatus === 'COMPLETED'} created={val.orderTime} deadline={val.proposedCompletionDate} type={val.orderStatus} chat={val.chatAlternateId} refashionee={val.appUserUsername} val={val} id={val.id}/>
                )))
              }
            </>
          ) : (
            <>
              <Grid
                container
                spacing={2}
              >
                {Array.from(orders).map((val) => (
                  <RefashionerOrderGrid title={val.offerTitle} name={val.appUserUsername} completed={val.offerStatus === 'COMPLETED'} created={val.orderTime} deadline={val.proposedCompletionDate} type={val.orderStatus} chat={val.chatAlternateId} refashionee={val.appUserUsername} />
                ))}
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  ) : (
    <InContainerLoading/>
  ));
};

export default RefashionerOrder;