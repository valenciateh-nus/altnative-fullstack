import React from 'react';
import { Box, Tab, Tabs, Typography } from "@mui/material";
import {useTheme, withStyles} from "@mui/styles";
import {apiWrapper, getUserByUsername} from "../API/index";
import EnhancedTable from '../Components/Requests/RequestsTable';
import InContainerLoading from '../Components/InContainerLoading';
import { retrieveAllRefashionerRegistrationRequests } from '../API/refashionerRegistrationApi';
import { getDisputesByStatus, retrieveAllDisputes } from '../API/disputeApi';
import { retrieveUnverifiedBankAccountDetails } from '../API/bankAccountsApi';
import { retrieveListOfSwapRequests } from '../API/swapRequestsApi';
import {searchTransactions} from "../API/walletApi";

const CustomTab = withStyles({
    root: {
      textTransform: "none"
    }
})(Tab);

export const refashionerRequestsRowNames = [
    {
        id: 'id',
        numeric: true,
        disablePadding: false,
        label: 'id',
        date : false,
        object : false,
    },
    {
        id: 'user',
        numeric: false,
        disablePadding: false,
        label: 'applicant',
        date : false,
        object : true,
        objectField : 'username',
    },
    {
        id: 'verified',
        numeric: false,
        disablePadding: false,
        label: 'verified',
        date : false,
        object : false,
    },
    {
        id: 'rejected',
        numeric: false,
        disablePadding: false,
        label: 'rejected',
        date : false,
        object : false,
    },
    {
        id: 'requestDate',
        numeric: false,
        disablePadding: false,
        label: 'Request Date',
        date : true,
        object : false,
    },
    {
        id: 'verifiedDate',
        numeric: false,
        disablePadding: false,
        label: 'Verified Date',
        date : true,
        object : false,
    },

];


export const disputeRowNames = [
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
        label: 'Requester',
        date : false,
        object : true,
        objectField : 'username',
    },
    {
        id: 'orderId',
        numeric: true,
        disablePadding: false,
        label: 'Order Id',
        date : false,
        object : false,
    },
    {
        id: 'disputeStatus',
        numeric: false,
        disablePadding: false,
        label: 'Status',
        date : false,
        object : false,
    },
    {
        id: 'dateCreated',
        numeric: false,
        disablePadding: false,
        label: 'Request Date',
        date : true,
        object : false,
    },
];

export const bankAccReqRowNames = [
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
        label: 'Requester',
        date : false,
        object : true,
        objectField : 'username',
    },
    {
        id: 'bankAccountNo',
        numeric: false,
        disablePadding: false,
        label: 'Bank Account No',
        date : false,
        object : false,
    },
    {
        id: 'bankAccountName',
        numeric: false,
        disablePadding: false,
        label: 'Name',
        date : false,
        object : false,
    },
    {
        id: 'bankAccountBranch',
        numeric: false,
        disablePadding: false,
        label: 'Branch',
        date : false,
        object : false,
    },
    {
        id: 'verified',
        numeric: false,
        disablePadding: false,
        label: 'Verified',
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

export const withdrawReqRowNames = [
    {
        id: 'id',
        numeric: true,
        disablePadding: false,
        label: 'ID',
        date : false,
        object : false,
    },
    {
        id: 'wallet',
        numeric: false,
        disablePadding: false,
        label: 'Wallet ID',
        date : false,
        object : true,
        objectField : 'id',
    },
    {
        id: 'amount',
        numeric: true,
        disablePadding: false,
        label: 'Withdraw Amount',
        date : false,
        object : false,
    },
    {
        id: 'wallet',
        numeric: false,
        disablePadding: false,
        label: 'Available balance',
        date : false,
        object : true,
        objectField : 'balance',
    },
    {
        id: 'wallet',
        numeric: false,
        disablePadding: false,
        label: 'Onhold balance',
        date : false,
        object : true,
        objectField : 'onHoldBalanace',
    },
    {
        id: 'dateCreated',
        numeric: false,
        disablePadding: false,
        label: 'Date Requested',
        date : true,
        object : false,
    },
];

export const swapRequestRowNames = [
    {
        id: 'id',
        numeric: true,
        disablePadding: false,
        label: 'ID',
        date : false,
        object : false, 
    },
    {
        id: 'appUser',
        numeric: false,
        disablePadding: false,
        label: 'Requester',
        date : false,
        object : true,
        objectField : 'username',
    },
    {
        id: 'swapRequestStatus',
        numeric: false,
        disablePadding: false,
        label: 'Request Status',
        date : false,
        object : false,
    },
    {
        id: 'followUpStatus',
        numeric: false,
        disablePadding: false,
        label: 'Follow-up Status',
        date : false,
        object : false,
    },
    {
        id: 'requestDate',
        numeric: false,
        disablePadding: false,
        label: 'Request Date',
        date : true,
        object : false,
    },
]

export const DISPUTE_REQ = 'Disputes';
export const REFASHIONER_REQ = 'Refashioner Applications';
export const BUS_REQ = 'Business Account Applications';
export const BANK_REQ = 'Bank Registration'
export const WITHDRAW_REQ = 'Withdraw Requests'
export const SWAP_REQ = 'Swap Requests';

export default function RequestsManagementScreen() {
    const theme = useTheme();
    const [tabValue, setTabValue] = React.useState("Refashioner Applications");
    const [requests, setRequests] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [rowNames, setRowNames] = React.useState(refashionerRequestsRowNames)
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
        setRequests([]);
        switch(tabValue) {
            case REFASHIONER_REQ:
                return getRefashionerApplications();
            case DISPUTE_REQ:
                return getDisputes();
            case BANK_REQ:
                return getUnverifiedBankAccReq();
            case WITHDRAW_REQ:
                return getWithdrawRequests();
            case SWAP_REQ:
                return getSwapRequests();
            default:
                break;
        }
    }


    React.useEffect(() => {
        getRequestsFromTab(tabValue);
    },[tabValue])

    async function getRefashionerApplications() {
        setIsLoading(true);
        setRowNames(refashionerRequestsRowNames);
        const res = await apiWrapper(retrieveAllRefashionerRegistrationRequests(),"",true);
        if(res) {
            console.log("REFASHIONER REQUESTS: " + JSON.stringify(res.data))
            setRequests(res.data);
        } else {
            setRequests([]);
        }
        setIsLoading(false);
    }

    async function getUnverifiedBankAccReq() {
        setIsLoading(true);
        setRowNames(bankAccReqRowNames);
        const res = await apiWrapper(retrieveUnverifiedBankAccountDetails(),"",true);
        if(res) {
            setRequests(res.data);
        } else {
            setRequests([]);
        }
        setIsLoading(false);
    }

    async function getDisputes() {
        setIsLoading(true);
        setRowNames(disputeRowNames);
        const res = await apiWrapper(retrieveAllDisputes(),"",true);
        if(res) {
            console.log("USER DISPUTE:" +  ": " + JSON.stringify(res.data))
            setRequests(res.data);
        } else {
            setRequests([]);
        }
        setIsLoading(false);
    }

    async function getWithdrawRequests() {
        setIsLoading(true);
        setRowNames(withdrawReqRowNames);
        const res = await apiWrapper(searchTransactions('WITHDRAW_PENDING'),"",true);
        if(res) {
            console.log("WITHDRAW REQUESTS: " + JSON.stringify(res.data))
            setRequests(res.data);
        } else {
            setRequests([]);
        }
        setIsLoading(false);

    }

    async function getSwapRequests() {
        setIsLoading(true);
        setRowNames(swapRequestRowNames);
        const res = await apiWrapper(retrieveListOfSwapRequests(),"",true);
        if(res) {
            console.log("USER SWAP REQUEST:" +  ": " + JSON.stringify(res.data))
            setRequests(res.data);
        } else {
            setRequests([]);
        }
        setIsLoading(false);
    }

    function handleRefresh() {
        getRequestsFromTab(tabValue);
    }

    return (
    <Box sx={{margin: 2}}>
        <Typography variant='h4'>{tabValue}</Typography>
        <Tabs id='tabs-container' value={tabValue} onChange={handleTabChange} classes = {{"indicator": {background: "none"}}} aria-label="chatTabs" variant="fullWidth" 
            sx = {{"& button[aria-selected='true']": {borderBottom : "5px solid", borderBottomColor : theme.palette.secondary.main, color : "secondary.main"}}}
        >
            <CustomTab label={REFASHIONER_REQ} value={REFASHIONER_REQ} {...a11yProps(0)}/>
            <CustomTab label={DISPUTE_REQ} value={DISPUTE_REQ} {...a11yProps(1)}/>
            <CustomTab label={BANK_REQ} value={BANK_REQ} {...a11yProps(2)}/>
            <CustomTab label={WITHDRAW_REQ} value={WITHDRAW_REQ} {...a11yProps(3)}/>
            <CustomTab label={SWAP_REQ} value={SWAP_REQ} {...a11yProps(4)}/>
        </Tabs>
        <Box sx= {{mt:2}}>
        {!isLoading ? <EnhancedTable rows = {requests} rowNames = {rowNames} handleRefresh={handleRefresh} type = {tabValue}/> : <InContainerLoading/>}
        </Box>
    </Box>
    )
}