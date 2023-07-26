import React from 'react'
import { Chip, Box, Container, Grid, Typography, List, ListItemButton, ListItem, ListItemText } from '@mui/material'
import ProfileCard from '../ProfileCard';
import { StyledChip } from './Introduction/Personality';


export default function RefashionerProfilePreview({rrr}) {

    const chipStyle = {
        background: "#FB7A56",
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

    return (
        <Container>
            <ProfileCard user={refashioner}/>
            <Box>
                <Typography variant='h5' gutterBottom>About the Refashioner</Typography>
                <Typography variant='text'>{rrr.refashionerDesc}</Typography>
                {rrr.expertises.length > 0 && <>
                <Typography variant='h5' sx={{mt : 3, mb : 1}}>Expertise</Typography>
                <Grid container spacing={1}>
                    {rrr.expertises.map((expertise,i) =>
                        <Grid item xs='auto' key={i}>
                            <Chip
                                label={expertise.name}
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
                {rrr.certifications.length > 0 &&<>
                <Typography variant='h5' sx={{mt : 3}}>Certifications</Typography>
                <List>
                    {rrr.certifications.map((certification,i) =>
                        <ListItem sx={{paddingLeft : 0, paddingTop: 0, paddingBottom: 0}} key={i}>
                            <ListItemText primaryTypographyProps={{sx : {fontSize : '1.1em'}}}>
                                {extractCertName(certification.fileName)}
                            </ListItemText>
                        </ListItem>)
                    }
                </List></>}
            </Box>

        </Container>
    )
}
