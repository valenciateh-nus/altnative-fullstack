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
import RequestList from './RequestList';
import RequestGrid from './RequestGrid';
import { Link } from 'react-router-dom';
import * as indexApi from '../../API/index.js';
import InContainerLoading from '../InContainerLoading';

const Requests = () => {
  const [view, setView] = React.useState('list');
  const [searchValue, setSearchValue] = React.useState('');
  const [requestsList, setRequestList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [filterValue, setFilterValue] = React.useState('ALL');

  useEffect(() => {
    setLoading(true);
    setFilterValue('ALL');
    getOwnRequests();
  }, [])

  // useEffect(() => {
  //   // getRequestBySearch();
  //   // refreshResults();
  // }, [searchValue])

  console.log(requestsList);

  function compareDate (a,b) {
    return b.dateCreated - a.dateCreated;
  }

  const getOwnRequests = async () => {
    try {
      await indexApi.getRequests().then((arr) => {
        const array = arr.data;
        array.sort(function(a,b){
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(b.dateCreated) - new Date(a.dateCreated);
        })
        setRequestList(array);
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const getRequestBySearch = async () => {
    try {
      if (searchValue === '') {
        await indexApi.getRequests().then((arr) => {
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
        await indexApi.getRequestsByKeyword(searchValue).then((arr) => {
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

  const handleChange = (event, nextView) => {
    setView(nextView);
  }

  const handleFormChange = (e) => {
    setSearchValue(e.target.value);
    refreshResults(filterValue, e.target.value);
  }

  const handleFilterChange = (e) => {
    console.log(e.target.id);
    setLoading(true)
    const val = e.target.id;
    setFilterValue(val);
    refreshResults(val, searchValue);
  }
  
  const refreshResults = async (val, search) => {
    try {
      if (val === 'ALL') {
        await indexApi.getRequestsByKeyword(search).then((arr) => {
          const array = arr.data;
          array.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.dateCreated) - new Date(a.dateCreated);
          })
          setRequestList(array);
        });
      } else {
        await indexApi.getRequestsByStatusKeyword(val, search).then((arr) => {
          const array = arr.data;
          array.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.dateCreated) - new Date(a.dateCreated);
          })
          setRequestList(array);
      })
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
            style={{ float: 'left', height: '80%', width: '40%', border: '1px solid black', WebkitBorderRadius: ".5vw" }}
          >
            <MenuItem value={'ALL'} id={'ALL'} onClick={handleFilterChange}>ALL</MenuItem>
            <MenuItem value={'DRAFT'} id={'DRAFT'} onClick={handleFilterChange}>DRAFT</MenuItem>
            <MenuItem value={'PUBLISHED'} id={'PUBLISHED'} onClick={handleFilterChange}>PUBLISHED</MenuItem>
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
              {requestsList.length === 0 ? (
                <>
                  <Box sx={{ display: 'flex', justifyContent: "center", alignContent: 'center', marginTop: 5 }}>
                    <Typography>You have no {filterValue.toLowerCase()} requests</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: "center", alignContent: 'center', marginTop: 2 }}>
                    <Link to='/upload'>
                      <Button variant="contained" color="secondary" sx={{ display: 'flex', color: 'white', fontWeight: 'bold', fontSize: 15, marginBottom: 1, width: '100%' }}>
                        Create a request
                      </Button>
                    </Link>
                  </Box>
                </>
              ) :
                (Array.from(requestsList).map((val) => (
                  <Link to={`/requestDetails/${val.id}`}>
                    {console.log(val)}
                    <RequestList title={val.title} budget={val.price} deadline={val.proposedCompletionDate} status={val.requestStatus} image={val.imageList} id={val.id}/>
                  </Link>
                )))
              }
            </>
          ) : (
            <>
              {requestsList.length === 0 ? (
                <>
                  <Box sx={{ display: 'flex', justifyContent: "center", alignContent: 'center', marginTop: 5 }}>
                    <Typography>You have no {filterValue.toLowerCase()} requests</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: "center", alignContent: 'center', marginTop: 2 }}>
                    <Link to='/upload'>
                      <Button variant="contained" color="secondary" sx={{ display: 'flex', color: 'white', fontWeight: 'bold', fontSize: 15, marginBottom: 1, width: '100%' }}>
                        Create a request
                      </Button>
                    </Link>
                  </Box>
                </>
              ) : (
                <Grid
                  container
                  spacing={2}
                >
                  {Array.from(requestsList).map((val) => (
                    <RequestGrid title={val.title} budget={val.price} deadline={val.proposedCompletionDate} status={val.requestStatus} id={val.id} image={val.imageList}/>
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