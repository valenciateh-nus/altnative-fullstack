import * as React from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ImageList, ImageListItem, TextField,} from "@mui/material";
import { Box } from "@mui/system";
import CustomButton from "../CustomButton";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { FINAL_APPROVAL, FINAL_APPROVAL_OK, FINAL_APPROVAL_REJECTED } from "./MilestoneTypes";
import { apiWrapper } from "../../API";
import { approveFinalProduct } from "../../API/milestoneApi";

export default function FinalApproval({milestone = {},  index, approve, reject, isRefashionerPOV}) {
    const[isApprovalModalOpen, setIsApprovalModalOpen] = React.useState(false);
    const[isRejectionModalOpen, setIsRejectionModalOpen] = React.useState(false);
    const[rejectionReason, setRejectionReason] = React.useState("");

    const detailsJSON = JSON.parse(milestone.remarks);

    async function handleConfirmation() {
        console.log("confirmed");
        detailsJSON.hasResponded = true;
        const data = {
            milestoneEnum : FINAL_APPROVAL_OK,
            remarks : JSON.stringify({reviewsMadeBy : []}),
        }
        //await editAndCreate(data, null, {...milestone, remarks : JSON.stringify(detailsJSON)}, index)
        await approve(JSON.stringify({reviewsMadeBy : []}), {...milestone, remarks : JSON.stringify(detailsJSON)})
        //await apiWrapper(approveFinalProduct())
        setIsApprovalModalOpen(false);
    }

    async function handleRejection() {
        console.log('rejected');
        detailsJSON.hasResponded = true;
        const data = {
            milestoneEnum : FINAL_APPROVAL_REJECTED,
            remarks : rejectionReason,
        }
        //await editAndCreate(data, null, {...milestone, remarks : JSON.stringify(detailsJSON)}, index)
        await reject(rejectionReason, {...milestone, remarks : JSON.stringify(detailsJSON)});
        setIsRejectionModalOpen(false);
    }

    const handleOnKeyDown = async(e) => {
        if(e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleRejection();
        }

    }

    const handleChangeRejection = (e) => {
        setRejectionReason(e.target.value);
    }

    return (
        !detailsJSON?.hasResponded && !isRefashionerPOV && <>
        <Box sx={{display : 'flex', flexDirection : 'row', marginBottom : '8px', marginTop:'8px'}}>
            <CustomButton color='secondary' variant='contained' fullWidth sx={{marginRight: '6px'}} onClick={() => setIsApprovalModalOpen(true)}>Approve</CustomButton>
            <CustomButton variant='contained' fullWidth sx={{marginLeft: '6px', backgroundColor:'secondary.light'}} onClick={() => setIsRejectionModalOpen(true)}>Reject</CustomButton>
        </Box>
        <Dialog
            open={isApprovalModalOpen}
            onClose={() => setIsApprovalModalOpen(false)}
            aria-labelledby="alert-dialog-final-confirmation"
            aria-describedby="alert-dialog-final-confirmation"
            onBackdropClick = {() => setIsApprovalModalOpen(false)}
        >
            <Box sx={{backgroundColor : 'primary.main', display:'flex', flexDirection:'row'}}>
                <Box sx={{display : 'flex', justifyContent:'center', width: '15%', minWidth: '64px', paddingTop : '16px'}}>
                  <InfoOutlinedIcon fontSize='large'/>
                </Box>
                <Box>
                  <DialogTitle id="final-confirmation" sx={{paddingLeft: 0, paddingRight: 0}}>
                      Confirm Approval?
                  </DialogTitle>
                  <DialogContent sx={{paddingLeft: 0, paddingRight: 0}}>
                  <DialogContentText id="alert-dialog-description">
                     You cannot change your mind once accepted. Payment will be released to the refashioner upon confirmation.
                  </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                      <CustomButton variant='contained' onClick={() => setIsApprovalModalOpen(false)} sx={{backgroundColor:'secondary.light'}}>Cancel</CustomButton>
                      <CustomButton variant='contained' color="secondary" onClick={handleConfirmation} autoFocus>
                          Confirm
                      </CustomButton>
                  </DialogActions>
                </Box>
                <Box sx={{display : 'flex', justifyContent:'center', width: '15%', minWidth: '64px', paddingTop : '16px'}}/>
            </Box>
        </Dialog>
        <Dialog
            open={isRejectionModalOpen}
            onClose={() => setIsRejectionModalOpen(false)}
            aria-labelledby="alert-dialog-final-rejection"
            aria-describedby="alert-dialog-final-rejection"
            onBackdropClick = {() => setIsRejectionModalOpen(false)}
        >
            <Box sx={{backgroundColor : 'primary.main', display:'flex', flexDirection:'row', maxWidth: '450px'}}>
                <Box sx={{display : 'flex', justifyContent:'center', width: '15%', minWidth: '64px', paddingTop : '16px'}}>
                  <InfoOutlinedIcon fontSize='large'/>
                </Box>
                <Box>
                  <DialogTitle id="final-rejection" sx={{paddingLeft: 0, paddingRight: 0}}>
                      Confirm Rejection?
                  </DialogTitle>
                  <DialogContent sx={{padding: 0}}>
                  <DialogContentText id="alert-dialog-description">
                  You are about to reject the final product. Please let us know what is unsatisfactory about the project so that the refashioner can address it. 
                  </DialogContentText>
                  <TextField 
                        variant='standard'
                        InputProps={{ disableUnderline: true }} value={rejectionReason} 
                        onChange={handleChangeRejection}
                        onKeyDown={handleOnKeyDown}
                        multiline
                        rows={3}
                        fullWidth
                        sx={{overflowY: 'scroll', backgroundColor : 'white', marginTop: '16px', padding: 1, borderRadius : '4px'}}
                    />
                  </DialogContent>
                  <DialogActions sx={{marginBottom:'16px'}}>
                      <CustomButton variant='contained' onClick={() => setIsRejectionModalOpen(false)} sx={{backgroundColor:'secondary.light'}}>Cancel</CustomButton>
                      <CustomButton variant='contained' color="secondary" onClick={handleRejection} autoFocus>
                          Send
                      </CustomButton>
                  </DialogActions>
                </Box>
                <Box sx={{display : 'flex', justifyContent:'center', width: '15%', minWidth: '64px', paddingTop : '16px'}}/>
            </Box>
        </Dialog>
        </>
    )
}