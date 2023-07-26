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
  Modal,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  CircularProgress,
  useMediaQuery,
  Card
} from '@mui/material';
import { useParams } from 'react-router';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { styled } from '@mui/styles';
import { Search as SearchIcon, ArrowLeft as ArrowIcon, PlusCircle as PlusIcon } from 'react-feather';
import { useSelector, useDispatch } from 'react-redux';
import '../../Components/HomeScreen/stylesheet.css';
import logo from '../../Components/HomeScreen/emptyImage.jpeg';
import * as indexApi from '../../API/index.js';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';

const attachments = ['https://media.lovebonito.com/media/catalog/product/l/n/ln0716-031_qzkzn8hacyivry77.jpg?width=960&height=1344',
  'https://media.lovebonito.com/media/catalog/product/l/n/ln0736-031-1_oohpuoyzjegiups3.jpg?width=960&height=1344',
  'https://media.lovebonito.com/media/catalog/product/t/h/th1722-1_8n7xckxhiywbgiai.jpg?width=800&height=1120',
  'https://media.lovebonito.com/media/catalog/product/l/n/ln0979-2_cdovujh2oj0hed6n.jpg?width=800&height=1120',
  'https://media.lovebonito.com/media/catalog/product/l/n/ln0716-031_qzkzn8hacyivry77.jpg?width=960&height=1344',
  'https://media.lovebonito.com/media/catalog/product/l/n/ln0736-031-1_oohpuoyzjegiups3.jpg?width=960&height=1344',
  'https://media.lovebonito.com/media/catalog/product/t/h/th1722-1_8n7xckxhiywbgiai.jpg?width=800&height=1120',
  'https://media.lovebonito.com/media/catalog/product/l/n/ln0979-2_cdovujh2oj0hed6n.jpg?width=800&height=1120']


const SearchResultsScreen = ({ props }) => {
  const [searchValue, setSearchValue] = useState([]);
  const [openResultsPage, setOpenResultsPage] = useState(false);
  // const [searchValue, setSearchValue] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [categoryModal, setCategoryModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState('');
  const [cId, setCId] = useState([]);
  const { id = [] } = useParams();
  const { keyword = '' } = useParams();
  const [keywordSearch, setKeywordSearch] = useState('');
  const notHidden = useMediaQuery(theme => theme.breakpoints.up('md'));

  useEffect(() => {
    setLoading(true);
    console.log('effect');
    getCategoryIds();
    getCategory();
    setKeywordSearch(keyword);
    getResults();
  }, [])

  const getCategoryIds = async () => {
    console.log(id);
    const cIdArray = id.split(',');
    console.log(cIdArray);
    setCId(cIdArray);
    for (const x of cIdArray) {
      const data = await indexApi.getCategoryById(x).then((val) => {
        const name = val.data.categoryName;
        const newArr = searchValue;
        newArr.push(val.data);
        setSearchValue(newArr);
        refreshFilter();
      });
    }
  }

  const refreshFilter = () => {
    const arr = Array.from(searchValue);
    setSearchValue([]);
    setSearchValue(arr);
  }

  const getResults = async () => {
    try {
      if (id[0] != 0 && keyword !== '') {
        await indexApi.getListingsByCategoryAndKeyword(id, keyword).then((arr) => {
          console.log(arr.data);
          setListings(arr.data)
        })
      } else if (id[0] == 0 && keyword !== '') {
        await indexApi.getListingsByKeyword(keyword).then((arr) => setListings(arr.data))
      } else {
        await indexApi.getListingsByCategory(id).then((arr) => setListings(arr.data))
      }
    } catch (error) {
      console.log(error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  }

  const getCategory = async () => {
    await indexApi.getCategory().then((arr) => setCategoryList(arr.data));
  }

  const openMenu = (event) => {
    setMenuOpen(!menuOpen);
    setAnchorEl(event.currentTarget);
  };

  const handleDelete = (item) => {
    const newArr = Array.from(searchValue);
    const index = newArr.indexOf(item);
    console.log(index);
    newArr.splice(index, 1);
    setSearchValue(newArr);
    refreshResults(newArr, keywordSearch);
  };

  const handleDeleteKeyword = (item) => {
    const newKeyword = '';
    setKeywordSearch(newKeyword);
    refreshResults(searchValue, newKeyword);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCategoryAdd = (cat) => {
    const newArr = Array.from(searchValue);
    let found = false;
    for (const x of newArr) {
      if (x.id === cat.id) {
        found = true;
        break;
      }
    }
    if (!found) {
      newArr.push(cat);
      setSearchValue(newArr);
      setLoading(true);
      refreshResults(newArr, keywordSearch);
    }
  }

  function getCIdArray(newArr) {
    let arr = [];
    for (const cat of newArr) {
      arr.push(cat.id);
    }
    return arr;
  }

  const refreshResults = async (newArr, newKeyword) => {
    try {
      const catId = getCIdArray(newArr);
      if (newArr.length > 0 && newKeyword !== '') {
        console.log('add 1');
        await indexApi.getListingsByCategoryAndKeyword(catId, keywordSearch).then((arr) => {
          setListings(arr.data);
        })
      } else if (newArr.length > 0 && newKeyword === '') {
        console.log('add 2');
        await indexApi.getListingsByCategory(catId).then((arr) => {
          setListings(arr.data);
        });
      } else if (newArr.length === 0 && newKeyword !== '') {
        console.log('add 3');
        await indexApi.getListingsByKeyword(newKeyword).then((arr) => {
          setListings(arr.data);
        });
      } else {
        console.log('add 4');
        await indexApi.getAllListings().then((arr) => {
          setListings(arr.data);
        });
      }
    } catch (error) {
      console.log(error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  }

  console.log(listings);

  return (!loading ? (
    <>
      <Helmet>
        <title>Alt.Native</title>
      </Helmet>
      <Box
        sx={{
          minHeight: '100%',
          px: 1,
          py: 3,
        }}
      >
        <Container maxWidth={false}>
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
              <div className='homepage_title' style={{ fontWeight: "bold", }}>I'm looking for...</div>
            </Grid>
            <Grid
              item
              lg={12}
              sm={12}
              xl={12}
              xs={12}
              style={{ display: "flex", justifyContent: "left", alignItems: "left", flexWrap: 'wrap', overflow: 'scroll' }}
            >
              {searchValue.length > 0 && (Array.from(searchValue).map((item) => (
                <Chip
                  label={item.categoryName}
                  key={item.categoryName}
                  onDelete={() => handleDelete(item)}
                  style={{
                    background: "#FB7A56",
                    fontWeight: "bold",
                    color: "white",
                    padding: "2.5vh 1.5vw",
                    margin: "0 0.3em 1.5em",
                    borderRadius: "3vh",
                  }}
                >
                </Chip>
              )))}
              {keywordSearch !== '' &&
                <Chip
                  label={keywordSearch}
                  key={keywordSearch}
                  onDelete={handleDeleteKeyword}
                  style={{
                    background: "#FB7A56",
                    fontWeight: "bold",
                    color: "white",
                    padding: "2.5vh 1.5vw",
                    margin: "0 0.3em 1.5em",
                    borderRadius: "3vh",
                  }}
                >
                </Chip>
              }
              <Box style={{ cursor: 'pointer', margin: '0.1em 0.3em' }} onClick={(e) => openMenu(e)}>
                <SvgIcon
                  fontSize="large"
                  color="action"
                >
                  <PlusIcon />
                </SvgIcon>
                <Menu
                  id="basic-menu"
                  open={menuOpen}
                  anchorEl={anchorEl}
                  keepMounted
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  {Array.from(categoryList).map((cat) => (
                    <MenuItem title={cat.categoryName} key={cat.id} onClick={() => handleCategoryAdd(cat)}>
                      {cat.categoryName}
                    </MenuItem>
                  ))}
                </Menu>
                <Modal
                  open={categoryModal}
                  onClose={() => {
                    setCategoryModal(false)
                    setErrorMsg('')
                  }}
                >
                  <Box style={{ background: 'white', border: '0.1em solid #FB7A56', padding: 20, width: '60%', borderRadius: '1em', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <Typography variant="h7" sx={{ fontWeight: 'bold' }}>
                      Add New Category
                    </Typography>
                    <Box sx={{ marginTop: 1 }}>
                      <TextField autoFocus variant="outlined" fullWidth id='new-category' name='category' color="secondary" label='new Category' value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                      <Typography variant="body2" sx={{ color: 'red' }}>
                        {errorMsg}
                      </Typography>
                      <Button variant="contained" onClick={handleCategoryAdd} sx={{ margin: 1, float: 'right' }}>
                        Add
                      </Button>
                    </Box>
                  </Box>
                </Modal>
              </Box>
            </Grid>

            <Grid item xs={12} style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
              {listings !== [] && listings.length ? (
                (notHidden ? (
                  <ImageList cols={3} gap={20}>
                    {Array.from(listings).map((list) => (
                      <Box>
                        <Card sx={{ mb: 1, position: 'relative' }}>
                          <Link to={`/listing/${list.id}`}>
                            <ImageListItem key={list.id} style={{ minHeight: 320, maxHeight: 320, maxWidth: 320, minWidth: 320, overflow: 'hidden' }} >
                              {Array.from(list.imageList).slice(0, 1).map((val) => (
                                <img src={val.url} loading="lazy" style={{ cursor: 'pointer' }} />
                              ))}
                              {/* <ImageListItemBar
                              title={list.title}
                              subtitle={list.refashioner.username}
                              sx={{ background: 'rgba(180, 180, 180, 0.5)', height: '34%' }}
                            /> */}
                            </ImageListItem>
                          </Link>
                        </Card>
                        <Typography fontWeight={600} fontSize={18} sx={{ ml: 2 }} align="center">
                          {list.title}
                        </Typography>
                        <Typography align="center">
                          <Typography fontWeight={400} sx={{ ml: 2 }} align="center" display="inline" >
                            <SvgIcon
                              fontSize="small"
                              color="action"
                            >
                              <AccessTimeIcon />
                            </SvgIcon>{list.timeToCompleteInDays} days
                          </Typography>
                          <Typography fontWeight={400} sx={{ ml: 2 }} display="inline" align="center">
                            <SvgIcon
                              fontSize="small"
                              color="action"
                            >
                              <PaidOutlinedIcon />
                            </SvgIcon>
                            SGD {list.price != Math.round(list.price) ? Number(list.price).toFixed(2) : list.price}

                          </Typography>
                        </Typography>
                        {/* <Typography fontWeight={400} sx={{ ml: 2}} align="center">
                      {list.refashioner.username}
                      </Typography> */}
                      </Box>
                    ))}
                  </ImageList>
                ) : (
                  <ImageList cols={2} gap={10}>
                    {Array.from(listings).map((list) => (
                      <Box>
                        <Card sx={{ mb: 1, position: 'relative' }}>
                          <Link to={`/listing/${list.id}`}>
                            {console.log(list)}
                            <ImageListItem key={list.id} style={{ minHeight: '38vw', maxHeight: '38vw', maxWidth: '38vw', minWidth: '38vw', overflow: 'hidden' }} >
                              {Array.from(list.imageList).slice(0, 1).map((val) => (
                                <img src={val.url} loading="lazy" style={{ height: 140, cursor: 'pointer', objectFit: 'cover' }} />
                              ))}
                              {/* <ImageListItemBar
                                title={list.title}
                                subtitle={list.refashioner.username}
                                sx={{ background: 'rgba(180, 180, 180, 0.5)', height: '34%' }}
                              /> */}
                            </ImageListItem>
                          </Link>
                        </Card>
                        <Typography fontWeight={600} fontSize={16} sx={{ ml: 2 }} align="center">
                          {list.title}
                        </Typography>
                        <Typography align="center">
                          <Typography fontWeight={400} sx={{ ml: 0.5 }} fontSize={14} align="center" display="inline" >
                            <SvgIcon
                              fontSize="small"
                              color="action"
                            >
                              <AccessTimeIcon />
                            </SvgIcon>
                            {list.timeToCompleteInDays} days
                            {/*                           
                          <SvgIcon
                            fontSize="small"
                            color="action"
                          >
                            <PaidOutlinedIcon />
                          </SvgIcon>
                          SGD{list.price} */}
                          </Typography>
                          <Typography fontWeight={400} sx={{ ml: 0.5 }} fontSize={14} display="inline" align="center">
                            <SvgIcon
                              fontSize="small"
                              color="action"
                            >
                              <PaidOutlinedIcon />
                            </SvgIcon>
                            SGD {list.price != Math.round(list.price) ? Number(list.price).toFixed(2) : list.price}
                          </Typography>
                        </Typography>
                      </Box>

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
    </>
  ) : (
    <Box sx={{ display: 'flex', flexGrow: 1, height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <CircularProgress color='secondary' sx={{ marginBottom: 2 }} />
      <Typography>Loading...</Typography>
    </Box>
  )
  );
};

export default SearchResultsScreen;