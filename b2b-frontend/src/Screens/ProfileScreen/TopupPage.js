import { Button, Grid, SvgIcon, TextField, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft as ArrowIcon } from 'react-feather';

const TopupPage = () => {
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
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <SvgIcon
          fontSize="medium"
          color="action"
          sx={{ position: 'absolute', float: 'left', top: 30,cursor : 'pointer' }}
          onClick={goBack}
        >
          <ArrowIcon />
        </SvgIcon>
      </Grid>
      <Grid item xs={12} sx={{ marginTop: 15, display: 'flex', alignContent: "center", justifyContent: "center" }}>
        <Typography variant="h5" fontWeight={550}>
          Top-Up
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{ marginTop: 15, display: 'flex', alignContent: "center", justifyContent: "center" }}>
        <TextField
          id="topup-amount"
          value={amount}
          placeholder="0.00"
          onChange={handleChange}
          InputProps={{
            disableUnderline: true, 
            startAdornment: "+SGD",
            style: {fontSize: 50, fontWeight: 550, textAlign: 'center', width: '100%'},
          }}
          style={{ width: '100%'}}
        />
      </Grid>
      <Grid item xs={12} sx={{ marginTop: 20 }}>
        <Button variant="contained" color="secondary" sx={{ height: 50, width: '100%', color: 'white', fontWeight: 650, fontSize: 17 }}>
          Top-Up
        </Button>
      </Grid>
    </Grid>
  );
};

export default TopupPage;