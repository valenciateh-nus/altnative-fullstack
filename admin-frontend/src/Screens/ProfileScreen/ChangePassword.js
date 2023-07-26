import React from 'react';
import { Container, Button, Typography, TextField, SvgIcon, IconButton, InputAdornment } from '@mui/material';
import { Link } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityOnIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

// API
import { useDispatch, useSelector } from 'react-redux';
import { ERROR } from "../../Redux/actionTypes";
import * as UserAPI from '../../API/userApi';
import { showFeedback } from '../../Redux/actions';
import CustomButton from '../../Components/CustomButton';

const initForm = { currentPassword: '', newPassword: '', retypePassword: '' };

const invalidButtonStyle = {
    background: "#CFD1D8",
    textTransform: 'none',
    color: 'white',
    width: '100%',
    marginTop: '5vh',
};

const validButtonStyle = {
    background: "#6320EE",
    textTransform: 'none',
    color: 'white',
    width: '100%',
    marginTop: '5vh',
};

export default function ChangePassword() {

    const dispatch = useDispatch();
    const currUser = useSelector((state) => state.authData);
    const username = currUser.sub;

    const [form, setForm] = React.useState(initForm);
    const [showPassword, setShowPassword] = React.useState(false);

    React.useEffect(() =>{
        handleError();
    }, [form])

    // Constants for Error
    const [errorCurrentPassword, setErrorCurrentPassword] = React.useState(false);
    const [errorNewPassword, setErrorNewPassword] = React.useState(false);
    const [errorRetypePassword, setErrorRetypePassword] = React.useState(false);
    const helperText = {
        currentPassword: "Unrecognized password",
        newPassword: "Password must contain a minimum of 8 characters",
        retypePassword: "Passwords do not match",
    }

    const handleError = () => {
        // Reset Error Status
        setErrorCurrentPassword(false);
        setErrorNewPassword(false);
        setErrorRetypePassword(false);
        // Form Validation
        if (form.currentPassword == '') {
            setErrorCurrentPassword(true);
        }
        if (form.newPassword.length < 8) {
            setErrorNewPassword(true);
        }
        if (form.newPassword !== form.retypePassword) {
            setErrorRetypePassword(true);
        }
    }


    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleFormChange = (e) => {
        console.log(e.target.name + " changed to " +  e.target.value);
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    async function changePassword(username, passwords) {
        console.log('updating name of user');
        try {
            const res = await UserAPI.changePassword(username, passwords);
            if(res) {
                dispatch(showFeedback('Password successfuly changed'));
            }
        } catch (error) {
            setErrorCurrentPassword(true);
            const data = error?.response?.data?.message
            console.log("ERROR MSG: " + JSON.stringify(error));
            dispatch({ type: ERROR, data })
        }
    }

    const handleSubmit = async () => {

        // Insert the API to change the user password
        const passwords = [form.currentPassword, form.newPassword];
        await changePassword(username, passwords);
        
    }

    return (
        <Container>
            <Link to="/profile">
                <SvgIcon
                    fontSize="large"
                    color="action"
                    sx={{cursor : 'pointer'}}
                >
                    <ArrowBackIcon />
                </SvgIcon>
            </Link>
            <form>
                <Typography variant='h5' style={{ fontWeight: 'bold' }} gutterBottom>Change Password</Typography>
                <Typography variant='subtitle1'>Current Password</Typography>
                <TextField
                    margin="normal"
                    sx={{ background: '#FFFAF0' }}
                    fullWidth
                    required
                    id="currentPassword"
                    label="Current Password"
                    name="currentPassword"
                    color="secondary"
                    type={showPassword ? 'text' : 'password'}
                    error={errorCurrentPassword}
                    helperText={errorCurrentPassword && helperText.currentPassword}
                    onChange={handleFormChange}
                    value={form.currentPassword}
                    InputProps={{
                        endAdornment:
                            <IconButton onClick={handleClickShowPassword} edge="end">
                                {showPassword ? <VisibilityOnIcon /> : <VisibilityOffIcon />}
                            </IconButton>,
                    }}
                >

                </TextField>
                <Typography variant='subtitle1'>New Password</Typography>
                <TextField
                    margin="normal"
                    sx={{ background: '#FFFAF0' }}
                    fullWidth
                    required
                    id="newPassword"
                    label="New Password"
                    name="newPassword"
                    color="secondary"
                    type={showPassword ? 'text' : 'password'}
                    error={errorNewPassword}
                    helperText={errorNewPassword && helperText.newPassword}
                    onChange={handleFormChange}
                    value={form.newPassword}
                    InputProps={{
                        endAdornment:
                            <IconButton onClick={handleClickShowPassword} edge="end">
                                {showPassword ? <VisibilityOnIcon /> : <VisibilityOffIcon />}
                            </IconButton>,
                    }}
                >

                </TextField>
                <Typography variant='subtitle1'>Re-enter New Password</Typography>
                <TextField
                    margin="normal"
                    sx={{ background: '#FFFAF0' }}
                    fullWidth
                    required
                    id="retypePassword"
                    label="Re-enter New Password"
                    name="retypePassword"
                    type={showPassword ? 'text' : 'password'}
                    value={form.retypePassword}
                    error={errorRetypePassword}
                    helperText={errorRetypePassword && helperText.retypePassword}
                    onChange={handleFormChange}
                    InputProps={{
                        endAdornment:
                            <IconButton onClick={handleClickShowPassword} edge="end">
                                {showPassword ? <VisibilityOnIcon /> : <VisibilityOffIcon />}
                            </IconButton>,
                    }}

                />


                <CustomButton
                    variant="contained"
                    disabled={ (errorCurrentPassword || errorNewPassword || errorRetypePassword || form.currentPassword === form.newPassword )  ? true : false }
                    style={ (errorCurrentPassword || errorNewPassword || errorRetypePassword || form.currentPassword === form.newPassword) ? invalidButtonStyle : validButtonStyle }
                    onClick={handleSubmit}
                >Save</CustomButton>
                {form.currentPassword === form.newPassword && <Typography color='red' variant='caption'>
                    New password cannot be the same as old password.
                </Typography>}
                
            </form>
        </Container>
    )
}