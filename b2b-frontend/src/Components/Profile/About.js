import React from 'react'
import { Chip, Box, Container, Grid, Link, Rating, SvgIcon, Typography, Avatar, ImageList, ImageListItem, ImageListItemBar, useMediaQuery, Button } from '@mui/material'
import ProfileCard from '../ProfileCard';
import { useSelector } from 'react-redux';
import { makeStyles } from "@mui/styles";
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
const useStyles = makeStyles((theme) => ({
  imageList: {
    flexWrap: 'nowrap',
    display: 'flex',
    flexDirection: 'row',
    overflow: 'scroll',
  }
}));

export default function About({ id = 0, user }) {
  let navigate = useNavigate();
  const currentUser = useSelector(state => state.currUserData);
  const styles = useStyles();
  const theme = useTheme();
  const notHidden = useMediaQuery(theme => theme.breakpoints.up('md'));
  const [loading, setLoading] = React.useState(false);
  const [profileUser, setProfileUser] = React.useState([]);

  function getCertificationName(fileName) {
    const list = fileName.split("-");
    const certName = list[list.length - 1]; // Get last element of the split '-'
    return certName;
  }

  React.useState(() => {
    setLoading(true);
    if (user !== undefined) {
      setProfileUser(user);
    } else {
      setProfileUser(currentUser);
    }
    setLoading(false);
  },[])

  console.log("CURR USER", currentUser)
  console.log("ID", (id == 0 || id === currentUser.id))

  return (
    <Container sx={{ mt: 2 }}>
      {profileUser?.roles?.includes('USER_BUSINESS') || id == 0 ? (
        <Box>
          <Typography variant='h6' fontWeight={550} gutterBottom>About us</Typography>
        <Typography variant='subtitle1'>{profileUser?.description}</Typography>
        <Typography variant='h6' fontWeight={550} gutterBottom sx={{ mt: 2 }}>Website</Typography>
        <Typography variant='h6' gutterBottom sx={{ mt: 2 }}>
          <Link href={profileUser?.site} underline="hover" color="secondary">
            {profileUser?.site}
          </Link>
        </Typography>
        <Typography variant='h6' fontWeight={550} gutterBottom sx={{ mt: 2 }}>Contact us</Typography>
        <Typography variant='h6' gutterBottom sx={{ mt: 2 }}>
          <Link href={`tel:${profileUser?.phoneNumber}`} underline="hover">
          {profileUser?.phoneNumber}
          </Link>
        </Typography>

        {(id == 0 || id === currentUser.id) &&
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ m: 4 }}
          >
            <Button
              onClick={() => { navigate("/profile/editProfile") }}
              variant='contained'
              size='large'
              color="primary"
              sx={{ textTransform: 'none', color: 'white' }}
            >
              <Typography fontWeight={600}>Edit My Profile</Typography>
            </Button>
          </Box>
        }
        </Box>
      ) : (
      <Box>
        <Typography variant='h6' fontWeight={550} gutterBottom>
          About the Refashioner
          {id === 0 &&
            <SvgIcon
              fontSize="large"
              color="action"
              onClick={() => navigate("/profile/editProfile")}
              sx={{ float: 'right' }}
            >
              <EditOutlinedIcon />
            </SvgIcon>
          }
        </Typography>
        <Typography variant='subtitle1'>{profileUser.refashionerDesc}</Typography>

        <Typography variant='h6' fontWeight={550} gutterBottom sx={{ mt: 2 }}>Expertises</Typography>

        {profileUser && profileUser.expertises.length > 0 ?
          (
            <Grid container spacing={1}>
              {Array.from(profileUser.expertises).map((expertise) =>
                <Grid item xs='auto'>
                  <Chip
                    label={expertise.name}
                    style={{
                      background: "#FB7A56",
                      fontWeight: "bold",
                      color: "white",
                      padding: "2vh 1.5vw",
                      marginRight: "0.3em",
                      borderRadius: "3vh",
                    }}
                  />
                </Grid>)
              }
            </Grid>
          ) : (
            <Typography variant='subtitle1'>No Expertises</Typography>
          )
        }

        <Typography variant='h6' fontWeight={550} gutterBottom sx={{ mt: 2 }}>Certifications</Typography>

        {profileUser && profileUser.approvedCertifications.length > 0 ?
          (
            <Grid container spacing={1}>
              {Array.from(profileUser.approvedCertifications).map((certification) =>
                <Grid item xs='auto'>
                  <Chip
                    label={certification}
                    style={{
                      background: "#FB7A56",
                      fontWeight: "bold",
                      color: "white",
                      padding: "2.5vh 1.5vw",
                      marginRight: "0.3em",
                      borderRadius: "3vh",
                    }}
                  />
                </Grid>)
              }
            </Grid>
          ) : (
            <Typography variant='subtitle1'>No Certifications</Typography>
          )
        }
        {profileUser?.certifications.length > 0 &&
          <Typography variant='h6' fontWeight={550} gutterBottom sx={{ mt: 2 }}>Pending Certifications</Typography>
        }
        {notHidden ? (
          (profileUser?.certifications.length > 0 &&
            <ImageList cols={3} sx={{ width: '100%', height: 400 }} gap={2}>
              {Array.from(profileUser.certifications).map((image, index) =>
                <ImageListItem key={index} sx={{ maxHeight: 300, minHeight: 300, maxWidth: 300, overflow: 'hidden' }}>
                  <img src={image.url} loading="lazy" style={{ cursor: 'pointer' }} alt='' />
                  <ImageListItemBar
                    title={getCertificationName(image.fileName)}
                  />
                </ImageListItem>
              )}
            </ImageList>
          )
        ) :
          (profileUser?.certifications.length > 0 &&
            <ImageList cols={2} sx={{ width: '100%', height: 400 }} gap={2}>
              {Array.from(profileUser.certifications).map((image, index) =>
                <ImageListItem key={index} sx={{ maxHeight: 170, minHeight: 170, maxWidth: 170, overflow: 'hidden' }}>
                  <img src={image.url} loading="lazy" style={{ cursor: 'pointer' }} alt='' />
                  <ImageListItemBar
                    title={getCertificationName(image.fileName)}
                  />
                </ImageListItem>
              )}
            </ImageList>
          )
        }
      </Box>
      )}
    </Container>
  )
}
