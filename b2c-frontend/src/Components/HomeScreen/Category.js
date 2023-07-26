import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  ImageListItem
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import * as indexApi from '../../API/index.js'

const Category = ({ color }) => {
  const [categoryList, setCategoryList] = React.useState([]);

  const list = ["Jeans", "T-shirt", "Dress", "Batik", "Shorts", "Repair", "Embroidery"];

  React.useEffect(() => {
    indexApi.getCategory().then((arr) => setCategoryList(arr.data));
  }, [])

  return (
    <Grid item
      lg={12}
      sm={12}
      xl={12}
      xs={12}
      container>
      {categoryList.length === 0 ? (
        <Box sx={{ display: 'flex', flexGrow: 1, height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <CircularProgress color='secondary' sx={{ marginTop: 3, marginBottom: 3 }} />
        </Box>
      ) : (
        (Array.from(categoryList).slice(0, 6).map((val) => (
          <Grid
            item
            lg={2}
            sm={4}
            xl={2}
            xs={4}
            key={val.categoryName}
          >
            <Link to={`/searchResults/${val.id}`}>
              <Card className="category-box">
                {val.image && (
                  <ImageListItem key={'image'} style={{ height:'100%', width: '100%', overflow: 'hidden' }} >
                    <img src={val.image.url} sx={{ objectFit: 'cover' }} />
                  </ImageListItem>
                )}

              </Card>
              <Typography
                variant="subtitle"
                align="center"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '5rem', color: 'black' }}
              >
                {val.categoryName}
              </Typography>
            </Link>
          </Grid>
        )))
      )}
    </Grid>
  );
};



export default Category;