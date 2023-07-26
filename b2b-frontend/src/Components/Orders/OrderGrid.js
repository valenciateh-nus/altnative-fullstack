import React from 'react';
import { Card, Grid, Typography, Box, Avatar, CardHeader, ImageListItem, CircularProgress, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import * as orderApi from '../../API/orderApi.js';
import { getUserByUsername } from '../../API/userApi.js';

const OrderGrid = ({ title, name, status, id, chat}) => {
  const [project, setProject] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [image, setImage] = React.useState([]);
  const [avatar, setAvatar] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    setLoading(true);
    getUser();
    retrieveProject();
  }, []);

  const getUser = async () => {
    try {
      await getUserByUsername(name).then((val) => {
        setAvatar(val.data.avatar);
      })
    } catch (error) {
      setAvatar([])
    };
  }

  const retrieveProject = async () => {
    try {
      await orderApi.getProjectByOrderId(id).then((val) => {
        setProject(val.data);
        setImage(val.data.imageList);
      })
    } catch (error) {
      setProject([]);
    } finally {
      setLoading(false);
    }
  }

  const handleReroute = () => {
    navigate(`/chat/${chat}?user2=${name}`);
  }

  console.log(project);
  return (!loading ? (
    <Grid
      item
      sm={4}
      xs={6}
      sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center', margin: '2px 0' }}
    >
        <Card sx={{ height: '100%', width: '100%', overflow: 'scroll' }} onClick={handleReroute}>
          <Grid container sx={{ width: '100%', display: 'flex', alignContent: 'center', justifyContent: 'center', marginTop: '1em' }}>
            <Grid item xs={12} sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
              <ImageListItem key={'image'} style={{ width: 90, height: 90, overflow: 'hidden' }} >
                {Array.from(image).slice(0, 1).map((val) => (
                  <img src={val.url} key={val.url} loading="lazy" style={{ cursor: 'pointer' }} />
                ))}
              </ImageListItem>
            </Grid>
            <Grid item xs={11} sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                {title}
              </Typography>
            </Grid>
            <Chip label={status} sx={{ background: '#FB7A56', color: 'white', fontWeight: 'bold', fontSize: '0.5em', height: '2em', bottom: 0, padding: 0, marginTop: '5px' }} />
            <Grid item xs={12} sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center', marginBottom: 0 }}>
              <CardHeader
                avatar={
                  <Avatar
                  src={avatar ? avatar.url : ''}
                    sx={{
                      height: '1em',
                      width: '1em',
                      flexDirection: 'column'
                    }} />
                }
                title={name}
              />
            </Grid>
          </Grid>
        </Card>
    </Grid>
  ) : (
    <Box sx={{ display: 'flex', flexGrow: 1, height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <CircularProgress color='secondary' sx={{ marginTop: 15 }} />
      <Typography>Loading...</Typography>
    </Box>
  )
  );
};

export default OrderGrid;