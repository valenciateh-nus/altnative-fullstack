import * as React from "react";
import { Card, CardContent, CircularProgress, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, Modal, SwipeableDrawer, TextField, Typography, useMediaQuery } from "@mui/material";
import moment from "moment";
import CustomButton from "../CustomButton";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

import * as MilestoneTypes from "./MilestoneTypes";
import { Box } from "@mui/lab/node_modules/@mui/system";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import StaticDatePicker from '@mui/lab/StaticDatePicker';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { apiWrapper } from "../../API";
import { retrieveDeliveryById, updateDelivery } from "../../API/deliveryApi";
import { useSelector } from "react-redux";
import DeliveryInfoCard from "./DeliveryInfoCard";
import { useTheme } from "@mui/styles";



export default function Delivery({deliveryId, handleRefresh, viewOnly = false}) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme => theme.breakpoints.up('md'));
  const[isLocationPickerOpen, setisLocationPickerOpen] = React.useState(false);
  const[delivery, setDelivery] = React.useState({});
  const[deliveryForm, setDeliveryForm] = React.useState({});
  const[deliveryAddressConcatenated, setDeliveryAddressConcatenated] = React.useState("");
  const[isDeliveryConfirmationModalOpen, setIsDeliveryConfirmationModalOpen ] = React.useState(false);
  const[deliveryConfirmation, setDeliveryConfirmation] = React.useState(false);
  const[isSubmitting,setIsSubmitting] = React.useState(false);
  const[isLoading, setIsLoading] = React.useState(false);

  const deliveryFormStyle = { position: 'absolute', top: '50%', left: '50%',transform: 'translate(-50%, -50%)', backgroundColor : "primary.veryLight", width: '450px', maxWidth : `${isDesktop ? '450px' : '350px'}`, height: '550px', display : 'flex', justifyContent : 'center', alignItems : 'center', borderRadius : '16px', flexDirection : 'column'}

  const currUser = useSelector((state) => state.authData);
  const currUserAddress = useSelector((state) => state.currUserData.address);

  React.useEffect(() => {
    setIsLoading(true);
    loadDelivery();
    let newDeliveryForm = {addrOne : "", addrTwo : "", city : "", postalCode : ""};
    if(currUserAddress) {
      console.log("CURRUSERADDRESS: " + currUserAddress);
      const addrSplit = currUserAddress.split("|");
      for(var i = 0; i < Math.min(addrSplit.length,Object.keys(newDeliveryForm).length); i++) {
        newDeliveryForm[Object.keys(newDeliveryForm)[i]] = addrSplit[i];
      }
    }
    console.log("NEW FORM: ", JSON.stringify(newDeliveryForm));
    setDeliveryForm(newDeliveryForm);
  },[])

  async function loadDelivery() {
    const res = await apiWrapper(retrieveDeliveryById(deliveryId),"",true);
    if(res) {
        setDelivery(res.data);
    }
    setIsLoading(false);
  }

  const handleDeliveryFormChange = (e) => {
    setDeliveryForm({ ...deliveryForm, [e.target.name]: e.target.value })
  };

  const handleLocationSubmit = (e) => {
    e.preventDefault();
    const deliveryAddress = deliveryForm.addrOne + " " + deliveryForm.addrTwo + " " + deliveryForm.city + " " + deliveryForm.postalCode;
    setDeliveryAddressConcatenated(deliveryAddress);
    setIsDeliveryConfirmationModalOpen(true);
  };

  React.useEffect(() => {
    if(deliveryConfirmation) {
      setIsSubmitting(true);
      handleSubmit()
    }
  },[deliveryConfirmation])

  async function handleSubmit() {
    let newDelivery = delivery;
    newDelivery.destinationAddress = deliveryAddressConcatenated;
    const res = await apiWrapper(updateDelivery(newDelivery));
    setIsSubmitting(false);
    if(res) {
        setIsDeliveryConfirmationModalOpen(false);
        handleRefresh();
    }
    setDeliveryConfirmation(false);
  }

  function handleMakeChanges() {
      setIsDeliveryConfirmationModalOpen(false);
      setDeliveryConfirmation(false);
  }

    return (delivery && !isLoading && <Box sx={{mb:2, mr:1}}>
        {/* <Typography>{JSON.stringify(delivery)}</Typography> */}
        {currUser.sub === delivery.senderUsername || viewOnly ? <>
        <DeliveryInfoCard delivery={delivery}/>
        </> : (delivery.destinationAddress?.length === 0 || delivery.destinationAddress === null ?
        <CustomButton variant='contained' color="secondary" onClick={() => setisLocationPickerOpen(true)} sx={{width: '200px'}}>
          {!isSubmitting ? "Enter Drop Off address" : <CircularProgress color='inherit' size={20}/>}
        </CustomButton> : <DeliveryInfoCard delivery={delivery} redacted={true}/>)}
        <Modal open={isLocationPickerOpen} onClose={()=> setisLocationPickerOpen(false)}>
          <Box sx ={deliveryFormStyle} >
            <Typography gutterBottom variant="h6">Delivery Information</Typography>
            <Box component = "form" sx ={{minWidth : "300px", maxWidth : `${isDesktop ? '350px' : '300px'}`, "& input:-internal-autofill-selected" : {'WebkitBoxShadow': `0 0 0px 1000px ${theme.palette.primary.main} inset`}}} onSubmit={handleLocationSubmit}>
                <TextField
                margin="normal"
                required
                fullWidth
                id="Addr1"
                label="Address Line 1"
                name="addrOne"
                autoComplete="shipping street-address"
                autoFocus
                color="secondary"
                onChange= {handleDeliveryFormChange}
                value= {deliveryForm.addrOne}
                />
                <TextField
                margin="normal"
                required
                fullWidth
                id="Addr2"
                label="Address Line 2"
                name="addrTwo"
                autoComplete="shipping address-level2"
                color="secondary"
                onChange= {handleDeliveryFormChange}
                value= {deliveryForm.addrTwo}
                />
                <TextField
                margin="normal"
                required
                fullWidth
                id="postalCode"
                label="Postal Code"
                name="postalCode"
                autoComplete="shipping postal-code"
                color="secondary"
                onChange= {handleDeliveryFormChange}
                value= {deliveryForm.postalCode}
                />
                <TextField
                margin="normal"
                required
                fullWidth
                id="city"
                label="City"
                name="city"
                autoComplete="shipping city"
                color="secondary"
                onChange= {handleDeliveryFormChange}
                value= {deliveryForm.city}
                />
                <CustomButton variant='contained' color="secondary"
                type="submit"
                fullWidth
                sx={{ mt: 3, mb: 2 }}
                >
                    Confirm
                </CustomButton>
            </Box>
          </Box>
        </Modal>
        <Dialog
              open={isDeliveryConfirmationModalOpen}
              onClose={() => setIsDeliveryConfirmationModalOpen(false)}
              aria-labelledby="alert-dialog-delivery-confirmation"
              aria-describedby="alert-dialog-delivery-confirmation"
              onBackdropClick = {() => setIsDeliveryConfirmationModalOpen(false)}
        >
              <Box sx={{backgroundColor : 'primary.main'}}>
              <DialogTitle id="delivery-confirmation">
              {"Confirm Delivery Details?"}
              </DialogTitle>
              <DialogContent>
              <DialogContentText id="alert-dialog-description">
                  Delivery details cannot be altered once submitted.
              </DialogContentText>
              </DialogContent>
              <DialogActions>
                  <CustomButton variant='contained' sx={{backgroundColor:'secondary.light'}} onClick={handleMakeChanges}>Make Changes</CustomButton>
                  <CustomButton variant='contained' color="secondary" onClick={() => setDeliveryConfirmation(true)} autoFocus>
                      Confirm
                  </CustomButton>
              </DialogActions>
              </Box>
        </Dialog>
      </Box>
    )
  
}