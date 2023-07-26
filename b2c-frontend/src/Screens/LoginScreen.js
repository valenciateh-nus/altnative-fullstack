import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import MuiPhoneNumber from 'material-ui-phone-number';
import { Avatar, Card, CardActionArea, CardContent, IconButton, InputAdornment, Modal, useMediaQuery } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { apiWrapper, signUp } from '../API';

import { getUserProfile, signIn, storeNotiToken } from '../Redux/actions'
import CustomButton from '../Components/CustomButton';
import LoadingModal from '../Components/LoadingModal';
import { MARKET_VIEW, REFASHIONER_VIEW, toTitleCase } from '../constants';

import "./tnc.css"

import tncFile from '../assets/tnc.txt'


const initForm = { name : '', phoneNumber : '', email : '', password : ''}

export default function LoginScreen() {
  const [isRegister, setIsRegister] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isTokenFound, setTokenFound] = React.useState(false);           
  const [form, setForm] = React.useState(initForm)
  const [signUpSuccess, setSignUpSucccess] = React.useState(false);
  const [isChecked, setIsChecked] = React.useState(false);
  const [tncModal, setTncModal] = React.useState(false);
  const mobile = !useMediaQuery(theme => theme.breakpoints.up('md'));
  const token = useSelector((state) => state.token)
  const currUserData = useSelector((state) => state.currUserData);
  const authData = useSelector((state) => state.authData);
  const error = useSelector((state) => state.error);
  const[isLoading, setIsLoading] = React.useState(false);

  const[tnc,setTnc] = React.useState();

  const selectedView = useSelector((state) => state.view)

  const dispatch = useDispatch();
  const history = useNavigate();

  fetch(tncFile)
    .then((response) => response.text())
    .then((textContent) => {
      setTnc(textContent);
    });

  React.useEffect(() => {
    if(token && authData) {
      console.log("getting user");
      dispatch(getUserProfile(authData.sub));
    }
    if(token && currUserData) {
      if(selectedView === REFASHIONER_VIEW) {
        history("/refashioner/home");
      } else if (selectedView === MARKET_VIEW) {
        history("/marketplace");
      } else {
        history("/home");
      }
      
    }
  },[token, authData, currUserData])

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  };

  function handleAcceptTnC() {
    setIsChecked(true);
    setTncModal(false);
  }
  function handleDeclineTnC() {
    setIsChecked(false);
    setTncModal(false);
  }

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    if(isRegister) {
      const formData = new FormData(e.currentTarget);
      let data = {
        username: form.email,
        password: form.password,
        name : form.name,
        phoneNumber : formData.get('phoneNumber')
      }
      const res = await apiWrapper(signUp(data), "", true);
      if(res) {
        setSignUpSucccess(true);
      }
     
    } else {
      let data = {
        username: form.email,
        password: form.password,
      }
      dispatch(signIn(data, history))
      
    }
    setIsLoading(false);
  };

  function handleSwitchMode() {
    setForm(initForm);
    setIsRegister(!isRegister);
    setSignUpSucccess(false);
  }

  function isValidEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
      return true
    }
      return false
  }

  function handleWelcome() {

    let data = {
      username: form.email,
      password: form.password,
    }
    dispatch(signIn(data, history))
    dispatch(storeNotiToken(setTokenFound));
  }

  const handleShowPassword = () => setShowPassword(!showPassword);


  return (<>
    {!signUpSuccess ? <>
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
            {!isRegister ? "Sign In" : "Sign Up"}
          </Typography>
          <Box component="form" onSubmit = {handleSubmit} sx={{ mt: 1 }}>
              {isRegister && 
              <>
                <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Enter name"
                name="name"
                type="text"
                autoFocus
                color="secondary"
                onChange= {handleFormChange}
                value = {form.name}
                />
                <MuiPhoneNumber
                    defaultCountry='sg' 
                    margin = "normal"
                    required
                    fullWidth
                    type="tel"
                    variant="outlined"
                    id="phoneNumber"
                    name="phoneNumber"
                    label="Phone Number"
                    color="secondary"
                />
              </>}
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
            {isRegister && <>
            <FormControlLabel
              sx={{pointerEvents : 'none'}}
              control={<Checkbox color="secondary" required onClick={() => setTncModal(true)} sx={{pointerEvents : 'auto'}}/>}
              label={<Box sx={{cursor : 'pointer', pointerEvents : 'stroke'}}><Typography sx={{textDecoration:'underline'}}>I agree to the terms and conditions</Typography></Box>}
              checked={isChecked}
            />
            </>}
            <CustomButton variant='contained' color="secondary"
              type="submit"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
              disabled={(isRegister && !isValidEmail(form.email))}
            >
              {!isRegister ? "Sign In" : "Register Account"}
            </CustomButton>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" color = "secondary">
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
          </Box>
          <div style = {{display : "flex", flexDirection : "row", position : "absolute", bottom : 20}}>
                <Typography variant="body2">{isRegister ? "Already have an account?" : "Yet to have an account?"}</Typography>
                <Link component="button" onClick = {handleSwitchMode} variant="body2" color = "secondary" style = {{paddingLeft : 4}}>
                  {isRegister ? "Sign in" : "Sign up"}
                </Link>
          </div>
          
        </Box>
      </Container>
    </> :
    <Container component="main" maxWidth="xs" sx={{height : '100%'}}>
        <Grid
          container
          direction={'column'}
          sx={{
            marginTop : 2,
            height: '100%',
          }}
        >
          <Grid Item xs={1}/>
          <Grid item xs = {2}>
          <Typography variant="h4" fontWeight="bold" align='center'>
            Welcome to Alt.native!
          </Typography>
          </Grid>
          <Grid item xs = {5}>
            <Card sx={{backgroundColor : 'primary.veryLight', height: '100%'}}>
              <CardContent sx={{display : 'flex', justifyContent : 'center', alignItems : 'center', height: '100%', width : '100%', flexDirection : 'column'}}>
                <Avatar sx={{ width: 120, height: 120, mb: 2, backgroundColor: 'secondary.main' }}/>
                <Typography variant="h4" fontWeight="bold" align='center'>{toTitleCase(form.name)}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid Item xs ={2}/>
          <Grid item xs = {2} sx={{pl:3,pr:3}}>
            <CustomButton onClick = {handleWelcome} fullWidth size='large' variant="contained" color = "secondary" sx={{ mt: 3, mb: 2}}>Welcome</CustomButton>
          </Grid>
          <Grid Item xs={1}/>
        </Grid>
    </Container>
    }
    <LoadingModal open={isLoading} text="Creating account..."/>
    <Modal open={tncModal} sx={{display : 'flex', justifyContent: 'center', alignItems : 'center'}} onClose={() => setTncModal(false)}>
        <Card sx={mobile ? {width: '100%', height: '100%',overflow: 'scroll', backgroundColor : 'primary.veryLight'} : {width: '50%', height: '80%',overflow: 'scroll', backgroundColor : 'primary.veryLight'}}>
            <CardContent sx={{display: 'flex', justifyContent : 'center', alignItems : 'center', flexDirection : 'column', margin : 2, ":last-child" : {paddingBottom : 2}}}>
              {/* <Typography variant='h4' fontWeight={'bold'} autoFocus>Terms and Conditions</Typography> */}
              <Box sx={{width: '90%'}}>
                <div dangerouslySetInnerHTML={{__html : tnc}} className="tnc"/>
                <CardActionArea sx = {{display : 'flex', mb: 2, mt : 2}}>                
                  <CustomButton variant='contained' fullWidth onClick={handleDeclineTnC} sx={{backgroundColor:'secondary.light'}}>Decline</CustomButton>
                  <CustomButton sx={{ml : 2}} fullWidth variant='contained' color="secondary" onClick={handleAcceptTnC}>
                      Accept
                  </CustomButton>
                </CardActionArea>
              </Box>
            </CardContent>
        </Card>
    </Modal>
    </>
  );
}