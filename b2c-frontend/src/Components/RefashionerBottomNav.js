import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { useLocation, useNavigate } from 'react-router';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import CheckroomOutlinedIcon from '@mui/icons-material/CheckroomOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import { Container, Paper, useMediaQuery } from '@mui/material';
import { styled } from '@mui/styles';

import { useDispatch, useSelector } from 'react-redux';


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

  React.useState(() => {
    setValue(location.pathname.split('/')[1] ? location.pathname.split('/')[1].toLowerCase() : 'home');
  },[])
  

  const handleOnClick = (event, newValue) => {
      event.preventDefault();
      setValue(newValue);
      history('/' + newValue);
  }

  return (
    showNav ? <Container maxWidth = 'xs'>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 65, zIndex: '999', borderRadius:0}} elevation={3} >
        <Box sx={{ width: '100%' }}>
        <StyledBottomNavigation
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
            <BottomNavigationAction label="Explore" icon={<SearchIcon />} value="refashioner/viewRequests" />
            <BottomNavigationAction label="Chat" icon={<ChatOutlinedIcon />} value="chat"/>
            <BottomNavigationAction label="Profile" icon={<PermIdentityOutlinedIcon />}value="profile" />
        </StyledBottomNavigation>
        </Box>
        </Paper>
    </Container> : null
  );
}
