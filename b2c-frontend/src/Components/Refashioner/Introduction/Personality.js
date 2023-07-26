import { Chip, Stack, Typography } from '@mui/material';
import { withStyles } from '@mui/styles';
import { Box } from '@mui/system';
import React from 'react';

const personalitiesArray = [
    'Perfectionist', 'Free-spirited', 'Bold', 'Sweet', 'Sexy', 'Vintage', 'Modern', 'Bohemian', 'Chic', 'Avant-garde', 'Grunge', 'Sophisticated', 'Haute', 'Floral', 'Cutesy', 
]

export const StyledChip = withStyles((theme) => ({
    root: {
      "&&:hover": {
        backgroundColor : theme.palette.secondary.main
      }
    }
}))(Chip);

export default function Personality({handleSetPersonality, personalities = []}) {

    function handleOnClick(p) {
        handleSetPersonality(p);
    }

    return (
        <Box sx={{width : '100%', display : 'flex', flexDirection : 'column', alignItems : 'center', textAlign : 'center'}}>
        <Typography variant="body2" sx={{ fontWeight: '600', marginBottom : 3 }}>
            Choose three words that best describe your refashion style / personality!
        </Typography>
        <Stack direction ="row" spacing={1} sx={{display : 'flex', flexWrap : 'wrap', justifyContent : 'center'}}>
        {personalitiesArray.map((p,i) => (
            <StyledChip size='medium' variant='filled' label={p} key={i} onClick={() => handleOnClick(p)} sx={{backgroundColor : `${personalities.includes(p) ? 'secondary.main' : 'secondary.light'}`, color : 'white', fontWeight : 600, marginBottom: 1}}/>
        ))}
        </Stack>
        </Box>
    )
}