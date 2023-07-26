import React from 'react'
import { Container, Box, Typography, Grid, Rating, Button, Card, IconButton, Menu, MenuItem, Modal, TextField } from '@mui/material'
import { makeStyles } from "@mui/styles";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// API
import { useDispatch, useSelector } from 'react-redux';
import { ERROR } from "../../Redux/actionTypes";
import * as UserAPI from '../../API/userApi';
import { showFeedback } from '../../Redux/actions';

const useStyles = makeStyles((theme) => ({
    review: {
        width: '100%',
        padding: '20px',
        marginBottom: '5vh',
    },
    modalBox: {
        width: '60%',
        minHeight: '18em',
        background: theme.palette.primary.veryLight,
        padding: "2em",
        borderRadius: '1em',
        border: `0.1em solid ${theme.palette.secondary.main}`,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    }
}));


export default function ViewReviews(props) {

    const styles = useStyles();
    const dispatch = useDispatch();
    const reviews = props.reviews.data;

    const [selectedReview, setSelectedReview] = React.useState(null);
    const [openReviewModal, setOpenReviewModal] = React.useState(false);
    // Constants for Menu
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);


    async function createReview(newReview) {
        console.log('Creating new Review...');
        try {
            const { data } = await UserAPI.createReview(newReview);
            console.log("DATA: " + JSON.stringify(data));
        } catch (error) {
            const data = error?.response?.data?.message
            console.log("ERROR MSG: " + JSON.stringify(error));
            dispatch({ type: ERROR, data })
        }
    }


    const handleDeleteReview = async () => {

        // Insert the API to delete review
        await deleteReview(selectedReview);
        dispatch(showFeedback("Review Deleted: " + selectedReview.id));
        
        handleClose();
    }

    async function deleteReview(review) {
        console.log('Deleting review...');
        try {
            const { data } = await UserAPI.deleteReview(review.id);
            console.log("DATA: " + JSON.stringify(data));
        } catch (error) {
            const data = error?.response?.data?.message
            console.log("ERROR MSG: " + JSON.stringify(error));
            dispatch({ type: ERROR, data })
        }

    }

    const handleClick = (event, review) => {
        setAnchorEl(event.currentTarget);

        console.log("Selected review is: " + review.id);
        setSelectedReview(review);
    };
    const handleClose = () => {
        setAnchorEl(null);
        setSelectedReview(null);
    };

    function getDifferencesInDays(reviewDate) {
        const today = new Date();
        const differencesInDays = (today.getTime() - reviewDate.getTime()) / (1000 * 3600 * 24);
        const days = Math.floor(differencesInDays);
        const hours = Math.floor((differencesInDays - days) * 24);
        const minutes = Math.floor((((differencesInDays - days) * 24) - hours) * 60);
        return <Typography variant='text'>{days}d {hours}h {minutes}m ago</Typography>;
    }

    return (
        <>
            <Box sx={{ mt: 5, mb: 5 }}>
                <Typography variant='h5'>Reviews</Typography>
                {reviews ?
                    (// When there are reviews
                        Array.from(reviews).map((review) =>
                            <Card className={styles.review}>
                                <Grid justifyContent="space-between" container spacing={1}>
                                    <Grid item xs={9}>
                                        <Typography><AccountCircleIcon fontSize='large' /> {review.owner.name}</Typography>
                                    </Grid>
                                    <Grid item xs='auto'>
                                            <IconButton onClick={(e) => { handleClick(e, review) }}>
                                                <MoreVertIcon />
                                            </IconButton>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Rating value={review.reviewRating} readOnly /> {review.reviewRating}/5
                                        <Typography>{getDifferencesInDays(new Date(review.dateCreated))}</Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography>{review.description}</Typography>
                                    </Grid>
                                </Grid>
                            </Card>
                        )) :
                    ( // When No Reviews
                        <Box sx={ {marginTop: '10px'} }>
                            <Typography variant='subtitle1'>No Reviews Found</Typography>
                        </Box>
                    )
                }
            </Box>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleDeleteReview}>Delete Review</MenuItem>
            </Menu>
        </>
    )
}
