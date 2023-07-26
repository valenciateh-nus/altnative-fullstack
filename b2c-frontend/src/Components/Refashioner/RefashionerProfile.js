import React from 'react'
import { Chip, Box, Container, Grid, Rating, SvgIcon, Typography, Avatar } from '@mui/material'
import ProfileCard from '../ProfileCard';


export default function RefashionerProfile(props) {

    const [refashioner, setRefashioner] = React.useState(props.profile);

    return (
        <Container>
            <Box>
                <Typography variant='h5' gutterBottom>About the Refashioner</Typography>
                <Typography variant='subtitle1'>{refashioner.refashionerDesc}</Typography>
                <Typography variant='h5' gutterBottom>Expertises</Typography>

                {refashioner && refashioner.expertises.length > 0 ?
                    (
                        <Grid container spacing={1}>
                            {Array.from(refashioner.expertises).map((expertise) =>
                                <Grid item xs='auto'>
                                    <Chip
                                        label={expertise.name}
                                        style={{
                                            background: "#FB7A56",
                                            fontWeight: "bold",
                                            color: "white",
                                            padding: "2.5vh 1.5vw",
                                            margin: "0 0.3em 1.5em",
                                            borderRadius: "3vh",
                                        }}
                                    />
                                </Grid>)
                            }
                        </Grid>
                    ) : (
                        <Typography variant='subtitle1'>No Expertises</Typography>
                    )
                }

                <Typography variant='h5' gutterBottom>Certifications</Typography>

                {refashioner && refashioner.approvedCertifications.length > 0 ?
                    (
                        <Grid container spacing={1}>
                            {Array.from(refashioner.approvedCertifications).map((certification) =>
                                <Grid item xs='auto'>
                                    <Chip
                                        label={certification}
                                        style={{
                                            background: "#FB7A56",
                                            fontWeight: "bold",
                                            color: "white",
                                            padding: "2.5vh 1.5vw",
                                            margin: "0 0.3em 1.5em",
                                            borderRadius: "3vh",
                                        }}
                                    />
                                </Grid>)
                            }
                        </Grid>
                    ) : (
                        <Typography variant='subtitle1'>No Certifications</Typography>
                    )
                }
            </Box>

        </Container>
    )
}
