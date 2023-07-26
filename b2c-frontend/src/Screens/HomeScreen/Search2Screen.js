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
} from '@mui/material';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { styled, useTheme } from '@mui/styles';
import { Search as SearchIcon, ArrowLeft as ArrowIcon, PlusCircle as PlusIcon } from 'react-feather';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import '../../Components/HomeScreen/stylesheet.css';
import logo from '../../Components/HomeScreen/emptyImage.jpeg';
import * as indexApi from '../../API/index.js';

const Search2Screen = () => {
  const [searchValue, setSearchValue] = useState("");
  const [searchField, setSearchField] = useState([]);
  const [openResultsPage, setOpenResultsPage] = useState(false);
  // const [searchValue, setSearchValue] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [listings, setListings] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [categoryList, setCategoryList] = React.useState([]);
  const [cIds, setCIds] = React.useState([]);

  const theme = useTheme();

  useEffect(() => {
    setLoading(false);
    setSearchField([]);
    setSearchValue("");
    setOpenResultsPage(false);
    getCategory();
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

  const search = useSelector((state) => state.selectReducer);
  const dispatch = useDispatch();
  const history = useNavigate();

  const handleSubmit = () => {
    const allFields = searchField.push(searchValue);
  };

  const itemData = ["1", "2", "3", "4", "5", "6", "7", "8"];

  const MyButton = styled(Button)({
    background: '#FFE8BC',
    maxWidth: "100%",
    minWidth: "100%",
    minHeight: "10em",
    maxHeight: "10em",
    display: "block",
    zIndex: '800'
  });

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

  const list = ["Jeans", "T-shirt", "Blouse", "Dress", "Shorts", "Denim"];

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

  const openMenu = (event) => {
    setMenuOpen(!menuOpen);
    setAnchorEl(event.currentTarget);
  };

  const handleDelete = (item) => {
    const newArr = Array.from(searchField);
    const index = newArr.indexOf(item);
    newArr.splice(index, 1);
    setSearchField(newArr);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const processClick = (e) => {
    const newArr = searchField;
    newArr.push(e.target.title);
    setSearchField(newArr);
  };

  const handleSearch = () => {
    if (searchValue != "" && searchValue != null) {
      const newSearchField = Array.from(searchField);
      if (newSearchField.indexOf(searchValue) === -1) {
        newSearchField.push(searchValue);
      }
      setSearchField(newSearchField);
    }
    setOpenResultsPage(true);
    processSearch();
  }

  const processSearch = async () => {
    try {
      await indexApi.getListingsByCategory(cIds.toString()).then((arr) => {
        setListings(arr.data);
      })
    } catch(error) {
      console.log(error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  }

  const handleClick = () => {
    if (cIds.length !== 0 && searchValue !== '') {
      history(`/searchResults2/${cIds}/${searchValue}`);
    } else if (cIds.length === 0 && searchValue !== '') {
      history(`/searchResults2/0/${searchValue}`);
    } else {
      history(`/searchResults2/${cIds}/`);
    }
  }
  console.log(cIds.toString());

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
                <div className='homepage_title' style={{ fontWeight: "bold", textAlign: "center" }}>Tell us what you'd like to make?</div>
              </Grid>
              <Grid
                item
                lg={12}
                sm={12}
                xl={12}
                xs={12}
              >
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    value={searchValue}
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
                    placeholder="Enter Keywords.."
                    onChange={(event) => { setSearchValue(event.target.value); }}
                  />
                </form>
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

export default Search2Screen;