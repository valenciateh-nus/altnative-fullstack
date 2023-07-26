import React from 'react'
import { Card, CardActionArea, CardMedia, Container, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Link } from 'react-router-dom'

import DefaultImage from '../assets/EmptyListing.png';
import AddNewListing from '../assets/AddNewListing.png';
import PileOfClothes from '../assets/Pile_of_Clothes.png';

// API
import * as UserAPI from '../API/userApi';
import { useDispatch, useSelector } from 'react-redux';
import { ERROR } from "../Redux/actionTypes";

const userProjectListings = [
    {
        id: 1,
        title: 'Make Dress Into 2 Piece',
        category: ['Top', 'Jeans'],
        description: 'Lorem ipsum dolor sit amet.',
        image: [DefaultImage],
    },
    {
        id: 2,
        title: 'Make Denim into Jacket',
        category: ['Top', 'Jeans'],
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque rutrum magna at erat pulvinar pellentesque. Quisque imperdiet porta purus in varius. Pellentesque urna dui, iaculis vel gravida non, suscipit vel mauris. Nulla in viverra mauris. Nullam eget venenatis quam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque ac posuere justo, ac molestie mi. Mauris a libero ac magna interdum vestibulum. Ut in porttitor justo. Nullam metus odio, ultrices quis lacus maximus, luctus convallis magna. Curabitur fringilla purus in diam sollicitudin, ac ultrices sapien tincidunt. Vivamus non dapibus nibh.',
        image: [PileOfClothes],
    },
    {
        id: 3,
        title: 'Embroider Flower on Jacket',
        category: ['Top', 'Jeans'],
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque rutrum magna at erat pulvinar pellentesque. Quisque imperdiet porta purus in varius. Pellentesque urna dui, iaculis vel gravida non, suscipit vel mauris. Nulla in viverra mauris. Nullam eget venenatis quam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque ac posuere justo, ac molestie mi. Mauris a libero ac magna interdum vestibulum. Ut in porttitor justo. Nullam metus odio, ultrices quis lacus maximus, luctus convallis magna. Curabitur fringilla purus in diam sollicitudin, ac ultrices sapien tincidunt. Vivamus non dapibus nibh.',
        image: [DefaultImage],
    },
    {
        id: 4,
        title: 'Alter waist of Jeans',
        category: ['Top', 'Jeans'],
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque rutrum magna at erat pulvinar pellentesque. Quisque imperdiet porta purus in varius. Pellentesque urna dui, iaculis vel gravida non, suscipit vel mauris. Nulla in viverra mauris. Nullam eget venenatis quam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque ac posuere justo, ac molestie mi. Mauris a libero ac magna interdum vestibulum. Ut in porttitor justo. Nullam metus odio, ultrices quis lacus maximus, luctus convallis magna. Curabitur fringilla purus in diam sollicitudin, ac ultrices sapien tincidunt. Vivamus non dapibus nibh.',
        image: [DefaultImage],
    },
]

export default function ViewProjectListings(props) {

    const currentUser = useSelector(state => state.currUserData);
    const projectListings = props.projectListings;
    const isUserProfile = props.isUserProfile;
    console.log("PROJECT LISTINGS");
    console.log(props.projectListings);
    return (
        <Container>
            <Box sx={{ mt: 5, mb: 5 }}>
                <Typography variant='h5'>Project Listing</Typography>
                <Grid container spacing={6}>
                    {isUserProfile &&
                        <Grid item xs={6}>
                            <Card>
                                <Link to="/createListing">
                                    <CardActionArea>
                                        <CardMedia
                                            component="img"
                                            image={AddNewListing}
                                            alt="add listing image"
                                        />
                                    </CardActionArea>
                                </Link>
                            </Card>

                        </Grid>
                    }
                    {projectListings ?
                        (Array.from(projectListings).map(listing =>
                            <Grid item xs={6}>
                                <Card>
                                    <Link to={`../listing/${listing.id}`}>
                                        <CardActionArea>
                                            <CardMedia
                                                component="img"
                                                image={listing.imageList[0] ? listing.imageList[0].url : DefaultImage}
                                                alt="listing img"
                                            />
                                        </CardActionArea>
                                    </Link>
                                </Card>

                            </Grid>)
                        ) : (
                            <Grid item xs={12}>
                                <Box sx={{ marginTop: '10px' }}>
                                    <Typography variant='subtitle1'>No Project Listings</Typography>
                                </Box>
                            </Grid>
                        )
                    }
                </Grid>
            </Box>
        </Container>
    )
}
