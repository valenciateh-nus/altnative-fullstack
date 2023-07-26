import { Box, Button, Card, CardContent, Chip, CircularProgress, Container, FormControl, Grid, IconButton, ImageList, ImageListItem, ImageListItemBar, InputAdornment, Menu, MenuItem, Modal, SvgIcon, TextField, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MarketplaceImg from '../../Components/Images/MarketplaceImage.png';
import CancelIcon from '@mui/icons-material/Cancel';
import { apiWrapper } from '../../API/index';


import InContainerLoading from '../../Components/InContainerLoading';
import CustomButton from '../../Components/CustomButton';

// API Imports
import * as swapRequestApi from '../../API/swapRequestApi.js';
import * as indexApi from '../../API/index.js';

// Redux Imports
import { ERROR } from "../../Redux/actionTypes";
import { showFeedback } from '../../Redux/actions';
import { useDispatch, useSelector } from 'react-redux';

const initForm = {
    itemName: '',
    itemDescription: '',
    itemCondition: '',
}


export default function CreateSwap(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const currentUser = useSelector(state => state.currUserData);

    const [categoryList, setCategoryList] = React.useState([]);
    const [selectedCategory, setSelectedCategory] = React.useState();
    const [formData, setFormData] = React.useState(initForm);
    const [image, setImage] = React.useState([]);
    const [imageList, setImageList] = React.useState([]);

    // Menu for Category
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    // Menu for Item Condition
    const itemConditionList = ["BRAND_NEW_WITH_TAG", "BRAND_NEW", "LIKE_NEW"];
    const [itemConditionMenuOpen, setItemConditionMenuOpen] = React.useState(false);
    const [itemConditionAnchorEl, setItemConditionAnchorEl] = React.useState(false);

    const [isLoading, setIsLoading] = React.useState(false);

    useEffect(() => {
        indexApi.getCategory().then((arr) => setCategoryList(arr.data));

    }, [])

    const handleImageInput = (e) => {
        if (e.target.files) {
            let files = Array.from(imageList);
            for(let i = 0 ; i < e.target.files.length; i++) {
                files.push(e.target.files[i]);
            }
            
            setImageList(files);
        }
    }

    const handleImageDelete = (index) => {
        console.log("index");
        console.log(index);
        let files = Array.from(imageList)
        files.splice(index, 1);
        setImageList(files);
    }

    const handleChange = (e) => {
        console.log(e.target.name + " changed to " + e.target.value);
        setFormData({ ...formData, [e.target.name]: e.target.value })
    };

    const openMenu = (event) => {
        setMenuOpen(!menuOpen);
        setAnchorEl(event.currentTarget);
    };

    const openItemConditionMenu = (event) => {
        setItemConditionMenuOpen(!itemConditionMenuOpen);
        setItemConditionAnchorEl(event.currentTarget);
    }

    const closeMenu = () => {
        setAnchorEl(null);
        setItemConditionAnchorEl(null);
    };

    const handleCategoryAdd = (cat) => {
        setSelectedCategory(cat);
    }

    const handleCategoryDelete = () => {
        setSelectedCategory(null);
    };

    const handleItemConditionAdd = (ic) => {
        setFormData({ ...formData, ['itemCondition']: ic });
    }

    const handleItemConditionDelete = () => {
        setFormData({ ...formData, 'itemCondition': '' })
    }

    async function createSwapRequest(cId, swapRequest) {
        console.log('Creating New Swap Request');
        console.log(swapRequest);
        try {
            const formData = new FormData();
            
            // Swap Request without images.
            swapRequest = new Blob([JSON.stringify(swapRequest)], {
                type: "application/json",
            });
            formData.append("swapRequest", swapRequest);

            // Images of project listing stored as files if exist.
            if (imageList) {
                for (let img of imageList) {
                    formData.append("files", img);
                }
            }

            const res = await swapRequestApi.createSwapRequests(cId, formData);
            if (res) {
                setIsLoading(false);
                dispatch(showFeedback('New Swap Requests Created'));
                setTimeout(function () {
                    navigate(`/swap/order`);
                }, 1000);
            } else {
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
            const data = error?.response?.data?.message;
            console.log("ERROR MSG: " + JSON.stringify(error));
            dispatch({ type: ERROR, data })
        }
    }

    const handleSubmit = async (e) => {
        setIsLoading(true);
        const cId = selectedCategory.id;
        await apiWrapper(createSwapRequest(cId, formData),'',true);
        setIsLoading(false);
    }

    
    
    /*
    async function submitDraftListing(data, mId) {
        console.log('submit new ecomm draft')
        try {
            // const newData = await updateDraft(data);
            setIsLoading(true);
            await marketplaceApi.submitDraft(data, mId);
            navigate('/marketplaceOrder', { replace: true });
        } catch (error) {
            const data = error?.response?.data?.message
            console.log("ERROR MSG: " + JSON.stringify(error));
            dispatch({ type: ERROR, data })
        }
    } */

    /*
    async function updateListing(mId, data) {
        console.log('update ecomm listing')
        try {
            setIsLoading(true);
            await marketplaceApi.updateMarketplaceListing(mId, data);
            navigate(`/marketplaceListing/${id}`, { replace: true });
        } catch (error) {
            const data = error?.response?.data?.message
            console.log("ERROR MSG: " + JSON.stringify(error));
            dispatch({ type: ERROR, data })
        }
    } */

    /*
    const deleteImage = async (mId, imgId) => {
        try {
            await marketplaceApi.deleteImageFromListing(imgId, mId).then((arr) => {
                console.log(arr.data);
            })
        } catch (error) {
            console.log(error);
        }
    } */

    return (


        <Container>
            <Box sx={{
                minHeight: '100%',
                maxHeight: '100%',
                px: 1,
                py: 7,
                overflow: 'scroll'
            }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            Swap Request
                        </Typography>
                        <Box
                            sx={{
                                height: 70,
                                width: 70,
                                position: 'relative',
                                top: -20,
                                right: 0,
                            }}
                        >
                            <img alt="Marketplace Image" src={MarketplaceImg} style={{ objectFit: 'contain' }} />
                        </Box>
                    </Grid>

                    <Grid item xs={12} container sx={{ width: '100%' }}>
                        <FormControl sx={{ width: '100%' }}>
                            <Box>
                                <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                                    Photo
                                </Typography>
                            </Box>

                            <Box sx={{ overflowX: 'scroll', display: 'flex' }}>
                                <Box sx={{ display: 'flex', marginBottom: 1 }}>
                                    <input
                                        accept="image/*"
                                        hidden
                                        id="input-image"
                                        type="file"
                                        multiple
                                        onChange={handleImageInput}
                                    />
                                    <label htmlFor="input-image">
                                        <Box
                                            sx={{ width: 150, height: 150, borderRadius: '.2em', background: 'rgb(240, 240, 240)', display: 'flex', justifyContent: 'center', alignContent: 'center' }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <SvgIcon
                                                fontSize="large"
                                                color="action"
                                                sx={{ marginTop: '35%' }}
                                            >
                                                <AddCircleOutlineIcon />
                                            </SvgIcon>
                                        </Box>
                                    </label>
                                    <ImageList>
                                        {imageList && imageList.length > 0 &&
                                            (
                                                Array.from(imageList).map((img, i) => (
                                                    <ImageListItem key={i} style={{ width: 150, height: 150, overflow: 'hidden', marginLeft: 7 }} >
                                                        <img src={URL.createObjectURL(img)} alt={img.url} loading="lazy" style={{ cursor: 'pointer' }} />
                                                        <ImageListItemBar position="top" sx={{ background: 'none', color: 'black' }}
                                                            actionIcon={
                                                                <IconButton onClick={() => handleImageDelete(i)}>
                                                                    <CancelIcon />
                                                                </IconButton>
                                                            } />
                                                    </ImageListItem>
                                                ))
                                            )
                                        }
                                    </ImageList>
                                </Box>
                            </Box>

                            <Box sx={{ marginTop: 3 }}>
                                <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                                    Item Name
                                </Typography>
                            </Box>

                            <Box>
                                <TextField
                                    id='item-name'
                                    name="itemName"
                                    value={formData["itemName"]}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Box>

                            <Box sx={{ marginTop: 3 }}>
                                <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                                    Description
                                </Typography>
                            </Box>

                            <Box>
                                <TextField
                                    id='listing-description'
                                    name="itemDescription"
                                    value={formData["itemDescription"]}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    multiline
                                    rows={5}
                                />
                            </Box>


                            <Box sx={{ marginTop: 3 }}>
                                <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                                    Category
                                </Typography>
                            </Box>

                            <Box sx={{ width: '100%', display: 'flex' }}>
                                {selectedCategory &&
                                    <Chip
                                        label={selectedCategory.categoryName}
                                        key={selectedCategory.categoryName}
                                        onDelete={() => handleCategoryDelete()}
                                        style={{
                                            background: "#FB7A56",
                                            fontWeight: "bold",
                                            color: "white",
                                            padding: "2.5vh 1.5vw",
                                            margin: "0.5em 0.3em 0",
                                            borderRadius: "3vh",
                                        }}
                                    />}
                                {!selectedCategory && <Box onClick={(e) => openMenu(e)}>
                                    <SvgIcon
                                        fontSize="large"
                                        color="action"
                                        sx={{ color: '#FB7A56', margin: '0.2em 0' }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <AddCircleOutlineIcon />
                                    </SvgIcon>
                                    <Menu
                                        id="item-condition-menu"
                                        open={menuOpen}
                                        anchorEl={anchorEl}
                                        keepMounted
                                        onClose={closeMenu}

                                    >
                                        {Array.from(categoryList).map((cat) => (
                                            <MenuItem id={cat.id} key={cat.id} value={cat.categoryName} onClick={() => handleCategoryAdd(cat)}>{cat.categoryName}</MenuItem>
                                        ))}
                                    </Menu>
                                </Box>}
                            </Box>

                            <Box sx={{ marginTop: 3 }}>
                                <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                                    Item Condition
                                </Typography>
                            </Box>

                            <Box sx={{ width: '100%', display: 'flex' }}>
                                {formData["itemCondition"] &&
                                    <Chip
                                        label={formData["itemCondition"].split("_").join(" ")}
                                        key={formData["itemCondition"]}
                                        onDelete={() => handleItemConditionDelete()}
                                        style={{
                                            background: "#FB7A56",
                                            fontWeight: "bold",
                                            color: "white",
                                            padding: "2.5vh 1.5vw",
                                            margin: "0.5em 0.3em 0",
                                            borderRadius: "3vh",
                                        }}
                                    />}
                                {!formData["itemCondition"] &&
                                    <Box onClick={(e) => openItemConditionMenu(e)}>
                                        <SvgIcon
                                            fontSize="large"
                                            color="action"
                                            sx={{ color: '#FB7A56', margin: '0.2em 0' }}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <AddCircleOutlineIcon />
                                        </SvgIcon>
                                        <Menu
                                            id="basic-menu"
                                            open={itemConditionMenuOpen}
                                            anchorEl={itemConditionAnchorEl}
                                            keepMounted
                                            onClose={closeMenu}
                                            MenuListProps={{
                                                'aria-labelledby': 'basic-button',
                                            }}
                                        >
                                            {Array.from(itemConditionList).map((ic) => (
                                                <MenuItem id={ic} key={ic} value={ic} onClick={() => handleItemConditionAdd(ic)}>
                                                    {ic.split("_").join(" ")}
                                                </MenuItem>
                                            ))}
                                        </Menu>
                                    </Box>}
                            </Box>

                        </FormControl>

                        <Grid Item xs={12} sx={{ marginTop: 3 }}>
                            <CustomButton
                                variant="contained"
                                color="secondary"
                                onClick={handleSubmit}
                                fullWidth
                                style={{ color: " white", fontWeight: "bold", fontSize: "small", padding: "1em 2em", borderRadius: '1em', height: '6em' }}
                                disabled={formData["itemName"] && formData["itemDescription"] && formData["itemCondition"] && selectedCategory && imageList.length > 0  ? false : true}
                            >
                                {/*{id !== 0 && listing.marketplaceListingStatus === 'PUBLISHED' ? 'Save' : 'Publish now'} */}
                                Publish now
                            </CustomButton>
                        </Grid>
                    </Grid>

                </Grid>
                <Modal open={isLoading} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Card sx={{ height: 200, width: 200 }}>
                        <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', margin: 2 }}>
                            <Box sx={{ display: 'flex', flexGrow: 1, height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                <CircularProgress color='secondary' sx={{ marginTop: 5 }} />
                                <Typography>Loading...</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Modal>
            </Box>
        </Container>



    )
};
