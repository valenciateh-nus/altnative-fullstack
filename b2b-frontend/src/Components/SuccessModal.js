import { Card, CardContent, Modal, Typography } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import React from "react";

export default function SuccessModal({text='Success', open, onClose}) {
    let timer = null;
    React.useEffect(() => {
        timer = setTimeout(() => {onClose()}, 1000);
        return () => clearTimeout(timer);
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