import React from "react";
import { IconButton, Typography, Divider, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { withStyles} from "@mui/styles";

const CustomMenuItem = withStyles((theme) => ({
    root: {
        paddingTop:theme.spacing(1), 
        fontSize:14,
    }
}))(MenuItem);

export default function OrderMenuBar({isRefashionerPOV}) {
    const [orderMenuAnchor, setOrderMenuAnchor] = React.useState(null);
    const isOrderMenuOpen = Boolean(orderMenuAnchor);
    const handleOpenOrderMenu = (event) => {
      setOrderMenuAnchor(event.currentTarget);
    };
    const handleOrderMenuClose = () => {
        setOrderMenuAnchor(null);
    };
    return (
        <>
        <IconButton id='order-more-button' onClick={handleOpenOrderMenu} aria-controls={isOrderMenuOpen ? 'order-menu' : undefined} aria-haspopup="true" aria-expanded={isOrderMenuOpen ? 'true' : undefined}>
            <MoreVertIcon fontSize="large"/>
        </IconButton>
        {isRefashionerPOV ? 
        <Menu
            id='order-menu'
            anchorEl={orderMenuAnchor}
            open={isOrderMenuOpen}
            onClose={handleOrderMenuClose}
            MenuListProps={{
            'aria-labelledby': 'order-more-button',
            }}
        >
            <Typography sx={{paddingLeft: '16px'}} variant='h6'>Manage</Typography>
            <Divider orientation='horizontal' sx={{marginBottom:1}}/>
                <CustomMenuItem >Edit Order Listing</CustomMenuItem>
                <CustomMenuItem >Delete Order Listing</CustomMenuItem>
                <CustomMenuItem >Deactive Listing</CustomMenuItem>
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
            <Typography sx={{paddingLeft: '16px'}} variant='h6'>Manage</Typography>
            <Divider orientation='horizontal' sx={{marginBottom:1}}/>
                <CustomMenuItem >View Refashioner's Profile</CustomMenuItem>
        </Menu>
        }
        </>
    )
}