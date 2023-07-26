import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import CheckroomOutlinedIcon from '@mui/icons-material/CheckroomOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import { drawerWidth, MARKET_VIEW, REFASHIONEE_VIEW, REFASHIONER_VIEW } from '../constants';
import { useLocation, useNavigate } from 'react-router';
import { makeStyles, useTheme } from '@mui/styles';
import { Badge, Button, Icon, IconButton, Link, ListItemButton } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';



import LOGO from '../assets/icon-512.png'

const useStyles = makeStyles(theme => ({
  icon : {
    fontSize : 40,
  },
}))

const StyledList = styled(List)(({theme}) => ({
  // selected and (selected + hover) states
  "&& .Mui-selected, && .Mui-selected:hover": {
    backgroundColor: theme.palette.secondary.main,
    "&, & .MuiListItemIcon-root": {
      color: "white"
    }
  },
  // hover states
  "& .MuiListItemButton-root:hover": {
    "&, & .MuiListItemIcon-root": {
      color: "black"
    }
  }
}));



export default function Sidebar() {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = React.useState(location.pathname.split('/')[1])

  const history = useNavigate();

  const unreadMessages = useSelector((state) => state.unreadCount);

  React.useState(() => {
    console.log("PATH: ", location.pathname.split('/')[1])
    setSelectedTab(location.pathname.split('/')[1] ? location.pathname.split('/')[1].toLowerCase() : 'dashboard');    
  },[location.pathname])

  const handleListItemClick = (tab) => {
    setSelectedTab(tab);
    history('/' + tab)
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar disableGutters={true}>
          <IconButton onClick = {() => handleListItemClick('dashboard')} disableRipple = {true}>
            <img src = {LOGO} style ={{height : 142}}/>
          </IconButton>
        </Toolbar>
        <StyledList>
          <ListItemButton key={"dashboard"}
          selected={selectedTab === "dashboard"}
          onClick={() => handleListItemClick('dashboard')}
          >
              <ListItemIcon>
                <DashboardIcon/>
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
          </ListItemButton>
          <ListItemButton key={"transactions"}
            selected={selectedTab === "transactions"}
            onClick={() => handleListItemClick('transactions')}
          >
              <ListItemIcon>
                <AttachMoneyIcon/>
              </ListItemIcon>
              <ListItemText primary={"Transactions"} />
          </ListItemButton>
          <ListItemButton key={"listingsManagement"}
            selected={selectedTab === "listingsManagement"}
            onClick={() => handleListItemClick('listingsManagement')}
          >
              <ListItemIcon>
                <CheckroomOutlinedIcon/>
              </ListItemIcon>
              <ListItemText primary={"Listing Management"} />
          </ListItemButton>
          <ListItemButton key={"accountManagement"}
            selected={selectedTab === "accountManagement"}
            onClick={() => handleListItemClick('accountManagement')}
          >
              <ListItemIcon>
                <PeopleIcon/>
              </ListItemIcon>
              <ListItemText primary={"Account management"} />
          </ListItemButton>
          <ListItemButton key={"chat"}
            selected={selectedTab === "chat"}
            onClick={() => handleListItemClick('chat')}
          >
              <ListItemIcon>
                  <ChatOutlinedIcon/>
              </ListItemIcon>
              <ListItemText primary={"Chat"} />
              <Badge color="primary" badgeContent={unreadMessages} max={99} sx={{ marginRight: 2 }}/> 
          </ListItemButton>
          <ListItemButton key={"requests"}
            selected={selectedTab === "requests"}
            onClick={() => handleListItemClick('requests')}
          >
              <ListItemIcon>
                <HelpOutlineIcon/>
              </ListItemIcon>
              <ListItemText primary={"Requests"} />
          </ListItemButton>
          <ListItemButton key={"profile"}
            selected={selectedTab === "profile"}
            onClick={() => handleListItemClick('profile')}
          >
              <ListItemIcon>
                <PermIdentityOutlinedIcon/>
              </ListItemIcon>
              <ListItemText primary={"Profile"} />
          </ListItemButton>
        </StyledList>
      </Drawer>
    </Box>
  );
}
