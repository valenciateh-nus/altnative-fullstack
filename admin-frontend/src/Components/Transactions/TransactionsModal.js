import React from 'react'
import { Chip, Box, Container, Grid, Typography, List, ListItemButton, ListItem, ListItemText, Paper, IconButton, ListItemIcon, CircularProgress, Button } from '@mui/material'
import ProfileCard from '../ProfileCard';
import { openImageModal } from '../../Redux/actions';
import { useDispatch } from 'react-redux';
import { CustomList } from '../CustomList';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CustomButton from '../CustomButton';
import { apiWrapper } from '../../API';
import { approveRefashionerRegistrationRequest, rejectRefashionerRegistrationRequest, approveRefashionerRegistrationRequestWithCertifications } from '../../API/refashionerRegistrationApi';
import SuccessModal from '../SuccessModal';
import moment from 'moment';
import { useTheme } from '@mui/styles';
import { retrieveOfferById } from '../../API/offerApi';
import { retrieveOrderById } from '../../API/orderApi';
import InContainerLoading from '../InContainerLoading';
import OfferChatCard from '../Chat/OfferChatCard';
import OrderList from '../OrderList';


export default function TransactionsModal({transaction = {}}) {
    const[isSuccess, setIsSuccess] = React.useState(false);
    const[offer,setOffer] = React.useState({});
    const[order,setOrder] = React.useState({});
    const[isLoading, setIsLoading] = React.useState(false);
    const theme = useTheme();

    const dispatch = useDispatch();
    
    // React.useEffect(() => {
    //     if(transaction) {
    //         getData();
    //     }
    // },[transaction])

    async function getData(txn) {
        setIsLoading(true);
        if(txn.offerId) {
            getOffer(txn.offerId);
        }
        if(txn.order2) {
            getOrder(txn.order2.id);
        }
        setIsLoading(false);
    }

    async function getOffer(id) {
        const res = await apiWrapper(retrieveOfferById(id),'',true);
        if(res) {
            setOffer(res.data);
        }
    }

    async function getOrder(id) {
        const res = await apiWrapper(retrieveOrderById(id),'',true)
        if(res) {
            setOrder(res.data);
        }
    } 

    const chipStyle = {
        background: theme.palette.secondary.main,
        fontWeight: "bold",
        color: "white",
        padding: 1,
        fontSize: 14
    }

    return (
        !isLoading ? <Container>
            <Box>
                <Typography variant='h4' gutterBottom>Transaction #{transaction.id}</Typography>
                <Typography variant='h5' sx={{mt : 2}}>Status</Typography>
                <Chip label={transaction.paymentStatus} sx={chipStyle}/>
                <Typography variant='h5' gutterBottom>Transaction value</Typography>
                <Typography variant='text'>SGD ${transaction.amount}</Typography>
                <Typography variant='h5' sx={{mt : 3, mb : 1}}>Date Created</Typography>
                <Typography variant='text'>SGD ${moment(transaction.dateCreated).format('DD MMM yyyy')}</Typography>
                <Typography variant='h5' sx={{mt : 3, mb : 1}}>Date Completed</Typography>
                <Typography variant='text'>SGD ${moment(transaction.dateCompleted).isValid()? moment(transaction.dateCompleted).format('DD MMM yyyy') : '-'}</Typography>
                {transaction.offerId && <>
                    <Typography variant='h5' sx={{mt : 3, mb : 1}}>Offer details</Typography>
                    <OfferChatCard offerId={transaction.offerId} showButtons = {false} viewOnly={true}/>
                </>}
                {transaction.order2 && <>
                    <Typography variant='h5' sx={{mt : 3, mb : 1}}>Order details</Typography>
                    <OrderList title={transaction.order2.offerTitle} name={transaction.order2.refashionerUsername} status={transaction.order2.orderStatus} id={transaction.order2.id} chat={transaction.order2.chatAlternateId}/>
                </>}
            </Box>
        </Container> : <InContainerLoading/>
    )
}
