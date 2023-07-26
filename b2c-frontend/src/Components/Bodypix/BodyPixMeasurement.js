import React from "react";
import * as tf from "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import Webcam from "react-webcam";
import { drawKeypoints, drawSkeleton } from './utilities';
import InContainerLoading from "../InContainerLoading";
import { Box, Card, CardContent, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputAdornment, Modal, TextField, Typography, useMediaQuery } from "@mui/material";
import { drawerWidth } from "../../constants";
import * as mathjs from "mathjs"
import * as calculations from "./calculations"
import CustomButton from "../CustomButton";
import { InfoOutlined } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import PropTypes from 'prop-types';
import { useContainerDimensions } from "../../Hooks/useContainerDimensions";

const messages = {
  0 : 'Please face forward, ensure that your body covers most of the frame.',
  1 : 'Please turn to the right.',
  2 : 'Check results.',
  3 : 'Please adjust.'
}

export const rainbow = [
  [110, 64, 170], [143, 61, 178], [178, 60, 178], [210, 62, 167],
  [238, 67, 149], [255, 78, 125], [255, 94, 99],  [255, 115, 75],
  [255, 140, 56], [239, 167, 47], [217, 194, 49], [194, 219, 64],
  [175, 240, 91], [135, 245, 87], [96, 247, 96],  [64, 243, 115],
  [40, 234, 141], [28, 219, 169], [26, 199, 194], [33, 176, 213],
  [47, 150, 224], [65, 125, 224], [84, 101, 214], [99, 81, 195]
];


const minConfidence = 0.8;
const minSamples = 20;
const maxSamples = 200;

const initForm = {sleeveLength : 10, shoulderWidth : null, chestCircumference : null, hips : null, legLength: null, ptp: null, torsoLength : null, thighCircumference : null, kneeCircumference : null, calfCircumference : null}

export default function BodyPixMeasurement({open, onSubmit, onClose}) {
  const notHidden = useMediaQuery(theme => theme.breakpoints.up('md'));
  const webcamRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const canvasPointsRef = React.useRef(null);
  const messageRef = React.useRef(null);
  const [knownHeight, setKnownHeight] = React.useState(0);
  const [heightInputText, setHeightInputText] = React.useState(0);
  const [start, setStart] = React.useState(false);
  
  const[isLoading, setIsLoading] = React.useState(false);
  const[measurements, setMeasurements] = React.useState([]);
  const[mesaurementsSide, setMeasurementsSide] = React.useState([]);
  const[finalMeasurements, setFinalMeasurements] = React.useState(initForm);
  const[message, setMessage] = React.useState('');
  const[showResults, setShowResults] = React.useState(false);
  const[webcamDimensions, setWebcamDimensions] = React.useState({width: 0, height: 0});
  let interval;

  //  Load posenet
  const runPosenet = async () => {
    //setIsLoading(true);

    const net = await bodyPix.load({
      architecture: 'MobileNetV1',
      outputStride: 16,
      multiplier: 0.75,
      quantBytes: 2
    });
    setIsLoading(false);
    setMessage(messages[0])
    setTimeout(() => {
      console.log("STARTING TRACK");
      setMessage('');
      interval = setInterval(() => {
        detect(net);
      }, 100);
    },7000)
    
    //return net;
  };

  React.useEffect(() => {
    if( webcamRef === null) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  },[webcamRef])

  function handleConfirm() {
    onSubmit(finalMeasurements);
    restartStates();
    setKnownHeight(0)
  }


  function restartStates() {
    setShowResults(false);
    setFinalMeasurements(initForm);
    setMeasurements([]);
    setMeasurementsSide([]);
    setStart(false);
    interval && clearInterval(interval);
  }

  function handleHeightSubmit() {
    setKnownHeight(heightInputText);
    setMessage('Please adjust your camera such that it is at about waist level and your entire body occupies as much of the screen as possible. Click start to begin');
    setTimeout(() => {
      setMessage('');
    },7000)
  }

  function handleRetake() {
    restartStates();
    setMessage('Please adjust your camera such that it is at about waist level and your entire body occupies as much of the screen as possible. Click start to begin');
  }

  const handleHeightInput = (e) => {
    setHeightInputText(e.target.value);
  }

  function handleStart() {
    setStart(true);
    setMeasurements([]);
    setMeasurementsSide([]);
    setFinalMeasurements(initForm);
    interval && clearInterval(interval);
    runPosenet();
  }

  const onUserMedia = (e) => {
    console.log('SUCCESS LOAD CAMERA: ' , e);
  };

  const onUserMediaError = (e) => {
    console.log('FAILED TO LOAD CAMERA: ', e);
  }

  React.useEffect(() => {
      if(measurements.length >= minSamples) {
        console.log("AVG MEASUREMENT: ");
        //console.log("MEASUREMENTS: " + JSON.stringify(measurements));
        //measurements.reduce((a,b) => a+b, 0)/measurements.length);
        let shoulderLengths = [];
        let sleeveLengths = [];
        let legLengths = [];
        let recentMeasurements = measurements.slice(measurements.length >= maxSamples? measurements.length - maxSamples : 0, )
        recentMeasurements.forEach((measurement) => shoulderLengths.push(calculations.calculateLength([calculations.keypointMapping.leftShoulder, calculations.keypointMapping.rightShoulder], measurement.keypoints, measurement.scale)));
        recentMeasurements.forEach((measurement) => sleeveLengths.push(calculations.calculateLength([calculations.keypointMapping.leftShoulder, calculations.keypointMapping.leftElbow, calculations.keypointMapping.leftWrist], measurement.keypoints, measurement.scale)));
        recentMeasurements.forEach((measurement) => sleeveLengths.push(calculations.calculateLength([calculations.keypointMapping.rightShoulder, calculations.keypointMapping.rightElbow, calculations.keypointMapping.rightWrist], measurement.keypoints, measurement.scale)));
        recentMeasurements.forEach((measurement) => legLengths.push(calculations.calculateLength([calculations.keypointMapping.leftHip, calculations.keypointMapping.leftKnee, calculations.keypointMapping.leftAnkle], measurement.keypoints, measurement.scale)));
        recentMeasurements.forEach((measurement) => legLengths.push(calculations.calculateLength([calculations.keypointMapping.rightHip, calculations.keypointMapping.rightKnee, calculations.keypointMapping.rightAnkle], measurement.keypoints, measurement.scale)));
        //console.log("SHOULDER  MEASUREMENTS: " + shoulderLengths)
        //console.log("SLEEVE  MEASUREMENTS: " + sleeveLengths)
        let shoulderWidth = calculations.calculateAverage(shoulderLengths)
        let sleeveLength = calculations.calculateAverage(sleeveLengths)
        let legLength = calculations.calculateAverage(legLengths);
        console.log("AVG SHOULDER WIDTH: " + shoulderWidth);
        console.log("AVG SLEEVE LENGTH: " + sleeveLength);
        console.log("AVG LEG LENGTHS: " + legLength)
        setFinalMeasurements({...finalMeasurements, sleeveLength : Math.round(sleeveLength), shoulderWidth : Math.round(shoulderWidth), legLength : Math.round(legLength)});
        setMessage(messages[1])
      }
    
  },[measurements])

  React.useEffect(() => {
    if(message === messages[1] && mesaurementsSide.length > 0) {
      setMessage('');
    } 
  },[message,mesaurementsSide])

  React.useEffect(() => {
    if(mesaurementsSide.length >= minSamples && measurements.length >= minSamples) {
      console.log("AVG MEASUREMENTS: ") 
      let hipLengths = [];
      let chestDepths = [];
      let chestLengths = [];
      let hipToGroinLengths = [];
      let hipToButtLengths = [];
      let upperBackDepths = [];
      let hipsDepths = [];
      let torsoLengths = [];
      let legDepths = [];
      let kneeDepths = [];
      let calfDepths = [];
      let legWidths = [];
      let kneeWidths = [];
      let calfWidths = [];

      let recentMeasurements = measurements.slice(measurements.length >= maxSamples? measurements.length - maxSamples : 0, )
      let recentSideMeasurements = mesaurementsSide.slice(mesaurementsSide.length >= 100? mesaurementsSide.length - 100 : 0, );
      recentMeasurements.forEach((measurement) => hipLengths.push(calculations.calculateLengthXPos([calculations.keypointMapping.leftHip, calculations.keypointMapping.rightHip], measurement.keypoints, measurement.scale)));
      recentMeasurements.forEach((measurement) => chestLengths.push(calculations.calculateLengthXPos([calculations.keypointMapping.leftPit, calculations.keypointMapping.rightPit], measurement.keypoints, measurement.scale)));
      
      recentMeasurements.forEach((measurement) => legWidths.push(calculations.calculateLengthXPos([calculations.keypointMapping.leftThighOuter, calculations.keypointMapping.leftThighInner], measurement.keypoints, measurement.scale)));
      recentMeasurements.forEach((measurement) => kneeWidths.push(calculations.calculateLengthXPos([calculations.keypointMapping.leftKneeOuter, calculations.keypointMapping.leftKneeInner], measurement.keypoints, measurement.scale)));
      recentMeasurements.forEach((measurement) => calfWidths.push(calculations.calculateLengthXPos([calculations.keypointMapping.leftCalfOuter, calculations.keypointMapping.leftCalfInner], measurement.keypoints, measurement.scale)));

      recentSideMeasurements.forEach((measurement) => chestDepths.push(calculations.calculateLengthXPos([calculations.sideKeypointMapping.leftShoulder, calculations.sideKeypointMapping.chest], measurement.keypoints, measurement.scale)));
      recentSideMeasurements.forEach((measurement) => upperBackDepths.push(calculations.calculateLengthXPos([calculations.sideKeypointMapping.leftShoulder, calculations.sideKeypointMapping.upperBack], measurement.keypoints, measurement.scale)));
      recentSideMeasurements.forEach((measurement) => hipToButtLengths.push(calculations.calculateLengthXPos([calculations.sideKeypointMapping.butt, calculations.sideKeypointMapping.leftHip], measurement.keypoints, measurement.scale)));
      recentSideMeasurements.forEach((measurement) => hipToGroinLengths.push(calculations.calculateLengthXPos([calculations.sideKeypointMapping.groin, calculations.sideKeypointMapping.leftHip], measurement.keypoints, measurement.scale)));
      recentSideMeasurements.forEach((measurement) => torsoLengths.push(calculations.calculateLengthYPos([calculations.sideKeypointMapping.leftShoulder, calculations.sideKeypointMapping.groin], measurement.keypoints, measurement.scale)));
      recentSideMeasurements.forEach((measurement) => hipsDepths.push(calculations.calculateLength([calculations.sideKeypointMapping.butt, calculations.sideKeypointMapping.groin], measurement.keypoints, measurement.scale)));

      recentSideMeasurements.forEach((measurement) => legDepths.push(calculations.calculateLengthXPos([calculations.sideKeypointMapping.backLeg, calculations.sideKeypointMapping.frontLeg], measurement.keypoints, measurement.scale)));
      recentSideMeasurements.forEach((measurement) => kneeDepths.push(calculations.calculateLengthXPos([calculations.sideKeypointMapping.backKnee, calculations.sideKeypointMapping.frontKnee], measurement.keypoints, measurement.scale)));
      recentSideMeasurements.forEach((measurement) => calfDepths.push(calculations.calculateLengthXPos([calculations.sideKeypointMapping.backCalf, calculations.sideKeypointMapping.frontCalf], measurement.keypoints, measurement.scale)));

      //console.log("HIP LENGTHS: " + hipLengths)
      let hipLength = calculations.calculateAverage(hipLengths)
      //console.log("AVG HIP LENGTH: " + hipLength)
      let chestDepth = calculations.calculateAverage(chestDepths)
      let upperBackDepth = calculations.calculateAverage(upperBackDepths);
      let chestLength = calculations.calculateAverage(chestLengths)
      //console.log("AVG PTP LENGTH: " + chestLength)
      //let hipToGroinLength = calculations.calculateAverage(hipToGroinLengths);
      //console.log("AVG HIP-TO-GROIN LENGTH: " + hipToGroinLength)
      //let hipToButtLength = calculations.calculateAverage(hipToButtLengths);
      //console.log("AVG HIP-TO-BUTT LENGTH: " + hipToButtLength)
      let pitToPitLength = calculations.calculateEllipsePerimeter(chestLength/2,chestDepth)/2;
      let chestCircumference = calculations.calculateEllipsePerimeter(chestLength/2,chestDepth)/2 + calculations.calculateEllipsePerimeter(chestLength/2,upperBackDepth)/2;
      //let hipSize = calculations.calculateEllipsePerimeter(hipLength/2,hipToButtLength)/2 + calculations.calculateEllipsePerimeter(hipLength/2,hipToGroinLength)/2;
      let torsoLength = calculations.calculateAverage(torsoLengths);
      //console.log("AVG TORSO LENGTH: " + torsoLength)
      let hipsDepth = calculations.calculateAverage(hipsDepths);
      //console.log("AVG HIP DEPTH: " + hipsDepth)
      let hipSize = calculations.calculateEllipsePerimeter(hipLength/2,hipsDepth/2);

      let legWidth = calculations.calculateAverage(legWidths);
      let kneeWidth = calculations.calculateAverage(kneeWidths);
      let calfWidth = calculations.calculateAverage(calfWidths);

      let legDepth = calculations.calculateAverage(legDepths);
      let kneeDepth = calculations.calculateAverage(kneeDepths);
      let calfDepth = calculations.calculateAverage(calfDepths);

      let thighCircumference = calculations.calculateEllipsePerimeter(legDepth/2, legWidth/2);
      let kneeCircumference = calculations.calculateEllipsePerimeter(kneeDepth/2, kneeWidth/2);
      let calfCircumference = calculations.calculateEllipsePerimeter(calfDepth/2, calfWidth/2);

      //console.log("AVG THIGH CIRC: " + thighCircumference);
      //console.log("AVG KNEE CIRC: " + kneeCircumference);
      //console.log("AVG CALF CIRC: " + calfCircumference);
      //console.log("AVG CHEST SIZE: " + chestCircumference);
      //console.log("AVG HIP SIZE: " + hipSize);
      setFinalMeasurements({...finalMeasurements, chestCircumference : Math.round(chestCircumference), hips : Math.round(hipSize), ptp : Math.round(pitToPitLength), torsoLength : Math.round(torsoLength), thighCircumference : Math.round(thighCircumference), kneeCircumference: Math.round(kneeCircumference), calfCircumference : Math.round(calfCircumference)});

    }
  },[mesaurementsSide,measurements])

  React.useEffect(() => {
    if(Object.entries(finalMeasurements).filter(([k,v],i)=>v === null).length === 0) {
      // Object.entries(finalMeasurements).forEach(([k,v],i) => {
      //   console.log(k, ": ", v);
      // })
      clearInterval(interval);
      setShowResults(true);
    }
  },[finalMeasurements])

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Make Detections
      const pose = await net.segmentPersonParts(video, {
        flipHorizontal: true
      });

      //console.log(pose.allPoses[0].keypoints)
      let stdDevArr = pose.allPoses[0].keypoints.slice(5,).filter((keypoint) => keypoint.score >= minConfidence).map((keypoint) => keypoint.position.x)
      
      //console.log("STD DEV: ", stdDev);
      //console.log(stdDev < 50 ? 'FACING SIDEWAYS?' : 'FACING FRONT')

      const coloredPartImage = bodyPix.toColoredPartMask(pose, rainbow);
      const opacity = 0.7;
      const flipHorizontal = true;
      const maskBlurAmount = 0;
      const canvas = canvasRef.current;
      const canvasPoints = canvasPointsRef.current;

      bodyPix.drawMask(
        canvas,
        video,
        coloredPartImage,
        opacity,
        maskBlurAmount,
        flipHorizontal
      );

      if(stdDevArr.length === 0) {
        return;
      }
      const stdDev = mathjs.std(stdDevArr) || 10000;

      //return getSideMeasurements(pose, video, canvasPoints);
      if(stdDev < 25) {
        return getSideMeasurements(pose, video, canvasPoints);
      } else if(stdDev > 40) {
        // if(measurements.length > minSamples && message.length === 0) {
        //   setMessage('Please turn to the right, without moving front or forward')
        // }
        return getFrontMeasurements(pose, video, canvasPoints);
      }
    }
  };

  function getSideMeasurements(pose,video,canvas) {

    const req = [calculations.sideKeypointMapping.leftAnkle, calculations.sideKeypointMapping.leftElbow, calculations.sideKeypointMapping.leftHip, calculations.sideKeypointMapping.leftKnee, calculations.sideKeypointMapping.leftShoulder]

    // for(var i = 0; i < req.length; i++) {
    //   if(pose.allPoses[0].keypoints[req[i]].score < minConfidence) {
    //     canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
    //     return;
    //   }
    // }

    const top = calculations.findFromLeftRightDown(pose, [0,1],pose.width, pose.height);
    const bottom = top && calculations.findFromRightLeftUp(pose, [23,24],pose.width, pose.height);

    //prev findFromLeftDownRight
    const chest = bottom && calculations.findFromLeftDownRight(pose, [12], pose.width, 
      pose.height,pose.allPoses[0].keypoints[calculations.keypointMapping.leftShoulder].position, 
      (x, y, bound, height, width) => {return y < (bound.y + (height * 0.1)) ? [y, x] : null});

    const butt = chest && calculations.findRightUpLeft(pose, [13], 
      pose.width, pose.height, pose.allPoses[0].keypoints[calculations.keypointMapping.leftHip].position,
      (x, y, bound, height, width) => {return y > (bound.y - (height * 0.1)) ? [y, x] : null},
      (x, y, bound, height, width) => {return y < (bound.y - (height * 0.1)) ? true : false});

    const groin = butt &&  calculations.findLeftRightUp(pose, [12], pose.width, pose.height);

    const upperBack = groin && calculations.findRightUpLeft(pose, [13],pose.width, pose.height, 
      pose.allPoses[0].keypoints[calculations.keypointMapping.leftShoulder].position,
      (x, y, bound, height, width) => {return y > (bound.y - (height * 0.1)) ? [y, x] : null},
      (x, y, bound, height, width) => {return y > (bound.y + (height * 0.1)) ? true : false})
      ;

    const frontLeg = upperBack && calculations.findFromLeftUpRight(pose, [14], pose.width, pose.height, 
      pose.allPoses[0].keypoints[calculations.keypointMapping.leftHip].position,
      (x, y, bound, height, width) => {return y > (bound.y + (height * 0.1)) ? [y, x] : null});

    const backLeg = frontLeg && calculations.findRightUpLeft(pose, [15], pose.width, pose.height,
      pose.allPoses[0].keypoints[calculations.keypointMapping.leftHip].position,
      (x, y, bound, height, width) => {return y > (bound.y + (height * 0.1)) ? [y, x] : null});

    const backKnee = backLeg && calculations.findRightUpLeft(pose, [19], 
      pose.width, pose.height, pose.allPoses[0].keypoints[calculations.keypointMapping.leftKnee].position,
      (x, y, bound, height, width) => {return y > (bound.y - (height * 0.05)) && y < (bound.y + (height * 0.05)) ? [y, x] : null},
      (x, y, bound, height, width) => {return y < (bound.y + (height * 0.05)) ? true : false});
  
    const frontKnee = backKnee && calculations.findFromLeftUpRight(pose, [18], pose.width, pose.height, 
      pose.allPoses[0].keypoints[calculations.keypointMapping.leftKnee].position,
      (x, y, bound, height, width) => {return y > (bound.y - (height * 0.05)) && y < (bound.y + (height * 0.05)) ? [y, x] : null},
      (x, y, bound, height, width) => {return y < bound.y + height * 0.05 ? true : false});

    const backCalf = frontKnee && calculations.findRightUpLeft(pose, [19], pose.width, pose.height,
      pose.allPoses[0].keypoints[calculations.keypointMapping.leftKnee].position,
      (x, y, bound, height, width) => {return y > (bound.y + (height * 0.1)) ? [y, x] : null});
    const frontCalf = backCalf && calculations.findFromLeftUpRight(pose, [18], pose.width, pose.height,
      pose.allPoses[0].keypoints[calculations.keypointMapping.leftKnee].position,
      (x, y, bound, height, width) => {return y > (bound.y + (height * 0.1)) ? [y, x] : null})

    if(!top || !bottom || !chest || !butt || !groin || !upperBack || !frontLeg || !backLeg || !backKnee || !frontKnee || !backCalf || !frontCalf || pose.allPoses[0].keypoints[calculations.keypointMapping.leftShoulder].score < minConfidence || pose.allPoses[0].keypoints[calculations.keypointMapping.leftHip].score < minConfidence) {
      canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
      return;
    }

    pose.allPoses[0].keypoints.push({part: 'top', position: {x: top[1], y: top[0]}, score: 1});
    pose.allPoses[0].keypoints.push({part: 'bottom', position: {x: bottom[1], y: bottom[0]}, score: 1});
    pose.allPoses[0].keypoints.push({part: 'chest', position: {x: chest[1], y: chest[0]}, score: 1})
    pose.allPoses[0].keypoints.push({part: 'butt', position: {x: butt[1], y: butt[0]}, score: 1})
    pose.allPoses[0].keypoints.push({part: 'groin', position: {x: groin[1], y: groin[0]}, score: 1})
    pose.allPoses[0].keypoints.push({part: 'upperBack', position: {x: upperBack[1], y: upperBack[0]}, score: 1})
    pose.allPoses[0].keypoints.push({part: 'backLeg', position: {x: backLeg[1], y: backLeg[0]}, score: 1})
    pose.allPoses[0].keypoints.push({part: 'frontLeg', position: {x: frontLeg[1], y: frontLeg[0]}, score: 1})
    pose.allPoses[0].keypoints.push({part: 'backKnee', position: {x: backKnee[1], y: backKnee[0]}, score: 1})
    pose.allPoses[0].keypoints.push({part: 'frontKnee', position: {x: frontKnee[1], y: frontKnee[0]}, score: 1})
    pose.allPoses[0].keypoints.push({part: 'backCalf', position: {x: backCalf[1], y: backCalf[0]}, score: 1})
    pose.allPoses[0].keypoints.push({part: 'frontCalf', position: {x: frontCalf[1], y: frontCalf[0]}, score: 1})
    
    drawCanvas(pose.allPoses[0], video, pose.width, pose.height, canvas);

    var pxScale = 0;
    if(top && bottom) {
      const heightInPixels = calculations.calculateLength([calculations.keypointMapping.top,calculations.keypointMapping.bottom], pose.allPoses[0].keypoints, 1);
      console.log("HEIGHT IN PX:", heightInPixels);
      pxScale = calculations.getScale(pose, knownHeight);
    }
    if(pxScale === 0) {
      return;
    }
    let newMeasurement = {keypoints: pose.allPoses[0].keypoints, scale: pxScale};
    setMeasurementsSide((prevMeasurements) => [...prevMeasurements, newMeasurement])
    
  }

  function getFrontMeasurements(pose,video,canvas) {

    for(const point of pose.allPoses[0].keypoints) {
        if(point.score < minConfidence) {
            canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
            return;
        }
    }
    const top = calculations.findFromLeftRightDown(pose, [0,1],pose.width, pose.height);
    const bottom = top && calculations.findFromRightLeftUp(pose, [23,24],pose.width, pose.height);

    const rightShoulder = bottom && calculations.findFromLeftDownRight(pose, [12], pose.width, pose.height,
      pose.allPoses[0].keypoints[calculations.keypointMapping.rightShoulder].position,
      (x, y, bound, height, width) => { return y < (bound.y + (height * 0.1)) ? [y, x] : null });

    const leftShoulder = rightShoulder && calculations.findFromRightDownLeft(pose, [12], pose.width, pose.height,
      pose.allPoses[0].keypoints[calculations.keypointMapping.leftShoulder].position,
      (x, y, bound, height, width) => { return y < (bound.y + (height * 0.1)) ? [y, x] : null });

    const leftHip = leftShoulder && calculations.findRightUpLeft(pose, [12], pose.width, pose.height, 
      pose.allPoses[0].keypoints[calculations.keypointMapping.leftHip].position,
      (x, y, bound, height, width) => { return y > (bound.y - (height * 0.1)) && x > bound.x ? [y, x] : null });

    const rightHip = leftHip && calculations.findFromLeftUpRight(pose, [12], pose.width, pose.height, 
      pose.allPoses[0].keypoints[calculations.keypointMapping.rightHip].position,
      (x, y, bound, height, width) => {return y > (bound.y - (height * 0.1)) && x < bound.x ? [y, x] : null });

    const leftThighOuter = rightHip && calculations.findRightUpLeft(pose, [14], pose.width, pose.height, 
      pose.allPoses[0].keypoints[calculations.keypointMapping.leftHip].position,
      (x, y, bound, height, width) => { return y > (bound.y + (height * 0.1)) ? [y, x] : null });
      
    const leftThighInner = leftThighOuter && calculations.findFromLeftUpRight(pose, [14], pose.width, pose.height);

    const leftKneeOuter = leftThighInner && calculations.findRightUpLeft(pose, [18], pose.width, pose.height, 
      pose.allPoses[0].keypoints[calculations.keypointMapping.leftKnee].position,
      (x, y, bound, height, width) => {return y > (bound.y) && y < (bound.y + (height * 0.05)) ? [y, x] : null},
      (x, y, bound, height, width) => {return y > (bound.y + (height * 0.05)) ? true : false});
      
    const leftKneeInner = leftKneeOuter && calculations.findFromLeftUpRight(pose, [18], pose.width, pose.height,
      pose.allPoses[0].keypoints[calculations.keypointMapping.leftKnee].position,
      (x, y, bound, height, width) => {return y > (bound.y) && y < (bound.y + (height * 0.05)) ? [y, x] : null},
      (x, y, bound, height, width) => {return y > (bound.y + (height * 0.05)) ? true : false});

    const leftCalfInner = leftKneeInner && calculations.findFromLeftUpRight(pose, [18], pose.width, pose.height, 
      pose.allPoses[0].keypoints[calculations.keypointMapping.leftKnee].position,
      (x, y, bound, height, width) => {return y > (bound.y + (height * 0.1)) ? [y, x] : null});
      
    const leftCalfOuter = leftCalfInner && calculations.findRightUpLeft(pose, [18], pose.width, pose.height, 
      pose.allPoses[0].keypoints[calculations.keypointMapping.leftKnee].position,
      (x, y, bound, height, width) => {return y > (bound.y + (height * 0.1)) ? [y, x] : null});


    if(!top || !bottom || !rightShoulder || !leftShoulder || !leftHip || !rightHip || !leftThighInner || !leftThighOuter 
        || !leftKneeOuter || !leftKneeInner || !leftCalfInner || !leftCalfOuter) {
      canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
      return;
    }

    pose.allPoses[0].keypoints.push({part: 'top', position: {x: top[1], y: top[0]}, score: 1});
    pose.allPoses[0].keypoints.push({part: 'bottom', position: {x: bottom[1], y: bottom[0]}, score: 1});
    pose.allPoses[0].keypoints.push({part: 'rightPit', position: pose.allPoses[0].keypoints[6].position, score: 1})
    pose.allPoses[0].keypoints[6] = {part: 'rightShoulder', position: {x: rightShoulder[1], y: rightShoulder[0]}, score: 1}
    pose.allPoses[0].keypoints.push({part: 'leftPit', position: pose.allPoses[0].keypoints[5].position, score: 1})
    pose.allPoses[0].keypoints[5] = {part: 'leftShoulder', position: {x: leftShoulder[1], y: leftShoulder[0]}, score: 1}
    pose.allPoses[0].keypoints[11] = {part: 'leftHip', position: {x: leftHip[1], y: leftHip[0]}, score: 1}
    pose.allPoses[0].keypoints[12] = {part: 'rightHip', position: {x: rightHip[1], y: rightHip[0]}, score: 1}
    pose.allPoses[0].keypoints.push({part: 'leftThighOuter', position: {x: leftThighOuter[1], y: leftThighOuter[0]}, score: 1})
    pose.allPoses[0].keypoints.push({part: 'leftThighInner', position: {x: leftThighInner[1], y: leftThighInner[0]}, score: 1})
    pose.allPoses[0].keypoints.push({part: 'leftKneeOuter', position: {x: leftKneeOuter[1], y: leftKneeOuter[0]}, score: 1})
    pose.allPoses[0].keypoints.push({part: 'leftKneeInner', position: {x: leftKneeInner[1], y: leftKneeInner[0]}, score: 1})
    pose.allPoses[0].keypoints.push({part: 'leftCalfOuter', position: {x: leftCalfOuter[1], y: leftCalfOuter[0]}, score: 1})
    pose.allPoses[0].keypoints.push({part: 'leftCalfInner', position: {x: leftCalfInner[1], y: leftCalfInner[0]}, score: 1})
    //console.log(pose);
    //drawCanvas(pointsToDraw,video, pose.width, pose.height, canvasPoints);
    drawCanvas(pose.allPoses[0], video, pose.width, pose.height, canvas);

    var pxScale = 0;
    if(top && bottom) {
      const heightInPixels = calculations.calculateLength([calculations.keypointMapping.top,calculations.keypointMapping.bottom], pose.allPoses[0].keypoints, 1);
      console.log("HEIGHT IN PX:", heightInPixels);
      pxScale = calculations.getScale(pose, knownHeight);
    }
    if(pxScale === 0) {
      return;
    }
    let newMeasurement = {keypoints: pose.allPoses[0].keypoints, scale: pxScale};
    setMeasurements((prevMeasurements) => [...prevMeasurements, newMeasurement])

  }

  const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
    const ctx = canvas.getContext("2d");
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    drawKeypoints(pose.keypoints, 0.6, ctx, videoWidth);
    //drawSkeleton(pose.keypoints.keypoints, 0.7, ctx);
  };

  return (
    <>
        <Modal open={open} onBackdropClick={onClose}>
          <Box>
            <Webcam
            mirrored={true}
            ref={webcamRef}
            onUserMedia={onUserMedia}
            onUserMediaError={onUserMediaError}
            style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign : 'center',width: 'auto', height: 640, zIndex: 9
            }}
            />
            <canvas
            ref={canvasRef}
            style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign : 'center', width: 'auto', height: 640, zIndex: 9
            }}
            />
            <canvas
            ref={canvasPointsRef}
            style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign : 'center', width: 'auto', height: 640, zIndex: 10,
            }}
            />
            <CustomButton size='large' variant = 'contained' color='secondary' onClick={!start ? handleStart : handleRetake}
            sx={{position: 'absolute', top: `calc(50% + ${640/2}px)`, left: '50%', transform: 'translate(-50%, -50%)', zIndex: 11,}}
            >
              {!start ? 'Start' : 'Restart'}
            </CustomButton>
          </Box>
        </Modal>
        <Modal open={open && message.length > 0} sx= {{display : 'flex', justifyContent: 'center', alignItems : 'center'}} onClick={() => setMessage('')}>
          <Box sx={{display: 'flex', textAlign: 'center', justifyContent : 'center', alignItems : 'center', flexDirection : 'column', margin : 2, maxWidth: 640}}>
            <Typography variant="h4" color='white'>{message}</Typography>
          </Box>
        </Modal>
        <Modal open={open && knownHeight === 0} onBackdropClick={onClose} sx= {{display : 'flex', justifyContent: 'center', alignItems : 'center'}}>
          <Card sx={{display: 'flex', justifyContent : 'center', alignItems : 'center', flexDirection : 'column', margin : 2, maxWidth: 640, backgroundColor : 'primary.veryLight'}}>
            <CardContent>
              <Typography variant='body1' sx={{mb: 2}}>Please enter your height</Typography>
              <TextField variant='outlined' size='medium' placeholder="Enter height" type='number'
                InputProps={{ 
                  endAdornment : <InputAdornment position="end">cm</InputAdornment>,
                }}
                label='Height'
                name='height-input'
                id='height-input'
                value = {heightInputText}
                onChange = {handleHeightInput}
                fullWidth
              />
              <CustomButton variant='contained' color="secondary"
                onClick={handleHeightSubmit}
                disabled={heightInputText <= 0}
                fullWidth
                sx={{ mt: 3, mb: 2 }}
              >Confirm height</CustomButton>
            </CardContent>
          </Card>
        </Modal>
        <Dialog
            open={open && showResults}
            onClose={handleRetake}
            aria-labelledby="alert-dialog-approve-measurements"
            aria-describedby="alert-dialog-approve-measurements"
        >
            <Box sx={{backgroundColor : 'primary.light', display:'flex', flexDirection:'row', width: 'auto', maxHeight: 640, overflow: 'scroll'}}>
                <Box sx={{display : 'flex', justifyContent:'center', width: '15%', minWidth: '64px', paddingTop : '16px'}}>
                  <InfoOutlined fontSize='large'/>
                </Box>
                <Box>
                  <DialogTitle id="final-rejection" sx={{paddingLeft: 0, paddingRight: 0}}>
                      Use Predicted Measurements?
                  </DialogTitle>
                  <DialogContent sx={{padding: 0, overflow: 'scroll', mb: 2}}>
                    <DialogContentText id="alert-dialog-description">
                      The measurements predicted are not meant to be taken as absolute measurements Only use these predictions as an approximation to your actual measurements.
                    </DialogContentText>
                    {Object.entries(finalMeasurements).map(([k,v],i) => {
                      return <TextField label={k} 
                        sx={{
                          mt:2, 
                          "& .MuiInputBase-input.Mui-disabled": {
                            color: "black",
                            "-webkit-text-fill-color": "black",
                            borderColor: "black"
                          },
                          "& .Mui-disabled .MuiOutlinedInput-notchedOutline": {
                            borderColor: "black"
                          },
                          "& .MuiInputLabel-root.Mui-disabled": {
                            color:'black'
                          }
                        }} 
                      value={v} fullWidth disabled={true} placeholder ={k} 
                      InputProps={{ endAdornment : <InputAdornment position="end">cm</InputAdornment> }} key={`${k}-${i}`}/>
                    })}
                  </DialogContent>
                  <DialogActions>
                      <CustomButton variant='contained' onClick={handleRetake} sx={{backgroundColor:'secondary.light',mb:4}}>Retake measurements</CustomButton>
                      <CustomButton variant='contained' color="secondary" onClick={handleConfirm} sx={{mb:4}}>
                          Confirm
                      </CustomButton>
                  </DialogActions>
                </Box>
                <Box sx={{display : 'flex', justifyContent:'center', width: '15%', minWidth: '64px', paddingTop : '16px'}}/>
            </Box>
        </Dialog>
    </>
  );
}

BodyPixMeasurement.propTypes = {
  open : PropTypes.bool.isRequired,
  onSubmit : PropTypes.func.isRequired,
  onClose : PropTypes.func,
};
BodyPixMeasurement.defaultProps = {
  open : false,
  onSubmit : () => ({}),
  onClose :  () => ({}),
};