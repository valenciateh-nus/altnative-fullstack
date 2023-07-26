import { Box, Button, Card, CardContent, Chip, CircularProgress, Container, FormControl, FormHelperText, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, InputAdornment, Menu, MenuItem, Modal, SvgIcon, TextField, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft as ArrowIcon } from 'react-feather';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import * as marketplaceApi from '../API/marketplaceApi.js';
import * as disputeApi from '../API/disputeApi.js';
import * as orderApi from '../API/orderApi';
import { ERROR } from "../Redux/actionTypes";
import { useDispatch } from 'react-redux';
import { set, sub } from 'date-fns';
import InContainerLoading from '../Components/InContainerLoading';
import CustomButton from '../Components/CustomButton';
import * as MilestoneApi from '../API/milestoneApi'
import { DISPUTE_REQUEST_PENDING_REVIEW } from "../Components/Milestone/MilestoneTypes"
import { apiWrapper } from "../API";

function DisputeRequestScreen(props) {
  const [formData, setFormData] = React.useState({ 'description': '', 'photos': [], 'refundAmount': 0 });
  const [image, setImage] = React.useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState([]);
  const [maxPrice, setMaxPrice] = useState(0);
  const [listing, setListing] = useState([]);
  const [order, setOrder] = useState([]);
  const [deletedImage, setDeletedImage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { id = 0 } = useParams();

  const dispatch = useDispatch();
  console.log(maxPrice);

  useEffect(() => {
    orderApi.getOrderById(id).then((val) => {
      setOrder(val.data);
      setMaxPrice(val.data.orderPrice);
    })
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

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  }

  async function submitDisputeRequest(data, id) {
    console.log('creating new dispute request')
    try {
      setIsLoading(true);
      await disputeApi.createDispute(id, data);
      navigate(-1);
    } catch (error) {
      const data = error?.response?.data?.message
      console.log("ERROR MSG: " + JSON.stringify(error));
      dispatch({ type: ERROR, data })
    } finally {
      setIsLoading(false);
    }
  }

  async function createMilestone(milestone, images) {
    //create new milestone
    console.log('creating new milestone')

    setIsLoading(true);
    const newForm = new FormData();
    milestone = new Blob([JSON.stringify(milestone)], {
      type: "application/json",
    });

    if (images) {
      for (let key of Object.keys(images)) {
        if (key !== 'length') {
          newForm.append('files', images[key]);
        }
      }
    }

    newForm.append("milestone", milestone)
    await apiWrapper(MilestoneApi.createMilestone(newForm,id), "", true);
    setIsLoading(false);
  }

  async function handleCreateDisputeMilestone() {
    let newMilestone = {
      milestoneEnum: DISPUTE_REQUEST_PENDING_REVIEW,
      remarks: formData['description'],
    }

    await createMilestone(newMilestone, null);
  }

  const handleSubmit = async (e) => {
    const newForm = new FormData();
    let reqForm = new Blob([JSON.stringify(formData)], {
      type: "application/json",
    });
    for (let img of image) {
      newForm.append('files', img);
    }
    newForm.append('dispute', reqForm);
    await submitDisputeRequest(newForm, id);
    //handleCreateDisputeMilestone();
  }

  const field = ['description', 'photos', 'refundAmount'];

  const handleImageDelete = (img) => {
    let files = [];
    console.log(img);
    console.log(img.id === undefined);
    if (img.id !== undefined) {
      files = formData['photos'];
      let index = files.findIndex((val) => val === img);
      // console.log(index);
      files.splice(index, 1);
      setFormData({ ...formData, ['photos']: files });
      setListing({ ...listing, ['photos']: files });
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

  const deleteImage = async (mId, imgId) => {
    try {
      await marketplaceApi.deleteImageFromListing(imgId, mId).then((arr) => {
        console.log(arr.data);
      })
    } catch (error) {
      console.log(error);
    }
  }

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
            <Grid item lg={12} xs={12}>
              <SvgIcon
                fontSize="medium"
                color="action"
                sx={{ position: 'absolute', float: 'left', top: 30, left: 20, cursor: 'pointer' }}
                onClick={goBack}
              >
                <ArrowIcon />
              </SvgIcon>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ fontWeight: 650, fontSize: 30 }}>
                Report Order #{id}
              </Typography>
            </Grid>

            <Grid item xs={12} container sx={{ width: '100%' }}>
              <FormControl sx={{ width: '100%' }}>
                <Box>
                  <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                    Reason(s) for dispute
                  </Typography>
                </Box>

                <Box>
                  <TextField
                    id='listing-description'
                    name={field[0]}
                    value={formData[field[0]]}
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
                    Photo(s)
                  </Typography>
                </Box>

                <Box sx={{ overflowX: 'scroll', display: 'flex' }}>
                  <Box sx={{ display: 'flex', marginBottom: 1 }}>
                    <input
                      accept="image/*"
                      hidden
                      id="input-image"
                      type="file"
                      multiple
                      onChange={handleImageInput}
                    />
                    <ImageList >
                      <label htmlFor="input-image">
                        <Box sx={{ width: 150, height: 150, borderRadius: '.2em', background: 'rgb(240, 240, 240)', display: 'flex', justifyContent: 'center', alignContent: 'center', cursor: 'pointer' }}>
                          <SvgIcon
                            fontSize="large"
                            color="action"
                            sx={{ marginTop: '35%' }}
                          >
                            <AddCircleOutlineIcon />
                          </SvgIcon>
                        </Box>
                      </label>
                      {formData['photos'] !== null && formData['photos'].length > 0 &&
                        (
                          Array.from(formData['photos']).map((img, i) => (
                            <ImageListItem key={i} style={{ width: 150, height: 150, overflow: 'hidden', marginLeft: 7 }} >
                              <img src={img.url} alt={img.url} loading="lazy" style={{ cursor: 'pointer' }} />
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
                            <ImageListItem key={i} style={{ width: 150, height: 150, overflow: 'hidden', marginLeft: 7 }} >
                              <img src={URL.createObjectURL(img)} loading="lazy" style={{ cursor: 'pointer' }} />
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
                    Refund Amount (Max: ${order.orderPrice})
                  </Typography>
                </Box>

                <Box>
                  <TextField
                    id='listing-price'
                    name={field[2]}
                    value={formData[field[2]]}
                    onChange={handleChange}
                    fullWidth
                    required
                    autoFocus
                    InputProps={{
                      inputProps: { min: 0, max: order.offerPrice },
                      startAdornment: <InputAdornment position="start">SGD</InputAdornment>
                    }}
                    error={formData[field[2]] > order.orderPrice}
                    helperText={formData[field[2]] > order.orderPrice && 'Refund amount cannot be more than order price'}
                  />
                </Box>

              </FormControl>

              <Grid Item xs={12} sx={{ marginTop: 3 }}>
                <CustomButton
                  variant="contained"
                  color="secondary"
                  onClick={handleSubmit}
                  style={{ color: " white", fontWeight: "bold", fontSize: "small", padding: 1, borderRadius: 15, height: '6em', width: '100%' }}
                  disabled={formData[`${field[0]}`] && (formData[`${field[2]}`] <= order.orderPrice && formData[`${field[2]}`] > 0) ? false : true}
                >
                  Submit
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

export default DisputeRequestScreen;