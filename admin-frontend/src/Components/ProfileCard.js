import { Card, CardContent, Box, Avatar, Typography, Rating, Chip } from '@mui/material';
import { useTheme } from '@mui/styles';
import * as React from 'react';
import { useNavigate } from 'react-router';
import { toTitleCase } from '../constants';

export default function ProfileCard({user, color='primary.light'}) {
    const navigate = useNavigate();
    const theme = useTheme();

    const chipStyle = {
        background: theme.palette.secondary.main,
        fontWeight: "bold",
        color: "white",
        padding: 1,
        fontSize: 14
    }

    return (
        user && <Card sx={{backgroundColor : color, mb : 2, cursor : 'pointer'}} onClick={() => navigate(`/user/${user.id}`)}>
            <CardContent >
                <Box sx={{display : 'flex', flexDirection : 'row', alignItems : 'center'}}>
                    <Avatar src={user?.avatar?.url} alt={user.name} sx={{ maxWidth: '100px', maxHeight: '100px', height: '4em', width: '4em', bgcolor: theme.palette.secondary.main, marginRight: 2 }}/>
                    <Box sx={{display : 'flex', flexDirection : 'column'}}>
                        <Typography variant='h5'>{toTitleCase(user.name)}</Typography>
                        <Box sx={{display : 'flex', flexDirection : 'row', alignItems : 'center'}}>
                            <Rating value={user.rating} readOnly sx={{mr: 1}}/>
                            <Typography variant='body1' color='GrayText'>{`(${Math.round(user.rating).toFixed(1)})`}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{display : 'flex', justifyContent : 'flex-end', flexGrow : 1}}>
                    <Chip sx={chipStyle} size='medium' label={user.roles.includes('ADMIN') ? 'ADMIN' : (user.roles.includes("USER_REFASHIONER") ? 'REFASHIONER' : 'REFASHIONEE')}/>
                    </Box>
                </Box>
                
            </CardContent>
        </Card>
    )
}