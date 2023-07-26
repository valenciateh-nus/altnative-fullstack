import React from 'react';
import { Box, Checkbox, Container, FormControl, FormControlLabel, FormGroup, FormLabel, Paper, Tab, Tabs, TextField, Typography } from "@mui/material";
import {useTheme, withStyles} from "@mui/styles";
import {apiWrapper, getUserByUsername} from "../API/index";
import EnhancedTable from '../Components/Listings/ListingsTable';
import InContainerLoading from '../Components/InContainerLoading';
import { retrieveAllRefashionerRegistrationRequests } from '../API/refashionerRegistrationApi';
import { getAllProjectListingsBySearch, getAllProjectListingsBySearchAvailableOnly, getAllProjectRequestBySearch, getAllProjectRequestBySearchAvailableOnly, getCategories, getMarketplaceListingsBySearch, getMarketplaceListingsBySearchAvailableOnly } from '../API/listingApi';
import { CheckBox } from '@mui/icons-material';
import CustomButton from '../Components/CustomButton';
import { searchBusinessRequests, searchAvailableBusinessRequests } from '../API/projectApi';
import { searchAllDeadstocks, searchAvailableDeadstocks } from '../API/marketplaceApi';

const CustomTab = withStyles({
    root: {
      textTransform: "none"
    }
})(Tab);

export const pReqRowNames = [
    {
        id: 'id',
        numeric: true,
        disablePadding: false,
        label: 'id',
        date : false,
        object : false,
    },
    {
        id: 'refashionee',
        numeric: false,
        disablePadding: false,
        label: 'refashionee',
        date : false,
        object : true,
        objectField : 'username',
    },
    {
        id: 'title',
        numeric: false,
        disablePadding: false,
        label: 'title',
        date : false,
        object : false,
    },
    {
        id: 'category',
        numeric: false,
        disablePadding: false,
        label: 'category',
        date : false,
        object : true,
        objectField : 'categoryName'
    },
    {
        id: 'price',
        numeric: true,
        disablePadding: false,
        label: 'price',
        date : false,
        object : false,
    },
    {
        id: 'available',
        numeric: false,
        disablePadding: false,
        label: 'Available',
        date : false,
        object : false,
    },
    {
        id: 'dateCreated',
        numeric: false,
        disablePadding: false,
        label: 'Date Created',
        date : true,
        object : false,
    },

];

export const pListRowNames = [
    {
        id: 'id',
        numeric: true,
        disablePadding: false,
        label: 'id',
        date : false,
        object : false,
    },
    {
        id: 'refashioner',
        numeric: false,
        disablePadding: false,
        label: 'refashioner',
        date : false,
        object : true,
        objectField : 'username',
    },
    {
        id: 'title',
        numeric: false,
        disablePadding: false,
        label: 'title',
        date : false,
        object : false,
    },
    {
        id: 'category',
        numeric: false,
        disablePadding: false,
        label: 'category',
        date : false,
        object : true,
        objectField : 'categoryName'
    },
    {
        id: 'price',
        numeric: true,
        disablePadding: false,
        label: 'price',
        date : false,
        object : false,
    },
    {
        id: 'available',
        numeric: false,
        disablePadding: false,
        label: 'Available',
        date : false,
        object : false,
    },
    {
        id: 'dateCreated',
        numeric: false,
        disablePadding: false,
        label: 'Date Created',
        date : true,
        object : false,
    },

];

export const mListRowNames = [
    {
        id: 'id',
        numeric: true,
        disablePadding: false,
        label: 'id',
        date : false,
        object : false,
    },
    {
        id: 'appUser',
        numeric: false,
        disablePadding: false,
        label: 'Seller',
        date : false,
        object : true,
        objectField : 'username',
    },
    {
        id: 'title',
        numeric: false,
        disablePadding: false,
        label: 'title',
        date : false,
        object : false,
    },
    {
        id: 'category',
        numeric: false,
        disablePadding: false,
        label: 'category',
        date : false,
        object : true,
        objectField : 'categoryName'
    },
    {
        id: 'price',
        numeric: true,
        disablePadding: false,
        label: 'price',
        date : false,
        object : false,
    },
    {
        id: 'quantity',
        numeric: true,
        disablePadding: false,
        label: 'quantity',
        date : false,
        object : false,
    },
    
    {
        id: 'available',
        numeric: false,
        disablePadding: false,
        label: 'Available',
        date : false,
        object : false,
    },
    {
        id: 'dateCreated',
        numeric: false,
        disablePadding: false,
        label: 'Date Created',
        date : true,
        object : false,
    },

];

export const bListRowNames = [
    {
        id: 'id',
        numeric: true,
        disablePadding: false,
        label: 'id',
        date : false,
        object : false,
    },
    {
        id: 'refashionee',
        numeric: false,
        disablePadding: false,
        label: 'business',
        date : false,
        object : true,
        objectField : 'username',
    },
    {
        id: 'title',
        numeric: false,
        disablePadding: false,
        label: 'title',
        date : false,
        object : false,
    },
    {
        id: 'category',
        numeric: false,
        disablePadding: false,
        label: 'category',
        date : false,
        object : true,
        objectField : 'categoryName'
    },
    {
        id: 'price',
        numeric: true,
        disablePadding: false,
        label: 'price',
        date : false,
        object : false,
    },
    {
        id: 'available',
        numeric: false,
        disablePadding: false,
        label: 'Available',
        date : false,
        object : false,
    },
    {
        id: 'dateCreated',
        numeric: false,
        disablePadding: false,
        label: 'Date Created',
        date : true,
        object : false,
    },

];

export const dListRowNames = [
    {
        id: 'id',
        numeric: true,
        disablePadding: false,
        label: 'id',
        date : false,
        object : false,
    },
    {
        id: 'appUser',
        numeric: false,
        disablePadding: false,
        label: 'Business',
        date : false,
        object : true,
        objectField : 'username',
    },
    {
        id: 'title',
        numeric: false,
        disablePadding: false,
        label: 'title',
        date : false,
        object : false,
    },
    {
        id: 'category',
        numeric: false,
        disablePadding: false,
        label: 'category',
        date : false,
        object : true,
        objectField : 'categoryName'
    },
    {
        id: 'price',
        numeric: true,
        disablePadding: false,
        label: 'price',
        date : false,
        object : false,
    },
    {
        id: 'quantity',
        numeric: true,
        disablePadding: false,
        label: 'quantity',
        date : false,
        object : false,
    },
    {
        id: 'available',
        numeric: false,
        disablePadding: false,
        label: 'Available',
        date : false,
        object : false,
    },
    {
        id: 'dateCreated',
        numeric: false,
        disablePadding: false,
        label: 'Date Created',
        date : true,
        object : false,
    },

];

export const PREQ = 'Refashion Requests';
export const PLIST = 'Refashion Listings';
export const MLIST = 'Marketplace Listings';
export const BLIST = 'Business Listings';
export const DLIST = 'Deadstock Listings';

export default function ListingManagementScreen() {
    const theme = useTheme();
    const [tabValue, setTabValue] = React.useState(PREQ);
    const [listings, setListings] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [rowNames, setRowNames] = React.useState(pListRowNames)
    const [categories, setCategories] = React.useState([]);
    const [selectedCategories, setSelectedCategories] = React.useState([]);
    const [keywords, setKeywords] = React.useState('');
    const [isAvailableOnly, setsIsAvailableOnly] = React.useState(false);

    function a11yProps(index) {
        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const handleTabChange = (e, newValue) => {
        setTabValue(newValue);
    };

    function getRequestsFromTab(tab) {
        setListings([]);
        switch(tabValue) {
            case PREQ:
                return getProjectRequests();
            case PLIST:
                return getProjectListings();
            case MLIST:
                return getMarketplaceListings();
            case BLIST:
                return getBusinessListings();
            case DLIST:
                return getDeadstockListings();
            default:
                break;
        }
    }

    React.useEffect(() => {
        runOnce();
    },[])

    async function runOnce() {
        setIsLoading(true);
        const catRes = await apiWrapper(getCategories(), "Could not fetch categories", true);
        if(catRes) {
            setCategories(catRes.data)
        }
        setIsLoading(false)
    }

    React.useEffect(() => {
        getRequestsFromTab(tabValue);
    },[tabValue])

    const handleKeywords = (e) => {
        e.preventDefault();
        setKeywords(e.target.value);
    }

    async function getProjectRequests() {
        setIsLoading(true);
        setRowNames(pReqRowNames);
        let res;
        if(isAvailableOnly) {
            res = await apiWrapper(getAllProjectRequestBySearchAvailableOnly(selectedCategories,keywords),"",true);
        } else {
            res = await apiWrapper(getAllProjectRequestBySearch(selectedCategories,keywords),"",true);
        }
        
        if(res) {
            setListings(res.data);
        } else {
            setListings([]);
        }
        setIsLoading(false);
    }

    async function getProjectListings() {
        setIsLoading(true);
        setRowNames(pListRowNames);
        let res;
        if(isAvailableOnly) {
            res = await apiWrapper(getAllProjectListingsBySearchAvailableOnly(selectedCategories,keywords),"",true);
        } else {
            res = await apiWrapper(getAllProjectListingsBySearch(selectedCategories,keywords),"",true);
        }
        if(res) {
            setListings(res.data);
        } else {
            setListings([]);
        }
        setIsLoading(false);
    }

    async function getMarketplaceListings() {
        setIsLoading(true);
        setRowNames(mListRowNames);
        let res;
        if(isAvailableOnly) {
            res = await apiWrapper(getMarketplaceListingsBySearchAvailableOnly(selectedCategories,keywords),"",true);
        } else {
            res = await apiWrapper(getMarketplaceListingsBySearch(selectedCategories,keywords),"",true);
        }

        if(res) {
            setListings(res.data);
        } else {
            setListings([]);
        }
        setIsLoading(false);
    }

    async function getBusinessListings() {
        setIsLoading(true);
        setRowNames(bListRowNames);

        let res;
        if(isAvailableOnly) {
            res = await apiWrapper(searchAvailableBusinessRequests(selectedCategories,keywords),"",true);
        } else {
            res = await apiWrapper(searchBusinessRequests(selectedCategories,keywords),"",true);
        }
        
        if(res) {
            setListings(res.data);
        } else {
            setListings([]);
        }
        setIsLoading(false);
    }

    async function getDeadstockListings() {
        setIsLoading(true);
        setRowNames(dListRowNames);
        let res;
        if(isAvailableOnly) {
            res = await apiWrapper(searchAvailableDeadstocks(selectedCategories,keywords),"",true);
        } else {
            res = await apiWrapper(searchAllDeadstocks(selectedCategories,keywords),"",true);
        }
        if(res) {
            console.log("DS: " + res.data);
            setListings(res.data);
        } else {
            setListings([]);
        }
        setIsLoading(false);
    }


    function handleRefresh() {
        getRequestsFromTab(tabValue);
    }

    function handleCategoryChange(cId) {
        const selectedIndex = selectedCategories.includes(cId);
        
        let newSelected = selectedCategories;
        if (selectedIndex) {
            console.log("REMOVING");
            setSelectedCategories(selectedCategories.filter((category) => category !== cId));
        } else {
            console.log("ADDING");
           setSelectedCategories([...selectedCategories, cId])
        }
    }

    function handleClear() {
        setSelectedCategories([]);
        setKeywords('');
    }

    return (
    <Box sx={{margin: 2}}>
        <Typography variant='h4'>{tabValue}</Typography>
        <Tabs id='tabs-container' value={tabValue} onChange={handleTabChange} classes = {{"indicator": {background: "none"}}} aria-label="chatTabs" variant="fullWidth" 
            sx = {{"& button[aria-selected='true']": {borderBottom : "5px solid", borderBottomColor : theme.palette.secondary.main, color : "secondary.main"}}}
        >
            <CustomTab label="Refashion Requests" value={PREQ} {...a11yProps(0)}/>
            <CustomTab label="Refashion Listings" value={PLIST} {...a11yProps(1)}/>
            <CustomTab label="Marketplace Listings" value={MLIST} {...a11yProps(2)}/>
            <CustomTab label="Business Listings" value={BLIST}  {...a11yProps(3)}/>
            <CustomTab label="Deadstock Listings" value={DLIST}  {...a11yProps(4)}/>
        </Tabs>
        <Box sx= {{mt:2}}>
        <Paper sx={{mb:2}}>
            <Container sx={{pt:2, pb:2}}>
                <Typography variant='h5' sx={{mb: 2}}>Search Criterias</Typography>
                <TextField variant='outlined' size='small' value={keywords}  InputLabelProps={{ shrink: true }}
                    onChange = {handleKeywords} placeholder = 'Search by keyword' label='Keyword' fullWidth autoComplete={false}/>
                <Typography sx={{mt: 2}} variant='body1'>Categories</Typography>
                <Box sx= {{display: 'flex', flexDirection: 'row'}}>
                    {categories.map((category,idx) =>
                        <Box sx={{display :'flex', flexDirection : 'row', alignItems : 'center'}} key={idx}>
                            <Checkbox color="primary" checked={selectedCategories.includes(category.id)} onClick={() => handleCategoryChange(category.id)} />
                            <Typography>{category.categoryName}</Typography>
                        </Box>
                    )}
                </Box>
                <Box sx={{display :'flex', flexDirection : 'row', alignItems : 'center'}}>
                <Checkbox color="primary" checked={isAvailableOnly} onClick={() => setsIsAvailableOnly(!isAvailableOnly)} />
                <Typography>Available</Typography>
                </Box>
                <Box sx={{display : 'flex', flexDirection : 'row', justifyContent : 'flex-end'}}>
                <CustomButton variant='contained' sx={{backgroundColor:'secondary.light', mr: 1}} onClick={handleClear}>Clear</CustomButton>
                <CustomButton variant='contained' color='secondary' onClick={handleRefresh}>Search</CustomButton>
                </Box>
            </Container>
        </Paper>
        {!isLoading ? <EnhancedTable rows = {listings} rowNames = {rowNames} handleRefresh={handleRefresh} type = {tabValue}/> : <InContainerLoading/>}
        </Box>
    </Box>
    )
}


