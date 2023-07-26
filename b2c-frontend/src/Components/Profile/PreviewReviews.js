import React from 'react'
import { Container, Box, Typography, Grid, Rating, Button, Card, IconButton, Menu, MenuItem, Modal, TextField, List, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material'
import { makeStyles } from "@mui/styles";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ReviewsOutlinedIcon from '@mui/icons-material/ReviewsOutlined';

// API
import { useDispatch, useSelector } from 'react-redux';
import { ERROR } from "../../Redux/actionTypes";
import * as UserAPI from '../../API/userApi';
import { showFeedback } from '../../Redux/actions';
import { useNavigate } from 'react-router';

const useStyles = makeStyles((theme) => ({
  review: {
    width: '100%',
    padding: '20px',
    marginBottom: 3,
    ml: 1 
  },
  modalBox: {
    width: '60%',
    minHeight: '18em',
    background: '#FFFAF0',
    padding: "2em",
    borderRadius: '1em',
    border: '0.1em solid #FB7A56',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }
}));


export default function ViewReviews(props) {
  const navigate = useNavigate();
  const styles = useStyles();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currUserData);
  const user = props.profile;
  const reviews = props.reviews;
  // Creating New Review
  const initForm = { reviewRating: 3, description: '', appUser: user, owner: currentUser };
  const [reviewForm, setReviewForm] = React.useState(initForm);

  const [selectedReview, setSelectedReview] = React.useState(null);
  const [openReviewModal, setOpenReviewModal] = React.useState(false);
  // Constants for Menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleFormChange = (e) => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value })
  };

  const reviewDummy = [{
    id: 1, 
    reviewRating: 4,
    dateCreated: new Date(),
    description: "Very Efficient Refashioner!",
    owner: currentUser,
  }]

  const handleSubmit = async () => {
    console.log("submitting review");
    console.log(reviewForm);
    // Insert the API to create new review
    await createReview(reviewForm);
    setOpenReviewModal(false);
    //alert("New Review Created")
  };

  async function createReview(newReview) {
    console.log('Creating new Review...');
    try {
      const { data } = await UserAPI.createReview(newReview);
      console.log("DATA: " + JSON.stringify(data));
    } catch (error) {
      const data = error?.response?.data?.message
      console.log("ERROR MSG: " + JSON.stringify(error));
      dispatch({ type: ERROR, data })
    }
  }


  const handleDeleteReview = async () => {

    // Insert the API to delete review
    await deleteReview(selectedReview);
    dispatch(showFeedback("Review Deleted: " + selectedReview.id));

    handleClose();
  }

  async function deleteReview(review) {
    console.log('Deleting review...');
    try {
      const { data } = await UserAPI.deleteReview(review.id);
      console.log("DATA: " + JSON.stringify(data));
    } catch (error) {
      const data = error?.response?.data?.message
      console.log("ERROR MSG: " + JSON.stringify(error));
      dispatch({ type: ERROR, data })
    }

  }

  const handleClick = (event, review) => {
    setAnchorEl(event.currentTarget);

    console.log("Selected review is: " + review.id);
    setSelectedReview(review);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setSelectedReview(null);
  };

  function getDifferencesInDays(reviewDate) {
    const today = new Date();
    const differencesInDays = (today.getTime() - reviewDate.getTime()) / (1000 * 3600 * 24);
    const days = Math.floor(differencesInDays);
    const hours = Math.floor((differencesInDays - days) * 24);
    const minutes = Math.floor((((differencesInDays - days) * 24) - hours) * 60);
    return <Typography variant='text'>{days}d {hours}h {minutes}m ago</Typography>;
  }

  return (
    <Container>
      <Box sx={{ mt: 0, mb: 2 }}>
        {reviews ?
          <>
            {// When there are reviews
              Array.from(reviews).slice(0.2).map((review) =>
                <Card className={styles.review}>
                  <Grid justifyContent="space-between" container spacing={1}>
                    <Grid item xs={10} sx={{ display: "flex"}}>
                      <Typography><AccountCircleIcon fontSize='large' /> {review.owner.name}</Typography>
                      <Rating value={review.reviewRating} readOnly sx={{ ml: 2, mt: 0.5 }} /> 
                      <Typography sx={{ mt: 0.5, ml: 0.5 }}> {review.reviewRating}/5 </Typography>
                    </Grid>
                    <Grid item xs='auto'>
                      {(currentUser.roles.includes("ADMIN")) &&
                        <IconButton onClick={(e) => { handleClick(e, review) }}>
                          <MoreVertIcon />
                        </IconButton>
                      }
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle2">{getDifferencesInDays(new Date(review.dateCreated))}</Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography>{review.description}</Typography>
                    </Grid>
                  </Grid>
                </Card>
              )}
            <List>
              <Divider orientation='horizontal' />
              <ListItemButton onClick={() => navigate(`/viewReviews/${user.id}`)}>
                <ListItemText primaryTypographyProps={{ sx: { fontSize: '1em', fontWeight: 450 } }}>
                  View all reviews
                </ListItemText>
                <ListItemIcon sx={{ minWidth: 0 }}>
                  <ArrowForwardIosOutlinedIcon />
                </ListItemIcon>
              </ListItemButton>
              <Divider orientation='horizontal' />
            </List>
          </> :
          ( // When No Reviews
            <>
              <Box sx={{ marginTop: '10px' }}>
                <Typography variant='subtitle1' sx={{ ml: 1 }}>No Reviews Found</Typography>
              </Box>
            </>
          )
        }
        {/* {currentUser.id !== user.id && // If page is own userprofile don't show ability to write reviews
                <Button
                    variant='contained'
                    fullWidth
                    onClick={() => setOpenReviewModal(true)}
                    size='large'
                    sx={{ textTransform: 'none', marginTop: '10px', marginBottom: '10px' }}
                >
                    <Typography>Write A Review</Typography>
                </Button>
                } */}
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Edit Review</MenuItem>
        <MenuItem onClick={handleDeleteReview}>Delete Review</MenuItem>
      </Menu>
      <Modal
        open={openReviewModal}
        onClose={() => setOpenReviewModal(false)}
      >
        <Box className={styles.modalBox}>
          <Typography variant='h5'>Create Review</Typography>
          <form>
            <Rating
              name="reviewRating"
              value={reviewForm.reviewRating}
              onChange={handleFormChange}
            />
            <TextField
              fullWidth
              label="Review Descripton"
              multiline
              name="description"
              value={reviewForm.description}
              onChange={handleFormChange}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenReviewModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Create Review
            </Button>

          </form>
        </Box>
      </Modal>

    </Container>
  )
}
