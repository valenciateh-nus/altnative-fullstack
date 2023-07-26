import { Box, Button, Card, Chip, Grid, ImageList, ImageListItem, ImageListItemBar, SvgIcon, TextField, Typography, useMediaQuery } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import * as marketplaceApi from '../../API/marketplaceApi';
import InContainerLoading from '../InContainerLoading';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const ProfileListings = ({ id = 0, username }) => {
  const currentUser = useSelector(state => state.currUserData);
  const navigate = useNavigate();
  const [listings, setListings] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const notHidden = useMediaQuery(theme => theme.breakpoints.up('md'));

  React.useEffect(() => {
    setLoading(true);
    getListings();
  }, [])

  React.useEffect(() => {
    console.log("running");
    getListings();
  }, [searchValue])

  const getListings = async () => {
    try {
      if (searchValue === '') {
      if (id === 0) {
        console.log("calling api mpl listings...");
        await marketplaceApi.getOwnMarketplaceListings().then((val) => {
          setListings([]);
          setListings(val.data);
        });
      } else {
        await marketplaceApi.getPublishedMPLFromUsername(username).then((val) => {
          setListings([]);
          setListings(val.data);
        })
      }
    } else {
      if (id === 0) {
        console.log("calling api mpl listings...");
        await marketplaceApi.getOwnMarketplaceListingsByKeyword(searchValue).then((val) => {
          setListings([]);
          setListings(val.data);
        });
      } else {
        await marketplaceApi.getPublishedMPLByKeyword(username, searchValue).then((val) => {
          setListings([]);
          setListings(val.data);
        })
      }
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

  console.log(listings);

  return (!loading ? (
    <>
      <Grid container spacing={2} sx={{ mt: 0 }}>
        <Grid
          item
          lg={12}
          xs={12}
          style={{ overflow: 'scroll', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <TextField
            id='search-bar'
            placeholder='Search Listings'
            style={{ width: '85%' }}
            value={searchValue}
            onChange={handleFormChange}
          />
          <Button value="Search" style={{ background: '#FB7A56', color: 'white', height: '100%', width: '6em', marginLeft: -25, WebkitBorderRadius: "1vw" }}>
            Search
          </Button>
        </Grid>

        <Grid item xs={12} style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
          {(listings !== [] && listings.length > 0) ? (
            (notHidden ? (
              <ImageList cols={3} gap={45}>
                {id == 0 &&
                  <Card sx={{ display: 'flex', marginBottom: 1, cursor: 'pointer' }} onClick={() => navigate('/createDeadstockListing')}>
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
                  <Link to={`/listing/${list.id}`}>
                    {console.log(list)}
                    <Card sx={{ mb: 1, position: 'relative' }}>
                      {!list.instock && 
                    <Chip label="Out of Stock" sx={{ color: 'white', backgroundColor: 'rgba(255, 0, 0, 0.8)', fontSize: 14, fontWeight: '600', WebkitBorderRadius: '13px', margin: 1, padding: 0, position: 'absolute', zIndex: '999' }} />
                      }
                      <ImageListItem key={list.id} style={{ overflow: 'hidden' }} >
                        {Array.from(list.imageList).slice(0, 1).map((val) => (
                          <img src={val.url} key={val.url} loading="lazy" style={{ maxWidth: 300, minWidth: 300, maxHeight: 300, minHeight: 300, cursor: 'pointer' }} />
                        ))}
                        <ImageListItemBar
                          title={list.title}
                          subtitle={list.appUser.name}
                          sx={{ background: 'rgba(180, 180, 180, 0.8)', height: '34%', fontSize: 20 }}
                        />
                      </ImageListItem>
                    </Card>
                  </Link>
                ))}
              </ImageList>
            ) : (
              <ImageList cols={2} gap={10}>
                {id == 0 &&
                  <Card sx={{ display: 'flex', marginBottom: 1, cursor: 'pointer' }} onClick={() => navigate('/createDeadstockListing')}>
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
                  <Link to={`/listing/${list.id}`}>
                    {console.log(list)}
                    <Card sx={{ mb: 1, position: 'relative' }}>
                    {!list.instock && 
                    <Chip label="Out of Stock" sx={{ color: 'white', backgroundColor: 'rgba(255, 0, 0, 0.8)', fontSize: 10, fontWeight: '600', WebkitBorderRadius: '13px', margin: 0.5, padding: 0, position: 'absolute', zIndex: '999' }} />
                      }
                      <ImageListItem key={list.id} style={{ overflow: 'hidden' }} >
                        {Array.from(list.imageList).slice(0, 1).map((val) => (
                          <img src={val.url} key={val.url} loading="lazy" style={{ maxWidth: '45vw', minWidth: '45vw', maxHeight: '45vw', minHeight: '45vw', cursor: 'pointer' }} />
                        ))}
                        <ImageListItemBar
                          title={list.title}
                          subtitle={list.appUser.name}
                          sx={{ background: 'rgba(180, 180, 180, 0.8)', height: '34%', fontSize: 20 }}
                        />
                      </ImageListItem>
                    </Card>
                  </Link>
                ))}
              </ImageList>
            ))
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: "center" }}>
              <Typography align="center">
                You have no deadstock listings.
              </Typography>
            </Box>
          )
          }
        </Grid>
      </Grid>
    </>
  ) : (
    <InContainerLoading />
  ));
};

export default ProfileListings;