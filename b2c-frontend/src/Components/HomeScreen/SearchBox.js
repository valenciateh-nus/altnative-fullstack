import {
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import './stylesheet.css';

const SearchBox = ({ text, color, linkTo = '/'}) => {
  return (
    <Link to={linkTo} style={{ textDecoration: "none" }}>
      <Card
        className='searchbox-container'
        style={{ background: color, minWidth: '125px', margin: 0}}
      >
        <CardContent>
          <Grid
            container
            spacing={3}
            sx={{ justifyContent: 'space-between' }}
          >
            <Grid item>
              <Typography
                className="searchbox-text"
                align="center"
                style={{ fontSize: "2vmax", fontWeight: "bold" }}
              >
                {text}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Link>
  );
};



export default SearchBox;