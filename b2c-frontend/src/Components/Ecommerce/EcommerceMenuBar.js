import React from "react";
import { IconButton, Typography, Divider, Menu, MenuItem, Box, DialogTitle, DialogContent, DialogContentText, Dialog, TextField, DialogActions, Modal, CircularProgress, CardContent, Card } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { withStyles } from "@mui/styles";
import { useNavigate, useParams } from "react-router";
import * as marketplaceApi from '../../API/marketplaceApi.js';
import { useDispatch } from "react-redux";
import { ERROR } from "../../Redux/actionTypes";
import CustomButton from "../CustomButton.js";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { showFeedback } from '../../Redux/actions';
import * as indexApi from '../../API/index.js';

const CustomMenuItem = withStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(1),
    fontSize: 14,
  }
}))(MenuItem);

export default function EcommerceMenuBar({ id, isSellerPov }) {
  const [orderMenuAnchor, setOrderMenuAnchor] = React.useState(null);
  const [isDeletionModalOpen, setIsDeletionModalOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const isOrderMenuOpen = Boolean(orderMenuAnchor);
  const handleOpenOrderMenu = (event) => {
    setOrderMenuAnchor(event.currentTarget);
  };
  const handleOrderMenuClose = () => {
    setOrderMenuAnchor(null);
  };

  let navigate = useNavigate();
  let dispatch = useDispatch();

  const routeChange = () => {
    const newPath = `/createEcommListing/${id}`;
    navigate(newPath);
  };

  async function deleteListing(id) {
    console.log('delete listing')
    try {
      setLoading(true);
      const res = await indexApi.apiWrapper(marketplaceApi.deleteListingById(id), "", true);
      if (res) {
          setLoading(false);
          dispatch(showFeedback('Listing Deleted'));
          setTimeout(function () {
              navigate(-1);
          }, 1000);
      } else {
        setLoading(false);
      }
    } catch (error) {
      const data = error?.response?.data?.message
      console.log("ERROR MSG: " + JSON.stringify(error));
      dispatch({ type: ERROR, data })
    }
  }

  const handleDelete = async (e) => {
    await deleteListing(id);
    // navigate(`/marketplaceOrder`);
  }

  console.log(id);

  return (
    <>
      {isSellerPov ? (
        <>
          <IconButton id='order-more-button' onClick={handleOpenOrderMenu} aria-controls={isOrderMenuOpen ? 'order-menu' : undefined} aria-haspopup="true" aria-expanded={isOrderMenuOpen ? 'true' : undefined}>
            <MoreVertIcon fontSize="large" />
          </IconButton>
          <Menu
            id='order-menu'
            anchorEl={orderMenuAnchor}
            open={isOrderMenuOpen}
            onClose={handleOrderMenuClose}
            MenuListProps={{
              'aria-labelledby': 'order-more-button',
            }}
          >
            <Typography sx={{ paddingLeft: '16px' }} variant='h6'>Manage</Typography>
            <Divider orientation='horizontal' sx={{ marginBottom: 1 }} />
            <CustomMenuItem onClick={routeChange} >Edit Listing</CustomMenuItem>
            <CustomMenuItem onClick={() => setIsDeletionModalOpen(true)}>Delete Listing</CustomMenuItem>
          </Menu>
          <Dialog
            open={isDeletionModalOpen}
            onClose={() => setIsDeletionModalOpen(false)}
            aria-labelledby="alert-dialog-final-rejection"
            aria-describedby="alert-dialog-final-rejection"
            onBackdropClick = {() => setIsDeletionModalOpen(false)}
        >
            <Box sx={{backgroundColor : 'primary.main', display:'flex', flexDirection:'row', maxWidth: '450px'}}>
                <Box sx={{display : 'flex', justifyContent:'center', width: '15%', minWidth: '64px', paddingTop : '16px'}}>
                  <InfoOutlinedIcon fontSize='large'/>
                </Box>
                <Box>
                  <DialogTitle id="final-rejection" sx={{paddingLeft: 0, paddingRight: 0}}>
                      Confirm Delete?
                  </DialogTitle>
                  <DialogActions sx={{marginBottom:'16px'}}>
                      <CustomButton variant='contained' onClick={() => setIsDeletionModalOpen(false)} sx={{backgroundColor:'secondary.light'}}>Cancel</CustomButton>
                      <CustomButton variant='contained' color="secondary" onClick={handleDelete} autoFocus>
                          Delete
                      </CustomButton>
                  </DialogActions>
                </Box>
                <Box sx={{display : 'flex', justifyContent:'center', width: '15%', minWidth: '64px', paddingTop : '16px'}}/>
            </Box>
        </Dialog>
        <Modal open={loading} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
      )
        :
        <div></div>
      }
    </>
  )
}
