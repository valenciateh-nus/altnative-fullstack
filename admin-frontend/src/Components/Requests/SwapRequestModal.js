import React from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Container, Box, IconButton, Typography, TextField, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, } from '@mui/material';
import { useNavigate } from 'react-router';
import CustomButton from '../../Components/CustomButton';
import { apiWrapper } from '../../API';

import LoadingModal from '../../Components/LoadingModal';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile, openImageModal } from '../../Redux/actions';

import SuccessModal from '../../Components/SuccessModal';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import moment from 'moment';

import { approveSwapRequest, rejectSwapRequest, rejectSwapRequestWithCredits, deleteSwapRequest, updateFollowUpStatusToComplete } from '../../API/swapRequestsApi';
import { sr } from 'date-fns/locale';


export default function SwapRequestModal({ sr = {}, handleRefresh }) {
    const [isLoading, setIsLoading] = React.useState();
    const [isLoadingModal, setIsLoadingModal] = React.useState();

    const [loadingModalText, setLoadingModalText] = React.useState('Loading...');
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [rejectionReason, setRejectionReason] = React.useState('');
    const [creditsAwarded, setCreditsAwarded] = React.useState();
    const [rejectCreditsAwarded, setRejectCreditsAwarded] = React.useState();

    const [clearDialog, setClearDialog] = React.useState(false);
    const [clearCreditDialog, setClearCreditDialog] = React.useState(false);
    const [confirmDialog, setIsConfirmDialog] = React.useState(false);
    const [completedDialog, setCompletedDialog] = React.useState(false);
    const [bankTransactionId, setBankTransactionId] = React.useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    function handleRejectDialog() {
        setClearDialog(true);
    }

    function handleRejectCreditDialog() {
        setClearCreditDialog(true);
    }

    function handleConfirmDialog() {
        setIsConfirmDialog(true);
    }

    function handleCompletedDialog() {
        setCompletedDialog(true);
    }

    function handlePhotoModal(images, index) {
        dispatch(openImageModal(images, index))
    }

    async function handleReject() {
        setIsLoadingModal(true);
        const res = await apiWrapper(rejectSwapRequest(sr.id, rejectionReason), '', true);
        if (res) {
            setIsSuccess(true);
        }
        setIsLoadingModal(false);

    }
    async function handleRejectCredits() {
        setIsLoadingModal(true);
        const res = await apiWrapper(rejectSwapRequestWithCredits(sr.id, rejectionReason, rejectCreditsAwarded), '', true);
        if (res) {
            setIsSuccess(true);
        }
        setIsLoadingModal(false);
    }

    async function handleAccept() {
        setIsLoadingModal(true);
        const res = await apiWrapper(approveSwapRequest(sr.id, creditsAwarded), '', true);
        if (res) {
            setIsSuccess(true);
        }
        setIsLoadingModal(false);
    }

    async function handleCompleted() {
        setIsLoadingModal(true);
        const res = await apiWrapper(updateFollowUpStatusToComplete(sr.id), '', true);
        if (res) {
            setIsSuccess(true);
        }
        setIsLoadingModal(false);
    }

    const handleOnKeyDown = async (e) => {
        if (e.key === 'Enter' && !e.shiftKey && rejectionReason) {
            e.preventDefault();
            handleReject();
        }

    }

    const handleOnKeyDownApprove = async (e) => {
        if (e.key === 'Enter' && !e.shiftKey && bankTransactionId) {
            e.preventDefault();
            handleAccept();
        }

    }

    const handleChangeRejection = (e) => {
        setRejectionReason(e.target.value);
    }

    const handleChangeRejectCreditsAwarded = (e) => {
        setRejectCreditsAwarded(e.target.value);
    }

    const handleChangeCreditsAwarded = (e) => {
        setCreditsAwarded(e.target.value);
    }



    return (
        <Container sx={{ height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexGrow: 1, flexDirection: 'column', height: '100%', mb: 2 }} >
                <Typography variant='h5' style={{ fontWeight: 'bold' }} gutterBottom>
                    Swap Request Details
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }} >
                    <img src={sr.imageList[0].url}
                        alt='broken'
                        onClick={() => handlePhotoModal(sr.imageList.map(({ url }) => url), 0)}
                        height="100%" width="100%"
                        style={{ maxWidth: 400, background: "none", alignSelf: 'center', objectFit: 'contain' }}
                    />
                </Box>
                <TextField
                    margin="normal"
                    fullWidth
                    required
                    id="username"
                    label="Username"
                    name="username"
                    color="secondary"
                    disabled={true}
                    placeholder='Name'
                    value={sr.appUser?.username}
                />

                <TextField
                    margin="normal"
                    fullWidth
                    required
                    id="itemName"
                    label="Item Name"
                    name="itemName"
                    color="secondary"
                    disabled={true}
                    placeholder='itemName'
                    value={sr.itemName}
                />

                <TextField
                    margin="normal"
                    fullWidth
                    required
                    id="itemDescription"
                    label="item Description"
                    name="itemDescription"
                    color="secondary"
                    disabled={true}
                    placeholder='itemDescription'
                    value={sr.itemDescription}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    required
                    id="itemCondition"
                    label="item Condition"
                    name="itemCondition"
                    color="secondary"
                    disabled={true}
                    placeholder='itemCondition'
                    value={sr.itemCondition}
                />

                <TextField
                    margin="normal"
                    fullWidth
                    required
                    id="dateCreated"
                    label="Request Date"
                    name="Request Date"
                    color="secondary"
                    disabled={true}
                    placeholder='Request Date'
                    value={moment(sr.dateCreated).format('DD MMM yyyy')}
                />
                {sr.creditsToAppUser &&
                    <TextField
                        margin="normal"
                        fullWidth
                        required
                        id="credits"
                        label="Credits"
                        name="credits"
                        color="secondary"
                        disabled={true}
                        placeholder='Credits'
                        value={sr.creditsToAppUser}
                    />
                }

                {sr.adminRemarks &&
                    <TextField
                        margin="normal"
                        fullWidth
                        required
                        id="adminRemarks"
                        label="Admin Remarks"
                        name="adminRemarks"
                        color="secondary"
                        disabled={true}
                        placeholder='Admin Remarks'
                        value={sr.adminRemarks}
                    />
                }

                {sr.followUpStatus &&
                    <TextField
                        margin="normal"
                        fullWidth
                        required
                        id="followUpStatus"
                        label="Follow Up Status"
                        name="followUpStatus"
                        color="secondary"
                        disabled={true}
                        placeholder='Follow Up Status'
                        value={sr.followUpStatus}
                    />
                }

                {!sr.followUpStatus && sr.swapRequestStatus !== 'APPROVED_AND_CREDITED' &&
                    <Box sx={{ display: 'flex', flexDirection: 'row', mt: 2, mb: 2 }}>

                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <CustomButton
                                    variant="contained"
                                    fullWidth
                                    size='large'
                                    color='primary'
                                    onClick={handleRejectDialog}

                                >
                                    Reject
                                </CustomButton>
                            </Grid>
                            <Grid item xs={4}>
                                <CustomButton
                                    variant="contained"
                                    fullWidth
                                    size='large'
                                    color='primary'
                                    onClick={handleRejectCreditDialog}
                                >
                                    Reject with Credits
                                </CustomButton>
                            </Grid>
                            <Grid item xs={4}>
                                <CustomButton variant='contained' color="secondary"
                                    onClick={handleConfirmDialog}
                                    fullWidth
                                    size='large'
                                >
                                    Approve
                                </CustomButton>
                            </Grid>
                        </Grid>

                    </Box>
                }
                {sr.followUpStatus && sr.followUpStatus !== "COMPLETED" &&
                    <Box sx={{ display: 'flex', flexDirection: 'row', mt: 2, mb: 2 }}>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <CustomButton
                                    variant="contained"
                                    fullWidth
                                    size='large'
                                    color='primary'
                                    onClick={handleCompletedDialog}

                                >
                                    Mark As Completed
                                </CustomButton>
                            </Grid>
                        </Grid>

                    </Box>
                }
                <Box sx={{ minHeight: 24 }}></Box>
            </Box>
            <Dialog
                open={clearDialog}
                onClose={() => setClearDialog(false)}
                aria-labelledby="alert-dialog-final-rejection"
                aria-describedby="alert-dialog-final-rejection"
                onBackdropClick={() => setClearDialog(false)}
            >
                <Box sx={{ backgroundColor: 'primary.main', display: 'flex', flexDirection: 'row', maxWidth: '450px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '15%', minWidth: '64px', paddingTop: '16px' }}>
                        <InfoOutlinedIcon fontSize='large' />
                    </Box>
                    <Box>
                        <DialogTitle id="final-rejection" sx={{ paddingLeft: 0, paddingRight: 0 }}>
                            Reject Application?
                        </DialogTitle>
                        <DialogContent sx={{ padding: 0 }}>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure you want to reject this swap request? Please provide a reason.
                            </DialogContentText>
                            <TextField
                                variant='standard'
                                InputProps={{ disableUnderline: true }} value={rejectionReason}
                                onChange={handleChangeRejection}
                                onKeyDown={handleOnKeyDown}
                                multiline
                                rows={3}
                                fullWidth
                                sx={{ overflowY: 'scroll', backgroundColor: 'white', marginTop: '16px', padding: 1, borderRadius: '4px' }}
                                error={!rejectionReason}
                                helperText={!rejectionReason && 'Please provide a reason.'}
                            />
                        </DialogContent>
                        <DialogActions sx={{ marginBottom: '16px' }}>
                            <CustomButton variant='contained' onClick={() => setClearDialog(false)} sx={{ backgroundColor: 'secondary.light' }}>Cancel</CustomButton>
                            <CustomButton variant='contained' color="secondary" onClick={handleReject} autoFocus disabled={!rejectionReason}>
                                Reject
                            </CustomButton>
                        </DialogActions>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '15%', minWidth: '64px', paddingTop: '16px' }} />
                </Box>
            </Dialog>

            <Dialog
                open={clearCreditDialog}
                onClose={() => setClearCreditDialog(false)}
                aria-labelledby="alert-dialog-final-rejection"
                aria-describedby="alert-dialog-final-rejection"
                onBackdropClick={() => setClearCreditDialog(false)}
            >
                <Box sx={{ backgroundColor: 'primary.main', display: 'flex', flexDirection: 'row', maxWidth: '450px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '15%', minWidth: '64px', paddingTop: '16px' }}>
                        <InfoOutlinedIcon fontSize='large' />
                    </Box>
                    <Box>
                        <DialogTitle id="final-rejection" sx={{ paddingLeft: 0, paddingRight: 0 }}>
                            Reject Application with Credits Awarded?
                        </DialogTitle>
                        <DialogContent sx={{ padding: 0 }}>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure you want to reject this swap request with credits awarded? Please provide a reason.
                            </DialogContentText>
                            <TextField
                                variant='standard'
                                InputProps={{ disableUnderline: true }}
                                value={rejectCreditsAwarded}
                                onChange={handleChangeRejectCreditsAwarded}
                                onKeyDown={handleOnKeyDown}
                                fullWidth
                                sx={{ overflowY: 'scroll', backgroundColor: 'white', marginTop: '16px', padding: 1, borderRadius: '4px' }}
                                error={!rejectCreditsAwarded}
                                helperText={!rejectCreditsAwarded && 'Enter the amount of credits to award.'}
                            />
                            <TextField
                                variant='standard'
                                InputProps={{ disableUnderline: true }}
                                value={rejectionReason}
                                onChange={handleChangeRejection}
                                onKeyDown={handleOnKeyDown}
                                multiline
                                rows={3}
                                fullWidth
                                sx={{ overflowY: 'scroll', backgroundColor: 'white', marginTop: '16px', padding: 1, borderRadius: '4px' }}
                                error={!rejectionReason}
                                helperText={!rejectionReason && 'Please provide a reason.'}
                            />
                        </DialogContent>
                        <DialogActions sx={{ marginBottom: '16px' }}>
                            <CustomButton variant='contained' onClick={() => setClearCreditDialog(false)} sx={{ backgroundColor: 'secondary.light' }}>Cancel</CustomButton>
                            <CustomButton variant='contained' color="secondary" onClick={handleRejectCredits} autoFocus disabled={!(rejectionReason && rejectCreditsAwarded)}>
                                Reject with Credits Awarded
                            </CustomButton>
                        </DialogActions>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '15%', minWidth: '64px', paddingTop: '16px' }} />
                </Box>
            </Dialog>


            <Dialog
                open={confirmDialog}
                onClose={() => setIsConfirmDialog(false)}
                aria-labelledby="alert-dialog-final-rejection"
                aria-describedby="alert-dialog-final-rejection"
                onBackdropClick={() => setIsConfirmDialog(false)}
            >
                <Box sx={{ backgroundColor: 'primary.main', display: 'flex', flexDirection: 'row', maxWidth: '450px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '15%', minWidth: '64px', paddingTop: '16px' }}>
                        <InfoOutlinedIcon fontSize='large' />
                    </Box>
                    <Box>
                        <DialogTitle id="final-rejection" sx={{ paddingLeft: 0, paddingRight: 0 }}>
                            Approve Swap Request?
                        </DialogTitle>
                        <DialogContent sx={{ padding: 0 }}>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure you want to approve this swap request?
                            </DialogContentText>
                            <TextField
                                variant='standard'
                                InputProps={{ disableUnderline: true }}
                                value={creditsAwarded}
                                onChange={handleChangeCreditsAwarded}
                                onKeyDown={handleOnKeyDownApprove}
                                rows={3}
                                fullWidth
                                sx={{ overflowY: 'scroll', backgroundColor: 'white', marginTop: '16px', padding: 1, borderRadius: '4px' }}
                                error={!creditsAwarded}
                                helperText={!creditsAwarded && 'Please provide the swap credit amount.'}
                            />
                        </DialogContent>
                        <DialogActions sx={{ marginBottom: '16px' }}>
                            <CustomButton variant='contained' onClick={() => setIsConfirmDialog(false)} sx={{ backgroundColor: 'secondary.light' }}>Cancel</CustomButton>
                            <CustomButton variant='contained' color="secondary" onClick={handleAccept} autoFocus disabled={!creditsAwarded}>
                                Approve
                            </CustomButton>
                        </DialogActions>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '15%', minWidth: '64px', paddingTop: '16px' }} />
                </Box>
            </Dialog>

            <Dialog
                open={completedDialog}
                onClose={() => setCompletedDialog(false)}
                aria-labelledby="alert-dialog-final-rejection"
                aria-describedby="alert-dialog-final-rejection"
                onBackdropClick={() => setCompletedDialog(false)}
            >
                <Box sx={{ backgroundColor: 'primary.main', display: 'flex', flexDirection: 'row', maxWidth: '450px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '15%', minWidth: '64px', paddingTop: '16px' }}>
                        <InfoOutlinedIcon fontSize='large' />
                    </Box>
                    <Box>
                        <DialogTitle id="final-rejection" sx={{ paddingLeft: 0, paddingRight: 0 }}>
                            Mark Swap Request as Completed
                        </DialogTitle>
                        <DialogContent sx={{ padding: 0 }}>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure you want to mark swap request as completed?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions sx={{ marginBottom: '16px' }}>
                            <CustomButton variant='contained' onClick={() => setCompletedDialog(false)} sx={{ backgroundColor: 'secondary.light' }}>Cancel</CustomButton>
                            <CustomButton variant='contained' color="secondary" onClick={handleCompleted} autoFocus>
                                Mark as Completed
                            </CustomButton>
                        </DialogActions>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '15%', minWidth: '64px', paddingTop: '16px' }} />
                </Box>
            </Dialog>

            <LoadingModal text={loadingModalText} open={isLoadingModal} />
            <SuccessModal open={isSuccess} onClose={() => setIsSuccess(false)} onCallback={handleRefresh} />
        </Container>
    )
}