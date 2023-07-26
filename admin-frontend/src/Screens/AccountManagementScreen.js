import React from 'react';
import { Box, Tab, Tabs, Typography } from "@mui/material";
import {useTheme, withStyles} from "@mui/styles";
import {apiWrapper} from "../API/index";
import { getUserByRoles } from '../API/userApi';
import EnhancedTable from '../Components/Accounts/AccountsTable';
import InContainerLoading from '../Components/InContainerLoading';

const CustomTab = withStyles({
    root: {
      textTransform: "none"
    }
})(Tab);

const USER_REFASHIONEE = 'USER_REFASHIONEE';
const USER_REFASHIONER = 'USER_REFASHIONER';
const BUSINESS = 'USER_BUSINESS';
const ADMIN = 'ADMIN';

const rowNames = [
    {
        id: 'id',
        numeric: true,
        disablePadding: true,
        label: 'id',
        date : false,
    },
    {
        id: 'username',
        numeric: false,
        disablePadding: false,
        label: 'username',
        date : false,
    },
    {
        id: 'accountStatus',
        numeric: false,
        disablePadding: false,
        label: 'accountStatus',
        date : false,
    },
    {
        id: 'dateCreated',
        numeric: false,
        disablePadding: false,
        label: 'dateCreated',
        date : true,
    },
]

export default function AccountManagementScreen() {
    const theme = useTheme();
    const [tabValue, setTabValue] = React.useState("Refashionee Accounts");
    const [users, setUsers] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    function a11yProps(index) {
        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const handleTabChange = (e, newValue) => {
        setTabValue(newValue);
    };


    function getRoleFromTab(tab) {
        switch(tab) {
            case 'Refashionee Accounts':
                return USER_REFASHIONEE;
            case 'Refashioner Accounts':
                return USER_REFASHIONER;
            case 'Business Accounts':
                return BUSINESS;
            case 'Admin Accounts':
                return ADMIN;
            default:
                return USER_REFASHIONEE;
        }
    }

    React.useEffect(() => {
        let tab = getRoleFromTab(tabValue);
        getUsers(tab);
    },[tabValue])

    async function getUsers(role) {
        setIsLoading(true);
        const res = await apiWrapper(getUserByRoles(role),"",true);
        if(res) {
            console.log("USERS WITH ROLE " + role + ": " + JSON.stringify(res.data))
            setUsers(res.data);
        } else {
            setUsers([]);
        }
        setIsLoading(false);
    }

    function handleRefresh() {
        let tab = getRoleFromTab(tabValue);
        getUsers(tab);
    }

    return (
    <Box sx={{margin: 2}}>
        <Typography variant='h4'>{tabValue}</Typography>
        <Tabs id='tabs-container' value={tabValue} onChange={handleTabChange} classes = {{"indicator": {background: "none"}}} aria-label="chatTabs" variant="fullWidth" 
            sx = {{"& button[aria-selected='true']": {borderBottom : "5px solid", borderBottomColor : theme.palette.secondary.main, color : "secondary.main"}}}
        >
            <CustomTab label="Refashionee Accounts" value="Refashionee Accounts" {...a11yProps(0)}/>
            <CustomTab label="Refashioner Accounts" value="Refashioner Accounts" {...a11yProps(1)}/>
            <CustomTab label="Business Accounts" value="Business Accounts" {...a11yProps(2)}/>
            <CustomTab label="Admin Accounts" value="Admin Accounts"  {...a11yProps(3)}/>
        </Tabs>
        <Box sx= {{mt:2}}>
        {!isLoading ? <EnhancedTable rows = {users} rowNames = {rowNames} handleRefresh={handleRefresh}/> : <InContainerLoading/>}
        </Box>
    </Box>
    )
}