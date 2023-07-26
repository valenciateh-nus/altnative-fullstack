import React from 'react'
import { Box, Container, Grid, IconButton, MenuItem, Select, TextField, Typography, Button, Card, Chip, ImageListItem, ImageList, ImageListItemBar, CardActionArea, Tabs, Tab, Divider } from '@mui/material'
import MarketplaceImg from '../../Components/Images/MarketplaceImage.png';
import { makeStyles, withStyles } from "@mui/styles";
import MySwapItems from '../../Components/Swap/MySwapItems';
import MySwapOrders from '../../Components/Swap/MySwapOrders';

const CustomTab = withStyles({
    root: {
        textTransform: "none"
    }
})(Tab);

export default function SwapOrder() {

    const [tabValue, setTabValue] = React.useState("swapOrders");

    const handleTabChange = (event, newValue) => {
        console.log(newValue);
        setTabValue(newValue);
    };

    return (
        <Container>
            <Box sx={{
                minHeight: '100%',
                maxHeight: '100%',
                px: 1,
                py: 7,
                overflow: 'scroll'
            }}>
            <Grid container spacing={3}>

                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Swap Items
                    </Typography>
                    <Box
                        sx={{
                            height: 70,
                            width: 70,
                            position: 'relative',
                            top: -20,
                            right: 0,
                        }}
                    >
                        <img alt="Marketplace Image" src={MarketplaceImg} style={{ objectFit: 'contain' }} />
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        sx={{ "& button[aria-selected='true']": { borderBottom: "5px solid", borderBottomColor: '#FB7A56', color: "secondary.main" } }}
                    >
                        <CustomTab label="My Orders" value="swapOrders" />
                        <CustomTab label="My Swap Items" value="swapItems" />
                    </Tabs>
                </Grid>
                <Grid item xs={12}>
                    <Divider sx={{ marginTop: '-25px' }} />
                </Grid>
            </Grid>
            {tabValue === 'swapOrders' ? <MySwapOrders/> : <MySwapItems /> }

        </Box>
        </Container >
    )
}
