import { Card, CardContent, Modal, Typography } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import React from "react";
import PropTypes from 'prop-types';

export default function SuccessModal({text='Success', open, onClose, onCallback, time = 1000}) {
    let timer = null;
    React.useEffect(() => {
      if(open) {
        timer = setTimeout(() => {onClose()}, time);
        return () => {
          clearTimeout(timer);
          console.log("SUCCESS MODAL CLOSING");
          if(onCallback instanceof Function) {
            onCallback();
          }
          
        }
      }
    },[open === true])

    return (
        <Modal open={open} sx= {{display : 'flex', justifyContent: 'center', alignItems : 'center'}} onClose={onClose}>
          <Card>
            <CardContent sx={{display: 'flex', justifyContent : 'center', alignItems : 'center', flexDirection : 'column', margin : 2, ":last-child" : {paddingBottom : 2}}}>
              <CheckCircleIcon color='success' sx={{fontSize : 60}}/>
              <Typography variant='body2' color='GrayText'>{text}</Typography>
            </CardContent>
          </Card>
        </Modal>
    )
}

SuccessModal.propTypes = {
  text: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCallback: PropTypes.func,
  time : PropTypes.number,
};