import * as React from 'react';
import { IconButton, Typography, Divider, Menu, MenuItem, Drawer, SwipeableDrawer, ListItemText, ListItemButton, List, ListItem, Modal, CardHeader, Card, CardContent, ListItemIcon } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { withStyles} from "@mui/styles";
import { retrieveMilestones, createMilestone } from "../../API/milestoneApi";
import { apiWrapper } from "../../API";

import { MEASUREMENTS_REQUESTED, FINAL_APPROVAL_PENDING, PROGRESS_UPDATE, PROGRESS_UPDATE_REQUEST } from "./MilestoneTypes"
import { Box } from "@mui/system";
import { set } from "date-fns";
import Checkbox from '@mui/material/Checkbox';
import ClearIcon from '@mui/icons-material/Clear';
import CustomButton from "../CustomButton";

const measurementTypes = [
    'Pit-to-pit',
    'Chest circumference',
    'Waist',
    'Torso length',
    'Sleeve length',
    'Hips',
    'Thighs circumference',
    'Knee circumference',
    'Calf',
    'Down',
]

export default function RequestMeasurements({isMeasurementDrawer, setIsMeasurementDrawer, handleRequestMeasurement}) {
    const [selectedMeasurements, setSelectedMeasurements] = React.useState([])
    const [measurementsModal, setMeasurementsModal] = React.useState(false);

    function addRemoveMeasurement(measurement) {
        if(selectedMeasurements.includes(measurement)) {
            setSelectedMeasurements((prev) => prev.filter((val) => val !== measurement));
        } else {
            setSelectedMeasurements((prev) => {
                if(prev.length >= 8) {
                    prev.pop();
                }
                return prev.concat(measurement);
            })
        }
    }

     function handleSubmit() {
        let remarksObject = {
            fieldsForm : {},
            isResponse : false
        }
        for(const m of selectedMeasurements) {
            remarksObject.fieldsForm[m] = ''
        }
        console.log("REMARKS OBJ:", JSON.stringify(remarksObject));
        handleRequestMeasurement(JSON.stringify(remarksObject));
    }
       

    return (
        <>
        <Drawer
          anchor={'bottom'}
          open={isMeasurementDrawer}
          onClose={() => setIsMeasurementDrawer(false)}
      >
          <SwipeableDrawer
          anchor={'bottom'}
          open={isMeasurementDrawer}
          onClose={() => setIsMeasurementDrawer(false)}
          onOpen={() => setIsMeasurementDrawer(false)}
        >
          <Box
          sx={{padding : '20px'}}
          role="presentation"
          onKeyDown={() => setIsMeasurementDrawer(false)}
          >
              <Box sx={{display : 'flex', flexDirection : 'row', justifyContent : 'space-between', alignItems : 'center'}}>
                <Typography color='secondary.main' fontWeight={'fontWeightBold'}>
                    Request Measurement
                </Typography>
                <CustomButton variant="contained" color='secondary' disabled={selectedMeasurements.length === 0} onClick={handleSubmit}>
                    Send
                </CustomButton>
              </Box>
              <List sx ={{maxHeight : "20vh", overflow: 'scroll'}}>
                  {selectedMeasurements.length > 0 && selectedMeasurements.map((measurement, i) => (
                      <ListItem key={i}
                        secondaryAction={
                            <Checkbox
                                edge="end"
                                checked={selectedMeasurements.includes(measurement)}
                                onChange={() => addRemoveMeasurement(measurement)}
                                tabIndex={-1}
                                disableRipple
                                inputProps={{ 'aria-labelledby': i }}
                            />
                        }
                      >
                          <ListItemText primary = {measurement}/>
                          
                      </ListItem>
                  ))}
                  <ListItemButton onClick = {() => setMeasurementsModal(true)}>
                    <ListItemText primary = {'Add an Option'} />
                  </ListItemButton>
              </List>
              <ListItem>
                <ListItemText primary = {`You can add ${8 - selectedMeasurements.length} more options`} primaryTypographyProps={{sx:{color: 'GrayText'}}}/>
            </ListItem>
          </Box>
        </SwipeableDrawer>
      </Drawer>
      <Modal open={measurementsModal} onClose={()=> setMeasurementsModal(false)}>
          <Box sx ={{ position: 'absolute', top: '50%', left: '50%',transform: 'translate(-50%, -50%)'}}>
              <Card>
                  <CardContent>
                    <Typography color='secondary.main' fontWeight={'fontWeightBold'}>
                        Select measurements
                    </Typography>
                    <List sx={{maxHeight: '250px', overflow: 'scroll'}}>
                        {measurementTypes.map((type,i) => (
                            <ListItemButton key={i} onClick={() => addRemoveMeasurement(type)}>
                                <ListItemText primary = {type}/>
                                <ListItemIcon sx={{minWidth: 0}}>
                                    <Checkbox
                                    edge="end"
                                    checked={selectedMeasurements.includes(type)}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': i }}
                                    />
                                </ListItemIcon>
                            </ListItemButton>
                        ))}
                    </List>
                  </CardContent>
              </Card>
          </Box>
      </Modal>
      </>
    )
}