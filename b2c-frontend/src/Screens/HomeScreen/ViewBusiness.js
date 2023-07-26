import { Grid, Typography, SvgIcon, Button, TextField, Box } from '@mui/material';
import React from 'react';
import { Search as SearchIcon, ArrowLeft as ArrowIcon, PlusCircle as PlusIcon } from 'react-feather';
import { Link } from 'react-router-dom';
import * as userApi from '../../API/userApi';
import BusinessList from '../../Components/HomeScreen/BusinessList';

const ViewBusiness = () => {
  const [business, setBusiness] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    getBusiness();
  })

  React.useEffect(() => {
    if(searchValue === '') {
      getBusiness();
    } else {
      getSearchBusiness();
    }
  }, [searchValue])

  async function getBusiness() {
    try {
      await userApi.getBusinesses().then((val) => {
        setBusiness(val.data);
      })
    } catch (error) {
      setBusiness([])
    } finally {
      setLoading(false);
    }
  }

  const handleFormChange = (e) => {
    setSearchValue(e.target.value);
  }

  async function getSearchBusiness() {
    try {
      await userApi.getSearchedBusinesses(searchValue).then((val) => {
        const arr = val.data;
        arr.sort(function (a, b) {
          if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
          if (a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
          return 0;
        })
        console.log(val.data);
        setBusiness(val.data);
      })
    } catch (error) {
      setBusiness([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid
        item
        lg={12}
        sm={12}
        xl={12}
        xs={12}
      >
        <Link to="/home">
          <SvgIcon
            fontSize="large"
            color="action"
          >
            <ArrowIcon />
          </SvgIcon>
        </Link>
      </Grid>
      <Grid item xs={12} sx={{ mt: 1, ml: 1 }}>
        <Typography variant="h5" fontWeight="bold">
          View All Business
        </Typography>
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
          style={{ width: '90%' }}
          value={searchValue}
          onChange={handleFormChange}
        />
        <Button value="Search" style={{ background: '#FB7A56', color: 'white', height: '100%', width: '6em', marginLeft: '-0.8em', WebkitBorderRadius: ".5vw" }}>
          Search
        </Button>
      </Grid>
      <Grid item xs={12}>
        {business.length > 0 ? (
          <>
            {Array.from(business).map((b) => (
              <BusinessList business={b} />
            ))}
          </>
        ) : (
          <Box sx={{ height: '100%', display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center', mt: 15 }}>
            <Button
              variant="contained"
              disabled={true}
              sx={{ ":disabled": { color: 'white', backgroundColor: 'secondary.main' } }}
            >
              No business found
            </Button>
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default ViewBusiness;