import { Box, Button, Card, CardContent, Chip, CircularProgress, Container, FormControl, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, InputAdornment, Menu, MenuItem, Modal, SvgIcon, TextField, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft as ArrowIcon } from 'react-feather';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import * as marketplaceApi from '../API/marketplaceApi.js';
import * as indexApi from '../API/index.js';
import { ERROR } from "../Redux/actionTypes";
import { useDispatch } from 'react-redux';
import { set } from 'date-fns';
import InContainerLoading from '../Components/InContainerLoading';
import CustomButton from '../Components/CustomButton';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { apiWrapper } from "../API";
import { showFeedback } from '../Redux/actions';

function CreateRequest(props) {
  const [categoryList, setCategoryList] = useState([]);
  const [formData, setFormData] = React.useState({ 'title': '', 'description': '', 'category': [], 'price': '', 'imageList': [], 'minimum': '', 'proposedCompletionDate': null, 'quantity': ''});
  const [image, setImage] = React.useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchValue, setSearchValue] = useState([]);
  const [categoryModal, setCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [listing, setListing] = useState([]);
  const [deletedImage, setDeletedImage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { id = 0 } = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    indexApi.getCategory().then((arr) => setCategoryList(arr.data));
    if (id !== 0) {
      indexApi.getRequestsById(id).then((val) => {
        setListing(val.data);
        setFormData({
          ...formData,
          ['title']: val.data.title,
          ['description']: val.data.description,
          ['category']: val.data.category,
          ['price']: val.data.price,
          ['imageList']: val.data.imageList,
          ['proposedCompletionDate']: val.data.proposedCompletionDate,
          ['minimum']: val.data.minimum,
          ['quantity']: val.data.quantity,
        })
        // setImage(val.data.imageList);
      });
      console.log(listing);
    }
  }, [])
  
  const handleImageInput = (e) => {
    if (e.target.files[0]) {
      // let newFile = URL.createObjectURL(e.target.files[0]);
      let files = Array.from(image);
      files.push(e.target.files[0]);
      setImage(files);
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (id !== 0) {
      setListing({ ...listing, [e.target.name]: e.target.value })
    }
  };

  const openMenu = (event) => {
    setMenuOpen(!menuOpen);
    setAnchorEl(event.currentTarget);
  };

  const handleDelete = (item) => {
    const newArr = Array.from(searchValue);
    const index = newArr.indexOf(item);
    newArr.splice(index, 1);
    setSearchValue(newArr);
  };

  const handleCategoryAdd = (cat) => {
    setFormData({ ...formData, ['category']: cat })
    setListing({ ...listing, ['category']: cat })
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  const processClick = (e) => {
    const newArr = searchValue;
    newArr.push(e.target.title);
    setSearchValue(newArr);
  };

  const handleDateChange = (e) => {
    console.log(e);
    if (id === 0) {
      setFormData({ ...formData, ['proposedCompletionDate']: e });
    } else {
      setListing({ ...listing, ['proposedCompletionDate']: e });
      setFormData({ ...formData, ['proposedCompletionDate']: e });
    }
  }

  const navigate = useNavigate();

  async function createProjectRequest(formData, cId) {
    console.log('creating new listing')
    try {
      setIsLoading(true);
      const res = await apiWrapper(indexApi.createRequest(formData, cId), "", true);
      if (res) {
        setIsLoading(false);
        dispatch(showFeedback('Project Request Created'));
        setTimeout(function () {
          navigate(`/request/${res.data.id}`);
        }, 1000);
    } else {
        setIsLoading(false);
    }
    } catch (error) {
      const data = error?.response?.data?.message
      console.log("ERROR MSG: " + JSON.stringify(error));
      dispatch({ type: ERROR, data })
    }
  }

  async function createDraftRequest(formData, cId) {
    console.log('creating draft listing')
    try {
      setIsLoading(true);
      const res = await apiWrapper(indexApi.createDraftRequest(cId, formData), "", true);
      if (res) {
        setIsLoading(false);
        dispatch(showFeedback('Project Request Draft Created'));
        setTimeout(function () {
          navigate(`/request/${res.data.id}`);
        }, 1000);
    } else {
        setIsLoading(false);
    }
    } catch (error) {
      const data = error?.response?.data?.message
      console.log("ERROR MSG: " + JSON.stringify(error));
      dispatch({ type: ERROR, data })
    }
  }

  async function updateProjectRequest(listing, id) {
    console.log('update proj listing')
    try {
      setIsLoading(true);
      const res = await apiWrapper(indexApi.updateProjectRequest(listing, id), "", true);
      if (res) {
        setIsLoading(false);
        dispatch(showFeedback('Project Request Updated'));
        setTimeout(function () {
          navigate(`/request/${id}`);
        }, 1000);
    } else {
        setIsLoading(false);
    }
    } catch (error) {
      const data = error?.response?.data?.message
      console.log("ERROR MSG: " + JSON.stringify(error));
      dispatch({ type: ERROR, data })
    }
  }

  async function updateDraftRequest(listing, id) {
    console.log('update draft listing')
    try {
      setIsLoading(true);
      const res = await indexApi.apiWrapper(indexApi.updateDraftRequest(id, listing), "", true);
      if (res) {
        setIsLoading(false);
        dispatch(showFeedback('Draft Updated'));
        setTimeout(function () {
          navigate(`/request/${id}`);
        }, 1000);
    } else {
        setIsLoading(false);
    }
    } catch (error) {
      const data = error?.response?.data?.message
      console.log("ERROR MSG: " + JSON.stringify(error));
      dispatch({ type: ERROR, data })
    }
  }

  async function submitProjectRequest(formData, pId) {
    console.log('creating new listing')
    try {
      setIsLoading(true);
      const res = await apiWrapper(indexApi.submitRequest(formData, pId), "", true);
      if (res) {
        setIsLoading(false);
        dispatch(showFeedback('Project Request Created'));
        setTimeout(function () {
          navigate(`/request/${id}`);
        }, 1000);
    } else {
        setIsLoading(false);
    }
    } catch (error) {
      const data = error?.response?.data?.message
      console.log("ERROR MSG: " + JSON.stringify(error));
      dispatch({ type: ERROR, data })
    }
  }

  const handleSubmit = async (e) => {
    console.log(id);
    if (id !== 0) {
      if (listing['requestStatus'] === 'DRAFT') {
        console.log("publishing draft listing");
        let updatedRequest = listing;
  
        const newFormData = new FormData();
        let reqForm = new Blob([JSON.stringify(updatedRequest)], {
          type: "application/json",
        });
  
        for (let img of deletedImage) {
          await deleteImage(id, img.id);
        }
  
        if (image.length > 0) {
          console.log(image);
          for (let img of image) {
            console.log(img);
            let imageData = new FormData();
            imageData.append('file', img);
            await indexApi.addImageToRequest(id, imageData);
          }
        }
  
        newFormData.append('projectRequest', reqForm);
        // console.log(formData);
        // setListing(listing);
        // console.log(updatedRequest);
        await submitProjectRequest(newFormData, listing.id);
  
      } else {
        console.log("updating listing");
        console.log(listing);
        let updatedRequest = listing;
  
        for (let img of deletedImage) {
          await deleteImage(id, img.id);
        }
  
        const newFormData = new FormData();
        let reqForm = new Blob([JSON.stringify(formData)], {
          type: "application/json",
        });
        for (let img of image) {
          newFormData.append('files', img);
        }
        newFormData.append('projectRequest', reqForm);
  
        // updatedRequest.imageList = images;
        setListing(listing);
        await updateProjectRequest(newFormData, id);
      }
    } else {
      console.log("publishing listing");

      const newFormData = new FormData();
      let reqForm = new Blob([JSON.stringify(formData)], {
        type: "application/json",
      });

      for (let img of image) {
        newFormData.append('files', img);
      }

      newFormData.append('projectRequest', reqForm);
      await createProjectRequest(newFormData, formData['category'].id);
    }
  }

  const handleDraftSubmit = async (e) => {
    setFormData(formData);
    if (id !== 0) {
      console.log("updating draft listing");
      let updatedRequest = listing;

      const newFormData = new FormData();
      let reqForm = new Blob([JSON.stringify(updatedRequest)], {
        type: "application/json",
      });

      if (image.length > 0) {
        console.log(image);
        for (let img of image) {
          console.log(img);
          let imageData = new FormData();
          imageData.append('file', img);
          await indexApi.addImageToRequest(id, imageData);
        }
      }

      for (let img of deletedImage) {
        await deleteImage(id, img.id);
      }

      newFormData.append('projectRequest', reqForm);
      await updateDraftRequest(newFormData, id);

    } else {
      console.log("create draft listing");
      const newFormData = new FormData();
      let reqForm = new Blob([JSON.stringify(formData)], {
        type: "application/json",
      });
      for (let img of image) {
        newFormData.append('files', img);
      }
      newFormData.append('projectRequest', reqForm);
      console.log(newFormData);
      await createDraftRequest(newFormData, formData['category'].id);
    }
  }

  const field = ['title', 'description', 'category', 'price', 'imageList', 'minimum', 'proposedCompletionDate', 'quantity'];

  const handleImageDelete = (img) => {
    let files = [];
    console.log(img);
    console.log(img.id === undefined);
    if (img.id !== undefined) {
      files = formData['imageList'];
      let index = files.findIndex((val) => val === img);
      console.log(index);
      files.splice(index, 1);
      setFormData({ ...formData, ['imageList']: files });
      setListing({ ...listing, ['imageList']: files });
      let deleted = deletedImage;
      deleted.push(img);
      setDeletedImage(deletedImage);
    } else {
      files = Array.from(image)
      let index = files.findIndex((val) => val === img);
      console.log(index);
      files.splice(index, 1);
      setImage(files);
      console.log(files);
    }
  }

  const deleteImage = async (pId, imgId) => {
    try {
      await indexApi.deleteImageFromRequest(pId, imgId).then((arr) => {
        console.log(arr.data);
      })
    } catch (error) {
      console.log(error);
    }
  }

  const handleCategoryDelete = (item) => {
    const newArr = Array.from(formData[field[2]]);
    const index = newArr.indexOf(item);
    newArr.splice(index, 1);
    setFormData({ ...formData, 'category': newArr })
  };

  return (
    <>
      <Box
        sx={{
          minHeight: '100%',
          px: 0,
          py: 3,
          paddingTop: 5,
          marginLeft: 0,
          marginRight: 0,
        }}
      >
        <Container maxWidth={false}>
          <Grid
            container
            spacing={3}
          >
            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                Create Business Request
              </Typography>
            </Grid>

            <Grid item xs={12} container sx={{ width: '100%' }}>
              <FormControl sx={{ width: '100%' }}>
                <Box>
                  <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                    Photo
                  </Typography>
                </Box>

                <Box >
                  <Box sx={{ display: 'flex', marginBottom: 1, overflowX: 'scroll', width: '100%'}}>
                    <input
                      accept="image/*"
                      hidden
                      id="input-image"
                      type="file"
                      multiple
                      onChange={handleImageInput}
                    />
                    <label htmlFor="input-image">
                      <Box sx={{ maxWidth: 150, maxHeight: 150, minWidth: 150, minHeight: 150, borderRadius: '.2em', background: 'rgb(240, 240, 240)', display: 'flex', justifyContent: 'center', alignContent: 'center', cursor: 'pointer' }}>
                        <SvgIcon
                          fontSize="large"
                          color="action"
                          sx={{ marginTop: '35%' }}
                        >
                          <AddCircleOutlineIcon />
                        </SvgIcon>
                      </Box>
                    </label>
                    <ImageList sx={{ overflow: "scroll", overflowX: 'scroll', display: 'flex', mt: 0 }}>
                      {formData['imageList'] !== null && formData['imageList'].length > 0 &&
                        (
                          Array.from(formData['imageList']).map((img, i) => (
                            <ImageListItem key={i} style={{ maxWidth: 150, maxHeight: 150, minWidth: 150, minHeight: 150, overflow: 'hidden', marginLeft: 7 }} >
                              <img src={img.url} alt={img.url} loading="lazy" style={{ cursor: 'pointer', display: "flex" }} />
                              <ImageListItemBar position="top" sx={{ background: 'none', color: 'black' }}
                                actionIcon={
                                  <IconButton onClick={() => handleImageDelete(img)}>
                                    <CancelIcon />
                                  </IconButton>
                                } />
                            </ImageListItem>
                          ))
                        )
                      }
                      {image !== null && image.length > 0 &&
                        (
                          Array.from(image).map((img, i) => (
                            <ImageListItem key={i} style={{ maxWidth: 150, maxHeight: 150, minWidth: 150, minHeight: 150, overflow: 'hidden', marginLeft: 7 }} >
                              <img src={URL.createObjectURL(img)} loading="lazy" style={{ cursor: 'pointer' }} />
                              {/* <img src={URL.createObjectURL(img)} loading="lazy" style={{ cursor: 'pointer' }} /> */}
                              <ImageListItemBar position="top" sx={{ background: 'none', color: 'black' }}
                                actionIcon={
                                  <IconButton onClick={() => handleImageDelete(img)}>
                                    <CancelIcon />
                                  </IconButton>
                                } />
                            </ImageListItem>
                          ))
                        )
                      }
                    </ImageList>
                  </Box>
                </Box>

                <Box sx={{ marginTop: 3 }}>
                  <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                    Listing Title
                  </Typography>
                </Box>

                <Box>
                  <TextField
                    id='listing-title'
                    name={field[0]}
                    value={formData[field[0]]}
                    onChange={handleChange}
                    fullWidth
                    required
                    autoFocus
                  />
                </Box>

                <Box sx={{ marginTop: 3 }}>
                  <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                    Description
                  </Typography>
                </Box>

                <Box>
                  <TextField
                    id='listing-description'
                    name={field[1]}
                    value={formData[field[1]]}
                    onChange={handleChange}
                    fullWidth
                    required
                    autoFocus
                    multiline
                    rows={5}
                  />
                </Box>


                <Box sx={{ marginTop: 3 }}>
                  <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                    Category
                  </Typography>
                </Box>

                <Box sx={{ width: '100%', display: 'flex' }}>
                  {/* {Array.from(formData[field[2]]).map((item) => ( */}
                  {formData[field[2]].categoryName && <Chip
                    label={formData[field[2]].categoryName}
                    key={formData[field[2]].categoryName}
                    onDelete={() => handleCategoryDelete(formData[field[2]])}
                    style={{
                      background: "#FB7A56",
                      fontWeight: "bold",
                      color: "white",
                      padding: "2.5vh 1.5vw",
                      margin: "0.5em 0.3em 0",
                      borderRadius: "3vh",
                    }}
                  />}
                  {/* // ))} */}
                  {!formData[field[2]].categoryName && <Box onClick={(e) => openMenu(e)}>
                    <SvgIcon
                      fontSize="large"
                      color="action"
                      sx={{ color: '#FB7A56', margin: '0.2em 0' }}
                    >
                      <AddCircleOutlineIcon />
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
                        <MenuItem id={cat.id} key={cat.id} value={cat.categoryName} onClick={() => handleCategoryAdd(cat)}>{cat.categoryName}</MenuItem>
                      ))}
                    </Menu>
                  </Box>}
                </Box>

                <Box sx={{ marginTop: 3 }}>
                  <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                    Quantity needed
                  </Typography>
                </Box>

                <Box>
                  <TextField
                    id='listing-quantity'
                    name={field[7]}
                    value={formData[field[7]]}
                    onChange={handleChange}
                    fullWidth
                    required
                    autoFocus
                    type="number"
                    error={Number(formData[field[5]]) > Number(formData[field[7]]) || Number(formData[field[7]]) < 0}
                    helperText = { (Number(formData[field[5]]) > Number(formData[field[7]])) ? 'Minimum quantity cannot exceed total quantity' : (Number(formData[field[7]]) < 0 && 'Quantity cannot be less than 0')}
                    InputProps={{
                      inputProps: { min: 0 },
                    }}
                  />
                </Box>

                <Box sx={{ marginTop: 3 }}>
                  <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                    Minimum Quantity per Refashion Project
                  </Typography>
                </Box>

                <Box>
                  <TextField
                    id='listing-minimum-quantity'
                    name={field[5]}
                    value={formData[field[5]]}
                    onChange={handleChange}
                    fullWidth
                    required
                    autoFocus
                    error={Number(formData[field[5]]) > Number(formData[field[7]]) || Number(formData[field[5]]) < 0}
                    helperText = { (Number(formData[field[5]]) > Number(formData[field[7]])) ? 'Minimum quantity cannot exceed total quantity' : (Number(formData[field[7]]) < 0 && 'Minimum Quantity cannot be less than 0')}
                    type="number"
                    InputProps={{
                      inputProps: { min: 0 },
                    }}
                  />
                </Box>

                <Box sx={{ marginTop: 3 }}>
                  <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                    Proposed Completion Date
                  </Typography>
                </Box>

                {/* <Box>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      className="datepicker"
                      format="dd/MM/yyyy"
                      name={field[6]}
                      id={field[6]}
                      value={formData[field[6]]}
                      clearable
                      minDate={new Date()}
                      onChange={handleDateChange}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                      sx={{ marginBottom: 2, width: '100%' }}
                    />
                  </LocalizationProvider>
                </Box> */}

                <Box>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  className="datepicker"
                  format="dd/MM/yyyy"
                  name={field[6]}
                  id={field[6]}
                  value={formData[field[6]]}
                  clearable
                  minDate={new Date()}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  sx={{ marginBottom: 2, width: '100%' }}
                />
              </LocalizationProvider>
                </Box>

                <Box sx={{ marginTop: 3 }}>
                  <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                    Price / pc
                  </Typography>
                </Box>

                <Box>
                  <TextField
                    id='listing-price'
                    name={field[3]}
                    value={formData[field[3]]}
                    onChange={handleChange}
                    fullWidth
                    required
                    autoFocus
                    type="number"
                    error={Number(formData[field[3]]) < 0}
                    helperText = { (Number(formData[field[3]]) < 0 && 'Price cannot be less than 0')}
                    InputProps={{
                      inputProps: { min: 0 },
                      startAdornment: <InputAdornment position="start">SGD</InputAdornment>
                    }}
                  />
                </Box>

              </FormControl>
              <Grid Item xs={6} sx={{ marginTop: 3 }}>
                <CustomButton
                  onClick={handleDraftSubmit}
                  variant='contained'
                  color="secondary"
                  disabled={id !== 0 && listing.marketplaceListingStatus === 'PUBLISHED'}
                  style={{ color: " white", fontWeight: "bold", fontSize: "small", padding: "1em 2em", borderRadius: '1em', height: '6em', width: '95%' }}
                >
                  Save for later
                </CustomButton>
              </Grid>
              <Grid Item xs={6} sx={{ marginTop: 3 }}>
                <CustomButton
                  variant="contained"
                  color="secondary"
                  onClick={handleSubmit}
                  style={{ color: " white", fontWeight: "bold", fontSize: "small", padding: "1em 2em", borderRadius: '1em', height: '6em', width: '95%' }}
                  disabled={formData[`${field[0]}`] && formData[`${field[1]}`] && formData[`${field[2]}`] && Number(formData[`${field[3]}`]) > 0 && (formData['imageList'].length > 0 || image.length > 0) && Number(formData[`${field[5]}`]) > 0 && (formData[`${field[6]}`] !== '') && (Number(formData[`${field[7]}`]) > 0) && categoryList.length > 0 ? false : true}
                >
                  {id !== 0 && listing.marketplaceListingStatus === 'PUBLISHED' ? 'Save' : 'Publish now'}
                </CustomButton>
              </Grid>
            </Grid>

          </Grid>
        </Container>
      </Box>
      <Modal open={isLoading} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card sx={{ height: 200, width: 200 }}>
          <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', margin: 2 }}>
            <Box sx={{ display: 'flex', flexGrow: 1, height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
              <CircularProgress color='secondary' sx={{ marginTop: 5 }} />
              <Typography>Loading...</Typography>
            </Box>
          </CardContent>
        </Card>
      </Modal>
    </>
  );
};

export default CreateRequest;