import { Container, Typography, Box, Button, Grid, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Toolbar, Divider } from '@mui/material'
import React from 'react'
import { gapi } from 'gapi-script'
import { GoogleLogin, GoogleLogout } from 'react-google-login'
import { useNavigate } from 'react-router';

import CustomButton from '../Components/CustomButton';

// API
import * as analyticsApi from '../API/analyticsApi.js';

// Redux
import { ERROR } from "../Redux/actionTypes";
import { showFeedback } from '../Redux/actions';
import { useDispatch, useSelector } from 'react-redux';

// Chart JS
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const dummySearches = [
  {
    value: "Jeans and Denim",
    occurrence: 12
  },
  {
    value: "Outerwear",
    occurrence: 10,
  },
  {
    value: "Example Search",
    occurrence: 5
  }
]

const dummyRefashioners = [
  {
    userId: 1,
    username: "dummy1@test.com",
    occurrence: 12,
  },
  {
    userId: 3,
    username: "dummy3@test.com",
    occurrence: 10,
  },
  {
    userId: 2,
    username: "dummy2@test.com",
    occurrence: 9,
  },
]

const dummyListings = [
  {
    listingId: 123,
    occurrence: 12,
  },
  {
    listingId: 124,
    occurrence: 9,
  },
  {
    listingId: 130,
    occurrence: 4,
  },
]

const dummyRequests = [
  {
    requestId: 50,
    occurrence: 23
  },
  {
    requestId: 62,
    occurrence: 17
  },
  {
    requestId: 17,
    occurrence: 15
  },
]

const dummyMarketPlaceListings = [
  {
    marketListingId: 121,
    occurrence: 140
  },
  {
    marketListingId: 152,
    occurrence: 102
  },
  {
    marketListingId: 87,
    occurrence: 140
  },
]


export default function DashboardScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const apiKey = 'AIzaSyC_HS4ZQGaTMx09L5tWQLzVw_kvrKlbToE';
  const clientId = '724626261912-ff5klrhgethmn3jvr4pohs65j7qtktei.apps.googleusercontent.com';
  const scope = 'https://www.googleapis.com/auth/analytics.readonly';

  const viewId = '263016293';

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const [numOfUsers, setNumOfUsers] = React.useState();
  const [topSearches, setTopSearches] = React.useState([]);
  const [topRefashioners, setTopRefashioners] = React.useState([]);
  const [topListings, setTopListings] = React.useState();
  const [topRequests, setTopRequests] = React.useState();
  const [topMarketPlaceListings, setTopMarketPlaceListings] = React.useState();
  const [nextPageToken, setNextPageToken] = React.useState(null);

  const [refunds, setRefunds] = React.useState();
  const [netRevenue, setNetRevenue] = React.useState();

  // Helper Functions
  function Last7Days() {
    // return an array of the last 7 days
    var result = [];
    for (var i = 0; i < 7; i++) {
      var d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      result.push(d.toISOString().slice(0, 10));
    }

    return result;
  }


  const onSuccess = () => {
    console.log("Logout Successful!");
    setIsLoggedIn(gapi.auth2.getAuthInstance().isSignedIn.get());
  }

  const onLoginSuccess = (res) => {
    console.log("Login Success! Current User: ", res.profileObj);
    setIsLoggedIn(gapi.auth2.getAuthInstance().isSignedIn.get());
  }

  const onLoginFailure = (res) => {
    console.log("Login Failed! res: ", res)
  }

  function Logout() {
    return (
      <div id="signOutButton">
        <GoogleLogout
          clientId={clientId}
          buttonText={"Logout"}
          onLogoutSuccess={onSuccess}
        />
      </div>
    )
  }

  function Login() {
    return (
      <div id="signInButton">
        <GoogleLogin
          clientId={clientId}
          buttonText={"Login"}
          onSuccess={onLoginSuccess}
          onFailure={onLoginFailure}
          cookiePolicy={'single_host_origin'}
          isSignedIn={true}
        />
      </div>
    )

  }

  React.useEffect(() => {
    function start() {
      gapi.client.init({
        apiKey: apiKey,
        clientId: clientId,
        scope: scope,
      })
    }

    gapi.load('client:auth2', start);
    getRefunds();
    getNetRevenue();
  }, [])

  function queryReports() {
    getNumOfUsers();
    getTopSearches();
    getTopRefashioners();
    getTopListings();
    getTopMarketPlaceListings();
    getTopRequests();
  }

  async function getRefunds() {
    const daysAgo = 7;
    const today = new Date();
    const startDate = new Date(today.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    const todayISO = new Date(today.getTime() - (today.getTimezoneOffset() * 60000));

    const startDateString = startDate.toISOString().split('T')[0]
    const endDateString = todayISO.toISOString().split('T')[0]
    
    const data = { "start": startDateString, "end": endDateString };
    console.log("date!!")
    console.log("today");
    console.log(today);
    console.log(startDateString);
    const formData = new FormData();
    formData.append("start", startDateString);
    formData.append("end", endDateString);

    console.log("refunds!");
    console.log(data);
    try {
      await analyticsApi.retrieveRefunds(data).then((res) => {
        setRefunds(res.data);
      })
    } catch (error) {
      const data = error?.response?.data?.message;
      console.log("ERROR MSG: " + JSON.stringify(error));
      dispatch({ type: ERROR, data })
    }
  }

  async function getNetRevenue() {
    const daysAgo = 7;
    const today = new Date();
    const startDate = new Date(today.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    const todayISO = new Date(today.getTime() - (today.getTimezoneOffset() * 60000));

    const startDateString = startDate.toISOString().split('T')[0]
    const endDateString = todayISO.toISOString().split('T')[0]

    const data = { "start": startDateString, "end": endDateString };
    console.log(data);
    const formData = new FormData();
    formData.append("start", startDateString);
    formData.append("end", endDateString);

    try {
      await analyticsApi.retrieveNetRevenue(data).then((res) => {
        setNetRevenue(res.data);
      })
    } catch (error) {
      const data = error?.response?.data?.message;
      console.log("ERROR MSG: " + JSON.stringify(error));
      dispatch({ type: ERROR, data })
    }
  }

  async function saveTopRefashioners() {
    
    if (topRefashioners && topRefashioners.length > 0) {
      try {
        await analyticsApi.saveTopRefashioners( topRefashioners.slice(0,5) ).then((res) => {
          console.log(res.data);
        })
      } catch (error) {
        const data = error?.response?.data?.message;
        console.log("ERROR MSG: " + JSON.stringify(error));
        dispatch({ type: ERROR, data })
      }
    } else {
      // top refashioners not loaded yet
      const errorMessage = "Top Refashioners have not been loaded yet";
      console.log(errorMessage);
    }
  }

  async function saveTopSearches() {
    const data = 0
    if (topSearches && topSearches.length > 0) {
      try {
        await analyticsApi.saveTopSearches(topSearches).then((res) => {
          console.log(res.data);
        })
      } catch (error) {
        const data = error?.response?.data?.message;
        console.log("ERROR MSG: " + JSON.stringify(error));
        dispatch({ type: ERROR, data })
      }
    } else {
      // top searches not loaded yet
      const errorMessage = "Top Searches have not been loaded yet";
      console.log(errorMessage);
    }
  }

  function saveReport() {
    console.log("Saving Report");
    saveTopSearches();
    saveTopRefashioners();
  }

  function getNumOfUsers() {
    gapi.client.request({
      path: '/v4/reports:batchGet',
      root: 'https://analyticsreporting.googleapis.com/',
      method: 'POST',
      body: {
        reportRequests: [
          {
            viewId: viewId,
            dateRanges: [
              {
                startDate: '7daysAgo',
                endDate: 'today'
              }
            ],
            metrics: [
              {
                expression: 'ga:users',

              },
              {
                expression: 'ga:newUsers'
              }
            ],
            dimensions: [
              {
                name: "ga:date",
              }
            ],
          }
        ]
      }
    }).then(displayNumOfUsers, console.error.bind(console));
  }

  function displayNumOfUsers(response) {
    console.log("display num of users");
    console.log(response)
    const queryResult = response.result.reports[0].data.rows;
    const result = queryResult.map((row) => {
      const dateString = row.dimensions[0];
      const date = new Date(dateString.substring(0, 4), dateString.substring(4, 6), dateString.substring(6, 8));
      return {
        date: date.toISOString().slice(0, 10),
        users: row.metrics[0].values[0],
        newUsers: row.metrics[0].values[1],
      };
    });
    const data = {
      labels: result.map((val) => val.date),
      datasets: [
        {
          label: "users",
          data: result.map((val) => val.users),
          borderColor: ["#6320EE"],
          fill: true,
        },
        {
          label: "new users",
          data: result.map((val) => val.newUsers),
          borderColor: ["#DAAEEA"],
          fill: true,
        }
      ],
      options: {
        scales: {
          xAxes: [
            {
              type: "time",
              distribution: "linear"
            }
          ]
        }
      }
    };
    console.log("result");
    console.log(data);
    setNumOfUsers(data);
  }

  function getTopSearches() {
    gapi.client.request({
      path: '/v4/reports:batchGet',
      root: 'https://analyticsreporting.googleapis.com/',
      method: 'POST',
      body: {
        reportRequests: [
          {
            viewId: viewId,
            dateRanges: [
              {
                startDate: '7daysAgo',
                endDate: 'today'
              }
            ],
            metrics: [
              {
                expression: 'ga:totalEvents',
              }
            ],
            dimensions: [
              {
                name: "ga:eventAction",
              }
            ],
            orderBys: [
              {
                fieldName: "ga:totalEvents",
                sortOrder: "DESCENDING"
              }
            ],
            pageSize: "5",
          }
        ]
      }
    }).then(displayTopSearches, console.error.bind(console));

  }

  function displayTopSearches(response) {
    console.log("display top searches");
    console.log(response);
    const queryResult = response.result.reports[0].data.rows;
    const result = queryResult.map((row) => {
      const value = row.dimensions[0];
      const occurrence = row.metrics[0].values[0];
      return {
        value: value,
        occurrence: occurrence,
      }
    })
    const nextPageToken = response.result.reports[0].nextPageToken;
    console.log(result)
    setNextPageToken(nextPageToken);
    setTopSearches(result);
  }

  function getNextTopSearches() {
    gapi.client.request({
      path: '/v4/reports:batchGet',
      root: 'https://analyticsreporting.googleapis.com/',
      method: 'POST',
      body: {
        reportRequests: [
          {
            viewId: viewId,
            dateRanges: [
              {
                startDate: '7daysAgo',
                endDate: 'today'
              }
            ],
            metrics: [
              {
                expression: 'ga:totalEvents',
              }
            ],
            dimensions: [
              {
                name: "ga:eventAction",
              }
            ],
            orderBys: [
              {
                fieldName: "ga:totalEvents",
                sortOrder: "DESCENDING"
              }
            ],
            pageToken: nextPageToken,
            pageSize: "5",
          }
        ]
      }
    }).then(displayMoreTopSearches, console.error.bind(console));

  }

  function displayMoreTopSearches(response) {
    console.log("display more top searches");
    console.log(response);
    const queryResult = response.result.reports[0].data.rows;
    const result = queryResult.map((row) => {
      const value = row.dimensions[0];
      const occurrence = row.metrics[0].values[0];
      return {
        value: value,
        occurrence: occurrence,
      }
    })
    const nextPageToken = response.result.reports[0].nextPageToken;
    const newResult = topSearches.concat(result);
    setNextPageToken(nextPageToken);
    setTopSearches(newResult)
  }

  function getTopRefashioners() {
    gapi.client.request({
      path: '/v4/reports:batchGet',
      root: 'https://analyticsreporting.googleapis.com/',
      method: 'POST',
      body: {
        reportRequests: [
          {
            viewId: viewId,
            dateRanges: [
              {
                startDate: '3daysAgo',
                endDate: 'today'
              }
            ],
            metrics: [
              {
                expression: 'ga:pageviews',

              }
            ],
            dimensions: [
              {
                name: "ga:pagePath",
              }
            ],
            dimensionFilterClauses: [
              {
                "filters": [
                  {
                    "dimensionName": "ga:pagePath",
                    "operator": "PARTIAL",
                    "expressions": ["/refashioner"]
                  }
                ]
              }
            ],
            orderBys: [
              {
                fieldName: "ga:pageviews",
                sortOrder: "DESCENDING"
              }
            ]
          }
        ]
      }
    }).then(displayTopRefashioners, console.error.bind(console));
  }

  function displayTopRefashioners(response) {
    console.log("display top refashioners")
    console.log(response);
    const queryResult = response.result.reports[0].data.rows;
    const result = queryResult.map((row) => {
      const list = row.dimensions[0].split("/");
      const username = list.at(-1);
      const refashionerId = list.at(-2);
      const occurrence = Number(row.metrics[0].values[0]);
      return {
        refashionerId: refashionerId,
        username: username,
        occurrence: occurrence,
      }
    })
    console.log(result);
    setTopRefashioners(result);
  }

  function getTopListings() {
    gapi.client.request({
      path: '/v4/reports:batchGet',
      root: 'https://analyticsreporting.googleapis.com/',
      method: 'POST',
      body: {
        reportRequests: [
          {
            viewId: viewId,
            dateRanges: [
              {
                startDate: '7daysAgo',
                endDate: 'today'
              }
            ],
            metrics: [
              {
                expression: 'ga:pageviews',

              }
            ],
            dimensions: [
              {
                name: "ga:pagePath",
              }
            ],
            dimensionFilterClauses: [
              {
                "filters": [
                  {
                    "dimensionName": "ga:pagePath",
                    "operator": "PARTIAL",
                    "expressions": ["/listing"]
                  }
                ]
              }
            ],
            orderBys: [
              {
                fieldName: "ga:pageviews",
                sortOrder: "DESCENDING"
              }
            ]
          }
        ]
      }
    }).then(displayTopListings, console.error.bind(console));
  }

  function displayTopListings(response) {
    console.log("display top listings");
    console.log(response);
    const queryResult = response.result.reports[0].data.rows;
    const result = queryResult.map((row) => {
      const listingId = row.dimensions[0].split("/").slice(-1).pop();
      const occurrence = Number(row.metrics[0].values[0]);
      return {
        listingId: listingId,
        occurrence: occurrence,
      }
    })

    setTopListings(result);
  }

  function getTopRequests() {
    gapi.client.request({
      path: '/v4/reports:batchGet',
      root: 'https://analyticsreporting.googleapis.com/',
      method: 'POST',
      body: {
        reportRequests: [
          {
            viewId: viewId,
            dateRanges: [
              {
                startDate: '7daysAgo',
                endDate: 'today'
              }
            ],
            metrics: [
              {
                expression: 'ga:pageviews',

              }
            ],
            dimensions: [
              {
                name: "ga:pagePath",
              }
            ],
            dimensionFilterClauses: [
              {
                "filters": [
                  {
                    "dimensionName": "ga:pagePath",
                    "operator": "PARTIAL",
                    "expressions": ["/request"]
                  }
                ]
              }
            ],
            orderBys: [
              {
                fieldName: "ga:pageviews",
                sortOrder: "DESCENDING"
              }
            ]
          }
        ]
      }
    }).then(displayTopRequests, console.error.bind(console));
  }

  function displayTopRequests(response) {
    console.log("display top requests");
    console.log(response);
    const queryResult = response.result.reports[0].data.rows;
    const result = queryResult.map((row) => {
      const requestId = row.dimensions[0].split("/").slice(-1).pop();
      const occurrence = Number(row.metrics[0].values[0]);
      return {
        requestId: requestId,
        occurrence: occurrence,
      }
    })

    setTopRequests(result);
  }

  function getTopMarketPlaceListings() {
    gapi.client.request({
      path: '/v4/reports:batchGet',
      root: 'https://analyticsreporting.googleapis.com/',
      method: 'POST',
      body: {
        reportRequests: [
          {
            viewId: viewId,
            dateRanges: [
              {
                startDate: '7daysAgo',
                endDate: 'today'
              }
            ],
            metrics: [
              {
                expression: 'ga:pageviews',

              }
            ],
            dimensions: [
              {
                name: "ga:pagePath",
              }
            ],
            dimensionFilterClauses: [
              {
                "filters": [
                  {
                    "dimensionName": "ga:pagePath",
                    "operator": "PARTIAL",
                    "expressions": ["/marketplaceListing"]
                  }
                ]
              }
            ],
            orderBys: [
              {
                fieldName: "ga:pageviews",
                sortOrder: "DESCENDING"
              }
            ]
          }
        ]
      }
    }).then(displayTopMarketPlaceListings, console.error.bind(console));
  }

  function displayTopMarketPlaceListings(response) {
    console.log("display top marketplace listings");
    console.log(response);
    const queryResult = response.result.reports[0].data.rows;
    const result = queryResult.map((row) => {
      const marketListingId = row.dimensions[0].split("/").slice(-1).pop();
      const occurrence = Number(row.metrics[0].values[0]);
      return {
        marketListingId: marketListingId,
        occurrence: occurrence,
      }
    })

    setTopMarketPlaceListings(result);
  }

  return (
    <Container>
      <Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant='h4'>Alt.native Analytics Dashboard</Typography>
          <Typography variant='h6'>Login to google using altnativetest@gmail.com</Typography>

          {isLoggedIn ?
            <Grid container spacing={2}>
              <Grid item xs='auto'>
                <Logout />
              </Grid>
              <Grid item xs='auto'>
                <Button variant='contained' onClick={queryReports}>Get Reports</Button>
              </Grid>
              <Grid item xs='auto'>
                <Button variant='contained' onClick={saveReport}>Save</Button>
              </Grid>
            </Grid>
            :
            <Grid container spacing={2}>
              <Grid item xs='auto'>
                <Typography variant='subtitle1'>Please Login to view Dashboard</Typography>
              </Grid>
              <Grid item xs='auto'>
                <Login />
              </Grid>
            </Grid>
          }

        </Box>
        <Grid container spacing={2} alignItems="flex-start">

          {/** Left Half of the page */}
          <Grid container rowSpacing={2} item xs={6}>
            <Grid item xs={12}>
              <TableContainer component={Paper} sx={{ maxHeight: "400px", overflow: "scroll" }}>
                <Toolbar sx={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant='subtitle1'>Number of users in the past 7 days</Typography>
                </Toolbar>
                <Divider />

                {numOfUsers &&
                  <Line data={numOfUsers} />
                }

              </TableContainer>
            </Grid>

            <Grid item xs={12}>
              <TableContainer component={Paper} sx={{ maxHeight: "400px", overflow: "scroll" }}>
                <Toolbar sx={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant='subtitle1'>Top 5 Searches in Home Page in the past 7 days</Typography>
                </Toolbar>
                <Divider />
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableCell align="center">Search Value</TableCell>
                    <TableCell align="center">Occurrences</TableCell>
                  </TableHead>
                  <TableBody>
                    {topSearches &&
                      topSearches.map((row) => (
                        <TableRow>
                          <TableCell align="center">
                            {row.value}
                          </TableCell>
                          <TableCell align="center">
                            {row.occurrence}
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>

                {topSearches && nextPageToken &&
                  <div>
                    <CustomButton variant='contained' color='secondary' onClick={getNextTopSearches}>Get Next 5 Top Searches</CustomButton>
                  </div>
                }

              </TableContainer>

            </Grid>

            <Grid item xs={12}>
              <TableContainer component={Paper} sx={{ maxHeight: "400px", overflow: "scroll" }}>
                <Toolbar sx={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant='subtitle1'>Top Refashioners (Most Viewed)</Typography>

                </Toolbar>
                <Divider />
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Refashioner Id</TableCell>
                      <TableCell align="center">Refashioner Username</TableCell>
                      <TableCell align="center">Occurrences</TableCell>
                      <TableCell align="center">Link</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topRefashioners &&
                      topRefashioners.map((row) => (
                        <TableRow>
                          <TableCell align="center">
                            {row.refashionerId}
                          </TableCell>
                          <TableCell align="center">
                            {row.username}
                          </TableCell>
                          <TableCell align="center">
                            {row.occurrence}
                          </TableCell>
                          <TableCell align="center">
                            <CustomButton variant='contained' color='secondary' onClick={() => navigate(`/user/${row.refashionerId}`)}>View</CustomButton>
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12}>
              <TableContainer component={Paper} sx={{ maxHeight: "400px", overflow: "scroll" }}>
                <Toolbar sx={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant='subtitle1'>Refund Amount in last 7 Days: {refunds}</Typography>

                </Toolbar>
              </TableContainer>
            </Grid>

            <Grid item xs={12}>
              <TableContainer component={Paper} sx={{ maxHeight: "400px", overflow: "scroll" }}>
                <Toolbar sx={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant='subtitle1'>Net Revenue in last 7 Days: {netRevenue}</Typography>
                </Toolbar>
              </TableContainer>
            </Grid>
          </Grid>

          {/** Right Half of the page */}
          <Grid container rowSpacing={2} item xs={6}>
            <Grid item xs={12}>
              <TableContainer component={Paper} sx={{ maxHeight: "400px", overflow: "scroll" }}>
                <Toolbar sx={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant='subtitle1'>Top Listings (Most Viewed)</Typography>
                </Toolbar>
                <Divider />
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Listing Id</TableCell>
                      <TableCell align="center">Occurances</TableCell>
                      <TableCell align="center">Link</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topListings &&
                      topListings.map((row) => (
                        <TableRow>
                          <TableCell align="center">
                            {row.listingId}
                          </TableCell>
                          <TableCell align="center">
                            {row.occurrence}
                          </TableCell>
                          <TableCell align="center">
                            <CustomButton variant='contained' color='secondary' onClick={() => navigate(`/listing/Refashion Listings/${row.listingId}`)}>View</CustomButton>
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12}>
              <TableContainer component={Paper} sx={{ maxHeight: "400px", overflow: "scroll" }}>
                <Toolbar sx={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant='subtitle1'>Top Requests (Most Viewed)</Typography>
                </Toolbar>
                <Divider />

                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Request Id</TableCell>
                      <TableCell align="center">Occurrences</TableCell>
                      <TableCell align="center">Link</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topRequests &&
                      topRequests.map((row) => (
                        <TableRow>
                          <TableCell align="center">
                            {row.requestId}
                          </TableCell>
                          <TableCell align="center">
                            {row.occurrence}
                          </TableCell>
                          <TableCell align="center">
                            <CustomButton variant='contained' color='secondary' onClick={() => navigate(`/listing/Refashion Requests/${row.requestId}`)}>View</CustomButton>
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12}>
              <TableContainer component={Paper} sx={{ maxHeight: "400px", overflow: "scroll" }}>
                <Toolbar sx={{ justifyContent: 'center', alignItems: 'center' }}>
                  <Typography variant='subtitle1'>Top Marketplace Listing (Most Viewed)</Typography>
                </Toolbar>
                <Divider />

                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Marketplace Listing Id</TableCell>
                      <TableCell align="center">Occurrences</TableCell>
                      <TableCell align="center">Link</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topMarketPlaceListings &&
                      topMarketPlaceListings.map((row) => (
                        <TableRow>
                          <TableCell align="center">
                            {row.marketListingId}
                          </TableCell>
                          <TableCell align="center">
                            {row.occurrence}
                          </TableCell>
                          <TableCell align="center">
                            <CustomButton variant='contained' color='secondary' onClick={() => navigate(`/listing/Marketplace Listings/${row.marketListingId}`)}>View</CustomButton>
                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

          </Grid>
        </Grid>
      </Box>
    </Container >
  )
}
