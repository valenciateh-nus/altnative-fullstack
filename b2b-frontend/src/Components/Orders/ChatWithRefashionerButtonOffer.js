import { Button, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { MessageCircle as MessageIcon } from 'react-feather';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { generateChatId } from '../../constants';

const ChatWithRefashionerButtonOffer = ({ offer, requestId }) => {
  const history = useNavigate();

  console.log(offer);

  const currUserData = useSelector((state) => state.currUserData);
  const handleClick = () => {
    console.log(currUserData);
    console.log(offer.appUser.id);

    const chatId = generateChatId(currUserData.id, offer.appUser.id, requestId);
    console.log(chatId);
    console.log(`/chat/${chatId}?user2=${offer.appUser.username}`);
    history(`/chat/${chatId}?user2=${offer.appUser.username}`);
  }

  return (
    <Button variant="contained" sx={{ background: '#FB7A56', color: 'white', fontWeight: '600', padding: 2, height: '100%', width: '90%' }} onClick={handleClick}>
      <Box sx={{ marginRight: 1 }}>
        <MessageIcon />
      </Box>
      Chat with Refashioner
    </Button>
  );
};

export default ChatWithRefashionerButtonOffer;