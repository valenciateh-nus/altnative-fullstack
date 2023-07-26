import { useNavigate, useParams } from "react-router";
import React from 'react';
import { apiWrapper, deleteRequestById } from "../API";
import { BLIST, DLIST, MLIST, PLIST, PREQ } from "./ListingManagementScreen";
import { retrieveProjectListingById, retrieveProjectRequestById } from "../API/projectApi";
import { deleteListingById as deleteMarketplaceListing, getMarketplaceListingById } from "../API/marketplaceApi";
import { ERROR } from "../Redux/actionTypes";
import { Box, Chip, CircularProgress, Container, Grid, IconButton, Typography } from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";
import ProfileCard from "../Components/ProfileCard";
import { useDispatch } from "react-redux";
import { openImageModal } from "../Redux/actions";
import InContainerLoading from '../Components/InContainerLoading';
import { toTitleCase } from "../constants";
import { deleteProjectListingById } from "../API/userApi";
import SuccessModal from "../Components/SuccessModal";
import CustomButton from "../Components/CustomButton";
import ConfirmationDialog from "../Components/ConfirmationDialog";
import moment from "moment";
import { useTheme } from "@mui/styles";



export default function ListingsDetailsScreen() {
    const params = useParams();
    const[listing, setListing] = React.useState({});
    const[isLoading, setIsLoading] = React.useState(false);
    const[isSuccess, setIsSuccess] = React.useState(false);
    const[isConfirmDialog, setIsConfirmDialog] = React.useState(false);
    const theme = useTheme();

    const chipStyle = {
        background: theme.palette.secondary.main,
        fontWeight: "bold",
        color: "white",
        padding: 1,
        fontSize: 14
    }
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    React.useEffect(() => {
        console.log("ID: ", params.id, "|| TYPE: " + params.type);
        if(params.id && params.type) {
            getListing();
        }
    },[params.id, params.type])

    async function getListing() {
        console.log("GETS HERE2")
        setIsLoading(true);
        let listingRes;
        if(params.type === PREQ || params.type === BLIST) {
            listingRes = await apiWrapper(retrieveProjectRequestById(params.id),'',true);
        } else if(params.type === PLIST) {
            listingRes = await apiWrapper(retrieveProjectListingById(params.id),'',true);
        } else if(params.type === MLIST || params.type === DLIST) {
            listingRes = await apiWrapper(getMarketplaceListingById(params.id),'',true);
        } else {
            console.log("INVALID TYPE");
            dispatch({type: ERROR, data : 'Invalid listing type'});
        }

        if(listingRes) {
            if(params.type === PREQ || params.type === BLIST) {
                listingRes.data.user = listingRes.data.refashionee;
            } else if(params.type === PLIST) {
                listingRes.data.user = listingRes.data.refashioner;
            } else if(params.type === MLIST || params.type === DLIST) {
                listingRes.data.user = listingRes.data.appUser;
            }
            setListing(listingRes.data);
        }

        setIsLoading(false);
    }

    function handlePhotoModal(images, index) {
        dispatch(openImageModal(images, index))
    }

    async function handleFlag() {
        setIsLoading(true);
        let res;
        if(params.type === PREQ || params.type === BLIST) {
            res = await apiWrapper(deleteRequestById(listing.id),"",true);
        } else if(params.type === PLIST) {
            res = await apiWrapper(deleteProjectListingById(listing.id),"",true);
        } else if(params.type === MLIST || params.type === DLIST) {
            res = await apiWrapper(deleteMarketplaceListing(listing.id),"",true);
        }

        if(res) {
            setIsSuccess(true);
            setIsConfirmDialog(false);
        }
        setIsLoading(false);
    }
    
    function handleCloseSuccess() {
        setIsSuccess(false);
    }

    return (
        listing.id ? <Container>
            <IconButton onClick={() => navigate(-1)}>
                <ArrowBackIos/>
            </IconButton>
            <Box sx={{ overflowX: 'scroll', display: 'flex', justifyContent: 'center', alignContent: 'center',mt:2,mb:2, height: '300px', width: 'auto'  }}>
                <img src={listing.imageList[0].url} onClick={() => handlePhotoModal(listing.imageList.map(({ url }) => url), 0)} style={{ background: "none", height: '300px', alignSelf: 'center',cursor: 'pointer' }} />
            </Box>
            <ProfileCard user={listing.user || listing.appUser}/>
            <Typography variant='h4'>{toTitleCase(listing.title) || 'NO TITLE'}</Typography>
            <Typography variant='h5' sx={{mt : 2}}>Description</Typography>
            <Typography variant='body1'>{listing.description || 'NO DESCRIPTION'}</Typography>
            <Typography variant='h5' sx={{mt : 2}}>Availability</Typography>
            <Chip label={listing.available ? "AVAILABLE" : "NOT AVAILABLE"} sx={chipStyle} disabled={!listing.available}/>
            <Typography variant='h5' sx={{mt : 2}}>Category</Typography>
            <Chip label={listing.category.categoryName} sx={chipStyle}/>
            {listing.tagList?.length > 0 && <>
                <Typography variant='h5' sx={{mt : 2}}>Tags</Typography>
                <Grid container spacing={1}>
                    {listing.tagList?.map((tag,i) =>
                        <Grid item xs='auto' key={i}>
                            <Chip
                                label={tag.name}
                                sx={chipStyle}
                            />
                        </Grid>)
                    }
                </Grid>    
            </>}
            {listing.materialList?.length > 0 && <>
                <Typography variant='h5' sx={{mt : 3}}>Materials</Typography>
                <Grid container spacing={1}>
                    {listing.materialList?.map((val,i) =>
                        <Grid item xs='auto' key={i}>
                            <Chip
                                label={val.name}
                                sx={chipStyle}
                            />
                        </Grid>)
                    }
                </Grid>    
            </>}    
            {params.type !== MLIST && <>
                <Typography variant='h5' sx={{mt : 2}}>{params.type === PREQ ? 'Proposed completion date' : 'Time to complete'}</Typography>
                <Typography variant='body1'>{params.type === PLIST ? `${listing.timeToCompleteInDays} days` : moment(listing.proposedCompletionDate).format('DD MMM yyyy')}</Typography>
                </>}
            <Typography variant='h5' sx={{mt : 2}}>Price</Typography>
            <Typography variant='body1'>SGD{listing.price}</Typography>
            <Box sx={{display : 'flex', flexDirection : 'row', mt:2, mb:2, justifyContent: 'center', alignItems: 'center'}}>
                {isLoading ? <CircularProgress color='secondary'/> 
                : <>
                    {listing.available && <CustomButton variant='contained' size='large' fullWidth onClick={() => setIsConfirmDialog(true)} color = 'secondary'>Flag as inappropriate</CustomButton>}
                </>}
            </Box>   
            <ConfirmationDialog open={isConfirmDialog} handleClose={() => setIsConfirmDialog(false)} 
                handleConfirm = {handleFlag} handleCancel = {() => setIsConfirmDialog(false)} header = {'Confirm Flag?'} 
                dialogText = {'Are you sure you want to flag this post? This post will no longer be available.'}
            />
            <SuccessModal open = {isSuccess} onClose={handleCloseSuccess} onCallback={getListing} text='Successfully flagged'/> 
        </Container>
        : <InContainerLoading/>
    )

}