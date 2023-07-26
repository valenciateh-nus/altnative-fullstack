import {
  Box,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import logo from './RequestBox.png'
import { useNavigate } from 'react-router';

const ViewRequestsBox = ({ color }) => {
  const navigate = useNavigate();

  return (
    <Card
      className='searchbox-container'
      style={{ background: 'white', minWidth: '125px', marginLeft: 10, cursor: 'pointer'}}
      onClick={() => navigate('/refashioner/viewRequests')}
    >
      <Grid container spacing={4}>
        <Grid item xs={6} lg={6} sx={{ overflow: "hidden"}}>
          <Box
            sx={{
              // width: { xs: "40vw", s: '15vw', md: '20vw', lg: '100%' },
              width: '100%',
              bottom: 0,
              right: 0,
              height: '100%',
              overflow: 'hidden',
            }}
          >
            <img alt="View Refashioner" src={logo} style={{ width: 120, objectFit: 'fill' }} />
          </Box>
        </Grid>
        <Grid item xs={6} lg={6} sx={{ height: 100, marginTop: 5}}>
          <Typography variant="h5" sx={{ textAlign:"left", display: 'flex', alignContent: 'center', justifyContent: 'center', fontWeight: 550, color: "black" }}>
            View All Requests!
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};



export default ViewRequestsBox;