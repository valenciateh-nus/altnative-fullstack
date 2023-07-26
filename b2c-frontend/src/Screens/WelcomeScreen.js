import { Container,Grid,Typography,Card,CardContent,Avatar, Box} from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { useSearchParams } from "react-router-dom";
import { apiWrapper, signIn } from "../API";
import { getUserById } from "../API/userApi";
import { getNewToken, verifyUserToken } from "../API/verificationApi";
import CustomButton from "../Components/CustomButton";
import { toTitleCase } from "../constants";
import { getUserProfile, signInWithJWT } from "../Redux/actions";
import moment from 'moment';
import InContainerLoading from "../Components/InContainerLoading";
import LoadingModal from "../Components/LoadingModal";

export default function WelcomeScreen() {

    const[form,setForm] = React.useState({});
    const[currTime, setCurrTime] = React.useState(new Date());
    const dispatch = useDispatch();
    const history = useNavigate();
    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [user, setUser] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(false);
    const [isInnerLoading, setIsInnerLoading] = React.useState(false);
    const [disabledTimer, setDisabledTimer] = React.useState();

    React.useEffect(() => {
        setInterval(() => {
            setCurrTime(new Date());
        },1000)
    },[])

    React.useEffect(() => {
        setIsLoading(false);
        if(params.id && user?.id != params.id) {
            getUser(params.id);
        }

        if(searchParams.has('token')) {
            verifyToken(searchParams.get('token'));
        }

        setIsLoading(false);


    },[params.id, searchParams.values])

    async function getUser(id) {
        const res = await apiWrapper(getUserById(id),"",true);
        if(res) {
            setUser(res.data);
        }
    }

    async function verifyToken(token) {
        const res = await apiWrapper(verifyUserToken(token),"",true)
        if(res) {
            dispatch(signInWithJWT(res.data));
        }
    }

    function handleWelcome() {
        dispatch(getUserProfile(user.username));
        history("/");
    }

    async function handleResend() {
        setIsInnerLoading(true);
        const res = await apiWrapper(getNewToken(params.id),"",true);
        if(res) {
           setDisabledTimer(moment(new Date()).add(60,'seconds'));
        }
        setIsInnerLoading(false);
    }


    return (
        !isLoading ? <Container component="main" maxWidth="xs" sx={{height : '100%'}}>
            {!params.id && searchParams.has('token') ? <Grid
            container
            direction={'column'}
            sx={{
                marginTop : 2,
                height: '100%',
            }}
            >
            <Grid item xs={1}/>
            <Grid item xs = {2}>
            <Typography variant="h4" fontWeight="bold" align='center'>
                Welcome to Alt.native!
            </Typography>
            </Grid>
            <Grid item xs = {5}>
                <Card sx={{backgroundColor : 'primary.veryLight', height: '100%'}}>
                <CardContent sx={{display : 'flex', justifyContent : 'center', alignItems : 'center', height: '100%', width : '100%', flexDirection : 'column'}}>
                    <Avatar sx={{ width: 120, height: 120, mb: 2, backgroundColor: 'secondary.main' }}/>
                    <Typography variant="h4" fontWeight="bold" align='center'>{toTitleCase(form?.name)}</Typography>
                </CardContent>
                </Card>
            </Grid>
            <Grid Item xs ={2}/>
            <Grid item xs = {2} sx={{pl:3,pr:3}}>
                <CustomButton onClick = {handleWelcome} fullWidth size='large' variant="contained" color = "secondary" sx={{ mt: 3, mb: 2}}>Welcome</CustomButton>
            </Grid>
            <Grid Item xs={1}/>
            </Grid>
            :
            <Box sx={{display : 'flex', flexGrow: 1, height : '50%', mt: 2, flexDirection: 'column', justifyContent: 'space-between'}}>
                <Typography variant='h4' fontWeight="bold" align='center'>
                    Pending verification
                </Typography>
                <Typography align='center'>
                    {`An email has been sent to your account ${user?.username || "USERNAME"}. Please verify by clicking the link on the email.`}
                </Typography>
                {disabledTimer && <Typography align='center'>Verification email has been resent.</Typography>}
                <CustomButton onClick = {handleResend} disabled={disabledTimer && moment(currTime).isBefore(disabledTimer)} fullWidth size='large' variant="contained" color = "secondary" sx={{ mt: 3, mb: 2}}>
                    {disabledTimer && moment(currTime).isBefore(disabledTimer) ? Math.abs(Math.floor(moment.duration(moment(currTime).diff(disabledTimer)).asSeconds())) + 's' : 'Resend email'}</CustomButton>
            </Box>
            }
            <LoadingModal open={isInnerLoading}/>
        </Container> : <InContainerLoading/>
    )
}