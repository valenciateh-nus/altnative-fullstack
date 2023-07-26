import { Box, Card, Divider, Grid, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Modal, Paper, SvgIcon, Typography, useMediaQuery } from '@mui/material';
import React from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TransactionCard from './TransactionCard';
import Reviews from './PreviewReviews';
import { useDispatch, useSelector } from 'react-redux';
import * as UserAPI from '../../API/userApi';
import LogoutIcon from '@mui/icons-material/Logout';
import { getUserProfile, logout } from '../../Redux/actions';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ReviewsOutlinedIcon from '@mui/icons-material/ReviewsOutlined';
import firebase from "firebase/app";
import '@firebase/messaging';
import WithdrawModal from '../../Components/Profile/WithdrawModal'
import SuccessModal from '../SuccessModal';
import ConfirmationDialog from '../ConfirmationDialog';
import { toTitleCase, MARKET_VIEW, REFASHIONEE_VIEW, REFASHIONER_VIEW, SWAP_VIEW } from '../../constants';
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

const ProfileItem = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [reviews, setReviews] = React.useState();
  const currentUser = useSelector(state => state.currUserData);
  const [isWithdrawModal, setIsWithdrawModal] = React.useState(false);
  const [showNoBankInfoModal, setShowNoBankInfoModal] = React.useState(false);

  const view = useSelector((state) => state.view);
  const mobile = !useMediaQuery(theme => theme.breakpoints.up('md'));

  const authData = useSelector((state) => state.authData);

  React.useEffect(() => {
    console.log(currentUser.id);
    if (currentUser.id) {
      try {
        UserAPI.retrieveReviewsByUserId(currentUser.id).then((val) => {
          console.log(val);
          setReviews(val.data);
        });
      } catch (error) {
        setReviews([]);
      }
    }
  }, [])

  function handleCloseWithdrawModalWithRefresh() {
    setIsWithdrawModal(false);
    dispatch(getUserProfile(authData.sub));
  }

  function userLogout() {
    firebase.messaging().deleteToken();
    dispatch(logout());
    navigate('/login')
  }

  function handleWithdraw() {
    if (currentUser.bankAccountDetails?.verified) {
      setIsWithdrawModal(true);
    } else {
      setShowNoBankInfoModal(true);
    }
  }

  return (
    <>
      <Grid container spacing={2} sx={{ px: 0.5 }}>
        {view !== SWAP_VIEW ? (
          <>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" fontWeight={550}>
                My Wallet
              </Typography>
            </Grid>

            <Grid item container xs={12} sx={{ width: '100%', display: "flex", justifyContent: "center", alignContent: 'center' }}>
              <Card sx={{ width: '98%', height: '95%', mb: 2, boxShadow: '1px 1px 1px 1px #9f9f9f' }}>
                <Grid container spacing={1}>
                  <Grid item xs={12} md={6} sx={{ display: 'inline', mt: 2 }}>
                    <Typography variant="h4" fontWeight={550} sx={{ display: 'inline', ml: 3, lineHeight: 1.5 }}>
                      ${parseFloat(currentUser.wallet?.balance).toFixed(2) || '0.00'}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ display: 'block', ml: 2, lineHeight: 1.5 }}>
                      (${parseFloat(currentUser.wallet?.onHoldBalanace).toFixed(2) || '0.00'} on hold as of {moment(new Date()).format("hh:mm A, DD MMM YYYY")})
                    </Typography>
                  </Grid>
                  <Grid item container md={6} xs={12}>
                    <Box sx={{ width: mobile ? '100%' : 'auto', display: 'flex', flexGrow: 1, flexDirection: 'row', justifyContent: mobile ? 'center' : 'flex-end', alignItems: 'center' }}>
                      {Number(currentUser.wallet?.balance) > 0 &&
                        <Box sx={{ width: mobile ? '100%' : 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', mr: 2, mt: 2 }}
                          onClick={handleWithdraw}
                        >
                          <AttachMoneyOutlinedIcon fontSize='large' />
                          <Typography variant="subtitle2">
                            Withdraw
                          </Typography>
                        </Box>}
                      <Box sx={{ width: mobile ? '100%' : 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2, mt: 2, cursor: 'pointer' }} onClick={() => navigate("/profile/wallet/transactions")}>
                        <AccountBalanceWalletOutlinedIcon fontSize="large" />
                        <Typography variant="subtitle2">
                          Transactions
                        </Typography>
                      </Box>
                    </Box>

                  </Grid>
                  <Grid item xs={5} lg={2}>

                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </>)
          : (<>
            <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="h6" fontWeight={550}>
                My Swap Credits
              </Typography>
              <Grid item container xs={12} sx={{ width: '100%', display: "flex", justifyContent: "center", alignContent: 'center' }}>
                <Card sx={{ width: '98%', height: '95%', mb: 2, boxShadow: '1px 1px 1px 1px #9f9f9f' }}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} md={12} sx={{ display: 'inline', mt: 2,  mb: 2}}>
                      <Typography variant="h5" fontWeight={550} sx={{ display: 'inline', ml: 2}}>
                        Credits Owned: {parseFloat(currentUser.credits) || 'No Credits'}
                      </Typography>           
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </Grid>
          </>

          )}
        <Grid item xs={12}>
          <Typography variant="h6" fontWeight={550}>
            Recent Reviews
          </Typography>
        </Grid>

        <Reviews reviews={reviews} profile={currentUser} />

        <Grid item xs={12}>
          <Typography variant='h6' color='GrayText' sx={{ mt: 0, mb: 1 }}>More</Typography>
          <Divider orientation='horizontal' />
          <List>
            <ListItemButton onClick={() => navigate("/profile/favourites")}>
              <ListItemIcon sx={{ minWidth: 0, mr: 1 }}>
                <FavoriteBorderOutlinedIcon fontSize='medium' />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ sx: { fontSize: '1.1em' } }}>
                My Favourites
              </ListItemText>
              <ListItemIcon sx={{ minWidth: 0 }}>
                <ArrowForwardIosOutlinedIcon />
              </ListItemIcon>
            </ListItemButton>

            <ListItemButton onClick={() => navigate("/profile/paymentmethod")}>
              <ListItemIcon sx={{ minWidth: 0, mr: 1 }}>
                <AttachMoneyOutlinedIcon fontSize='medium' />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ sx: { fontSize: '1.1em' } }}>
                Add Payment Method
              </ListItemText>
              <ListItemIcon sx={{ minWidth: 0 }}>
                <ArrowForwardIosOutlinedIcon />
              </ListItemIcon>
            </ListItemButton>


            <ListItemButton onClick={() => navigate("/viewReviews ")}>
              <ListItemIcon sx={{ minWidth: 0, mr: 1 }}>
                <ReviewsOutlinedIcon fontSize='medium' />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ sx: { fontSize: '1.1em' } }}>
                My Reviews
              </ListItemText>
              <ListItemIcon sx={{ minWidth: 0 }}>
                <ArrowForwardIosOutlinedIcon />
              </ListItemIcon>
            </ListItemButton>

            <ListItemButton onClick={() => navigate("/about")}>
              <ListItemIcon sx={{ minWidth: 0, mr: 1 }}>
                <InfoOutlinedIcon fontSize='medium' />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ sx: { fontSize: '1.1em' } }}>
                About us
              </ListItemText>
              <ListItemIcon sx={{ minWidth: 0 }}>
                <ArrowForwardIosOutlinedIcon />
              </ListItemIcon>
            </ListItemButton>

            <ListItemButton onClick={userLogout}>
              <ListItemIcon sx={{ minWidth: 0, mr: 1 }}>
                <LogoutIcon fontSize='medium' />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ sx: { fontSize: '1.1em' } }}>
                Logout
              </ListItemText>
              <ListItemIcon sx={{ minWidth: 0 }}>
                <ArrowForwardIosOutlinedIcon />
              </ListItemIcon>
            </ListItemButton>
          </List>
        </Grid>
      </Grid>
      <Modal open={isWithdrawModal} onClose={() => setIsWithdrawModal(false)}>
        <Paper sx={{ padding: 2, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
          <WithdrawModal balance={parseFloat(currentUser.wallet?.balance).toFixed(2)} accNo={currentUser.bankAccountDetails?.bankAccountNo} handleClose={handleCloseWithdrawModalWithRefresh} />
        </Paper>
      </Modal>
      <ConfirmationDialog open={showNoBankInfoModal} handleClose={() => setShowNoBankInfoModal(false)}
        handleCancel={() => setShowNoBankInfoModal(false)}
        header={!currentUser.bankAccountDetails ? "No bank account" : (currentUser.bankAccountDetails.verified === null ? "No approved bank information" : "Bank information rejected")}
        dialogText={!currentUser.bankAccountDetails ? "You have yet to setup a bank account." : (currentUser.bankAccountDetails.verified === null ? "We are still reviewing your latest submitted bank account information." : "Your latest application has been rejected. Please re-apply.")}
        confirmText='Apply'
        showConfirm={!currentUser.bankAccountDetails || currentUser.bankAccountDetails.verified === false}
        handleConfirm={() => navigate('/profile/bankdetails')}
      />
    </>
  );
};

export default ProfileItem;