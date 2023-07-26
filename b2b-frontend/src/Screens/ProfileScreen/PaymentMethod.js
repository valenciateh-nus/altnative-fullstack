import { Box, Button, Container, Grid, Paper, SvgIcon, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function PaymentMethod() {
    return (
        <Container>
            <Link to="/profile">
                <SvgIcon
                    fontSize="large"
                    color="action"
                    sx={{cursor : 'pointer'}}
                >
                    <ArrowBackIcon />
                </SvgIcon>
            </Link>
            <Box>
                <Typography variant='h5' style={{ fontWeight: 'bold' }} gutterBottom>Add Payment Method</Typography>

                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Button variant='outlined'>
                            <Typography variant='h5' style={{ fontWeight: 'bold' }}>MASTERS</Typography>
                            <Typography variant='subtitle1'>Credit/Debit Card</Typography>
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant='outlined'>
                            <Typography variant='h5' style={{ fontWeight: 'bold' }}>VISA</Typography>
                            <Typography variant='subtitle1'>Credit/Debit Card</Typography>
                        </Button>
                    </Grid>
                </Grid>
                <form>
                    <Typography variant='subtitle1'>Card Name</Typography>
                    <TextField
                        margin="normal"
                        fullWidth
                        required
                        label="Card Name"
                        color="secondary"
                    >

                    </TextField>
                    <Typography variant='subtitle1'>Card Number</Typography>
                    <TextField
                        margin="normal"
                        fullWidth
                        required
                        label="Card Number"
                        color="secondary"
                    >

                    </TextField>

                    <Grid container spacing={3}>
                        <Grid item xs={6}>
                            <Typography variant='subtitle1'>Expiry Date</Typography>
                            <TextField
                                margin="normal"
                                fullWidth
                                required
                                label="Expiry Date"
                                color="secondary"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant='subtitle1'>CVV</Typography>
                            <TextField
                                margin="normal"
                                fullWidth
                                required
                                label="CVV"
                                color="secondary"
                            />
                        </Grid>

                    </Grid>
                    <Button
                        variant="contained"
                        style={{ float: 'right', bottom: '0', position: 'relative', backgroundColor: "#FB7A56", color: "white", textTransform: "none" }}
                        onClick={() => {
                            alert('Update Payment Method');
                        }}
                    >Save</Button>

                </form>
            </Box>
        </Container>
    )
}
