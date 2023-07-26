import * as React from 'react';
import { Card, CardContent, CircularProgress, Modal, Typography, useMediaQuery } from '@mui/material';

export default function LoadingModal({open, text="Loading..."}) {
    return (
        <Modal open={open} sx= {{display : 'flex', justifyContent: 'center', alignItems : 'center'}}>
            <Card>
                <CardContent sx={{display: 'flex', justifyContent : 'center', alignItems : 'center', flexDirection : 'column', margin : 2, ":last-child" : {paddingBottom : 2}}}>
                <CircularProgress color='secondary'/>
                <Typography sx={{paddingTop: 3}}>{text}</Typography>
                </CardContent>
            </Card>
        </Modal>
    )
}