import { Container, Typography, TextField, Box, Button, InputAdornment, SvgIcon, Grid, MenuItem, ToggleButtonGroup, ToggleButton, Select, Divider, Card, CardMedia, CardContent, Chip, CardActionArea, ImageListItem, CardHeader, Avatar } from '@mui/material';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from 'react-feather';
import DefaultImage from '../../assets/EmptyListing.png'

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

// API
import { useDispatch, useSelector } from 'react-redux';
import { ERROR } from "../../Redux/actionTypes";
import * as UserAPI from '../../API/userApi';
import * as marketplaceApi from '../../API/marketplaceApi.js';

const list = [
  {
    id: 1,
    title: 'Make Dress Into 2 Piece',
    category: ['Top', 'Jeans'],
    description: 'Lorem ipsum dolor sit amet.',
    image: [DefaultImage],
  },
  {
    id: 2,
    title: 'Make Denim into Jacket',
    category: ['Top', 'Jeans'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque rutrum magna at erat pulvinar pellentesque. Quisque imperdiet porta purus in varius. Pellentesque urna dui, iaculis vel gravida non, suscipit vel mauris. Nulla in viverra mauris. Nullam eget venenatis quam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque ac posuere justo, ac molestie mi. Mauris a libero ac magna interdum vestibulum. Ut in porttitor justo. Nullam metus odio, ultrices quis lacus maximus, luctus convallis magna. Curabitur fringilla purus in diam sollicitudin, ac ultrices sapien tincidunt. Vivamus non dapibus nibh.',
    image: [DefaultImage],
  },
  {
    id: 3,
    title: 'Embroider Flower on Jacket',
    category: ['Top', 'Jeans'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque rutrum magna at erat pulvinar pellentesque. Quisque imperdiet porta purus in varius. Pellentesque urna dui, iaculis vel gravida non, suscipit vel mauris. Nulla in viverra mauris. Nullam eget venenatis quam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque ac posuere justo, ac molestie mi. Mauris a libero ac magna interdum vestibulum. Ut in porttitor justo. Nullam metus odio, ultrices quis lacus maximus, luctus convallis magna. Curabitur fringilla purus in diam sollicitudin, ac ultrices sapien tincidunt. Vivamus non dapibus nibh.',
    image: [DefaultImage],
  },
  {
    id: 4,
    title: 'Alter waist of Jeans',
    category: ['Top', 'Jeans'],
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque rutrum magna at erat pulvinar pellentesque. Quisque imperdiet porta purus in varius. Pellentesque urna dui, iaculis vel gravida non, suscipit vel mauris. Nulla in viverra mauris. Nullam eget venenatis quam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque ac posuere justo, ac molestie mi. Mauris a libero ac magna interdum vestibulum. Ut in porttitor justo. Nullam metus odio, ultrices quis lacus maximus, luctus convallis magna. Curabitur fringilla purus in diam sollicitudin, ac ultrices sapien tincidunt. Vivamus non dapibus nibh.',
    image: [DefaultImage],
  },
]

export default function Favourites() {
  const navigate = useNavigate();

  const [favouriteListings, setFavouriteListings] = React.useState([]);
  const [favoriteMpl, setFavouriteMpl] = React.useState([]);

  React.useEffect(() => {
    UserAPI.retrieveFavouritedProjectListings().then((val) => {
      setFavouriteListings(val.data);
      console.log(val.data);
    });
    retrieveFavoriteMpl();
  }, [])

  const retrieveFavoriteMpl = async () => {
    try {
      await marketplaceApi.getFavorite().then((arr) => {
        setFavouriteMpl(arr.data);
      })
    } catch (error) {
      setFavouriteMpl([]);
    }
  }

  const [view, setView] = React.useState('list'); // list view and grid view
  const [searchValue, setSearchValue] = React.useState('');
  const [option, setOption] = React.useState(1);

  const handleChangeView = (event, nextView) => {
    setView(nextView);
  }

  const handleChangeOption = (event) => {
    setOption(event.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  }


  return (
    <Container>
      <Box>
        <Link to="/profile">
          <SvgIcon
            fontSize="large"
            color="action"
          >
            <ArrowBackIcon />
          </SvgIcon>
        </Link>
        <Typography variant='h5' style={{ fontWeight: 'bold' }} gutterBottom>Projects you liked</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={12} style={{ overflow: 'scroll', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <TextField
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SvgIcon
                      fontSize="small"
                      color="action"
                    >
                      <SearchIcon />
                    </SvgIcon>
                  </InputAdornment>
                )

              }}
              onChange={handleSearchChange}
              placeholder="Search Projects"
            />
            <Button value="Search" style={{ background: '#FB7A56', color: 'white', height: '100%', width: '6em', marginLeft: '-0.8em', WebkitBorderRadius: ".5vw", textTransform: 'none' }}>
              Search
            </Button>
          </Grid>

          <Grid item xs={12} lg={12}>
            <Divider />
          </Grid>

          <Grid
            item
            lg={12}
            xs={12}
            style={{ overflow: 'scroll' }}
          >
            {/* <Select
              labelId="filter-select"
              label="filter"
              value={option}
              style={{ float: 'left', height: '80%', width: '40%', border: '1px solid black', WebkitBorderRadius: ".5vw" }}
              onChange={handleChangeOption}
            >
              <MenuItem value={1}>Sort by Title</MenuItem>
              <MenuItem value={2}>Sort by Most Recent</MenuItem>
            </Select> */}
            {/* <ToggleButtonGroup
              size="medium"
              value={view}
              exclusive
              onChange={handleChangeView}
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

          {view === 'list' ? (
            <Grid container spacing={2}>
              {Array.from(favouriteListings).filter((item) => (item.title.toLowerCase()).match(searchValue.toLowerCase()) !== null).map((val) => (
                <Grid item xs={6} lg={3}>
                  <Card sx={{ height: '100%', width: '100%', py: 1, px: 0.5, overflow: 'scroll', ml: 1 }} onClick={() => navigate(`/listing/${val.id}`)}>
                    <Grid container sx={{ width: '100%', display: 'flex', alignContent: 'center', justifyContent: 'center', marginTop: '1em' }}>
                      <Grid item xs={12} sx={{display: 'flex', alignContent: 'center', justifyContent: 'center'}}>
                        <Chip label="Project Listing" color="info" sx={{ color: 'white', fontWeight: 'bold', fontSize: 11, height: '2em', mt: -1, mb: 1}} />
                      </Grid>
                      <Grid item xs={12} sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                        <ImageListItem key={'image'} style={{ width: 120, height: 120, overflow: 'hidden' }} >
                          {Array.from(val.imageList).slice(0, 1).map((img) => (
                            <img src={img.url} key={img.url} loading="lazy" style={{ cursor: 'pointer' }} />
                          ))}
                        </ImageListItem>
                      </Grid>
                      <Grid item xs={11} sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center', textAlign: 'center' }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: 18 }}>
                          {val.title}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                        <Box>
                          {val.materialList.map((material) => (
                            <Chip label={material.name} sx={{ background: '#FB7A56', color: 'white', fontWeight: 'bold', fontSize: 11, height: '2em', bottom: 0, padding: 0, marginTop: '5px', marginRight: 0.5, marginLeft: 0.5 }} />
                          ))}
                          {/* </Grid>
                      <Grid item xs={12} sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center'}}> */}
                          {val.tagList.map((tag) => (
                            <Chip label={tag.name} color="primary" sx={{ color: 'white', fontWeight: 'bold', fontSize: 11, height: '2em', bottom: 0, padding: 0, marginTop: '5px', marginRight: 0.5, marginLeft: 0.5 }} />
                          ))}
                        </Box>

                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              ))}

              {Array.from(favoriteMpl).filter((item) => (item.title.toLowerCase()).match(searchValue.toLowerCase()) !== null).map((val) => (
                 <Grid item xs={6} lg={3}>
                 <Card sx={{ height: '100%', width: '100%', py: 1, px: 0.5, overflow: 'scroll', ml: 1 }} onClick={() => navigate(`/marketplaceListing/${val.id}`)}>
                   <Grid container sx={{ width: '100%', display: 'flex', alignContent: 'center', justifyContent: 'center', marginTop: '1em' }}>
                   <Grid item xs={12} sx={{display: 'flex', alignContent: 'center', justifyContent: 'center'}}>
                        <Chip label="Marketplace Listing" color="info" sx={{ color: 'white', fontWeight: 'bold', fontSize: 11, height: '2em', mt: -1, mb: 1}} />
                      </Grid>
                     <Grid item xs={12} sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                       <ImageListItem key={'image'} style={{ width: 120, height: 120, overflow: 'hidden' }} >
                         {Array.from(val?.imageList).slice(0, 1).map((img) => (
                           <img src={img?.url} key={img?.url} loading="lazy" style={{ cursor: 'pointer' }} />
                         ))}
                       </ImageListItem>
                     </Grid>
                     <Grid item xs={11} sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center', textAlign: 'center' }}>
                       <Typography sx={{ fontWeight: 'bold', fontSize: 18 }}>
                         {val?.title}
                       </Typography>
                     </Grid>
                     <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                       <Box>
                          <Chip label={val?.category?.categoryName} sx={{ background: '#FB7A56', color: 'white', fontWeight: 'bold', fontSize: 11, height: '2em', bottom: 0, padding: 0, marginTop: '5px', marginRight: 0.5, marginLeft: 0.5 }} />
                       </Box>

                     </Grid>
                   </Grid>
                 </Card>
                 </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={2}>
              {Array.from(favouriteListings).filter((item) => (item.title.toLowerCase()).match(searchValue.toLowerCase()) !== null).map((val) => (
                <Grid item xs={12}>
                  <Card style={{ padding: 30 }}>
                    <Link to={`../listing/${val.id}`}>
                      <CardActionArea>
                        <Grid container spacing={6}>
                          <Grid item xs={4}>
                            <CardMedia
                              component="img"
                              image={val.imageList[0] ? val.imageList[0].url : DefaultImage}
                              alt="listing image"
                            />
                          </Grid>
                          <Grid item xs={8}>
                            <CardContent>
                              <Typography variant='h5' gutterBottom>
                                {val.title}
                              </Typography>
                              {
                                val.materialList.map((material) => (
                                  <Chip
                                    label={material.name}
                                    style={{
                                      background: "#FB7A56",
                                      fontWeight: "bold",
                                      color: "white",
                                      padding: "2.5vh 1.5vw",
                                      margin: "0 0.3em 1.5em",
                                      borderRadius: "3vh",
                                    }}
                                  />
                                ))
                              }
                              {
                                val.tagList.map((tag) => (
                                  <Chip
                                    label={tag.name}
                                    style={{
                                      background: "#FB7A56",
                                      fontWeight: "bold",
                                      color: "white",
                                      padding: "2.5vh 1.5vw",
                                      margin: "0 0.3em 1.5em",
                                      borderRadius: "3vh",
                                    }}
                                  />
                                ))
                              }
                              <Typography variant='subtitle1' noWrap>
                                {val.description}
                              </Typography>
                            </CardContent>
                          </Grid>
                        </Grid>
                      </CardActionArea>
                    </Link>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Box>
    </Container >
  )
}
