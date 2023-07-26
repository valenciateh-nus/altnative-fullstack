import React from 'react'
import { Card, CardActionArea, CardMedia, Container, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Link } from 'react-router-dom'

import DefaultImage from '../../assets/emptyImage.jpeg';

// API
import * as UserAPI from '../../API/userApi';
import { useDispatch, useSelector } from 'react-redux';
import { ERROR } from "../../Redux/actionTypes";

export default function ViewProjectListings(props) {

    const currentUser = useSelector(state => state.currUserData);
    const projectListings = props.projectListings;
    return (
        projectListings.length > 0 && <Box sx={{ mt: 5, mb: 5 }}>
            <Typography variant='h5'>Project Listing</Typography>
            <Grid container spacing={6}>
                {projectListings ?
                    (Array.from(projectListings).map((listing,idx) =>
                        <Grid item xs={6} key={idx}>
                            <Card>
                                <Link to="/">
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
    )
}
