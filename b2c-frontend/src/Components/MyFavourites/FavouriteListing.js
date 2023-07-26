import { Card, CardActionArea, CardContent, CardMedia, Container, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import EmptyListing from '../../assets/EmptyListing.png'

export default function FavouriteListing(props) {

    let navigate = useNavigate();
    return (
        <Container>
            <Card sx={{ maxWidth: 150, maxHeight: '100' }}>
                <CardActionArea onClick={() => { navigate("/profile") }}>
                    <img src={EmptyListing} />
                </CardActionArea>
                <CardContent>
                    <Typography variant='h5' gutterBottom>{props.title}</Typography>
                </CardContent>

            </Card>
        </Container>
    )
}
