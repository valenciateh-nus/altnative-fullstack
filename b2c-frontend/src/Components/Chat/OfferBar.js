import { Modal } from '@mui/material';
import { Box } from '@mui/system';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { ERROR } from '../../Redux/actionTypes';
import CustomButton from '../CustomButton';
import BusinessRequestOfferCard from './BusinessRequestOfferCard';
import DeadstockOfferCard from './DeadstockOfferCard';
import MarketplaceOfferCard from './MarketplaceOfferCard';
import OfferCard from './OfferCard';

export default function OfferBar({ createOffer, showDeny, isMpl, topic, handleDecline, isBusiness }) {

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const dispatch = useDispatch();

    async function handleSubmit(offerForm) {
        const res = await createOffer(offerForm);
        console.log("OFFER RES: " + typeof res);
        if (typeof res === 'boolean') {
            setIsModalOpen(false)
        } else {
            dispatch({ type: ERROR, data: res });
        }
        //setIsModalOpen(false);
    }

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'row', marginBottom: '8px', marginTop: '12px' }}>
                <CustomButton color='secondary' variant='contained' fullWidth sx={{ marginRight: '6px' }} onClick={() => setIsModalOpen(true)}>Make an offer</CustomButton>
                {showDeny && <CustomButton onClick={handleDecline} variant='contained' fullWidth sx={{ marginLeft: '6px', backgroundColor: 'secondary.light' }}>Decline project</CustomButton>}
            </Box>
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    {isBusiness ? (
                        (!isMpl ? <BusinessRequestOfferCard handleSubmit={handleSubmit} topic={topic}/> : <DeadstockOfferCard handleSubmit={handleSubmit} topic={topic} />)
                    ) : (
                        (!isMpl ? <OfferCard handleSubmit={handleSubmit} /> : <MarketplaceOfferCard handleSubmit={handleSubmit} topic={topic} />)
                    )}
                </Box>
            </Modal>
        </>
    )
}