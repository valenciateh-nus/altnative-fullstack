import { Card, CardContent, Box, Avatar, Typography, Rating } from '@mui/material';
import * as React from 'react';
import { useNavigate } from 'react-router';
import { toTitleCase } from '../constants';

export default function ProfileCard({user, color='primary.light'}) {
    const navigate = useNavigate();
    return (
        user && <Card sx={{backgroundColor : color, mb : 2, cursor : 'pointer'}} onClick={() => navigate(`/userProfile/${user.id}`)}>
            <CardContent >
                <Box sx={{display : 'flex', flexDirection : 'row', alignItems : 'center'}}>
                    <Avatar src={user?.avatar?.url} alt={user.name} sx={{ maxWidth: '100px', maxHeight: '100px', height: '4em', width: '4em', bgcolor: '#FB7A56', marginRight: 2 }}/>
                    <Box sx={{display : 'flex', flexDirection : 'column'}}>
                        <Typography variant='h5'>{toTitleCase(user.name)}</Typography>
                        <Box sx={{display : 'flex', flexDirection : 'row', alignItems : 'center'}}>
                            <Rating value={user.rating} readOnly sx={{mr: 1}}/>
                            <Typography variant='body1' color='GrayText'>{`(${Math.round(user.rating).toFixed(1)})`}</Typography>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    )
}