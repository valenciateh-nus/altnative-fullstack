import React from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Container,Box,IconButton,Typography,TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, } from '@mui/material';
import { useNavigate } from 'react-router';
import CustomButton from '../../Components/CustomButton';
import { apiWrapper } from '../../API';
import { createBankAccountDetails, deleteBankAccountDetails } from '../../API/userApi';
import LoadingModal from '../../Components/LoadingModal';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile, openImageModal } from '../../Redux/actions';
import ConfirmationDialog from '../../Components/ConfirmationDialog';
import SuccessModal from '../../Components/SuccessModal';
import { rejectBankAccount, verifyBankAccount } from '../../API/bankAccountsApi';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import moment from 'moment';
import { approveWithdrawRequest, rejectWithdrawRequest } from '../../API/walletApi';

export default function WithdrawRequestModal({wr = {}, handleRefresh}) {
    const[isLoading, setIsLoading] = React.useState();
    const[isLoadingModal,setIsLoadingModal] = React.useState();
    const[clearDialog, setIsClearDialog] = React.useState(false);
    const[loadingModalText, setLoadingModalText] = React.useState('Loading...');
    const[isSuccess, setIsSuccess] = React.useState(false);
    const[rejectionReason, setRejectionReason] = React.useState('');

    const[confirmDialog, setIsConfirmDialog] = React.useState(false);
    const[bankTransactionId, setBankTransactionId] = React.useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    function handleRejectDialog() {
        setIsClearDialog(true);
    }

    function handleConfirmDialog() {
        setIsConfirmDialog(true);
    }

    function handlePhotoModal(images, index) {
        dispatch(openImageModal(images,index))
    }

    async function handleReject() {
        setIsLoadingModal(true);
        const res = await apiWrapper(rejectWithdrawRequest(wr.id, rejectionReason),'',true);
        if(res) {
            setIsSuccess(true);
        }
        setIsLoadingModal(false);

    }
    async function handleAccept() {
        setIsLoadingModal(true);
        const res = await apiWrapper(approveWithdrawRequest(wr.id,bankTransactionId),'',true);
        if(res) {
            setIsSuccess(true);
        }
        setIsLoadingModal(false);
    }

    const handleOnKeyDown = async(e) => {
        if(e.key === 'Enter' && !e.shiftKey && rejectionReason) {
            e.preventDefault();
            handleReject();
        }

    }

    const handleOnKeyDownApprove = async(e) => {
        if(e.key === 'Enter' && !e.shiftKey && bankTransactionId) {
            e.preventDefault();
            handleAccept();
        }

    }

    const handleChangeRejection = (e) => {
        setRejectionReason(e.target.value);
    }

    const handleChangeBankTxn = (e) => {
        setBankTransactionId(e.target.value);
    }


    return (
        <Container sx={{height:'100%'}}>
            <IconButton onClick={() => navigate(-1)}>
                <ArrowBackIcon fontSize='large'/>
            </IconButton>
            <Typography variant='h5' style={{ fontWeight: 'bold' }} gutterBottom>Withdraw Request Details</Typography>
            <Box sx ={{display:'flex', justifyContent: 'space-between', flexGrow:1, flexDirection : 'column', height:'100%', mb : 2}} 
            >
                <TextField
                    margin="normal"
                    fullWidth
                    required
                    id="username"
                    label="Username"
                    name="username"
                    color="secondary"
                    disabled={true}
                    placeholder = 'Name'
                    value={wr.wallet.appUser?.username}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    required
                    id="bankAccountName"
                    label="Name as per bank statement"
                    name="bankAccountName"
                    color="secondary"
                    disabled={true}
                    placeholder = 'Name'
                    value={wr.wallet.appUser.bankAccountDetails.bankAccountName}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    required
                    id="bankAccountNo"
                    label="Account number"
                    name="bankAccountNo"
                    color="secondary"
                    disabled={true}
                    placeholder = 'Account Number'
                    value={wr.wallet.appUser.bankAccountDetails.bankAccountNo}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    required
                    id="bankAccountBranch"
                    label="Bank Branch"
                    name="bankAccountBranch"
                    color="secondary"
                    disabled={true}
                    placeholder = 'Branch'
                    value={wr.wallet.appUser.bankAccountDetails.bankAccountBranch}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    required
                    id="amount"
                    label="Withdraw Amount"
                    name="amount"
                    color="secondary"
                    disabled={true}
                    placeholder = 'Withdraw Amount'
                    value={'SGD$'+ Number(wr.amount).toFixed(2)}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    required
                    id="walletBanace"
                    label="Wallet Balance"
                    name="Wallet Balance"
                    color="secondary"
                    disabled={true}
                    placeholder = "Wallet Balance"
                    value={'SGD$'+ Number(wr.wallet.balance).toFixed(2)}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    required
                    id="walletHoldBanace"
                    label="Wallet Onhold Balance"
                    name="Wallet Onhold Balance"
                    color="secondary"
                    disabled={true}
                    placeholder = "Wallet Onhold Balance"
                    value={'SGD$'+ Number(wr.wallet.onHoldBalanace).toFixed(2)}
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
                    placeholder = 'Request Date'
                    value={moment(wr.dateCreated).format('DD MMM yyyy')}
                />
                <Box sx = {{display : 'flex', flexDirection: 'row', mt:2, mb : 2}}>
                    <CustomButton
                        variant="contained"
                        disabled = {false}
                        fullWidth
                        size='large'
                        color = 'primary'
                        onClick={handleRejectDialog}
                    >
                        Reject
                    </CustomButton>
                    <CustomButton variant='contained' color="secondary"
                        onClick={handleConfirmDialog}
                        fullWidth
                        size='large'
                        sx={{ml:2}}
                    >
                        Approve
                    </CustomButton>
                </Box>
                <Box sx ={{minHeight: 24}}></Box>
            </Box>
            <Dialog
                open={clearDialog}
                onClose={() => setIsClearDialog(false)}
                aria-labelledby="alert-dialog-final-rejection"
                aria-describedby="alert-dialog-final-rejection"
                onBackdropClick = {() => setIsClearDialog(false)}
            >
                <Box sx={{backgroundColor : 'primary.main', display:'flex', flexDirection:'row', maxWidth: '450px'}}>
                    <Box sx={{display : 'flex', justifyContent:'center', width: '15%', minWidth: '64px', paddingTop : '16px'}}>
                    <InfoOutlinedIcon fontSize='large'/>
                    </Box>
                    <Box>
                    <DialogTitle id="final-rejection" sx={{paddingLeft: 0, paddingRight: 0}}>
                        Reject Application?
                    </DialogTitle>
                    <DialogContent sx={{padding: 0}}>
                    <DialogContentText id="alert-dialog-description">
                    Are you sure you want to reject this application? Please provide a reason.
                    </DialogContentText>
                    <TextField 
                            variant='standard'
                            InputProps={{ disableUnderline: true }} value={rejectionReason} 
                            onChange={handleChangeRejection}
                            onKeyDown={handleOnKeyDown}
                            multiline
                            rows={3}
                            fullWidth
                            sx={{overflowY: 'scroll', backgroundColor : 'white', marginTop: '16px', padding: 1, borderRadius : '4px'}}
                            error={!rejectionReason}
                            helperText={!rejectionReason && 'Please provide a reason.'}
                        />
                    </DialogContent>
                    <DialogActions sx={{marginBottom:'16px'}}>
                        <CustomButton variant='contained' onClick={() => setIsClearDialog(false)} sx={{backgroundColor:'secondary.light'}}>Cancel</CustomButton>
                        <CustomButton variant='contained' color="secondary" onClick={handleReject} autoFocus disabled={!rejectionReason}>
                            Reject
                        </CustomButton>
                    </DialogActions>
                    </Box>
                    <Box sx={{display : 'flex', justifyContent:'center', width: '15%', minWidth: '64px', paddingTop : '16px'}}/>
                </Box>
            </Dialog>
            <Dialog
                open={confirmDialog}
                onClose={() => setIsConfirmDialog(false)}
                aria-labelledby="alert-dialog-final-rejection"
                aria-describedby="alert-dialog-final-rejection"
                onBackdropClick = {() => setIsConfirmDialog(false)}
            >
                <Box sx={{backgroundColor : 'primary.main', display:'flex', flexDirection:'row', maxWidth: '450px'}}>
                    <Box sx={{display : 'flex', justifyContent:'center', width: '15%', minWidth: '64px', paddingTop : '16px'}}>
                    <InfoOutlinedIcon fontSize='large'/>
                    </Box>
                    <Box>
                    <DialogTitle id="final-rejection" sx={{paddingLeft: 0, paddingRight: 0}}>
                        Approve Withdrawal?
                    </DialogTitle>
                    <DialogContent sx={{padding: 0}}>
                    <DialogContentText id="alert-dialog-description">
                    Are you sure you want to approve this withdraw request? Please enter the bank transaction ID associated with the deposit made.
                    </DialogContentText>
                    <TextField 
                            variant='standard'
                            InputProps={{ disableUnderline: true }} value={bankTransactionId} 
                            onChange={handleChangeBankTxn}
                            onKeyDown={handleOnKeyDownApprove}
                            multiline
                            rows={3}
                            fullWidth
                            sx={{overflowY: 'scroll', backgroundColor : 'white', marginTop: '16px', padding: 1, borderRadius : '4px'}}
                            error={!bankTransactionId}
                            helperText={!bankTransactionId && 'Please provide the bank transaction ID.'}
                        />
                    </DialogContent>
                    <DialogActions sx={{marginBottom:'16px'}}>
                        <CustomButton variant='contained' onClick={() => setIsConfirmDialog(false)} sx={{backgroundColor:'secondary.light'}}>Cancel</CustomButton>
                        <CustomButton variant='contained' color="secondary" onClick={handleAccept} autoFocus disabled={!bankTransactionId}>
                            Approve
                        </CustomButton>
                    </DialogActions>
                    </Box>
                    <Box sx={{display : 'flex', justifyContent:'center', width: '15%', minWidth: '64px', paddingTop : '16px'}}/>
                </Box>
            </Dialog>
            <LoadingModal text={loadingModalText} open={isLoadingModal}/>
            <SuccessModal open = {isSuccess} onClose={() => setIsSuccess(false)} onCallback={handleRefresh}/>
        </Container>
    )
}