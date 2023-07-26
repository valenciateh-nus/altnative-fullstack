import React from 'react';
import { Card, Grid, Typography, Box, Avatar, CardHeader, ImageList, ImageListItem, Chip, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { Image } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import * as orderApi from '../../API/orderApi.js';
import * as userApi from '../../API/userApi.js';
import { apiWrapper } from '../../API/index.js';

const OrderList = ({ title, name, status, orderId, chat }) => {
  const [project, setProject] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [image, setImage] = React.useState([]);
  const [avatar, setAvatar] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    //setLoading(true);
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

  async function retrieveProject() {
    let res;

    res = await apiWrapper(orderApi.getProjectByOrderId(orderId),'',false);
    if(res.data) {
      console.log("PROJECT DATA: ", res.data);
      setProject(res.data);
      setImage(res.data.imageList);
      return;
    }
    res = await apiWrapper(orderApi.getMarketplaceByOrderId(orderId),'',false);
    if(res.data) {
      console.log("MARKETPLACE DATA: ", res.data);
      setProject(res.data);
      setImage(res.data.imageList);
      return;
    }

    setLoading(false);

  }

  const handleReroute = () => {
    navigate(`/chat/${chat}?user2=${name}`);
  }

  return (!loading ? (
      <Card
        onClick={handleReroute}
        sx={{
          height: '9em',
          width: '99%',
          px: 2,
          py: 2,
          boxShadow: '2px',
          marginBottom: 3
        }}
      >
        <Grid container spacing={6}>
          <Grid xs={4} item>
            <ImageListItem key={'image'} style={{ width: 100, height: 100, overflow: 'hidden' }} >
              {image?.length > 0 &&
                <img src={image[0]?.url} key={image[0]?.url} loading="lazy" style={{ cursor: 'pointer' }} />
              }
            </ImageListItem>
          </Grid>
          <Grid container item xs={8} sx={{ width: '100%', overflowWrap: 'break-word', cursor:'pointer' }}>
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