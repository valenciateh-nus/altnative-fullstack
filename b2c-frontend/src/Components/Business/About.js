import React from 'react'
import { Chip, Box, Container, Grid, Rating, SvgIcon, Typography, Avatar, ImageList, ImageListItem, ImageListItemBar, useMediaQuery, Link } from '@mui/material'
import ProfileCard from '../ProfileCard';
import { useSelector } from 'react-redux';
import { makeStyles } from "@mui/styles";
import { useTheme } from '@emotion/react';
import { useParams } from 'react-router';
import * as userApi from '../../API/userApi';

const useStyles = makeStyles((theme) => ({
  imageList: {
      flexWrap: 'nowrap',
      display: 'flex',
      flexDirection: 'row',
      overflow: 'scroll',
  }
}));

export default function About({user}) {
  const currentUser = useSelector(state => state.currUserData);
  const styles = useStyles();
  const theme = useTheme();
  const notHidden = useMediaQuery(theme => theme.breakpoints.up('md'));
  const { id = 0 } = useParams();
  const [business, setBusiness] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  console.log("BIZ", business);
  
  React.useEffect(() => {
    setLoading(true);
    getBusiness();
  }, [])

  async function getBusiness() {
    try {
      await userApi.getUserById(id).then((val) => {
        console.log(val.data);
        setBusiness(val.data);
      })
    } catch (error) {
      setBusiness([]);
    } finally {
      setLoading(false);
    }
  }

  function getCertificationName(fileName) {
    const list = fileName.split("-");
    const certName = list[list.length -1]; // Get last element of the split '-'
    return certName
  }

  function reroute (site) {
    window.location.href = site;
  }

  return (
    <Container sx={{ mt: 2 }}>
      <Box>
        <Typography variant='h6' fontWeight={550} gutterBottom>About us</Typography>
        <Typography variant='subtitle1'>{business?.description}</Typography>
        <Typography variant='h6' fontWeight={550} gutterBottom sx={{ mt: 2 }}>Website</Typography>
        <Typography variant='h6' gutterBottom sx={{ mt: 2 }}>
          <Link href={business?.site} underline="hover" color="secondary">
            {business?.site}
          </Link>
        </Typography>
        <Typography variant='h6' fontWeight={550} gutterBottom sx={{ mt: 2 }}>Contact</Typography>
        <Typography variant='subtitle1'>{business?.phoneNumber}</Typography>
      </Box>

    </Container>
  )
}
