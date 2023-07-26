import { Button, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { MessageCircle as MessageIcon } from 'react-feather';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { generateChatId } from '../../constants';

const ChatWithRefashionerButton = ({ request, mpl, title = "Chat With Refashioner"}) => {
  const history = useNavigate();
  
  const currUserData = useSelector((state) => state.currUserData);
  const handleClick = () => {
    if (request) {
      const chatId = generateChatId(currUserData.id, request.refashionee.id, request.id);
      history(`/chat/${chatId}?user2=${request.refashionee.username}`);
    } else if (mpl) {
      const chatId = generateChatId(currUserData.id, mpl.appUser.id, mpl.id);
      history(`/chat/${chatId}?user2=${mpl.appUser.username}`);
    }
  }
  return (
    <Button variant="contained" sx={{ background: '#FB7A56', color: 'white', fontWeight: '600', padding: 2, height: '100%', width: '90%' }} onClick={handleClick}>
      {/* <IconButton sx={{ color: 'white' }}> */}
      <Box sx={{ marginRight: 1 }}>
        <MessageIcon />
      </Box>
      {/* </IconButton> */}
      {title}
    </Button>
  );
};

export default ChatWithRefashionerButton;