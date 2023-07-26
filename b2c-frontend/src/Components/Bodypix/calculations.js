export const keypointMapping = {
  nose: 0,
  leftEye: 1,
  rightEye: 2,
  leftEar: 3,
  rightEar: 4,
  leftShoulder: 5,
  rightShoulder: 6,
  leftElbow:7,
  rightElbow:8,
  leftWrist: 9,
  rightWrist: 10,
  leftHip: 11,
  rightHip: 12,
  leftKnee: 13,
  rightKnee: 14,
  leftAnkle: 15,
  rightAnkle: 16,
  top: 17,
  bottom: 18,
  leftPit: 19,
  rightPit: 20,
  leftThighOuter : 21,
  leftThighInner : 22,
  leftKneeOuter : 23,
  leftKneeInner: 24,
  leftCalfOuter: 25,
  leftCalfInner: 26,
}
export const sideKeypointMapping = {
  nose: 0,
  leftEye: 1,
  rightEye: 2,
  leftEar: 3,
  rightEar: 4,
  leftShoulder: 5,
  rightShoulder: 6,
  leftElbow:7,
  rightElbow:8,
  leftWrist: 9,
  rightWrist: 10,
  leftHip: 11,
  rightHip: 12,
  leftKnee: 13,
  rightKnee: 14,
  leftAnkle: 15,
  rightAnkle: 16,
  top: 17,
  bottom: 18,
  chest: 19,
  butt: 20,
  groin: 21,
  upperBack: 22,
  backLeg : 23,
  frontLeg : 24,
  backKnee : 25,
  frontKnee : 26,
  backCalf : 27,
  frontCalf: 28
}

export function getScale(pose, knownHeight) {
    const heightInPixels = calculateLength([keypointMapping.top,keypointMapping.bottom], pose.allPoses[0].keypoints, 1);
    console.log("HEIGHT IN PX:", heightInPixels);
    return heightInPixels/knownHeight;
}

function verifyBounds(x,y,bounds, checkBounds, height, width) {
    if(typeof checkBounds === "function") {
        return checkBounds(x,y,bounds, height, width);
    } else {
        return [y,x];
    }
}

function verifyStopConditions(x,y,bounds,stopCondition, height, width) {
    if(typeof checkBounds === "function") {
        if(stopCondition(x,y,bounds, height, width)) {
            return true
        }
    }
    return false;
}

//Top-left-right-down
//findMaxVert
export function findFromLeftRightDown(pose, targets, width, height, bounds, checkBounds, stopCondition) { //pans left to right
  for(const [idx, segId] of pose.data.entries()) {
    let x = idx%width;
    let y = idx/width;
    const stop = verifyStopConditions(x,y,bounds,stopCondition, height, width);
    if(stop) {
        break;
    }
    if(targets.includes(segId)) {
      const coords = verifyBounds(x,y,bounds,checkBounds, height, width);
      if(coords) {
          return coords;
      }

    }
  }
  return null;
}

//Bottom-right-left-up
//findMinVert
export function findFromRightLeftUp(pose, targets, width, height, bounds, checkBounds, stopCondition) {
  for(const [idx, segId] of pose.data.slice().reverse().entries()) {
    let x = (width * height - idx)%width;
    let y = (width * height - idx)/width;
    const stop = verifyStopConditions(x,y,bounds, stopCondition, height, width);
    if(stop) {
        break;
    }
    if(targets.includes(segId)) {
      const coords = verifyBounds(x,y,bounds,checkBounds, height, width);
      if(coords) {
          return coords;
      }
    }
  }
  return null;
}

//Top-right-left-down
export function findFromRightLeftDown(pose, targets, width, height, bounds, checkBounds, stopCondition) { //pans left to right
  for(var i = width - 1; i < width*height; i+=width) {
    for(var j = 0; j < width; j++) {
      let x = (i-j)%width;
      let y = (i-j)/width;
      const stop = verifyStopConditions(x,y,bounds, stopCondition, height, width);
      if(stop) {
          break;
      }
      if(targets.includes(pose.data[i-j])) {
          const coords = verifyBounds(x,y,bounds,checkBounds, height, width);
          if(coords) {
              return coords;
          }
      }
    }
  }
}

//Left-down to Right-down
//findLeftMostHorizontal
export function findFromLeftDownRight(pose, targets, width, height, bounds, checkBounds, stopCondition) {
  for(var i = 0; i < height; i++) {
    for(var j = 0; j+i < width *height; j+=width) {
        let x = (i+j)%width;
        let y = (i+j)/width;
        const stop = verifyStopConditions(x,y,bounds, stopCondition, height, width);
        if(stop) {
            break;
        }
        if(targets.includes(pose.data[j+i])) {
            const coords = verifyBounds(x,y,bounds,checkBounds, height, width);
            if(coords) {
                return coords;
            }
        }
    }
  }
}

//Right-down to Left-down
//findRightMostHorizontal
export function findFromRightDownLeft(pose, targets, width, height, bounds, checkBounds, stopCondition) {
    for(var i = width - 1; i>= 0; i--) {
      for(var j = 0; j < height; j++) {
        let x = (i + j*width)%width;
        let y = (i + j*width)/width;
        const stop = verifyStopConditions(x,y,bounds, stopCondition, height, width);
        if(stop) {
            break;
        }
        if(targets.includes(pose.data[j*width+i])) {
        const coords = verifyBounds(x,y,bounds,checkBounds, height, width);
        if(coords) {
            return coords;
        }
        }
      }
    }
}

//Right-Up to Left-up
//findLeftMostVerticalBottomTop
export function findFromLeftUpRight(pose, targets, width, height, bounds, checkBounds, stopCondition) {
  for(var i = width * (height - 1); i < width * height; i++) {
    for(var j = 0; i - j*width >= 0; j++) {
        let x = (i-(j*width))%width;
        let y =(i-(j*width))/width;
        const stop = verifyStopConditions(x,y,bounds, stopCondition, height, width);
        if(stop) {
            break;
        }
        if(targets.includes(pose.data[i-(j*width)])) {
            const coords = verifyBounds(x,y,bounds,checkBounds, height, width);
            if(coords) {
                return coords;
            }
        }
    }
  }
}

//Left-up to Right-Up

//findRightMostVerticalBottomTop
export function findRightUpLeft(pose, targets, width, height, bounds, checkBounds, stopCondition) {
  for(var i = width*height - 1; i >= width*height - width; i--) {
    for(var j = 0; i - j*width >= 0; j++) {
        let x = (i-(j*width))%width;
        let y = (i-(j*width))/width
        const stop = verifyStopConditions(x,y,bounds, stopCondition, height, width);
        if(stop) {
            break;
        }
        if(targets.includes(pose.data[i-(j*width)])) {
            const coords = verifyBounds(x,y,bounds,checkBounds, height, width);
            if(coords) {
                return coords;
            }
        }
    }
  }
}


//bottom-left to bottom-right up,
//findLeftMostHorizontalBottomUp
//findRightMostHorizontalBottomUp
export function findLeftRightUp(pose, targets, width, height, bounds, checkBounds, stopCondition) {
  for(var i = width*(height-1); i >= 0; i -=width) {
    for(var j = 0; j + i < i + width; j++) {
        let x = (i+j)%width;
        let y = (i+j)/width;
        const stop = verifyStopConditions(x,y,bounds, stopCondition, height, width);
        if(stop) {
            break;
        }
        if(targets.includes(pose.data[j+i])) {
            const coords = verifyBounds(x,y,bounds,checkBounds, height, width);
            if(coords) {
                return coords;
            }
        }
    }
  }
}

export function calculateLengthXPos(sequence,keypoints,scale) {
  var length = 0;
  if(sequence.length < 2) {
    return;
  }
  for(var i = 0; i < sequence.length - 1; i++) {
    length += Math.abs((keypoints[sequence[i]].position.x - keypoints[sequence[i+1]].position.x))/scale;
  }

  return length;

}

export function calculateLengthYPos(sequence,keypoints,scale) {
  var length = 0;
  if(sequence.length < 2) {
    return;
  }
  for(var i = 0; i < sequence.length - 1; i++) {
    length += Math.abs((keypoints[sequence[i]].position.y - keypoints[sequence[i+1]].position.y))/scale;
  }

  return length;

}

export function calculateLength(sequence, keypoints, scale) {
  var length = 0;
  if(sequence.length < 2) {
    return;
  }
  for(var i = 0; i < sequence.length - 1; i++) {
    length += Math.sqrt(Math.pow((keypoints[sequence[i]].position.x - keypoints[sequence[i+1]].position.x),2) 
                + Math.pow((keypoints[sequence[i]].position.y - keypoints[sequence[i+1]].position.y),2)
              )/scale;
  }

  return length;
}

export function calculateEllipsePerimeter(a,b) {
  return Math.PI * (3*(a+b) - Math.sqrt((3*a + b)*(a + 3*b)));
}

export function calculateAverage(arr) {
  return arr.reduce((a,b) => a+b,0)/arr.length;
}

export function calculateCircumference(a) {
  return Math.PI * (a);
}