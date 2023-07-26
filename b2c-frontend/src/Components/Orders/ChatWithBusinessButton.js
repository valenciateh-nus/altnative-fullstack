import { Button, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { MessageCircle as MessageIcon } from 'react-feather';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { generateChatId } from '../../constants';

const ChatWithBusinessButton = ({ listing, request }) => {
  const history = useNavigate();

  const currUserData = useSelector((state) => state.currUserData);
  const handleClick = () => {
    console.log(currUserData);
    console.log(listing);
    console.log(request);

    if (listing !== undefined) {
      const chatId = generateChatId(currUserData.id, listing.appUser.id, listing.id);
      history(`/chat/${chatId}?user2=${listing.appUser.username}`);
    } else {
      const chatId = generateChatId(currUserData.id, request.refashionee.id, request.id);
      history(`/chat/${chatId}?user2=${request.refashionee.username}`);
    }

  }

  return (
    <Button onClick={handleClick} variant="contained" sx={{ background: '#FB7A56', color: 'white', fontWeight: '600', padding: 1, height: '100%', width: '90%' }}>
      <IconButton sx={{ color: 'white' }}>
        <MessageIcon />
      </IconButton>
      Chat with Business
    </Button>
  );
};

export default ChatWithBusinessButton;