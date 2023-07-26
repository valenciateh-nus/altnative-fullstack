import { Card, Chip, Grid, SvgIcon, Typography } from '@mui/material';
import React from 'react';
import moment from 'moment';

const TransactionCard = ({ transaction }) => {
  return (
    <Card
      sx={{
        width: '95%',
        px: 2,
        py: 2,
        boxShadow: '2px',
        marginLeft: 2.5,
        marginTop: 1,
        marginBottom: 1
      }}
    >
      <Grid container spacing={0} sx={{ height: '100%' }}>
        <Grid item xs={8} container spacing={0}>
          <Grid item xs={11} >
            <Typography sx={{ overflowWrap: 'break-word', fontSize: 15, fontWeight: "bold" }}>
              Transaction ID #{transaction.id}
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ marginTop: 0 }}>
            {transaction?.transactionId && <Typography  variant = 'body2' fontWeight='bold' sx={{ overflowWrap: 'break-word' }}>
              Bank Transfer No: {transaction.transactionId}
            </Typography>}
            {transaction?.remarks && <Typography sx={{ overflowWrap: 'break-word', fontSize: 12 }}>
              Remarks: {transaction.remarks}
            </Typography>}
            <Typography sx={{ overflowWrap: 'break-word', fontSize: 12 }}>
              Transaction Date: {transaction.dateCreated ? moment(transaction.dateCreated).format("DD/MM/YYYY") : 'No Deadline Set'}
            </Typography>
            <Chip label={transaction.paymentStatus || 'INVALID STATUS'} color={transaction.paymentStatus?.includes("PENDING") ? 'primary' : 'secondary'} sx={{ color: 'white', fontWeight: 'bold', fontSize: 10, height: '2em', bottom: 0, padding: 0, marginTop: 0.5 }} />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: '0' }}>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Typography sx={{ overflowWrap: 'break-word', fontSize: 14, fontWeight: 650, lineHeight: 6, float: 'right', marginRight: 2 }}>
            {transaction?.paymentStatus?.includes("FEES") || transaction?.paymentStatus?.includes("WITHDRAW") ? `-SGD${Math.abs(transaction.amount).toFixed(2)}` : `+SGD${Number(transaction.amount).toFixed(2)}`}
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

export default TransactionCard;