import { Avatar, Card, Grid, Link, SvgIcon, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router';
import moment from 'moment';
import { ArrowRight as ArrowIcon } from 'react-feather';

const BusinessList = ({ business, refashioner }) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={!refashioner ? () => navigate(`/businessProfile/${business.id}`) : () => navigate(`/userProfile/${business.id}`)}
      sx={{
        height: '9em',
        width: '99%',
        px: 2,
        py: 2,
        boxShadow: '2px',
        marginBottom: 3,
        cursor: 'pointer'
      }}
    >
      <Grid container spacing={2}>
        <Grid xs={3} lg={2} item>
          <Avatar src={business?.avatar?.url} alt={business.name} sx={{ maxWidth: '18vw', maxHeight: '18vw', height: '4em', width: '4em', bgcolor: '#FB7A56', marginRight: 2, marginTop: 2 }} />
        </Grid>
        <Grid item xs={6} lg={8} container sx={{ width: '100%', overflowWrap: 'break-word' }}>
          <Grid item xs={12} container spacing={2} style={{ width: '50%' }}>
            <Grid item xs={12} sx={{ marginTop: 1, marginLeft: 1 }}>
              <Typography sx={{ overflowWrap: 'break-word', fontSize: 18, fontWeight: 650, marginTop: 1 }}>
                {business.name}
              </Typography>
              <Typography variant="subtitle2" sx={{ overflowWrap: 'break-word', marginTop: 1 }}>
                Joined: {moment(business.dateCreated).format("DD/MM/YYYY")}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={3} lg={2}>
          <SvgIcon
            fontSize="large"
            color="action"
            sx={{ marginTop: 4.5, float: 'right', marginRight: "1vw" }}
          >
            <ArrowIcon />
          </SvgIcon>
        </Grid>
      </Grid>
    </Card>
  );
};

export default BusinessList;