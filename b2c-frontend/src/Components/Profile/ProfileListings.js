import { Box, Button, Card, Grid, ImageList, ImageListItem, ImageListItemBar, MenuItem, Select, SvgIcon, TextField, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import * as UserAPI from '../../API/userApi';
import * as indexApi from '../../API/index';
import * as listingApi from '../../API/listingApi';
import * as marketplaceApi from '../../API/marketplaceApi';
import InContainerLoading from '../InContainerLoading';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useParams } from 'react-router';
import { toggleView } from '../../Redux/actions';
import { useDispatch } from 'react-redux';
import { MARKET_VIEW, REFASHIONER_VIEW } from '../../constants';
import ProfileProjectListings from './ProfileProjectListings';
import ProfileMPL from './ProfileMPL';
import { getMarketplaceListings } from '../../API/marketplaceApi';

const ProfileListings = ({ id = 0, username }) => {
  const currentUser = useSelector(state => state.currUserData);
  const navigate = useNavigate();
  const [listings, setListings] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const notHidden = useMediaQuery(theme => theme.breakpoints.up('md'));
  const [toggleValue, setToggleValue] = React.useState('initial');
  const [listingType, setListingType] = React.useState('PROJECT LISTINGS');
  const dispatch = useDispatch();

  React.useEffect(() => {
    setLoading(true);
    getListings();
  }, [])

  React.useEffect(() => {
    refreshResults(listingType);
  }, [searchValue])

  // React.useEffect(() => {
  //   setLoading(true);
  //   refreshResults();
  // }, [listingType]);

  const getListings = async () => {
    try {
      if (searchValue === '') {
        if (id === 0) {
          await UserAPI.retrieveProjectListingsByRefashionerId(currentUser.id).then((val) => {
            console.log("PROJECT LISTINGS" , val.data);
            setListings(val.data);
          });
        } else {
          await UserAPI.retrieveProjectListingsByRefashionerId(id).then((val) => {
            setListings(val.data);
          });
        }
      } else {
        if (id === 0) {
          await listingApi.getRefashionerListingsByKeyword(currentUser.username, searchValue).then((val) => {
            setListings([]);
            setListings(val.data);
          })
        } else {
          await listingApi.getRefashionerListingsByKeyword(username, searchValue).then((val) => {
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

  const getMPLListings = async () => {
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

  const handleChange = (e) => {
    setLoading(true);
    setToggleValue(e.target.value);
  }

  const handleListingChange = (e) => {
    setLoading(true);
    setListingType(e.target.value);
    refreshResults(e.target.value);
  }

  const visitMpl = () => {
    dispatch(toggleView(MARKET_VIEW));
    navigate('/createEcommListing');
  }

  const visitRefashioner = () => {
    dispatch(toggleView(REFASHIONER_VIEW));
    navigate('/createListing');
  }
  
  const refreshResults = (type) => {
    if (type === 'PROJECT LISTINGS') {
      getListings();
    } else {
      console.log("getting mpl listings...");
      getMPLListings();
    }
  }

  const getPublishedMpl = async () => {
    try {
      if (id === 0) {
        await marketplaceApi.getPublishedMPLFromUsername(currentUser.username).then((val) => {
          setListings([]);
          setListings(val.data);
        })
      } else {
        // get mpl
      }
    } catch (error) {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }

  // const refreshFilterResults = async (toggle) => {
  //   if (toggle === 'PUBLISHED') {
  //     getPublishedMpl();
  //   } else if (toggle === 'ALL' || toggle === 'initial') {
  //     getMPLListings();
  //   } else {
  //     try {
  //       await marketplaceApi.getDrafts().then((val) => {
  //         setListings([]);
  //         setListings(val.data);
  //       })
  //     } catch (error) {
  //       setListings([]);
  //     } finally {
  //       setLoading(false);
  //     }   
  //   }
  // }

  console.log(listings);

  return (
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
        <Button value="Search" style={{ background: '#FB7A56', color: 'white', height: '100%', width: '6em', marginLeft: -15, WebkitBorderRadius: "1vw" }}>
          Search
        </Button>
      </Grid>
      
      <Grid item lg={6} xs={0}>
      {/* {listingType === 'MARKETPLACE LISTINGS' && (id === 0 || id === currentUser.id) &&
        <Select
          labelId="sort-select"
          label="sort"
          value={toggleValue}
          onChange={handleChange}
          sx={{ width: "90%", height: '70%', float: 'right', mr: 2}}
        >
          <MenuItem disabled value="initial">Filter By Status</MenuItem>
          <MenuItem value="ALL">ALL</MenuItem>
          <MenuItem value="PUBLISHED">Published</MenuItem>
          <MenuItem value="DRAFT">Drafts</MenuItem>

        </Select>
        } */}
      </Grid>


      <Grid item lg={6} xs={12} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <ToggleButtonGroup
            color="secondary"
            value={listingType}
            exclusive
            onChange={handleListingChange}
            sx={ notHidden ? { float: 'right', height: '100%', mr: 0} : { height: '90%'}}
          >
            <ToggleButton value="PROJECT LISTINGS">PROJECT LISTINGS</ToggleButton>
            <ToggleButton value="MARKETPLACE LISTINGS">MARKETPLACE LISTINGS</ToggleButton>
          </ToggleButtonGroup>

      </Grid>

      {!loading ? (
        <>
        {listingType === 'PROJECT LISTINGS' ? (
        <ProfileProjectListings id={id} searchValue={searchValue} listings={listings}/>
      ) : (
        <ProfileMPL id={id} searchValue={searchValue} listings={listings}/>
      )}
        </>
      ) : (
        <InContainerLoading />
      )}


      {/* <Grid item xs={12} style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
        {(listings !== [] && listings.length > 0) ? (
          (notHidden ? (
            <ImageList cols={3} gap={45}>
              {id == 0 &&
                <Card sx={{ display: 'flex', marginBottom: 1, cursor: 'pointer' }} onClick={() => navigate('/createListing')}>
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

              {Array.from(listings).filter((val) => val.title.includes(searchValue)).map((list) => (
                <Link to={`/listing/${list.id}`}>
                  {console.log(list)}
                  <Card sx={{ mb: 1, position: 'relative' }}>
                    <ImageListItem key={list.id} style={{ overflow: 'hidden' }} >
                      {Array.from(list.imageList).slice(0, 1).map((val) => (
                        <img src={val.url} key={val.url} loading="lazy" style={{ maxWidth: 300, minWidth: 300, maxHeight: 300, minHeight: 300, cursor: 'pointer' }} />
                      ))}
                      <ImageListItemBar
                        title={list.title}
                        subtitle={list.refashioner.name}
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
                <Card sx={{ display: 'flex', marginBottom: 1, cursor: 'pointer' }} onClick={() => navigate('/createListing')}>
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

              {Array.from(listings).filter((val) => val.title.includes(searchValue)).map((list) => (
                <Link to={`/listing/${list.id}`}>
                  {console.log(list)}
                  <Card sx={{ mb: 1, position: 'relative' }}>
                    <ImageListItem key={list.id} style={{ minHeight: '45vw', maxHeight: '45vw', overflow: 'hidden' }} >
                      {Array.from(list.imageList).slice(0, 1).map((val) => (
                        <img src={val.url} key={val.url} loading="lazy" style={{ maxWidth: '45vw', minWidth: '45vw', maxHeight: '45vw', minHeight: '45vw', cursor: 'pointer' }} />
                      ))}
                      <ImageListItemBar
                        title={list.title}
                        subtitle={list.refashioner.name}
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
            {id === 0 || id === currentUser.id ? (
              <>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: "center", alignContent: 'center', marginTop: 5 }}>
                    <Typography>You have no listings.</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: "center", alignContent: 'center', marginTop: 2 }}>
                      <Button variant="contained" color="secondary" sx={{ display: 'flex', color: 'white', fontWeight: 'bold', fontSize: 15, marginBottom: 1, width: 250}} onClick={visitRefashioner}>
                        Create a project listing
                      </Button>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: "center", alignContent: 'center', marginTop: 2 }}>
                    <Button variant="contained" color="primary" sx={{ display: 'flex', color: 'white', fontWeight: 'bold', fontSize: 15, marginBottom: 1, width: 300 }} onClick={visitMpl}>
                      Create a marketplace listing
                    </Button>
                  </Box>
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: "center", alignContent: 'center', marginTop: 5 }}>
                  <Typography>No listings found.</Typography>
                </Box>
              </Grid>
            )}
          </>
        )}
      </Grid> */}

    </Grid>
  );
};

export default ProfileListings;