import React from 'react';
import { Button, Container, Box, Typography, TextField, Grid, Modal, Chip, ImageList, ImageListItem, ImageListItemBar, IconButton, Menu, MenuItem, CircularProgress, CardContent, Card, FormControl } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { makeStyles } from "@mui/styles";

import AddImage from '../assets/AddNewListing.png';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';

// API
import * as IndexAPI from '../API/index';
import * as UserAPI from '../API/userApi';
import { ERROR } from "../Redux/actionTypes";
import { showFeedback } from '../Redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import CustomButton from '../Components/CustomButton';

const useStyles = makeStyles((theme) => ({
    modalBox: {
        width: '60%',
        maxWidth: '400px',
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
        display: 'flex',
        flexDirection: 'row',
        overflow: 'scroll',
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

const initForm = {
    title: '',
    description: '',
    dateCreated: new Date(), //.toISOString().split('T')[0],
    price: '',
    tagList: [],
    materialList: [],
    category: {},
    timeToCompleteInDays: '',
}

export default function CreateListing() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const styles = useStyles();

    const currentUser = useSelector(state => state.currUserData);

    const [isLoading, setIsLoading] = React.useState(false);
    const [projectListing, setProjectListing] = React.useState(initForm);

    React.useEffect(() => {
        handleError();
    }, [projectListing])

    // Retrieve list of categories from backend.
    const [categoryList, setCategoryList] = React.useState([]);
    React.useEffect(() => {
        IndexAPI.getCategory().then((arr) => setCategoryList(arr.data));

    }, [])


    // Constants for Category Modal
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const [imageList, setImageList] = React.useState([]);
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
        if (projectListing.title == '') {
            setErrorTitle(true);
        }
        if (projectListing.description == '') {
            setErrorDescription(true);
        }
        if (Object.keys(projectListing.category).length === 0) {
            setErrorCategory(true);
        }
        if (Number(projectListing.price) <= 0) {
            setErrorPrice(true);
        }
        if (Number(projectListing.timeToCompleteInDays) > 90 || Number(projectListing.timeToCompleteInDays) <= 0) {
            setErrorTimeRequired(true);
        }
    }

    const handleChange = (e) => {
        setProjectListing({ ...projectListing, [e.target.name]: e.target.value })
    };

    const handleImageInput = (e) => {
        if (e.target.files[0]) {
            console.log("FILE")
            console.log(e.target.files[0]);
            let newFile = URL.createObjectURL(e.target.files[0]);
            console.log(newFile);
            let files = Array.from(imageList);
            files.push(e.target.files[0]);
            setImageList(files);
        }
    }

    const handleImageDelete = (index) => {
        let files = Array.from(imageList)
        files.splice(index, 1);
        setImageList(files);
    }

    const openCategoryMenu = (event) => {
        setMenuOpen(true);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setMenuOpen(false);
    };

    const handleSetCategory = (cat) => {
        setProjectListing({ ...projectListing, category: cat })
        setCatId(cat.id);
        handleClose();
    }

    const handleCategoryDelete = () => {
        setProjectListing({ ...projectListing, category: {} });
    };

    const handleNewTag = () => {
        const data = { name: newTag };
        const newArr = Array.from(projectListing.tagList);
        newArr.push(data);
        setProjectListing({ ...projectListing, tagList: newArr });
        setNewTag("");
        setOpenTagModal(false);
    }

    const handleSetNewTag = (e) => {
        e.preventDefault();
        setNewTag(e.target.value);
    }

    const handleDeleteTag = (index) => {
        const newArr = Array.from(projectListing.tagList);
        newArr.splice(index, 1);
        setProjectListing({ ...projectListing, tagList: newArr });

    };

    const handleNewMaterial = () => {
        const data = { name: newMaterial };
        const newArr = Array.from(projectListing.materialList);
        newArr.push(data);
        setProjectListing({ ...projectListing, materialList: newArr });
        setNewMaterial("");
        setOpenMaterialModal(false);
    }

    const handleSetNewMaterial = (e) => {
        e.preventDefault();
        setNewMaterial(e.target.value);
    }

    const handleDeleteMaterial = (index) => {
        const newArr = Array.from(projectListing.materialList);
        newArr.splice(index, 1);
        setProjectListing({ ...projectListing, materialList: newArr });
    };

    const handleSubmit = async (e) => {
        handleError();
        setIsLoading(true);
        if (!(errorTitle || errorDescription || errorCategory || errorPrice || errorTimeRequired)) {
            const projListing = await createProjectListing(catId, projectListing) // (cId, projectListing, files)
        } else {
            setIsLoading(false);
            alert("Error Submitting Form");
        }
    }

    async function createProjectListing(catId, projectListing) {
        console.log('Creating New Project Listing');
        try {
            console.log("Project Listing data");
            console.log(projectListing);
            const formData = new FormData();
            // Project Listing without images.
            projectListing = new Blob([JSON.stringify(projectListing)], {
                type: "application/json",
            });
            formData.append("projectListing", projectListing);

            // Images of project listing stored as files if exist.
            if (imageList) {
                for (let img of imageList) {
                    console.log("IMG: ", img)
                    formData.append("files", img);
                }
            }
            // Submit formData to API
            console.log("Form data below");
            // console.log(formData.get("projectListing"));
            const res = await IndexAPI.apiWrapper(UserAPI.createProjectListing(catId, formData), "", true);
            if (res) {
                setIsLoading(false);
                dispatch(showFeedback('New Listing Created'));
                setTimeout(function () {
                    navigate(`/listing/${res.data.id}`);
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


    return (
        <Container>
            <Button onClick={() => { navigate(-1) }}>
                <ArrowBackIcon fontSize='large' color='secondary' />
            </Button>
            <Box>
                <FormControl sx={{ width: '100%' }}>
                    <Box>
                    <Typography variant='h6' gutterBottom>Photo</Typography>
                    </Box>
                    <Box sx={{ overflowX: 'scroll', display: 'flex' }}>
                        <Box sx={{ display: 'flex', marginBottom: 1 }}>
                            <input
                                accept="image/*"
                                hidden
                                id="add-image"
                                type="file"
                                onChange={handleImageInput}
                            />
                        </Box>

                        <label htmlFor='add-image'>
                            <img src={AddImage} style={{ maxWidth: 150, minWidth: 150, maxHeight: 150, minHeight: 150, cursor: 'pointer' }} alt='add' />
                        </label>
                        <ImageList className={styles.imageList} cols={2.5}>
                            {imageList.length > 0 &&
                                Array.from(imageList).map((image, index) =>
                                    <ImageListItem key={index} style={{ maxWidth: 150, minWidth: 150, maxHeight: 150, minHeight: 150, overflow: 'hidden', marginLeft: 7 }} >
                                        <img src={URL.createObjectURL(image)} loading="lazy" style={{ cursor: 'pointer' }} alt='' />
                                        <ImageListItemBar position="top" sx={{ background: 'none', color: 'black' }}
                                            actionIcon={
                                                <IconButton onClick={() => handleImageDelete(index)}>
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
                        style={{ width: '100%' }}
                        name="title"
                        value={projectListing.title}
                        color="secondary"
                        onChange={handleChange}
                        error={errorTitle}
                        helperText={errorTitle && helperText.title}
                    />


                    <Typography variant='h6'>Description</Typography>
                    <TextField
                        margin="normal"
                        required
                        multiline
                        style={{ width: '100%' }}
                        name="description"
                        value={projectListing.description}
                        color="secondary"
                        onChange={handleChange}
                        error={errorDescription}
                        helperText={errorDescription && helperText.description}
                    />

                    <Typography variant='h6'>Category</Typography>
                    <Grid item xs='auto'>
                        {projectListing.category.categoryName && <Chip
                            label={projectListing.category.categoryName}
                            key={projectListing.category.id}
                            onDelete={handleCategoryDelete}
                            style={{
                                background: "#FB7A56",
                                fontWeight: "bold",
                                color: "white",
                                padding: "2.5vh 1.5vw",
                                margin: "0.5em 0.3em 0",
                                borderRadius: "3vh",
                            }}
                        />}
                        {!projectListing.category.categoryName && <Button onClick={openCategoryMenu}>
                            <AddCircleOutlineIcon color='secondary' fontSize='large' />
                        </Button>}
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
                        {projectListing.materialList.length > 0 &&
                            Array.from(projectListing.materialList).map((material, index) =>
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
                        {projectListing.tagList.length > 0 &&
                            Array.from(projectListing.tagList).map((tag, index) =>
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
                    <Typography variant='h6'>Estimated Price</Typography>
                    <TextField
                        margin="normal"
                        required
                        style={{ width: '100%' }}
                        name="price"
                        value={projectListing.price}
                        color="secondary"
                        onChange={handleChange}
                        error={errorPrice}
                        helperText={errorPrice && helperText.price}
                    />

                    <Typography variant='h6'>Time Required to Complete</Typography>
                    <TextField
                        margin="normal"
                        required
                        style={{ width: '100%' }}
                        name="timeToCompleteInDays"
                        value={projectListing.timeToCompleteInDays}
                        color="secondary"
                        onChange={handleChange}
                        error={errorTimeRequired}
                        helperText={errorTimeRequired && helperText.timeRequired}
                    />
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <CustomButton
                                variant="contained"
                                //style={{ position: 'relative', backgroundColor: "#CFD1D8", color: "white", textTransform: "none" }}
                                fullWidth
                                onClick={() => { navigate("/userprofile") }}
                                sx={{ minHeight: '50px' }}
                            >
                                <Typography>Cancel</Typography>
                            </CustomButton>

                        </Grid>
                        <Grid item xs={6}>
                            <CustomButton
                                variant="contained"
                                fullWidth
                                color='secondary'
                                sx={{ minHeight: '50px' }}
                                disabled={(errorTitle || errorDescription || errorCategory || errorPrice || errorTimeRequired || imageList.length <= 0) ? true : false}
                                style={(errorTitle || errorDescription || errorCategory || errorPrice || errorTimeRequired || imageList.length <= 0) ? invalidButtonStyle : validButtonStyle}
                                onClick={handleSubmit}
                            >
                                <Typography>Create</Typography>
                            </CustomButton>
                        </Grid>
                    </Grid>
                </FormControl>
            </Box>

            <Modal
                open={openTagModal}
                onClose={() => setOpenTagModal(false)}
            >
                <Box className={styles.modalBox}>
                    <div style={{ overflowWrap: 'break-word' }}>
                        Enter New Product Tags
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
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <CustomButton
                            variant="contained"
                            onClick={() => setOpenTagModal(false)}
                            sx={{ textTransform: "none", mr: 1, backgroundColor: 'primary' }}
                        >
                            Cancel
                        </CustomButton>
                        <CustomButton
                            variant="contained"
                            id='newTag'
                            color='secondary'
                            value={newTag}
                            onClick={handleNewTag}
                            sx={{ textTransform: "none" }}
                        >
                            Save
                        </CustomButton>
                    </Box>
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
                        color='secondary'
                        onChange={handleSetNewMaterial}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <CustomButton
                            variant="contained"
                            onClick={() => setOpenMaterialModal(false)}
                            sx={{ textTransform: 'none', backgroundColor: 'primary', mr: 1 }}
                        >
                            Cancel
                        </CustomButton>
                        <CustomButton
                            variant="contained"
                            color='secondary'
                            id='newMaterial'
                            value={newMaterial}
                            onClick={handleNewMaterial}
                            sx={{ textTransform: 'none' }}
                        >
                            Save
                        </CustomButton>
                    </Box>
                </Box>
            </Modal>
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
        </Container>
    )
}
