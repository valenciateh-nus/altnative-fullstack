import React from 'react'
import { Chip, Box, Container, Grid, Typography, List, ListItemButton, ListItem, ListItemText, Paper, IconButton, ListItemIcon, CircularProgress, Button } from '@mui/material'
import ProfileCard from '../ProfileCard';
import { openImageModal } from '../../Redux/actions';
import { useDispatch } from 'react-redux';
import { CustomList } from '../CustomList';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CustomButton from '../CustomButton';
import { apiWrapper } from '../../API';
import { approveRefashionerRegistrationRequest, rejectRefashionerRegistrationRequest, approveRefashionerRegistrationRequestWithCertifications } from '../../API/refashionerRegistrationApi';
import SuccessModal from '../SuccessModal';
import moment from 'moment';
import { useTheme } from '@mui/styles';


export default function RefashionerApplicationModal({refashionerRequest = {}, handleRefresh}) {
    const[isSuccess, setIsSuccess] = React.useState(false);
    const[rrr, setRRR] = React.useState(refashionerRequest)
    const[isLoading, setIsLoading] = React.useState(false);
    const theme = useTheme();

    const dispatch = useDispatch();

    function handlePhotoModal(images, index) {
        dispatch(openImageModal(images,index))
    }

    const chipStyle = {
        background: theme.palette.secondary.main,
        fontWeight: "bold",
        color: "white",
        padding: 1,
        fontSize: 14
    }

    const refashioner = rrr.user;

    var re1 = /(?:\-([^-]+))?$/;
    var re2 = /(.+?)(\.[^.]*$|$)/;

    function extractCertName(fileName) {
        let name = re1.exec(fileName)[1];
        name = re2.exec(name)[1];

        return name;
    }

    async function handleApprove() {
        setIsLoading(true);
        let res;
        if(rrr.certifications.length > 0) {
            const formData = new FormData();
            const certs = new Blob([JSON.stringify(rrr.certifications.map((certification) => extractCertName(certification.fileName)))], {
                type: "application/json",
            });
            formData.append("certifiedCertifications", certs)
            res = await apiWrapper(approveRefashionerRegistrationRequestWithCertifications(rrr.id, formData),"",true);
        } else {
            res = await apiWrapper(approveRefashionerRegistrationRequest(rrr.id),"",true);
        }
        
        if(res) {
            setIsSuccess(true);
        }
        setIsLoading(false);
    }

    async function handleDeny() {
        setIsLoading(true);
        const res = await apiWrapper(rejectRefashionerRegistrationRequest(rrr.id),"",true);
        if(res) {
            setIsSuccess(true);
        }
        setIsLoading(false);

    }

    return (
        <Container>
            <ProfileCard user={refashioner}/>
            <Box>
                <Typography variant='h5' gutterBottom>About the Refashioner</Typography>
                <Typography variant='text'>{rrr.refashionerDesc ? rrr.refashionerDesc : 'No Description'}</Typography>
                {rrr.expertises.length > 0 && <>
                <Typography variant='h5' sx={{mt : 3, mb : 1}}>Expertise</Typography>
                <Grid container spacing={1}>
                    {rrr.expertises.map((expertise,i) =>
                        <Grid item xs='auto' key={i}>
                            <Chip
                                label={expertise.name + ' - ' + expertise.experienceLevel}
                                sx={chipStyle}
                                
                                size = 'medium'
                            />
                        </Grid>)
                    }
                </Grid></>}
                {rrr.traits.length > 0 && <>
                <Typography variant='h5' sx={{mt : 3, mb : 1}}>Personality</Typography>
                <Grid container spacing={1}>
                    {rrr.traits.map((trait,i) =>
                        <Grid item xs='auto' key={i}>
                            <Chip
                                label={trait}
                                sx={chipStyle}
                                
                            />
                        </Grid>)
                    }
                </Grid></>}
                {rrr.certifications.length > 0 && <>
                <Typography variant='h5' sx={{mt : 3}}>Certifications</Typography>
                    <CustomList>
                    {rrr.certifications.map((certification, i) => (
                        <Paper elevation={1} sx={{marginBottom: 1, backgroundColor : 'transparent'}} key={i}>
                        <ListItem sx= {{paddingRight: 0, cursor: 'pointer'}}>
                            <ListItemButton onClick={() => handlePhotoModal(rrr.certifications.map(img => img.url), i)}>
                            <Typography fontWeight={'fontWeightBold'} sx={{width: '100%'}}>{extractCertName(certification.fileName)}</Typography>
                            <ListItemIcon sx={{minWidth: 0}}>
                                <ArrowForwardIosIcon fontSize='16'/>
                            </ListItemIcon>
                            </ListItemButton>
                        </ListItem>
                        </Paper>
                    ))}   
                </CustomList>
                </>}
                <Box sx={{display : 'flex', flexDirection : 'row', mt:2, mb:2, justifyContent: 'center', alignItems: 'center'}}>
                {rrr.verified ? 
                    <Button
                        variant="contained"
                        disabled = {true}
                        fullWidth
                        size ='large'
                        sx={{":disabled" : {color : 'white', backgroundColor : 'secondary.main'}}}
                    >
                        {`Approved on: ${moment(rrr.verifiedDate).format('DD MMM YYYY')}`}
                    </Button>
                    : (
                        rrr.rejected ? 
                        <Button
                            variant="contained"
                            disabled = {true}
                            fullWidth
                            size ='large'
                            sx={{":disabled" : {color : 'white', backgroundColor : 'secondary.main'}}}
                        >
                            {'Rejected'}
                        </Button>
                        :
                            isLoading ? <CircularProgress color='secondary'/> : <>
                            <CustomButton variant='contained' size='large' fullWidth onClick={handleDeny} sx={{backgroundColor:'secondary.light', mr: 2}}>Deny</CustomButton>
                            <CustomButton variant='contained' size='large' fullWidth color="secondary" onClick={handleApprove}>
                                Approve
                            </CustomButton>
                            </>
                    )
                }
                </Box>   
            </Box>
            <SuccessModal open={isSuccess} onClose={() => setIsSuccess(false)} onCallback={handleRefresh}/>
        </Container>
    )
}
