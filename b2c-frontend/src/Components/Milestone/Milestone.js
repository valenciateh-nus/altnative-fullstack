import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, ImageList, ImageListItem, Typography, } from "@mui/material";
import { withStyles } from "@mui/styles";
import moment from "moment";
import { getMilestoneTitle } from "./MilestoneTypes";
import CustomButton from "../CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { openImageModal } from "../../Redux/actions";
import * as MilestoneTypes from "./MilestoneTypes";
import Delivery from "./Delivery";

import { Box } from "@mui/system";
import MeasurementsCard from "./MeasurementsCard";

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FinalApproval from "./FinalApproval";
import * as MilestoneApi from '../../API/milestoneApi'
import { ConstructionOutlined } from "@mui/icons-material";
import { ERROR } from "../../Redux/actionTypes";
import { apiWrapper } from "../../API";
import MilestoneMenubar from "./MilestoneMenubar";
import ArrowBack from "@mui/icons-material/ArrowBack";
import OfferChatCard from "../Chat/OfferChatCard";
import Review from "./Review";
import { createReview } from "../../API/userApi";
import DisputeListings from "../Dispute/DisputeListings";
import DisputeRefundForm from "../Dispute/DisputeRefundForm";

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

const CustomTimelineConnector = withStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.secondary.light,
  }
}))(TimelineConnector)

export default function Milestone({ orderId, isRefashionerPOV, handleBack, otherUser, order }) {
  const dispatch = useDispatch();
  function handlePhotoModal(images, index) {
    dispatch(openImageModal(images, index))
  }

  const [milestones, setMilestones] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [disputable, setDisputable] = React.useState(false);

  const jntToken = useSelector((state) => state.jntToken);

  React.useEffect(() => {
    loadMilestones();
  }, [])

  async function loadMilestones() {
    setIsLoading(true);
    console.log('loading milestones');
    const res = await apiWrapper(MilestoneApi.retrieveMilestones(orderId,jntToken), 'Could not fetch milestones. Please try again later.', true);
    if(res) {
      setMilestones(res.data)
      setDisputable(res.data.find((x) => x.milestoneEnum === MilestoneTypes.DISPUTE_REQUEST_COMPLETED) === undefined)
    }
    setIsLoading(false);
  }

  async function editMilestone(milestone, index) {
    setIsLoading(true);
    console.log("editing milestone: ", index);
    await apiWrapper(MilestoneApi.editMilestone(milestone), "", true);
    setIsLoading(false);
    const newMilestones = [...milestones]
    newMilestones[index] = milestone
    console.log(newMilestones[index]);
    setMilestones(newMilestones)

  }

  async function editAndCreate(milestoneToCreate, images, milestoneToUpdate) {
    setIsLoading(true);
    await apiWrapper(MilestoneApi.editMilestone(milestoneToUpdate), "", true);
    createMilestone(milestoneToCreate, images)
  }

  async function acceptFinalProduct(remarks, milestoneToUpdate) {
    setIsLoading(true);
    await apiWrapper(MilestoneApi.editMilestone(milestoneToUpdate), "", true);
    await apiWrapper(MilestoneApi.approveFinalProduct(orderId, remarks));
    setIsLoading(false);
    loadMilestones()
  }

  async function rejectFinalProduct(remarks, milestoneToUpdate) {
    setIsLoading(true);
    await apiWrapper(MilestoneApi.editMilestone(milestoneToUpdate), "", true);
    await apiWrapper(MilestoneApi.rejectFinalProduct(orderId, remarks));
    setIsLoading(false);
    loadMilestones()
  }

  async function createMilestone(milestone, images) {
    //create new milestone
    console.log('creating new milestone')

    setIsLoading(true);
    const formData = new FormData();
    milestone = new Blob([JSON.stringify(milestone)], {
      type: "application/json",
    });

    if (images) {
      for (let key of Object.keys(images)) {
        if (key !== 'length') {
          formData.append('files', images[key]);
        }
      }
    }
    formData.append("milestone", milestone)
    await apiWrapper(MilestoneApi.createMilestone(formData, orderId), "", true);
    await loadMilestones()

  }

  async function createReviewFunction(review, milestone, index) {
    setIsLoading(true);
    const res = await apiWrapper(createReview(review), "", true);
    if (res) {
      console.log("REACHES HERE");
      await editMilestone(milestone, index)
      await loadMilestones();
    }
    setIsLoading(false);
  }
  
  function milestoneTypeInput(milestoneType, milestone, isLast, index) {
    switch (milestoneType) {
      case MilestoneTypes.MEASUREMENTS_REQUESTED:
        return <MeasurementsCard milestone={milestone} editMilestone={editMilestone} index={index} isRefashionerPOV={isRefashionerPOV} handleRefresh={loadMilestones} />
      case MilestoneTypes.ARRANGE_FOR_COURIER:
        return <Delivery deliveryId={milestone.remarks} handleRefresh={loadMilestones} />
      case MilestoneTypes.ADD_ON_OFFER_MADE:
      case MilestoneTypes.ADD_ON_ORDER_STARTED:
      case MilestoneTypes.ADD_ON_OFFER_DECLINED:
      case MilestoneTypes.ADD_ON_ORDER_COMPLETE:
        return <OfferChatCard offerId={milestone.offerId} isLast={false} showButtons={!isRefashionerPOV} orderId={orderId} handleRejection={loadMilestones} />
      case MilestoneTypes.PAYMENT:
        return
      case MilestoneTypes.FINAL_APPROVAL_PENDING:
        return <FinalApproval milestone={milestone} approve={acceptFinalProduct} reject={rejectFinalProduct} handleRefresh={loadMilestones} isRefashionerPOV={isRefashionerPOV} />
      case MilestoneTypes.FINAL_APPROVAL_OK:
        return <Review createReview={createReviewFunction} milestone={milestone} otherUser={otherUser} index={index} />
      case MilestoneTypes.DISPUTE_REQUEST_PENDING_REVIEW:
        return <DisputeListings disputeId={milestone.disputeId} />
      default:
        return;
    }
  }

  return (
    !isLoading ? (milestones.length > 0 && <>
      <Grid item container xs={1} justifyContent={'space-between'}>
        <IconButton onClick={handleBack}>
          <ArrowBack />
        </IconButton>
        <MilestoneMenubar isRefashionerPOV={isRefashionerPOV} orderId={orderId} order={order} handleRefresh={loadMilestones} createMilestone={createMilestone} milestoneTypes={milestones.map(({ milestoneEnum }) => milestoneEnum)} disputable={disputable}/>
      </Grid>
      <Grid container item xs={11} sx={{ justifyContent: 'center', overflow: 'scroll', textOverflow: 'scroll' }} >
        <Timeline position="right" sx={{ paddingLeft: 0, paddingRight: 0 }}>
          {milestones.slice().reverse().map((milestone, index) => (
            <TimelineItem key={index}>
              <TimelineOppositeContent
                align="right"
                variant="caption"
                color="text.primary"
                sx={{ paddingTop: 0, 'WebkitFlex': 0, minWidth: '80px', paddingLeft: 0 }}
              >
                {milestone.date ?
                  (index < (milestones.length - 1) && moment(milestones[index].date).isSame(milestones[index + 1].date, 'day') ?
                    moment(milestone.date).format("hh:mm")
                    :
                    moment(milestone.date).format("DD MMM YY hh:mm")
                  )
                  : ""}

              </TimelineOppositeContent>

              <TimelineSeparator>
                <CustomTimelineDot />
                {index !== (milestones.length - 1) && <CustomTimelineConnector />}
              </TimelineSeparator>

              <TimelineContent sx={{ paddingTop: 0, paddingBottom: '30px', paddingRight: 0, }}>
                {getMilestoneTitle(milestone.milestoneEnum, milestone.remarks, !isRefashionerPOV, otherUser)}
                {milestone.images.length > 0 &&
                  <ImageList cols={milestone.images.length > 1 ? 2 : 1} rows={milestone.images.length >= 3 ? 2 : 1} sx={{ width: 204, height: `${milestone.images.length >= 3 ? 204 : 102}`, overflow: 'hidden' }}>
                    {milestone.images.map((img, i) => (
                      i < 4 && (i < 3 ?
                        <ImageListItem key={i} style={{ width: milestone.images.length > 1 ? 100 : 200, height: milestone.images.length > 1 ? 100 : 200, overflow: 'hidden' }} >
                          <img src={`${img.url}`} loading="lazy" onClick={() => handlePhotoModal(milestone.images.map(({ url }) => url), i)} style={{ cursor: 'pointer' }} />
                        </ImageListItem> :
                        (milestone.images.length > 4 ?
                          <Box sx={{ backgroundImage: `url(${img.url})`, backgroundSize: 100, width: 100, height: 100, boxShadow: 'inset 0 0 0 50vw rgba(251,122,86,0.6)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            onClick={() => handlePhotoModal(milestone.images.map(({ url }) => url), 3)} style={{ cursor: 'pointer' }}
                          >
                            <Typography variant='h4' color='white'>
                              +{milestone.images.length - 4}
                            </Typography>
                          </Box>
                          : <ImageListItem key={i} style={{ width: 100, height: 100, overflow: 'hidden' }} >
                            <img src={`${img.url}`} loading="lazy" onClick={() => handlePhotoModal(milestone.images.map(({ url }) => url), i)} style={{ cursor: 'pointer' }} />
                          </ImageListItem>)
                      )))}
                  </ImageList>
                }
                <Box sx={{ overflow: 'scroll' }}>
                  {milestoneTypeInput(milestone.milestoneEnum ? milestone.milestoneEnum : "", milestone, index === 0 ? true : false, index)}
                </Box>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Grid>
    </>
    ) : <Box sx={{ display: 'flex', flexGrow: 1, height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <CircularProgress color='secondary' sx={{ marginBottom: 2 }} />
      <Typography>Loading milestones...</Typography>
    </Box>
  );
}
