import React from 'react'
import { Box, Button, Container, IconButton, SvgIcon, TextField, Typography } from '@mui/material'
import { Link } from 'react-router-dom';
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// API
import { useDispatch, useSelector } from 'react-redux';
import { ERROR } from "../../Redux/actionTypes";
import * as UserAPI from '../../API/userApi';
import { showFeedback } from '../../Redux/actions';

const useStyles = makeStyles((theme) => ({
  modalBox: {
    width: '60%',
    height: '18em',
    background: '#FFFAF0',
    padding: "2em",
    borderRadius: '1em',
    border: '0.1em solid #FB7A56',
    overflow: 'scroll',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  },
  buttons: {
    width: '50%',
    border: '0.1em solid #CFD1D8',
    textTransform: "none",
    display: 'flex',
  }
}));

const initForm = {
  id: '',
  shoulderWidth: '',
  ptp: '',
  chestCircumference: '',
  waist: '',
  torsoLength: '',
  sleeveLength: '',
  sleeveCircumference: '',
  hips: '',
  thighCircumference: '',
  kneeCircumference: '',
  calfCircumference: '',
  down: '',
};

export default function MyMeasurements() {
  const styles = useStyles();
  const dispatch = useDispatch();
  
  // Retrive currentUser username from Redux
  const currUser = useSelector((state) => state.currUserData);
  const userId = currUser.id;

  const [form, setForm] = React.useState(initForm);

  React.useEffect(() => {
    if (userId) {
      UserAPI.retrieveMeasurements().then((val) => {
        setForm(val.data);
      });
    }
  }, [])
  console.log("MEASUREMENTSS");
  console.log(form);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  };

  async function updateMeasurements(measurements) {
    console.log('updating users measurements');
    try {
      const res = await UserAPI.updateMeasurments(measurements);
      if(res) {
        dispatch(showFeedback('Measurements updated'));
      }
    } catch (error) {
      const data = error?.response?.data?.message
      console.log("ERROR MSG: " + JSON.stringify(error));
      dispatch({ type: ERROR, data })
    }
  }

  const handleUpdateMeasurements = async () => {

    // Insert API to update measurements
    await updateMeasurements(form);
  };

  const navigate = useNavigate();

  return (
    <Container sx={{mb : 6}}>
      <IconButton onClick={() => navigate("/profile")}>
          <ArrowBackIcon />
      </IconButton>
      <Box component='form'>
        <Typography variant='h5' style={{ fontWeight: 'bold' }} gutterBottom>My Measurements</Typography>
          <Typography variant='subtitle1'>Shoulder Width</Typography>
          <TextField
            margin="normal"
            fullWidth
            id="shoulderWidth"
            label="Shoulder Width"
            name="shoulderWidth"
            color="secondary"
            onChange={handleChange}
            value={form.shoulderWidth === 0 ? '' : form.shoulderWidth}
            type='number'
          >

          </TextField>
          <Typography variant='subtitle1'>Pit to Pit</Typography>
          <TextField
            margin="normal"
            fullWidth
            id='ptp'
            label="Pit to Pit"
            name='ptp'
            color="secondary"
            onChange={handleChange}
            value={form.ptp === 0 ? '' : form.ptp}
            type='number'
          >

          </TextField>
          <Typography variant='subtitle1'>Chest Circumference</Typography>
          <TextField
            margin="normal"
            fullWidth
            id="chestCircumference"
            label="Chest Circumference"
            name="chestCircumference"
            color="secondary"
            onChange={handleChange}
            value={form.chestCircumference === 0 ? '' : form.chestCircumference}
            type='number'
          >
          </TextField>
          <Typography variant='subtitle1'>Waist</Typography>
          <TextField
            margin="normal"
            fullWidth
            id='waist'
            label="Waist Length"
            name='waist'
            color="secondary"
            onChange={handleChange}
            value={form.waist === 0 ? '' : form.waist}
            type='number'
          >
          </TextField>
          <Typography variant='subtitle1'>Torso Length</Typography>
          <TextField
            margin="normal"
            fullWidth
            id='torsoLength'
            label="Torso Length"
            name='torsoLength'
            color="secondary"
            onChange={handleChange}
            value={form.torsoLength === 0 ? '' : form.torsoLength}
            type='number'
          >
          </TextField>
          <Typography variant='subtitle1'>Sleeve Length</Typography>
          <TextField
            margin="normal"
            fullWidth
            id='sleeveLength'
            label="Sleeve Length"
            name='sleeveLength'
            color="secondary"
            onChange={handleChange}
            value={form.sleeveLength === 0 ? '' : form.sleeveLength}
            type='number'
          >
          </TextField>
          <Typography variant='subtitle1'>Sleeve Circumference</Typography>
          <TextField
            margin="normal"
            fullWidth
            id='sleeveCircumference'
            label="Sleeve Circumference"
            name='sleeveCircumference'
            color="secondary"
            onChange={handleChange}
            value={form.sleeveCircumference === 0 ? '' : form.sleeveCircumference}
            type='number'
          >
          </TextField>
          <Typography variant='subtitle1'>Hips</Typography>
          <TextField
            margin="normal"
            fullWidth
            id='hips'
            label="Hips Length"
            name='hips'
            color="secondary"
            onChange={handleChange}
            value={form.hips === 0 ? '' : form.hips}
            type='number'
          >
          </TextField>
          <Typography variant='subtitle1'>Thigh Circumference</Typography>
          <TextField
            margin="normal"
            fullWidth
            id='thighCircumference'
            label="Thigh Circumference"
            name='thighCircumference'
            color="secondary"
            onChange={handleChange}
            value={form.thighCircumference === 0 ? '' : form.thighCircumference}
            type='number'
          >
          </TextField>
          <Typography variant='subtitle1'>Knee Circumference</Typography>
          <TextField
            margin="normal"
            fullWidth
            id='kneeCircumference'
            label="Knee Circumference"
            name='kneeCircumference'
            color="secondary"
            onChange={handleChange}
            value={form.kneeCircumference === 0 ? '' : form.kneeCircumference}
            type='number'
          >
          </TextField>
          <Typography variant='subtitle1'>Calf Circumference</Typography>
          <TextField
            margin="normal"
            fullWidth
            id='calfCircumference'
            label='Calf Circumference'
            name='calfCircumference'
            color="secondary"
            onChange={handleChange}
            value={form.calfCircumference === 0 ? '' : form.calfCircumference}
            type='number'
          >
          </TextField>
          <Typography variant='subtitle1'>Down</Typography>
          <TextField
            margin="normal"
            fullWidth
            id='down'
            label="Down"
            name='down'
            color="secondary"
            onChange={handleChange}
            value={form.down === 0 ? '' : form.down}
            type='number'
          >
          </TextField>
          <Button
            variant="contained"
            style={{ width: '100%', marginTop: '2vh', backgroundColor: "#FB7A56", color: "white", textTransform: "none" }}
            onClick={handleUpdateMeasurements}
          >Save
          </Button>
      </Box>
    </Container >
  )
}
