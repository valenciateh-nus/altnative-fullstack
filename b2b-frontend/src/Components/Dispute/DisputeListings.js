import React from 'react';
import { Card, Grid, Typography, Box, Avatar, CardHeader, ImageList, ImageListItem, Chip, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { Image } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import * as orderApi from '../../API/orderApi.js';
import * as userApi from '../../API/userApi.js';
import * as disputeApi from '../../API/disputeApi.js';
import moment from 'moment';

const DisputeListings = ({ disputeId }) => {
  const [project, setProject] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [image, setImage] = React.useState([]);
  const [avatar, setAvatar] = React.useState([]);
  const [dispute, setDispute] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    setLoading(true);
    getDisputeById();
    // getUser();
  }, []);

  const getDisputeById = async () => {
    try {
      console.log("DISPUTEID IN DISPUTELISTINGS: ", disputeId);
      await disputeApi.retrieveDisputeById(disputeId).then((val) => {
        console.log("DISPUTOBLE: " , val.data);
        setDispute(val.data);
      })
    } catch (error) {
      console.log(error);
      setDispute([]);
    } finally {
      setLoading(false);
    }
  }

  const getUser = async () => {
    try {
      await userApi.getUserByUsername(dispute.appUser.username).then((val) => {
        setAvatar(val.data.avatar);
      })
    } catch (error) {
      setAvatar([])
    }
  }

  // const retrieveProject = async () => {
  //   try {
  //     await orderApi.getProjectByOrderId(id).then((val) => {
  //       setProject(val.data);
  //       setImage(val.data.imageList);
  //     })
  //   } catch (error) {
  //     setProject([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  const handleReroute = () => {
    navigate(`/disputeRequest/${disputeId}`);
  }

  console.log(dispute);

  console.log('loading in listing is', loading);

  return (!loading ? (
    <Card
      onClick={handleReroute}
      sx={{
        width: '99%',
        px: 1,
        py: 3,
        boxShadow: '2px',
        marginBottom: 2,
        marginTop: 1,
        cursor : 'pointer',
      }}
    >
      <Grid container spacing={0}>
        <Grid item xs={12} container sx={{ width: '100%', overflowWrap: 'break-word' }}>
          <Grid item xs={12} container spacing={2} style={{ width: '50%' }}>
            <Grid item xs={12}>
              <Typography sx={{ overflowWrap: 'break-word', fontSize: 16, fontWeight: 600, ml: 1 }}>
                Dispute Request #{dispute.id}
              </Typography>
              <Chip label={dispute.disputeStatus} color={dispute.status === 'REJECTED' ? 'error' : (dispute.status === 'ACCEPTED' ? 'success' : 'secondary')} sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.5em', height: 20, bottom: 0, padding: 0, marginBottom: 0.5, marginTop: 1, marginLeft: 1 }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ ml: 1 }}>
                Date created: {moment(dispute.dateCreated).format("DD/MM/YYYY")}
              </Typography>
            </Grid>
            {/* <Grid item xs={12}>
                <Typography sx={{ overflowWrap: 'break-word', fontSize: 15, fontWeight: 550 }}>
                  {dispute.reason}
                </Typography>
                <Chip label={dispute.status} sx={{ background: '#FB7A56', color: 'white', fontWeight: 'bold', fontSize: '0.5em', height: '2em', bottom: 0, padding: 0, marginTop: '5px' }} />
              </Grid> */}
            {/* <Grid item xs={12}>
                <Typography variant="body2" sx={{ overflowWrap: 'break-word', display: 'inline' }}>
                  <CardHeader
                    avatar={
                      <Avatar
                        src={avatar ? avatar.url : ''}
                        sx={{
                          height: '1.0em',
                          width: '1.0em',
                          flexDirection: 'column',
                        }} />
                    }
                    title={dispute.appUser.username}
                    style={{ padding: 0, margin: 0 }}
                  />
                </Typography>
              </Grid> */}
          </Grid>
        </Grid>
      </Grid>
    </Card>
  ) : (
    <Box sx={{ display: 'flex', flexGrow: 1, height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <CircularProgress color='secondary' sx={{ marginTop: 15 }} />
      <Typography>Loading...</Typography>
    </Box>
  )
  );
};

export default DisputeListings;