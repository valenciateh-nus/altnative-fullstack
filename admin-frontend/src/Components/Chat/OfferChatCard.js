import * as React from "react";
import { Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, Icon, IconButton, List, ListItem, ListItemIcon,ListItemText, Modal, TextField, Typography,} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Box } from "@mui/system";
import moment from "moment";
import { styled } from "@mui/styles";
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import DoneIcon from '@mui/icons-material/Done';
import CustomButton from "../CustomButton";
import ClearIcon from '@mui/icons-material/Clear';
import { acceptOfferForListing, rejectOffer, retrieveOfferById } from "../../API/offerApi";
import { useNavigate } from "react-router";
import { apiWrapper } from "../../API";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { rejectAddOnOffer } from "../../API/addOnApi";
import { OFFER_PENDING_PAYMENT, OFFER_PENDING_RESPONSE, OFFER_REJECTED } from "./OfferStatuses";

const CardContentNoPadding = styled(CardContent)(`
  padding: 0;
  &:last-child {
    padding-bottom: 0;
  }
`);

export default function OfferChatCard({offerId, offerObject={}, index, showButtons = false, isLast, maxWidth = '220px', minWidth = 'auto', handleRejection: handleRejection, orderId}) {
  const addOnCardStyle = { backgroundColor : "white", maxWidth: maxWidth, width: minWidth, borderRadius : '16px', flexDirection : 'column',marginTop:'8px', marginBottom : '8px'}

    const fields = ['proposedCompletionDate', 'price', 'description']
    const icons = {
        proposedCompletionDate : <AccessTimeIcon color = 'secondary'/>,
        price : <MonetizationOnOutlinedIcon color = 'secondary'/>,
        description : <AddCircleOutlineOutlinedIcon color = 'secondary'/>,
    }
    const[offer, setOffer] = React.useState(offerObject);
    const[isModalOpen, setIsModalOpen] = React.useState(false);
    const[rejectionReason, setRejectionReason] = React.useState("");
    const[isLoading,setIsLoading] = React.useState(false);

    const handleChangeRejection = (e) => {
        setRejectionReason(e.target.value);
    }
    
    const history = useNavigate();

    const messagesEndRef = React.useRef(null);
    const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block:"start" })}

    function handleOnAccept() {
        if(orderId) {
            history(`/payment/${offer.id}?order=${orderId}`)
        } else {
            history(`/payment/${offer.id}`)
        }
    }

    async function handleDecline() {
        let res;
       if(orderId) {
        res = await apiWrapper(rejectAddOnOffer(orderId, offer.id,rejectionReason), "", true)
       } else {
        res = await apiWrapper(rejectOffer(offer.id,rejectionReason), "", true)
       }
       if(res) {
            handleRejection(offer,rejectionReason);
            setRejectionReason("");
            loadOffer();
       }
       setIsModalOpen(false);
       console.log(JSON.stringify(res));
    }

    const handleOnKeyDown = async(e) => {
        if(e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleDecline();
        }

    }

    async function loadOffer() {
        try {
            setOffer((await retrieveOfferById(offerId)).data);
        } catch (err) {
            console.error("Error retrieving offerId: " + offerId, "ERR: ",  err)
        }
    }

    React.useEffect(() => {
        if(!offerObject.id) {
            loadOffer();
        }
    },[])

    React.useEffect(() => {
        if(offer && isLast) {
            console.log("OFFER LAST, SCROLL TO BOTTOM AFTER LOAD")
            scrollToBottom();
        }
    },[offer])

    const declineModalStyle = { backgroundColor : "#FFFAF0", maxWidth: '235px', minHeight: '300px', borderRadius : '16px', flexDirection : 'column', display :'flex', justifyContent : 'center',paddingBottom : 1,}

    return (
        <>
        {offer.id ? <Card sx={addOnCardStyle}>
        <CardContentNoPadding sx={{padding: 1, textAlign : 'left'}} >
        <Box>
            <Grid container sx={{justifyContent : 'center', alignItems : 'center', marginTop : 1, mb: 1}}>
                <Grid item xs={10}>
                    <Typography sx={{paddingLeft: 0}} fontWeight={600} variant='body1'>{offer.marketplaceListing ? offer.marketplaceListing.title : offer.title}</Typography>
                </Grid>
                {offer.offerStatus !== OFFER_REJECTED && 
                <Grid item xs={2} sx={{display : 'flex', justifyContent: 'flex-end'}}>
                    <PriceCheckIcon color={offer.transactions?.filter((txn) => txn.paymentStatus === 'COMPLETED').length > 0 ? 'secondary' :'disabled'}/>
                </Grid>}
            </Grid>
            <Divider orientation="horizontal"/>
            <List>
            {!offer.marketplaceListing ? //project req/list
                (fields.map((field, index) => (
                    <ListItem key={index} id={index} >
                        <ListItemIcon sx={{minWidth: 0, paddingRight: 2}}>{icons[field]}</ListItemIcon>
                        <ListItemText sx={{wordWrap:'break-word'}} primaryTypographyProps={{fontSize:12}}>{index === 1 && 'SGD '}{index === 0 ? moment(offer[field]).format("DD MMM yyyy") : offer[field]}</ListItemText>
                    </ListItem>
                )))
            : //is marketplace listing
            <>
                <ListItem>
                    <ListItemIcon sx={{minWidth: 0, paddingRight: 2}}>{icons.description}</ListItemIcon>
                    <ListItemText sx={{wordWrap:'break-word'}} primaryTypographyProps={{fontSize:12}}>Qty: {offer.quantity}</ListItemText>
                </ListItem> 
                <ListItem>
                    <ListItemIcon sx={{minWidth: 0, paddingRight: 2}}>{icons.price}</ListItemIcon>
                    <ListItemText sx={{wordWrap:'break-word'}} primaryTypographyProps={{fontSize:12}}>SGD ${Math.round(offer.price).toFixed(2)}</ListItemText>
                </ListItem>
            </>
            }   
            </List>
            { showButtons && (offer.offerStatus === OFFER_PENDING_RESPONSE || offer.offerStatus === OFFER_PENDING_PAYMENT || (offer.offerStatus === OFFER_PENDING_PAYMENT && offer.marketplaceListing) ) && <>
            <Box sx={{display : 'flex', justifyContent: 'center', alignItems : 'center', marginBottom: 1}}>
                <CustomButton onClick={handleOnAccept} sx={{marginRight: 1}} size="small" variant="contained" color = "secondary" startIcon={<DoneIcon/>}>Accept</CustomButton>
                <CustomButton onClick={() => setIsModalOpen(true)} size="small" variant="contained" color = "secondary" startIcon={<ClearIcon/>}>Decline</CustomButton>
            </Box>
            </>
            }
        </Box>
        </CardContentNoPadding>
        <div ref={messagesEndRef} id="messagesEndRef-offer"/>
        </Card> : null}
        <Dialog
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            aria-labelledby="alert-dialog-offer-rejection"
            aria-describedby="alert-dialog-offer-rejection"
            onBackdropClick = {() => setIsModalOpen(false)}
        >
            <Box sx={{backgroundColor : 'primary.main', display:'flex', flexDirection:'row', maxWidth: '450px'}}>
                <Box sx={{display : 'flex', justifyContent:'center', width: '15%', minWidth: '64px', paddingTop : '16px'}}>
                  <InfoOutlinedIcon fontSize='large'/>
                </Box>
                <Box>
                  <DialogTitle id="final-rejection" sx={{paddingLeft: 0, paddingRight: 0}}>
                      Confirm Rejection?
                  </DialogTitle>
                  <DialogContent sx={{padding: 0}}>
                  <DialogContentText id="alert-dialog-description">
                  {`You are about to reject the offer entitled: ${offer.title}. Please provide a reason.`}
                  </DialogContentText>
                  <TextField 
                        variant='standard'
                        InputProps={{ disableUnderline: true }} value={rejectionReason} 
                        onChange={handleChangeRejection}
                        onKeyDown={handleOnKeyDown}
                        multiline
                        rows={3}
                        fullWidth
                        sx={{overflowY: 'scroll', backgroundColor : 'white', marginTop: '16px', padding: 1, borderRadius : '4px'}}
                    />
                  </DialogContent>
                  <DialogActions sx={{marginBottom:'16px'}}>
                      <CustomButton variant='contained' onClick={() => setIsModalOpen(false)} sx={{backgroundColor:'secondary.light'}}>Cancel</CustomButton>
                      <CustomButton variant='contained' color="secondary" onClick={handleDecline} autoFocus>
                          Decline
                      </CustomButton>
                  </DialogActions>
                </Box>
                <Box sx={{display : 'flex', justifyContent:'center', width: '15%', minWidth: '64px', paddingTop : '16px'}}/>
            </Box>
        </Dialog>
        </>
    )
}