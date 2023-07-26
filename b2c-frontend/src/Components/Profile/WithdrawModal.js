import { Button, Dialog, DialogActions, DialogTitle, Grid, SvgIcon, Typography, Box, Container,TextField, DialogContentText, DialogContent } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft as ArrowIcon, DollarSign as DollarIcon, Plus as PlusIcon, Divide } from 'react-feather';
import CustomButton from "../../Components/CustomButton";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { apiWrapper } from '../../API';
import { withdrawRequest } from '../../API/walletApi';
import SuccessModal from '../SuccessModal';
import LoadingModal from '../LoadingModal';


export default function WithdrawModal({balance = 0, accNo= '', handleClose}) {

  const [isDeletionModalOpen, setIsDeletionModalOpen] = React.useState(false);
  const [amount, setAmount] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const history = useNavigate();
  const goBack = () => {
    history(-1);
  }

  const handleChange = (e) => {
    setAmount(e.target.value);
  }

  async function handleWithdraw() {
      setIsLoading(true)
      const res = await apiWrapper(withdrawRequest(amount),'',true) 
      if(res) {
          setIsLoading(false);
          setShowSuccess(true);
      }
      setIsLoading(false)
  }

  return (
    <>
    <Container>
        <Box sx = {{display : 'flex', minHeight: 200, flexDirection : 'column', flexGrow: 1, alignItems : 'center', justifyContent: 'space-between'}}>
          <Box sx={{display : 'flex', justifyContent : 'center', flexDirection: 'column', alignItems: 'center', mt:2}}>
              <Typography variant="h5" fontWeight='bold'>
                  Withdraw
              </Typography>
              <Typography variant="body1">
                  Available balance: SGD${balance}
              </Typography>
          </Box>
          <TextField
              id="withdraw-amount"
              value={amount}
              placeholder="0.00"
              align="center"
              onChange={handleChange}
              type='number'
              InputProps={{
                  disableUnderline: true,
                  startAdornment: <Typography sx={{pr:2}}>SGD</Typography>
              }}
              fullWidth
          />
          <CustomButton variant="contained" color="secondary" fullWidth disabled={Number(amount) > balance || Number(amount) <= 0} onClick={() => setIsDeletionModalOpen(true)}>
            Withdraw
          </CustomButton>
        </Box>
        <Dialog
          open={isDeletionModalOpen}
          onClose={() => setIsDeletionModalOpen(false)}
          aria-labelledby="alert-dialog-withdraw"
          aria-describedby="alert-dialog-withdraw"
          onBackdropClick={() => setIsDeletionModalOpen(false)}
        >
          <Box sx={{ backgroundColor: 'primary.main', display: 'flex', flexDirection: 'row', maxWidth: '450px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '15%', minWidth: '64px', paddingTop: '16px' }}>
              <InfoOutlinedIcon fontSize='large' />
            </Box>
            <Box>
              <DialogTitle id="withdraw" sx={{ paddingLeft: 0, paddingRight: 0 }}>
                Confirm Withdraw Amount of SGD${amount || '0.00'}?
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Once approved, the requested amount will be deposited to your account {accNo}.
                </DialogContentText>
              </DialogContent>
              <DialogActions sx={{ marginBottom: '16px' }}>
                <CustomButton variant='contained' onClick={() => setIsDeletionModalOpen(false)} sx={{ backgroundColor: 'secondary.light' }}>Cancel</CustomButton>
                <CustomButton variant='contained' color="secondary" autoFocus onClick={handleWithdraw}>
                  Confirm
                </CustomButton>
              </DialogActions>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '15%', minWidth: '64px', paddingTop: '16px' }} />
          </Box>
        </Dialog>
        <LoadingModal open={isLoading} text={'Creating request...'}/>
        <SuccessModal open={showSuccess} onClose={() => setShowSuccess(false)} onCallback={handleClose}/>
      </Container>
    </>
  );
};