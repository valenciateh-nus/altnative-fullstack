import React, { useCallback } from 'react'
import { Button, Container, Typography, TextField, Modal, Box, SvgIcon, useMediaQuery, Avatar } from '@mui/material'
import { makeStyles } from "@mui/styles";
import { Link } from 'react-router-dom';
import MuiPhoneNumber from 'material-ui-phone-number';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

// API
import { useDispatch, useSelector } from 'react-redux';
import { ERROR } from "../../Redux/actionTypes";
import { showFeedback } from '../../Redux/actions';
import * as UserAPI from '../../API/userApi';
import CustomButton from '../../Components/CustomButton';

const useStyles = makeStyles((theme) => ({
    modalBox: {
        width: '30%',
        minHeight: '10em',
        background: 'white',
        padding: "2em",
        borderRadius: '1em',
        border: '0.1em solid #FB7A56',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    mobileModalBox: {
        width: '80%',
        minHeight: '10em',
        background: 'white',
        padding: "2em",
        borderRadius: '1em',
        border: '0.1em solid #FB7A56',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    profilePicContainer: {
        position: 'relative',
        width: '200px',
        height: '200px',
        background: '#333',
    },
    buttons: {
        width: '100%',
        border: '0.1em solid #CFD1D8',
        textTransform: "none",
        display: 'flex',
        background: '#FFFAF0',
    }
}));

// Insert API to retrieve userProfile information.
const dummyProfile = {
    username: '1',
    name: 'Jane Doe',
    phoneNumber: '+6598765432',
    address: 'Blk 123 Clementi Road #10-29 Singapore 123123',
    avatar: null,
}

export default function EditProfile() {
    const isDesktop = useMediaQuery(theme => theme.breakpoints.up('md'));
    const deliveryFormStyle = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: "primary.veryLight", width: '450px', maxWidth: `${isDesktop ? '450px' : '350px'}`, height: '550px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '16px', flexDirection: 'column' }
    const styles = useStyles();
    const dispatch = useDispatch();
    const [userProfile, setUserProfile] = React.useState([]);

    // Retrive currentUser username from Redux
    const currentUser = useSelector((state) => state.currUserData);
    const id = currentUser.id;

    const [deliveryForm, setDeliveryForm] = React.useState({ addrOne: "", addrTwo: "", city: "", postalCode: "" });

    React.useEffect(() => {
        if (id) {
            UserAPI.getUserById(id).then((val) => {
                setUserProfile(val.data);
                setForm({...form,
                ['newName']: val.data.name,
                ['newPhoneNumber']: val.data.phoneNumber,
                })
                const addr = val.data.address.split('|');
                setDeliveryForm({...deliveryForm,
                    ['addrOne']: addr[0],
                    ['addrTwo']: addr[1],
                    ['city']: addr[2],
                    ['postalCode']: addr[3]
                })
            });
        }
    }, [])

    const [form, setForm] = React.useState({ newName: '', newPhoneNumber: '', address: '' });

    const handleDeliveryFormChange = (e) => {
        setDeliveryForm({ ...deliveryForm, [e.target.name]: e.target.value })
    };


    // Modals
    const [openNameModal, setOpenNameModal] = React.useState(false);
    const [openPhoneModal, setOpenPhoneModal] = React.useState(false);
    const [openAddressModal, setOpenAddressModal] = React.useState(false);

    const handleFormChange = (e) => {
        console.log(e.target.name + " changed to " + e.target.value);
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Choose a file to upload and open a model to crop image.
    const onFileChange = async (event) => {
        if (event.target.files && event.target.files.length > 0) {
            setUserProfile({ ...userProfile, avatar: event.target.files[0] });
            updateAvatar(event.target.files[0]);
        }

    }

    async function updateAvatar(avatar) {
        console.log('updating avatar of user');
        console.log(avatar);
        try {
            const formData = new FormData();
            formData.append("file", avatar);
            const res = await UserAPI.updateAvatar(formData);
            if (res) {
                dispatch(showFeedback('Avatar updated'));
            }
        } catch (error) {
            const data = error?.response?.data?.message
            console.log("ERROR MSG: " + JSON.stringify(error));
            dispatch({ type: ERROR, data })
        }
    }

    async function updateName(username, newName) {
        try {
            const res = await UserAPI.updateName(username, newName);
            if (res) {
                dispatch(showFeedback('Name updated'));
            }
        } catch (error) {
            const data = error?.response?.data?.message
            console.log("ERROR MSG: " + JSON.stringify(error));
            dispatch({ type: ERROR, data })
        }
    }

    const handleChangeName = async () => {
        await updateName(userProfile.username, form.newName);
        setUserProfile({ ...userProfile, name: form.newName });
        setOpenNameModal(false);
    }

    async function updateNumber(username, newPhoneNumber) {
        try {
            const res = await UserAPI.updateNumber(username, newPhoneNumber);
            if (res) {
                dispatch(showFeedback('Phone number updated'));
            }
        } catch (error) {
            const data = error?.response?.data?.message
            console.log("ERROR MSG: " + JSON.stringify(error));
            dispatch({ type: ERROR, data })
        }
    }

    const handleChangeNumber = async () => {
        // Insert the API to change the User's Number.
        await updateNumber(userProfile.username, form.newPhoneNumber);
        setUserProfile({ ...userProfile, phoneNumber: form.newPhoneNumber });

        setOpenPhoneModal(false);
    }


    async function updateAddress(username, address) {
        try {
            const res = await UserAPI.updateAddress(username, address);
            if (res) {
                dispatch(showFeedback('Address updated'));
            }
        } catch (error) {
            const data = error?.response?.data?.message
            console.log("ERROR MSG: " + JSON.stringify(error));
            dispatch({ type: ERROR, data })
        }
    }

    const handleChangeAddress = async () => {
        const deliveryAddress = deliveryForm.addrOne + "|" + deliveryForm.addrTwo + "|" + deliveryForm.city + "|" + deliveryForm.postalCode;
        await updateAddress(userProfile.username, deliveryAddress);
        setUserProfile({ ...userProfile, address: deliveryAddress });
        setOpenAddressModal(false);
    }

    return (
        <Container>
            <Link to="/profile">
                <SvgIcon
                    fontSize="large"
                    color="action"
                >
                    <ArrowBackIcon />
                </SvgIcon>
            </Link>
            <Box>
                <Typography variant='h5' style={{ fontWeight: 'bold' }}>Personal Details</Typography>
                <Typography variant='subtitle1' gutterBottom>Profile Picture</Typography>
                <Box sx={{
                    width: 150,
                    height: 150,
                    border: 1,
                    bgcolor: '#FFFAF0',
                    borderRadius: '1em',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                >
                    {userProfile.avatar ? (
                        <label htmlFor='profile-photo-upload'>
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                id="profile-photo-upload"
                                onChange={onFileChange}
                            />
                            <Avatar sx={{ height: '125px', width: '125px' }} src={userProfile.avatar instanceof File ? URL.createObjectURL(userProfile.avatar) : userProfile.avatar.url} alt="profile" />
                        </label>


                    ) : (
                        <label htmlFor='profile-photo-upload'>
                            <input
                                accept="image/*"
                                hidden
                                id="profile-photo-upload"
                                type="file"
                                onChange={onFileChange}
                            />
                            <AccountCircleIcon color='secondary' style={{ fontSize: 100 }} />
                        </label>
                    )}
                </Box>


                <Typography variant='subtitle1' gutterBottom>Your Name*</Typography>
                <Button className={styles.buttons}
                    onClick={() => setOpenNameModal(true)}
                    variant="outlined"
                    margin="normal"
                >
                    <Typography variant='subtitle1' style={{ color: 'black' }}>
                        {userProfile.name}
                    </Typography>
                </Button>

                <Typography variant='subtitle1' gutterBottom>Phone Number*</Typography>
                <Button className={styles.buttons}
                    onClick={() => setOpenPhoneModal(true)}
                    variant="outlined"
                    margin="normal"
                >
                    <Typography variant='subtitle1' style={{ color: 'black' }}>
                        {userProfile.phoneNumber}
                    </Typography>

                </Button>

                <Typography variant='subtitle1' gutterBottom>Address for courier pickup/delivery</Typography>
                <Button className={styles.buttons}
                    onClick={() => setOpenAddressModal(true)}
                    variant="outlined"
                    margin="normal"
                >   {userProfile.address ?
                    (
                        <Typography variant='subtitle1' style={{ color: 'black' }}>
                            {userProfile.address.replaceAll("|", " ")}
                        </Typography>
                    ) : (
                        <Typography variant='subtitle1' style={{ color: 'black' }}>
                            No Address
                        </Typography>
                    )}

                </Button>

            </Box>
            <Modal
                open={openNameModal}
                onClose={() => setOpenNameModal(false)}
            >
                <Box className={isDesktop ? styles.modalBox : styles.mobileModalBox}>
                    <Typography>
                        Edit Your Name
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        required
                        margin="normal"
                        sx={{ background: '#FFFAF0' }}
                        name="newName"
                        label="New Name"
                        value={form.newName}
                        onChange={handleFormChange}
                    />
                    <Button
                        variant="contained"
                        onClick={handleChangeName}
                        style={{ float: 'right', bottom: '1', position: 'relative', textTransform: 'none', background: '#FB7A56' }}
                    >
                        <Typography>Save</Typography>
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => setOpenNameModal(false)}
                        style={{ float: 'right', bottom: '0', position: 'relative', textTransform: 'none' }}
                    >
                        <Typography>Cancel</Typography>
                    </Button>

                </Box>

            </Modal>
            <Modal
                open={openPhoneModal}
                onClose={() => setOpenPhoneModal(false)}
            >
                <Box className={isDesktop ? styles.modalBox : styles.mobileModalBox}>
                    <Typography>
                        Edit Your Phone Number
                    </Typography>
                    <MuiPhoneNumber
                        defaultCountry='sg'
                        margin='normal'
                        sx={{ background: '#FFFAF0' }}
                        required
                        fullWidth
                        type='tel'
                        variant='outlined'
                        name='newPhoneNumber'
                        label='Phone Number'
                        value={form.newPhoneNumber}
                        onChange={(e) => setForm({ ...form, "newPhoneNumber": e })}
                    />
                    <Button
                        variant="contained"
                        onClick={handleChangeNumber}
                        style={{ float: 'right', bottom: '0', position: 'relative', textTransform: 'none', background: '#FB7A56' }}
                    >
                        <Typography>Save</Typography>
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => setOpenPhoneModal(false)}
                        style={{ float: 'right', bottom: '0', position: 'relative', textTransform: 'none' }}
                    >
                        <Typography>Cancel</Typography>
                    </Button>

                </Box>
            </Modal>
            <Modal open={openAddressModal} onClose={() => setOpenAddressModal(false)}>
                <Box sx={deliveryFormStyle} >
                    <Typography gutterBottom variant="h6">Address</Typography>
                    <Box component="form"
                        sx={{ minWidth: "300px", maxWidth: `${isDesktop ? '350px' : '300px'}`, "& input:-internal-autofill-selected": { "WebkitBoxShadow": "0 0 0px 1000px #FED279 inset" } }}
                        onSubmit={handleChangeAddress}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="Addr1"
                            label="Address Line 1"
                            name="addrOne"
                            autoComplete="shipping street-address"
                            autoFocus
                            color="secondary"
                            onChange={handleDeliveryFormChange}
                            value={deliveryForm.addrOne}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="Addr2"
                            label="Address Line 2"
                            name="addrTwo"
                            autoComplete="shipping address-level2"
                            color="secondary"
                            onChange={handleDeliveryFormChange}
                            value={deliveryForm.addrTwo}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="postalCode"
                            label="Postal Code"
                            name="postalCode"
                            autoComplete="shipping postal-code"
                            color="secondary"
                            type='number'
                            onChange={handleDeliveryFormChange}
                            value={deliveryForm.postalCode}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="city"
                            label="City"
                            name="city"
                            autoComplete="shipping city"
                            color="secondary"
                            onChange={handleDeliveryFormChange}
                            value={deliveryForm.city}
                        />
                        <CustomButton variant='contained' color="secondary"
                            type="submit"
                            fullWidth
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Confirm
                        </CustomButton>
                    </Box>
                </Box>
            </Modal>
        </Container>
    )




}