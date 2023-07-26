import { Card, Grid, IconButton, Typography } from '@mui/material';
import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';

const AboutUs = () => {
  const navigate = useNavigate();
  return (
    <Grid container spacing={2} sx={{ px: 4 }}>
      <IconButton onClick={() => navigate(-1)}>
        <ArrowBackIcon fontSize='large' />
      </IconButton>
      <Grid item xs={12} lg={12} sx={{ marginTop: 0 }}>
        <Typography align="center" variant="h4" fontWeight={800} color="secondary">
          How We Started
        </Typography>
      </Grid>
      <Grid xs={12} variant="subtitle2" sx={{ px: 10, marginTop: 3 }}>
        <p>
          At Alt.native, we believe that every piece of fabric should be treated with respect as there are many ways the item can be utilized.
          <br />Many times, old clothes throw us into a dilemma - should we donate them away or just toss them into the landfill? Even if we recycle them, these unwanted fabrics still contribute to textile waste.
          <br />We thought about the new alternative - repurposing these unwanted clothings into something desireble again.
          <br /><br />
          <b>Refashioning</b> - a practice to upcycle old clothes, giving unwanted fabrics a new purpose and extending their lifespan. Sounds simple, yet not everyone is equipped with the relevant skills to carry such tasks out.
          <br /><b>Alt.native became the solution.</b> We are a platform to connect anyone who wants to upcycle old clothes (Refashionees) to those with the right skills (Refashioners), making refashioning a simple process to bring your ideas to life.
          <br /><br />
          <p><b>Refashioning is now made easy.</b></p>
        </p>
      </Grid>
      <Grid xs={12} variant="subtitle2" sx={{ px: 10 }}>
      </Grid>

      <Grid item xs={12} lg={12} sx={{ marginTop: 5 }}>
        <Typography align="center" variant="h4" fontWeight={800} color="secondary">
          Why Refashion?
        </Typography>
      </Grid>
      <Grid xs={12} variant="subtitle2" sx={{ px: 10, marginTop: 3 }}>
        <p>
          <b>Reduce Fashion Footprint</b>
          <br />When you choose to refashion hence prolonging the lifespan of an article of clothing, you are taking part in the fight against fast fashion with us.
          <br /><br />
          <b>Your Own Fashion</b>
          <br />You get to transform unwanted clothes into a new, one-of-a-kind fashion that is specific to you!
          <br /><br />
          <b>Keep Sentimental Pieces</b>
          <br />Your sentimental, nostalgic clothing will no longer have to go to waste. From a T-Shirt to a mask, be surprised at what refashioning can do for you!
        </p>
      </Grid>

      <Grid item xs={12} lg={12} sx={{ marginTop: 5 }}>
        <Typography align="center" variant="h4" fontWeight={800} color="secondary">
          Here's what we offer
        </Typography>
      </Grid>
      <Grid xs={12} variant="subtitle2" sx={{ px: 10, marginTop: 3 }}>
        <p>
          <b>Create New From Old</b>
          <br />We transform old clothes into a new, one-of-a-kind favorable item that suits your purpose.
          <br /><br />
          <b>Connect You with Experts</b>
          <br />We have experienced fashion experts ready to collaborate with you, for your next refashioned piece!
          <br /><br />
          <b>Make Refashioning Easy</b>
          <br />Our team is here to support you by making refashioning a seamless experience.
        </p>
      </Grid>

    </Grid>
  );
};

export default AboutUs;