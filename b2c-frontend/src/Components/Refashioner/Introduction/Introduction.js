import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import React from 'react';

function Introduction({intro = '', setIntro}){

  const handleOnChange = (e) => {
    e.preventDefault();
    setIntro(e.target.value);
  }

  return (
    <Grid container spacing={2} sx={{ px: 3 }}>
      <Grid item xs={12}>
        <Typography variant="body2" align="center" sx={{ fontWeight: '600' }}>
          We'd love to know you better
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
        <TextField
          value={intro}
          fullWidth
          multiline
          rows={12}
          id="self-introduction"
          placeholder="Here's a short introduction about you. You can start by sharing how did you first started with textile craft - are you a self-taught fashion maker?
            What are your inspirations for your refashion works? What does refashioning mean to you?
            And basically anything you want you potential refashionee to know about you!"
          onChange={handleOnChange}
          sx={{backgroundColor : 'primary.veryLight', borderColor : 'secondary.main'}}
        />
      </Grid>
    </Grid>
  );
};

export default Introduction;