import {
  Box,
  Button,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import Typography from '@mui/material/Typography';
import logo from './Refashioner.png';
import { Link } from 'react-router-dom';
import './stylesheet.css';
import ImagePost from '../Notus/components/Images/ImagePost';

const ViewRefashioner = ({ text, color }) => {

  var buttonStyle = {
    display: 'block',
    background: "#FB7A56",
    margin: '2vh 1vh 0',
    borderRadius: '1vh',
    fontWeight: "bold",
    color: 'white',
    padding: '10px 40px',
    zIndex: '0'
  };

  return (
    <Card sx={{ height: 320 }}>
      <CardContent>
        <Grid
          container
          spacing={3}
        >
          <Grid item xs={12}>
            {/* <div
              className="viewRefashioner-text"
            >
              {text}
            </div> */}
            <Typography variant="h5" sx={{ fontWeight: 'bold', marginTop: 0.5 }}>
              {text}
            </Typography>
            <Link to='/view' style={{ textDecoration: "none" }}>
              <button
                className="btn"
                color="primary"
                variant="contained"
                style={buttonStyle}
              >
                View Refashioner
              </button>
            </Link>
          </Grid>
          <Grid item={12} sx={{ position: 'relative', width: '100%', height: '100%' }}>
            <Box
              sx={{
                width: { xs: "40vw", s: '15vw', md: '20vw', lg: '10vw' },
                position: 'absolute',
                bottom: 0,
                right: 0,
                height: '100%'
              }}
            >
              <img alt="View Refashioner" src={logo} style={{  width:'100%', objectFit: 'cover' }} />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};



export default ViewRefashioner;