import React from 'react';
import { Button, Container, Box, Typography, TextField, Grid, Modal, Chip, ImageList, ImageListItem, ImageListItemBar, IconButton, SvgIcon, MenuItem, Menu } from '@mui/material'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { makeStyles } from "@mui/styles";

import AddImage from '../assets/AddNewListing.png';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';

// API
import * as IndexAPI from '../API/index';
import * as UserAPI from '../API/userApi';
import { useDispatch, useSelector } from 'react-redux';
import { ERROR } from "../Redux/actionTypes";
import { showFeedback } from '../Redux/actions';

const useStyles = makeStyles((theme) => ({
    modalBox: {
        width: '60%',
        minHeight: '18em',
        background: '#FFFAF0',
        padding: "2em",
        borderRadius: '1em',
        border: '0.1em solid #FB7A56',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    imageList: {
        flexWrap: 'nowrap',
        // display : 'flex',
        // flexDirection : 'row',
        // // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    }
}));

const invalidButtonStyle = {
    textTransform: 'none',
    color: 'white',
};

const validButtonStyle = {
    background: "#FB7A56",
    textTransform: 'none',
    color: 'white',
};

const currentListing = {
    title: "Project's Name",
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    dateCreated: '23/2/2022',
    price: '20',
    tagList: [],
    materialList: [],
    category: {},
}

export default function EditListing() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const styles = useStyles();

    const [updatedListing, setUpdatedListing] = React.useState(currentListing);

    React.useEffect(() => {

        UserAPI.retrieveProjectListingById(id).then((val) => {
            if (val.data.available) {
                setUpdatedListing(val.data);
                console.log("Project Listing Details");
                console.log(val.data);

                setImageList(val.data.imageList);
            } else {
                navigate('/requestDetails404');
            }
        })

    }, [])


    // Retrieve list of categories from backend.
    const [categoryList, setCategoryList] = React.useState([]);
    React.useEffect(() => {
        IndexAPI.getCategory().then((arr) => setCategoryList(arr.data));

    }, [])

    // 
    React.useEffect(() => {
        handleError();
    }, [updatedListing])

    // Constants for Category Modal
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const [imageList, setImageList] = React.useState([]);
    const [newImageList, setNewImageList] = React.useState([]);
    const [newTag, setNewTag] = React.useState("");
    const [newMaterial, setNewMaterial] = React.useState("");
    const [openTagModal, setOpenTagModal] = React.useState(false);
    const [openMaterialModal, setOpenMaterialModal] = React.useState(false);
    const [catId, setCatId] = React.useState();

    // Constants for Error
    const [errorTitle, setErrorTitle] = React.useState(false);
    const [errorDescription, setErrorDescription] = React.useState(false);
    const [errorCategory, setErrorCategory] = React.useState(true); // Empty at first
    const [errorPrice, setErrorPrice] = React.useState(false);
    const [errorTimeRequired, setErrorTimeRequired] = React.useState(false);

    const helperText = {
        title: "Title is required",
        description: "Description is required",
        price: "Price must be more than 0",
        timeRequired: "Time required to complete must be between 1-90 days",
    }

    const handleError = () => { // Check for any errors in form
        // Reset Error Status
        setErrorTitle(false);
        setErrorDescription(false);
        setErrorCategory(false);
        setErrorPrice(false);
        setErrorTimeRequired(false);
        // Form Validation
        if (updatedListing.title == '') {
            setErrorTitle(true);
        }
        if (updatedListing.description == '') {
            setErrorDescription(true);
        }
        if (Object.keys(updatedListing.category).length === 0) {
            setErrorCategory(true);
        }
        if (updatedListing.price <= 0) {
            setErrorPrice(true);
        }
        if (updatedListing.timeToCompleteInDays > 90 || updatedListing.timeToCompleteInDays <= 0) {
            setErrorTimeRequired(true);
        }
    }


    const handleChange = (e) => {
        console.log("change of " + e.target.name + " to " + e.target.value);
        setUpdatedListing({ ...updatedListing, [e.target.name]: e.target.value })
    };

    const handleImageInput = (e) => {
        if (e.target.files[0]) {
            console.log(imageList);
            let files = Array.from(newImageList);
            files.push(e.target.files[0]);
            console.log(files);
            setNewImageList(files);
            console.log("ImageList after adding photo");
            console.log(newImageList);
        }
    }

    const handleImageDelete = (img) => {
        /*
        let files = Array.from(updatedListing.imageList);
        files.splice(index, 1);
        setUpdatedListing({ ...updatedListing, imageList: files });
        */
        let files = [];
        if (img.id !== undefined) { // existing images in PL
            files = Array.from(imageList);
            let index = files.findIndex((val) => val === img);    
            files.splice(index, 1);
            console.log(files);
            setImageList(files);
            //setUpdatedListing({ ...updatedListing, 'imageList': imageList });

        } else {
            files = Array.from(newImageList) // new images added/deleted while updating
            let index = files.findIndex((val) => val === img);
            console.log(index);
            files.splice(index, 1);
            setNewImageList(files);
            console.log(files);
        }
    }

    const handleDelete = async (pId, imgId) => {     
        await UserAPI.removeImageFromProjectListing(pId, imgId).then((arr) => {
            console.log(arr.data);
        })
    }

    const handleSetCategory = (cat) => {
        setUpdatedListing({ ...updatedListing, category: cat })
        setCatId(cat.id);
        handleClose();
    }

    const handleCategoryDelete = () => {
        setUpdatedListing({ ...updatedListing, category: {} });
    };

    const handleNewMaterial = () => {
        const data = { name: newMaterial };
        const newArr = Array.from(updatedListing.materialList);
        newArr.push(data);
        setUpdatedListing({ ...updatedListing, materialList: newArr });
        setNewMaterial("");
        setOpenMaterialModal(false);
    }

    const handleSetNewMaterial = (e) => {
        e.preventDefault();
        setNewMaterial(e.target.value);
        console.log("newMaterial: " + e.target.value);
    }

    const handleDeleteMaterial = (index) => {
        console.log(index);
        const newArr = Array.from(updatedListing.materialList);
        newArr.splice(index, 1);
        setUpdatedListing({ ...updatedListing, materialList: newArr });
    };

    const openCategoryMenu = (event) => {
        setMenuOpen(true);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setMenuOpen(false);
    };

    const handleNewTag = () => {
        const data = { name: newTag };
        const newArr = Array.from(updatedListing.tagList);
        newArr.push(data);
        setUpdatedListing({ ...updatedListing, tagList: newArr });
        setNewTag("");
        setOpenTagModal(false);
    }

    const handleSetNewTag = (e) => {
        e.preventDefault();
        setNewTag(e.target.value);
    }

    const handleDeleteTag = (index) => {
        const newArr = Array.from(updatedListing.tagList);
        newArr.splice(index, 1);
        setUpdatedListing({ ...updatedListing, tagList: newArr });

    };


    const handleSubmit = async (e) => {
        handleError();
        if (!(errorTitle || errorDescription || errorCategory || errorPrice || errorTimeRequired)) {
            const dateModified = new Date(); // Get current date and time.
            setUpdatedListing({ ...updatedListing, dateCreated: dateModified });
            await updateProjectListing(updatedListing);
            dispatch(showFeedback("Successfully updated listing id " + id));
            navigate(`/listing/${id}`);

            // navigate("/userprofile");
        } else {
            //alert("Error Submitting Form");
        }
    }

    async function updateProjectListing(projectListing) {
        console.log('Updating New Project Listing');
        try {
            // Delete Current Images
            let deletedImageList = updatedListing.imageList.filter( ({ id: id1 }) => !imageList.some( ({ id: id2 }) => id1 === id2 ));
            console.log(deletedImageList);
            deletedImageList.forEach(async function (img) {            
                console.log(img);
                await handleDelete(id, img.id); // For some reason, the first API to delete works. but next delete API calls fails error 500
            })
            projectListing.imageList = imageList;
            // Add New Images
            if (newImageList.length > 0) {
                for (let img of newImageList) {
                    console.log("IMAGES");
                    console.log(img);
                    let imageData = new FormData();
                    imageData.append('file', img);
                    console.log("adding image to request");
                    console.log(img);
                    await UserAPI.addImageToProjectListing(id, imageData);
                }
            }

            console.log("Project Listing data");
            console.log(projectListing);

            // Project Listing without images.
            const { data } = await UserAPI.updateProjectListing(projectListing);
            console.log("DATA: " + JSON.stringify(data));
        } catch (error) {
            const data = error?.response?.data?.message;
            console.log("ERROR MSG: " + JSON.stringify(error));
            dispatch({ type: ERROR, data })
        }
    }

    return (
        <Container>
            <Button onClick={() => navigate(`/listing/${id}`)}>
                <ArrowBackIcon fontSize='large' color='action' />
            </Button>
            <Box>

                <Typography variant='h5' gutterBottom>Edit Listing Id: {id}</Typography>

                <form>
                    <Typography variant='h6' gutterBottom>Photo</Typography>
                    <Box sx={{ overflowX: 'scroll', display: 'flex', overflowY: 'hidden', flexDirection : 'row' }}>
                        <input
                            accept="image/*"
                            hidden
                            id="add-image"
                            type="file"
                            onChange={handleImageInput}
                        />
                        <label htmlFor='add-image' >
                            <img src={AddImage} style={{ width: 200, height: 200 }} alt='listing' />
                        </label>
                        <ImageList className={styles.imageList} cols={imageList?.length + newImageList?.length}>
                            {imageList && imageList.length > 0 &&
                                Array.from(imageList).map((image, i) =>
                                    <ImageListItem key={i} style={{ width: 200, height: 200, overflow: 'hidden', marginLeft: 7 }} >
                                        <img src={image.url} loading="lazy" style={{ cursor: 'pointer' }} alt='listing' />
                                        <ImageListItemBar position="top" sx={{ background: 'none', color: 'black' }}
                                            actionIcon={
                                                <IconButton onClick={() => handleImageDelete(image)}>
                                                    <CancelIcon />
                                                </IconButton>
                                            } />
                                    </ImageListItem>
                                )
                            }
                            {newImageList && newImageList.length > 0 &&
                                Array.from(newImageList).map((image, i) =>
                                    <ImageListItem key={i} style={{ width: 200, height: 200, overflow: 'hidden', marginLeft: 7 }} >
                                        <img src={URL.createObjectURL(image)} loading="lazy" style={{ cursor: 'pointer' }} alt='listing' />
                                        <ImageListItemBar position="top" sx={{ background: 'none', color: 'black' }}
                                            actionIcon={
                                                <IconButton onClick={() => handleImageDelete(image)}>
                                                    <CancelIcon />
                                                </IconButton>
                                            } />
                                    </ImageListItem>
                                )
                            }
                        </ImageList>
                    </Box>
                    <Typography variant='h6'>Listing Title</Typography>
                    <TextField
                        margin="normal"
                        required
                        style={{ width: '50%' }}
                        name='title'
                        value={updatedListing.title}
                        type="text"
                        color="secondary"
                        onChange={handleChange}
                        error={errorTitle}
                        helperText={errorTitle && helperText.title}
                    >
                    </TextField>

                    <Typography variant='h6'>Description</Typography>
                    <TextField
                        margin="normal"
                        required
                        multiline
                        style={{ width: '50%' }}
                        name="description"
                        value={updatedListing.description}
                        type="text"
                        color="secondary"
                        onChange={handleChange}
                        error={errorDescription}
                        helperText={errorDescription && helperText.description}
                    >
                    </TextField>
                    <Grid item xs='auto'>
                        <Chip
                            label={updatedListing.category.categoryName}
                            key={updatedListing.category.id}
                            onDelete={handleCategoryDelete}
                            style={{
                                background: "#FB7A56",
                                fontWeight: "bold",
                                color: "white",
                                padding: "2.5vh 1.5vw",
                                margin: "0.5em 0.3em 0",
                                borderRadius: "3vh",
                            }}
                        />
                        <Button onClick={openCategoryMenu}>
                            <AddCircleOutlineIcon color='secondary' fontSize='large' />
                        </Button>
                    </Grid>

                    <Menu
                        anchorEl={anchorEl}
                        open={menuOpen}
                        onClose={handleClose}
                    >
                        {Array.from(categoryList).map((cat) => (
                            <MenuItem
                                id={cat.id}
                                value={cat.categoryName}
                                onClick={() => handleSetCategory(cat)}
                            >
                                {cat.categoryName}
                            </MenuItem>
                        ))}
                    </Menu>
                    <Typography variant='h6'>Possible materials for this project</Typography>
                    <Grid container spacing={1}>
                        {updatedListing.materialList.length > 0 &&
                            Array.from(updatedListing.materialList).map((material, index) =>
                                <Grid item xs='auto'>
                                    <Chip
                                        label={material.name}
                                        onDelete={() => handleDeleteMaterial(index)}
                                        style={{
                                            background: "#FB7A56",
                                            fontWeight: "bold",
                                            color: "white",
                                            padding: "2.5vh 1.5vw",
                                            margin: "0 0.3em 1.5em",
                                            borderRadius: "3vh",
                                        }}
                                    />
                                </Grid>)
                        }
                        <Grid item xs='auto'>
                            <Button onClick={() => setOpenMaterialModal(true)}>
                                <AddCircleOutlineIcon color='secondary' fontSize='large' />
                            </Button>
                        </Grid>
                    </Grid>
                    <Typography variant='h6'>End Product Tags</Typography>
                    <Grid container spacing={1}>
                        {updatedListing.tagList.length > 0 &&
                            Array.from(updatedListing.tagList).map((tag, index) =>
                                <Grid item xs='auto'>
                                    <Chip
                                        label={tag.name}
                                        onDelete={() => handleDeleteTag(index)}
                                        style={{
                                            background: "#FB7A56",
                                            fontWeight: "bold",
                                            color: "white",
                                            padding: "2.5vh 1.5vw",
                                            margin: "0 0.3em 1.5em",
                                            borderRadius: "3vh",
                                        }}
                                    />
                                </Grid>)
                        }
                        <Grid item xs='auto'>
                            <Button onClick={() => setOpenTagModal(true)}>
                                <AddCircleOutlineIcon color='secondary' fontSize='large' />
                            </Button>
                        </Grid>
                    </Grid>
                    <Typography variant='h6'>Estimated Price Range</Typography>
                    <TextField
                        margin="normal"
                        required
                        style={{ width: '50%' }}
                        name="price"
                        value={updatedListing.price}
                        type="text"
                        color="secondary"
                        onChange={handleChange}
                        error={errorPrice}
                        helperText={errorPrice && helperText.price}
                    >
                    </TextField>
                    <Typography variant='h6'>Time Required to Complete</Typography>
                    <TextField
                        margin="normal"
                        required
                        style={{ width: '100%' }}
                        name="timeToCompleteInDays"
                        value={updatedListing.timeToCompleteInDays}
                        color="secondary"
                        onChange={handleChange}
                        error={errorTimeRequired}
                        helperText={errorTimeRequired && helperText.timeRequired}
                    />
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Button
                                variant="contained"
                                style={{ position: 'relative', backgroundColor: "#CFD1D8", color: "white", textTransform: "none" }}
                                fullWidth
                                onClick={() => { navigate("/userprofile") }}
                            >
                                <Typography>Cancel</Typography>
                            </Button>

                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                variant="contained"
                                fullWidth
                                disabled={(errorTitle || errorDescription || errorCategory || errorPrice || errorTimeRequired) ? true : false}
                                style={(errorTitle || errorDescription || errorCategory || errorPrice || errorTimeRequired) ? invalidButtonStyle : validButtonStyle}
                                onClick={handleSubmit}
                            >
                                <Typography>Update</Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>

            <Modal
                open={openTagModal}
                onClose={() => setOpenTagModal(false)}
            >
                <Box className={styles.modalBox}>
                    <div style={{ overflowWrap: 'break-word' }}>
                        Enter New Tag
                    </div>
                    <TextField
                        fullWidth
                        required
                        id='newTag'
                        value={newTag}
                        margin="normal"
                        label="New Tag"
                        onChange={handleSetNewTag}
                    />
                    <Button
                        variant="contained"
                        id='newTag'
                        value={newTag}
                        onClick={handleNewTag}
                        style={{ float: 'right', bottom: '1', position: 'relative', textTransform: "none" }}
                    >
                        Save
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => setOpenTagModal(false)}
                        style={{ float: 'right', bottom: '0', position: 'relative', textTransform: "none" }}
                    >
                        Cancel
                    </Button>

                </Box>
            </Modal>
            <Modal
                open={openMaterialModal}
                onClose={() => setOpenMaterialModal(false)}
            >
                <Box className={styles.modalBox}>
                    <div style={{ overflowWrap: 'break-word' }}>
                        Enter New Material
                    </div>
                    <TextField
                        fullWidth
                        multiline
                        required
                        id='newMaterial'
                        value={newMaterial}
                        margin="normal"
                        label="New Material"
                        onChange={handleSetNewMaterial}

                    />
                    <Button
                        variant="contained"
                        id='newMaterial'
                        value={newMaterial}
                        onClick={handleNewMaterial}
                        style={{ float: 'right', bottom: '1', position: 'relative' }}
                    >
                        Save
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => setOpenMaterialModal(false)}
                        style={{ float: 'right', bottom: '0', position: 'relative' }}
                    >
                        Cancel
                    </Button>

                </Box>
            </Modal>
        </Container>
    )
}
