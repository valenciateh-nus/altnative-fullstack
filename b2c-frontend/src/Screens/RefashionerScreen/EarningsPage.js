import React from 'react';
import { Box, Container, Grid, MenuItem, Select, SvgIcon, Typography } from '@mui/material';
import { Link,useNavigate } from 'react-router-dom';
import { ArrowLeft as ArrowIcon } from 'react-feather';
import OrderListing from '../../Components/Refashioner/HomeScreen/OrderListing';
import { useSelector } from 'react-redux';

const EarningsPage = () => {
  const [filter, setFilter] = React.useState("This Month");
  const currUserData = useSelector((state) => state.currUserData);
  const navigate = useNavigate();

  if (currUserData.roles.indexOf("USER_REFASHIONER") === -1) {
    navigate('/home', {replace: true});
  }

  const handleClick = (e) => {
    setFilter(e.target.title);
  }

  return (
    <>
      <Box
        sx={{
          minHeight: '100%',
          maxHeight: '100%',
          px: 0.5,
          py: 1,
          overflow: 'scroll',
          marginBottom: 7,
        }}
      >
        <Container maxWidth>
          <Grid
            container
            spacing={2}
          >
            <Grid
              item
              lg={12}
              sm={12}
              xl={12}
              xs={12}
            >
              <Link to="/refashioner/home">
                <SvgIcon
                  fontSize="large"
                  color="action"
                  sx={{ position: 'relative', float: 'left', top: 30 }}
                >
                  <ArrowIcon />
                </SvgIcon>
              </Link>
            </Grid>
            <Grid
              item
              lg={12}
              sm={12}
              xl={12}
              xs={12}
            >
              <Typography sx={{ fontSize: 25, fontWeight: 'bold', marginTop: 2 }}>
                Your Earnings
              </Typography>
            </Grid>
            <Grid
              item
              lg={12}
              sm={12}
              xl={12}
              xs={12}
            >
              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Typography sx={{ fontSize: 15, fontWeight: 'bold', marginTop: 2}}>
                  Total Sales
                </Typography>
                <Box sx={{ float: 'right', width: '50%', marginLeft: '20%', marginTop: 1.5}}>
                <Select
                  labelId="filter-sales"
                  label="filter"
                  value={filter}
                  style={{ display: 'flex', float: 'right', height: 30, width: '100%', fontSize: 12, border: '1px solid #DAE4ED', WebkitBorderRadius: "1vw"}}
                >
                  <MenuItem value='This Month' title='This Month' onClick={(e) => handleClick(e)}>This Month</MenuItem>
                  <MenuItem value='Past 3 Months' title='Past 3 Months' onClick={(e) => handleClick(e)}>Past 3 Months</MenuItem>
                  <MenuItem value='All Time' title='All Time' onClick={(e) => handleClick(e)}>All Time</MenuItem>
                </Select>
                </Box>
              </Box>
            </Grid>
            <Grid
              item
              lg={12}
              sm={12}
              xl={12}
              xs={12}
            >
              <Typography variant="body2">
                Payment will be paid within 72 hours after project completion
              </Typography>
            </Grid>  
            <Grid
              item
              lg={12}
              sm={12}
              xl={12}
              xs={12}
            >
              <OrderListing status="Pending" orderId="#ALT-INV-002" title="Refashion Cropped Top into Scarf" completed={false} price="30"/>
              <OrderListing status="Paid" orderId="#ALT-INV-001" title="Refashion Jeans into Jacket" completed={false} price="50"/>
            </Grid>
            </Grid>
        </Container>
      </Box>
    </>
  );
};

export default EarningsPage;