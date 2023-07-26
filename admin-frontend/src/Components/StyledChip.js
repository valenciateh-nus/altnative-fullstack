import { Chip } from "@mui/material";
import { withStyles } from "@mui/styles";

export const StyledChip = withStyles((theme) => ({
    root: {
      "&&:hover": {
        backgroundColor : theme.palette.secondary.main
      }
    }
}))(Chip);