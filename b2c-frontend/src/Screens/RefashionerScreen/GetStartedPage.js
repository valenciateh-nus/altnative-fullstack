import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import { Card, CardContent, CircularProgress, Grid, IconButton, Modal, Typography, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import Experience from '../../Components/Refashioner/Introduction/Experience';
import Introduction from '../../Components/Refashioner/Introduction/Introduction';
import CustomButton from '../../Components/CustomButton';
import ExperienceAccordion from '../../Components/Refashioner/Introduction/ExperienceAccordion';
import Personality from '../../Components/Refashioner/Introduction/Personality';
import { useDispatch, useSelector } from 'react-redux';
import { toggleBottomNavBar } from '../../Redux/actions';
import Certifications from '../../Components/Refashioner/Introduction/Certifications';
import { apiWrapper, createRefashionerRegistrationRequest, uploadImage } from '../../API';
import LoadingModal from '../../Components/LoadingModal';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';
import { testModeAPI } from 'react-ga';

export default function GetStartedPage() {
  const theme = useTheme();
  const mobile = !useMediaQuery(theme => theme.breakpoints.up('md'));

  const [activeStep, setActiveStep] = React.useState(0);
  const [expertise, setExpertise] = React.useState(new Map());
  const [intro, setIntro] = React.useState("");
  const [personalities, setPersonalities] = React.useState([]);
  const [certifications, setCertifications] = React.useState(new Map());
  const [certificationText, setCertificationText] = React.useState('');
  const [isNextDisabled, setIsNextDisabled] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const currUserData = useSelector((state) => state.currUserData);
  const authData = useSelector((state) => state.authData);

  const dispatch = useDispatch();

  const history = useNavigate();

  // if (currUserData.roles.indexOf("USER_REFASHIONER") === -1) {
  //   history('/home', {replace: true});
  // }

  React.useEffect(() => {
    console.log("TOGGLE SHOW NAV");
    dispatch(toggleBottomNavBar(mobile ? false : true));
    
  },[mobile])

  React.useEffect(() => {
    if(authData.roles.includes("USER_REFASHIONER")) {
      history(-1);
    }
    return () => {
      dispatch(toggleBottomNavBar(true));
    }
  },[])

  function handleSetPersonality(personality) {
    let temp = [...personalities]
    if(temp.includes(personality)) {
      console.log('filtering personality: ', personality)
      temp = temp.filter((p) => p !== personality);
    } else {
      temp.push(personality);
    }
    let newArr = temp.slice(temp.length-3 < 0 ? 0 : temp.length - 3,)
    console.log("NEW ARR: ", newArr)
    setPersonalities(newArr);
  }

  function handleSetExpertise(val) {
    if(!expertise.has(val)) {
      expertise.set(val,'');
    } else {
      expertise.delete(val);
    }
    setExpertise(new Map(expertise));
  }

  function handleSetExpertiseProficiency(key, proficiency) {
    if(expertise.has(key)) {
      expertise.set(key, proficiency);
      setExpertise(new Map(expertise));
    }
  }

  const handleNext = () => {
    if(activeStep < 4) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      createProfile();

    }
    
  };

  async function createProfile() {

    setIsLoading(true);
    let submittedExpertise = [];

    let formData = new FormData();

    if(expertise.size > 0) {
      console.log("SETTING EXPERTISES")
      for(const key of [...expertise.keys()]) {
        console.log(expertise.get(key).toUpperCase());
          if (key !== 'Others') {
            submittedExpertise.push({name: key, experienceLevel : expertise.get(key).toUpperCase()});
          } else {
            console.log('OTHERS: ', expertise.get(key).substr(expertise.get(key).split("-")[0].length + 1, expertise.get(key).length));
            submittedExpertise.push({name: expertise.get(key).substr(expertise.get(key).split("-")[0].length + 1, expertise.get(key).length), experienceLevel :  expertise.get(key).split("-")[0].toUpperCase()});
          }
      }
    }    

    console.log("EXPERTISE TO SUBMIT: " + JSON.stringify(submittedExpertise));

    let rrrformBlob = {
      expertises :  submittedExpertise,
      refashionerDesc : intro,
      traits : personalities,
    }

    rrrformBlob = new Blob([JSON.stringify(rrrformBlob)], {
      type: "application/json",
    });

    formData.append('refashionerRegistrationRequest', rrrformBlob)

    if(certifications.size > 0) {
      for(const key of [...certifications.keys()]) {
          console.log("APPENDING: " + key);
          formData.append('files', certifications.get(key), key);
      }
    }

    const res = await apiWrapper(createRefashionerRegistrationRequest(formData, "", true));
    if(res) {
      console.log(JSON.stringify(res));
      history(`/profile/myrefashionrequests?rId=${res.data.id}`)
    }

    setIsLoading(false);
    
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  React.useEffect(() => {
    if(activeStep === 0) {
      if(expertise.size === 0) {
        setIsNextDisabled(true);
      } else {
        setIsNextDisabled(false);
      }
    }
  },[expertise, intro, activeStep])
  
  function getStepContent() {
    switch (activeStep) {
      case 0:
        return (
          <Experience handleSetExpertise={handleSetExpertise} expertise = {expertise}/>
        );
      case 1:
        return <ExperienceAccordion expertise={expertise} handleSetExpertiseProficiency={handleSetExpertiseProficiency} setIsNextDisabled={setIsNextDisabled}/>
      case 2:
        return (
          <Introduction intro = {intro} setIntro ={setIntro}/>
        )
      case 3:
        return (
          <Personality handleSetPersonality={handleSetPersonality} personalities={personalities}/>
        )
      case 4:
        return (
          <Certifications certifications={certifications} setCertifications={setCertifications} certificationText={certificationText} setCertificationText={setCertificationText}/>
        )
    }
  }

  return (
    <>
    <Grid container spacing={1} direction='column' sx={{height: '100%',overflow:'scroll'}}>
      <Grid item xs={1}>
        <IconButton onClick={() => history(-1)}>
            <ArrowBack />
        </IconButton>  
      </Grid>
      <Grid item xs={1} sx={{display: 'flex', flexGrow : 1, justifyContent : 'center', alignItems: 'center', flexDirection : 'column'}}>
        <Typography variant="h4" fontWeight={700}>Getting Started</Typography>
        <MobileStepper
        variant="progress"
        steps={5}
        position="static"
        activeStep={activeStep}
        sx={{ width: '100%', flexGrow: 1, background: 'none', display : 'flex', justifyContent : 'center', alignItems : 'center'}}
        LinearProgressProps = {{sx : {backgroundColor : 'secondary.light', '& .MuiLinearProgress-bar' : {backgroundColor : 'secondary.main'}, width : '90%'}}}
      />
      </Grid>
      <Grid container item xs={8} sx={{alignItems: 'flex-start', justifyContent: 'flex-start', overflow : 'scroll', marginBottom : 1}}>
          {getStepContent()}
      </Grid>
      <Grid item xs={1}>
        <Box sx={{display : 'flex', flexDirection : 'row', justifyContent : 'center', alignItems : 'center', width: '100%', overflow: 'scroll'}}>
        {activeStep > 0 && <CustomButton variant='contained' color = 'secondary' sx={{minWidth : '120px', marginRight : 2}} size='large' onClick={handleBack}>Back</CustomButton>}
        <CustomButton variant='contained' color = 'secondary' sx={{minWidth : '120px'}} size='large' onClick={handleNext} disabled={isNextDisabled}>{activeStep === 4 ? 'Finish' : 'Next'}</CustomButton>
        </Box>
      </Grid>
    </Grid>
    <LoadingModal open={isLoading} text={'Creating profile...'}/>
    </>

  );
}
