import { Button, IconButton } from '@mui/material';
import React from 'react';
import { Heart as HeartIcon } from 'react-feather';
import * as marketplaceApi from '../../API/marketplaceApi';

const HeartButton = ({ listing, clicked }) => {

  const [favorited, setFavourited] = React.useState(false);

  React.useEffect(() => {
    console.log(clicked);
    setFavourited(clicked);
  }, [])

  const handleClick = (e) => {
    if (clicked) { //alr favorite
      marketplaceApi.addFavorite(listing.id).then((val) => {
        setFavourited(false);
      })
    } else { //new fav
      marketplaceApi.addFavorite(listing.id).then((val) => {
        setFavourited(true);
      })
    }
  }

  return (
    <Button variant="contained" color={favorited ? 'primary' : 'secondary'} sx={{ color: 'white', fontWeight: '600', padding: 1, height: '100%', width: '90%'}} onClick={handleClick}>
        <IconButton sx={{ color: 'white'}}>
            <HeartIcon fill="white" size="30px"/>
          </IconButton>
        </Button>
  );
};

export default HeartButton;