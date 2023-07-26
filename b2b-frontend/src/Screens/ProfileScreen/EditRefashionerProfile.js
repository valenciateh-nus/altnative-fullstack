import { Container, Box, SvgIcon, Typography, Button, Divider, TextField, Chip, Grid, Modal, RadioGroup, FormControlLabel, Radio, FormControl, FormHelperText, ImageList, ImageListItem, ImageListItemBar, IconButton } from '@mui/material'
import React from 'react'
import { makeStyles } from "@mui/styles";
import { Link, useNavigate } from 'react-router-dom';

import ProfileCard from '../../Components/ProfileCard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
// API
import * as UserAPI from '../../API/userApi';
import { useDispatch, useSelector } from 'react-redux';
import { showFeedback } from '../../Redux/actions';
import { ERROR } from "../../Redux/actionTypes";

const invalidButtonStyle = {
    background: "#CFD1D8",
    textTransform: 'none',
    color: 'white',
};

const validButtonStyle = {
    background: "#FB7A56",
    textTransform: 'none',
    color: 'white',
};

const useStyles = makeStyles((theme) => ({
    box: {
        marginTop: '3vh',
        marginBottom: '3vh',
    },
    modalBox: {
        width: '100%',
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
        display: 'flex',
        flexDirection: 'row',
        overflow: 'scroll',
    }
}));


export default function EditRefashionerProfile() {
    let navigate = useNavigate();
    let dispatch = useDispatch();
    let styles = useStyles();
    const currentUser = useSelector(state => state.currUserData);

    const [refashionerDesc, setRefashionerDesc] = React.useState(currentUser.refashionerDesc);
    const [expertises, setExpertises] = React.useState(currentUser.expertises);
    const [newExpertise, setNewExpertise] = React.useState({ name: '', experienceLevel: '' });
    const [approvedCertifications, setApprovedCertifications] = React.useState(currentUser.approvedCertifications);
    const [newCertification, setNewCertification] = React.useState(null); // From the Modal
    const [finalCertifications, setFinalCertifications] = React.useState([]);  // In the edit page
    const [certificateName, setCertificateName] = React.useState("");

    // Modals
    const [openExpertiseModal, setOpenExpertiseModal] = React.useState(false);
    const [openCertificationModal, setOpenCertificationModal] = React.useState(false);

    // Errors
    const [errorExpertiseName, setErrorExpertiseName] = React.useState(false);
    const [errorExpertiseExp, setErrorExpertiseExp] = React.useState(false);
    const [errorCertificationName, setErrorCertificationName] = React.useState(false);

    const expertiseHelperText = {
        name: "Expertise Name field is Required",
        experienceLevel: "Experience Level field is required",
    }

    const certificationHelperText = {
        name: "Certification Name field is Required",
        image: "An Image is Required"
    }


    React.useEffect(() => {
        console.log("newCertification changed");
    }, [newCertification])


    const handleErrorExpertise = () => {
        // Reset Errors
        setErrorExpertiseName(false);
        setErrorExpertiseExp(false);
        console.log(newExpertise);
        if (newExpertise.name == '') {

            setErrorExpertiseName(true);
        }
        if (newExpertise.experienceLevel == '') {
            console.log("error exp");
            setErrorExpertiseExp(true);
        }
    }

    const handleErrorCertification = () => {
        // Reset Errors
        setErrorCertificationName(false);
        console.log(certificateName);
        if (certificateName == '') {

            setErrorCertificationName(true);
        }
    }

    React.useEffect(() => {
        handleErrorExpertise();
    }, [newExpertise])

    React.useEffect(() => {
        handleErrorCertification();
    }, [certificateName])

    // Functions
    const handleChangeRefashionerDesc = (e) => {
        console.log("change of " + e.target.name + " to " + e.target.value);
        setRefashionerDesc(e.target.value);
    }

    const handleChangeExpertise = (e) => {
        console.log("change of " + e.target.name + " to " + e.target.value);
        setNewExpertise({ ...newExpertise, [e.target.name]: e.target.value });
    }

    const handleChangeCertificateName = (e) => {
        console.log("change of " + e.target.name + " to " + e.target.value);
        setCertificateName(e.target.value);
    }

    const handleAddExpertise = () => {
        const newArr = Array.from(expertises);
        newArr.push(newExpertise);
        setExpertises(newArr);
        setNewExpertise({ name: '', experienceLevel: '' }); // Reset New Expertise
        setOpenExpertiseModal(false);
        console.log("NEW ARR");
        console.log(newArr);
    }

    const handleDeleteExpertise = (index) => {
        const newArr = Array.from(expertises);
        newArr.splice(index, 1);
        setExpertises(newArr);
    }

    const onFileChange = async (event) => {
        if (event.target.files && event.target.files.length > 0) {
            setNewCertification(event.target.files[0]);
            console.log("new certification set");
            console.log(event.target.files[0]);
        }
    }

    const handleAddCertification = () => {
        console.log("handleAddCertification");
        console.log(newCertification);
        const  blob = newCertification.slice(0, newCertification.size, 'image/png');
        const newFile = new File([blob], `${certificateName}`, {type: 'image/png'}); 

        console.log(newFile);
        const newArr = Array.from(finalCertifications);
        newArr.push(newFile);
        setFinalCertifications(newArr);
        setNewCertification(null); // Reset Modal Images
        setOpenCertificationModal(false);
    }


    const handleDeleteFinalCertification = (index) => {
        let files = Array.from(finalCertifications)
        files.splice(index, 1);
        setFinalCertifications(files);
    }


    const handleSubmit = async () => {
        console.log("HANDLE SUBMIT");
        // Updating Refashioner Description
        const res1 = await updateRefashionerDesc(refashionerDesc);
        // Adding Expertise in expertises

        console.log(expertises);
        const res2 = await updateListOfExperiences(expertises);

        console.log(finalCertifications);
        if (finalCertifications.length > 0) {
            for (let cert of finalCertifications) {
                let certData = new FormData();
                certData.append('file', cert);
                console.log("adding cert to request");
                console.log(cert);
                const resCert = await UserAPI.addCertification(certData);
                console.log("response for addCert");
                console.log(resCert);
            }
        }

        console.log("RES1: ", res1);
        console.log("RES2: ", res2);
        if (res1 && res2) {
            dispatch(showFeedback("Succesfully updated your refashioner profile"));
        }

    }


    const updateRefashionerDesc = async (refashionerDesc) => {
        try {
            return await UserAPI.updateRefashionerDesc(refashionerDesc);
        } catch (error) {
            const data = error?.response?.data?.message
            console.log("ERROR MSG: " + JSON.stringify(error));
            dispatch({ type: ERROR, data })
        }
    }

    const updateListOfExperiences = async (expertiseList) => {
        try {
            console.log("EXPERTISELIST: ", expertiseList);
            const res = await UserAPI.updateExperience(expertiseList);
            setExpertises(res.data);
            return res;
        } catch (error) {
            const data = error?.response?.data?.message
            console.log("ERROR MSG: " + JSON.stringify(error));
            dispatch({ type: ERROR, data })
        }
    }
    /*
    const addExpertise = async (expertise) => {
        try {
            await UserAPI.addExpertise(expertise);
        } catch (error) {
            const data = error?.response?.data?.message
            console.log("ERROR MSG: " + JSON.stringify(error));
            dispatch({ type: ERROR, data })
        }
    } */

    return (
        <Container>
            <Link to="/userprofile">
                <SvgIcon
                    fontSize="large"
                    color="action"
                    sx={{cursor : 'pointer'}}
                >
                    <ArrowBackIcon />
                </SvgIcon>
            </Link>
            <ProfileCard user={currentUser} />
            <form>
                <Box className={styles.box}>
                    <Typography variant='h6'>About the refashioner</Typography>
                    <TextField
                        fullWidth
                        multiline
                        sx={{ background: '#FFFAF0' }}
                        name="refashionerDesc"
                        value={refashionerDesc}
                        onChange={handleChangeRefashionerDesc}
                    />
                </Box>
                <Typography variant='h6'>Expertises</Typography>
                <Grid container alignItems="flex-end">
                    {Array.from(expertises).map((exp, index) =>
                        <Chip
                            label={exp.name}
                            key={exp.name}
                            onDelete={() => handleDeleteExpertise(index)}
                            style={{
                                background: "#FB7A56",
                                fontWeight: "bold",
                                color: "white",
                                padding: "2.5vh 1.5vw",
                                margin: "0.5em 0.3em 0",
                                borderRadius: "3vh",
                            }}
                        />
                    )}
                    <Grid item xs='auto'>
                        <Button onClick={() => setOpenExpertiseModal(true)}>
                            <AddCircleOutlineIcon color='secondary' fontSize='large' />
                        </Button>
                    </Grid>
                </Grid>
                <Box className={styles.box}>
                    <Typography variant='h6'>Certifications</Typography>
                    {Array.from(approvedCertifications).map((certification) =>
                        <TextField
                            fullWidth
                            multiline
                            sx={{ background: '#FFFAF0' }}
                            name={certification}
                            value={certification}
                        />
                    )}
                </Box>

                {finalCertifications.length > 0 &&
                    <Typography variant='h6'>New Certifcations</Typography>
                }
                {finalCertifications.length > 0 &&
                    <ImageList className={styles.imageList} cols={2.5}>
                        {Array.from(finalCertifications).map((image, index) =>
                            <ImageListItem key={index} style={{ width: 200, height: 200, overflow: 'hidden', marginLeft: 7 }} >
                                <img src={URL.createObjectURL(image)} loading="lazy" style={{ cursor: 'pointer' }} alt='' />
                                <ImageListItemBar                        
                                    position="top"
                                    sx={{ background: 'none', color: 'black' }}
                                    actionIcon={
                                        <IconButton onClick={handleDeleteFinalCertification}>
                                            <CancelIcon />
                                        </IconButton>
                                    } />
                                <ImageListItemBar
                                    title={image.name}
                                    position="below"
                                />
                            </ImageListItem>
                        )}
                    </ImageList>
                }

                <Box className={styles.box}>

                    <Button
                        variant="contained"
                        fullWidth
                        style={{ position: 'relative', textTransform: "none", background: "#FB7A56", color: "white" }}
                        onClick={() => setOpenCertificationModal(true)}
                        size='large'
                    >
                        <Typography>Add New Certification</Typography>
                    </Button>

                </Box>

                <Box className={styles.box}>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Button
                                variant="contained"
                                fullWidth
                                style={{ position: 'relative', textTransform: "none", color: "white" }}
                                onClick={() => navigate("/userprofile")}
                                size='large'
                            >
                                <Typography>Cancel</Typography>
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                variant="contained"
                                fullWidth
                                style={{ position: 'relative', textTransform: "none", background: "#FB7A56", color: "white" }}
                                onClick={handleSubmit}
                                size='large'
                            >
                                <Typography>Save</Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </form>

            <Modal
                open={openExpertiseModal}
                onClose={() => setOpenExpertiseModal(false)}
            >
                <Box className={styles.modalBox}>
                    <Typography variant='h5' gutterBottom>Enter New Expertise Name</Typography>
                    <TextField
                        required
                        fullWidth
                        name="name"
                        label="New Expertise"
                        value={newExpertise.name}
                        onChange={handleChangeExpertise}
                        error={errorExpertiseName}
                        helperText={errorExpertiseName && expertiseHelperText.name}
                    />
                    <Typography variant='h5' gutterBottom>Select Experience Level</Typography>
                    <FormControl error={errorExpertiseExp}>
                        <RadioGroup
                            name="experienceLevel"
                            value={newExpertise.experienceLevel}
                            onChange={handleChangeExpertise}
                        >
                            <FormControlLabel value="BEGINNER" control={<Radio />} label="Beginner" />
                            <FormControlLabel value="INTERMEDIATE" control={<Radio />} label="Intermediate" />
                            <FormControlLabel value="ADVANCED" control={<Radio />} label="Advanced" />
                        </RadioGroup>
                        {errorExpertiseExp &&
                            <FormHelperText>{expertiseHelperText.experienceLevel}</FormHelperText>
                        }
                    </FormControl>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Button
                                variant="contained"
                                fullWidth
                                style={{ position: 'relative', textTransform: "none", color: "white" }}
                                onClick={() => setOpenExpertiseModal(false)}
                                size='large'
                            >
                                <Typography>Cancel</Typography>
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                variant="contained"
                                fullWidth
                                disabled={(errorExpertiseName || errorExpertiseExp) ? true : false}
                                style={(errorExpertiseName || errorExpertiseExp) ? invalidButtonStyle : validButtonStyle}
                                onClick={handleAddExpertise}
                                size='large'
                            >
                                <Typography>Save</Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
            <Modal
                open={openCertificationModal}
                onClose={() => setOpenCertificationModal(false)}
            >
                <Box className={styles.modalBox}>
                    <Typography variant='h6' gutterBottom>Enter Name of Certification</Typography>
                    <TextField
                        required
                        fullWidth
                        multiline
                        name='certificateName'
                        label="Name of Certificate"
                        onChange={handleChangeCertificateName}
                        error={errorCertificationName}
                        helperText={errorCertificationName && certificationHelperText.name}
                    />
                    {newCertification &&
                        <img src={URL.createObjectURL(newCertification)} loading="lazy" style={{ width: 200, height: 200, cursor: 'pointer' }} alt='' />
                    }
                    <Box className={styles.box}>
                        <label htmlFor="certification-upload">
                            <input
                                accept="image/*"
                                hidden
                                id="certification-upload"
                                type="file"
                                onChange={onFileChange}
                            />
                            <Button
                                variant='contained'
                                component="span"
                                fullWidth
                                size='large'
                                style={{ position: 'relative', textTransform: "none", background: "#FB7A56", color: "white", marginBottom: '2vh' }}

                            >
                                <Typography>Upload New Certificate Photo</Typography>
                            </Button>
                        </label>

                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    style={{ position: 'relative', textTransform: "none", color: "white" }}
                                    onClick={() => setOpenCertificationModal(false)}
                                    size='large'
                                >
                                    <Typography>Cancel</Typography>
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    disabled={(errorCertificationName) ? true : false}
                                    style={(errorCertificationName) ? invalidButtonStyle : validButtonStyle}
                                    onClick={handleAddCertification}
                                    size='large'
                                >
                                    <Typography>Save</Typography>
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Modal>
        </Container >
    )
}
