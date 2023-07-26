import { ArrowForwardIosOutlined } from '@mui/icons-material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { List, ListItemButton, Box, ListItemText, ListItemIcon, IconButton, Typography, Paper, CircularProgress, Chip } from '@mui/material';
import moment from 'moment';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import { apiWrapper } from '../../API';
import { retrieveRefashionerRegistrationRequestsByUserId } from '../../API/userApi';
import RefashionerProfilePreview from '../../Components/Refashioner/RefashionerProfilePreview';
import InContainerLoading from '../../Components/InContainerLoading';
import CustomButton from '../../Components/CustomButton';

export default function RefashionRequestsScreen() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [rrr,setRRR] = React.useState([]);
    const currUser = useSelector((state) => state.authData);
    const currentUser = useSelector(state => state.currUserData);
    const[selectedRRR, setSelectedRRR] = React.useState(null);
    const[isLoading, setIsLoading] = React.useState(null);
    

    React.useEffect(() => {
        if(currentUser?.id && currUser.sub === currentUser.username) {
            getRRR();
        }
    },[])
    

    async function getRRR() {
        setIsLoading(true);
        const res = await apiWrapper(retrieveRefashionerRegistrationRequestsByUserId(currentUser.id),"",false);

        if(res) {
            setRRR(res.data);
            if(searchParams.get('rId')) {
                console.log("GETS HERE, RID: " + searchParams.get('rId'))
                let found;
                for(const r of res.data) {
                    console.log(r.id);
                    if (r.id.toString() === searchParams.get('rId')) {
                        found = r;
                        break;
                    }
                }
                if(found?.id) {
                    console.log("FOUND: ", JSON.stringify(found));
                    setSelectedRRR(found);
                }
            }
        }
        setIsLoading(false);
    }

    const history = useNavigate();

    function handleBack() {
        setSelectedRRR(null);
    }

    return (
        <>
        <IconButton onClick = {() => history(-1)}>
            <ArrowBack/>
        </IconButton>
        {!isLoading ? (!selectedRRR?.id ?
        <Box sx={{display: 'flex', flexDirection : 'column', margin: 2, justifyContent : 'space-between', flexGrow:1, height : '85%'}}>
            <Box>
                <Typography variant='h5' fontWeight={700} sx={{paddingLeft: 2}}>My Refashion Requests</Typography>
                <Typography variant='caption' color='GrayText' sx={{paddingLeft: 2}}>Select a request to view its details</Typography>
                <List>
                {rrr.length > 0 && rrr.map((r,i) => (
                    <Paper elevation={1} sx={{marginBottom: 1, backgroundColor : 'transparent'}} key={i}>
                        <ListItemButton onClick={() => setSelectedRRR(r)}>
                            <ListItemText primaryTypographyProps={{sx : {fontSize : '1.1em'}}}>
                                {'Refashion Request Dated: ' + moment(r.requestDate).format("DD MMM yyyy")}
                            </ListItemText>
                            <ListItemIcon sx={{minWidth : 0}}>
                            <Chip label={r.rejected ? 'REJECTED' : (r.verified ? 'APPROVED' : 'PENDING')} color={r.rejected === 'REJECTED' ? 'error' : (r.verified ? 'success' : 'secondary')} sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.75em',}} />
                            </ListItemIcon>
                        </ListItemButton>
                    </Paper>
                ))}
                </List>
            </Box>
            <Box sx={{display : 'flex', justifyContent: 'center', alignItems : 'space-between'}}>
                <CustomButton variant='contained' color='secondary' onClick = {() => history('/refashioner/start')}>New Application</CustomButton>
            </Box>
        </Box>
        : <RefashionerProfilePreview rrr={selectedRRR}/>) : 
        <InContainerLoading/>
        }
        </>
    )
}