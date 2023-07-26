import { Container, Box, Card, CardContent, SvgIcon, Typography, Button, Divider, TextField, Chip, Grid, Modal, RadioGroup, FormControlLabel, Radio, FormControl, FormHelperText, ImageList, ImageListItem, ImageListItemBar, IconButton, CircularProgress } from '@mui/material'
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
import * as businessApi from '../../API/businessApi';

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


export default function EditBusinessProfile() {
    let navigate = useNavigate();
    let dispatch = useDispatch();
    let styles = useStyles();
    const currentUser = useSelector(state => state.currUserData);

    const [businessDesc, setBusinessDesc] = React.useState(currentUser.description);
    const [businessWebsite, setBusinessWebsite] = React.useState(currentUser.site);
    const [businessContact, setBusinessContact] = React.useState(currentUser.phoneNumber);
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        // Updating Refashioner Description

        const res1 = await updateBusinessDesc(businessDesc);
        const res2 = await updateWebsite(businessWebsite);

        console.log("RES1: ", res1);
        if (res1 && res2) {
            setIsLoading(false);
            dispatch(showFeedback("Succesfully updated your refashioner profile"));
            setTimeout(function () {
              navigate(-1)
          }, 1500);
        } else {
            setIsLoading(false);
        }
    }


    const updateBusinessDesc = async (businessDesc) => {
        try {
            return await businessApi.editDescription(businessDesc);
        } catch (error) {
            const data = error?.response?.data?.message
            console.log("ERROR MSG: " + JSON.stringify(error));
            dispatch({ type: ERROR, data })
        }
    }

    const updateWebsite = async (website) => {
        try {
            return await businessApi.editWebsite(website);
        } catch (error) {
            const data = error?.response?.data?.message
            console.log("ERROR MSG: " + JSON.stringify(error));
            dispatch({ type: ERROR, data })
        }
    }


    const handleChangeBusinessDesc = (e) => {
      setBusinessDesc(e.target.value);
    }

    const handleChangeBusinessWebsite = (e) => {
      setBusinessWebsite(e.target.value);
    }

    const handleChangeBusinessContact = (e) => {
      setBusinessContact(e.target.value);
    }

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
                    <Typography variant='h6'>About us</Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={5}
                        sx={{ background: '#FFFAF0' }}
                        name="businessDesc"
                        value={businessDesc}
                        onChange={handleChangeBusinessDesc}
                    />
                </Box>

                <Box className={styles.box}>
                    <Typography variant='h6'>Website</Typography>
                    <TextField
                        fullWidth
                        sx={{ background: '#FFFAF0' }}
                        name="businessWebsite"
                        value={businessWebsite}
                        onChange={handleChangeBusinessWebsite}
                    />
                </Box>

                <Box className={styles.box}>
                    <Typography variant='h6'>Contact Number</Typography>
                    <TextField
                        fullWidth
                        sx={{ background: '#FFFAF0' }}
                        name="businessContact"
                        value={businessContact}
                        onChange={handleChangeBusinessContact}
                    />
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
        </Container >
    )
}
