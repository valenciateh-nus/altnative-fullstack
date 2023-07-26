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
import RequestList from '../../Components/Orders/RequestList';
import RequestGrid from '../../Components/Orders/RequestList';
import { Link } from 'react-router-dom';
import * as orderApi from '../../API/orderApi.js';
import { getRequestsByStatus } from '../../API';
import InContainerLoading from '../InContainerLoading';
import { useSelector } from 'react-redux';
import { generateChatId } from '../../constants';

const RefashionerRequest = () => {
  const [view, setView] = React.useState('list');
  const [searchValue, setSearchValue] = React.useState('');
  const [requestsList, setRequestList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [filterValue, setFilterValue] = React.useState('ALL');
  const currUserData = useSelector((state) => state.currUserData);

  useEffect(() => {
    setLoading(true);
    getOwnRequests();
  }, [])

  useEffect(() => {
    refreshResults(filterValue);
  }, [searchValue])

  console.log(requestsList);

  const getRequestBySearch = async () => {
    try {
      if (searchValue === '') {
        await orderApi.getRequestOffers().then((arr) => {
          const array = arr.data;
          console.log(array);
          array.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.dateCreated) - new Date(a.dateCreated);
          })
          setRequestList(array);
        });
      } else {
        await orderApi.getRequestOffersByKeyword(searchValue).then((arr) => {
          const array = arr.data;
          console.log(array);
          console.log(array);
          array.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.dateCreated) - new Date(a.dateCreated);
          })
          setRequestList(array);
        })
      }
    } catch (error) {
      setRequestList([]);
    }
  }

  const getOwnRequests = async () => {
    try {
      await orderApi.getRequestOffers().then((arr) => setRequestList(arr.data));
    } catch (error) {
      console.log(error);
      setRequestList([]);
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
    console.log("FILTER", e.target.value);
    setLoading(true)
    const val = e.target.value;
    setFilterValue(val);
    refreshResults(val);
  }

  const refreshResults = async (val) => {
    try {
      if (searchValue === '') {
        if (val === 'ALL') {
          await orderApi.getRequestOffers().then((arr) => {
            const array = arr.data;
            console.log(array);
            array.sort(function (a, b) {
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              return new Date(b.dateCreated) - new Date(a.dateCreated);
            })
            setRequestList(array);
          });
        } else {
          await orderApi.getRequestOffersByStatus(val).then((arr) => {
            const array = arr.data;
            array.sort(function (a, b) {
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              return new Date(b.dateCreated) - new Date(a.dateCreated);
            })
            setRequestList(array);
          })
        }
      } else {
      if (val === 'ALL') {
        await orderApi.getRequestOffersByKeyword(searchValue).then((arr) => {
          const array = arr.data;
          console.log(array);
          array.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.dateCreated) - new Date(a.dateCreated);
          })
          setRequestList(array);
        });
      } else {
        let statuses = [];
        statuses.push(val);
        console.log(statuses);
        await orderApi.getRequestOffersByStatusKeyword(val, searchValue).then((arr) => {
          const array = arr.data;
          array.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.dateCreated) - new Date(a.dateCreated);
          })
          setRequestList(array);
        })
      }
    }
    } catch (error) {
      console.log(error);
      setRequestList([]);
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
            <MenuItem value={'ALL'} id={'ALL'}>ALL</MenuItem>
            <MenuItem value={'PENDING_RESPONSE'} id={'PENDING_RESPONSE'}>PENDING_RESPONSE</MenuItem>
            <MenuItem value={'REJECTED'} id={'REJECTED'}>REJECTED</MenuItem>
          </Select>
          {/* <ToggleButtonGroup
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
          </ToggleButtonGroup> */}
        </Grid>
        <Grid
          item
          lg={12}
          xs={12}
          style={{ overflow: 'scroll' }}
        >
          {view === 'list' && (
            <>
              {requestsList.length === 0 ? (
                <>
                  <Box sx={{ display: 'flex', justifyContent: "center", alignContent: 'center', marginTop: 5 }}>
                    <Typography align="center">You have no {filterValue.toLowerCase() === 'pending_payment' ? 'pending payment' : (filterValue.toLowerCase() === 'pending_response' ? "pending response" : (filterValue.toLowerCase() !== 'all' && filterValue.toLowerCase()))} requests orders.</Typography>
                  </Box>
                </>
              ) :
                (Array.from(requestsList).map((val) => (
                  (val.projectRequest ? (
                    <Link to={`/refashioner/requestDetails/${val.projectRequest.id}`}>
                    <RequestList title={val.title} budget={val.projectRequest.price} deadline={val.projectRequest.proposedCompletionDate} status={val.offerStatus} image={val.projectRequest.imageList} id={val.id}/>
                    </Link>
                  ) : (
                    <Link to={`/listing/${val.projectListing.id}`}>
                    <RequestList title={val.title} budget={val.projectListing.price} deadline={val.projectListing.proposedCompletionDate} status={val.offerStatus} image={val.projectListing.imageList} id={val.id}/>
                  </Link>
                  )
                  )
                )))
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

export default RefashionerRequest;