import React from "react";
import { IconButton, Typography, Divider, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Modal } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { withStyles} from "@mui/styles";
import { Box } from "@mui/system";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import CustomButton from "../CustomButton";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { apiWrapper } from "../../API/index";
import LoadingModal from "../LoadingModal";
import SuccessModal from "../SuccessModal";
import { suspendUser, unblockUser } from "../../API/userApi";
import ConfirmationDialog from "../ConfirmationDialog";

const CustomMenuItem = withStyles((theme) => ({
    root: {
        paddingTop:theme.spacing(1), 
        fontSize:14,
    }
}))(MenuItem);

export default function RequestsMoreMenu({selected = [], handleRefresh}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const isanchorElOpen = Boolean(anchorEl);
    const [isSuspendModal, setIsSuspendModal] = React.useState(false);
    const [isReactivateModal, setIsReactivateModal] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [successMsg, setSuccessMsg] = React.useState("");

    const handleOpenChatMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleChatMenuClose = () => {
        setAnchorEl(null);
    };

    function handleCloseSuccess() {
        setIsSuccess(false);
    }

    const handleCancelDelete = () => {
        setIsSuspendModal(false);
        setAnchorEl(null);
    }

    const handleDelete = async () => {
        setIsLoading(true);
        let responses = []
        //console.log("DELETING: ", JSON.stringify(selected));
        for(const user of selected) {
            const res = await suspendUserFunc(user.username);
            responses.push(res);
        }
        setIsLoading(false);
        setSuccessMsg(responses.join('\n'));
        setIsSuccess(true);
        setAnchorEl(null);
        setIsSuspendModal(false);
    }

    const handleCancelReactivate = () => {
        setIsReactivateModal(false);
        setAnchorEl(null);
    }

    const handleReactivate = async () => {
        setIsLoading(true);
        let responses = []
        //console.log("REACTIVATING: ", JSON.stringify(selected));
        for(const user of selected) {
            const res = await reactivateUserFunc(user.username);
            responses.push(res);
        }
        setIsLoading(false);
        setSuccessMsg(responses.join('\n'));
        setIsSuccess(true);
        setAnchorEl(null);
        setIsReactivateModal(false);
    }

    async function suspendUserFunc(username) {
        const res = await apiWrapper(suspendUser(username),"", false);
        if(res) {
            console.log("Successfully suspended: " + username);
            return "Successfully suspended: " + username;
        } 
        return "Error occurred while suspending: " + username + ". Please ensure user is not already suspended.";
    }

    async function reactivateUserFunc(username) {
        const res = await apiWrapper(unblockUser(username),"", false);
        if(res) {
            console.log("Successfully reactivated: " + username);
            return "Successfully reactivated: " + username;
        } 
        return "Error occurred while reactivating: " + username + ". Please ensure user is not already active.";
    }

    const navigate = useNavigate();

    const dispatch = useDispatch();


    return (
        <>
        <IconButton id='chat-more-button' onClick={handleOpenChatMenuOpen} aria-controls={isanchorElOpen ? 'chat-more-menu' : undefined} aria-haspopup="true" aria-expanded={isanchorElOpen ? 'true' : undefined}>
            <MoreVertIcon />
        </IconButton>
        <Menu
            id='chat-more-menu'
            anchorEl={anchorEl}
            open={isanchorElOpen}
            onClose={handleChatMenuClose}
            MenuListProps={{
            'aria-labelledby': 'chat-more-button',
            }}
        >
            <CustomMenuItem onClick={() => setIsSuspendModal(true)} disabled={selected.length === 0 || selected.filter((user) => user.accountStatus === "SUSPENDED").length > 0}>Suspend</CustomMenuItem>
            <CustomMenuItem onClick={() => setIsReactivateModal(true)} disabled={selected.length === 0 || selected.filter((user) => user.accountStatus === "ACTIVE").length > 0}>Reactivate</CustomMenuItem>
        </Menu>
        <ConfirmationDialog open={isSuspendModal} handleClose={() => setIsSuspendModal(false)} 
            handleConfirm = {handleDelete} handleCancel = {handleCancelDelete} header = {'Confirm Delete?'} 
            dialogText = {'Are you sure you want to Suspend the selected users? Selected users will no longer have access to their accounts.'}
        />
        <ConfirmationDialog open={isReactivateModal} handleClose={() => setIsReactivateModal(false)} 
            handleConfirm = {handleReactivate} handleCancel = {handleCancelReactivate} header = {'Confirm Reactivation?'} 
            dialogText = {'Are you sure you want to reactivate the selected users? Selected users will regain access to their accounts.'}
        />
        <LoadingModal open = {isLoading} text={"Suspending users..."}/>
        <SuccessModal open = {isSuccess} onClose={handleCloseSuccess} text={successMsg} onCallback={handleRefresh} time={5000}/> 
        </>
    )
}