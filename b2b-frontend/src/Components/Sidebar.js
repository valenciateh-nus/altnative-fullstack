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
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import CheckroomOutlinedIcon from '@mui/icons-material/CheckroomOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import { drawerWidth, MARKET_VIEW, REFASHIONEE_VIEW, REFASHIONER_VIEW } from '../constants';
import { useLocation, useNavigate } from 'react-router';
import { makeStyles } from '@mui/styles';
import { Badge, Button, Icon, IconButton, Link, ListItemButton } from '@mui/material';
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';


import LOGO from '../assets/icon-512.png'

const useStyles = makeStyles(theme => ({
  icon : {
    fontSize : 40,
  },
}))

const StyledList = styled(List)({
  // selected and (selected + hover) states
  "&& .Mui-selected, && .Mui-selected:hover": {
    backgroundColor: "#FB7A56",
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
});



export default function Sidebar() {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = React.useState(location.pathname.split('/')[1])

  const history = useNavigate();

  const selectView = useSelector((state) => state.view);
  const unreadMessages = useSelector((state) => state.unreadCount);

  React.useState(() => {
    console.log("PATH: ", location.pathname.split('/')[1])
    if(selectView !== REFASHIONER_VIEW) {
      console.log("HERE1")
      setSelectedTab(location.pathname.split('/')[1] ? location.pathname.split('/')[1].toLowerCase() : 'home');
    } else {
      if(location.pathname.split('/')[1] == 'chat' || location.pathname.split('/')[1] == 'profile') {
        console.log("HERE2")
        setSelectedTab(location.pathname.split('/')[1] ? location.pathname.split('/')[1].toLowerCase() : 'home');
      } else {
        console.log("HERE3")
        setSelectedTab('refashioner/' + (location.pathname.split('/')[2] ? location.pathname.split('/')[2].toLowerCase() : 'home'));
      }
      
    }
    
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
          <IconButton onClick = {() => handleListItemClick('home')} disableRipple = {true}>
            <img src = {LOGO} style ={{height : 142}}/>
          </IconButton>
        </Toolbar>
        {selectView === REFASHIONEE_VIEW && <>
          <StyledList>
            <ListItemButton key={"home"}
            selected={selectedTab === "home"}
            onClick={() => handleListItemClick('home')}
            >
                <ListItemIcon>
                  <HomeOutlinedIcon/>
                </ListItemIcon>
                <ListItemText primary="Home" />
            </ListItemButton>
            <ListItemButton key={"order"}
              selected={selectedTab === "order"}
              onClick={() => handleListItemClick('order')}
            >
                <ListItemIcon>
                  <CheckroomOutlinedIcon/>
                </ListItemIcon>
                <ListItemText primary={"Order"} />
            </ListItemButton>
            <ListItemButton key={"upload"}
              selected={selectedTab === "upload"}
              onClick={() => handleListItemClick('upload')}
            >
                <ListItemIcon>
                  <AddCircleOutlineOutlinedIcon/>
                </ListItemIcon>
                <ListItemText primary={"Upload"} />
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
        </>}
        {selectView === REFASHIONER_VIEW && <>
          <StyledList>
          <ListItemButton key={"refashioner/home"}
           selected={selectedTab === "refashioner/home"}
           onClick={() => handleListItemClick('refashioner/home')}
          >
              <ListItemIcon>
                <HomeOutlinedIcon/>
              </ListItemIcon>
              <ListItemText primary="Home" />
          </ListItemButton>
          <ListItemButton key={"refashioner/order"}
            selected={selectedTab === "refashioner/order"}
            onClick={() => handleListItemClick('refashioner/order')}
          >
              <ListItemIcon>
                <CheckroomOutlinedIcon/>
              </ListItemIcon>
              <ListItemText primary={"Order"} />
          </ListItemButton>
          <ListItemButton key={"upload"}
            selected={selectedTab === "refashioner/viewRequests"}
            onClick={() => handleListItemClick('refashioner/viewRequests')}
          >
              <ListItemIcon>
                <SearchIcon/>
              </ListItemIcon>
              <ListItemText primary={"Explore"} />
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
        </>}
        {selectView === MARKET_VIEW && <>
          <StyledList>
            <ListItemButton key={"home"}
            selected={selectedTab === "marketplace"}
            onClick={() => handleListItemClick('marketplace')}
            >
                <ListItemIcon>
                  <HomeOutlinedIcon/>
                </ListItemIcon>
                <ListItemText primary="Home" />
            </ListItemButton>
            <ListItemButton key={"order"}
              selected={selectedTab === "marketplaceOrder"}
              onClick={() => handleListItemClick('marketplaceOrder')}
            >
                <ListItemIcon>
                  <CheckroomOutlinedIcon/>
                </ListItemIcon>
                <ListItemText primary={"Order"} />
            </ListItemButton>
            <ListItemButton key={"upload"}
              selected={selectedTab === "createEcommListing"}
              onClick={() => handleListItemClick('createEcommListing')}
            >
                <ListItemIcon>
                  <AddCircleOutlineOutlinedIcon/>
                </ListItemIcon>
                <ListItemText primary={"Upload"} />
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
        </>}
      </Drawer>
    </Box>
  );
}
