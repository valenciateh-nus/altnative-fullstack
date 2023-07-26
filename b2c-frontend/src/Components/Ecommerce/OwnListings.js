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
import * as indexApi from '../../API/index.js';
import { submitProjectRequestInDraft } from '../../API/projectApi';
import InContainerLoading from '../InContainerLoading';

const list = [
  {
    id: 1,
    title: 'Make Dress Into 2 Piece',
    name: 'Alice'
  },
  {
    id: 2,
    title: 'Make Denim into Jacket',
    name: 'Cassandra',
  },
  {
    id: 3,
    title: 'Embroider Flower on Jacket',
    name: 'Brittany',
  },
  {
    id: 4,
    title: 'Alter waist of Jeans',
    name: 'Maddy',
  },
]
const OwnListings = () => {
  const [view, setView] = React.useState('list');
  const [searchValue, setSearchValue] = React.useState('');
  const [orders, setOrders] = React.useState([]);
  const [listings, setListings] = React.useState([]);
  const [category, setCategory] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [categoryList, setCategoryList] = React.useState([]);
  const [filterValue, setFilterValue] = React.useState('ALL');

  useEffect(() => {
    setLoading(true);
    getCategory();
    getListings();
  }, [])

  useEffect(() => {
    // getListingsBySearch();
    refreshResults(filterValue);
  }, [searchValue])

  const getCategory = async () => {
    await indexApi.getCategory().then((arr) => setCategoryList(arr.data));
  }

  const getListingsBySearch = async () => {
    try {
      if (searchValue === '') {
        await marketplaceApi.getOwnMarketplaceListings().then((arr) => {
          const array = arr.data;
          console.log(array);
          array.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.dateCreated) - new Date(a.dateCreated);
          })
          setListings(array);
        });
      } else {
        await marketplaceApi.getOwnMarketplaceListingsByKeyword(searchValue).then((arr) => {
          const array = arr.data;
          console.log(array);
          console.log(array);
          array.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.dateCreated) - new Date(a.dateCreated);
          })
          setListings(array);
        })
      }
    } catch (error) {
      setListings([]);
    }
  }

  // const getListings = async () => {
  //   try {
  //     await marketplaceApi.getOwnMarketplaceListings().then((arr) => {
  //       const array = arr.data;
  //       console.log(array);
  //       array.sort(function (a, b) {
  //         // Turn your strings into dates, and then subtract them
  //         // to get a value that is either negative, positive, or zero.
  //         return new Date(b.dateCreated) - new Date(a.dateCreated);
  //       })
  //       setListings(array);
  //     });
  //   } catch (error) {
  //     setListings([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  const getListings = async () => {
    try {
      if (searchValue === '') {
        await marketplaceApi.getOwnMarketplaceListings().then((arr) => {
          const array = arr.data;
          console.log(array);
          array.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.dateCreated) - new Date(a.dateCreated);
          })
          setListings(array);
        });
      } else {
        await marketplaceApi.getOwnMarketplaceListings().then((arr) => {
          const array = arr.data;
          console.log(arr.data);
          array.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.dateCreated) - new Date(a.dateCreated);
          })
          setListings([]);
          setListings(array.filter((item) => item.title.includes(searchValue) || item.category.categoryName.includes(searchValue)));
        })
      }
    } catch (error) {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }

  const handleFilterChange = (val) => {
    console.log(val);
    setLoading(true);
    setFilterValue(val.target.value);
    refreshResults(val.target.value);
  }

  const getDraftListings = async () => {
    try {
      if (searchValue === '') {
        await marketplaceApi.getDrafts().then((arr) => {
          const array = arr.data;
          console.log(arr.data);
          array.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.dateCreated) - new Date(a.dateCreated);
          })
          setListings([]);
          setListings(array);
        })
      } else {
        await marketplaceApi.getDrafts().then((arr) => {
          const array = arr.data;
          console.log(arr.data);
          array.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.dateCreated) - new Date(a.dateCreated);
          })
          setListings([]);
          setListings(array.filter((item) => item.title.includes(searchValue) || item.category.categoryName.includes(searchValue)));
        })
      }
    } catch (error) {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }

  const getPublishedListings = async () => {
    try {
      if (searchValue === '') {
        await marketplaceApi.getPublished().then((arr) => {
          const array = arr.data;
          console.log(arr.data);
          array.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.dateCreated) - new Date(a.dateCreated);
          })
          setListings([]);
          setListings(array);
        })
      } else {
        await marketplaceApi.getPublished().then((arr) => {
          const array = arr.data;
          console.log(arr.data);
          array.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.dateCreated) - new Date(a.dateCreated);
          })
          setListings([]);
          setListings(array.filter((item) => item.title.includes(searchValue) || item.category.categoryName.includes(searchValue)));
        })
      }
    } catch (error) {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }

  const refreshResults = async (filterValue) => {
    try {
      if (filterValue === 'DRAFT') {
        getDraftListings();
      } else if (filterValue === 'PUBLISHED') {
        getPublishedListings();
      } else {
        getListings();
      }
    } catch (error) {
      console.log(error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  }

  const handleFormChange = (e) => {
    setSearchValue(e.target.value);
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
            onChange={handleFilterChange}
            style={{ float: 'left', height: '80%', width: '40%', border: '1px solid black', WebkitBorderRadius: ".5vw" }}
          >
            <MenuItem value={'ALL'} id={'ALL'}>All</MenuItem>
            <MenuItem value={'PUBLISHED'}>PUBLISHED</MenuItem>
            <MenuItem value={'DRAFT'}>DRAFT</MenuItem>
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
              {Array.from(listings).filter((item) => (item.title.toLowerCase()).match(searchValue.toLowerCase()) !== null || (item.name.toLowerCase()).match(searchValue.toLowerCase()) !== null).map((val) => (
                <Link to={`/marketplaceListing/${val.id}`}>
                  <ListingList title={val.title} name={val.name} />
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
                  <ListingList title={val.title} name={val.name} />
                  ))}
              </Grid>
            </>
          )} */}
          {listings.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: "center", alignContent: 'center', marginTop: 15 }}>
              <Typography>You have no listings</Typography>
            </Box>
          ) : (
            (Array.from(listings).map((val) => (
              <Link to={`/marketplaceListing/${val.id}`}>
                <ListingList title={val.title} status={val.marketplaceListingStatus} name={val.appUser.username} image={val.imageList} category={val.category.categoryName} budget={val.price} available={val.available} />
              </Link>
            )))
          )}
        </Grid>
      </Grid>
    </Box>
  ) : (
    <InContainerLoading />
  )
  );
};

export default OwnListings;