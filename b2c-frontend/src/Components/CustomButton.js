import { Button } from '@mui/material';
import { withStyles } from '@mui/styles';

const CustomButton = withStyles((theme) => ({
    root: {
        //marginTop : 12, 
        color : "white", 
        textTransform : "none",
    }
  }))(Button);

export default CustomButton;