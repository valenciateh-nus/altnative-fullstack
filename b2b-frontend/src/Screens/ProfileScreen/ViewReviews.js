import React, { useState } from 'react'
import { Container, Box, Typography, Grid, Rating, Button, Card, IconButton, Menu, MenuItem, Modal, TextField, SvgIcon, Divider } from '@mui/material'
import { makeStyles } from "@mui/styles";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// API
import { useDispatch, useSelector } from 'react-redux';
import { ERROR } from "../../Redux/actionTypes";
import * as UserAPI from '../../API/userApi';
import { showFeedback } from '../../Redux/actions';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router';
import { getTreeViewUtilityClass } from '@mui/lab';
import SetupForm from '../../Components/Stripe/SetupForm';
import InContainerLoading from '../../Components/InContainerLoading';

const useStyles = makeStyles((theme) => ({
  review: {
    width: '100%',
    padding: '20px',
    marginBottom: '5vh',
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

  const styles = useStyles();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currUserData);
  // const user = props.profile;
  // const reviews = props.reviews;
  const navigate = useNavigate();
  const { id = 0 } = useParams();

  // Creating New Review
  const [selectedReview, setSelectedReview] = React.useState(null);
  const [openReviewModal, setOpenReviewModal] = React.useState(false);
  const [user, setUser] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  // Constants for Menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  React.useEffect(() => {
    setLoading(true);
    getUser();
    getReviews();
  }, [])

  async function getUser() {
    try {
      if (id == 0) {
        await UserAPI.getUserById(currentUser.id).then((val) => {
          setUser(val.data);
        })
      } else {
        await UserAPI.getUserById(id).then((val) => {
          setUser(val.data);
        })
      }
    } catch (error) {
      setUser([]);
    }
  }

  async function getReviews() {
    try {
      await UserAPI.retrieveReviewsByUserId(id).then((val) => {
        setReviews(val.data);
      })
    } catch (error) {
      setReviews([]);
    } finally {
      setLoading(false);
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

  return (!loading ? (
    <Container>
      <SvgIcon
        fontSize="large"
        color="action"
        onClick={() => navigate(-1)}
        sx={{ cursor: 'pointer' }}
      >
        <ArrowBackIcon />
      </SvgIcon>
      <Box sx={{ mt: 2, mb: 5 }}>
        <Typography variant='h5' fontWeight={600}>Reviews</Typography>
        <Divider orientation="row" />
        {reviews.length > 0 ?
          (// When there are reviews
            Array.from(reviews).map((review) =>
              <Card className={styles.review}>
                <Grid justifyContent="space-between" container spacing={1}>
                  <Grid item xs={9}>
                    <Typography><AccountCircleIcon fontSize='large' /> {review.owner.name}</Typography>
                  </Grid>
                  <Grid item xs='auto'>
                    {(currentUser.roles.includes("ADMIN")) &&
                      <IconButton onClick={(e) => { handleClick(e, review) }}>
                        <MoreVertIcon />
                      </IconButton>
                    }
                  </Grid>

                  <Grid item xs={12}>
                    <Rating value={review.reviewRating} readOnly /> {review.reviewRating}/5
                    <Typography>{getDifferencesInDays(new Date(review.dateCreated))}</Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography>{review.description}</Typography>
                  </Grid>
                </Grid>
              </Card>
            )) :
          ( // When No Reviews
            <Box sx={{ height: '100%', display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center', mt: 25}}>
              <Button
                variant="contained"
                disabled={true}
                sx={{ ":disabled": { color: 'white', backgroundColor: 'secondary.main' } }}
              >
                No reviews
              </Button>
            </Box>
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

    </Container>
  ) : (
    <InContainerLoading />
  )
  )
}
