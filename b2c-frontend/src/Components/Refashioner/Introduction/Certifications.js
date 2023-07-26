import { ListItemText } from '@material-ui/core';
import { Grid, Typography, Card, Avatar, CardContent, Box, Button, IconButton, TextField, List, ListItemButton, ListItemIcon, Paper, ListItem } from '@mui/material';
import React from 'react';
import { apiWrapper, uploadImage } from '../../../API';
import CustomButton from '../../CustomButton';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useDispatch } from 'react-redux';
import { openImageModal } from '../../../Redux/actions';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/styles';

const StyledList = styled(List)({
  // selected and (selected + hover) states
  "&& .Mui-selected, && .Mui-selected:hover": {
    backgroundColor: "#FB7A56",
    "&, & .MuiListItemIcon-root": {
      color: "white"
    }
  },
  // hover states
  "& .MuiListItemButton-root:hover": {
    backgroundColor : 'transparent',
  }
});

function Certifications({certifications, setCertifications, certificationText, setCertificationText}) {

  
    const dispatch = useDispatch();

    const handleOnChange = (e) => {
        e.preventDefault();
        setCertificationText(e.target.value);
    }

    const handleAttachmentChange = (e) => {
        console.log('files:', e.target.files[0]);
        let file = e.target.files[0];
        var re = /(?:\.([^.]+))?$/;
        let key = file.name;
        if(certificationText.length > 0) {
          key = certificationText + '.' + re.exec(file.name)[1];
        }
        let newCerts = certifications;
        newCerts.set(key, file);
        setCertificationText("")
        setCertifications(new Map(newCerts));
    }

    function handleDelete(key) {
      let newCerts = certifications;
      newCerts.delete(key);
      setCertifications(new Map(newCerts));
    }

    function handlePhotoModal(images, index) {
        dispatch(openImageModal(images,index))
    }

    return (
        <Grid container spacing={2} sx={{ px: 3 }}>
      <Grid item xs={12}>
        <Typography variant="body2" align="center" sx={{ fontWeight: '600' }}>
          We'd love to know you better
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
        <TextField
          value={certificationText}
          fullWidth
          multiline
          rows={8}
          id="certification-desc"
          InputLabelProps={{
            shrink: true
          }}
          placeholder="We want to celebrate your achievements with you!
Share with us any awards, certification you have attained. Tell us more about the fashion/sewing speciality courses or workshops you have completed."
          onChange={handleOnChange}
          sx={{backgroundColor : 'primary.veryLight', borderColor : 'secondary.main'}}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2" align="center">
            If you have any certification or achievements, upload images to be verified!
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{display : 'flex', justifyContent : 'center', alignItems : 'center'}}>
            <input
                accept="image/*"
                hidden
                id="attachments-button"
                type="file"
                onChange={handleAttachmentChange}
            />
            <label htmlFor="attachments-button">
            <CustomButton component='span' size='large' variant='contained' color="secondary" disabled={certificationText.length === 0}>Upload Images</CustomButton>
            </label>
       </Grid>
       <Grid item xs ={12}>
           {certifications.size > 0 && <StyledList>
                {[...certifications.keys()].map((name, i) => (
                    <Paper elevation={1} sx={{marginBottom: 1, backgroundColor : 'transparent'}} key={i}>
                      <ListItem sx= {{paddingRight: 0, cursor: 'pointer'}}
                        secondaryAction={
                          <IconButton edge="end" onClick={() => handleDelete(name)}>
                            <DeleteIcon color='secondary'/>
                          </IconButton>
                        }
                      >
                        <ListItemButton onClick={() => handlePhotoModal([...certifications.values()].map(img => URL.createObjectURL(img)), i)}>
                          <Typography fontWeight={'fontWeightBold'} sx={{width: '100%'}}>{name}</Typography>
                          <ListItemIcon sx={{minWidth: 0}}>
                            <ArrowForwardIosIcon fontSize='16'/>
                          </ListItemIcon>
                        </ListItemButton>
                      </ListItem>
                    </Paper>
                ))}   
            </StyledList>}
       </Grid>
    </Grid>
    )
};

export default Certifications;