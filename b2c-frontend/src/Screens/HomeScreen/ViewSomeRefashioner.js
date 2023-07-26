import React from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  InputAdornment,
  SvgIcon,
  Card,
  CardContent,
  Avatar,
  useMediaQuery,
  FormControl,
  CircularProgress,
  Typography,
  CardActionArea
} from '@mui/material';
import { Helmet } from 'react-helmet';
import { Search as SearchIcon, ArrowLeft as ArrowIcon } from 'react-feather';
import { Link } from 'react-router-dom';


// Component Imports
import RefashionerCard from '../../Components/HomeScreen/RefashionerCard';
import Category from '../../Components/HomeScreen/Category';
import BusinessList from '../../Components/HomeScreen/BusinessList';
import InContainerLoading from '../../Components/InContainerLoading';
import Ratings from '../../Components/Notus/components/Content/Ratings'
import logo from '../../Components/HomeScreen/emptyImage.jpeg';

// API Call
import * as analyticsApi from '../../API/analyticsApi.js';
import * as userApi from '../../API/userApi.js';

// Redux
import { ERROR } from "../../Redux/actionTypes";
import { showFeedback } from '../../Redux/actions';
import { useDispatch, useSelector } from 'react-redux';

const list = ["Jeans", "T-shirt", "Dress", "Batik", "Shorts", "Repair", "Embroidery"];

const testRefashioners = [
  {
    name: "Abby",
    rating: 4
  },
  {
    name: "Beatrice",
    rating: 5
  },
  {
    name: "Cindy",
    rating: 4
  },
];

var cardStyle = {
  display: 'flex',
  height: 25,
  width: 20,
  margin: 1,
  padding: 1,
};

export default function ViewSomeRefashioner() {

  const dispatch = useDispatch();

  const notHidden = useMediaQuery(theme => theme.breakpoints.up('md'));
  const [searchValue, setSearchValue] = React.useState("");
  const [userList, setUserList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [topRefashioners, setTopRefashioners] = React.useState([]);
  const [topRefashionerUsernames, setTopRefashionerUsernames] = React.useState([]);
  const [topRefashionersLoading, setTopRefashionersLoading] = React.useState(false);
  React.useEffect(() => {
    setLoading(true);
    setTopRefashionersLoading(true);
    getUsers();
    getTopRefashioners();
  }, [])

  React.useEffect(() => {
    if (searchValue === '') {
      getUsers();
    } else {
      getSearchUsers();
    }
  }, [searchValue])

  async function getTopRefashioners() {

    try {
      await analyticsApi.retrieveTopRefashioners().then((res) => {
        setTopRefashionerUsernames(res.data);
      })
    } catch (error) {
      const data = error?.response?.data?.message;
      console.log("ERROR MSG: " + JSON.stringify(error));
      dispatch({ type: ERROR, data })
    }

  }

  async function getUsers() {
    try {
      await userApi.getAllUsers(['USER_REFASHIONER']).then((val) => {
        const arr = val.data;
        arr.sort(function (a, b) {
          if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
          if (a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
          return 0;
        })
        console.log(val.data);
        setUserList(val.data);
      })
    } catch (error) {
      setUserList([]);
    } finally {
      setLoading(false);
    }
  }

  async function getSearchUsers() {
    try {
      await userApi.getSearchedRefashioners(searchValue).then((val) => {
        const arr = val.data;
        arr.sort(function (a, b) {
          if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
          if (a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
          return 0;
        })
        console.log(val.data);
        setUserList(val.data);
      })
    } catch (error) {
      setUserList([]);
    } finally {
      setLoading(false);
    }
  }

  return (!loading ?
    (<Container>
      <Box
        sx={{
          minHeight: '100%',
          maxHeight: '100%',
          py: 3,
          px: 0.5,
          overflow: 'scroll',
          marginBottom: 7,
        }}
      >
        <Grid container spacing={3}>
          <Grid item lg={12} sm={12} xl={12} xs={12}>
            <Link to="/home">
              <SvgIcon
                fontSize="large"
                color="action"
              >
                <ArrowIcon />
              </SvgIcon>
            </Link>
          </Grid>
          <Grid item lg={12} sm={12} xl={12} xs={12}>
            <Typography fontWeight="bold" sx={{ fontSize: 25 }}>
              Meet Alt.Native refashioners
            </Typography>
          </Grid>
          <Grid item lg={12} sm={12} xl={12} xs={12}>
            <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
              Featured Refashioner usernames
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
          >
            <Box sx={{ display: 'flex', overflow: 'scroll' }}>

              {topRefashionerUsernames ? (
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  {Array.from(topRefashionerUsernames).map((username) => (

                    <Grid item xs={4}>
                      <Card>
                        <CardActionArea>
                          <CardContent>
                            <Typography variant="body2">
                              {username}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>

                  ))}
                </Grid>) : (<Container>
                  <InContainerLoading />
                </Container>)
              }
            </Box>
          </Grid>
          <Grid
            item
            lg={12}
            sm={12}
            xl={12}
            xs={12}
          >
            <Typography
              sx={{ fontSize: 20, fontWeight: 600 }}
            >
              Search for Refashioner
            </Typography>
          </Grid>
          <Grid
            item
            lg={12}
            sm={12}
            xl={12}
            xs={12}
          >

            <TextField
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SvgIcon
                      fontSize="small"
                      color="action"
                    >
                      <SearchIcon />
                    </SvgIcon>
                  </InputAdornment>
                )
              }}
              placeholder="Search.."
              variant="outlined"
              onChange={(event) => { setSearchValue(event.target.value); }}
              style={{ outlineColor: "#FB7A56" }}
            />

          </Grid>
          <Grid
            item
            lg={12}
            sm={12}
            xl={12}
            xs={12}
          >
            {userList.length > 0 ? (
              <>
                {Array.from(userList).map((b) => (
                  <BusinessList business={b} refashioner={true} />
                ))}
              </>
            ) : (
              <Box sx={{ height: '100%', display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center', mt: 15 }}>
                <Button
                  variant="contained"
                  disabled={true}
                  sx={{ ":disabled": { color: 'white', backgroundColor: 'secondary.main' } }}
                >
                  No refashioners found
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>

    ) : (
      <InContainerLoading />
    )
  );
};
