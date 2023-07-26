import { Box, Container, Grid, IconButton, MenuItem, Select, TextField, Typography, Button, Card, Chip, ImageListItem, ImageList, ImageListItemBar, CardActionArea } from '@mui/material'
import React from 'react'
import MarketplaceImg from '../../Components/Images/MarketplaceImage.png';
import DefaultImage from '../../assets/EmptyListing.png'
import { useNavigate } from 'react-router';

// API Imports
import * as swapItemApi from '../../API/swapItemApi.js';
import InContainerLoading from '../../Components/InContainerLoading';

// Dummy SwapItem

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


export default function SwapScreen() {
    const navigate = useNavigate();

    const [searchValue, setSearchValue] = React.useState('');
    const [swapItems, setSwapItems] = React.useState(dummy);
    const [loading, setLoading] = React.useState(false);
    const [sortValue, setSortValue] = React.useState('initial');

    React.useEffect(() => {
        //setLoading(true);
        //getSwapItems();
    }, [])

    const getSwapItems = async () => {
        try {
            await swapItemApi.retrieveSwapItems().then((res) => {
                const array = res.data;
                setSwapItems(array);
            })
        } catch (error) {
            setSwapItems([]);
        } finally {
            setLoading(false);
        }
    }

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    }


    const handleSortChange = (e) => {
        setSortValue(e.target.value);
        //getSortedListings(e.target.value);
    }

    return (!loading ? (
        <Container>
            <Box sx={{
                minHeight: '100%',
                maxHeight: '100%',
                px: 1,
                py: 7,
                overflow: 'scroll'
            }}>
                <Grid container spacing={3}>

                    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            Swap Items
                        </Typography>
                        <Box
                            sx={{
                                height: 70,
                                width: 70,
                                position: 'relative',
                                top: -20,
                                right: 0,
                            }}
                        >
                            <img alt="Marketplace Image" src={MarketplaceImg} style={{ objectFit: 'contain' }} />
                        </Box>
                    </Grid>


                    <Grid item xs={12} style={{ overflow: 'scroll', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <TextField
                            id='search-bar'
                            placeholder='Search Projects'
                            style={{ width: '80%' }}
                            value={searchValue}
                            onChange={handleSearchChange}
                        />

                    </Grid>

                    <Grid item xs={6}>
                        <Select
                            labelId="sort-select"
                            label="sort"
                            value={sortValue}
                            style={{ float: 'left', height: '60%', width: '90%', WebkitBorderRadius: "1.4vw" }}
                            onChange={handleSortChange}
                        >
                            <MenuItem disabled value='initial'>Sort</MenuItem>
                            <MenuItem value='low'>Price Low to High</MenuItem>
                            <MenuItem value='high'>Price High to Low</MenuItem>
                            <MenuItem value='new'>Newest to Oldest</MenuItem>
                            <MenuItem value='old'>Oldest to Newest</MenuItem>
                        </Select>
                    </Grid>

                    <Grid item xs={12} style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                        {swapItems && swapItems.length > 0 ?
                            (<ImageList cols={4} sx={{ width: '100%' }} gap={10}>
                                {Array.from(swapItems).filter((item) => (item.title.toLowerCase()).match(searchValue.toLowerCase()) !== null).map((item, index) =>
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
                            </ImageList>)
                            :
                            (<Box sx={{ display: 'flex', justifyContent: "center", alignContent: 'center', marginTop: 5 }}>
                                <Typography>There is no available swap items.</Typography>
                            </Box>)

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
