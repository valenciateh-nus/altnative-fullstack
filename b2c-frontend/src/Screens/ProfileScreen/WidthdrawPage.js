import { TextField } from '@material-ui/core';
import { Button, Dialog, DialogActions, DialogTitle, Grid, SvgIcon, Typography, Box } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft as ArrowIcon, DollarSign as DollarIcon, Plus as PlusIcon, Divide } from 'react-feather';
import CustomButton from "../../Components/CustomButton";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const WidthdrawPage = () => {
  const [isDeletionModalOpen, setIsDeletionModalOpen] = React.useState(false);

  const styles = {
    textField: {
      width: 300,
      margin: 100,
    },
    //style for font size
    resize: {
      fontSize: 100
    },
  }

  const [amount, setAmount] = React.useState();
  const history = useNavigate();
  const goBack = () => {
    history(-1);
  }

  const handleChange = (e) => {
    setAmount(e.target.value);
  }

  return (
    <>
      <Grid container spacing={1}>
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
        <Grid item xs={12} sx={{ marginTop: 15, display: 'flex', alignContent: "center", justifyContent: "center" }}>
          <Typography variant="h5" fontWeight={550}>
            Withdraw balance
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ marginTop: 15, display: 'flex', alignContent: "center", justifyContent: "center" }}>
          <TextField
            id="widthdraw-amount"
            value={amount}
            placeholder="0.00"
            align="center"
            onChange={handleChange}
            InputProps={{
              disableUnderline: true,
              startAdornment: "SGD",
              style: { fontSize: 50, fontWeight: 550, textAlign: 'center', width: '100%' },
            }}
            style={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={12} sx={{ marginTop: 20 }}>
          <Button variant="contained" color="secondary" sx={{ height: 50, width: '100%', color: 'white', fontWeight: 650, fontSize: 17 }} onClick={() => setIsDeletionModalOpen(true)}>
            Withdraw
          </Button>
        </Grid>
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
              Confirm Withdraw Amount of SGD{amount}?
            </DialogTitle>
            <DialogActions sx={{ marginBottom: '16px' }}>
              <CustomButton variant='contained' onClick={() => setIsDeletionModalOpen(false)} sx={{ backgroundColor: 'secondary.light' }}>Cancel</CustomButton>
              <CustomButton variant='contained' color="secondary" autoFocus>
                Confirm
              </CustomButton>
            </DialogActions>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '15%', minWidth: '64px', paddingTop: '16px' }} />
        </Box>
      </Dialog>
    </>
  );
};

export default WidthdrawPage;