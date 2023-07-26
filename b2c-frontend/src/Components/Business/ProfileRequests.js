import { Box, Button, Chip, Card, Grid, ImageList, ImageListItem, ImageListItemBar, SvgIcon, TextField, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import * as indexApi from '../../API/index';
import InContainerLoading from '../InContainerLoading';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const ProfileRequests = ({ user }) => {
  const currentUser = useSelector(state => state.currUserData);
  const navigate = useNavigate();
  const [listings, setListings] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [toggleValue, setToggleValue] = React.useState('PUBLISHED');
  const notHidden = useMediaQuery(theme => theme.breakpoints.up('md'));

  React.useEffect(() => {
    setLoading(true);
    getListings();
  }, [])

  // React.useEffect(() => {
  //   setLoading(true);
  //   getListingsByStatus();
  // }, [toggleValue])

  const getListings = async () => {
    try {
      await indexApi.getRequestByUsername(user.username, 0).then((arr) => {
        const array = arr.data;
        array.sort(function (a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(b.dateCreated) - new Date(a.dateCreated);
        })
        setListings(array);
      })
    } catch (error) {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }

  const getListingsByStatus = async () => {
    try {
      await indexApi.getRequestsById(user.id).then((arr) => {
        const array = arr.data;
        array.sort(function (a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(b.dateCreated) - new Date(a.dateCreated);
        })
        setListings(array);
      })
    } catch (error) {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }

  const handleFormChange = (e) => {
    setSearchValue(e.target.value);
  }

  const handleChange = (e) => {
    setToggleValue(e.target.value);
  }


  return (!loading ? (
    <Grid container spacing={2} sx={{ mt: 0 }}>
      <Grid
        item
        lg={12}
        xs={12}
        style={{ overflow: 'scroll', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <TextField
          id='search-bar'
          placeholder='Search Requests'
          style={{ width: '65%' }}
          value={searchValue}
          onChange={handleFormChange}
        />
        <Button value="Search" style={{ background: '#FB7A56', color: 'white', height: '100%', width: '6em', marginLeft: -25, WebkitBorderRadius: "1vw" }}>
          Search
        </Button>
        {/* 
        <ToggleButtonGroup
          color="secondary"
          value={toggleValue}
          exclusive
          onChange={handleChange}
          sx={{ ml: 5 }}
        >
          <ToggleButton value="PUBLISHED">Published</ToggleButton>
          <ToggleButton value="DRAFT">Drafts</ToggleButton>
        </ToggleButtonGroup> */}
      </Grid>

      {notHidden ? (
        <Grid item xs={12} style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
          {(listings !== [] && listings.length > 0) ? (
            <ImageList cols={3} gap={45}>
              {Array.from(listings).filter((val) => val.title.includes(searchValue)).map((list) => (
                <Link to={`/businessRequestDetails/${list.id}`}>
                  {console.log(list)}
                  <Card sx={{ mb: 1, position: 'relative' }}>
                  <ImageListItem key={list.id} style={{ overflow: 'hidden' }} >
                    {Array.from(list.imageList).slice(0, 1).map((val) => (
                      <img src={val.url} key={val.url} loading="lazy" style={{ maxWidth: '21vw', minWidth: '21vw', maxHeight: '21vw', minHeight: '21vw', cursor: 'pointer' }} />
                      ))}
                    <ImageListItemBar
                      title={list.title}
                      subtitle={list.refashionee.name}
                      sx={{ background: 'rgba(180, 180, 180, 0.5)', height: '34%' }}
                    />
                  </ImageListItem>
                  </Card>
                </Link>
              ))}
            </ImageList>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: "center" }}>
              <Typography align="center" sx={{ mt: 2 }}>
                No business requests found.
              </Typography>
            </Box>
          )}
        </Grid>
      ) : (
        <Grid item xs={12} style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
          {(listings !== [] && listings.length > 0) ? (
            <ImageList cols={2} gap={10}>
              {Array.from(listings).filter((val) => val.title.includes(searchValue)).map((list) => (
                <Link to={`/businessRequestDetails/${list.id}`}>
                  {console.log(list)}
                  <Card sx={{ mb: 1, position: 'relative' }}>
                  <ImageListItem key={list.id} style={{ overflow: 'hidden' }} >
                    {Array.from(list.imageList).slice(0, 1).map((val) => (
                      <img src={val.url} key={val.url} loading="lazy" style={{ maxWidth: '45vw', minWidth: '45vw', maxHeight: '45vw', minHeight: '45vw', cursor: 'pointer' }} />
                      ))}
                    <ImageListItemBar
                      title={list.title}
                      subtitle={list.refashionee.name}
                      sx={{ background: 'rgba(180, 180, 180, 0.5)', height: '34%' }}
                    />
                  </ImageListItem>
                  </Card>
                </Link>
              ))}
            </ImageList>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: "center" }}>
              <Typography align="center" sx={{ mt: 2 }}>
                You have no business requests found.
              </Typography>
            </Box>
          )}
        </Grid>
      )}

    </Grid>
  ) : (
    <InContainerLoading />
  ));
};

export default ProfileRequests;