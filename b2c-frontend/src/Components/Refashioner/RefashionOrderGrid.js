import React from 'react';
import { Card, Grid, Typography, Box, Avatar, CardHeader, ImageListItem, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

const RefashionerOrderGrid = ({ title, name, completed = false, deadline, created, type, chat, refashionee}) => {
  const totalDays = moment(deadline).diff(moment(created), 'days');
  const progressDays = moment(new Date()).diff(moment(created), 'days');
  const percentageComplete = Math.round((progressDays / totalDays) * 100);
  const currUserData = useSelector((state) => state.currUserData);
  const navigate = useNavigate();

  const handleReroute = () => {
    navigate(`/chat/${chat}?user2=${refashionee}`);
  }

  return (
    <Grid
      item
      sm={4}
      xs={6}
      sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center', margin: '2px 0' }}
    >
        <Card sx={{ height: '100%', width: '100%', overflow: 'scroll', padding: 1 }} onClick={handleReroute}>
          <Grid container sx={{ width: '100%', display: 'flex', alignContent: 'center', justifyContent: 'center', marginTop: '1em' }}>
            <Grid item xs={12} sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
              <ImageListItem key={'image'} style={{ width: 90, height: 90, overflow: 'hidden' }} >
                <img src={'https://osn-images.com/22207/square-back-rayon-dress.jpg'} loading="lazy" style={{ cursor: 'pointer' }} />
              </ImageListItem>
            </Grid>
            <Grid item xs={11} sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 550, fontSize: 15 }}>
                {title}
              </Typography>
            </Grid>
            {type && (
              <Chip
                label={type}
                color="primary"
                style={{
                  fontWeight: "550",
                  color: "white",
                  fontSize: 10,
                  borderRadius: 15,
                  height: 20,
                  marginTop: 2,
                }}
              />
            )}
            <Grid item xs={12} sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center', marginBottom: 0 }}>
              <CardHeader
                avatar={
                  <Avatar
                    sx={{
                      height: '1em',
                      width: '1em',
                      flexDirection: 'column',
                      marginLeft: 0.5
                    }} />
                }
                title={
                  <Typography sx={{ fontSize: "13px", marginLeft: -1 }}>
                    {name}
                  </Typography>
                }
              />
            </Grid>
            {completed ? (
              <Grid item xs={12} sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                <Chip
                  label="Completed"
                  style={{
                    background: "#FB7A56",
                    fontWeight: "550",
                    color: "white",
                    fontSize: 10,
                    borderRadius: 15,
                    height: 20,
                  }}
                /></Grid>) : (
              <>
                <Grid item xs={12}>
                  <Typography sx={{ fontSize: 11 }}>
                    Project Timeline
                  </Typography>
                </Grid>
                <Grid item xs={10}>
                  <Box sx={{ background: 'rgba(251,122,86, 0.4)', borderRadius: '10px', height: "13px", marginRight: 2 }}>
                    <Box sx={{ background: '#FB7A56', borderRadius: '10px', height: "13px", overflow: 'hidden', width: `${percentageComplete}%`, maxWidth: '100%', marginRight: 2 }}>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={2} sx={{ display: 'flex', justifyContent: "center", alignContent: "center" }}>
                  {percentageComplete <= 100 ? (
                    <Box>
                      <Typography sx={{ fontSize: 10, marginLeft: 0 }}>
                        {percentageComplete}%
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <Typography sx={{ fontSize: 7, fontWeight: 550, color: 'red', marginRight: 2 }}>
                        OVERDUE
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </>
            )}
          </Grid>
        </Card>
    </Grid>
  );
};

export default RefashionerOrderGrid;