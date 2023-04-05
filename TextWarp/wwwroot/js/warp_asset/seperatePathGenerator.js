var patterns = [
    {
      path: "M176.6,45.9C71.1,106.2,0,219.8,0,350c0,193.3,156.7,350,350,350s350-156.7,350-350S543.3,0,350,0C286.9,0,227.7,16.7,176.6,45.9",
      zl:68,
      zr:268,
      center: {x:350, y: 350},
      variationRange_x: 150,
      variationRange_y: 150,
      variationIndexRange_y: 18
    },
    {
      path: "M264.7,274.2C114.2,319.2,12.8,403.8,12.8,500.9C12.8,645,236.3,761.8,512,761.8s499.3-116.8,499.3-260.9S787.7,240,512,240C422,240,337.6,252.5,264.7,274.2",
      zl:60,
      zr:260,
      center: {x: 512, y: 500},
      variationRange_x: 240,
      variationRange_y: 110,
      variationIndexRange_y: 25, 
    },
    {
      path: "M312.8,214.8c-94.5-1.1-175.9,64.9-172.5,168.5C146,531.4,306.5,650.9,405,746l82,78.6l99.1-98.5c36.4-35.9,88.3-83.7,134.9-132.1c42.7-43.8,81.4-88.8,100.2-127c66.6-132.7-54.1-267.6-186.2-252.8c-70.6,8-102.5,49-148,96.8C432.4,257.5,397.1,215.8,312.8,214.8z",
      zl:70,
      zr:250,
      center: {x: 512, y: 500},
      variationRange_x: 135,
      variationRange_y: 100,
      variationIndexRange_y: 15
    }
  ];
  
  var bezier4Point = function(t, p0, p1, p2, p3){
    var cX = 3 * (p1.x - p0.x),
        bX = 3 * (p2.x - p1.x) - cX,
        aX = p3.x - p0.x - cX - bX;
          
    var cY = 3 * (p1.y - p0.y),
        bY = 3 * (p2.y - p1.y) - cY,
        aY = p3.y - p0.y - cY - bY;
          
    var x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0.x;
    var y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0.y;
    x = Math.floor(x);
    y = Math.floor(y);
    return {x: x, y: y};
  };
  
  var bezier3Point = function(t, p0, p1, p2) {
    var x = Math.pow(1 - t, 2) * p0.x + 2 * (1 - t) * t * p1.x + Math.pow(t, 2) * p2.x;
    var y = Math.pow(1 - t, 2) * p0.y + 2 * (1 - t) * t * p1.y + Math.pow(t, 2) * p2.y;
    x = Math.floor(x);
    y = Math.floor(y);
    return {x: x, y: y};
  };
  
  var createPathString = function (points) {
    var path = "M";
    for(var i = 0; i < points.length; i++) {
      if(i == 0) {
        path += points[i].x;
        path += ",";
        path += points[i].y;
      }
      else {
        path += " L";
        path += points[i].x;
        path += ",";
        path += points[i].y;
      }
    }
    // path += "Z";
    return path;
  };
  
  var pathRegulazation = function (points) {
    var tempPathString = createPathString(points);
    var tempProperties = svgPathProperties.svgPathProperties(tempPathString);
    var interval_distance = tempProperties.getTotalLength() / (points.length - 1);
    var regularPoints = [];
    for ( var distance = 0; distance < tempProperties.getTotalLength() + 1; distance += interval_distance) {
      var tempPoint = tempProperties.getPointAtLength(distance);
      regularPoints.push(tempPoint);
    }
  
    if (regularPoints.length == points.length) {
      return regularPoints;
    }
  };
  
  var draw4PointBezier = function(p0, p1, p2, p3){
    var points = [];
    var accuracy = 0.01;
    for (var i = 0; i < 1; i += accuracy){
        var p = bezier4Point(i, p0, p1, p2, p3);
        points.push(p);
    }
    points.push(p3);
    return points;
  }
  
  var draw3PointBezier = function(p0, p1, p2) {
    var points = [];
    var accuracy = 0.05;
    points.push(p0);
    for (var i = 0; i < 1; i += accuracy){
        var p = bezier3Point(i, p0, p1, p2);
        points.push(p);
    }
    points.push(p2);
    return points;
  }
  
  var drawPoints = function(points, color) {
    context.fillStyle = color;
    for (var i = 0; i < points.length; i ++)
    {
      // console.log("color: " + color +", index: "+ i + " points.x:" + points[i].x + " points.y" + points[i].y);
      context.beginPath();
      context.arc(points[i].x, points[i].y, 3, 0, 2 * Math.PI);
      context.fill();
      context.font = '10px serif';
      context.fillText('' + i, points[i].x, points[i].y);
    }
  }
  
  var distance = function (p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }
  
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }
  
  var convertSpaceBezier = function (points, space = 10) {
    var spaceBezierPoints = [];
    for(var i = 0; i < points.length; i++) {
      var tempPoint = {x: 0, y: 0};
      tempPoint.x = points[i].x;
      tempPoint.y = points[i].y + 10;
      spaceBezierPoints.push(tempPoint);
    }
    return spaceBezierPoints;
  }
  
  var resultSeperatedPoints = [];
  
  var getRandomCorePoint = function(pathIndex) {
    var corePoint = {x: 0, y: 0};
    var x = getRandomInt(patterns[pathIndex].center.x - patterns[pathIndex].variationRange_x, patterns[pathIndex].center.x + patterns[pathIndex].variationRange_x);
    var y = getRandomInt(patterns[pathIndex].center.y - patterns[pathIndex].variationRange_y, patterns[pathIndex].center.y + patterns[pathIndex].variationRange_y);
    corePoint.x = x;
    corePoint.y = y;
    return corePoint;
  }
  
  var getBezierControlPoints = function(point1, point2) {
    var tempPoint1 = {x: 0, y: 0}, tempPoint2 = {x: 0, y: 0};
    tempPoint1.x = getRandomInt(point1.x + 20, (point2.x - point1.x) / 2 - 20);
    tempPoint1.y = getRandomInt(point1.y - 50, point1.y + 50);
    tempPoint2.x = getRandomInt((point2.x - point1.x) / 2 + 20, point2.x - 20);
    tempPoint2.y = getRandomInt(point2.y - 50, point2.y + 50);
    return [tempPoint1, tempPoint2];
  }
  
  var getBezier3ControlPoint = function(point1, point2) {
    var x = getRandomInt(point1.x + (point2.x - point1.x) / 2 - 50, point1.x + (point2.x - point1.x) / 2 + 50);
    var y = getRandomInt(point1.y - 50, point1.y + 50);
    return {x: x, y: y};
  }
  
  var findPosistion = function(points, x_coordinate) {
      var space = 10000;
      var neighbourPointIndex = -1;
      for (var i = 0; i < points.length; i ++) {
          if(space > Math.abs(points[i].x - x_coordinate)) {
              space = Math.abs(points[i].x - x_coordinate);
              neighbourPointIndex = i;
          }
      }
      return neighbourPointIndex;
  }
  
  var findOtherLinePosistion = function(points, mainPoint) {
      var real_distance = 1000;
      var neighbourPointIndex = -1;
      for (var i = 0; i < points.length; i ++) {
          if(real_distance > distance(points[i], mainPoint) && points[i].y > mainPoint.y) {
              real_distance = distance(points[i], mainPoint)
              neighbourPointIndex = i;
          }
      }
      return neighbourPointIndex;
  }
  
  var generateIntervalPoints = function(point1, point2, verticalSidePointsNumber = 5, direction = "tb") {
      var height = Math.abs(point2.y - point1.y);
      var interval = height / verticalSidePointsNumber;
      var intervalPoints = [];
      if (direction == "tb") {
          for (var i = 0; i < verticalSidePointsNumber; i++) {
              var tempPoint = {x: point1.x, y: -1};
              tempPoint.y = i * interval + point1.y;
              intervalPoints.push(tempPoint);
          }
      }
      else if (direction == "bt") {
          for (var i = 0; i < verticalSidePointsNumber; i++) {
              var tempPoint = {x: point1.x, y: -1};
              tempPoint.y = point2.y - i * interval;
              intervalPoints.push(tempPoint);
          }
      }
      return intervalPoints;
  }
  
  var seperatePath = function(pathIndex, words){
      words = words.split(" ");
      var num_segments = words.length;
      var properties = svgPathProperties.svgPathProperties(patterns[pathIndex].path);
      var totalLength = properties.getTotalLength();
      var num_total_points = 400;
      var step_distance = totalLength / num_total_points;
      var points = [];
      var distance = 0;
      var test_leftPointIndex = -1, test_rightPointIndex = -1;
      var test_leftPointX = 10000, test_rightPointX = -1;
      for (var i = 0; i < num_total_points; i++, distance+=step_distance) {
          var tempPoint = properties.getPointAtLength(distance);
          if (test_leftPointX > tempPoint.x) {
              test_leftPointX = tempPoint.x;
              test_leftPointIndex = i;
          }
          if (test_rightPointX < tempPoint.x) {
              test_rightPointX = tempPoint.x;
              test_rightPointIndex = i;
          }
          points.push(tempPoint);
      }
  
      if ( num_segments == 2) {
        var seperatePointIndex1 = getRandomInt(patterns[pathIndex].zl - patterns[pathIndex].variationIndexRange_y, 
          patterns[pathIndex].zl + patterns[pathIndex].variationIndexRange_y); 
        var seperatePointIndex2 =  -1;
        if (seperatePointIndex1 <= patterns[pathIndex].zl) {
          seperatePointIndex2 = getRandomInt(patterns[pathIndex].zr - patterns[pathIndex].variationIndexRange_y, 
              patterns[pathIndex].zr);
        }
        else {
          seperatePointIndex2 = getRandomInt(patterns[pathIndex].zr, 
              patterns[pathIndex].zr + patterns[pathIndex].variationIndexRange_y);
        }
        var firstBezierControlPoint = getRandomCorePoint(pathIndex);
        var secondBezierControlPoint = getRandomCorePoint(pathIndex);
        var seperateBezierPoints = draw4PointBezier(points[seperatePointIndex1], firstBezierControlPoint, 
          secondBezierControlPoint, points[seperatePointIndex2]);
        seperateBezierPoints = pathRegulazation(seperateBezierPoints);
        var spacedSeperateBezierPoints = convertSpaceBezier(seperateBezierPoints, space = 50);
  
        var topSidePathPoints = []; 
        for ( var i1 = seperatePointIndex1 - 1; i1 >= 0; i1 --) {
          topSidePathPoints.push(points[i1]);
        }
        for ( var i2 = 399; i2 > seperatePointIndex2 - 1; i2 --) {
          topSidePathPoints.push(points[i2]);
        }
      //   (topSidePathPoints, "#ff0088");
      //   drawPoints(seperateBezierPoints, "#ff8800");
        topSidePathPoints = pathRegulazation(topSidePathPoints);
  
        var firstPathPoints = []; //first word's points array
        var charQuardPoints = []; //quard points array for each character
        var characterSpace = 10;  //space between each character in x-axis
        var verticalSidePointsNumber = 5; //number of every virtical side
        var cornorTopPointsNumber = 5; //number of edge character's top side points
        var entireDistance = points[seperatePointIndex2].x - points[seperatePointIndex1].x - characterSpace * (words[1].length - 1);
        var interval = Math.floor(entireDistance / words[0].length);
        var start_x = points[seperatePointIndex1].x;
        for ( var i3 = 0; i3 < words[0].length; i3++) {
          var LTPointIndex = -1, LBPointIndex = -1, RBPointIndex = -1, RTPointIndex = -1;
          if (i3 == 0) {
              LTPointIndex = findPosistion(topSidePathPoints, start_x + interval) - cornorTopPointsNumber;
              LBPointIndex = 0;
          }
          else {
              LTPointIndex = findPosistion(topSidePathPoints, start_x + i3 * (interval + characterSpace));
              LBPointIndex = findPosistion(seperateBezierPoints, start_x + i3 * (interval + characterSpace));
          }
          if (i3 == words[0].length - 1) {
              RBPointIndex = topSidePathPoints.length - 1;
              RTPointIndex = findPosistion(topSidePathPoints, start_x + i3 * (interval + characterSpace)) + cornorTopPointsNumber;
          }
          else {
              RBPointIndex = findPosistion(seperateBezierPoints, start_x + i3 * (interval + characterSpace) + interval);
              RTPointIndex = findPosistion(topSidePathPoints, start_x + i3 * (interval + characterSpace) + interval);
          }
          charQuardPoints.push([LTPointIndex, LBPointIndex, RBPointIndex, RTPointIndex]);
        }
        
        for (var i4 = 0; i4 < charQuardPoints.length; i4++) {
          var leftSidePoints = [], bottomSidePoints = [], rightSidePoints = [], topSidePoints = [];
          if (i4 == 0) {
              for(var i5 = charQuardPoints[i4][0]; i5 >= 0; i5 --) {
                  leftSidePoints.push(topSidePathPoints[i5]);
              }
          }
          else {
              leftSidePoints = generateIntervalPoints(topSidePathPoints[charQuardPoints[i4][0]]
                  , seperateBezierPoints[charQuardPoints[i4][1]], 
              verticalSidePointsNumber, direction="tb");
          }
          if ( i4 == charQuardPoints.length - 1) {
              for (var i6 = charQuardPoints[i4][1]; i6 < seperateBezierPoints.length - 1; i6 ++) {
                  bottomSidePoints.push(seperateBezierPoints[i6]);
              }
              for (var i7 = charQuardPoints[i4][2]; i7 > charQuardPoints[i4][3]; i7 --) {
                  rightSidePoints.push(topSidePathPoints[i7]);
              }
          }
          else {
              for (var i6 = charQuardPoints[i4][1]; i6 < charQuardPoints[i4][2]; i6 ++) {
                  bottomSidePoints.push(seperateBezierPoints[i6]);
              }
              rightSidePoints = generateIntervalPoints(topSidePathPoints[charQuardPoints[i4][3]], 
                  seperateBezierPoints[charQuardPoints[i4][2]], 
              verticalSidePointsNumber, direction="bt");
          }
          for (var i8 = charQuardPoints[i4][3]; i8 > charQuardPoints[i4][0]; i8 --) {
              topSidePoints.push(topSidePathPoints[i8]);
          }
          firstPathPoints.push([leftSidePoints, bottomSidePoints, rightSidePoints, topSidePoints]);
        }
        resultSeperatedPoints.push(firstPathPoints);
  
        //split second path part
        var secondPathPoints = [];
        charQuardPoints = [];
        topSidePathPoints = spacedSeperateBezierPoints
        var bottomSidePathPoints = [];
        for (var j2 = seperatePointIndex1; j2 < seperatePointIndex2; j2 ++) {
          bottomSidePathPoints.push(points[j2]);
        }
        var startPointIndex = findOtherLinePosistion(bottomSidePathPoints, topSidePathPoints[0]);
        var endPointIndex = findOtherLinePosistion(bottomSidePathPoints, topSidePathPoints[topSidePathPoints.length - 1]);
        bottomSidePathPoints = bottomSidePathPoints.slice(startPointIndex, endPointIndex);
        
        if (topSidePathPoints[0].x < bottomSidePathPoints[0].x) {
          topSidePathPoints.shift();
          topSidePathPoints.shift();
        }
        if (topSidePathPoints[topSidePathPoints.length - 1].x > 
        bottomSidePathPoints[bottomSidePathPoints.length - 1].x) {
          topSidePathPoints = topSidePathPoints.slice(0, -1);
        }

        entireDistance = topSidePathPoints[topSidePathPoints.length - 1].x - topSidePathPoints[0].x - characterSpace * (words[1].length - 1);
        interval = Math.floor(entireDistance / words[1].length);
        for ( var j3 = 0; j3 < words[1].length; j3++) {
          var LTPointIndex = -1, LBPointIndex = -1, RBPointIndex = -1, RTPointIndex = -1;
          if (j3 == 0) {
              LTPointIndex = 0;
              LBPointIndex = findPosistion(bottomSidePathPoints, start_x + interval) - cornorTopPointsNumber;
          }
          else {
              LTPointIndex = findPosistion(topSidePathPoints, start_x + j3 * (interval + characterSpace));
              LBPointIndex = findPosistion(bottomSidePathPoints, start_x + j3 * (interval + characterSpace));
          }
          if (j3 == words[1].length - 1) {
              RTPointIndex = topSidePathPoints.length - 1;
              RBPointIndex = findPosistion(bottomSidePathPoints, start_x + j3 * (interval + characterSpace)) + cornorTopPointsNumber;
          }
          else {
              RTPointIndex = findPosistion(topSidePathPoints, start_x + j3 * (interval + characterSpace) + interval);
              RBPointIndex = findPosistion(bottomSidePathPoints, start_x + j3 * (interval + characterSpace) + interval);
          }
          charQuardPoints.push([LTPointIndex, LBPointIndex, RBPointIndex, RTPointIndex]);
        }
        
        for (var j4 = 0; j4 < charQuardPoints.length; j4++) {
          var leftSidePoints = [], bottomSidePoints = [], rightSidePoints = [], topSidePoints = [];
          if (j4 == 0) {
              for(var j5 = charQuardPoints[j4][0]; j5 < charQuardPoints[j4][1]; j5 ++) {
                  leftSidePoints.push(bottomSidePathPoints[j5]);
              }
          }
          else {
              leftSidePoints = generateIntervalPoints(topSidePathPoints[charQuardPoints[j4][0]]
                  , bottomSidePathPoints[charQuardPoints[j4][1]], 
              verticalSidePointsNumber, direction="tb");
          }
          for (var j6 = charQuardPoints[j4][1]; j6 < charQuardPoints[j4][2]; j6 ++) {
              bottomSidePoints.push(bottomSidePathPoints[j6]);
          }
          if (j4 == charQuardPoints.length - 1) {
              for (var j7 = charQuardPoints[j4][2]; j7 < bottomSidePathPoints.length - 1; j7 ++) {
                  rightSidePoints.push(bottomSidePathPoints[j7]);
              }
              for (var j8 = topSidePathPoints.length - 1; j8 > charQuardPoints[j4][0]; j8 --) {
                  topSidePoints.push(topSidePathPoints[j8]);
              }
          }
          else {
              rightSidePoints = generateIntervalPoints(topSidePathPoints[charQuardPoints[j4][3]], 
                  bottomSidePathPoints[charQuardPoints[j4][2]], 
              verticalSidePointsNumber, direction="bt");
              for (var j8 = charQuardPoints[j4][3]; j8 >= charQuardPoints[j4][0]; j8 --) {
                  topSidePoints.push(topSidePathPoints[j8]);
              }
          }
          secondPathPoints.push([leftSidePoints, bottomSidePoints, rightSidePoints, topSidePoints]);
        }
        resultSeperatedPoints.push(secondPathPoints);
      }
    }


  function splitPath (pathIndex, words) {
    resultSeperatedPoints = [];
    seperatePath(pathIndex, words);
    let result = resultSeperatedPoints.map((item) => {
        let lineItem = item.map((subitem) => {
            let charItem = subitem.map((sideItem) => {
                let point = sideItem.map((tempPoint) => {
                    return [tempPoint.x, tempPoint.y];
                })
                return point;
            })
            return charItem;
        })
        return lineItem;
    })
    return result;
  }