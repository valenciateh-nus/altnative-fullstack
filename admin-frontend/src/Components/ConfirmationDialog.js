import { InfoOutlined } from "@mui/icons-material";
import { Dialog, Box, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import CustomButton from "./CustomButton";


export default function ConfirmationDialog({open, handleClose, handleCancel, handleConfirm, header = 'Confirm action?', dialogText = 'Are you sure you want to proceed?'}) {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-final-rejection"
            aria-describedby="alert-dialog-final-rejection"
            onBackdropClick = {handleCancel}
        >
            <Box sx={{backgroundColor : 'primary.veryLight', display:'flex', flexDirection:'row', maxWidth: '450px'}}>
                <Box sx={{display : 'flex', justifyContent:'center', width: '15%', minWidth: '64px', paddingTop : '16px'}}>
                  <InfoOutlined fontSize='large'/>
                </Box>
                <Box>
                  <DialogTitle id="final-rejection" sx={{paddingLeft: 0, paddingRight: 0}}>
                      {header}
                  </DialogTitle>
                  <DialogContent sx={{padding: 0}}>
                    <DialogContentText id="alert-dialog-description">
                       {dialogText}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions sx={{marginBottom:'16px'}}>
                      <CustomButton variant='contained' onClick={handleCancel} sx={{backgroundColor:'secondary.light'}}>Cancel</CustomButton>
                      <CustomButton variant='contained' color="secondary" onClick={handleConfirm} autoFocus>
                          Confirm
                      </CustomButton>
                  </DialogActions>
                </Box>
                <Box sx={{display : 'flex', justifyContent:'center', width: '15%', minWidth: '64px', paddingTop : '16px'}}/>
            </Box>
        </Dialog>
    )
}