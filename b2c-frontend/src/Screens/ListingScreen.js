import { Box, Chip, Container, Grid, Typography, Rating, Divider, Modal, IconButton, Button, Card, CardActionArea, Menu, MenuItem, DialogTitle, Dialog, DialogActions, Avatar } from '@mui/material';
import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { makeStyles } from "@mui/styles";
import ProfileCard from '../Components/ProfileCard';
import { MessageCircle as MessageIcon, Heart as HeartIcon } from 'react-feather';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HeartButton from '../Components/Orders/HeartButton';
import EmptyListing from '../assets/EmptyListing.png';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CustomButton from "../Components/CustomButton";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { openImageModal } from '../Redux/actions';

// API
import * as UserAPI from '../API/userApi';
import * as IndexAPI from '../API/index';
import { useDispatch, useSelector } from 'react-redux';
import { ERROR } from "../Redux/actionTypes";
import ChatWithRefashionerListingButton from '../Components/Orders/ChatWithRefashionerListingButton';
import { showFeedback } from '../Redux/actions';

// Google Analytics
import ReactGa from 'react-ga';

const useStyles = makeStyles((theme) => ({
  Box: {
    marginTop: '2px',
    marginBottom: '2px'
  },
  modalBox: {
    width: '100%',
    minHeight: '18em',
    background: 'white',
    padding: "2em",
    borderRadius: '1em',
    border: '0.1em solid #FB7A56',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }
}));


const dummyListing = {
  // id: "1", // 
  title: "Project's Name",
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  dateCreated: '23/2/2022',
  price: '20',
  imageList: [EmptyListing, EmptyListing, EmptyListing],
  tagList: ["Top", "Jeans"],
  materialList: [],
  refashioner: {
    id: '1',
    name: 'Jane Doe',
    rating: '4.1',
  }
}


const notFavouritedStyle = {
  background: "#CFD1D8",
  color: 'white',
  fontWeight: '600',
  padding: 1,
  height: '100%',
  width: '90%',
};

const isFavouritedStyle = {
  background: "#FB7A56",
  color: 'white',
  fontWeight: '600',
  padding: 1,
  height: '100%',
  width: '90%',
};

// API to call: retrieveListingById(listingId)
// Get the Id of refashioner who made the listing: listing.refashioner.id

export default function ListingScreen() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const styles = useStyles();
  const { id } = useParams();

  // Retrive currentUser username from Redux
  const currentUser = useSelector((state) => state.currUserData);

  const [listing, setListing] = React.useState(dummyListing);
  const [favourite, setFavourite] = React.useState(false);
  const [category, setCategory] = React.useState([]);
  const [favouriteListings, setFavouriteListings] = React.useState([]);
  const [isDeletionModalOpen, setIsDeletionModalOpen] = React.useState(false);
  const [openBuyerProtectionModal, setOpenBuyerProtectionModal] = React.useState(false);

  // Google Analytics
  React.useEffect(() => {
    ReactGa.initialize('UA-223374225-1')
    console.log("sending data to GA");
    ReactGa.pageview('/listing/' + id);
  }, [])


  React.useEffect(() => {
    UserAPI.retrieveProjectListingById(id).then((val) => {
      if (val.data.available) {
        setListing(val.data);
        setCategory(val.data.category);
      } else {
        navigate('/requestDetails404');
      }
    });
    getFavouriteListings();
  }, [])

  async function getFavouriteListings() {
    UserAPI.retrieveFavouritedProjectListings().then((val) => {
      setFavouriteListings(val.data);
      setFavourite(checkListingIsFavourite(val.data));
    });
  }

  function handlePhotoModal(images, index) {
    dispatch(openImageModal(images, index))
  }

  const handleDeleteListing = async () => {

    // Insert the API to delete review
    await deleteProjectListingById(id);
    dispatch(showFeedback("Listing Successfully Deleted: " + id));
    handleClose();
    navigate('/userprofile');
  }

  const deleteProjectListingById = async (id) => {
    console.log("Deleting listing by id...");
    try {
      const { data } = await UserAPI.deleteProjectListingById(id);
      console.log("DATA: " + JSON.stringify(data));
    } catch (error) {
      const data = error?.response?.data?.message
      console.log("ERROR MSG: " + JSON.stringify(error));
      dispatch({ type: ERROR, data })
    }
  }

  const checkListingIsFavourite = (listings) => {
    console.log(listings);
    if (listings.length == 0) {
      console.log("no favourite listing");
    }
    // Check if refashionerId exist inside the user list of favourite refashioner.
    const isFavourite = listings.some(favListing => favListing.id == id); // must be double ==, one is string other is number
    console.log("Favourite listings not empty: " + isFavourite);
    return isFavourite;
  }

  const favouriteListing = async (id) => {
    console.log("favouriting listing...");
    try {
      const res = await UserAPI.favouriteProjectListing(id);
      if (res) {
        dispatch(showFeedback('Listing Favourited'));
      }
    } catch (error) {
      const data = error?.response?.data?.message
      console.log("ERROR MSG: " + JSON.stringify(error));
      setFavourite(false);
      dispatch({ type: ERROR, data })
    }
  }

  const unfavouriteListing = async (id) => {
    console.log("unfavouriting listing...");
    try {
      const res = await UserAPI.unfavouriteProjectListing(id);
      if (res) {
        dispatch(showFeedback('Listing Unfavourited'));
      }
    } catch (error) {
      const data = error?.response?.data?.message
      console.log("ERROR MSG: " + JSON.stringify(error));
      setFavourite(true);
      dispatch({ type: ERROR, data })
    }
  }

  const toggleFavouriteListing = async () => {
    console.log(favourite);
    if (favourite) {
      // Insert API to remove listings in user list of favourite listings
      await unfavouriteListing(id);
      setFavourite(false);
      //setFavourite(checkListingIsFavourite(favouriteListings));

    } else {
      // Insert API to add listings to user list of favourite listings. 
      await favouriteListing(id);
      setFavourite(true);
      //setFavourite(checkListingIsFavourite(favouriteListings));
    }
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Container>
      <Grid container spacing={2} justifyContent="space-between"  >
        <Grid item xs='auto'>
          <Button onClick={() => navigate(-1)}>
            <ArrowBackIcon fontSize='large' color='action' />
          </Button>
        </Grid>
      </Grid>
      <Box>
        <Box className={styles.Box}>
          <Box sx={{ overflowX: 'scroll', display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
            {/* {listing.imageList.map((val) =>
              <Box sx={{ width: '100%' }}>
                <img src={val.url} style={{ width: '100%', height: '100%' }} alt='listing' />
              </Box>
            )} */}
            <img src={listing.imageList[0].url} onClick={() => handlePhotoModal(listing.imageList.map(({ url }) => url), 0)} height="100%" width="100%" style={{ background: "none", alignSelf: 'center' }} />
          </Box>
        </Box>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <Typography variant='h4' fontWeight={600}>{listing.title}</Typography>

            {currentUser.id === listing.refashioner.id &&
              <Grid item xs='auto'>
                <IconButton onClick={handleClick}>
                  <MoreVertIcon fontSize='large' />
                </IconButton>
              </Grid>
            }
          </Box>
        </Grid>

        <Box className={styles.Box}>
          <Grid container spacing={1}>
            <Grid item xs="auto"> { /* Combine materialList, tagList into one chiplist */}
              <Chip
                label={category.categoryName}
                style={{
                  background: "#FB7A56",
                  fontWeight: "bold",
                  color: "white",
                  padding: "2.5vh 1.5vw",
                  margin: "0 0.3em 1.5em",
                  borderRadius: "3vh",
                }}
              />
            </Grid>
            {
              listing.materialList.map((material) =>
                <Grid item xs="auto">
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
                </Grid>)
            }
            {
              listing.tagList.map((tag) =>
                <Grid item xs="auto">
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
                </Grid>)
            }
          </Grid>
        </Box>
        <ProfileCard user={listing.refashioner} />
        <Divider />
        <Box className={styles.Box}>
          <Typography variant='h6' sx={{ fontWeight: 550 }}>Description of Project</Typography>
          <Typography variant='subtitle1'>{listing.description}</Typography>
          <Typography variant='h6' sx={{ fontWeight: 550, marginTop: 2 }}>
            Estimated Price Range
            <IconButton onClick={() => setOpenBuyerProtectionModal(true)}>
              <HelpOutlineIcon />
            </IconButton>
          </Typography>
          <Typography variant='subtitle1'>SGD {listing.price}</Typography>
        </Box>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={8} sx={{ marginTop: 2, marginLeft: 0, zIndex: '0' }}>
          <ChatWithRefashionerListingButton listing={listing} />
        </Grid>

        <Grid item xs={4} sx={{ marginTop: 2, marginLeft: 0 }}>
          <Button
            variant="contained"
            sx={{ background: '#FB7A56', color: 'white', fontWeight: '600', padding: 1, height: '100%', width: '90%' }}
            style={favourite ? isFavouritedStyle : notFavouritedStyle}
            onClick={toggleFavouriteListing}
          >
            <IconButton sx={{ color: 'white' }}>
              <HeartIcon fill="white" size="30px" />
            </IconButton>
          </Button>
        </Grid>
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => { navigate(`/listing/${id}/edit`) }}>Edit Listing</MenuItem>
        <MenuItem onClick={() => setIsDeletionModalOpen(true)}>Delete Listing</MenuItem>
      </Menu>
      <Dialog
        open={isDeletionModalOpen}
        onClose={() => setIsDeletionModalOpen(false)}
        aria-labelledby="alert-dialog-final-rejection"
        aria-describedby="alert-dialog-final-rejection"
        onBackdropClick={() => setIsDeletionModalOpen(false)}
      >
        <Box sx={{ backgroundColor: 'primary.main', display: 'flex', flexDirection: 'row', maxWidth: '450px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '15%', minWidth: '64px', paddingTop: '16px' }}>
            <InfoOutlinedIcon fontSize='large' />
          </Box>
          <Box>
            <DialogTitle id="final-rejection" sx={{ paddingLeft: 0, paddingRight: 0 }}>
              Confirm Delete?
            </DialogTitle>
            <DialogActions sx={{ marginBottom: '16px' }}>
              <CustomButton variant='contained' onClick={() => setIsDeletionModalOpen(false)} sx={{ backgroundColor: 'secondary.light' }}>Cancel</CustomButton>
              <CustomButton variant='contained' color="secondary" onClick={handleDeleteListing} autoFocus>
                Delete
              </CustomButton>
            </DialogActions>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '15%', minWidth: '64px', paddingTop: '16px' }} />
        </Box>
      </Dialog>

      <Modal
        open={openBuyerProtectionModal}
        onClose={() => setOpenBuyerProtectionModal(false)}
      >
        <Box className={styles.modalBox}>
          <Grid container>
            <Grid item xs={3} lg={1}>
              <Avatar sx={{ width: 60, height: 60, backgroundColor: "#FFE8BC" }}>
                <VerifiedUserIcon sx={{ fontSize: "40px", color: "#FB7A56" }} />
              </Avatar>
            </Grid>
            <Grid item xs={9} lg={11}>
              <Typography>Our Buyer Protection is added to a fee for every purchase made.</Typography>
              <Typography>Buyer Protection includes our Refund Policy</Typography>
            </Grid>
            <Grid sx={{ mt: 2, mb: 2 }} item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography>Buyer Protection fee</Typography>
              <Typography>SGD $0.70 + 5% of the item's price</Typography>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Container >
  )
} 
