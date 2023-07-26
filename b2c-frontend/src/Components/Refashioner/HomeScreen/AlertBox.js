import {
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import React from 'react';
import { getRefashioneeOrdersByStatus } from '../../../API/orderApi';
import InContainerLoading from '../../InContainerLoading';
import { getCompletedProjects } from '../../../API/userApi';
import { useSelector } from 'react-redux';

const AlertBox = ({ color }) => {
  const [completedOrders, setCompletedOrders] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const currUserData = useSelector((state) => state.currUserData);

  React.useEffect(() => {
    setLoading(true);
    getOrders();
  }, [])

  async function getOrders() {
    try {
      await getCompletedProjects(currUserData.id).then((val) => {
        console.log("COMPLETED",val.data);
        setCompletedOrders(val.data);
      })
    } catch (error) {
      setCompletedOrders([])
    } finally {
      setLoading(false);
    }
  }
  return (!loading ? (
      <Card
        className='searchbox-container'
        style={{ background: color, minWidth: '125px', margin: 0}}
      >
        <CardContent >
          <Typography variant="h5" sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center', fontWeight: 550}}>
            {completedOrders}
          </Typography>
          <Typography sx={{ fontSize: 11,display: 'flex', alignContent: 'center', justifyContent: 'center', textAlign: 'center'}}>
            refashion project(s) completed!
          </Typography>
        </CardContent>
      </Card>
  ) : (
    <InContainerLoading />
  )
  );
};



export default AlertBox;