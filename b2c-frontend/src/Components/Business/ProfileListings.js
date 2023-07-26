import { Box, Button, Grid,Card, ImageList, ImageListItem, ImageListItemBar, SvgIcon, TextField, Typography, useMediaQuery } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import * as marketplaceApi from '../../API/marketplaceApi';
import InContainerLoading from '../InContainerLoading';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const ProfileListings = ({ user }) => {
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

  const getListings = async () => {
    try {
      marketplaceApi.getMPLFromUsername(user.username).then((val) => {
        console.log(val.data);
        setListings(val.data);
      });
    } catch (error) {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }

  const handleFormChange = (e) => {
    setSearchValue(e.target.value);
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
          placeholder='Search Listings'
          style={{ width: '85%' }}
          value={searchValue}
          onChange={handleFormChange}
        />
        <Button value="Search" style={{ background: '#FB7A56', color: 'white', height: '100%', width: '6em', marginLeft: -25, WebkitBorderRadius: "1vw" }}>
          Search
        </Button>
      </Grid>

      {notHidden ? (
        <Grid item xs={12} style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
          {(listings !== [] && listings.length > 0) ? (
            <ImageList cols={3} gap={45}>
              {Array.from(listings).filter((val) => val.title.includes(searchValue)).map((list) => (
                <Link to={`/deadstockListing/${list.id}`}>
                  {console.log(list)}
                  <Card sx={{ mb: 1, position: 'relative' }}>
                  <ImageListItem key={list.id} style={{ overflow: 'hidden' }} >
                    {Array.from(list.imageList).slice(0, 1).map((val) => (
                      <img src={val.url} key={val.url} loading="lazy" style={{ maxWidth: '21vw', minWidth: '21vw', maxHeight: '21vw', minHeight: '21vw', cursor: 'pointer' }} />
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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: "center" }}>
              <Typography align="center">
                No deadstock listings found.
              </Typography>
            </Box>
          )
          }
        </Grid>
      ) : (
        <Grid item xs={12} style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
          {(listings !== [] && listings.length > 0) ? (
            <ImageList cols={2} gap={10}>
              {Array.from(listings).filter((val) => val.title.includes(searchValue)).map((list) => (
                <Link to={`/deadstockListing/${list.id}`}>
                  {console.log(list)}
                  <Card sx={{ mb: 1, position: 'relative' }}>
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
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: "center" }}>
              <Typography align="center">
                You have no deadstock listings.
              </Typography>
            </Box>
          )
          }
        </Grid>
      )}
    </Grid>
  ) : (
    <InContainerLoading />
  ));
};

export default ProfileListings;