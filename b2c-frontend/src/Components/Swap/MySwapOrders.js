import React from 'react'
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
    ImageList,
    Card,
    CardActionArea,
    Chip,
    ImageListItem,
    ImageListItemBar,
} from '@mui/material';
import DefaultImage from '../../assets/EmptyListing.png'
import InContainerLoading from '../InContainerLoading';
import { useNavigate } from 'react-router';

const dummy = [
    {
        id: 1,
        title: "nice jeans",
        description: "blue jeans with flower pattern and very cool yakult glass of water and nice bottle of yakult",
        dateCreated: new Date(),
        credits: 50,
        itemCondition: "Good",
        imageList: [DefaultImage, DefaultImage],
    },
    {
        id: 2,
        title: "cool dress",
        description: "yellow dress but seems blue",
        dateCreated: new Date(),
        credits: 100,
        itemCondition: "Perfect",
        imageList: [DefaultImage, DefaultImage],
    },
]

export default function MySwapOrders() {
    const navigate = useNavigate();

    const [swapOrders, setSwapOrders] = React.useState(dummy);
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
        getMySwapOrders();
    }, [])

    const getMySwapOrders = async () => {
        try {
            /** 
            await marketplaceApi.getOwnMarketplaceListings().then((arr) => {
                const swapItems = arr.data;
                console.log(arr.data);
                setSwapItems(swapItems);    

            })
            */
        } catch (error) {
            setSwapOrders([]);
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
                            <MenuItem value={'BRAND_NEW_WITH_TAG'}>Brand New With Tag</MenuItem>
                            <MenuItem value={'BRAND_NEW'}>Brand New</MenuItem>
                            <MenuItem value={'LIKE_NEW'}>Like New</MenuItem>
                        </Select>
                    </Grid>

                    <Grid
                        item
                        lg={12}
                        xs={12}
                        style={{ overflow: 'scroll' }}
                    >
                        {swapOrders && swapOrders.length > 0 ?
                            (<ImageList cols={4} sx={{ width: '100%' }} gap={10}>
                                {Array.from(swapOrders).filter((item) => (item.title.toLowerCase()).match(searchValue.toLowerCase()) !== null).map((item, index) =>
                                    <>
                                        <Card sx={{ mb: 1, position: 'relative' }}>
                                            <CardActionArea onClick={() => navigate('/swapItem/' + item.id)}>
                                                <Chip label="Swap Item" sx={{ color: 'white', backgroundColor: 'rgba(254, 210, 121, 0.8)', fontSize: 10, fontWeight: '600', WebkitBorderRadius: '13px', margin: 0.5, padding: 0, position: 'absolute', zIndex: '999' }} />
                                                <ImageListItem key={index} style={{ maxHeight: 300, overflow: 'hidden' }} >
                                                    <img src={DefaultImage} loading="lazy" alt='swapitem' />
                                                    <ImageListItemBar
                                                        title={item.title}
                                                        subtitle={item.description}
                                                    />

                                                </ImageListItem>
                                            </CardActionArea>
                                            <Typography fontWeight={400} fontSize={17} align="center">
                                                Credits Required: {item.credits}
                                            </Typography>

                                        </Card>
                                    </>
                                )}
                            </ImageList>

                            ) : (
                                <Container>
                                    <Box sx={{ display: 'flex', justifyContent: "center", alignContent: 'center', marginTop: 15 }}>
                                        <Typography>You have no swap orders</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: "center", alignContent: 'center', mt: 2 }}>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            sx={{ display: 'flex', color: 'white', fontWeight: 'bold', fontSize: 15, marginBottom: 1 }}
                                            onClick={() => navigate('/swap')}
                                        >
                                            Create a Swap Order
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
