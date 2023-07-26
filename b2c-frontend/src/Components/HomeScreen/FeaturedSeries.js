import {
  Card,
  CardContent,
  Grid,
  ListItem,
  Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import SustainableFashion from '../Images/SustainableFashion.png';
import ImagePost from '../Notus/components/Images/ImagePost';
import { Box } from '@mui/lab/node_modules/@mui/system';


const FeaturedSeries = ({ text, color }) => {
  var cardStyle = {
    height: '5rem',
    background: color,
    margin: "1vw 0",
    display: "flex",
    justifyContent: "left",
    alignItems: "left"
  };

  const list = ["Refashioning with Jeans", "Making with Batik", "Tailoring to fit"];

  return (
    <>
      {Array.from(list).map((val) => (
        <Link to='/' style={{ textDecoration: "none" }} key={val}>
          <Card style={cardStyle}>
            <CardContent>
              <Grid
                container
                spacing={10}
              >
                <Grid
                  item
                  lg={8}
                  sm={8}
                  xl={8}
                  xs={8}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    align="left"
                    style={{ lineHeight: "1.3rem" }}
                  >
                    {val}
                  </Typography>
                </Grid>
                <Grid
                  item
                  lg={4}
                  sm={4}
                  xl={4}
                  xs={4}
                  sx={{ position: 'relative'}}
                >
                  <Box
                    sx={{
                      height: '60%',
                      width: '70%',
                      position: 'absolute',
                      right: 0,
                      bottom: -30
                    }}
                  >
                  <img src={SustainableFashion} sx={{ position: 'absolute', height: 50, width: 50, top: 0 }} />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        </Link>
  ))
}
    </>
  );
};



export default FeaturedSeries;