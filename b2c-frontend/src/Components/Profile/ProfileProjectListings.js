import { Box, Button, Card, Grid, ImageList, ImageListItem, ImageListItemBar, MenuItem, Select, SvgIcon, TextField, ToggleButton, ToggleButtonGroup, Typography, useMediaQuery } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import * as UserAPI from '../../API/userApi';
import * as indexApi from '../../API/index';
import InContainerLoading from '../InContainerLoading';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useParams } from 'react-router';
import { toggleView } from '../../Redux/actions';
import { useDispatch } from 'react-redux';
import { MARKET_VIEW, REFASHIONER_VIEW } from '../../constants';

const ProfileProjectListings = ({ id, searchValue, listings }) => {
  const currentUser = useSelector(state => state.currUserData);
  const notHidden = useMediaQuery(theme => theme.breakpoints.up('md'));
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const visitRefashioner = () => {
    dispatch(toggleView(REFASHIONER_VIEW));
    navigate('/createListing');
  }
  return (
    <Grid item xs={12} style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
      {(listings !== [] && listings.length > 0) ? (
        (notHidden ? (
          <ImageList cols={3} gap={45}>
            {id == 0 &&
              <Card sx={{ display: 'flex', marginBottom: 1, cursor: 'pointer' }} onClick={visitRefashioner}>
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
                  <ImageListItem key={list.id} style={{ overflow: 'hidden' }} >
                    {Array.from(list.imageList).slice(0, 1).map((val) => (
                      <img src={val.url} key={val.url} loading="lazy" style={{ maxWidth: 300, minWidth: 300, maxHeight: 300, minHeight: 300, cursor: 'pointer' }} />
                    ))}
                    <ImageListItemBar
                      title={list.title}
                      subtitle={list?.refashioner?.name}
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
              <Card sx={{ display: 'flex', marginBottom: 1, cursor: 'pointer' }} onClick={visitRefashioner}>
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
                  <ImageListItem key={list.id} style={{ minHeight: '45vw', maxHeight: '45vw', overflow: 'hidden' }} >
                    {Array.from(list.imageList).slice(0, 1).map((val) => (
                      <img src={val.url} key={val.url} loading="lazy" style={{ maxWidth: '45vw', minWidth: '45vw', maxHeight: '45vw', minHeight: '45vw', cursor: 'pointer' }} />
                    ))}
                    <ImageListItemBar
                      title={list.title}
                      subtitle={list?.refashioner?.name}
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
                  <Button variant="contained" color="secondary" sx={{ display: 'flex', color: 'white', fontWeight: 'bold', fontSize: 15, marginBottom: 1, width: 250 }} onClick={visitRefashioner}>
                    Create a project listing
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
    </Grid>
  );
};

export default ProfileProjectListings;