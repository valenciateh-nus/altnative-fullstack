import { Modal } from "@mui/material";
import { makeStyles} from "@mui/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
    modalContainer : {
        display: "flex",
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
    },
    imageContainer : {
        maxWidth : '90%', 
        height: 'undefined', 
        maxHeight : '90%', 
    }
}));

export default function PhotoModal({show, handleClose, url}){
  const styles = useStyles();

  return (
    <Modal
      open={show}
      onClose={handleClose}
      className = {styles.modalContainer}
    >
        <img src = {url} className = {styles.imageContainer} onClick = {handleClose}/>
    </Modal>
  )
}
