import * as React from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Modal, SwipeableDrawer, TextField, Typography, useMediaQuery,CircularProgress } from "@mui/material";
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
import InContainerLoading from "../InContainerLoading";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/styles";



export default function RequestCourier({isDeliveryDrawer, setIsDeliveryDrawer,handleCreateDelivery}) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme => theme.breakpoints.up('md'));
  const[deliveryDate, setDeliveryDate] = React.useState();
  const[isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);
  const[isLocationPickerOpen, setIsLocationPickerOpen] = React.useState(false);
  const[deliveryForm, setDeliveryForm] = React.useState({});
  const[deliveryAddressConcatenated, setDeliveryAddressConcatenated] = React.useState("");
  const[isDeliveryConfirmationModalOpen, setIsDeliveryConfirmationModalOpen ] = React.useState(false);
  const[deliveryConfirmation, setDeliveryConfirmation] = React.useState(false);

  const deliveryFormStyle = { position: 'absolute', top: '50%', left: '50%',transform: 'translate(-50%, -50%)', backgroundColor : "primary.veryLight", width: '450px', maxWidth : `${isDesktop ? '450px' : '350px'}`, height: '550px', display : 'flex', justifyContent : 'center', alignItems : 'center', borderRadius : '16px', flexDirection : 'column'}

  const[isLoading,setIsLoading] = React.useState(false);

  const currUserAddress = useSelector((state) => state.currUserData.address)

  React.useState(() => {
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

  const handleDeliveryFormChange = (e) => {
    setDeliveryForm({ ...deliveryForm, [e.target.name]: e.target.value })
  };

  const handleLocationSubmit = (e) => {
    e.preventDefault();
    const deliveryAddress = deliveryForm.addrOne + " " + deliveryForm.addrTwo + " " + deliveryForm.city + " " + deliveryForm.postalCode;
    setDeliveryAddressConcatenated(deliveryAddress);
    setIsLocationPickerOpen(false);
  };

  React.useEffect(() => {
    if(deliveryAddressConcatenated && deliveryDate) {
        setIsDeliveryConfirmationModalOpen(true);
      }
  },[deliveryAddressConcatenated, deliveryDate])


  React.useEffect(() => {
    if(deliveryConfirmation) {
    //     console.log("submitting delivery details: ", deliveryAddressConcatenated, moment(deliveryDate).format("DD/MM/yyyy"));
    //   const formData = {
    //       origin: `Date: ${moment(deliveryDate).format('DD MMM yyyy')} \n Address: ${deliveryAddressConcatenated}`,
    //   }

      //await createMilestone(formData);
      setIsLoading(true);
      handleSubmit();
      //setisDeliveryConfirmationModalOpen(false);
      //setIsDeliveryDrawer(false);
    }
  },[deliveryConfirmation])

  function handleSubmit() {
      try {
        handleCreateDelivery(deliveryAddressConcatenated, deliveryDate);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
      
  }

  function handleMakeChanges() {
    setIsDeliveryConfirmationModalOpen(false);
    setDeliveryConfirmation(false);
}

    return (
    <>
      <Drawer
          anchor={'bottom'}
          open={isDeliveryDrawer}
          onClose={() => setIsDeliveryDrawer(false)}
      >
          <SwipeableDrawer
          anchor={'bottom'}
          open={isDeliveryDrawer}
          onClose={() => setIsDeliveryDrawer(false)}
          onOpen={() => setIsDeliveryDrawer(false)}
        >
          <Box
          sx={{height : "25vh", padding : '20px'}}
          role="presentation"
          //onClick={() => setIsDeliveryDrawer(false)}
          onKeyDown={() => setIsDeliveryDrawer(false)}
          >
              <Typography color='secondary.main' fontWeight={'fontWeightBold'}>
                  Arrange for Courier
              </Typography>
              <List>
                  <ListItem button key={0} onClick={() => setIsLocationPickerOpen(true)}>
                      <ListItemIcon color='secondary'>
                          <AccessTimeOutlinedIcon color='secondary'/>
                      </ListItemIcon>
                      <ListItemText primary={deliveryAddressConcatenated ? deliveryAddressConcatenated : "Pickup/Drop Off location"} />
                  </ListItem>
                  <ListItem button key={1} onClick={() => setIsDatePickerOpen(true)}>
                      <ListItemIcon>
                          <LocationOnOutlinedIcon color='secondary'/>
                      </ListItemIcon>
                      <ListItemText primary={deliveryDate ? moment(deliveryDate).format('DD/MM/yyyy') : "Select courier date"} />
                  </ListItem>
              </List>
          </Box>
        </SwipeableDrawer>
      </Drawer>
      <Modal open={isDatePickerOpen} onClose={()=> setIsDatePickerOpen(false)}>
          <Box sx ={{ position: 'absolute', top: '50%', left: '50%',transform: 'translate(-50%, -50%)'}}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
              <StaticDatePicker
              displayStaticWrapperAs={isDesktop ? "desktop" : "mobile"}
              label="Select Deadline"
              className="datepicker"
              format="dd/MM/yyyy"
              value={deliveryDate}
              clearable
              minDate={new Date()}
              onChange={(date) => {
                  setDeliveryDate(date);
                  setIsDatePickerOpen(false);
              }}
              renderInput={(params) => <TextField {...params} />}
              />
          </LocalizationProvider>
          </Box>
      </Modal>
      <Modal open={isLocationPickerOpen} onClose={()=> setIsLocationPickerOpen(false)}>
          <Box sx ={deliveryFormStyle} >
          <Typography gutterBottom variant="h6">Delivery Information</Typography>
          <Box component = "form" sx ={{minWidth : "300px", maxWidth : `${isDesktop ? '350px' : '300px'}`, "& input:-internal-autofill-selected" : {"WebkitBoxShadow": `0 0 0px 1000px ${theme.palette.primary.main} inset`}}} onSubmit={handleLocationSubmit}>
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
              type='number'
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
                <CustomButton variant='contained' color="secondary" onClick={() => setDeliveryConfirmation(true)} autoFocus disabled={isLoading}>
                    {!isLoading ? "Confirm" : <CircularProgress color='inherit' size={24}/>}
                </CustomButton>
            </DialogActions>
          </Box> 
      </Dialog>
      </>
    )
  
}