import React from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Container,Box,IconButton,Typography,TextField } from '@mui/material';
import { useNavigate } from 'react-router';
import CustomButton from '../../Components/CustomButton';
import { apiWrapper } from '../../API';
import { createBankAccountDetails, deleteBankAccountDetails } from '../../API/userApi';
import LoadingModal from '../../Components/LoadingModal';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from '../../Redux/actions';
import ConfirmationDialog from '../../Components/ConfirmationDialog';
import SuccessModal from '../../Components/SuccessModal';

const initForm = {bankAccountNo:'', bankAccountName: '', bankAccountBranch: ''};

export default function BankDetails() {
    const[form, setForm] = React.useState(initForm)
    const[attachments, setAttachments] = React.useState([]);
    const[isLoading, setIsLoading] = React.useState();
    const[isLoadingModal,setIsLoadingModal] = React.useState();
    const[clearDialog, setIsClearDialog] = React.useState();
    const[cleared, setCleared] = React.useState(false);
    const currUserData = useSelector((state) => state.currUserData);
    const authData = useSelector((state) => state.authData);
    const[loadingModalText, setLoadingModalText] = React.useState('');
    const[isSuccess, setIsSuccess] = React.useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(getUserProfile(authData.sub));
    },[])


    React.useEffect(() => {
        if(currUserData.bankAccountDetails) {
            setForm(currUserData.bankAccountDetails);
        } else {
            setForm(initForm)
        }
    },[currUserData])

    const handleFormChange = (e) => {
        setForm({...form, [e.target.name] : e.target.value})
    }

    const handleAttachmentChange = (e) => {
        if(e.target.files.length > 0) {
            console.log('files:', e.target.files);
            setAttachments(Array.from(e.target.files));
        }
    }

    function getUserData() {
        setIsLoading(true);
        dispatch(getUserProfile(authData.sub));
        setIsLoading(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingModalText('Uploading details...');
        setIsLoadingModal(true);
        const formData = new FormData();
        let newForm = form;
        if(newForm.setPrevBankStatement) {
            newForm.setPrevBankStatement = null;
        }

        const data = new Blob([JSON.stringify(newForm)], {
          type: "application/json",
        });
    
        if (attachments) {
            formData.append('file', attachments[0]);
        }
        formData.append("bad", data)
        const res = await apiWrapper(createBankAccountDetails(formData),'',true);
        if(res) {
            setIsSuccess(true);
            setCleared(false);
        }
        setIsLoadingModal(false);
    }

    function handleConfirmDialog() {
        if(currUserData.bankAccountDetails?.verified === false) {
            handleClear();
        }
        setIsClearDialog(true);
    }

    const handleClear = async (e) => {
        e.preventDefault();
        setLoadingModalText('Deleting...')
        setIsLoadingModal(true);
        const res = await apiWrapper(deleteBankAccountDetails(currUserData.bankAccountDetails.id),'',true);
        if(res) {
            setForm(initForm);
            setCleared(true);
        }
        setIsClearDialog(false);
        setIsLoadingModal(false);
        

    }

    return (
        <Container sx={{height:'100%'}}>
            <IconButton onClick={() => navigate(-1)}>
                <ArrowBackIcon fontSize='large'/>
            </IconButton>
            <Typography variant='h5' style={{ fontWeight: 'bold' }} gutterBottom>Edit Bank Details</Typography>
            <Box component='form' sx ={{display:'flex', justifyContent: 'space-between', flexGrow:1, flexDirection : 'column', height:'85%'}} 
                onSubmit={handleSubmit}
            >
                <TextField
                    margin="normal"
                    fullWidth
                    required
                    id="bankAccountName"
                    label="Name as per bank statement"
                    name="bankAccountName"
                    color="secondary"
                    onChange={handleFormChange}
                    placeholder = 'Name'
                    value={form.bankAccountName}
                    disabled={currUserData.bankAccountDetails && !cleared}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    required
                    id="bankAccountNo"
                    label="Account number"
                    name="bankAccountNo"
                    color="secondary"
                    onChange={handleFormChange}
                    placeholder = 'Account Number'
                    value={form.bankAccountNo}
                    disabled={currUserData.bankAccountDetails && !cleared}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    required
                    id="bankAccountBranch"
                    label="Bank Branch"
                    name="bankAccountBranch"
                    color="secondary"
                    onChange={handleFormChange}
                    placeholder = 'Branch'
                    value={form.bankAccountBranch}
                    disabled={currUserData.bankAccountDetails && !cleared}
                />
                <input
                    accept="image/*"
                    
                    hidden
                    id="attachments-button"
                    type="file"
                    onChange={handleAttachmentChange}
                    required
                />
                <Box sx={{display : 'flex', width: '100%', flexGrow:1, justifyContent: 'center'}}>
                    <label htmlFor="attachments-button">
                    
                    <CustomButton component='span' variant='contained' color='secondary' sx={{mt:2}} disabled={currUserData.bankAccountDetails && !cleared}>
                        {attachments.length > 0 ? `${attachments[0].name}` : 'Upload statement'}
                    </CustomButton>
                    
                    </label>
                </Box>
                {currUserData.bankAccountDetails?.remarks && currUserData.bankAccountDetails?.verified === false && 
                <TextField
                    margin = "normal"
                    fullWidth
                    disabled={true}
                    color="secondary"
                    value={form.remarks}
                    multiline={true}
                    row={3}
                    label="Rejection Reason"
                    sx={{
                        "& .MuiInputBase-input.Mui-disabled": {
                            color: "red",
                            "-webkit-text-fill-color": "red",
                            borderColor: "red"
                          },
                          "& .Mui-disabled .MuiOutlinedInput-notchedOutline": {
                            borderColor: "red"
                          },
                          "& .MuiInputLabel-root.Mui-disabled": {
                            color:'red'
                          }
                    }}
                />
                }
                {currUserData.bankAccountDetails && !cleared ?
                <CustomButton variant='contained' color="secondary"
                onClick={handleConfirmDialog}
                fullWidth
                sx={{ mt: 2, mb: 2 }}
                >
                   {currUserData.bankAccountDetails?.verified ? 'Clear existing information?' : (currUserData.bankAccountDetails?.verified == null ? 'Clear pending application' : 'Start new application') }
                </CustomButton>
                :
                <CustomButton variant='contained' color="secondary"
                    type="submit"
                    fullWidth
                    sx={{ mt: 2, mb: 2 }}
                >
                    Submit
                </CustomButton>
                }
            </Box>
            <ConfirmationDialog header={currUserData.bankAccountDetails?.verified ? 'Clear existing information?' : 'Clear pending application'}
                dialogText={currUserData.bankAccountDetails?.verified ? 'Are you sure you want to clear your existing bank information? You will not be able to make withdrawals until the new bank information has been verified' : 'Are you sure you want to clear your current pending application?'}
                handleCancel = {() => setIsClearDialog(false)}
                handleClose = {() => setIsClearDialog(false)}
                open={clearDialog}
                handleConfirm = {handleClear}
            />
            <LoadingModal text={loadingModalText} open={isLoadingModal}/>
            <SuccessModal open = {isSuccess} onClose={() => setIsSuccess(false)} onCallback={getUserData}/>
        </Container>
    )
}