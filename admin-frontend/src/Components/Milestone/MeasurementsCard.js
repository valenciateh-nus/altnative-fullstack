import * as React from "react";
import { Accordion, AccordionDetails, AccordionSummary, Card, CardContent, InputAdornment, TextField, Typography,} from "@mui/material";
import CustomButton from "../CustomButton";


import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box } from "@mui/system";
import { useSelector } from "react-redux";



export default function MeasurementsCard({milestone = {},  editMilestone, index, isRefashionerPOV, handleRefresh, viewOnly = false}) {
  
  const remarksJSON = JSON.parse(milestone.remarks ? milestone.remarks : "{}");

  const measurementCardStyle = { backgroundColor : "white", justifyContent : 'center', alignItems : 'center', borderRadius : '16px', flexDirection : 'column',marginTop:'8px', marginBottom : '8px'}

  const[measurementsForm, setMeasurementsForm] = React.useState([]);

  const currUser = useSelector((state) => state.currUserData);


  const measurementTypesNameConversion = {
    'Shoulder Width': 'shoulderWidth', 
    'Pit-to-pit' : 'ptp',
    'Chest circumference' : 'chestCircumference',
    'Waist' : 'waist',
    'Torso length' : 'torsoLength',
    'Sleeve length' : 'sleeveLength',
    'Hips' : 'hips',
    'Thighs circumference' : 'thighCircumference',
    'Knee circumference' : 'kneeCircumference',
    'Calf' : 'calfCircumference',
    'Down' : 'down',
}

  React.useEffect(() => {
    let measurements = remarksJSON.fieldsForm;
    if(currUser.measurement && !isRefashionerPOV && measurements) {
        for(const key of Object.keys(measurements)) {
            if(currUser.measurement[measurementTypesNameConversion[key]] > 0) {
                measurements[key] = currUser.measurement[measurementTypesNameConversion[key]];
            }
        }
    }
    setMeasurementsForm(measurements);
  },[])



  const handleFormChange = (e) => {
    setMeasurementsForm({ ...measurementsForm, [e.target.name]: e.target.value })
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitHelper();
    //await createMilestone({...measurementsForm, remarks : JSON.stringify(measurementsForm)});
  };

  async function submitHelper() {
    console.log("Submit measurements: ", JSON.stringify(measurementsForm));
    await editMilestone({...milestone, remarks : JSON.stringify({fieldsForm: measurementsForm, isResponse : true})}, index);
    handleRefresh();
  }

      return (
            remarksJSON.fieldsForm && measurementsForm && <Card sx={measurementCardStyle}>
            <Box component="form" onSubmit={handleSubmit} sx={{paddingBottom : 2, paddingTop: 1,}}>
                <Box sx={{display : 'flex', flexGrow: 1, justifyContent : 'space-between', alignItems : 'center', marginBottom : '8px', marginRight : 2, }}>
                    <Typography sx={{paddingLeft: 2, marginTop : '12px'}} fontWeight={600} variant='body1'>Measurements</Typography>
                    {!remarksJSON.isResponse && 
                        <CustomButton variant='contained' color="secondary" type="submit"
                            disabled={Object.values(measurementsForm).filter((field) => Number(field) <= 0).length === 0 && !viewOnly ? false : true} 
                        >
                            Submit
                        </CustomButton>
                    }
                </Box>
                {!remarksJSON.isResponse ? Object.keys(remarksJSON.fieldsForm).map((field, index) => (
                    <Accordion id={index} sx={{boxShadow : 'none'}} key={index}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} disabled={isRefashionerPOV}>
                            {(measurementsForm[field]?.length > 0 || milestone.remarks.length > 0) ? <CheckCircleIcon color = 'secondary'/> : <CircleOutlinedIcon color ='secondary'/>}
                            <Typography sx={{paddingLeft: 1}}>{field}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TextField variant="outlined" fullWidth id={field} name={field} color="secondary" label={field} value={measurementsForm[field]} onChange={handleFormChange}
                                InputProps={{
                                    endAdornment:<InputAdornment position="end">cm</InputAdornment>
                                }}
                                type="number" required
                                error ={measurementsForm[field] <= 0 ? true : false}
                                helperText={field + " must be a positive value"}
                            />
                        </AccordionDetails>
                    </Accordion>
                )) : Object.keys(remarksJSON.fieldsForm).map((field, index) => (
                    <Accordion id={index} sx={{boxShadow : 'none'}} expanded={false} key={index+10}>
                        <AccordionSummary>
                            <CheckCircleIcon color = 'secondary'/>
                            <Box sx={{display : 'flex', flexGrow: 1, justifyContent : 'space-between', alignItems : 'center', marginBottom : '8px'}}>
                                <Typography sx={{paddingLeft: 1}}>{field}</Typography>
                                <Typography>{remarksJSON.fieldsForm[field]} cm</Typography>
                            </Box>
                        </AccordionSummary>
                    </Accordion>))}
            </Box>
            </Card>
      )
}