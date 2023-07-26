import { Button, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { MessageCircle as MessageIcon } from 'react-feather';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { generateChatId } from '../../constants';

const ChatWithRefashionerListingButton = ({ listing }) => {
  const history = useNavigate();

  console.log(listing);

  const currUserData = useSelector((state) => state.currUserData);
  const handleClick = () => {
    console.log(currUserData);
    console.log(listing.refashioner.id);

    const chatId = generateChatId(currUserData.id, listing.refashioner.id, listing.id);
    console.log(chatId);
    console.log(`/chat/${chatId}?user2=${listing.refashioner.username}`);
    history(`/chat/${chatId}?user2=${listing.refashioner.username}`);
  }

  return (
    <Button variant="contained" sx={{ background: '#FB7A56', color: 'white', fontWeight: '600', padding: 2, height: '100%', width: '100%' }} onClick={handleClick}>
      <Box sx={{ marginRight: 1 }}>
        <MessageIcon />
      </Box>
      Chat with Refashioner
    </Button>
  );
};

export default ChatWithRefashionerListingButton;