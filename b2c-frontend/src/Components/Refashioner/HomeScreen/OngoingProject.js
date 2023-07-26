import React from 'react';
import { Card, Grid, Typography, Box, Avatar, CardHeader, ImageList, ImageListItem, Chip, SvgIcon, CircularProgress } from '@mui/material';
import { Image } from '@mui/icons-material';
import { Clock, DollarSign } from 'react-feather';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { generateChatId } from '../../../constants';
import * as userApi from '../../../API/userApi.js'
import * as orderApi from '../../../API/orderApi'

const OngoingProject = ({ title, name, completed = false, deadline, created, type, chat, refashionee, val, id}) => {
  const totalDays = moment(deadline).diff(moment(created), 'days');
  const progressDays = moment(new Date()).diff(moment(created), 'days');
  const percentageComplete = Math.round((progressDays / totalDays) * 100);
  const currUserData = useSelector((state) => state.currUserData);
  const navigate = useNavigate();
  const [user, setUser] = React.useState([]);
  const [avatar, setAvatar] = React.useState([]);
  const [project, setProject] = React.useState([]);
  const [image, setImage] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    getUser();
    retrieveProject();
  }, [])

  const getUser = async() => {
    try {
      await userApi.getUserByUsername(name).then((val) => {
        setUser(val.data);
        setAvatar(val.data.avatar);
      })
    } catch (error) {
      setUser([]);
    }
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

  return (!loading ? (
    <Card
      onClick={handleReroute}
      sx={{
        width: '99%',
        px: 2,
        py: 2,
        boxShadow: '2px',
        marginBottom: 2,
        cursor: 'pointer'
      }}
    >
      <Grid container spacing={0} sx={{ height: '100%' }}>
        <Grid Item xs={4} item>
          <ImageListItem key={'image'} style={{ width: 90, height: 90, overflow: 'hidden' }} >
          {Array.from(image).slice(0, 1).map((val) => (
                <img src={val?.url} key={val.url} loading="lazy" style={{ cursor: 'pointer' }} />
              ))}         
               </ImageListItem>
        </Grid>
        <Grid item xs={8} sm container>
          <Grid item xs={12}>
            <Typography sx={{ overflowWrap: 'break-word', fontSize: 15, fontWeight: "bold", marginLeft: 2 }}>
              {title}
            </Typography>
            {type && (
              <Chip
                label={type}
                color="primary"
                style={{
                  fontWeight: "550",
                  color: "white",
                  fontSize: 11,
                  borderRadius: 15,
                  height: 20,
                  marginTop: 2,
                  marginLeft: 13,
                }}
              />
            )}
            <Typography sx={{ marginTop: 2, marginLeft: 1 }}>
              <CardHeader
                avatar={
                  <Avatar
                    src={avatar ? avatar.url : ''}
                    sx={{
                      height: '1.0em',
                      width: '1.0em',
                      flexDirection: 'column',
                      marginLeft: 0.5
                    }} />
                }
                title={
                  <Typography sx={{ fontSize: 13, marginLeft: -1 }}>
                    {name}
                  </Typography>
                }
                style={{ padding: 0, margin: 0, marginTop: -1, marginLeft: '4px' }}
              />
            </Typography>
          </Grid>
        </Grid>
        {completed ? (
          <Chip
            label="Completed"
            style={{
              background: "#FB7A56",
              fontWeight: "550",
              color: "white",
              fontSize: 10,
              borderRadius: 15,
              height: 20,
              marginTop: 2
            }}
          />) : (
          <>
            <Grid item xs={12}>
              <Typography sx={{ fontSize: 11 }}>
                Project Timeline
              </Typography>
            </Grid>
            <Grid item xs={10}>
              <Box sx={{ background: 'rgba(251,122,86, 0.4)', borderRadius: '10px', height: "13px" }}>
                <Box sx={{ background: '#FB7A56', borderRadius: '10px', height: "13px", overflow: 'hidden', width: `${percentageComplete}%`, maxWidth: '100%' }}>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={1} sx={{ display: 'flex', justifyContent: "center", alignContent: "center" }}>
              {percentageComplete <= 100 ? (
                <Box>
                  <Typography sx={{ fontSize: 10, marginLeft: 1 }}>
                    {percentageComplete}%
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography sx={{ fontSize: 10, marginLeft: 1, fontWeight: 550, color: 'red', marginLeft: 4 }}>
                    OVERDUE
                  </Typography>
                </Box>
              )}
            </Grid>
          </>
        )}
      </Grid>
    </Card>
  ) : (
    <Box sx={{ display: 'flex', flexGrow: 1, height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
    <CircularProgress color='secondary'/>
    <Typography>Loading...</Typography>
  </Box>
  )
  );
};

export default OngoingProject;