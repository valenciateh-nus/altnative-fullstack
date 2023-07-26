import {
  Box,
  Button,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import Typography from '@mui/material/Typography';
import logo from './Marketplace.png';
import { Link, useNavigate } from 'react-router-dom';
import './stylesheet.css';
import ImagePost from '../Notus/components/Images/ImagePost';
import { toggleView } from '../../Redux/actions';
import { useDispatch } from 'react-redux';
import { MARKET_VIEW } from '../../constants';

const VisitMarketplace = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const visitMpl = () => {
    dispatch(toggleView(MARKET_VIEW));
    navigate('/marketplace');
  }

  return (
    <Card sx={{ height: 320, cursor: 'pointer'}} onClick={visitMpl}>
      <CardContent>
        <Grid
          container
          spacing={3}
        >
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', marginTop: 0.5 }}>
              Visit the Marketplace!
            </Typography>
          </Grid>
          <Grid item={12} sx={{ position: 'relative', width: '100%', height: 280 }}>
            <Box
              sx={{
                // width: { xs: "40vw", s: '15vw', md: '20vw', lg: '100%' },
                width: '100%',
                position: 'absolute',
                bottom: 0,
                right: 0,
                height: '100%',
              }}
            >
              <img alt="View Refashioner" src={logo} style={{  width:'100%', objectFit: 'fill' }} />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};



export default VisitMarketplace;