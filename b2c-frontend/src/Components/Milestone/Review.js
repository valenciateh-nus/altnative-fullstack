import * as React from 'react';
import { CardContent, Modal, Card, Typography, Rating, TextField, Box, } from "@mui/material";
import CustomButton from "../CustomButton";
import { useDispatch, useSelector } from 'react-redux';
import { apiWrapper } from '../../API';
import { showFeedback } from '../../Redux/actions';
import { createReview } from '../../API/userApi';

const initForm = { reviewRating: 5, description: ''}
export default function Review({otherUser, milestone, createReview, index}) {
    const[isReviewOpen, setIsReviewOpen] = React.useState(false);
    const[reviewForm,setReviewForm] = React.useState(initForm);
    const reviewStyle = { position: 'absolute', top: '50%', left: '50%',transform: 'translate(-50%, -50%)', backgroundColor : "primary.veryLight", width: '450px', maxWidth : '300px', height: '350px', display : 'flex', justifyContent : 'center', alignItems : 'center', borderRadius : '16px', flexDirection : 'column'}

    const remarksJSON = JSON.parse(milestone.remarks ? milestone.remarks : JSON.stringify({reviewsMadeBy : []}));   
    const currUserData = useSelector((state) => state.currUserData);
    const handleFormChange = (e) => {
        e.preventDefault();
        setReviewForm({ ...reviewForm, [e.target.name]: e.target.value })
    };

    async function handleSubmit() {
        let submitForm = reviewForm;
        submitForm.owner = currUserData;
        submitForm.appUser = otherUser;
        await createReview(submitForm,{...milestone, remarks : JSON.stringify({reviewsMadeBy : [...remarksJSON.reviewsMadeBy, currUserData.id]}) },index);
    }
    return (
        <>
        {!remarksJSON.reviewsMadeBy?.includes(currUserData.id) && <CustomButton variant='contained' color='secondary' onClick={() => setIsReviewOpen(true)} sx={{mb: 2, mr: 1}}>Leave a review</CustomButton>}
        <Modal
            open={isReviewOpen}
            onClose={() => setIsReviewOpen(false)}
        >
            <Card sx={reviewStyle}>
                <CardContent>
                    <Box component="form" onSubmit = {handleSubmit} sx={{display : 'flex', flexGrow: 1, minWidth: '250px', height: '300px', justifyContent: 'space-between', flexDirection : 'column'}} >
                        <Typography variant='h5'>Create Review</Typography>
                        <Rating
                            name="reviewRating"
                            value={reviewForm.reviewRating}
                            onChange={handleFormChange}
                            
                        />
                        <TextField
                            fullWidth
                            label="Review Descripton"
                            multiline
                            name="description"
                            value={reviewForm.description}
                            rows={5}
                            onChange={handleFormChange}
                        />
                        <Box sx={{display : 'flex', justifyContent: 'flex-end'}}>
                        <CustomButton
                            variant="contained"
                            sx={{color: 'primary.veryLight', mr: 1}}
                            onClick={() => setIsReviewOpen(false)}
                        >
                            Cancel
                        </CustomButton>
                        <CustomButton
                            variant="contained"
                            color="secondary"
                            type='submit'
                        >
                            Submit Review
                        </CustomButton>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Modal>
        </>
    )
}