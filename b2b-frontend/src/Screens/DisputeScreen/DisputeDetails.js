import { Button, Card, CardContent, Dialog, DialogActions, DialogTitle, Divider, Grid, ImageListItem, Modal, SvgIcon, TextField, Typography } from '@mui/material';
import React from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft as ArrowIcon, Divide } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import * as orderApi from '../../API/orderApi';
import * as disputeApi from '../../API/disputeApi.js';
import OrderList from '../../Components/Orders/OrderList';
import { Box } from '@mui/system';
import { openImageModal } from '../../Redux/actions';
import InContainerLoading from '../../Components/InContainerLoading';
import CustomButton from "../../Components/CustomButton";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import * as MilestoneApi from '../../API/milestoneApi'
import { apiWrapper } from "../../API";
import { DISPUTE_REQUEST_PENDING_REVIEW, DISPUTE_REQUEST_REJECTED, DISPUTE_REQUEST_COMPLETED, DISPUTE_REQUEST_ACCEPTED, DISPUTE_REQUEST_REFUND_PENDING } from '../../Components/Milestone/MilestoneTypes';
import CancelIcon from '@mui/icons-material/Cancel';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';

const DisputeDetails = () => {
  const navigate = useNavigate(-1);
  const { id = 0 } = useParams();
  const dispatch = useDispatch();
  const [order, setOrder] = React.useState([]);
  const [photos, setPhotos] = React.useState([]);
  const [rejectReason, setRejectReason] = React.useState('');
  const currUserData = useSelector((state) => state.currUserData);
  const [loading, setLoading] = React.useState(false);
  const [dispute, setDispute] = React.useState([]);
  const [isDeletionModalOpen, setIsDeletionModalOpen] = React.useState(false);
  const [isAcceptanceModalOpen, setIsAcceptanceModalOpen] = React.useState(false);
  const [disputeUser, setDisputeUser] = React.useState('');
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isFail, setIsFail] = React.useState(false);
  const [isRejected, setIsRejected] = React.useState(false);

  let timer = null;
  React.useEffect(() => {
    setLoading(true);
    if (id) {
      getDisputeById();
    }
  }, [id])

  const getDisputeById = async () => {
    try {
      await disputeApi.retrieveDisputeById(id).then((val) => {
        console.log("DISPUTE DATA:", val.data);
        setDispute(val.data);
        setPhotos(val.data.photos);
        setDisputeUser(val.data.appUser)
        getOrder(val.data.orderId);
      })
    } catch (error) {
      setDispute([]);
    }
  }

  const getOrder = async (orderId) => {
    try {
      await orderApi.getOrderById(orderId).then((val) => {
        console.log("DISPUTE DATA: ORDER: ", val.data);
        setOrder(val.data);
      })
    } catch (error) {
      console.log("DISPUTE DATA: ORDER: ERROR: ", error);
      setOrder([]);
    } finally {
      setLoading(false);
    }
  }

  function handlePhotoModal(images, index) {
    dispatch(openImageModal(images, index))
  }

  const goBack = () => {
    navigate(-1);
  }

  async function createMilestone(milestone, images) {
    console.log('creating new milestone')

    setLoading(true);
    const newForm = new FormData();
    milestone = new Blob([JSON.stringify(milestone)], {
      type: "application/json",
    });

    newForm.append("milestone", milestone)
    await apiWrapper(MilestoneApi.createMilestone(id), "", true);
  }

  async function handleAcceptDisputeMilestone() {
    let newMilestone = {
      milestoneEnum: DISPUTE_REQUEST_ACCEPTED,
    }

    await createMilestone(newMilestone, null);
  }

  async function handleRejectDisputeMilestone() {
    let newMilestone = {
      milestoneEnum: DISPUTE_REQUEST_REJECTED,
    }

    await createMilestone(newMilestone, null);
  }

  async function handleDeleteDispute(disputeId) {
    console.log('deleting dispute');
    try {
      setLoading(true);
      setIsRejected(true);
      timer = setTimeout(() => { navigate(-1) }, 3000);
      await disputeApi.deleteDisputeById(disputeId);
      navigate(-1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async () => {
    await handleDeleteDispute(id);
    // handleDeleteDisputeMilestone();
  }

  const handleAccept = async () => {
    await handleAcceptDispute();
    //await handleAcceptDisputeMilestone()
  }

  const handleAcceptDispute = async () => {
    try {
      setLoading(true);
      await disputeApi.acceptDispute(id);
      setIsSuccess(true);
      timer = setTimeout(() => { navigate(-1) }, 3000);
    } catch (error) {
      console.log(error);
      setIsFail(true);
      alert(error);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    setRejectReason(e.target.value);
  }

  const handleOnKeyDown = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleDelete();
    }
  }

  async function handleRejectDispute(disputeId) {
    console.log('deleting dispute');
    try {
      setLoading(true);
      await disputeApi.rejectDispute(disputeId, rejectReason);
      navigate(-1);
    } catch (error) {
      console.log(error);
      alert(error);
    } finally {
      setLoading(false);
    }
  }

  const handleReject = async (e) => {
    await handleRejectDispute(id);
  }

  return (!loading ? (
    <>
      <Grid container spacing={2} sx={{ px: 1 }}>
        <Grid item xs={12}>
          <SvgIcon
            fontSize="medium"
            color="action"
            sx={{ position: 'absolute', float: 'left', top: 30 }}
            onClick={goBack}
          >
            <ArrowIcon />
          </SvgIcon>
        </Grid>
        <Grid item xs={12} sx={{ marginTop: 5 }}>
          <Typography variant="h5" fontWeight={600}>
            Dispute Request #{dispute.id}
          </Typography>
          <Divider orientation='horizontal' />
        </Grid>
        <Grid item xs={12}>
          {order.id && <OrderList title={order.offerTitle} name={order.refashionerUsername || order.sellerUsername} status={order.orderStatus} orderId={order.id} chat={order.chatAlternateId} />}
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" fontWeight={550}>
            Reason:
          </Typography>
          <Typography variant='subtitle1'>
            {dispute.description}
          </Typography>
        </Grid>
        {photos.length > 0 &&
          <>
            <Grid item xs={12} sx={{ marginTop: 1 }}>
              <Typography variant="h6" fontWeight={550}>
                Photo(s):
              </Typography>
            </Grid>
            <Grid xs={12} item>
              <Box sx={{ overflowX: 'scroll', display: 'flex' }}>
                <Box sx={{ display: 'flex', marginBottom: 1 }}>
                  <ImageListItem key={'image'} style={{ width: 90, height: 90, overflow: 'hidden' }} >
                    {Array.from(dispute.photos).map((val) => (
                      <img src={val.url} key={val.url} onClick={() => handlePhotoModal(dispute.photos.map(({ url }) => url), 0)} loading="lazy" style={{ cursor: 'pointer' }} />
                    ))}
                  </ImageListItem>
                </Box>
              </Box>
            </Grid>
          </>
        }
        <Grid item xs={12} sx={{ marginTop: 1 }}>
          <Typography variant="h6" fontWeight={550}>
            Refund amount:
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle">
            SGD{dispute.refundAmount}
          </Typography>
        </Grid>
        {dispute.disputeStatus === DISPUTE_REQUEST_PENDING_REVIEW ? (
          <>
            {disputeUser.username !== currUserData.username ? (
              <>
                <Grid item xs={12} sx={{ marginTop: 2 }}>
                  <Button variant="contained" color="secondary" onClick={() => navigate(`/chat/${order.chatAlternateId}?user2=${disputeUser.username}`)} sx={{ color: 'white', width: '100%', height: 50, fontWeight: 600 }}>
                    Chat with user
                  </Button>
                </Grid>
                <Grid item xs={6} sx={{ marginTop: 2 }}>
                  <Button variant="contained" color="error" onClick={() => setIsDeletionModalOpen(true)} sx={{ width: '100%', height: 50, fontWeight: 600 }}>
                    Reject
                  </Button>
                </Grid>
                <Grid item xs={6} sx={{ marginTop: 2 }}>
                  <Button variant="contained" color="success" onClick={() => setIsAcceptanceModalOpen(true)} sx={{ width: '100%', height: 50, fontWeight: 600 }}>
                    Accept
                  </Button>
                </Grid>
              </>
            ) : (
              <Grid item xs={12} sx={{ marginTop: 2 }}>
                {/* <Button variant="contained" color="error" onClick={() => setIsDeletionModalOpen(true)} sx={{ color: 'white', width: '100%', height: 50, fontWeight: 600 }}>
                  Delete request
                </Button> */}
              </Grid>
            )}
          </>
        ) : (
          <Grid item xs={12} sx={{ marginTop: 2 }}>
            <Button variant="contained" color="secondary" onClick={() => navigate(`/chat/${order.chatAlternateId}?user2=${disputeUser.username}`)} sx={{ color: 'white', width: '100%', height: 50, fontWeight: 600 }}>
              {dispute.disputeStatus === DISPUTE_REQUEST_REFUND_PENDING ? 'PENDING REFUND' : (dispute.disputeStatus === DISPUTE_REQUEST_COMPLETED ? 'COMPLETED' : 'REJECTED')}
            </Button>
          </Grid>
        )}
      </Grid>
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
              Confirm Reject Dispute Request #{dispute.id}?
            </DialogTitle>
            <TextField
              variant='standard'
              InputProps={{ disableUnderline: true }}
              value={rejectReason}
              onChange={handleChange}
              onKeyDown={handleOnKeyDown}
              multiline
              rows={5}
              fullWidth
              sx={{ overflowY: 'scroll', backgroundColor: 'white', marginTop: 1, padding: 1, borderRadius: '4px' }}
            />
            <DialogActions sx={{ marginBottom: '16px' }}>
              <CustomButton variant='contained' onClick={() => setIsDeletionModalOpen(false)} sx={{ backgroundColor: 'secondary.light' }}>Cancel</CustomButton>
              <CustomButton variant='contained' color="secondary" onClick={handleReject} autoFocus>
                Reject
              </CustomButton>
            </DialogActions>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '15%', minWidth: '64px', paddingTop: '16px' }} />
        </Box>
      </Dialog>
      <Dialog
        open={isAcceptanceModalOpen}
        onClose={() => setIsAcceptanceModalOpen(false)}
        aria-labelledby="alert-dialog-final-acceptance"
        aria-describedby="alert-dialog-final-acceptance"
        onBackdropClick={() => setIsAcceptanceModalOpen(false)}
      >
        <Box sx={{ backgroundColor: 'primary.main', display: 'flex', flexDirection: 'row', maxWidth: '450px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '15%', minWidth: '64px', paddingTop: '16px' }}>
            <InfoOutlinedIcon fontSize='large' />
          </Box>
          <Box>
            <DialogTitle id="final-acceptance" sx={{ paddingLeft: 0, paddingRight: 0 }}>
              Confirm Accept Dispute Request #{dispute.id}?
            </DialogTitle>
            {/* <TextField
              variant='standard'
              InputProps={{ disableUnderline: true }} value={rejectReason}
              onChange={handleChange}
              onKeyDown={handleOnKeyDown}
              multiline
              rows={5}
              fullWidth
              sx={{ overflowY: 'scroll', backgroundColor: 'white', marginTop: 1, padding: 1, borderRadius: '4px' }}
            /> */}
            <DialogActions sx={{ marginBottom: '16px' }}>
              <CustomButton variant='contained' onClick={() => setIsAcceptanceModalOpen(false)} sx={{ backgroundColor: 'secondary.light' }}>Cancel</CustomButton>
              <CustomButton variant='contained' color="secondary" onClick={handleAccept} autoFocus>
                Accept
              </CustomButton>
            </DialogActions>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '15%', minWidth: '64px', paddingTop: '16px' }} />
        </Box>
      </Dialog>
      <Modal open={isSuccess} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card>
          <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', margin: 2, ":last-child": { paddingBottom: 2 } }}>
            <CurrencyExchangeIcon color='success' sx={{ fontSize: 60 }} />
            <Typography sx={{ paddingTop: 2 }} fontWeight={700} gutterBottom>Refund successful!</Typography>
            <Typography variant='body2' color='GrayText'>Redirecting back to chat...</Typography>
          </CardContent>
        </Card>
      </Modal>
      <Modal open={isFail} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card>
          <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', margin: 2, ":last-child": { paddingBottom: 2 } }}>
            <CancelIcon color='error' sx={{ fontSize: 60 }} />
            <Typography sx={{ paddingTop: 2 }} fontWeight={700} gutterBottom>Refund failed!</Typography>
            <Typography variant='body2' color='GrayText'>Please contact admin.</Typography>
            <Typography variant='body2' color='GrayText'>Redirecting back to chat...</Typography>
          </CardContent>
        </Card>
      </Modal>
      <Modal open={isRejected} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card>
          <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', margin: 2, ":last-child": { paddingBottom: 2 } }}>
            <DoNotDisturbOnIcon color='error' sx={{ fontSize: 60 }} />
            <Typography sx={{ paddingTop: 2 }} fontWeight={700} gutterBottom>Dispute rejected</Typography>
            <Typography variant='body2' color='GrayText'>Admin will follow up soon.</Typography>
            <Typography variant='body2' color='GrayText'>Redirecting back to chat...</Typography>
          </CardContent>
        </Card>
      </Modal>
    </>
  ) : (
    <InContainerLoading />
  )
  );
};

export default DisputeDetails;