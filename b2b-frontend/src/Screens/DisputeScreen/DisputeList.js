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
  Typography,
  SvgIcon,
  Divider,
  useMediaQuery
} from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import DisputeListings from '../../Components/Dispute/DisputeListings.js';
import { Link } from 'react-router-dom';
import * as indexApi from '../../API/index.js';
import * as disputeApi from '../../API/disputeApi';
import InContainerLoading from '../../Components/InContainerLoading';
import { useNavigate } from 'react-router';
import { ArrowLeft as ArrowIcon, MessageCircle as MessageIcon, Heart as HeartIcon, Divide } from 'react-feather';
import { useSelector } from 'react-redux';

const DisputeList = () => {
  const [view, setView] = React.useState('list');
  const [searchValue, setSearchValue] = React.useState('');
  const [requestsList, setRequestList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [filterValue, setFilterValue] = React.useState('ALL');
  const navigate = useNavigate();
  const currUserData = useSelector((state) => state.currUserData);
  const notHidden = useMediaQuery(theme => theme.breakpoints.up('md'));
  useEffect(() => {
    // setLoading(true);
    setFilterValue('ALL');
    getOwnRequests();
  }, [])

  // useEffect(() => {
  //   getRequestBySearch();
  // }, [searchValue])

  function compareDate(a, b) {
    return b.dateCreated - a.dateCreated;
  }

  const goBack = () => {
    navigate(-1);
  }

  const getOwnRequests = async () => {
    try {
      await disputeApi.retrieveDisputesByUserId(currUserData.id).then((arr) => {
        const array = arr.data;
        if (array.length > 1) {
        array.sort(function (a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(b.dateCreated) - new Date(a.dateCreated);
        })
      }
        console.log(array);
        setRequestList(arr.data);
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
        await disputeApi.retrieveDisputesByUserId(currUserData.id).then((arr) => {
          const array = arr.data;
          if (array.length > 1) {
          array.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.dateCreated) - new Date(a.dateCreated);
          })
        }
          console.log(array);
          setRequestList(arr.data);
        });
      } else {
        let status = [];
        status.push(val);
        await disputeApi.retrieveDisputeByStatus(status).then((arr) => {
          const array = arr.data;
          array.sort(function (a, b) {
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

    setLoading(false);
  }

  console.log(requestsList);
  console.log('loading is' , loading);

  return (!loading ? (
    <Grid
      container
      spacing={2}
      sx={notHidden && { px: 2 }}
    >
      <Grid item lg={12}>
        <SvgIcon
          fontSize="large"
          color="action"
          sx={{ position: 'absolute', float: 'left', top: 45 }}
          onClick={() => navigate(-1)}
        >
          <ArrowIcon />
        </SvgIcon>
      </Grid>

      <Grid item xs={12} sx={{ marginTop: 3, display: 'flex', justifyContent: "center", alignItems: "center" }}>
        <Typography variant="h5" fontWeight={600}>
          My Dispute Request
        </Typography>
        <Divider orientation="row" />
      </Grid>
      <Grid
        item
        lg={12}
        xs={12}
        style={{ overflow: 'scroll', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <TextField
          id='search-bar'
          placeholder='Search Projects'
          style={{ width: '99%' }}
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
          <MenuItem value={'SUBMITTED'} id={'SUBMITTED'} onClick={handleFilterChange}>SUBMITTED</MenuItem>
          <MenuItem value={'ACCEPTED'} id={'ACCEPTED'} onClick={handleFilterChange}>ACCEPTED</MenuItem>
          <MenuItem value={'REJECTED'} id={'REJECTED'} onClick={handleFilterChange}>REJECTED</MenuItem>
        </Select>
      </Grid>
      <Grid
        item
        lg={12}
        xs={12}
        style={{ overflow: 'scroll' }}
      >
        {requestsList.length === 0 ? (
          <>
            <Box sx={{ display: 'flex', justifyContent: "center", alignContent: 'center', marginTop: 5 }}>
              <Typography>You have no {filterValue.toLowerCase()} dispute requests</Typography>
            </Box>
          </>
        ) :
          (Array.from(requestsList).map((val) => (
            <Link to={`/disputeRequest/${val.id}`}>
              <DisputeListings disputeId={val.id} />
            </Link>
          )))
        }
      </Grid>
    </Grid>
  ) : (
    <InContainerLoading />
  )
  );
};

export default DisputeList;