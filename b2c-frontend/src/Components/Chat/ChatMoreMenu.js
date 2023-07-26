import React from "react";
import { IconButton, Typography, Divider, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Modal } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { withStyles} from "@mui/styles";
import { Box } from "@mui/system";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import CustomButton from "../CustomButton";
import { apiWrapper } from "../../API";
import { deleteChat } from "../../API/chatApi";
import OfferCard from "./OfferCard";
import { useDispatch } from "react-redux";
import { ERROR } from "../../Redux/actionTypes";
import MarketplaceOfferCard from "./MarketplaceOfferCard";
import { useNavigate } from "react-router";

const CustomMenuItem = withStyles((theme) => ({
    root: {
        paddingTop:theme.spacing(1), 
        fontSize:14,
    }
}))(MenuItem);

export default function ChatMoreMenu({canOffer, canDelete, chatId,handleDeleteChat, createOffer, isMpl, topic, otherUser}) {
    const [chatMoreAnchor, setChatMoreAnchor] = React.useState(null);
    const isChatMoreAnchorOpen = Boolean(chatMoreAnchor);
    const [isRejectionModalOpen, setIsRejectionModalOpen] = React.useState(false);
    const handleOpenChatMenuOpen = (event) => {
        setChatMoreAnchor(event.currentTarget);
    };
    const handleChatMenuClose = () => {
        setChatMoreAnchor(null);
    };

    const handleCancelDelete = () => {
        setIsRejectionModalOpen(false);
        setChatMoreAnchor(null);
    }

    const handleDelete = () => {
        console.log('DELETE CLICKED');
        handleDeleteChat(chatId);
    }

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const[isOfferModalOpen, setIsOfferModalOpen] = React.useState(false);

    async function handleSubmit(offerForm) {
        const res = await createOffer(offerForm);
        console.log("OFFER RES: " + typeof res);
        if(typeof res === 'boolean') {
            setIsOfferModalOpen(false)
        } else {
            dispatch({type: ERROR, data : res});
        }
        //setIsModalOpen(false);
    }
    



    return (
        <>
        <IconButton id='chat-more-button' onClick={handleOpenChatMenuOpen} aria-controls={isChatMoreAnchorOpen ? 'chat-more-menu' : undefined} aria-haspopup="true" aria-expanded={isChatMoreAnchorOpen ? 'true' : undefined}>
            <MoreVertIcon />
        </IconButton>
        <Menu
            id='chat-more-menu'
            anchorEl={chatMoreAnchor}
            open={isChatMoreAnchorOpen}
            onClose={handleChatMenuClose}
            MenuListProps={{
            'aria-labelledby': 'chat-more-button',
            }}
        >
            {canDelete && <CustomMenuItem onClick={() => setIsRejectionModalOpen(true)}>Delete chat</CustomMenuItem>}
            {canOffer && <CustomMenuItem onClick={() => setIsOfferModalOpen(true)}>Make Offer</CustomMenuItem>}
            <CustomMenuItem onClick={() => navigate('/profile/' + otherUser.username)}>View Profile</CustomMenuItem>
        </Menu>
        <Dialog
            open={isRejectionModalOpen}
            onClose={() => setIsRejectionModalOpen(false)}
            aria-labelledby="alert-dialog-final-rejection"
            aria-describedby="alert-dialog-final-rejection"
            onBackdropClick = {handleCancelDelete}
        >
            <Box sx={{backgroundColor : 'primary.main', display:'flex', flexDirection:'row', maxWidth: '450px'}}>
                <Box sx={{display : 'flex', justifyContent:'center', width: '15%', minWidth: '64px', paddingTop : '16px'}}>
                  <InfoOutlined fontSize='large'/>
                </Box>
                <Box>
                  <DialogTitle id="final-rejection" sx={{paddingLeft: 0, paddingRight: 0}}>
                      Confirm Delete?
                  </DialogTitle>
                  <DialogContent sx={{padding: 0}}>
                    <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete this chat? It will be deleted for both users.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions sx={{marginBottom:'16px'}}>
                      <CustomButton variant='contained' onClick={handleCancelDelete} sx={{backgroundColor:'secondary.light'}}>Cancel</CustomButton>
                      <CustomButton variant='contained' color="secondary" onClick={handleDelete} autoFocus>
                          Confirm
                      </CustomButton>
                  </DialogActions>
                </Box>
                <Box sx={{display : 'flex', justifyContent:'center', width: '15%', minWidth: '64px', paddingTop : '16px'}}/>
            </Box>
        </Dialog>
        <Modal open = {isOfferModalOpen} onClose ={() => setIsOfferModalOpen(false)}>
            <Box sx ={{ position: 'absolute', top: '50%', left: '50%',transform: 'translate(-50%, -50%)'}}>
                {!isMpl ? <OfferCard handleSubmit={handleSubmit}/> : <MarketplaceOfferCard handleSubmit={handleSubmit} topic={topic}/>}
            </Box>
        </Modal>
        </>
    )
}