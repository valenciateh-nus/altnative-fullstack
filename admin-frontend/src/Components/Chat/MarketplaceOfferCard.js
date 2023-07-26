import * as React from "react";
import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, ListItem, ListItemText, TextField, Typography,} from "@mui/material";
import CustomButton from "../CustomButton";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Box } from "@mui/system";
import { toTitleCase } from "../../constants";

export default function MarketplaceOfferCard({handleSubmit, topic}) {

    const offerFormInit = {
        quantity : 0, 
        title : topic.title,
    }  
  const addOnCardStyle = { backgroundColor : "#FFFAF0", maxWidth: '235px', borderRadius : '16px', flexDirection : 'column', display :'flex',paddingBottom : 1,}
  const[offerForm, setOfferForm] = React.useState(offerFormInit)
  const[isNext, setIsNext] = React.useState(false);

  const handleFormChange = (e) => {
    setOfferForm({ ...offerForm, [e.target.name]: e.target.value })
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    console.log("Submit measurements: ", JSON.stringify(offerForm));
    handleSubmit(offerForm);

  };

  const handleOnKeyDown = async(e) => {
    if(e.key === 'Enter' && !e.shiftKey && offerForm.title !== "") {
        e.preventDefault();
        setIsNext(true);
    }
}
    return (
        <>
        <Card sx={addOnCardStyle}>
            <CardContent>
            <Box component="form" onSubmit={handleSubmit}>
                <Box sx={{display : 'flex', flexGrow: 1, justifyContent : 'space-between', alignItems : 'center', marginRight : 2, maxLines : 2 }}>
                    <Typography sx={{paddingLeft: 2, marginTop : '12px', display: '-webkit-box',overflow: 'hidden',WebkitBoxOrient: 'vertical',WebkitLineClamp: 2,}} fontWeight={600} variant='body1'>{toTitleCase(topic.title)}</Typography>
                </Box>
                    <ListItem>
                        <ListItemText sx={{wordWrap:'break-word'}} >Price: SGD$ {Number(Math.round(topic.price)).toFixed(2)}</ListItemText>
                    </ListItem>
                    <ListItem sx={{ mt: -2 }}>
                        <ListItemText sx={{wordWrap:'break-word'}} >Total Qty: {Number(Math.round(topic.quantity))}</ListItemText>
                    </ListItem>

                    <ListItem sx={{ mt: -2 }}>
                        <ListItemText sx={{wordWrap:'break-word'}} >Minimum Qty: {Number(Math.round(topic.minimum))}</ListItemText>
                    </ListItem>
                    <Accordion sx={{boxShadow : 'none', backgroundColor : "#FFFAF0", '& .Mui-expanded' : {minHeight: 0, marginTop : 0}}}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{minHeight: 0}}>
                            <AddCircleOutlineOutlinedIcon color = 'secondary'/>
                            <Typography sx={{paddingLeft: 1,whiteSpace: 'nowrap',overflow: 'hidden',textOverflow: 'ellipsis', maxWidth : '140px'}}>
                                {(offerForm.quantity < 1 || !offerForm.quantity) ? 'Quantity' : 'Qty: ' + offerForm.quantity}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{paddingBottom : 0}}>
                            <TextField size ='small' variant="outlined" id={'quantity'} name={'quantity'} 
                                color="secondary" label={'Quantity'} type='number' 
                                value={offerForm.quantity} onChange={handleFormChange} required
                                error={(offerForm.quantity < topic.minimum || offerForm.quantity > topic.quantity) && offerForm.quantity !== 0} 
                                helperText={((offerForm.quantity < topic.minimum || offerForm.quantity > topic.quantity) && offerForm.quantity != 0) && 'Quantity must be more than minimum and less than total quantity'}
                            />
                        </AccordionDetails>
                    </Accordion>
                    <ListItem sx={{display : 'flex', flexDirection : 'column', justifyContent : 'flex-start', alignItems : 'flex-start'}}>
                        <ListItemText sx={{wordWrap:'break-word'}} >Sub-total:</ListItemText>
                        <ListItemText sx={{wordWrap:'break-word'}} primaryTypographyProps={{style : {fontWeight : 700}}} >SGD$ {Number(Math.round(topic.price * offerForm.quantity)).toFixed(2)}</ListItemText>
                    </ListItem>
                <Box sx={{display: 'flex', flexGrow : 1, justifyContent : 'center', paddingLeft: 5, paddingRight: 5}}>
                        <CustomButton variant='contained' color='secondary' fullWidth onClick={handleOnSubmit} 
                        disabled={offerForm.quantity <= 0 || offerForm.quantity < topic.minimum || offerForm.quantity > topic.quantity}>
                            Send Offer
                    </CustomButton>
                </Box> 
            </Box>
            </CardContent>
        </Card>
    </>
    )
}