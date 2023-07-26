import { Button, Card, Grid, SvgIcon, TextField, Typography } from '@mui/material';
import { set } from 'date-fns';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as disputeApi from '../../API/disputeApi';
import { ArrowLeft as ArrowIcon } from 'react-feather';
import { DisplaySettingsOutlined } from '@mui/icons-material';

const DisputeRefundForm = ({ disputeId = 0, viewOnly = false }) => {
  const [refundForm, setRefundForm] = React.useState({ 'accountNo': '' });
  const [dispute, setDispute] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (disputeId !== 0) {
      setLoading(true);
      getDisputeById();
    }
  })

  async function getDisputeById() {
    await disputeApi.retrieveDisputeByDisputeId(disputeId).then((val) => {
      setDispute(val.data);
    })
  }

  const handleChange = (e) => {
    setRefundForm({ ...refundForm, ['accountNo']: e.target.value });
  }

  const handleSubmit = () => {
    //
  }

  return (
    <Grid container sx={{ px: 1 }}>
      <Grid item xs={12} lg={12}>
        <SvgIcon
          fontSize="medium"
          color="action"
          sx={{ position: 'absolute', float: 'left', top: 30 }}
          onClick={() => navigate(-1)}
        >
          <ArrowIcon />
        </SvgIcon>
      </Grid>
      <Grid xs={12} lg={12} sx={{ display: 'flex', alignItems: "center", justifyContent: 'center' }}>
        <Typography fontWeight={650} align="center" sx={{ fontSize: 28, mt: 4 }}>
          Refund for Dispute #{disputeId}
        </Typography>
      </Grid>
      <Grid item xs={12} lg={12} container sx={{ height: 400, mt: 2, width: '100%' }}>
        <Card sx={{ px: 2, py: 1, width: '100%' }}>
          <Grid item xs={12} lg={12} sx={{ mt: 2 }}>
            <Typography variant='body1' fontSize={16}>Please fill up this form to process a refund of <Typography fontWeight={600} fontSize={18} display="inline">SGD{dispute.refundAmount}</Typography> for your dispute request <Typography fontWeight={600} fontSize={18} display="inline">#{dispute.id}</Typography></Typography>
          </Grid>
          <Grid item xs={12} lg={12} sx={{ mt: 4 }}>
            <Typography variant='h6'>Refund Amount</Typography>
            <Typography fontSize={18}>SGD {dispute.refundAmount}</Typography>
          </Grid>
          <Grid item xs={12} lg={12} sx={{ mt: 2 }}>
            <Typography variant='h6'>Bank Account Number: </Typography>
            <TextField
              margin="normal"
              required
              style={{ width: '95%' }}
              name="accountNo"
              value={refundForm['accountNo']}
              color="secondary"
              onChange={handleChange}
            // error={errorDescription}
            // helperText={errorDescription && helperText.description}
            />
          </Grid>
          <Grid item xs={12} lg={12} sx={{ mt: 2 }}>
            <Button variant="contained" color="secondary" onClick={handleSubmit} disabled={viewOnly} sx={{ color: 'white', width: '100%', height: 50, fontWeight: 600 }}>
              Submit Form
            </Button>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DisputeRefundForm;