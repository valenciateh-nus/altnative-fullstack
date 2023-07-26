import { Avatar, Button, Card, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Rating, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router';
import { apiWrapper } from "../../API";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DoneIcon from '@mui/icons-material/Done';
import CustomButton from "../CustomButton";
import ClearIcon from '@mui/icons-material/Clear';
import { acceptOfferForListing, rejectOffer, retrieveOfferById } from "../../API/offerApi";

const BidCard = ({ bid }) => {
  const user = [{ rating: 4 }]
  const history = useNavigate();

  return (
    <>
      <Card sx={{ minWidth: 300, maxWidth: 300, height: '95%', mr: 2, mt: 0.4, ml: 1, boxShadow: '1px 1px 1px 1px #9f9f9f', p: 2, overflow: 'scroll', position: 'relative' }}>
        <Grid container spacing={1}>
          <Grid item xs={12} container sx={{ overflowWrap: 'break-word', ml: 1, mt: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Avatar src={bid.appUser?.avatar?.url} alt={bid.appUser.name} sx={{ maxWidth: '55px', maxHeight: '55px', height: '4em', width: '4em', bgcolor: '#FB7A56', marginRight: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='h7' fontWeight={600}>{bid.appUser.username}</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Rating value={bid.appUser.rating} readOnly sx={{ mr: 1 }} />
                  <Typography variant='body1' color='GrayText'>{`(${Math.round(bid.appUser.rating).toFixed(1)})`}</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid item container xs={12} spacing={0} sx={{ overflow: 'scroll', height: 220, mt: 1, overflowY: 'scroll'}}>
            <Grid item xs={12}>
              <Typography variant="h7" fontWeight={550}>
                Request Title
              </Typography>
              <Typography sx={{ fontSize: 16 }}>
                {bid.projectRequest.title}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h7" fontWeight={550}>
                Quantity:
              </Typography>
              <Typography sx={{ fontSize: 16 }}>
                {bid.quantity}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h7" fontWeight={550}>
                Proposed Deadline:
              </Typography>
              <Typography sx={{ fontSize: 16 }}>
                {moment(bid.proposedCompletionDate).format("DD/MM/YYYY")}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h7" fontWeight={550}>
                Description:
              </Typography>
              <Typography sx={{ fontSize: 16 }}>
                {bid.description}
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={12} container sx={{ mt: 0 }}>
            {bid.offerStatus == 'PENDING_RESPONSE' ? (
              <>
                {/* <Grid item xs={6}>
                <Button variant="contained" color="success" sx={{ fontWeight: 550, width: '95%', mt: 3 }} onClick={handleOnAccept}>
                  Accept
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="contained" color="error" sx={{ fontWeight: 550, width: '95%', mt: 3 }}>
                  Reject
                </Button>
              </Grid> */}
              <Grid item xs={12} lg={12}>
                <CustomButton sx={{ marginRight: 1, marginTop: 1, width: '90%', position: 'absolute', bottom: 15, pointer: 'default'}} size="small" variant="contained" color="secondary">
                  {bid.offerStatus}
                </CustomButton>                
              </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <CustomButton sx={{ marginRight: 1, marginTop: 1, width: '90%', position: 'absolute', bottom: 15, pointer: 'default' }} size="small" variant="contained" color={bid.offerStatus === 'ACCEPTED' ? 'success' : 'error'}>
                  {bid.offerStatus}
                </CustomButton>
              </Grid>
            )}

          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default BidCard;