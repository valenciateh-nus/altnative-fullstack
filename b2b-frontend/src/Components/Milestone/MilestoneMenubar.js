import React from "react";
import { IconButton, Typography, Divider, Menu, MenuItem, Drawer, SwipeableDrawer, ListItemText, ListItemButton, List, ListItem, Modal, CardHeader, Card, CardContent, ListItemIcon } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { withStyles} from "@mui/styles";
import { retrieveMilestones, createMilestone } from "../../API/milestoneApi";
import { apiWrapper } from "../../API";

import { MEASUREMENTS_REQUESTED, FINAL_APPROVAL_PENDING, PROGRESS_UPDATE, PROGRESS_UPDATE_REQUEST, ADD_ON_ORDER_STARTED, ADD_ON_OFFER_MADE, FINAL_APPROVAL_OK } from "./MilestoneTypes"
import { Box } from "@mui/system";
import { set } from "date-fns";
import Checkbox from '@mui/material/Checkbox';
import ClearIcon from '@mui/icons-material/Clear';
import CustomButton from "../CustomButton";
import RequestMeasurements from "./RequestMeasurements";
import RequestCourier from "./RequestCourier";
import OfferCard from "../Chat/OfferCard";
import { createOfferForAddOn } from "../../API/addOnApi";
import { createDelivery } from "../../API/deliveryApi";
import { useNavigate } from "react-router";

const CustomMenuItem = withStyles((theme) => ({
    root: {
        paddingTop:theme.spacing(1), 
        fontSize:14,
    }
}))(MenuItem);

export default function MilestoneMenubar({isRefashionerPOV, orderId, handleRefresh,createMilestone, milestoneTypes = [], disputable=true, order}) {
    const [milestoneMenuAnchor, setMilestoneMenuAnchor] = React.useState(null);

    const isMilestoneMenuOpen = Boolean(milestoneMenuAnchor);

    const [isDeliveryDrawer, setIsDeliveryDrawer] = React.useState(false);
    const [isMeasurementDrawer, setIsMeasurementDrawer] = React.useState(false);
    const [isAddOnModalOpen, setIsAddOnModalOpen] = React.useState(false);

    const navigate = useNavigate();
    
    const handleOpenMilestoneMenu = (event) => {
        setMilestoneMenuAnchor(event.currentTarget);
    };
    const handleMilestoneMenuClose = () => {
        setMilestoneMenuAnchor(null);
    };

    async function handleRequestMeasurement(remarks) {
       
        let newMilestone = {
            milestoneEnum : MEASUREMENTS_REQUESTED,
            remarks : remarks,
        }

        await createMilestone(newMilestone, null);
        setIsMeasurementDrawer(false);
    }

    function handleRequestProgress() {
        let newMilestone = {
            milestoneEnum : PROGRESS_UPDATE_REQUEST,
            remarks: ""
        }
        createMilestone(newMilestone, null);
    }

    const handleSubmitProgressPictures = (e) => {
        let newMilestone = {
            milestoneEnum : PROGRESS_UPDATE,
            remarks: ""
        }
        createMilestone(newMilestone, e.target.files);
    }

    const handleSubmitFinalPictures = (e) => {
        let remark = {
            hasResponded : false
        }
        let newMilestone = {
            milestoneEnum : FINAL_APPROVAL_PENDING,
            remarks: JSON.stringify(remark),
        }
        createMilestone(newMilestone, e.target.files);
    }

    async function handleSubmitAddOn(offerForm) {
        const res = await apiWrapper(createOfferForAddOn(orderId, offerForm), "", true);
        if(res) {
            handleRefresh();
            setIsAddOnModalOpen(false);
        }
       
    }

    async function handleCreateDelivery(origin, deliveryDate, itemForm) {
        let formData = {
            origin : origin,
            destination : "",
            arrangedDate : deliveryDate,
            weight : itemForm.weight,
            height : itemForm.height,
            width : itemForm.width,
            length : itemForm.length,
        }

        const res = await apiWrapper(createDelivery(orderId, formData), "", true);
        if(res) {
            handleRefresh();
            setIsDeliveryDrawer(false);
        }
        return;
    }

    function handleToggleMeasurementDrawer() {
        setIsMeasurementDrawer(true);
        handleMilestoneMenuClose();    
    }
    
    function handleToggleDeliveryDrawer() {
        setIsDeliveryDrawer(true);
        handleMilestoneMenuClose();    
    }

    function handleToggleAddOnModal() {
        setIsAddOnModalOpen(true);
        handleMilestoneMenuClose();    
    }

    return (
        <>
        <IconButton id='milestone-plus-button' onClick={handleOpenMilestoneMenu} aria-controls={isMilestoneMenuOpen ? 'milestone-plus-menu' : undefined} aria-haspopup="true" aria-expanded={isMilestoneMenuOpen ? 'true' : undefined}>
            <AddCircleOutlineIcon sx={{height:'40px', width : '40px'}}/>
        </IconButton>
        {isRefashionerPOV ? 
        <Menu
            id='milestone-plus-menu'
            anchorEl={milestoneMenuAnchor}
            open={isMilestoneMenuOpen}
            onClose={handleMilestoneMenuClose}
            MenuListProps={{
            'aria-labelledby': 'milestone-plus-button',
            }}
        >
            <Typography sx={{paddingLeft: '16px'}} variant='h6'>Manage</Typography>
            <Divider orientation='horizontal' sx={{marginBottom:1}}/>
                <CustomMenuItem onClick={handleToggleMeasurementDrawer}>Request Measurement</CustomMenuItem>
                <input
                        accept="image/*"
                        hidden
                        id="progress-update-button"
                        type="file"
                        multiple
                        onChange={handleSubmitProgressPictures}
                />
                <label htmlFor="progress-update-button">
                    <CustomMenuItem component="span">Upload Progress Picture</CustomMenuItem>
                </label>
                {order.orderStatus === "ACCEPTED" && <><input
                        accept="image/*"
                        hidden
                        id="final-update-button"
                        type="file"
                        multiple
                        onChange={handleSubmitFinalPictures}
                />
                <label htmlFor="final-update-button">
                    {!milestoneTypes.includes(FINAL_APPROVAL_OK) && <CustomMenuItem component="span">Upload Final Picture</CustomMenuItem>}
                </label>
                </>}
                <CustomMenuItem onClick={handleToggleDeliveryDrawer}>Arrange for courier</CustomMenuItem>
                <CustomMenuItem onClick={handleToggleAddOnModal}>Create Add On</CustomMenuItem>
                {disputable && (
                    <CustomMenuItem onClick={() => navigate('/report/' + orderId)}>Report Order</CustomMenuItem>
                )}
                <CustomMenuItem onClick={handleRefresh}>Refresh</CustomMenuItem>
        </Menu> :
        <Menu
            id='milestone-plus-menu'
            anchorEl={milestoneMenuAnchor}
            open={isMilestoneMenuOpen}
            onClose={handleMilestoneMenuClose}
            MenuListProps={{
            'aria-labelledby': 'milestone-plus-button',
            }}
        >
            <Typography sx={{paddingLeft: '16px'}} variant='h6'>Manage</Typography>
            <Divider orientation='horizontal' sx={{marginBottom:1}}/>
                <CustomMenuItem onClick={handleToggleDeliveryDrawer}>Arrange for courier</CustomMenuItem>
                {/* <CustomMenuItem onClick = {handleRequestProgress}>Request Progress Picture</CustomMenuItem> */}
                <CustomMenuItem onClick={() => navigate('/report/' + orderId)}>Report Order</CustomMenuItem>
                <CustomMenuItem onClick={handleRefresh}>Refresh</CustomMenuItem>
        </Menu>
        }
        <RequestMeasurements isMeasurementDrawer={isMeasurementDrawer} setIsMeasurementDrawer={setIsMeasurementDrawer} handleRequestMeasurement={handleRequestMeasurement}/>
        <RequestCourier isDeliveryDrawer={isDeliveryDrawer} setIsDeliveryDrawer={setIsDeliveryDrawer} handleCreateDelivery={handleCreateDelivery}/>
        <Modal open={isAddOnModalOpen} onClose={()=> setIsAddOnModalOpen(false)}>
          <Box sx ={{ position: 'absolute', top: '50%', left: '50%',transform: 'translate(-50%, -50%)'}}>
              <OfferCard handleSubmit={handleSubmitAddOn} isAddOn={true}/>
          </Box>
        </Modal>
        </>
    )
}