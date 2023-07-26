import React from "react";
import { Box, IconButton, Typography, Divider, Menu, MenuItem, Dialog, DialogTitle, DialogActions } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { withStyles } from "@mui/styles";
import { useNavigate } from 'react-router'
import { ERROR } from "../../Redux/actionTypes";
import * as indexApi from '../../API/index.js';
import { useDispatch } from "react-redux";
import CustomButton from "../CustomButton.js";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const CustomMenuItem = withStyles((theme) => ({
    root: {
        paddingTop: theme.spacing(1),
        fontSize: 14,
    }
}))(MenuItem);

export default function OrderMenuBar({ isBusinessPOV, listing }) {
    const [orderMenuAnchor, setOrderMenuAnchor] = React.useState(null);
    const [isDeletionModalOpen, setIsDeletionModalOpen] = React.useState(false);
    const dispatch = useDispatch(); 

    const isOrderMenuOpen = Boolean(orderMenuAnchor);
    const navigate = useNavigate();
    const handleOpenOrderMenu = (event) => {
        setOrderMenuAnchor(event.currentTarget);
    };
    const handleOrderMenuClose = () => {
        setOrderMenuAnchor(null);
    };

    async function handleDelete() {
        console.log('delete request')
        try {
            await indexApi.deleteRequestById(listing.id);
            navigate(-1);
        } catch (error) {
            const data = error?.response?.data?.message
            console.log("ERROR MSG: " + JSON.stringify(error));
            dispatch({ type: ERROR, data })
        }
    }

    return (
        <>
            <IconButton id='order-more-button' onClick={handleOpenOrderMenu} aria-controls={isOrderMenuOpen ? 'order-menu' : undefined} aria-haspopup="true" aria-expanded={isOrderMenuOpen ? 'true' : undefined}>
                <MoreVertIcon fontSize="large" />
            </IconButton>
            {isBusinessPOV ?
                <Menu
                    id='order-menu'
                    anchorEl={orderMenuAnchor}
                    open={isOrderMenuOpen}
                    onClose={handleOrderMenuClose}
                    MenuListProps={{
                        'aria-labelledby': 'order-more-button',
                    }}
                >
                    <Typography sx={{ paddingLeft: '16px' }} variant='h6'>Manage</Typography>
                    <Divider orientation='horizontal' sx={{ marginBottom: 1 }} />
                    {listing.requestStatus === 'DRAFT' && (
                        <CustomMenuItem onClick={() => navigate(`/createBusinessRequest/${listing.id}`)}>Edit Business Request</CustomMenuItem>
                    )}
                    <CustomMenuItem onClick={() => setIsDeletionModalOpen(true)}>Delete Business Request</CustomMenuItem>
                </Menu> :
                <Menu
                    id='order-menu'
                    anchorEl={orderMenuAnchor}
                    open={isOrderMenuOpen}
                    onClose={handleOrderMenuClose}
                    MenuListProps={{
                        'aria-labelledby': 'order-more-button',
                    }}
                >
                    <Typography sx={{ paddingLeft: '16px' }} variant='h6'>Manage</Typography>
                    <Divider orientation='horizontal' sx={{ marginBottom: 1 }} />
                    <CustomMenuItem >View Business's Profile</CustomMenuItem>
                </Menu>
            }
            <Dialog
                open={isDeletionModalOpen}
                onClose={() => setIsDeletionModalOpen(false)}
                aria-labelledby="alert-dialog-final-rejection"
                aria-describedby="alert-dialog-final-rejection"
                onBackdropClick={() => setIsDeletionModalOpen(false)}
            >
                <Box sx={{ backgroundColor: 'primary.main', display: 'flex', flexDirection: 'row', maxWidth: '450px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '15%', minWidth: '64px', paddingTop: '16px' }}>
                        <InfoOutlinedIcon fontSize='large' />
                    </Box>
                    <Box>
                        <DialogTitle id="final-rejection" sx={{ paddingLeft: 0, paddingRight: 0 }}>
                            Confirm Delete Request #{listing.id}?
                        </DialogTitle>
                        <DialogActions sx={{ marginBottom: '16px' }}>
                            <CustomButton variant='contained' onClick={() => setIsDeletionModalOpen(false)} sx={{ backgroundColor: 'secondary.light' }}>Cancel</CustomButton>
                            <CustomButton variant='contained' color="secondary" onClick={handleDelete} autoFocus>
                                Delete
                            </CustomButton>
                        </DialogActions>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '15%', minWidth: '64px', paddingTop: '16px' }} />
                </Box>
            </Dialog>
        </>
    )
}