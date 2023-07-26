import React from 'react'
import { useNavigate } from 'react-router';
import {
    Container,
    Box,
    Button,
    Grid,
    MenuItem,
    Select,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
    Card,
    CardActionArea,
    Chip,
    ImageList,
    ImageListItem,
    ImageListItemBar,
} from '@mui/material';
import DefaultImage from '../../assets/EmptyListing.png'
import InContainerLoading from '../InContainerLoading';

// API Imports
import * as swapRequestApi from '../../API/swapRequestApi.js';

export default function MySwapItems() {
    const navigate = useNavigate();
    const [swapRequests, setSwapRequests] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState('');
    const [filterValue, setFilterValue] = React.useState('ALL');

    const handleSearchChange = (event) => {
        console.log(event.target.value);
        setSearchValue(event.target.value);
    };

    const handleFilterChange = (event) => {
        console.log(event.target.value);
        setFilterValue(event.target.value);
        //setLoading(true);
        //refreshResults(val.target.value);
    }

    React.useEffect(() => {
        setLoading(true);
        getMySwapRequests();
    }, [])

    const getMySwapRequests = async () => {
        try {
            await swapRequestApi.retrieveOwnSwapRequests().then((res) => {
                const swapRequests = res.data;
                console.log(res.data);
                setSwapRequests(swapRequests);
            })
        } catch (error) {
            setSwapRequests([]);
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
                    px: 1,
                    py: 2,
                    overflow: 'scroll'
                }}>
                <Grid container spacing={2}>
                    <Grid
                        item
                        lg={12}
                        xs={12}
                        style={{ overflow: 'scroll', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                        <TextField
                            id='search-bar'
                            placeholder='Search Projects'
                            style={{ width: '90%' }}
                            value={searchValue}
                            onChange={handleSearchChange}
                        />
                        <Button value="Search" style={{ background: '#FB7A56', color: 'white', height: '100%', width: '6em', marginLeft: '-0.8em', WebkitBorderRadius: ".5vw" }}>
                            Search
                        </Button>
                    </Grid>
                    <Grid
                        item
                        lg={12}
                        xs={12}
                        style={{ overflow: 'scroll' }}
                    >
                        <Select
                            labelId="filter-select"
                            label="filter"
                            value={filterValue}
                            onChange={handleFilterChange}
                            style={{ float: 'left', height: '80%', width: '40%', border: '1px solid black', WebkitBorderRadius: ".5vw" }}
                        >
                            <MenuItem value={'ALL'}>All</MenuItem>
                            <MenuItem value={'PENDING'}>Pending</MenuItem>
                            <MenuItem value={'PENDING_REVIEW'}>Pending Review</MenuItem>
                            <MenuItem value={'APPROVED_AND_CREDITED'}>Approved and Credited</MenuItem>
                            <MenuItem value={'REJECTED_PENDING_FOLLOWUP'}>Rejected Pending Followup</MenuItem>
                            <MenuItem value={'COMPLETED'}>Completed</MenuItem>
                        </Select>
                    </Grid>
                    <Grid
                        item
                        lg={12}
                        xs={12}
                        style={{ overflow: 'scroll' }}
                    >
                        {swapRequests && swapRequests.length > 0 ?
                            (
                                Array.from(swapRequests)
                                    .filter((item) => (item.itemName.toLowerCase()).match(searchValue.toLowerCase()) !== null)
                                    .filter((item) => (filterValue === "ALL" ? true : item.swapRequestStatus.match(filterValue)) )
                                    .map((item, index) => (
                                        <Card sx={{
                                            width: '99%',
                                            px: 2,
                                            py: 3,
                                            boxShadow: '2px',
                                            marginBottom: 2
                                        }}>
                                            <CardActionArea onClick={() => navigate('/swapRequest/' + item.id)}>
                                                <Grid container spacing={6} sx={{ height: '100%' }}>
                                                    <Grid item xs={4}>
                                                        <Chip label={item.swapRequestStatus} sx={{ color: 'white', backgroundColor: 'rgba(254, 210, 121, 0.8)', fontSize: 10, fontWeight: '600', WebkitBorderRadius: '13px', margin: 0.5, padding: 0, position: 'absolute', zIndex: '999' }} />
                                                        <ImageListItem key={index} style={{ maxHeight: 300, overflow: 'hidden' }} >
                                                            <img src={item.imageList[0].url} loading="lazy" alt='swapitem' />
                                                        </ImageListItem>
                                                    </Grid>
                                                    <Grid item xs={8}>
                                                        <Typography sx={{ overflowWrap: 'break-word', fontSize: 15, fontWeight: "bold" }}>{item.itemName}</Typography>
                                                        <Chip label={item.category.categoryName} sx={{ background: '#FB7A56', color: 'white', fontWeight: 'bold', fontSize: 10, height: 20, bottom: 0, padding: 0, marginTop: '5px' }} />
                                                        <Typography>{item.itemDescription}</Typography>
                                                    </Grid>
                                                </Grid>

                                            </CardActionArea>
                                        </Card>
                                    ))


                            ) : (
                                <Container>
                                    <Box sx={{ display: 'flex', justifyContent: "center", alignContent: 'center', marginTop: 15 }}>
                                        <Typography>You have no swap items</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: "center", alignContent: 'center', mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            sx={{ display: 'flex', color: 'white', fontWeight: 'bold', fontSize: 15, marginBottom: 1 }}
                                            onClick={() => navigate('/swap/create')}
                                        >
                                            Create a Swap Request
                                        </Button>
                                    </Box>
                                </Container>
                            )
                        }

                    </Grid>
                </Grid>
            </Box>
        </Container >)
        :
        (<Container>
            <InContainerLoading />
        </Container>)
    )
}
