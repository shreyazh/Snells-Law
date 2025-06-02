var canvas = document.querySelector("#canvasOne")

// window.addEventListener("resize", function() {
//  canvasOne.width = window.innerWidth
//  canvasOne.height = window.innerHeight
// })

function setup() {  // setup() runs once
  frameRate(15);
}

const draw = () => {
  var ctx = canvas.getContext("2d")
  canvas.width = canvas.clientWidth
  canvas.height = canvas.clientHeight

  ctx.strokeStyle = "black"

  ctx.beginPath()
  ctx.moveTo(0, canvas.height)
  ctx.lineTo(canvas.width, canvas.height)
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(canvas.width, 0)
  ctx.stroke();
  ctx.closePath();

  // drawing the 1st right edge
  ctx.beginPath()
  ctx.moveTo(canvas.width * .4, 0)
  ctx.lineTo(canvas.width * .4, canvas.height)
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath()        // 2nd right edge
  ctx.moveTo(canvas.width * .7, 0)
  ctx.lineTo(canvas.width * .7, canvas.height)
  ctx.stroke();
  ctx.closePath();



  ctx.globalAlpha = 0.3;
  ctx.fillStyle = getColorByMedium(document.getElementById("n1").options[document.getElementById("n1").selectedIndex].text);
  ctx.fillRect(0, 0, canvas.width * 0.4, canvas.height);

  ctx.fillStyle = getColorByMedium(document.getElementById("n2").options[document.getElementById("n2").selectedIndex].text);
  ctx.fillRect(canvas.width * 0.4, 0, canvas.width * 0.3, canvas.height);

  ctx.fillStyle = "#A5A24F"
  ctx.fillRect(canvas.width * 0.7, 0, canvas.width * 0.3, canvas.height);

  ctx.strokeStyle = "black"
  ctx.globalAlpha = 1.0;


  //incident ray 1
  x1 = canvas.width * 0.4;  //these are actually the endpoints
  y1 = canvas.height * 0.5;
  r = 1000;
  theta = parseFloat(document.getElementById('angle').value) * Math.PI / 180;

  p2 = intersect(canvas.width * 0.4, 0, canvas.width * 0.4, canvas.height, x1, y1, x1 - (r * Math.cos(theta)), y1 - (r * Math.sin(theta)))

  ctx.beginPath()
  ctx.moveTo(x1 - (r * Math.cos(theta)), y1 - (r * Math.sin(theta)));
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
  ctx.closePath();




  ctx.beginPath()              // normal line
  ctx.setLineDash([10, 10]);
  ctx.moveTo(p2.x - canvas.width * .05, p2.y);
  ctx.lineTo(p2.x + canvas.width * .05, p2.y);
  ctx.stroke();
  ctx.setLineDash([10, 0]);
  ctx.closePath();


  // RAY 2
  n1 = parseFloat(document.getElementById('n1').value);
  n2 = parseFloat(document.getElementById('n2').value);
  theta2 = snell(theta, n1, n2);


  if (Number.isNaN(theta2)) {    // total internal reflection 1
    ctx.strokeStyle = 'red'
    ctx.beginPath()
    ctx.moveTo(p2.x, p2.y);
    ctx.lineTo(p2.x - (r * Math.cos(theta)), p2.y + r * Math.sin(theta));
    ctx.stroke();
    ctx.closePath();
    console.log('reflect1')
    ctx.strokeStyle = 'black'
  }

  p3 = intersect(canvas.width * 0.7, 0, canvas.width * 0.7, canvas.height, p2.x, p2.y, p2.x + r * Math.cos(theta2), p2.y + r * Math.sin(theta2))

  if (!Number.isNaN(theta2)) {
    ctx.fillStyle = 'black'        // angle display 1
    ctx.font = "12px Arial";
    ctx.fillText(round3DP(theta2 * 180 / Math.PI).toString() + "°", p2.x + canvas.width * .01, p2.y - canvas.height * .01);
  }
  else {
    ctx.fillStyle = 'red'
    ctx.font = "12px Arial";
    ctx.fillText("total internal reflection", p2.x + canvas.width * .01, p2.y - canvas.height * .01);
    ctx.fillStyle = 'black'
  }

  ctx.beginPath();            
  ctx.arc(p2.x, p2.y, canvas.width * .044, Math.min(0,theta2), Math.max(0,theta2));
  ctx.stroke();
  ctx.closePath();

  if (p3) {
    ctx.beginPath()
    ctx.moveTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.stroke();
    ctx.closePath();
  }
  else {
    ctx.beginPath()
    ctx.moveTo(p2.x, p2.y);
    ctx.lineTo(p2.x + r * Math.cos(theta2), p2.y + r * Math.sin(theta2));
    ctx.stroke();
    ctx.closePath();
  }

  ctx.beginPath()
  ctx.setLineDash([10, 10]);
  ctx.moveTo(p3.x - canvas.width * .05, p3.y);
  ctx.lineTo(p3.x + canvas.width * .05, p3.y);
  ctx.stroke();
  ctx.setLineDash([10, 0]);
  ctx.closePath();

  //ray 3
  n3 = parseFloat(document.getElementById('n3').value);
  theta3 = snell(theta2, n2, n3);

  if (Number.isNaN(theta3)) {    // total internal reflection 2
    ctx.strokeStyle = 'red'

    pR = intersect(canvas.width * 0.4, 0, canvas.width * 0.4, canvas.height, p3.x, p3.y, p3.x - (r * Math.cos(theta2)), p3.y + r * Math.sin(theta2))
    if(pR) {
      ctx.beginPath()
      ctx.moveTo(p3.x, p3.y);
      ctx.lineTo(pR.x, pR.y);
      ctx.stroke();
      ctx.closePath();
    }
    else {
      ctx.beginPath()
      ctx.moveTo(p3.x, p3.y);
      ctx.lineTo(p3.x - (r * Math.cos(theta2)), p3.y + r * Math.sin(theta2));
      ctx.stroke();
      ctx.closePath();
    }

    thetaR = snell(theta2, n2, n1);
  
    ctx.beginPath()
    ctx.moveTo(pR.x, pR.y);
    ctx.lineTo(pR.x - (r * Math.cos(-thetaR)), pR.y - (r * Math.sin(-thetaR)));
    ctx.stroke();
    ctx.closePath();
    
    console.log('reflect1')
    ctx.strokeStyle = 'black'
  }

  //  p4 = intersect(canvas.width, 0, canvas.width, canvas.height, p3.x, p3.y, p3.x + r * Math.cos(theta3), p3.y + r * Math.sin(theta3))  // im 99% sure this isnt used

  if (!Number.isNaN(theta3)) {
    ctx.fillStyle = 'black'
    ctx.font = "12px Arial";
    ctx.fillText(round3DP(theta3 * 180 / Math.PI).toString() + "°", p3.x + canvas.width * .01, p3.y - canvas.height * .01);
  }
  else {
    ctx.fillStyle = 'red'
    ctx.font = "12px Arial";
    ctx.fillText("total internal reflection", p3.x + canvas.width * .01, p3.y - canvas.height * .01);
    ctx.fillStyle = 'black'
  }

  ctx.beginPath()
  ctx.moveTo(p3.x, p3.y);
  ctx.lineTo(p3.x + r * Math.cos(theta3), p3.y + r * Math.sin(theta3));
  ctx.stroke();
  ctx.closePath();


  ctx.beginPath();
  ctx.arc(p3.x, p3.y, canvas.width * .044, Math.min(0,theta3), Math.max(0,theta3));
  ctx.stroke();
  ctx.closePath();

}

function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {    // taken from http://paulbourke.net/geometry/pointlineplane/javascript.txt

  // Check if none of the lines are of length 0
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return false
  }

  denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

  // Lines are parallel
  if (denominator === 0) {
    return false
  }

  let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
  let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

  // is the intersection along the segments
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return false
  }

  // Return a object with the x and y coordinates of the intersection
  let x = x1 + ua * (x2 - x1)
  let y = y1 + ua * (y2 - y1)

  return { x, y }
}
// n1/n2 = sin(1)/sin(2)    --> sin(2) = sin(1) * n1 / n2
function snell(theta, n1, n2) {
  return Math.asin(Math.sin(theta) * n1 / n2)
}
function round3DP(value) {
  return Math.round(value * 1000) / 1000;
}
function getColorByMedium(mediumName) {
  if (mediumName === 'Vacuum - 1') {
    return '#FFFFFF'; // White
  } else if (mediumName === 'Air - 1.00273') {
    return '#808080'; // Grey
  } else if (mediumName === 'Ethanol - 1.36') {
    return '#FFC300'; // Yellow
  } else if (mediumName === 'Olive oil - 1.47') {
    return '#F1ECCC'; // Light Yellow
  } else if (mediumName === 'Flint glass (typical) - 1.69') {
    return '#A6ACAF'; // Silver
  } else if (mediumName === 'Sapphire - 1.77') {
    return '#0F52BA'; // Sapphire Blue
  } else if (mediumName === 'Cubic zirconia - 2.15') {
    return '#FFE4C4'; // Bisque
  } else if (mediumName === 'Moissanite - 2.65') {
    return '#00FF00'; // Lime Green
  } else if (mediumName === 'Potassium niobate (KNbO3) - 2.28') {
    return '#D2691E'; // Chocolate
  } else if (mediumName === 'Zinc oxide - 2.4') {
    return '#ADD8E6'; // Light Blue
  } else if (mediumName === 'Cinnabar (mercury sulfide) - 3.02') {
    return '#FF4500'; // Orange Red
  } else if (mediumName === 'Silicon - 3.42') {
    return '#808000'; // Olive
  } else if (mediumName === 'Gallium(III) phosphide - 3.5') {
    return '#800080'; // Purple
  } else if (mediumName === 'Gallium(III) arsenide - 3.927') {
    return '#FF00FF'; // Magenta
  } else if (mediumName === 'Germanium - 4.05') {
    return '#800000'; // Maroon
  } else {
    return '#000000'; // Default color if mediumName does not match any option
  }
}

draw();