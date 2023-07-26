import { Box, Typography,CircularProgress } from "@mui/material";

export default function InContainerLoading({text="Loading..."}) {
    return (
        <Box sx={{ display: 'flex', flexGrow: 1, height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <CircularProgress color='secondary' sx={{ marginTop: 15 }} />
            <Typography>{text}</Typography>
        </Box>
    )
}