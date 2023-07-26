import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Menu,
  MenuItem,
  Container,
  Grid,
  TextField,
  InputAdornment,
  SvgIcon,
  Button,
  Typography,
  Modal,
  FormLabel,
  Slider
} from '@mui/material';
import { useParams } from 'react-router';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ChevronRight as Next, ArrowLeft as ArrowIcon, PlusCircle as PlusIcon } from 'react-feather';
import '../../Components/HomeScreen/stylesheet.css';
import TimelineOrder from '../../Components/CreateListing/TimelineOrder';
import RequestGrid from '../../Components/Orders/RequestGrid';
import RequestCard from '../../Components/Orders/RequestCard';
import * as indexApi from '../../API/index.js';

const CreateProjectListingScreen = (props) => {
  const [completed, setCompleted] = useState(false);
  const [openIdea, setOpenIdea] = useState(false);
  const [openDeadline, setOpenDeadline] = useState(false);
  const [openBudget, setOpenBudget] = useState(false);
  const [refashionValue, setRefashionValue] = useState("");
  const [deadline, setDeadline] = useState('');
  const [budget, setBudget] = useState(null);
  const [initial, setInitial] = useState([1, 500]);
  const { id = 0 } = useParams();
  const [requestForm, setRequestForm] = React.useState({ 'title': '',  'price': 0, 'description': ''})

  useEffect(() => {
    if (id) {
      indexApi.getRequestsById(id).then((val) => {
        setRequestForm({
          ...requestForm,
          ['title']: val.data.title,
          ['description']: val.data.description,
          ['price']: val.data.price
        })
      });
    }
  }, [])

  console.log(requestForm);
  
  function valuetext(value) {
    return `$${value}`;
  }

  const handleChange = (event, newValue) => {
    setBudget(newValue);
  };

  return (
    (!completed ? (
      <>
        <Helmet>
          <title>Alt.Native</title>
        </Helmet>
        <Box
          sx={{
            minHeight: '100%',
            maxHeight: '100%',
            px: 3,
            py: 3,
            overflow: 'scroll'
          }}
        >
          <Container maxWidth={true}>
            <Grid
              container
              spacing={1}
            >
              <Grid
                item
                lg={12}
                sm={12}
                xl={12}
                xs={12}
              >
                <Link to="/upload">
                  <SvgIcon
                    fontSize="large"
                    color="action"
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
                style={{ display: "flex", justifyContent: "left", alignItems: "left", paddingTop: '2em'}}
              >
                <div className='homepage_title' style={{ fontWeight: "bold", textAlign: "center" }}>Refashion Request</div>
              </Grid>
              <Grid
                item
                lg={12}
                sm={12}
                xl={12}
                xs={12}
                style={{ display: "flex", justifyContent: "left", alignItems: "left"}}
              >
                <div style={{ fontSize: '1em', textAlign: "left" }}>
                  Have some ideas of your own? Tell us more, and let's make it happen!
                </div>
              </Grid>
              <Grid
                item
                lg={12}
                sm={12}
                xl={12}
                xs={12}
                sx={{ justifyContent: 'center', overflow : 'scroll', textOverflow:'scroll'}}
              >
                <TimelineOrder form={requestForm}/>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </>
    ) : (
      <>
        <Helmet>
          <title>Alt.Native</title>
        </Helmet>
        <Box
          sx={{
            minHeight: '100%',
            px: 3,
            py: 3
          }}
        >
          <Container maxWidth={false}>
          <Link to="/home">
                  <SvgIcon
                    fontSize="large"
                    color="action"
                  >
                    <ArrowIcon />
                  </SvgIcon>
                </Link>
          <Grid
              container
              spacing={1}
              style={{ marginTop: '1em'}}
            >
              <Grid
                item
                lg={12}
                sm={12}
                xl={12}
                xs={12}
              >
                <Typography style={{ fontSize: '1.7em', fontWeight: '700' }}>
                  We're reviewing your request!
                </Typography>
              </Grid>
              <Grid
                item
                lg={12}
                sm={12}
                xl={12}
                xs={12}
              >
                {/* <RequestGrid title={refashionValue} budget={budget} deadline={deadline} status="pending" review={true}/> */}
                <RequestCard />
              </Grid>
              <Grid
                item
                lg={12}
                sm={12}
                xl={12}
                xs={12}
              >
                <Button
                  variant="contained"
                  fullWidth
                  style={{ background: '#FB7A56', color: 'white', height: '120%', fontWeight: 'bold', marginTop: '1em'}}
                >
                  View all request
                </Button>
              </Grid>
              </Grid>
          </Container>
        </Box>
      </>
    )
    )
  )
}

export default CreateProjectListingScreen;