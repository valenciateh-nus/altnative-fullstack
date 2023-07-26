import React from 'react';
import { Card, Grid, Typography, Box, Avatar, CardHeader, ImageList, ImageListItem, Chip, SvgIcon, Badge } from '@mui/material';
import { Image } from '@mui/icons-material';
import { Clock, DollarSign } from 'react-feather';
import moment from 'moment';
import * as offerApi from '../../../API/offerApi.js';

const RequestList = ({ title = '0', category, deadline = null, budget = '0', status = '', image, id, refashionee, business }) => {
  return (
    <Card
      sx={{
        width: '99%',
        px: 2,
        py: 3,
        boxShadow: '2px',
        marginBottom: 2
      }}
    >
      <Grid container spacing={1} sx={{ height: '100%' }}>
        <Grid item xs={4} sx={{ mt: 2, overflow: 'hidden'}}>
          <ImageListItem key={'image'} style={{ width: 90, height: 90, overflow: 'hidden' }} >
            <img src={image[0]?.url} loading="lazy" style={{ cursor: 'pointer' }} />
          </ImageListItem>
        </Grid>
        <Grid item xs={7} sm container sx={{ ml: 1}}>
          <Grid item xs={12} container spacing={0}>
            <Grid item xs={12} >
              <Typography sx={{ overflowWrap: 'break-word', fontSize: 15, fontWeight: "bold" }}>
                {title}
              </Typography>
            </Grid>
            <Grid item xs={12} >
              {business ? (
                <Chip label="Business" color="primary" sx={{ color: 'white', fontWeight: 'bold', fontSize: 11, height: '2em', bottom: 0, padding: 0, }} />
              ) : (
                <Chip label="Refashionee" color="info" sx={{ color: 'white', fontWeight: 'bold', fontSize: 11, height: '2em', bottom: 0, padding: 0, }} />
              )}
              <Chip label={category?.categoryName} color="secondary" sx={{ color: 'white', fontWeight: 'bold', fontSize: 11, height: '2em', bottom: 0, padding: 0, marginLeft: 0.5  }} />
            </Grid>
            <Grid item xs={12} sx={{ marginTop: '5px' }}>
              <Typography sx={{ overflowWrap: 'break-word', fontSize: 12 }}>
                <SvgIcon
                  fontSize="small"
                  color="action"
                  sx={{ color: '#FB7A56', margin: '1px 5px' }}
                >
                  <Clock />
                </SvgIcon>
                {deadline ? moment(deadline).format("DD/MM/YYYY") : 'No Deadline Set'}
              </Typography>
              <Typography sx={{ overflowWrap: 'break-word', fontSize: 12 }}>
                <SvgIcon
                  fontSize="small"
                  color="action"
                  sx={{ color: '#FB7A56', margin: '1px 5px' }}
                >
                  <DollarSign />
                </SvgIcon>
                SGD {budget != Math.round(budget) ? Number(budget).toFixed(2) : budget}
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ marginTop: 1 }}>
              <Typography variant="body2" sx={{ overflowWrap: 'break-word', display: 'inline' }}>
                <CardHeader
                  avatar={
                    <Avatar
                      src={refashionee.avatar ? refashionee.avatar.url : ''}
                      sx={{
                        height: 20,
                        width: 20,
                        flexDirection: 'column',
                        marginRight: 0
                      }} />
                  }
                  title={refashionee.username}
                  titleTypographyProps={{ fontWeight: 550, fontSize: 12 }}
                  style={{ padding: 0, margin: 0, fontSize: 10}}
                />
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default RequestList;