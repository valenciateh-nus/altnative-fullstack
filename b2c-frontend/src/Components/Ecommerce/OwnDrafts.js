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
const OwnDrafts = () => {
  const [view, setView] = React.useState('list');
  const [searchValue, setSearchValue] = React.useState('');
  const [orders, setOrders] = React.useState([]);
  const [drafts, setDrafts] = React.useState([]);
  const [category, setCategory] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    setLoading(true);
    getDrafts();
  }, [])

  const getDrafts = async () => {
    try {
      await marketplaceApi.getDrafts().then((arr) => {
        const array = arr.data;
        console.log(array);
        array.sort(function (a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(b.dateCreated) - new Date(a.dateCreated);
        })
        setDrafts(array);
      });
    } catch (error) {
      setDrafts([]);
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

  console.log(searchValue);

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
          {drafts.length === 0 ? (
            <>
              <Box sx={{ display: 'flex', justifyContent: "center", alignContent: 'center', marginTop: 15 }}>
                <Typography>You have no drafts</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: "center", alignContent: 'center', marginTop: 2 }}>
                <Link to='/createEcommListing'>
                  <Button variant="contained" color="secondary" sx={{ display: 'flex', color: 'white', fontWeight: 'bold', fontSize: 15, marginBottom: 1, width: '100%' }}>
                    Create a draft
                  </Button>
                </Link>
              </Box>
            </>
          ) : (
            (Array.from(drafts).map((val) => (
              <Link to={`/marketplaceListing/${val.id}`}>
                <DraftList title={val.title} category={val.category.categoryName} budget={val.price} name={val.appUser.name} image={val.imageList} />
              </Link>
            )))
          )
          }
        </Grid>
      </Grid>
    </Box>
  ) : (
    <InContainerLoading/>
  )
  );
};

export default OwnDrafts;