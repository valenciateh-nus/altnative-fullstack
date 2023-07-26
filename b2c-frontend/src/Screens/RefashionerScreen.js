import { Container, Button, Divider, Grid, IconButton, Typography } from '@mui/material';
import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MessageCircle as MessageIcon, Heart as HeartIcon } from 'react-feather';
import RefashionerProfile from '../Components/Refashioner/RefashionerProfile';
import Listings from '../Components/ViewProjectListings';
import Reviews from '../Components/Refashioner/ViewReviews';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { generateChatId } from '../constants';
// API
import * as UserAPI from '../API/userApi';
import * as IndexAPI from '../API/index';
import { useDispatch, useSelector } from 'react-redux';
import { showFeedback } from '../Redux/actions';
import { ERROR } from "../Redux/actionTypes";
import ProfileCard from '../Components/ProfileCard';
import InContainerLoading from '../Components/InContainerLoading';

// Google Analytics
import ReactGa from 'react-ga';

const notFavouritedStyle = {
    background: "#CFD1D8",
    color: 'white',
    fontWeight: '600',
    padding: 1,
    height: '100%',
    width: '90%',
};

const isFavouritedStyle = {
    background: "#FB7A56",
    color: 'white',
    fontWeight: '600',
    padding: 1,
    height: '100%',
    width: '90%',
};

export default function RefashionerScreen() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { username } = useParams();
    const currentUser = useSelector(state => state.currUserData);
    const [refashioner, setRefashioner] = React.useState(null);
    const [projectListings, setProjectListings] = React.useState([]);
    const [reviews, setReviews] = React.useState([]);
    const [favourite, setFavourite] = React.useState(false);
    const [favourites, setFavourites] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [chatId, setChatId] = React.useState("");

    React.useEffect(() => {
        setIsLoading(true);
        if (username === currentUser.username) {
            navigate("/profile");
        }
        if (username) {
            runOnce();
        }
    }, [])

    async function sendPageView(id, username) {
        ReactGa.initialize('UA-223374225-1')
        console.log("sending data to GA");
        console.log('/refashioner/' + id + "/" + username);
        ReactGa.pageview('/refashioner/' + id + "/" + username);
    }


    async function getUser() {
        const res = await IndexAPI.apiWrapper(IndexAPI.getUserByUsername(username));
        if (res) {
            setRefashioner(res.data);
            setChatId(generateChatId(currentUser.id, res.data.id, null));
        }

        return res;
    }

    async function runOnce() {
        const userData = await getUser();
        sendPageView(userData.data.id, userData.data.username);
        if (userData) {
            await getFavouriteRefashioners();
            await getReviews(userData.data.id)
            await getListings(userData.data.id)
        }
        setIsLoading(false);
    }

    async function getReviews(id) {
        const reviewsRes = await IndexAPI.apiWrapper(UserAPI.retrieveReviewsByUserId(id));
        if (reviewsRes) {
            console.log("REVIEW SET")
            console.log(reviewsRes);
            setReviews(reviewsRes.data);
        }
    }

    async function getListings(id) {
        const plRes = await IndexAPI.apiWrapper(UserAPI.retrieveProjectListingsByRefashionerId(id));
        if (plRes) {
            setProjectListings(plRes.data);
        }
    }

    async function getFavouriteRefashioners() {
        const res = await IndexAPI.apiWrapper(UserAPI.retrieveFavouritedRefashioners())
        if (res) {
            setFavourites(res.data);
            setFavourite(checkRefashionerIsFavourite(res.data));
        }

    }

    const checkRefashionerIsFavourite = (refashioners) => {
        if (refashioners.length === 0) { // If there is no favourites, favourites = []
            console.log("no favourite refashioners");
            return false;
        }
        // Check if refashionerId exist inside the user list of favourite refashioner.
        const isFavourite = refashioners.some(favouriteRefashioner => favouriteRefashioner.username === username);
        console.log("Favourites not empty: " + isFavourite);
        return isFavourite;

    }

    const favouriteRefashioner = async (id) => {
        console.log("favouriting refashioner...");
        try {
            const res = await UserAPI.favouriteRefashionerById(id);
            if (res) {
                dispatch(showFeedback('Refashioner Favourited'));
            }
        } catch (error) {
            const data = error?.response?.data?.message
            console.log("ERROR MSG: " + JSON.stringify(error));
            setFavourite(false);
            dispatch({ type: ERROR, data })
        }
    }

    const unfavouriteRefashioner = async (id) => {
        console.log("unfavouriting refashioner...");
        try {
            const res = await UserAPI.unfavouriteRefashionerById(id);
            if (res) {
                dispatch(showFeedback('Refashioner Unfavourited'));
            }
        } catch (error) {
            const data = error?.response?.data?.message
            console.log("ERROR MSG: " + JSON.stringify(error));
            setFavourite(true);
            dispatch({ type: ERROR, data })
        }
    }

    const toggleFavouriteRefashioner = async () => {
        if (favourite) {
            // Insert API to remove refashioner in user list of favourite refashioners. (From refashionerService)
            console.log("unfavouriting in toggle");
            await unfavouriteRefashioner(refashioner.id);
            setFavourite(false);
            //setFavourite(checkRefashionerIsFavourite(favourites));

        } else {
            // Insert API to add refashioner to user list of favourite refashioners. 
            console.log("favouriting in toggle");
            await favouriteRefashioner(refashioner.id);
            setFavourite(true);
            //setFavourite(checkRefashionerIsFavourite(favourites));
        }
    }

    return (
        !isLoading ? <>
            <Button onClick={() => navigate(-1)}>
                <ArrowBackIcon fontSize='large' color='action' />
            </Button>
            <Container>
                <ProfileCard user={refashioner} />
            </Container>
            {refashioner && refashioner.roles.includes("USER_REFASHIONER") && <>
                <RefashionerProfile profile={refashioner} />
                <Divider />
                <Listings projectListings={projectListings} />
                <Divider />
            </>}
            {refashioner &&
                <Reviews reviews={reviews} profile={refashioner} />
            }
            <Grid container spacing={2}>
                <Grid item xs={8} sx={{ marginTop: 2, marginLeft: 2, zIndex: '0' }}>
                    <Button
                        variant="contained"
                        sx={{ background: '#FB7A56', color: 'white', fontWeight: '600', padding: 1, height: '100%', width: '90%' }}
                        onClick={() => navigate(`/chat/${chatId}?user2=${username}`)}
                    >
                        <IconButton sx={{ color: 'white' }}>
                            <MessageIcon />
                        </IconButton>
                        Chat with User
                    </Button>
                </Grid>

                <Grid item xs={3} sx={{ marginTop: 2, marginLeft: 0 }}>
                    <Button
                        variant="contained"
                        sx={{ background: '#FB7A56', color: 'white', fontWeight: '600', padding: 1, height: '100%', width: '90%' }}
                        style={favourite ? isFavouritedStyle : notFavouritedStyle}
                        onClick={toggleFavouriteRefashioner}
                    >
                        <IconButton sx={{ color: 'white' }}>
                            <HeartIcon fill="white" size="30px" />
                        </IconButton>
                    </Button>
                </Grid>
            </Grid>
        </>
            : <InContainerLoading />
    )
}
