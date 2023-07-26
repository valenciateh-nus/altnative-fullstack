import { Grid, Typography, Card, Avatar, CardContent, Box, Button } from '@mui/material';
import React from 'react';
import ExperienceAccordion from './ExperienceAccordion';
import ExpertiseBox from './ExpertiseBox';

const default_expertise = ['Repair', 'Embroidery', 'Alterations', 'Fashion Design', 'Painting', 'Tie-Dying', 'Digital Design', 'Footwear', 'Others'];

function Experience({handleSetExpertise, expertise}) {

  function handleClick(val) {
    handleSetExpertise(val);
  }

  return (
    <Grid container spacing={2} sx={{ px: 3 }}>
      <Grid item xs={12}>
        <Typography variant="body2" align="center" sx={{ fontWeight: '600' }}>
          Do you have experience with any of the following?
        </Typography>
      </Grid>
      <Grid item xs={12} container spacing={2}>
        {Array.from(default_expertise).map((val) => (
          <Grid item xs={4} key={val}>
            <Box id={val} key={val} onClick={() => handleClick(val)} sx={{cursor: 'pointer'}}>
              <ExpertiseBox name={val} selected={expertise.has(val)}/>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Grid>
  )
};

export default Experience;