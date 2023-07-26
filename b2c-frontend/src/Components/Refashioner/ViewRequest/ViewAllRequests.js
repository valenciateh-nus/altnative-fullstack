import React, { useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  SvgIcon,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft as ArrowIcon } from 'react-feather';
import * as indexApi from '../../../API/index.js';
import * as projectApi from '../../../API/projectApi.js';
import RequestList from './RequestList.js';
import { CollectionsBookmarkRounded } from '@mui/icons-material';
import InContainerLoading from '../../InContainerLoading.js';

const ViewAllRequests = () => {
  const [view, setView] = React.useState('list');
  const [searchValue, setSearchValue] = React.useState('');
  const [requests, setRequests] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [cId, setCId] = React.useState('');
  const [filterValue, setFilterValue] = React.useState('initial');
  const [categoryList, setCategoryList] = React.useState([]);
  const navigate = useNavigate();

  console.log(categoryList);

  useEffect(() => {
    setLoading(true);
    getCategory();
    getAllRequest();
  }, [])

  useEffect(() => {
    getFilteredListings();
  }, [searchValue])

  useEffect(() => {
    getFilteredListings();
  }, [filterValue])

  const getCategory = async () => {
    await indexApi.getCategory().then((arr) => setCategoryList(arr.data));
  }

  const getAllRequest = async () => {
    try {
      projectApi.getAllRequests().then((arr) => {
        const array = arr.data;
        array.sort(function (a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(b.dateCreated) - new Date(a.dateCreated);
        })
        setRequests(array);
      })
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const handleFilterReset = (e) => {
    setFilterValue(e.target.value);
  }

  const handleChange = (event, nextView) => {
    setView(nextView);
  }

  const handleFormChange = (e) => {
    setSearchValue(e.target.value);
  }

  const getFilteredListings = async () => {
    try {
      if (searchValue === '') {
        if (filterValue === 'PR') {
          await projectApi.getAllFilteredRequests(false).then((val) => {
            const array = val.data;
            array.sort(function (a, b) {
              return new Date(b.dateCreated) - new Date(a.dateCreated);
            })
            setRequests(array);
          })
        } else if (filterValue === 'BR') {
          await projectApi.getAllFilteredRequests(true).then((val) => {
            const array = val.data;
            array.sort(function (a, b) {
              return new Date(b.dateCreated) - new Date(a.dateCreated);
            })
            setRequests(array);
          })
        } else {
          await projectApi.getAllRequests().then((val) => {
            const array = val.data;
            array.sort(function (a, b) {
              return new Date(b.dateCreated) - new Date(a.dateCreated);
            })
            setRequests(array);
          })
        }
      } else {
        if (filterValue === 'PR') {
          await projectApi.getAllFilteredRequestsByKeyword(false, searchValue).then((val) => {
            const array = val.data;
            array.sort(function (a, b) {
              return new Date(b.dateCreated) - new Date(a.dateCreated);
            })
            setRequests(array);
          })
        } else if (filterValue === 'BR') {
          await projectApi.getAllFilteredRequestsByKeyword(true, searchValue).then((val) => {
            const array = val.data;
            array.sort(function (a, b) {
              return new Date(b.dateCreated) - new Date(a.dateCreated);
            })
            setRequests(array);
          })
        } else {
          await projectApi.getAllRequestByKeyword(searchValue).then((val) => {
            const array = val.data;
            array.sort(function (a, b) {
              return new Date(b.dateCreated) - new Date(a.dateCreated);
            })
            setRequests(array);
          })
        }
      }
    } catch (error) {
      setRequests([]);
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
          style={{ overflow: 'scroll', display: 'flex', justifyContent: 'center', alignItems: 'center',  marginTop: 5}}
        >
          <TextField
            id='search-bar'
            placeholder='Search projects by keywords or category'
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
            onChange={handleFilterReset}
            style={{ float: 'left', height: '80%', width: '40%', border: '1px solid black', WebkitBorderRadius: ".5vw" }}
          >
            <MenuItem disabled value={'initial'} id={'initial'}>Filter by type</MenuItem>
            <MenuItem value={'ALL'} id={'ALL'}>All</MenuItem>
            {/* {Array.from(categoryList).map((val) => (
              <MenuItem value={val.categoryName} id={val.categoryName} onClick={() => handleFilterChange(val)}>{val.categoryName}</MenuItem>
            ))} */}
            <MenuItem value={'PR'}>Refashionee's Requests</MenuItem>
            <MenuItem value={'BR'}>Business's Requests</MenuItem>
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
          {/* {view === 'list' ? (
            <>
              {Array.from(list).filter((item) => (item.title.toLowerCase()).match(searchValue.toLowerCase()) !== null || (item.name.toLowerCase()).match(searchValue.toLowerCase()) !== null).map((val) => (
                <Link to='/orderDetails/1'>
                  <OrderList title={val.title} name={val.name} />
                </Link>
              ))}
            </>
          ) : (
            <>
              <Grid 
                container 
                spacing={2}
              >
                {Array.from(list).filter((item) => (item.title.toLowerCase()).match(searchValue.toLowerCase()) !== null || (item.name.toLowerCase()).match(searchValue.toLowerCase()) !== null).map((val) => (
                    <OrderGrid title={val.title} name={val.name}/>
                ))}
              </Grid>
            </>
          )} */}
          {requests.length > 0 && requests !== [] ?
            (Array.from(requests).map((val) => (
              <Link to={`/refashioner/requestDetails/${val.id}`}>
                {console.log(val)}
                <RequestList title={val.title} category={val.category} name={val.name} deadline={val.proposedCompletionDate} budget={val.price} status={val.requestStatus} image={val.imageList} id={val.id} refashionee={val.refashionee} business={val.business}/>
              </Link>
            )))
            : (
              <Box sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center', marginTop: 15}}>
                <Typography>No Requests Available.</Typography>
              </Box>
            )}
        </Grid>
      </Grid>
    </Box>
  ) : (
    <InContainerLoading/>
  )
  );
};

export default ViewAllRequests;