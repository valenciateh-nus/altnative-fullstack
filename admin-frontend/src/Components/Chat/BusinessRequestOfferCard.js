import * as React from "react";
import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, InputAdornment, ListItem, ListItemText, TextField, Typography,} from "@mui/material";
import CustomButton from "../CustomButton";


import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';

import { Box } from "@mui/system";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import moment from "moment";

const offerFormInit = {
    proposedCompletionDate : '',
    quantity : 0,
    description : '',
    title : '',
    price: 0,
}


export default function BusinessRequestOfferCard({handleSubmit, isAddOn = false, topic}) {
  const addOnCardStyle = { backgroundColor : "#FFFAF0", width: '30vw', minWidth: '235px', minHeight: '300px', borderRadius : '16px', flexDirection : 'column', display :'flex', justifyContent : 'center',paddingBottom : 1,}
  const[offerForm, setOfferForm] = React.useState(offerFormInit)
  const[isNext, setIsNext] = React.useState(false);

  const handleFormChange = (e) => {
    if (e.target.name === 'quantity') {
        setOfferForm({ ...offerForm, [e.target.name]: e.target.value, ['price']: topic.price * e.target.value })
    } else {
        setOfferForm({ ...offerForm, [e.target.name]: e.target.value})
    }
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

  //const fields = ['proposedCompletionDate', 'quantity', 'description']
  const icons = {
      proposedCompletionDate : <AccessTimeIcon color = 'secondary'/>,
      quantity : <MonetizationOnOutlinedIcon color = 'secondary'/>,
      description : <AddCircleOutlineOutlinedIcon color = 'secondary'/>,
  }

    const fields = [{name : 'proposedCompletionDate', label : 'Timeline', unit :  ''}, {name : 'quantity', label : 'Offer Price', unit : "SGD "}, {name : 'description', label : 'Descriptions', unit: ''}]
      return (
          <>
            <Card sx={addOnCardStyle}>
                <Box component="form" onSubmit={handleSubmit} sx={{display : 'flex', justifyContent: 'space-between', flexDirection : 'column'}}>
                    <Box sx={{display : 'flex', flexGrow: 1, justifyContent : 'space-between', alignItems : 'center', marginBottom : '8px', marginRight : 2, maxLines : 2 }}>
                        <Typography sx={{paddingLeft: 2, marginTop : '12px', display: '-webkit-box',overflow: 'hidden',WebkitBoxOrient: 'vertical',WebkitLineClamp: 2,}} fontWeight={600} variant='body1'>{isNext ? offerForm.title : `What is the ${isAddOn ? 'add on' : 'project'} about?`}</Typography>
                    </Box>
                    {isNext ? <>
                        <Accordion sx={{boxShadow : 'none', backgroundColor : "#FFFAF0"}}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <AccessTimeIcon color = 'secondary'/>
                            <Typography sx={{paddingLeft: 1,whiteSpace: 'nowrap',overflow: 'hidden',textOverflow: 'ellipsis', maxWidth : '140px'}}>
                                {offerForm.proposedCompletionDate === "" || offerForm.proposedCompletionDate === null ? 'Timeline' : moment(offerForm.proposedCompletionDate).toNow(true)}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{paddingBottom : 0}}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                label='Timeline'
                                className="datepicker"
                                format="dd/MM/yyyy"
                                name = 'proposedCompletionDate'
                                value={offerForm.proposedCompletionDate}
                                clearable
                                minDate={new Date()}
                                onChange={(date) => {
                                    setOfferForm({ ...offerForm, proposedCompletionDate: moment(date)})
                                }}
                                renderInput={(params) => <TextField {...params} required/>}
                                sx={{ marginBottom: 2 }}
                                />
                            </LocalizationProvider>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion sx={{boxShadow : 'none', backgroundColor : "#FFFAF0"}}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <AddBoxOutlinedIcon color = 'secondary'/>
                            <Typography sx={{paddingLeft: 1,whiteSpace: 'nowrap',overflow: 'hidden',textOverflow: 'ellipsis', maxWidth : '140px'}}>
                                {offerForm.quantity === 0 || offerForm.quantity === null ? 'Quantity' : `${offerForm.quantity}`}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{paddingBottom : 0}}>
                        <TextField size ='small' variant="outlined" id='quantity' 
                            name='quantity' color="secondary" label='Offer Price' value={offerForm.quantity} onChange={handleFormChange}
                            type='number' required error={offerForm.quantity <= 0}
                        />
                        </AccordionDetails>
                    </Accordion>

                    <Accordion sx={{boxShadow : 'none', backgroundColor : "#FFFAF0"}}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <MonetizationOnOutlinedIcon color = 'secondary'/>
                            <Typography sx={{paddingLeft: 1,whiteSpace: 'nowrap',overflow: 'hidden',textOverflow: 'ellipsis', maxWidth : '140px'}}>
                                {offerForm.description === "" || offerForm.description === null ? 'Description' : offerForm.description}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{paddingBottom : 0}}>
                        <TextField size ='small' variant="outlined" id='description' 
                            name='description' color="secondary" label='Description' value={offerForm.description} onChange={handleFormChange}
                            required
                        />
                        </AccordionDetails>
                    </Accordion>
                      
                    <ListItem sx={{display : 'flex', flexDirection : 'column', justifyContent : 'flex-start', alignItems : 'flex-start'}}>
                        <ListItemText sx={{wordWrap:'break-word'}} >Sub-total:</ListItemText>
                        <ListItemText sx={{wordWrap:'break-word'}} primaryTypographyProps={{style : {fontWeight : 700}}} >SGD$ {Number(Math.round(topic.price * offerForm.quantity)).toFixed(2)}</ListItemText>
                    </ListItem>
                    </>
                    :<Box sx={{paddingLeft : 2, paddingRight: 2, paddingBottom: 1}}>
                        <TextField 
                            variant='standard'
                            InputProps={{ disableUnderline: true }} value={offerForm.title} 
                            name = 'title'
                            required
                            onChange={handleFormChange}
                            onKeyDown={handleOnKeyDown}
                            multiline
                            rows={4}
                            fullWidth
                            sx={{overflowY: 'scroll', backgroundColor : 'white', marginTop: '16px', padding: 1, border: 1, borderRadius : '4px'}}
                        />
                    </Box>}
                    <Box sx={{display: 'flex', flexGrow : 1, justifyContent : 'center', paddingLeft: 5, paddingRight: 5}}>
                        {!isNext ? <CustomButton variant='contained' color='secondary' fullWidth onClick={() => setIsNext(true)} disabled={offerForm.title == "" ? true : false}>Next</CustomButton>
                        : <CustomButton variant='contained' color='secondary' fullWidth onClick={handleOnSubmit} disabled={offerForm.proposedCompletionDate && offerForm.proposedCompletionDate.isValid() && moment(new Date()).isSameOrBefore(offerForm.proposedCompletionDate) && offerForm.description && Number(offerForm.quantity) > 0 ? false : true}
                        >
                        Send Offer
                        </CustomButton>
                        }
                    </Box> 
                </Box>
            </Card>
        </>
      )
}