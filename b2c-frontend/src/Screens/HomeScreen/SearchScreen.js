import React, { useState, useEffect } from 'react';
import {
  Box,
  Chip,
  Menu,
  MenuItem,
  Container,
  Grid,
  TextField,
  InputAdornment,
  SvgIcon,
  Button,
  Typography,
  ImageList,
  ImageListItem,
  IconButton
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { styled, useTheme } from '@mui/styles';
import { Search as SearchIcon, ArrowLeft as ArrowIcon, PlusCircle as PlusIcon } from 'react-feather';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import '../../Components/HomeScreen/stylesheet.css';
import logo from '../../Components/HomeScreen/emptyImage.jpeg';
import * as analyticsApi from '../../API/analyticsApi.js';
import * as indexApi from '../../API/index.js';
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
// Google Analytics
import ReactGa from 'react-ga';
import { WorkRounded } from '@mui/icons-material';

const SearchScreen = () => {
  const dispatch = useDispatch();
  const history = useNavigate();

  const [searchValue, setSearchValue] = useState("");
  const [searchField, setSearchField] = useState([]);

  const [loading, setLoading] = React.useState(false);
  const [categoryList, setCategoryList] = React.useState([]);
  const [cIds, setCIds] = React.useState([]);
  const theme = useTheme();
  const [topSearches, setTopSearches] = React.useState([]);

  React.useEffect(() => {
    setLoading(false);
    getCategory();
    retrieveTopSearches();
  }, []);



  const getCategory = async () => {
    try {
      await indexApi.getCategory().then((arr) => setCategoryList(arr.data));
    } catch (error) {
      console.log(error);
      setCategoryList([]);
    } finally {
      setLoading(false);
    }
  }

  const buttonStyle = {
    background: theme.palette.primary.light,
    maxWidth: "100%",
    minWidth: "100%",
    minHeight: "10em",
    maxHeight: "10em",
    borderRadius: '1em',
  };

  const selectedButtonStyle = {
    background: theme.palette.secondary.main,
    color: 'white',
    maxWidth: "100%",
    minWidth: "100%",
    minHeight: "10em",
    maxHeight: "10em",
    display: "block",
    borderRadius: '1em',
  };

  const selectButton = (e, field) => {
    if (searchField.indexOf(field.categoryName) === -1) {
      const newSearchField = Array.from(searchField);
      const categoryId = Array.from(cIds);
      newSearchField.push(field.categoryName);
      categoryId.push(field.id);
      setSearchField(newSearchField);
      setCIds(categoryId);
    } else {
      const newSearchField = Array.from(searchField);
      const categoryId = Array.from(cIds);
      newSearchField.splice(searchField.indexOf(field.categoryName), 1);
      categoryId.splice(cIds.indexOf(field.id), 1);
      setSearchField(newSearchField);
      setCIds(categoryId);
    }
  };

  const submitSearchData = () => {
    console.log("Adding Search Event on GA");
    console.log(searchValue);
    ReactGa.event({
      category: 'Search by Keywords',
      action: searchValue
    })
  }

  const handleClick = () => {

    if (cIds.length > 0 && searchValue !== '') {
      submitSearchData();
      history(`/searchResults/${cIds}/${searchValue}`);

    } else if (cIds.length == 0 && searchValue !== '') { 
      submitSearchData();
      history(`/searchResults/0/${searchValue}`);

    } else {
      history(`/searchResults/${cIds}/`);
    }
  }

  const searchByImage = async (e) => {
    console.log("Searching By Image");
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    axios({
      method: "post",
      url: 'http://127.0.0.1:5000/',
      data: formData,
      headers: { "Content-type": "multipart/form-data" },
    }).then(response => {
      console.log("SUCCESS", response)
      console.log(response.data);
      const list = (response.data).split(" ");
      var newList = [];
      Array.from(categoryList).map((val) => {
        if (list.includes(val.categoryName)) {
          newList.push(val.categoryName);
        }
      })
      setSearchField(newList);;
      setSearchValue(response.data);
    }).catch(error => {
      console.log(error)
    })
  }

  async function retrieveTopSearches() {
    analyticsApi.retrieveTopSearches().then((res) => {
      console.log("top searches");
      console.log(res);
      setTopSearches(res.data);
    })
  }

  const top100Films = [
    'The Shawshank Redemption',
    'The Godfather',
    'The Godfather: Part II',
    'The Dark Knight',
    '12 Angry Men',
    "Schindler's List",
    'Pulp Fiction',
  ]

  return (
    // (!openResultsPage ? (
    <>
      <Helmet>
        <title>Alt.Native</title>
      </Helmet>
      <Box
        sx={{
          minHeight: '100%',
          maxHeight: '100%',
          px: 3,
          py: 3,
          overflow: 'scroll',
          marginBottom: 7,
        }}
      >
        <Container maxWidth={true}>
          <Grid
            container
            spacing={3}
          >
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
            <Grid
              item
              lg={12}
              sm={12}
              xl={12}
              xs={12}
              style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              <div className='homepage_title' style={{ fontWeight: "bold", textAlign: "center" }}>Tell us what you'd like to refashion</div>
            </Grid>
            <Grid item xs={11}>
              <Autocomplete
                freeSolo
                options={topSearches}
                value={searchValue}
                renderInput={(params) =>
                  <TextField
                    {...params}
                    onChange={(event) => setSearchValue(event.target.value)}
                    placeholder="Enter Keywords.."
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <SvgIcon
                            fontSize="small"
                            color="action"
                          >
                            <SearchIcon />
                          </SvgIcon>
                        </InputAdornment>
                      ),
                      endAdornment: null,
                    }}
                  />
                }
              />
            </Grid>
            <Grid item xs='auto'>
              <label htmlFor='file'>
                <input
                  accept="image/*"
                  hidden
                  name="file"
                  id="file"
                  type="file"
                  onChange={searchByImage}
                />
                <Button component="span" style={{ background: '#FB7A56', color: 'white', height: '100%', width: 'auto', marginLeft: '-1.5em', WebkitBorderRadius: ".9vw" }}>
                  <IconButton component="span">
                    <CameraAltIcon />
                  </IconButton>
                </Button>

              </label>
            </Grid>

            {Array.from(categoryList).map((val) => (
              <Grid
                item
                lg={4}
                sm={6}
                xl={4}
                xs={6}>
                <button
                  variant="contained"
                  key={val.id}
                  style={searchField.indexOf(val.categoryName) === -1 ? buttonStyle : selectedButtonStyle}
                  onClick={(e) => selectButton(e, val)}
                >
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    align="center"
                    style={{ textDecoration: "none", maxWidth: "100%", maxHeight: "100%", overflow: "scroll", fontSize: "100%", fontWeight: "bold" }}
                  >
                    {val.categoryName}
                  </Typography>
                </button>
              </Grid>
            ))}
            <Grid
              item
              lg={12}
              sm={12}
              xl={12}
              xs={12}
              style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              {/* <Link to={`/searchResults/${cIds}/${searchValue}`}> */}
              <Button
                onClick={handleClick}
                disabled={searchValue === "" && searchField.length === 0}
                style={(searchValue === "" && searchField.length === 0) ? ({ background: "#CFD1D8", color: " white", fontWeight: "bold", fontSize: "large", padding: "1em 2em", borderRadius: '1em', cursor: 'initial' }) : ({ background: "#FB7A56", color: " white", fontWeight: "bold", fontSize: "large", padding: "1em 2em", borderRadius: '1em' })}
              >
                Let's do it!
              </Button>
              {/* </Link> */}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
    // ) : (
    //   <>
    //     <Helmet>
    //       <title>Alt.Native</title>
    //     </Helmet>
    //     <Box
    //       sx={{
    //         minHeight: '100%',
    //         px: 3,
    //         py: 3
    //       }}
    //     >
    //       <Container maxWidth={false}>
    //         <Grid
    //           container
    //           spacing={3}
    //         >
    //           <Grid
    //             item
    //             lg={12}
    //             sm={12}
    //             xl={12}
    //             xs={12}
    //           >
    //             <SvgIcon
    //               fontSize="large"
    //               color="action"
    //               onClick={() => setOpenResultsPage(false)}
    //             >
    //               <ArrowIcon />
    //             </SvgIcon>
    //           </Grid>
    //           <Grid
    //             item
    //             lg={12}
    //             sm={12}
    //             xl={12}
    //             xs={12}
    //             style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    //           >
    //             <div className='homepage_title' style={{ fontWeight: "bold", }}>Refashion ideas</div>
    //           </Grid>
    //           <Grid
    //             item
    //             lg={12}
    //             sm={12}
    //             xl={12}
    //             xs={12}
    //             style={{ display: "flex", justifyContent: "left", alignItems: "left", flexWrap: 'wrap', overflow: 'scroll' }}
    //           >
    //             {Array.from(searchField).map((item) => (
    //               <Chip
    //                 label={item}
    //                 key={item}
    //                 onDelete={() => handleDelete(item)}
    //                 style={{
    //                   background: "#FB7A56",
    //                   fontWeight: "bold",
    //                   color: "white",
    //                   padding: "2.5vh 1.5vw",
    //                   margin: "0 0.3em 1.5em",
    //                   borderRadius: "3vh",
    //                 }}
    //               >
    //               </Chip>
    //             ))}
    //             <Box style={{ cursor: 'pointer', margin: '0.1em 0.3em' }} onClick={(e) => openMenu(e)}>
    //               <SvgIcon
    //                 fontSize="large"
    //                 color="action"
    //               >
    //                 <PlusIcon />
    //               </SvgIcon>
    //               <Menu
    //                 id="basic-menu"
    //                 open={menuOpen}
    //                 anchorEl={anchorEl}
    //                 keepMounted
    //                 onClose={handleClose}
    //                 MenuListProps={{
    //                   'aria-labelledby': 'basic-button',
    //                 }}
    //               >
    //                 <MenuItem title="Denim" onClick={(e) => processClick(e)}>
    //                   Denim
    //                 </MenuItem>
    //                 <MenuItem title="Dress" onClick={(e) => processClick(e)}>
    //                   Dress
    //                 </MenuItem>
    //                 <MenuItem onClick={(e) => e.preventDefault()} >
    //                   <TextField
    //                     placeholder="Enter Keywords.."
    //                     onChange={(event) => { setSearchValue(event.target.value); }}
    //                   />
    //                 </MenuItem>
    //               </Menu>
    //             </Box>
    //           </Grid>
    //           <Grid item xs={12} style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
    //             {listings !== [] && listings.length > 0 ? (
    //               <ImageList cols={2}>
    //                 {Array.from(listings).map((img, i) => (
    //                   // <Link to={`//${img.id}`}>
    //                   <ImageListItem key={i} style={{ width: '100%', height: '100%', overflow: 'hidden' }} >
    //                     {/* <img src={img.imageList[0].url} loading="lazy" style={{ cursor: 'pointer' }} /> */}
    //                     <img src={logo} loading="lazy" style={{ cursor: 'pointer' }} />
    //                   </ImageListItem>
    //                   // </Link>
    //                 ))}
    //               </ImageList>
    //             ) : (
    //               <Box sx={{ display: 'flex', justifyContent: "center", alignContent: 'center', marginTop: 5 }}>
    //                 <Typography>There is no published listings.</Typography>
    //               </Box>
    //             )
    //             }
    //           </Grid>
    //         </Grid>
    //       </Container>
    //     </Box>
    //   </>
    // )
    // )
  )
}

export default SearchScreen;