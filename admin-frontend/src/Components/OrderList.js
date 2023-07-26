import React from 'react';
import { Card, Grid, Typography, Box, Avatar, CardHeader, ImageList, ImageListItem, Chip, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { Image } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import * as orderApi from '../API/orderApi.js';
import * as userApi from '../API/userApi.js';

const OrderList = ({ title, name, status, id, chat }) => {
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
      await userApi.getUserByUsername(name).then((val) => {
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
    navigate(`/order/${id}`);
  }

  console.log(project);
  console.log(id);

  return (!loading ? (
      <Card
        onClick={handleReroute}
        sx={{
          height: '9em',
          width: '99%',
          px: 2,
          py: 2,
          boxShadow: '2px',
          marginBottom: 3,
          cursor : 'pointer',
        }}
      >
        <Grid container spacing={6}>
          <Grid xs={4} item>
            <ImageListItem key={'image'} style={{ width: 110, height: 110, overflow: 'hidden' }} >
              {Array.from(image).slice(0, 1).map((val) => (
                <img src={val.url} key={val.url} loading="lazy" style={{ cursor: 'pointer' }} />
              ))}
            </ImageListItem>
          </Grid>
          <Grid item xs={8} container sx={{ width: '100%', overflowWrap: 'break-word' }}>
            <Grid item xs={12} container spacing={2} style={{ width: '50%' }}>
              <Grid item xs={12}>
                <Typography sx={{ overflowWrap: 'break-word', fontSize: 19, fontWeight: 650 }}>
                  {title}
                </Typography>
                <Chip label={status} sx={{ background: '#FB7A56', color: 'white', fontWeight: 'bold', fontSize: 12, height: '2em', bottom: 0, padding: 0, marginTop: '5px' }} />
              </Grid>
              <Grid item xs={12}>
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
                    title={name}
                    style={{ padding: 0, margin: 0 }}
                  />
                </Typography>
              </Grid>
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

export default OrderList;