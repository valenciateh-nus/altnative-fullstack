import styled from "@emotion/styled";
import { List } from "@mui/material";

export const CustomList = styled(List)(({theme}) => ({
    // selected and (selected + hover) states
    "&& .Mui-selected, && .Mui-selected:hover": {
      backgroundColor: theme.palette.secondary.main,
      "&, & .MuiListItemIcon-root": {
        color: "white"
      }
    },
    // hover states
    "& .MuiListItemButton-root:hover": {
      backgroundColor : 'transparent',
    }
}));