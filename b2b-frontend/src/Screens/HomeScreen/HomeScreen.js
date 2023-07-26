import React from 'react';
import { Avatar, Divider, Grid, ImageList, ImageListItem, ImageListItemBar, Typography } from '@mui/material';
import { Box } from '@mui/system';
import BidCard from '../../Components/HomeScreen/BidCard';
import emptyImage from '../../Components/HomeScreen/emptyImage.jpeg';
import MyProjectRequest from '../../Components/HomeScreen/MyProjectRequest';
import BidList from '../../Components/HomeScreen/BidList';
import { useSelector } from 'react-redux';

const bids = [
  {
    id: 2,
    type: "Make Skirt from Denim Deadstocks",
    status: "PENDING",
    quantity: 120,
    proposedDeadline: new Date()
  },
  {
    id: 5,
    type: "Make Skirt from Denim Deadstocks",
    status: "ACCEPTED",
    quantity: 120,
    proposedDeadline: new Date()
  },
  {
    id: 9,
    type: "Make Skirt from Denim Deadstocks",
    status: "REJECTED",
    quantity: 120,
    proposedDeadline: new Date()
  },
  {
    id: 2,
    type: "Make Skirt from Denim Deadstocks",
    status: "PENDING",
    quantity: 120,
    proposedDeadline: new Date()
  },
]

const list = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const HomeScreen = () => {
  const currentUser = useSelector(state => state.currUserData);

  return (
    <Grid container spacing={1} sx={{ p: 2 }}>
      <Grid item container lg={12}>
        <Grid item lg={6} xs={12}>
          <Typography fontWeight={600} sx={{ fontSize: 30, ml: 1 }}>
            Welcome back!
          </Typography>
        </Grid>
        <Grid item lg={6} xs={12}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', float: 'right', mr: 3 }}>
            <Avatar src={currentUser?.avatar?.url} sx={{ maxWidth: '35px', maxHeight: '35px', height: '1.8em', width: '1.8em', bgcolor: '#FB7A56', marginRight: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='h6' fontWeight={550}>{currentUser?.name}</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Divider orientation='horizontal' sx={{ marginTop: 1 }} />
        </Grid>
      </Grid>

      <Grid item xs={12} sx={{ mt: 2 }}>
        <Typography variant='h5' fontWeight={600} sx={{ ml: 1 }}>
          See new bids
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <BidList />
        {/* <Box sx={{ display: 'flex', maxHeight: 370, height: '50vh', overflowX: 'scroll' }}>

       {Array.from(bids).map((bid) => (
          <BidCard bid={bid} />
        ))}
        </Box> */}
      </Grid>

      <Grid item xs={12}>
        <Typography variant='h5' fontWeight={600} sx={{ ml: 1 }}>
          My Project Requests
        </Typography>
      </Grid>

      <MyProjectRequest />

      {/* <Grid item xs={12} sx={{ display: "flex", flexDirection: 'row' }}>
        <Box sx={{ display: "flex", overflowX: 'scroll' }}>
          <ImageList sx={{ overflowX: 'scroll', display: 'flex', ml: 1 }}>
            {Array.from(list).slice(0, 5).map((img, i) => (
              <ImageListItem key={i} style={{ maxWidth: 180, minWidth: 180, height: 180, overflow: 'hidden', marginRight: 30 }} >
                <img src={emptyImage} alt={emptyImage} loading="lazy" style={{ cursor: 'pointer', display: 'flex' }} />
                <ImageListItemBar
                  title="Image Title"
                  subtitle="Image author"
                />              
               </ImageListItem>
            ))}
          </ImageList>
        </Box>
      </Grid> */}
    </Grid >
  );
};

export default HomeScreen;