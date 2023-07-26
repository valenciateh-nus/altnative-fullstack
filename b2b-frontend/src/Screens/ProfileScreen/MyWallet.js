import { Typography, Grid, SvgIcon, Divider, Card, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft as ArrowIcon, DollarSign as DollarIcon, Plus as PlusIcon, Divide } from 'react-feather';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import TransactionList from '../../Components/Profile/TransactionList';

const transactions = [{
  amount: 50,
  dateCompleted: new Date(),
  dateCreated: new Date(),
  id: 5050, 
  paymentStatus: 'COMPLETED'
}, {
  amount: -20,
  dateCreated: new Date(),
  id: 5051, 
  paymentStatus: 'COMPLETED'
},
{
  amount: 10,
  dateCompleted: new Date(),
  dateCreated: new Date(),
  id: 5052, 
  paymentStatus: 'DECLINED'
}]

const MyWallet = () => {
  const history = useNavigate();
  const goBack = () => {
    history(-1);
  }

  return (
    <Grid container spacing={2}>
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
      {/* <Grid item xs={12} sx={{ marginTop: 5 }}>
        <Typography variant="h5" fontWeight={550} sx={{ marginLeft: 1 }}>
          My Wallet
        </Typography>
        <Divider orientation="row" />
      </Grid> */}
      {/* <Grid item xs={12}>
        <Card sx={{ width: '100%', height: 120, background: '#FFE8BC' }}>
          <Typography variant="h6" sx={{ marginLeft: 3, lineHeight: 3.2, fontWeight: 550 }}>
            Balance
          </Typography>
          <Typography variant="h4" fontWeight={550} align="left" sx={{ lineHeight: 0.5, marginLeft: 3 }}>
            S$0.00
          </Typography>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <List>
        <ListItemButton onClick={() => history("/profile/wallet/topup")}>
            <ListItemIcon sx={{ minWidth: 0, mr: 1 }}>
              <PlusIcon fontSize='medium' />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ sx: { fontSize: '1.1em' } }}>
              Top-up
            </ListItemText>
            <ListItemIcon sx={{ minWidth: 0 }}>
              <ArrowForwardIosOutlinedIcon />
            </ListItemIcon>
          </ListItemButton>
          <ListItemButton onClick={() => history("/profile/wallet/widthdraw")}>
            <ListItemIcon sx={{ minWidth: 0, mr: 1 }}>
              <DollarIcon fontSize='medium' />
            </ListItemIcon>
            <ListItemText primaryTypographyProps={{ sx: { fontSize: '1.1em' } }}>
              Widthdraw Balance
            </ListItemText>
            <ListItemIcon sx={{ minWidth: 0 }}>
              <ArrowForwardIosOutlinedIcon />
            </ListItemIcon>
          </ListItemButton>
        </List>
      </Grid> */}
      <Grid item xs={12} sx={{ mt: 5 }}>
        <Typography variant="h5" fontWeight={550} sx={{ marginLeft: 1 }}>
          Transactions
        </Typography>
        <Divider orientation="row" />
      </Grid>
      {Array.from(transactions).map((val) => (
        <TransactionList transaction={val} />
      ))}
    </Grid>
  );
};

export default MyWallet;