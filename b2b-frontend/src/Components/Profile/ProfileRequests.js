import { Box, Button, Card, Chip, Grid, ImageList, ImageListItem, ImageListItemBar, MenuItem, Select, SvgIcon, TextField, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import * as indexApi from '../../API/index';
import InContainerLoading from '../InContainerLoading';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const ProfileRequest = ({ id = 0, username }) => {
  const currentUser = useSelector(state => state.currUserData);
  const navigate = useNavigate();
  const [listings, setListings] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [toggleValue, setToggleValue] = React.useState('PUBLISHED');
  const notHidden = useMediaQuery(theme => theme.breakpoints.up('md'));

  React.useEffect(() => {
    setLoading(true);
    if (id == 0) {
      getListings();
    } else {
      getPublishedListings();
    }
  }, [])

  React.useEffect(() => {
    setLoading(true);
    getListings();
  }, [toggleValue])

  React.useEffect(() => {
    if (id == 0) {
      getListings();
    } else {
      getPublishedListings();
    }
  }, [searchValue])

  const getListings = async () => {
    try {
      if (searchValue === '') {
        await indexApi.getRequestsByStatus(toggleValue).then((arr) => {
          const array = arr.data;
          array.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.dateCreated) - new Date(a.dateCreated);
          })
          setListings([]);
          setListings(array);
        })
      } else {
        await indexApi.getRequestsByStatusKeyword(toggleValue, searchValue).then((arr) => {
          const array = arr.data;
          array.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.dateCreated) - new Date(a.dateCreated);
          })
          setListings([]);
          setListings(array);
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
        await indexApi.getPublishedRequests(username).then((arr) => {
          const array = arr.data;
          array.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.dateCreated) - new Date(a.dateCreated);
          })
          setListings([]);
          setListings(array);
        })
      } else {
        await indexApi.getPublishedRequestsByKeyword(username, searchValue).then((arr) => {
          const array = arr.data;
          array.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.dateCreated) - new Date(a.dateCreated);
          })
          setListings([]);
          setListings(array);
        })
      }
      
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
        lg={10}
        xs={12}
        style={{ overflow: 'scroll', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <TextField
          id='search-bar'
          placeholder='Search Requests'
          style={{ width: '80%' }}
          value={searchValue}
          onChange={handleFormChange}
        />
        <Button value="Search" style={{ background: '#FB7A56', color: 'white', height: '100%', width: '6em', marginLeft: -25, WebkitBorderRadius: "1vw" }}>
          Search
        </Button>
      </Grid>
      {id == 0 &&
      <>
      {notHidden ? (
        <Grid lg={2}>
          <ToggleButtonGroup
            color="secondary"
            value={toggleValue}
            exclusive
            onChange={handleChange}
            sx={{ float: 'right', mt: 2, mr: 2 }}
          >
            <ToggleButton value="PUBLISHED">Published</ToggleButton>
            <ToggleButton value="DRAFT">Drafts</ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      ) : (
        <Grid xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
          <Select
            labelId="sort-select"
            label="sort"
            value={toggleValue}
            onChange={handleChange}
            sx={{ width: "90%", height: '70%', ml: '2%' }}
          >
            <MenuItem value="PUBLISHED">Published</MenuItem>
            <MenuItem value="DRAFT">Drafts</MenuItem>
          </Select>
        </Grid>
      )}
      </>
      }

      <Grid item xs={12} style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
        {(listings !== [] && listings.length > 0) ? (
          (notHidden ? (
            <ImageList cols={3} gap={45}>
            {id == 0 && 
              <Card sx={{ display: 'flex', marginBottom: 1, cursor: 'pointer' }} onClick={() => navigate('/upload')}>
                <Box sx={{ maxWidth: 300, minWidth: 300, maxHeight: 300, minHeight: 300, borderRadius: '.2em', background: 'rgb(240, 240, 240)', display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                  <SvgIcon
                    fontSize="large"
                    color="action"
                    sx={{ marginTop: '40%', marginLeft: '3%' }}
                  >
                    <AddCircleOutlineIcon />
                  </SvgIcon>
                </Box>
              </Card>}
              {Array.from(listings).map((list) => (
                <Link to={`/request/${list.id}`}>
                  <Card sx={{ mb: 1, position: 'relative' }}>
                    <ImageListItem key={list.id} style={{ overflow: 'hidden' }} >
                      {Array.from(list.imageList).slice(0, 1).map((val) => (
                        <img src={val.url} key={val.url} loading="lazy" style={{ maxWidth: 300, minWidth: 300, maxHeight: 300, minHeight: 300, cursor: 'pointer' }} />
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
            <ImageList cols={2} gap={10}>
              {id == 0 &&
              <Card sx={{ display: 'flex', marginBottom: 1, cursor: 'pointer' }} onClick={() => navigate('/upload')}>
                <Box sx={{ maxWidth: '45vw', minWidth: '45vw', maxHeight: '45vw', minHeight: '45vw', borderRadius: '.2em', background: 'rgb(240, 240, 240)', display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                  <SvgIcon
                    fontSize="large"
                    color="action"
                    sx={{ marginTop: '35%', marginLeft: '3%' }}
                  >
                    <AddCircleOutlineIcon />
                  </SvgIcon>
                </Box>
              </Card>
              }

              {Array.from(listings).map((list) => (
                <Link to={`/request/${list.id}`}>
                  {console.log(list)}
                  <Card sx={{ mb: 1, position: 'relative' }}>
                    <ImageListItem key={list.id} style={{ minHeight: '45vw', maxHeight: '45vw', overflow: 'hidden' }} >
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
          ))
        ) : (
          <>
            <Grid item xs={12} sx={{ display: 'block'}}>
              <Box sx={{ display: 'flex', justifyContent: "center", alignContent: 'center', marginTop: 5 }}>
                <Typography>
                You have no <Typography fontWeight={600} display="inline"> {toggleValue.toLowerCase()} </Typography> requests.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: "center", alignContent: 'center', mt: 2}}>
                  <Button variant="contained" onClick={() => navigate('/upload')} color="secondary" sx={{ display: 'flex', color: 'white', width: 200, fontWeight: 'bold', fontSize: 15, marginBottom: 1}}>
                    Create a request
                  </Button>
              </Box>
            </Grid>
          </>
        )}
      </Grid>
    </Grid>
  ) : (
    <InContainerLoading />
  ));
};

export default ProfileRequest;