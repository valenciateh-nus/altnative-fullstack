import React from "react";
import PropTypes from "prop-types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fontSize } from "@mui/system";
import icon from "../../assets/icon-512.png";
import { Box, Link, Typography } from '@mui/material';
import { useNavigate } from "react-router";

const ReactNotificationComponent = ({ title, body, redirect, navigate }) => {
  let hideNotif = title === "";

  if (!hideNotif) {
    toast(<Display />, {
      toastId: title
    });
  }

  function Display() {
    return (
      <Box style={{display: "flex", cursor :`${redirect ? 'pointer' : 'default'}`}} onClick={() => {if(redirect) navigate(redirect)}}>
        <Box>
          <img src={icon} style={{width:"50px", height: "auto"}}/>
        </Box>
        <Box >
          <Box style={{overflow: "hidden", textOverflow: "ellipsis", width: '14rem', position: "absolute", top: '50%', transform: 'translate(0px, -50%)', left: '70px', textOverflow: 'ellipsis'}}> 
            <Typography noWrap variant="body1" color='black' >
            {title}
            </Typography>
            <Typography noWrap variant="body2" color='black'>
            {body}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }
  return (
    <ToastContainer
      autoClose={3000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover={false}
    />
  );
};

ReactNotificationComponent.defaultProps = {
  title: "This is title",
  body: "Some body",
};

ReactNotificationComponent.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
};

export default ReactNotificationComponent;