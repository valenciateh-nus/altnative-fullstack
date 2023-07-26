import React from 'react';
import { Box, Card, CardContent, Avatar, Typography, useMediaQuery, Rating, ImageList, ImageListItem, CardActionArea } from '@mui/material';
import logo from '../../Components/HomeScreen/emptyImage.jpeg';
import Carousel from 'react-material-ui-carousel';
import ProfileCard from '../ProfileCard';
import { toTitleCase } from '../../constants';
import { retrieveProjectListingById } from '../../API/projectApi';
import { apiWrapper } from '../../API';
import { retrieveProjectListingsByRefashionerId } from '../../API/userApi';
import * as userApi from '../../API/userApi.js';
import { useNavigate } from 'react-router-dom';
import InContainerLoading from '../InContainerLoading';


const RefashionerCard = ({ username }) => {

  const navigate = useNavigate();

  const [refashioner, setRefashioner] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  var cardStyle = {
    minWidth: '250px',
    margin: 0.5,
    padding: 0.5,
  };

  React.useEffect(() => {
    getRefashioner();
  }, [])

  async function getRefashioner() {
    try {
      await userApi.getUserByUsername(username).then((res) => {
        setRefashioner(res.data);
        isLoading(false);
      })
    } catch (error) {
      const data = error?.response?.data?.message;
      console.log("ERROR MSG: " + JSON.stringify(error));
    } finally {
      isLoading(false);
    }
  }

  return (isLoading ? (
    <Box sx={cardStyle}>
      <Card>
        <CardActionArea onClick={() => navigate(`/userProfile/${refashioner.id}`)}>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Avatar src={refashioner.avatar?.url} alt={refashioner.name} sx={{ maxWidth: '12vw', maxWidth: '12vw', bgcolor: '#FB7A56', marginRight: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant='body2'>{toTitleCase(refashioner.name)}</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Rating value={refashioner.rating} readOnly sx={{ mr: 1 }} size='small' />
                  <Typography variant='body1' color='GrayText'>{`(${Math.round(refashioner.rating).toFixed(1)})`}</Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>)
    : (<Box>
      <InContainerLoading />
    </Box>)
  );
};

export default RefashionerCard;

