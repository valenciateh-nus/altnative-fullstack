import * as React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { IconButton, InputAdornment, useMediaQuery } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, signIn } from '../Redux/actions'
import CustomButton from '../Components/CustomButton';
import LoadingModal from '../Components/LoadingModal';


const initForm = { name : '', phoneNumber : '', email : '', password : ''}

export default function LoginScreen() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [form, setForm] = React.useState(initForm)
  const token = useSelector((state) => state.token)
  const currUserData = useSelector((state) => state.currUserData);
  const authData = useSelector((state) => state.authData);
  const error = useSelector((state) => state.error);
  const[isLoading, setIsLoading] = React.useState(false);

  const selectedView = useSelector((state) => state.view)

  const dispatch = useDispatch();
  const history = useNavigate();

  React.useEffect(() => {
    if(token && authData) {
      console.log("getting user");
      dispatch(getUserProfile(authData.sub));
    }
    if(token && currUserData) {
      history("/dashboard");
    }
  },[token, authData, currUserData])

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("GETS HERE?")
    setIsLoading(true);
    console.log("GETS HERE");
    let data = {
      username: form.email,
      password: form.password,
    }
    console.log("SIGININ DATA:" + data);
    dispatch(signIn(data, history))
    setIsLoading(false);
  };

  function isValidEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
      return true
    }
      return false
  }

  const handleShowPassword = () => setShowPassword(!showPassword);


  return (<>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop : 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Sign In
          </Typography>
          <Box component="form" onSubmit = {handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              type="email"
              id="email"
              label="Email address"
              name="email"
              autoComplete="email"
              autoFocus
              color="secondary"
              onChange= {handleFormChange}
              value= {form.email}
              error={!(isValidEmail(form.email) && form.email.length > 0)}
              helperText={(isValidEmail(form.email) && form.email.length > 0) ? '' : 'Email is invalid'}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type = {showPassword ? 'text' : 'password'} value = {form.password} 
              id="password"
              autoComplete="current-password"
              onChange={handleFormChange}
              color="secondary"
              InputProps={{
                endAdornment:
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
              }}
            />
            <CustomButton variant='contained' color="secondary"
              type="submit"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
              disabled={(!isValidEmail(form.email))}
            >
              Sign In
            </CustomButton>
          </Box>
        </Box>
      </Container>
    </>
  );
}