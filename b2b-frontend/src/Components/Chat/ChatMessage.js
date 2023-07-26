import React from 'react';
import PropTypes from 'prop-types';
import cx from 'clsx';
import { Avatar, Grid, ImageList, ImageListItem, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';
import ChatMessageStyle from './ChatMessageStyle'
import { useDispatch } from 'react-redux';
import { openImageModal } from '../../Redux/actions';
import { Box } from '@mui/system';
import OfferChatCard from './OfferChatCard';

const ChatMessage = withStyles(ChatMessageStyle, { name: 'ChatMsg' })(props => {
  const {
    classes,
    avatar,
    messages,
    side,
    GridContainerProps,
    GridItemProps,
    AvatarProps,
    getTypographyProps,
    timestamp,
    images,
    isOffer,
    handleSendOfferRejectionMessage,
    isLast,
  } = props;
  const attachClass = index => {
    if (index === 0) {
      return classes[`${side}First`];
    }
    if (index === messages.length - 1) {
      return classes[`${side}Last`];
    }
    return '';
  };

  const dispatch = useDispatch();
  function handlePhotoModal(images, index) {
    dispatch(openImageModal(images,index))
  }
  
  return (
    <>
    <Grid
      container
      item
      justify={side === 'right' ? 'flex-end' : 'flex-start'}
      {...GridContainerProps}
      spacing = {1}
      columns={14}
    >
      {side === 'left' && (
        <Grid item {...GridItemProps}>
          <Avatar
            src={avatar}
            {...AvatarProps}
            className={cx(classes.avatar, AvatarProps.className)}
          />
        </Grid>
      )}
      <Grid item xs={side === 'right' ? 14 : 12} sx ={{}}>
        {images !== null && images.length > 0 &&
          <Box sx ={{display : 'flex', justifyContent : `${side === 'right' ? 'flex-end' : 'flex-start'}`}}>
          <ImageList cols = {images.length > 1 ? 2 : 1} rows = {images.length >= 3 ? 2 : 1} sx={{width: 204, height : `${images.length >= 3 ? 204 : 102}`, overflow : 'hidden'}}>
            {images.map((img,i) => (
              i < 4 && ( i < 3 ? 
              <ImageListItem key={i} style={{width:images.length > 1 ? 100 : 200, height: images.length > 1 ? 100 : 200, overflow : 'hidden'}} >
                <img src={`${img.url}`} loading="lazy" onClick={() => handlePhotoModal(images.map(({ url }) => url), i)} style={{cursor:'pointer'}}/>
              </ImageListItem> : 
              (images.length > 4 ?
              <Box sx={{backgroundImage : `url(${img.url})`, backgroundSize : 100, width: 100, height: 100, boxShadow: 'inset 0 0 0 50vw rgba(251,122,86,0.6)', cursor:'pointer', display : 'flex', justifyContent : 'center', alignItems : 'center'}}
              onClick={() => handlePhotoModal(images.map(({ url }) => url), 3)} style={{cursor:'pointer'}}
              >
                <Typography variant = 'h4' color = 'white'>
                  +{images.length - 4}
                </Typography>
              </Box>
              : <ImageListItem key={i} style={{width:100, height: 100, overflow : 'hidden'}} >
                <img src={`${img.url}`} loading="lazy" onClick={() => handlePhotoModal(images.map(({ url }) => url), i)} style={{cursor:'pointer'}}/>
              </ImageListItem>)
            )))}
          </ImageList>
          </Box>
        }
        {messages.map((msg, i) => {
          const TypographyProps = getTypographyProps(msg, i, props);
          return (
            // eslint-disable-next-line react/no-array-index-key
            <div key={msg.id || i} className={classes[`${side}Row`]}>
              {!isOffer ?
              <Typography
                align={'left'}
                {...TypographyProps}
                className={cx(
                  classes.msg,
                  classes[side],
                  attachClass(i),
                  TypographyProps.className,
                )}
              >
                {msg}
                <span style={{display : 'flex', justifyContent : 'flex-end', fontSize : 12}}>{timestamp}</span>
              </Typography>
              : <Box sx ={{display : 'flex', justifyContent : `${side === 'right' ? 'flex-end' : 'flex-start'}`}}>
                <OfferChatCard offerId={msg} showButtons = {side === 'left' ? true : false} isLast={isLast} handleRejection={handleSendOfferRejectionMessage}/>
                </Box>}
            </div>
          );
        })}
      </Grid>
    </Grid>
    </>
  );
});

ChatMessage.propTypes = {
  avatar: PropTypes.string,
  messages: PropTypes.arrayOf(PropTypes.string),
  side: PropTypes.oneOf(['left', 'right']),
  GridContainerProps: PropTypes.shape({}),
  GridItemProps: PropTypes.shape({}),
  AvatarProps: PropTypes.shape({}),
  getTypographyProps: PropTypes.func,
  timestamp : PropTypes.string,
  images: PropTypes.arrayOf(PropTypes.shape({})),
  isOffer : PropTypes.bool,
  isLast : PropTypes.bool,
  handleSendOfferRejectionMessage : PropTypes.func,
};
ChatMessage.defaultProps = {
  avatar: '',
  messages: [],
  side: 'left',
  GridContainerProps: {},
  GridItemProps: {},
  AvatarProps: {},
  getTypographyProps: () => ({}),
  images: {},
  isOffer : false,
  isLast : false,
  handleSendOfferRejectionMessage : () => ({}),
};

export default ChatMessage;