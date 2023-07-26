import { Box, Button, Card, Chip, CircularProgress, Container, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, MenuItem, Select, SvgIcon, TextField, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft as ArrowIcon } from 'react-feather';
import SearchIcon from '@mui/icons-material/Search';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import MarketplaceImg from '../../Components/Images/MarketplaceImage.png';
import * as marketplaceApi from '../../API/marketplaceApi.js';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';


const HomeScreen = () => {
  const [searchValue, setSearchValue] = React.useState('');
  const [listings, setListings] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const notHidden = useMediaQuery(theme => theme.breakpoints.up('md'));
  const [filterValue, setFilterValue] = React.useState('initial');
  const [sortValue, setSortValue] = React.useState('initial');

  useEffect(() => {
    setLoading(true);
    getListings();
  }, [])

  useEffect(() => {
    getFilteredListings();
  }, [searchValue])

  useEffect(() => {
    getFilteredListings();
  }, [filterValue])

  // useEffect(() => {
  //   setLoading(true);
  //   getSortedListings();
  // }, [sortValue])

  const getSortedListings = async (value) => {
    console.log(sortValue);
    if (value === 'low') {
      listings.sort(function (a, b) {
        return a.price - b.price;
      })
    } else if (value === 'high') {
      listings.sort(function (a, b) {
        return b.price - a.price;
      })
    } else if (value === 'new') {
      listings.sort(function (a, b) {
        return new Date(b.dateCreated) - new Date(a.dateCreated);
      })
    } else if (value === 'old') {
      listings.sort(function (a, b) {
        return new Date(a.dateCreated) - new Date(b.dateCreated);
      })
    } else {
      return;
    }

    setListings([]);
    setListings(listings);
    setLoading(false);
  }

  const getListings = async () => {
    try {
      await marketplaceApi.getMarketplaceListings().then((val) => {
        const array = val.data;
        array.sort(function (a, b) {
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

  const getFilteredListings = async () => {
    try {
      if (searchValue === '') {
        if (filterValue === 'MPL') {
          await marketplaceApi.getFilteredMarketplaceListings(false).then((val) => {
            const array = val.data;
            array.sort(function (a, b) {
              return new Date(b.dateCreated) - new Date(a.dateCreated);
            })
            setListings(array);
          })
        } else if (filterValue === 'Deadstocks') {
          await marketplaceApi.getFilteredMarketplaceListings(true).then((val) => {
            const array = val.data;
            array.sort(function (a, b) {
              return new Date(b.dateCreated) - new Date(a.dateCreated);
            })
            setListings(array);
          })
        } else {
          await marketplaceApi.getMarketplaceListings().then((val) => {
            const array = val.data;
            array.sort(function (a, b) {
              return new Date(b.dateCreated) - new Date(a.dateCreated);
            })
            setListings(array);
          })
        }
      } else {
        if (filterValue === 'MPL') {
          await marketplaceApi.getFilteredMarketplaceListingsByKeyword(false, searchValue).then((val) => {
            const array = val.data;
            array.sort(function (a, b) {
              return new Date(b.dateCreated) - new Date(a.dateCreated);
            })
            setListings(array);
          })
        } else if (filterValue === 'Deadstocks') {
          await marketplaceApi.getFilteredMarketplaceListingsByKeyword(true, searchValue).then((val) => {
            const array = val.data;
            array.sort(function (a, b) {
              return new Date(b.dateCreated) - new Date(a.dateCreated);
            })
            setListings(array);
          })
        } else {
          await marketplaceApi.getMarketplaceListingsByKeyword(searchValue).then((val) => {
            const array = val.data;
            array.sort(function (a, b) {
              return new Date(b.dateCreated) - new Date(a.dateCreated);
            })
            setListings(array);
          })
        }
      }

    } catch (error) {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }

  const getSearchedListings = async () => {
    try {
      if (searchValue === '') {
        await marketplaceApi.getMarketplaceListings().then((val) => {
          const array = val.data;
          array.sort(function (a, b) {
            return new Date(b.dateCreated) - new Date(a.dateCreated);
          })
          setListings(array);
        })
      } else {
        await marketplaceApi.getMarketplaceListingsByKeyword(searchValue).then((val) => {
          const array = val.data;
          array.sort(function (a, b) {
            return new Date(b.dateCreated) - new Date(a.dateCreated);
          })
          setListings(array);
        })
      }

    } catch (error) {
      setListings([]);
    }
  }

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  }

  const handleSortChange = (e) => {
    // setLoading(true);
    setSortValue(e.target.value);
    getSortedListings(e.target.value);
  }

  console.log(listings);

  const handleFormChange = (e) => {
    setSearchValue(e.target.value);
  }
  return (!loading ? (
    <Box
      sx={{
        minHeight: '100%',
        px: 1,
        py: 5,
        marginLeft: 1,
      }}
    >
      <Container maxWidth={false}>
        <Grid
          container
          spacing={3}
        >
          {/* <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              MarketPlace
            </Typography>
          </Grid> */}

          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              MarketPlace
            </Typography>
            <Box
              sx={{
                height: 70,
                width: 70,
                position: 'relative',
                top: -20,
                right: 0,
              }}
            >
              <img alt="Marketplace Image" src={MarketplaceImg} style={{ objectFit: 'contain' }} />
            </Box>
          </Grid>

          <Grid item xs={12} style={{ overflow: 'scroll', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <TextField
              id='search-bar'
              placeholder='Search Projects'
              style={{ width: '80%' }}
              value={searchValue}
              onChange={handleFormChange}
            />
            <Button value="Search" style={{ background: '#FB7A56', color: 'white', height: '100%', width: 'auto', marginLeft: '-1.5em', WebkitBorderRadius: ".9vw" }}>
              <IconButton>
                <CameraAltIcon />
              </IconButton>
            </Button>
          </Grid>

          {/* <Grid item xs={6} >
            <Select
              labelId="sort-select"
              label="sort"
              value={sortValue}
              onChange={handleSortChange}
              style={{ float: 'left', height: '60%', width: '90%', WebkitBorderRadius: "1.4vw" }}
            >
              <MenuItem disabled value='initial'>Sort</MenuItem>
              <MenuItem value='low'>Price Low to High</MenuItem>
              <MenuItem value='high'>Price High to Low</MenuItem>
              <MenuItem value='new'>Newest to Oldest</MenuItem>
              <MenuItem value='old'>Oldest to Newest</MenuItem>
            </Select>
          </Grid> */}

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Select
              labelId="filter-select"
              label="filter"
              value={filterValue}
              onChange={handleFilterChange}
              style={{ height: '60%', width: '90%', WebkitBorderRadius: "1.4vw" }}
            >
              <MenuItem disabled value={'initial'}>Filter</MenuItem>
              <MenuItem value={'ALL'}>All</MenuItem>
              <MenuItem value={'MPL'}>Marketplace Listings</MenuItem>
              <MenuItem value={'Deadstocks'}>Deadstock Listings</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12} style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
            {listings !== [] && listings.length ? (
              (notHidden ? (
                <ImageList cols={4} gap={20}>
                  {Array.from(listings).filter((item) => (item.title.toLowerCase()).match(searchValue.toLowerCase()) !== null).map((img, i) => (
                    <Link to={img.deadstock ? `/deadstockListing/${img.id}` : `/marketplaceListing/${img.id}`}>
                      <Card sx={{ mb: 1, position: 'relative' }}>
                        {img.deadstock ? (
                          <Chip label="Deadstock" sx={{ color: 'white', backgroundColor: 'rgba(251, 122, 86, 0.8)', fontSize: 11, fontWeight: '600', WebkitBorderRadius: '13px', margin: 0.5, padding: 0, position: 'absolute', zIndex: '999' }} />
                        ) : (
                          <Chip label="Marketplace" sx={{ color: 'white', backgroundColor: 'rgba(254, 210, 121, 0.8)', fontSize: 11, fontWeight: '600', WebkitBorderRadius: '13px', margin: 0.5, padding: 0, position: 'absolute', zIndex: '999' }} />
                        )}
                        <ImageListItem key={i} style={{ minHeight: 220, maxHeight: 220, overflow: 'hidden' }} >
                          <img src={img?.imageList[0]?.url} loading="lazy" style={{ cursor: 'pointer' }} />
                          {!img.instock &&
                            <ImageListItemBar
                            title={<Typography align="center" fontSize={20}>Out of Stock</Typography>}
                            sx={{ background: 'rgba(180, 180, 180, 0.8)', height: '34%' }}
                            />
                          }
                        </ImageListItem>
                      </Card>
                      <Typography fontWeight={550} fontSize={17} align="center">
                        {img.title}
                      </Typography>
                      <Typography fontWeight={400} fontSize={14} align="center">
                        SGD {img.price != Math.round(img.price) ? Number(img.price).toFixed(2) : img.price}
                      </Typography>
                    </Link>
                  ))}
                </ImageList>
              ) : (
                <ImageList cols={2}>
                  {Array.from(listings).map((img, i) => (
                    <Link to={img.deadstock ? `/deadstockListing/${img.id}` : `/marketplaceListing/${img.id}`}>
                      <Card sx={{ mb: 1, position: 'relative' }}>
                        {img.deadstock ? (
                          <Chip label="Deadstock" sx={{ color: 'white', backgroundColor: 'rgba(251, 122, 86, 0.8)', fontSize: 10, fontWeight: '600', WebkitBorderRadius: '13px', margin: 0.5, padding: 0, position: 'absolute', zIndex: '999' }} />
                        ) : (
                          <Chip label="Marketplace" sx={{ color: 'white', backgroundColor: 'rgba(254, 210, 121, 0.8)', fontSize: 10, fontWeight: '600', WebkitBorderRadius: '13px', margin: 0.5, padding: 0, position: 'absolute', zIndex: '999' }} />
                        )}
                        <ImageListItem key={i} style={{ minHeight: 150, maxHeight: 150, overflow: 'hidden' }} >
                          <img src={img.imageList[0].url} loading="lazy" style={{ cursor: 'pointer' }} />
                          {!img.instock &&
                            <ImageListItemBar
                              title={<Typography align="center" fontSize={20}>Out of Stock</Typography>}
                              sx={{ background: 'rgba(180, 180, 180, 0.8)', height: '34%' }}
                            />
                          }
                        </ImageListItem>
                      </Card>
                      <Typography fontWeight={550} fontSize={17} align="center">
                        {img.title}
                      </Typography>
                      <Typography fontWeight={400} fontSize={14} align="center">
                        SGD {img.price != Math.round(img.price) ? Number(img.price).toFixed(2) : img.price}
                      </Typography>
                    </Link>
                  ))}
                </ImageList>
              ))
            ) : (
              <Box sx={{ display: 'flex', justifyContent: "center", alignContent: 'center', marginTop: 5 }}>
                <Typography>There is no published listings.</Typography>
              </Box>
            )}


          </Grid>
        </Grid>
      </Container>
    </Box>
  ) : (
    <Box sx={{ display: 'flex', flexGrow: 1, height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <CircularProgress color='secondary' sx={{ marginBottom: 2 }} />
      <Typography>Loading...</Typography>
    </Box>
  )
  );
};

export default HomeScreen;