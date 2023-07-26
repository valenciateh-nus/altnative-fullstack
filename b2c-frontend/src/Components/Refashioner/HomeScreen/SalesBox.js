import {
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { Link,useNavigate} from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { getSales } from '../../../API/userApi';

const SalesBox = ({ sales, color }) => {
  const navigate = useNavigate();
  return (
      <Card
        className='searchbox-container'
        style={{ background: color, minWidth: '125px', margin: 0, cursor: 'pointer'}}
        onClick={() => navigate('/profile/wallet/transactions')}
      >
        <CardContent >
          <Typography variant="h5" sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center', fontWeight: 550, color: "white"}}>
            ${Number(sales).toFixed(2)}
          </Typography>
          <Typography sx={{ fontSize: 11,display: 'flex', alignContent: 'center', justifyContent: 'center', textAlign: 'center', color: "white"}}>
            sales made this month!
          </Typography>
        </CardContent>
      </Card>
  );
};



export default SalesBox;