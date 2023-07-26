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

export default function BankDetails({form = {}, handleRefresh}) {
    const[isLoading, setIsLoading] = React.useState();
    const[isLoadingModal,setIsLoadingModal] = React.useState();
    const[clearDialog, setIsClearDialog] = React.useState(false);
    const[loadingModalText, setLoadingModalText] = React.useState('Loading...');
    const[isSuccess, setIsSuccess] = React.useState(false);
    const[rejectionReason, setRejectionReason] = React.useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    function handleConfirmDialog() {
        setIsClearDialog(true);
    }

    function handlePhotoModal(images, index) {
        dispatch(openImageModal(images,index))
    }

    async function handleReject() {
        setIsLoadingModal(true);
        const res = await apiWrapper(rejectBankAccount(form.id, rejectionReason),'',true);
        if(res) {
            setIsSuccess(true);
        }
        setIsLoadingModal(false);

    }
    async function handleAccept() {
        setIsLoadingModal(true);
        const res = await apiWrapper(verifyBankAccount(form.id),'',true);
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

    const handleChangeRejection = (e) => {
        setRejectionReason(e.target.value);
    }


    return (
        <Container sx={{height:'100%'}}>
            <IconButton onClick={() => navigate(-1)}>
                <ArrowBackIcon fontSize='large'/>
            </IconButton>
            <Typography variant='h5' style={{ fontWeight: 'bold' }} gutterBottom>Edit Bank Details</Typography>
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
                    value={form.appUser?.username}
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
                    value={form.bankAccountName}
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
                    value={form.bankAccountNo}
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
                    value={form.bankAccountBranch}
                />
                <img src={`${form?.prevBankStatement?.url}`} loading="lazy" onClick={() => handlePhotoModal([form?.prevBankStatement?.url], 0)} style={{cursor:'pointer', height : 200, width: 200}}/>
                <Box sx = {{display : 'flex', flexDirection: 'row', mt:2, mb : 2}}>
                    {form.verified === null ? <><CustomButton
                        variant="contained"
                        disabled = {false}
                        fullWidth
                        size='large'
                        color = 'primary'
                        onClick={handleConfirmDialog}
                    >
                        Reject
                    </CustomButton>
                    <CustomButton variant='contained' color="secondary"
                        onClick={handleAccept}
                        fullWidth
                        size='large'
                        sx={{ml:2}}
                    >
                        Verify
                    </CustomButton></> : 
                    (form.verified === false ? <CustomButton
                        variant="contained"
                        disabled = {true}
                        fullWidth
                        size ='large'
                        sx={{":disabled" : {color : 'white', backgroundColor : 'secondary.main'}}}
                    >
                        {'Rejected'}
                    </CustomButton> :  <CustomButton
                        variant="contained"
                        disabled = {true}
                        fullWidth
                        size ='large'
                        sx={{":disabled" : {color : 'white', backgroundColor : 'secondary.main'}}}
                    >
                        {'Approved'}
                    </CustomButton>)
                    }
                </Box>
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
            <LoadingModal text={loadingModalText} open={isLoadingModal}/>
            <SuccessModal open = {isSuccess} onClose={() => setIsSuccess(false)} onCallback={handleRefresh}/>
        </Container>
    )
}