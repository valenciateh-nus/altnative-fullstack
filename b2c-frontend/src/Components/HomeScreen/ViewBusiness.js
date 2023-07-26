import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField
} from '@mui/material';
import React from 'react';
import Typography from '@mui/material/Typography';
import logo from './Business.png';
import { Link, useNavigate } from 'react-router-dom';
import './stylesheet.css';
import ImagePost from '../Notus/components/Images/ImagePost';

const ViewBusiness = ({ text, color }) => {
  const navigate = useNavigate();

  var buttonStyle = {
    display: 'block',
    background: "#FB7A56",
    borderRadius: '1vh',
    fontWeight: "bold",
    color: 'white',
    padding: '8px 40px',
    zIndex: '0',
    width: '93%',
    marginTop: -10
  };


  return (
    <Card sx={{ height: 320, paddingTop: 0.5 }}>
      <CardContent>
        <Grid
          container
          spacing={3}
        >
          <Grid item xs={12}>
            <Typography variant="h5" fontWeight='bold'>
              See Businesses on Alt.Native!
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ height: 150 }}>
              <img alt="View Refashioner" src={logo} style={{ height: '100%', objectFit: 'fill' }} />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <button
              className="btn"
              color="primary"
              variant="contained"
              style={buttonStyle}
              onClick={() => navigate('/viewBusiness')}
            >
              View Businesses
            </button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};



export default ViewBusiness;