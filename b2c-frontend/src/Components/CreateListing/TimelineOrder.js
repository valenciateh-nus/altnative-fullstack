import * as React from "react";
import { useState, useEffect } from 'react';
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import {
  Box,
  Card,
  Menu,
  MenuItem,
  Container,
  Grid,
  TextField,
  InputAdornment,
  SvgIcon,
  Button,
  Typography,
  Modal,
  FormLabel,
  Slider,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Select,
  CircularProgress,
  CardContent
} from '@mui/material';
import { withStyles } from "@mui/styles";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { ChevronRight as Next, ArrowLeft as ArrowIcon, PlusCircle as PlusIcon } from 'react-feather';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import moment from 'moment';
import { createRequest } from "../../Redux/actions";
import { openImageModal } from '../../Redux/actions';
import CancelIcon from '@mui/icons-material/Cancel';
import * as indexApi from '../../API/index.js';
import { ERROR } from "../../Redux/actionTypes";
import { uploadImage } from '../../API';
import { apiWrapper } from "../../API";
import CustomButton from "../CustomButton";
import { showFeedback } from '../../Redux/actions';

const catList = ['1', '2', "seven"];

const CustomTimelineDot = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.secondary.light,
    boxShadow: 'none',
    border: '4px solid',
    borderColor: theme.palette.secondary.main,
    padding: '6px',
    margin: 0,
  }
}))(TimelineDot)

const CustomTimelineFilledDot = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
    boxShadow: 'none',
    border: '4px solid',
    borderColor: theme.palette.secondary.main,
    padding: '6px',
    margin: 0,
  }
}))(TimelineDot)

const CustomTimelineConnector = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.secondary.light,
    height: '4em',
    width: '0.3em',
  }
}))(TimelineConnector)

export default function TimelineOrder({ form = null }) {
  const [categoryList, setCategoryList] = useState([]);
  const [openCategoryMenu, setOpenCategoryMenu] = useState(false);
  const [openIdea, setOpenIdea] = useState(false);
  const [openDescription, setOpenDescription] = useState(false);
  const [openDeadline, setOpenDeadline] = useState(false);
  const [openBudget, setOpenBudget] = useState(false);
  const [refashionValue, setRefashionValue] = useState("");
  const [deadline, setDeadline] = useState("");
  const [budget, setBudget] = useState(0);
  const [attachments, setAttachments] = React.useState([]);
  const [optionalAttachments, setOptionalAttachments] = React.useState([]);
  const [category, setCategory] = React.useState('');
  const [categoryObj, setCategoryObj] = React.useState(null);
  const { id = 0 } = useParams();
  const [reqImage, setReqImage] = React.useState([]);
  const [deletedImage, setDeletedImage] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [request, setRequest] = React.useState([]);
  const [requestForm, setRequestForm] = React.useState({ 'id': null, 'title': '', 'description': '', 'price': '', 'category': null, 'proposedCompletionDate': '' })
  const [editForm, setEditForm] = React.useState({ 'id': 0, 'title': '', 'description': '', 'price': '', 'requestStatus': '' })
  const field = ['category', 'title', 'description', 'imageList', 'proposedCompletionDate', 'price']
  const token = useSelector((state) => state.token)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    indexApi.getCategory().then((arr) => setCategoryList(arr.data));
    if (id !== 0) {
      indexApi.getRequestsById(id).then((val) => {
        setRequest(val.data);
        setRequestForm({
          ...requestForm,
          ['title']: val.data.title,
          ['description']: val.data.description,
          ['price']: val.data.price,
          ['requestStatus']: val.data.requestStatus,
          ['id']: val.data.id,
          ['category']: val.data.category,
          ['proposedCompletionDate']: val.data.proposedCompletionDate,
          // ['imageList']: val.data.imageList
        })
        // setAttachments(val.data.imageList);
        setReqImage(val.data.imageList);
        setCategory(val.data.category.categoryName);
      })
    }
  }, [id])

  console.log(request);
  console.log(attachments);
  console.log(requestForm[field[4]]);

  const handleSelectClick = (cat) => {
    setCategory(cat.categoryName);
    setCategoryObj(cat);
    if (id === 0) {
      setRequestForm({ ...requestForm, ['category']: cat })
    } else {
      setRequestForm({ ...requestForm, ['category']: cat })
      setRequest({ ...request, ['category']: cat })
    }
  }
  const handleImageDelete = (img) => {
    let files = [];
    console.log(img);
    console.log(img.id === undefined);
    if (img.id !== undefined) {
      files = Array.from(reqImage);
      let index = files.findIndex((val) => val === img);
      // console.log(index);
      files.splice(index, 1);
      setReqImage(files);
      setRequest({ ...request, ['imageList']: reqImage })
      console.log(request);
      let deleted = deletedImage;
      deleted.push(img);
      setDeletedImage(deletedImage);
    } else {
      files = Array.from(attachments)
      let index = files.findIndex((val) => val === img);
      console.log(index);
      files.splice(index, 1);
      setAttachments(files);
      console.log(files);
    }
  }

  const handleOptionalImageDelete = (img) => {
    let files = Array.from(optionalAttachments)
    let index = files.findIndex((val) => val === img);
    files.splice(index, 1);
    setOptionalAttachments(files);
  }

  const handleDelete = async (pId, imgId) => {
    await indexApi.deleteImageFromRequest(pId, imgId).then((arr) => {
      console.log(arr.data);
    })
  }

  const handleChange = (e) => {
    console.log(e);
    if (id === 0) {
      setRequestForm({ ...requestForm, [e.target.name]: e.target.value });
    } else {
      setRequest({ ...request, [e.target.name]: e.target.value });
      setRequestForm({ ...requestForm, [e.target.name]: e.target.value });
    }
  };

  const handleDateChange = (e) => {
    console.log(e);
    if (id === 0) {
      setRequestForm({ ...requestForm, ['proposedCompletionDate']: e });
    } else {
      setRequest({ ...request, ['proposedCompletionDate']: e });
      setRequestForm({ ...requestForm, ['proposedCompletionDate']: e });
    }
  }

  const handleAttachmentChange = (e) => {
    console.log(e.target.files[0]);
    if (e.target.files[0]) {
      // let newFile = URL.createObjectURL(e.target.files[0]);
      let files = Array.from(attachments);
      files.push(e.target.files[0]);
      setAttachments(files);
    }
    // setAttachments(...attachments, Array.from(e.target.files));
    console.log(attachments);
  }

  const handleOptionalAttachmentChange = (e) => {
    if (e.target.files[0]) {
      let newFile = URL.createObjectURL(e.target.files[0]);
      let files = Array.from(optionalAttachments);
      files.push(newFile);
      setOptionalAttachments(files);
    }
  }

  const invalidButtonStyle = {
    background: "#CFD1D8",
    color: " white",
    fontWeight: "bold",
    fontSize: "medium",
    padding: "1em 2em",
    borderRadius: '1em',
    height: '5em',
    width: '100%'
  };

  const validButtonStyle = {
    background: "#FB7A56",
    color: " white",
    fontWeight: "bold",
    fontSize: "medium",
    padding: "1em 2em",
    borderRadius: '1em',
    height: '5em',
    width: '100%'
  };

  async function createProjectRequest(formData, cId) {
    console.log('creating new request')
    try {
      setIsLoading(true);
      const req = await apiWrapper(indexApi.createRequest(formData, cId), "", true);
      navigate(`/complete/${req.data.id}`, { replace: true });
    } catch (error) {
      const data = error?.response?.data?.message
      console.log("ERROR MSG: " + JSON.stringify(error));
      dispatch({ type: ERROR, data })
    }
  }

  async function createDraftRequest(formData, cId) {
    console.log('creating draft request')
    try {
      setIsLoading(true);
      const res = await apiWrapper(indexApi.createDraftRequest(cId, formData), "", true);
      if (res) {
        setIsLoading(false);
        dispatch(showFeedback('New Draft Request Created'));
        setTimeout(function () {
          navigate(`/requestDetails/${res.data.id}`, { replace: true });
        }, 1000);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      const data = error?.response?.data?.message
      console.log("ERROR MSG: " + JSON.stringify(error));
      dispatch({ type: ERROR, data })
    }
  }

  async function updateProjectRequest(request, id) {
    console.log('update proj request')
    try {
      setIsLoading(true);
      const res = await apiWrapper(indexApi.updateProjectRequest(request, id), "", true);
      if (res) {
        setIsLoading(false);
        dispatch(showFeedback('Update Request Successful'));
        setTimeout(function () {
          navigate(`/requestDetails/${id}`, { replace: true });
        }, 1000);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      const data = error?.response?.data?.message
      console.log("ERROR MSG: " + JSON.stringify(error));
      dispatch({ type: ERROR, data })
    }
  }

  async function updateDraftRequest(request, id) {
    console.log('update draft request')
    try {
      setIsLoading(true);
      const res = await apiWrapper(indexApi.updateDraftRequest(id, request), "", true);
      if (res) {
        setIsLoading(false);
        dispatch(showFeedback('Update Draft Request Successful'));
        setTimeout(function () {
          navigate(`/requestDetails/${id}`, { replace: true });
        }, 1000);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      const data = error?.response?.data?.message
      console.log("ERROR MSG: " + JSON.stringify(error));
      dispatch({ type: ERROR, data })
    }
  }

  async function submitProjectRequest(formData, pId) {
    console.log('creating new request')
    try {
      setIsLoading(true);
      const req = await apiWrapper(indexApi.submitRequest(formData, pId), "", true);
      navigate(`/complete/${req.data.id}`, { replace: true });
    } catch (error) {
      const data = error?.response?.data?.message
      console.log("ERROR MSG: " + JSON.stringify(error));
      dispatch({ type: ERROR, data })
    }
  }

  const handleSubmit = async (e) => {
    console.log(id);
    if (id !== 0 && requestForm['requestStatus'] === 'DRAFT') {
      console.log("publishing draft request");
      let updatedRequest = request;

      const formData = new FormData();
      let reqForm = new Blob([JSON.stringify(updatedRequest)], {
        type: "application/json",
      });

      for (let img of deletedImage) {
        await handleDelete(id, img.id);
      }

      if (attachments.length > 0) {
        console.log(attachments);
        for (let img of attachments) {
          console.log(img);
          let imageData = new FormData();
          imageData.append('file', img);
          await indexApi.addImageToRequest(id, imageData);
        }
      }

      formData.append('projectRequest', reqForm);
      // console.log(formData);
      // setRequest(request);
      // console.log(updatedRequest);
      await submitProjectRequest(formData, request.id);

    } else if (id !== 0) {
      console.log("updating request");
      console.log(request);
      let updatedRequest = request;

      for (let img of deletedImage) {
        await handleDelete(id, img.id);
      }

      const formData = new FormData();
      let reqForm = new Blob([JSON.stringify(requestForm)], {
        type: "application/json",
      });
      for (let img of attachments) {
        formData.append('files', img);
      }
      formData.append('projectRequest', reqForm);

      // updatedRequest.imageList = images;
      setRequest(request);
      await updateProjectRequest(formData, id);

    } else {
      console.log("publishing request");
      console.log(categoryObj);
      let cId = categoryObj.id;

      const formData = new FormData();
      let reqForm = new Blob([JSON.stringify(requestForm)], {
        type: "application/json",
      });

      for (let img of attachments) {
        formData.append('files', img);
      }

      formData.append('projectRequest', reqForm);
      console.log(cId);
      await createProjectRequest(formData, cId);
    }
  }

  const handleDraftSubmit = async (e) => {
    setRequestForm(requestForm);
    if (id !== 0) {
      console.log("updating draft request");
      let updatedRequest = request;

      const formData = new FormData();
      let reqForm = new Blob([JSON.stringify(updatedRequest)], {
        type: "application/json",
      });

      if (attachments.length > 0) {
        console.log(attachments);
        for (let img of attachments) {
          console.log(img);
          let imageData = new FormData();
          imageData.append('file', img);
          await indexApi.addImageToRequest(id, imageData);
        }
      }

      for (let img of deletedImage) {
        await handleDelete(id, img.id);
      }

      formData.append('projectRequest', reqForm);
      await updateDraftRequest(formData, id);

    } else {
      console.log("create draft request");
      const formData = new FormData();
      let reqForm = new Blob([JSON.stringify(requestForm)], {
        type: "application/json",
      });
      for (let img of attachments) {
        formData.append('files', img);
      }
      formData.append('projectRequest', reqForm);
      console.log(formData);
      await createDraftRequest(formData, categoryObj.id);
    }
  }

  return (
    <>
      <Timeline position="right" style={{ padding: '1em 0' }}>
        <TimelineItem>
          <TimelineOppositeContent
            align="right"
            sx={{ padding: 0, 'WebkitFlex': 0, margin: '0' }}
          >
          </TimelineOppositeContent>
          <TimelineSeparator>
            {requestForm[field[0]] === null ? <CustomTimelineDot /> : <CustomTimelineFilledDot />}
            <CustomTimelineConnector />
          </TimelineSeparator>
          <TimelineContent onClick={() => setOpenCategoryMenu(true)} sx={{ paddingTop: 0, paddingBottom: '30px', cursor: 'pointer', minWidth: '125px' }}>
            <Grid
              container
            >
              <Grid item xs={10}>
                {requestForm[field[0]] === null ? "Select a category" : requestForm[field[0]].categoryName}
              </Grid>
              <Grid item xs={2}>
                <SvgIcon
                  fontSize="large"
                  color="action"
                  style={{ color: '#FB7A56' }}
                >
                  <Next />
                </SvgIcon>
              </Grid>
            </Grid>
          </TimelineContent>
          <Modal
            open={openCategoryMenu}
            onClose={() => setOpenCategoryMenu(false)}
          >
            <Box style={{ background: 'white', border: '0.1em solid #FB7A56', padding: 20, width: '70%', maxWidth: '400px', borderRadius: '1em', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <Typography variant="body1" style={{ overflowWrap: 'break-word' }}>
                Select a Category
              </Typography>
              <Select
                labelId="select-category"
                label="category"
                value={category}
                style={{ background: 'white', float: 'left', width: '100%', border: '1px solid black', WebkitBorderRadius: ".5vw", marginTop: 5 }}
              >
                {Array.from(categoryList).map((cat) => (
                  <MenuItem id={cat.id} value={cat.categoryName} onClick={() => handleSelectClick(cat)}>{cat.categoryName}</MenuItem>
                ))}
              </Select>
              <CustomButton
                variant="contained"
                color='secondary'
                onClick={() => setOpenCategoryMenu(false)}
                fullWidth
                style={{ float: 'right', bottom: '0', position: 'relative', marginTop: 10 }}
              >
                Save
              </CustomButton>
            </Box>
          </Modal>
        </TimelineItem>

        <TimelineItem>
          <TimelineOppositeContent
            align="right"
            sx={{ padding: 0, 'WebkitFlex': 0, margin: '0' }}
          >
          </TimelineOppositeContent>
          <TimelineSeparator>
            {requestForm[field[1]] === "" ? <CustomTimelineDot /> : <CustomTimelineFilledDot />}
            <CustomTimelineConnector />
          </TimelineSeparator>
          <TimelineContent onClick={() => setOpenIdea(true)} sx={{ paddingTop: 0, paddingBottom: '30px', cursor: 'pointer', minWidth: '125px' }}>
            <Grid
              container
            >
              <Grid item xs={10}>
                {requestForm[field[1]] === '' ? "What would you like to refashion?" : requestForm[field[1]]}
              </Grid>
              <Grid item xs={2}>
                <SvgIcon
                  fontSize="large"
                  color="action"
                  style={{ color: '#FB7A56' }}
                >
                  <Next />
                </SvgIcon>
              </Grid>
            </Grid>
          </TimelineContent>
          <Modal
            open={openIdea}
            onClose={() => setOpenIdea(false)}
          >
            <Box style={{ background: 'white', border: '0.1em solid #FB7A56', padding: 20, width: '70%', maxWidth: '400px', borderRadius: '1em', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <Typography variant="body1" style={{ overflowWrap: 'break-word' }}>
                What would you want to refashion? (eg. I'd like to refashion Jeans to Jacket)
              </Typography>
              <TextField
                autoFocus
                id={field[1]}
                name={field[1]}
                value={requestForm[field[1]]}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                margin="normal"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', verticalAlign: 'center', paddingTop: '10px' }}
              />
              <CustomButton
                variant="contained"
                color='secondary'
                onClick={() => setOpenIdea(false)}
                fullWidth
                style={{ float: 'right', bottom: '0', position: 'relative', marginTop: 10 }}
              >
                Save
              </CustomButton>
            </Box>
          </Modal>
        </TimelineItem>

        <TimelineItem>
          <TimelineOppositeContent
            align="right"
            sx={{ padding: 0, 'WebkitFlex': 0, margin: '0' }}
          >
          </TimelineOppositeContent>
          <TimelineSeparator>
            {requestForm[field[2]] === '' || requestForm[field[2]] === undefined ? <CustomTimelineDot /> : <CustomTimelineFilledDot />}
            <CustomTimelineConnector />
          </TimelineSeparator>
          <TimelineContent onClick={() => setOpenDescription(true)} sx={{ paddingTop: 0, paddingBottom: '30px', cursor: 'pointer', minWidth: '125px' }}>
            <Grid
              container
            >
              <Grid item xs={10}>
                {requestForm[field[2]] === '' || requestForm[field[2]] === undefined ? "Description of your project?" : requestForm[field[2]]}
              </Grid>
              <Grid item xs={2}>
                <SvgIcon
                  fontSize="large"
                  color="action"
                  style={{ color: '#FB7A56' }}
                >
                  <Next />
                </SvgIcon>
              </Grid>
            </Grid>
          </TimelineContent>
          <Modal
            open={openDescription}
            onClose={() => setOpenDescription(false)}
          >
            <Box style={{ background: 'white', maxWidth: '400px', border: '0.1em solid #FB7A56', padding: 20, width: '70%', borderRadius: '1em', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <Typography variant="body1" style={{ overflowWrap: 'break-word' }}>
                Project Request Description
              </Typography>
              <TextField
                autoFocus
                id={field[2]}
                name={field[2]}
                value={requestForm[field[2]]}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                margin="normal"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', verticalAlign: 'center', paddingTop: '10px' }}
              />
              <CustomButton
                variant="contained"
                color='secondary'
                onClick={() => setOpenDescription(false)}
                fullWidth
                style={{ float: 'right', bottom: '0', position: 'relative', marginTop: 10 }}
              >
                Save
              </CustomButton>
            </Box>
          </Modal>
        </TimelineItem>

        <TimelineItem>
          <TimelineOppositeContent
            align="right"
            variant="caption"
            color="text.primary"
            sx={{ padding: 0, 'WebkitFlex': 0 }}
          >
          </TimelineOppositeContent>
          <TimelineSeparator>
            {attachments.length === 0 && reqImage.length === 0 ? <CustomTimelineDot /> : <CustomTimelineFilledDot />}
            <CustomTimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ paddingTop: 0, paddingBottom: '30px', cursor: 'pointer' }}>
            <Grid
              container
            >
              <input
                accept="image/*"
                hidden
                id="attachments-button"
                name={field[3]}
                type="file"
                multiple
                onChange={handleAttachmentChange}
              />
              <label htmlFor="attachments-button" style={{ width: '100%', cursor: 'pointer' }}>
                <Grid Item xs={12}>
                  <Grid container>
                    <Grid item xs={10}>
                      Image of your existing clothing item to refashion
                    </Grid>
                    <Grid item xs={2}>
                      <SvgIcon
                        fontSize="large"
                        color="action"
                        style={{ color: '#FB7A56' }}
                      >
                        <Next />
                      </SvgIcon>
                    </Grid>
                  </Grid>
                </Grid>
              </label>
              <Grid xs={12}>
                <Box sx={{ overflowX: 'scroll' }}>
                  <ImageList>
                    {reqImage !== null && reqImage.length > 0 &&
                      (Array.from(reqImage).map((img) => (
                        <ImageListItem key={img.id} style={{ width: 100, height: 100, overflow: 'hidden' }} >
                          {console.log(img)}
                          <img src={img.url} loading="lazy" style={{ cursor: 'pointer' }} />
                          <ImageListItemBar position="top" sx={{ background: 'none', color: 'black' }}
                            actionIcon={
                              <IconButton onClick={() => handleImageDelete(img)}>
                                <CancelIcon />
                              </IconButton>
                            } />
                        </ImageListItem>
                      )))
                    }
                    {attachments !== null && attachments.length > 0 &&
                      (Array.from(attachments).map((img, i) => (
                        <ImageListItem key={i} style={{ width: 100, height: 100, overflow: 'hidden' }} >
                          <img src={URL.createObjectURL(img)} loading="lazy" style={{ cursor: 'pointer' }} />
                          <ImageListItemBar position="top" sx={{ background: 'none', color: 'black' }}
                            actionIcon={
                              <IconButton onClick={() => handleImageDelete(img)}>
                                <CancelIcon />
                              </IconButton>
                            } />
                        </ImageListItem>
                      )))
                    }
                  </ImageList>
                </Box>
              </Grid>
            </Grid>
          </TimelineContent>
        </TimelineItem>

        {/* <TimelineItem>
          <TimelineOppositeContent
            align="right"
            variant="caption"
            color="text.primary"
            sx={{ padding: 0, 'WebkitFlex': 0 }}
          >
          </TimelineOppositeContent>
          <TimelineSeparator>
            {optionalAttachments.length === 0 ? <CustomTimelineDot /> : <CustomTimelineFilledDot />}
            <CustomTimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ paddingTop: 0, paddingBottom: '30px', cursor: 'pointer' }}>
            <Grid
              container
            >
              <input
                accept="image/*"
                hidden
                id="optional-attachments-button"
                type="file"
                multiple
                onChange={handleOptionalAttachmentChange}
              />
              <label htmlFor="optional-attachments-button" style={{ width: '100%' }}>
                <Grid Item xs={12}>
                  <Grid container>
                    <Grid item xs={10}>
                      Reference image of refashioned piece (Optional)
                    </Grid>
                    <Grid item xs={2}>
                      <SvgIcon
                        fontSize="large"
                        color="action"
                        style={{ color: '#FB7A56' }}
                      >
                        <Next />
                      </SvgIcon>
                    </Grid>
                  </Grid>
                </Grid>
              </label>
              <Grid Item xs={12}>
                {optionalAttachments !== null && optionalAttachments.length > 0 &&
                  <ImageList cols={3}>
                    {Array.from(optionalAttachments).map((img, i) => (
                      <ImageListItem key={i} style={{ width: 100, height: 100, overflow: 'hidden' }} >
                        <img src={img} loading="lazy" style={{ cursor: 'pointer' }} />
                        <ImageListItemBar position="top" sx={{ background: 'none', color: 'black' }}
                          actionIcon={
                            <IconButton onClick={() => handleOptionalImageDelete(img)}>
                              <CancelIcon />
                            </IconButton>
                          } />
                      </ImageListItem>
                    ))}
                  </ImageList>
                }
              </Grid>
            </Grid>
          </TimelineContent>
        </TimelineItem> */}

        <TimelineItem>
          <TimelineOppositeContent
            align="right"
            variant="caption"
            color="text.primary"
            sx={{ padding: 0, 'WebkitFlex': 0 }}
          >
          </TimelineOppositeContent>
          <TimelineSeparator>
            {requestForm[field[4]] === '' || requestForm[field[4]] === null ? <CustomTimelineDot /> : <CustomTimelineFilledDot />}
            <CustomTimelineConnector />
          </TimelineSeparator>
          <TimelineContent onClick={() => setOpenDeadline(true)} sx={{ paddingTop: 0, paddingBottom: '30px', cursor: 'pointer' }}>
            <Grid
              container
            >
              <Grid item xs={10}>
                {requestForm[field[4]] === "" || requestForm[field[4]] === null ? "When do you need it by?" : moment(requestForm[field[4]]).format("DD/MM/yyyy")}
              </Grid>
              <Grid item xs={2}>
                <SvgIcon
                  fontSize="large"
                  color="action"
                  style={{ color: '#FB7A56' }}
                >
                  <Next />
                </SvgIcon>
              </Grid>
            </Grid>
          </TimelineContent>
          <Modal
            open={openDeadline}
            onClose={() => setOpenDeadline(false)}
          >
            <Box style={{ background: 'white', border: '0.1em solid #FB7A56', padding: 20, borderRadius: '1em', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <Typography variant="body1" sx={{ marginBottom: 2 }}>
                When do you need it by?
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Select Deadline"
                  className="datepicker"
                  format="dd/MM/yyyy"
                  name={field[4]}
                  id={field[4]}
                  value={requestForm[field[4]]}
                  clearable
                  minDate={new Date()}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  sx={{ marginBottom: 2, width: '100%' }}
                />
              </LocalizationProvider>
              <CustomButton
                variant="contained"
                color='secondary'
                onClick={() => setOpenDeadline(false)}
                fullWidth
                style={{ float: 'right', bottom: '0', position: 'relative', marginTop: 10 }}
              >
                Save
              </CustomButton>
            </Box>
          </Modal>
        </TimelineItem>

        <TimelineItem>
          <TimelineOppositeContent
            align="right"
            variant="caption"
            color="text.primary"
            sx={{ padding: 0, 'WebkitFlex': 0 }}
          >
          </TimelineOppositeContent>
          <TimelineSeparator>
            {requestForm[field[5]] === '' || requestForm[field[5]] === '' ? <CustomTimelineDot /> : <CustomTimelineFilledDot />}
          </TimelineSeparator>
          <TimelineContent onClick={() => setOpenBudget(true)} sx={{ paddingTop: 0, paddingBottom: '30px', cursor: 'pointer' }}>
            <Grid
              container
            >
              <Grid item xs={10}>
                {requestForm[field[5]] === '' ? "What is your budget?" : `SGD${requestForm[field[5]]}`}
              </Grid>
              <Grid item xs={2}>
                <SvgIcon
                  fontSize="large"
                  color="action"
                  style={{ color: '#FB7A56' }}
                >
                  <Next />
                </SvgIcon>
              </Grid>
            </Grid>
          </TimelineContent>
          <Modal
            open={openBudget}
            onClose={() => setOpenBudget(false)}
          >
            <Box style={{ background: 'white', border: '0.1em solid #FB7A56', padding: 20, borderRadius: '1em', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <Typography variant='body1' sx={{ marginBottom: 2 }} >
                What is your budget?
              </Typography>
              <Box>
                <TextField autoFocus variant="outlined" id={field[5]} name={field[5]} color="secondary" label={field[5]} value={requestForm[field[5]]} onChange={handleChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">SGD</InputAdornment>
                  }}
                  type="number" required
                  error={Number(requestForm[field[5]]) < 0}
                  helperText={Number(requestForm[field[5]]) < 0 && 'Price must be more than 0'}
                />
              </Box>
              <CustomButton
                variant="contained"
                color='secondary'
                onClick={() => setOpenBudget(false)}
                fullWidth
                style={{ float: 'right', bottom: '0', position: 'relative', marginTop: 10 }}
              >
                Save
              </CustomButton>
            </Box>
          </Modal>
        </TimelineItem>
      </Timeline>
      <Grid
        container
        spacing={1}>
        <Grid
          item
          lg={6}
          sm={6}
          xl={6}
          xs={6}
          style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <CustomButton
            onClick={handleDraftSubmit}
            sx={{ background: "#FB7A56", color: " white", fontSize: "small", fontWeight: 'bold', borderRadius: '1em', height: '6em', width: '95%' }}
          >
            Save for later
          </CustomButton>
        </Grid>
        <Grid
          item
          lg={6}
          sm={6}
          xl={6}
          xs={6}
          style={{ display: "flex", flexGrow: 1, justifyContent: "center", alignItems: "center" }}
        >
          <CustomButton
            onClick={handleSubmit}
            color='secondary'
            variant='contained'
            sx={{ height: '100%', width: '95%', fontSize: "small", fontWeight: 'bold' }}
            disabled={requestForm[field[0]] && requestForm[field[1]] && requestForm[field[2]] && requestForm[field[4]] && (attachments[0] || reqImage[0]) && (requestForm[field[5]] > 0) ? false : true}
          //style={requestForm[field[0]] && requestForm[field[1]] && requestForm[field[2]] && requestForm[field[4]] && (attachments[0] || reqImage[0]) && (requestForm[field[5]] > 0) ? validButtonStyle : invalidButtonStyle}
          >
            Publish
          </CustomButton>
        </Grid>
      </Grid>
      <Modal open={isLoading} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card sx={{ height: 200, width: 200 }}>
          <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', margin: 2 }}>
            <Box sx={{ display: 'flex', flexGrow: 1, height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
              <CircularProgress color='secondary' sx={{ marginTop: 5 }} />
              <Typography>Loading...</Typography>
            </Box>
          </CardContent>
        </Card>
      </Modal>
    </>
  );
}
