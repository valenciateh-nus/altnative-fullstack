import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { useLocation, useNavigate } from 'react-router';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import CheckroomOutlinedIcon from '@mui/icons-material/CheckroomOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import { Badge, Container, Paper, useMediaQuery } from '@mui/material';
import { styled } from '@mui/styles';
import SearchIcon from '@mui/icons-material/Search';

import { useDispatch, useSelector } from 'react-redux';
import { MARKET_VIEW, REFASHIONEE_VIEW, REFASHIONER_VIEW } from '../constants';


const StyledBottomNavigation = styled(BottomNavigation)({
  // selected and (selected + hover) states
  "&& .Mui-selected, && .Mui-selected:hover": {
    outline : 'none',
    "&, & .MuiListItemIcon-root": {
      color: '#FB7A56'
    }
  },
  // hover states
  "& .MuiBottomNavigationAction-root:hover": {
    outline : 'none'
  }
});


export default function BottomNav() {
  const [value, setValue] = React.useState();

  const location = useLocation();
  const history = useNavigate();
  const showNav = useSelector((state) => state.showBottomNavBar);

  const selectView = useSelector((state) => state.view);
  const unreadMessages = useSelector((state) => state.unreadCount);

  React.useState(() => {
    if(selectView !== REFASHIONER_VIEW) {
      setValue(location.pathname.split('/')[1] ? location.pathname.split('/')[1].toLowerCase() : 'home');
    } else {
      if(location.pathname.split('/')[1] == 'chat' || location.pathname.split('/')[1] == 'profile') {
        console.log("HERE2")
        setValue(location.pathname.split('/')[1] ? location.pathname.split('/')[1].toLowerCase() : 'refashioner/home');
      } else {
        console.log("HERE3")
        setValue('refashioner/' + (location.pathname.split('/')[2] ? location.pathname.split('/')[2].toLowerCase() : 'home'));
      }
    }
  },[location.pathname])
  

  const handleOnClick = (event, newValue) => {
      event.preventDefault();
      setValue(newValue);
      history('/' + newValue);
  }

  return (
    showNav ? <Container maxWidth = 'xs'>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 65, zIndex: '999', borderRadius:0}} elevation={3} >
        <Box sx={{ width: '100%' }}>
        {selectView === REFASHIONEE_VIEW && <StyledBottomNavigation
            showLabels
            value={value}
            onChange={handleOnClick}
            sx = {{
              border : 'none',
              boxShadow : 'none',
              outline : 'none',
            }}
        >
            <BottomNavigationAction label="Home" icon={<HomeOutlinedIcon />} value="home"/>
            <BottomNavigationAction label="Order" icon={<CheckroomOutlinedIcon /> } value="order" />
            <BottomNavigationAction label="Upload" icon={<AddCircleOutlineOutlinedIcon />}value="upload" />
            <BottomNavigationAction label="Chat" icon={
              <>
              <Badge color="secondary" badgeContent={unreadMessages} max={99}>
                <ChatOutlinedIcon />
              </Badge>
              </>
            } value="chat"/>
            <BottomNavigationAction label="Profile" icon={<PermIdentityOutlinedIcon />}value="profile" />
        </StyledBottomNavigation>}
        {selectView === REFASHIONER_VIEW && <StyledBottomNavigation
            showLabels
            value={value}
            onChange={handleOnClick}
            sx = {{
              border : 'none',
              boxShadow : 'none',
              outline : 'none',
            }}
        >
            <BottomNavigationAction label="Home" icon={<HomeOutlinedIcon />} value="refashioner/home"/>
            <BottomNavigationAction label="Order" icon={<CheckroomOutlinedIcon /> } value="refashioner/order" />
            <BottomNavigationAction label="Explore" icon={<SearchIcon />}value="refashioner/viewRequests" />
            <BottomNavigationAction label="Chat" icon={
              <>
              <Badge color="secondary" badgeContent={unreadMessages} max={99}>
                <ChatOutlinedIcon />
              </Badge>
              </>
            } value="chat"/>
            <BottomNavigationAction label="Profile" icon={<PermIdentityOutlinedIcon />}value="profile" />
        </StyledBottomNavigation>}
        {selectView === MARKET_VIEW && <StyledBottomNavigation
            showLabels
            value={value}
            onChange={handleOnClick}
            sx = {{
              border : 'none',
              boxShadow : 'none',
              outline : 'none',
            }}
        >
            <BottomNavigationAction label="Home" icon={<HomeOutlinedIcon />} value="marketplace"/>
            <BottomNavigationAction label="Order" icon={<CheckroomOutlinedIcon /> } value="marketplaceOrder" />
            <BottomNavigationAction label="Explore" icon={<SearchIcon />}value="createEcommListing" />
            <BottomNavigationAction label="Chat" icon={
              <>
              <Badge color="secondary" badgeContent={unreadMessages} max={99}>
                <ChatOutlinedIcon />
              </Badge>
              </>
            } value="chat"/>
            <BottomNavigationAction label="Profile" icon={<PermIdentityOutlinedIcon />}value="profile" />
        </StyledBottomNavigation>}
        </Box>
        </Paper>
    </Container> : null
  );
}
