import React from 'react';
import { Box, Checkbox, Container, Paper, TextField, Typography } from "@mui/material";
import {useTheme} from "@mui/styles";
import {apiWrapper} from "../API/index";
import EnhancedTable from '../Components/Transactions/TransactionsTable';
import InContainerLoading from '../Components/InContainerLoading';
import CustomButton from '../Components/CustomButton';
import { retrieveAllTransactions, searchTransactionsByStatus } from '../API/transactionsApi';

export const txnRowNames = [
    {
        id: 'id',
        numeric: true,
        disablePadding: false,
        label: 'id',
        date : false,
        object : false,
    },
    {
        id: 'amount',
        numeric: true,
        disablePadding: false,
        label: 'Amount',
        date : false,
        object : false,
    },
    {
        id: 'offerId',
        numeric: false,
        disablePadding: false,
        label: 'Offer id',
        date : false,
        object : false,
    },
    {
        id: 'order2',
        numeric: false,
        disablePadding: false,
        label: 'Order id',
        date : false,
        object : true,
        objectField : 'id'
    },
    {
        id: 'paymentStatus',
        numeric: true,
        disablePadding: false,
        label: 'Status',
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
    {
        id: 'dateCompleted',
        numeric: false,
        disablePadding: false,
        label: 'Date Completed',
        date : true,
        object : false,
    },
];

const statuses = ['PENDING', 'HOLD', 'COMPLETED', 'DECLINED'];

export default function TransactionsManagementScreen() {
    const theme = useTheme();
    const [transactions, setTransactions] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [rowNames, setRowNames] = React.useState(txnRowNames)
    const [categories, setCategories] = React.useState(statuses);
    const [selectedCategories, setSelectedCategories] = React.useState([]);
    const [keywords, setKeywords] = React.useState('');

    React.useEffect(() => {
        runOnce();
    },[])

    async function runOnce() {
        setIsLoading(true);
        getTransactions();
        setIsLoading(false)
    }

    const handleKeywords = (e) => {
        e.preventDefault();
        setKeywords(e.target.value);
    }

    async function getTransactions() {
        setIsLoading(true);
        const res = await apiWrapper(searchTransactionsByStatus(selectedCategories),'',true);
        if(res) {
            setTransactions(res.data);
        }
        setIsLoading(false);
    }


    function handleRefresh() {
        getTransactions();
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
        <Typography variant='h4'>Transactions</Typography>
        <Box sx= {{mt:2}}>
        <Paper sx={{mb:2}}>
            <Container sx={{pt:2, pb:2}}>
                <Typography variant='h5' sx={{mb: 2}}>Search Criterias</Typography>
                {/* <TextField variant='outlined' size='small' value={keywords}  InputLabelProps={{ shrink: true }}
                    onChange = {handleKeywords} placeholder = 'Search by keyword' label='Keyword' fullWidth/> */}
                <Typography sx={{mt: 2}} variant='body1'>Statuses</Typography>
                <Box sx= {{display: 'flex', flexDirection: 'row'}}>
                    {categories.map((category,idx) =>
                        <Box sx={{display :'flex', flexDirection : 'row', alignItems : 'center'}} key={idx}>
                            <Checkbox color="primary" checked={selectedCategories.includes(category)} onClick={() => handleCategoryChange(category)} />
                            <Typography>{category}</Typography>
                        </Box>
                    )}
                </Box>
                <Box sx={{display :'flex', flexDirection : 'row', alignItems : 'center'}}>
                </Box>
                <Box sx={{display : 'flex', flexDirection : 'row', justifyContent : 'flex-end'}}>
                <CustomButton variant='contained' sx={{backgroundColor:'secondary.light', mr: 1}} onClick={handleClear}>Clear</CustomButton>
                <CustomButton variant='contained' color='secondary' onClick={handleRefresh}>Search</CustomButton>
                </Box>
            </Container>
        </Paper>
        {!isLoading ? <EnhancedTable rows = {transactions} rowNames = {rowNames} handleRefresh={handleRefresh}/> : <InContainerLoading/>}
        </Box>
    </Box>
    )
}


