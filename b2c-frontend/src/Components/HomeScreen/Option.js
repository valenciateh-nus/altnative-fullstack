import {
  Button
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { maxWidth } from '@mui/system';
import { useState } from 'react';

const Option = ({ text }) => {
  const [select, setSelected] = useState(false);
  console.log(select);

  const selectedButtonStyle = {
    background: "#DBD7D7",
    padding: "4vw 8vw"
  };

  const buttonStyle = {
    position: "static", 
    background: "#FFE8BC",
    maxWidth: "25vw",
    minWidth: "25vw",
    minHeight: "10vw",
    maxHeight: "10vw",
  };

  return (
    <Button 
      variant="contained"
      onClick={() => setSelected(!select)}
      style={select ? selectedButtonStyle : buttonStyle}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        align="center"
        style={{ textDecoration: "none", maxWidth: "25vw", maxHeight: "10vw", overflow: "scroll"}}
      >
        {text}
      </Typography>
    </Button>
  );
};



export default Option;