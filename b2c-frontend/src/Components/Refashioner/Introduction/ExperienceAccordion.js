import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Button, TextField } from '@mui/material';
import { toTitleCase } from '../../../constants';

function ExperienceAccordion({ expertise, handleSetExpertiseProficiency, setIsNextDisabled }) {

  const [othersValue, setOthersValue] = React.useState("");

  const handleOthersValueChange = (e) => {
    e.preventDefault();
    setOthersValue(e.target.value);
  }

  React.useEffect(() => {
    if(expertise.has('Others')) {
      if(othersValue.trim().length === 0 || [...expertise.values()].filter((val) => val.length === 0).length > 0) {
        setIsNextDisabled(true);
      } else {
        setIsNextDisabled(false);
      }
    } else {
      if([...expertise.values()].filter((val) => val.length === 0).length > 0) {
        setIsNextDisabled(true);
      } else {
        setIsNextDisabled(false);
      }
    }
  },[othersValue, expertise])

  function handleClick(key, proficiency) {
    handleSetExpertiseProficiency(key, key === 'Others' ? proficiency + '-' + toTitleCase(othersValue) : proficiency);
  }  
  return (
    <Box sx={{width: '100%', display : 'flex', alignItems: 'center', flexDirection : 'column', marginBottom : 1}}>
    <Typography variant="body2" sx={{ display : 'flex', width: '100%', justifyContent: 'center', fontWeight: '600', marginBottom : 3 }}>
      Tell us more about your experience
    </Typography>
    {[...expertise.keys()].map((exp, i) => (
      <Accordion sx={{width: '100%'}} key={i}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          id = {i}
        >
          {exp}
        </AccordionSummary>
        <AccordionDetails>
          {exp === 'Others' && 
          <Box sx={{display : 'flex', flexDirection : 'row', alignItems : 'center', marginBottom : 2}}>
            <Typography sx={{paddingRight: 2}}>Please specify your experty: </Typography>
            <TextField size='small' variant='outlined' value={othersValue} onChange={handleOthersValueChange} label='Expertise' placeholder = 'Please specify'/>
          </Box> }
          {((exp === 'Others' && othersValue.trim().length > 0) || exp !== 'Others') && <>
          <Box sx={{width: '100%', padding: 0.5, borderRadius: 1, height: '50px', backgroundColor: `${expertise.get(exp).includes('beginner') ? '#FB7A56' : '#FFFAF0'}`, cursor: 'pointer', color: `${expertise.get(exp).includes('beginner') ? 'white' : 'black'}` }} id='Beginner' onClick={() => handleClick(exp, 'beginner')}>
            <Box sx={{ paddingLeft: 1,}}>
              <Typography variant="body2" sx={{ marginLeft: 2, fontWeight: 'bold' }}>
                Beginner
              </Typography>
              <Typography variant="body2" sx={{ marginLeft: 2 }}>
                I have done 1-5 projects
              </Typography>
            </Box>
          </Box>
          <Box sx={{ width: '100%', padding: 0.5, borderRadius: 1, height: '50px', backgroundColor: `${expertise.get(exp).includes('intermediate') ? '#FB7A56' : '#FFFAF0'}`, marginTop: 2, cursor: 'pointer', color: `${expertise.get(exp).includes('intermediate') ? 'white' : 'black'}` }} onClick={() => handleClick(exp, 'intermediate')}>
            <Box sx={{ paddingLeft: 1,}}>
            <Typography variant="body2" sx={{ marginLeft: 2, fontWeight: '550' }}>
              Intermediate
            </Typography>
            <Typography variant="body2" sx={{ marginLeft: 2 }}>
              I have done 6-10 projects
            </Typography>
            </Box>
          </Box>
          <Box sx={{ width: '100%', padding: 0.5, borderRadius: 1, height: '50px', backgroundColor: `${expertise.get(exp).includes('advanced') ? '#FB7A56' : '#FFFAF0'}`, marginTop: 2, cursor: 'pointer', color: `${expertise.get(exp).includes('advanced') ? 'white' : 'black'}` }} onClick={() => handleClick(exp, 'advanced')}>
            <Box sx={{ paddingLeft: 1,}}>
            <Typography variant="body2" sx={{ marginLeft: 2, fontWeight: '550' }}>
              Advanced
            </Typography>
            <Typography variant="body2" sx={{ marginLeft: 2 }}>
              I have done more than 10 projects
            </Typography>
            </Box>
          </Box>
          </>}
        </AccordionDetails>
      </Accordion>
    ))}
    </Box>
  );
};

export default ExperienceAccordion;