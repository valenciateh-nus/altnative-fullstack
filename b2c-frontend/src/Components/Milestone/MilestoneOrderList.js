import ArrowBack from '@mui/icons-material/ArrowBack';
import { List, ListItemButton, Box, ListItem, Grid, IconButton, Typography, Divider } from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';
import OfferChatCard from '../Chat/OfferChatCard';
import Milestone from './Milestone';
import MilestoneMenubar from './MilestoneMenubar';

export default function MilestoneOrderList({orders = [], otherUser}) {

    const currUser = useSelector((state) => state.authData);
    const[selectedOrder, setSelectedOrder] = React.useState(null);

    function handleBack() {
        setSelectedOrder(null);
    }

    console.log("selected", selectedOrder);

    return (
        !selectedOrder?.id ?
        <Box sx={{display: 'flex', flexDirection : 'column', margin: 2}}>
        <Typography variant='h5' fontWeight={700} sx={{paddingLeft: 2}}>Orders</Typography>
        <Typography variant='caption' color='GrayText' sx={{paddingLeft: 2}}>Select an order to view its milestones</Typography>
        <List>
        {orders.length > 0 && orders.slice().reverse().map((order,i) => (
            <ListItem sx={{cursor : 'pointer'}} key={i} onClick={() => setSelectedOrder(order)}>
                <OfferChatCard offerId={order.offerId} showButtons={false} maxWidth={'100%'} minWidth={'100%'}/>
            </ListItem>
        ))}
        </List>
        </Box>
        : <Milestone orderId={selectedOrder.id} order={selectedOrder} deliveries={selectedOrder.deliveries} isRefashionerPOV={currUser.sub === selectedOrder.refashionerUsername} otherUser={otherUser} handleBack={handleBack}/>
    )
}