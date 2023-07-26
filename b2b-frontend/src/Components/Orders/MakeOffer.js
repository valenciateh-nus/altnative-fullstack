import * as React from "react";
import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, InputAdornment, TextField, Typography, } from "@mui/material";
import CustomButton from "../CustomButton";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box } from "@mui/system";
import * as offerApi from '../../API/offerApi.js';
import { ERROR } from "../../Redux/actionTypes";
import { useDispatch } from "react-redux";

export default function MakeOffer({title, id}) {
  const offerCardForm = { backgroundColor: "white", justifyContent: 'center', alignItems: 'center', borderRadius: '16px', flexDirection: 'column', marginTop: '8px', marginBottom: '8px'}

  const [offerForm, setOfferForm] = React.useState({ 'proposedCompletionDate': "", 'price': "", 'description': "" })

  const handleFormChange = (e) => {
    setOfferForm({ ...offerForm, [e.target.name]: e.target.value })
  };

  // const detailsJSON = JSON.parse(milestone.details ? milestone.details : "{}");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(offerForm);
    await makeAnOffer(offerForm, id);
  };

  const dispatch = useDispatch();

  async function makeAnOffer(data, id) {
    console.log('creating new request')
    try {
      await offerApi.createOfferForRequest(id, data);
      //alert('success');
    } catch (error) {
      const data = error?.response?.data?.message
      console.log("ERROR MSG: " + JSON.stringify(error));
      dispatch({ type: ERROR, data })
    }
  }
 
  const fields = ['proposedCompletionDate', 'price', 'description']
  return (
    <Card sx={offerCardForm}>
      <Box component="form" onSubmit={handleSubmit} sx={{ paddingBottom: 2, paddingTop: 1, }}>
        <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', marginRight: 2, }}>
          <Typography sx={{ paddingLeft: 2, marginTop: '12px' }} fontWeight={600} variant='body2'>{title}</Typography>
          <CustomButton variant='contained' color="secondary" type="submit" sx={{ fontSize: '10px' }}
            disabled={offerForm[`${fields[0]}`] && offerForm[`${fields[1]}`] && offerForm[`${fields[2]}`] ? false : true}
          >
            Submit
          </CustomButton>
        </Box>

        <Accordion id={fields[0]} sx={{ boxShadow: 'none' }} key={0}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} >
            {(offerForm[fields[0]]) ? <CheckCircleIcon color='secondary' /> : <CircleOutlinedIcon color='secondary' />}
            <Typography sx={{ paddingLeft: 1}}>Timeline</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField variant="outlined" id={fields[0]} name={fields[0]} color="secondary" label='Timeline' value={offerForm[fields[0]]} onChange={handleFormChange}
              InputProps={{
                endAdornment: <InputAdornment position="end">days</InputAdornment>
              }}
              type="number" required
            />
          </AccordionDetails>
        </Accordion>

        <Accordion id={fields[1]} sx={{ boxShadow: 'none' }} key={1}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} >
            {(offerForm[fields[1]]) ? <CheckCircleIcon color='secondary' /> : <CircleOutlinedIcon color='secondary' />}
            <Typography sx={{ paddingLeft: 1 }}>Offer Price</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField variant="outlined" id={fields[1]} name={fields[1]} color="secondary" label='Offer Price' value={offerForm[fields[1]]} onChange={handleFormChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">SGD</InputAdornment>
              }}
              type="number" required
            />
          </AccordionDetails>
        </Accordion>

        <Accordion id={fields[2]} sx={{ boxShadow: 'none' }} key={2}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} >
            {(offerForm[fields[2]]) ? <CheckCircleIcon color='secondary' /> : <CircleOutlinedIcon color='secondary' />}
            <Typography sx={{ paddingLeft: 1 }}>Description</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField variant="outlined" id={fields[2]} name={fields[2]} color="secondary" label='Description' value={offerForm[fields[2]]} onChange={handleFormChange}
              type="text" 
              multiline
              rows={3}
            />
          </AccordionDetails>
        </Accordion>
      </Box>
    </Card>
  )
}