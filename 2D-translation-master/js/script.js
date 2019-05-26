/* Created by Lior Shahar and Hanan Avraham */

/* ------------Utility Functions------------------------------------------------ */

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}

function relMouseCoords(ctxCanvas, event) {
  let totalOffsetX = 0;
  let totalOffsetY = 0;
  let canvasX = 0;
  let canvasY = 0;
  let currentElement = ctxCanvas;

  do {
    totalOffsetX += currentElement.offsetLeft;
    totalOffsetY += currentElement.offsetTop;
  } while ((currentElement = currentElement.offsetParent));

  canvasX = event.pageX - totalOffsetX;
  canvasY = event.pageY - totalOffsetY;

  // Fix for variable canvas width
  canvasX = Math.round(canvasX * (ctxCanvas.width / ctxCanvas.offsetWidth));
  canvasY = Math.round(canvasY * (ctxCanvas.height / ctxCanvas.offsetHeight));

  return { x: canvasX, y: canvasY };
}

function clearCanvas(ctxCanvas) {
  console.log(ctxCanvas.canvas);
  ctxCanvas.clearRect(0, 0, ctxCanvas.canvas.width, ctxCanvas.canvas.height);
}

function setLeftMenuAndCanvasHight() {
  let windowHeight = window.innerHeight;
  let windowWidth = window.innerWidth;
  /* Set canvas height */
  let canvas = document.getElementById("myCanvas");
  let ctx = canvas.getContext("2d");
  ctx.canvas.height = windowHeight - 173; // minus -> header + footer = 200
  ctx.canvas.width = windowWidth - 232;
  /* Set side menu height */
  let leftMenuBar = document.getElementById("leftMenuBar");
  leftMenuBar.style.height = `${windowHeight - 172}px`; // minus -> header + footer + border  = 202
}

/* ----------------------------------------------------- */

/* Drawing functions */

function drawLines(linesArray, ctx) {
  ctx.beginPath();
  for (let i = 0; i < linesArray.length; i++) {
    if (linesArray[i].line == 0) {
      ctx.moveTo(linesArray[i].x, linesArray[i].y);
    } else {
      ctx.lineTo(linesArray[i].x, linesArray[i].y);
    }
  }
  ctx.stroke();
}
/* Draw Circle */
function drawCircles(circlesArray, ctx) {
  for (let i = 0; i < circlesArray.length; i++) {
    ctx.beginPath();
    ctx.arc(
      circlesArray[i].x,
      circlesArray[i].y,
      circlesArray[i].r,
      0,
      2 * Math.PI
    );
    ctx.stroke();
  }
}

/* Draw Curve */
function drawCurves(curvesArray, ctx) {
  for (let i = 0; i < curvesArray.length; i++) {
    ctx.beginPath();
    ctx.moveTo(curvesArray[i].startX, curvesArray[i].startY);
    ctx.bezierCurveTo(
      curvesArray[i].cp1x,
      curvesArray[i].cp1y,
      curvesArray[i].cp2x,
      curvesArray[i].cp2y,
      curvesArray[i].x,
      curvesArray[i].y
    );
    ctx.stroke();
  }
}

/* Draw object */
function drawObject(ctx) {
  console.log("drawObject");
  clearCanvas(ctx);
  if (localStorage.points) {
    pointsArray = JSON.parse(localStorage.points);
    if (pointsArray.lines) {
      drawLines(pointsArray.lines, ctx);
    }
    if (pointsArray.circles) {
      drawCircles(pointsArray.circles, ctx);
    }
    if (pointsArray.curves) {
      drawCurves(pointsArray.curves, ctx);
    }
  }

  console.log("end of drawObject");
}

/* ---------------------------------------------------- */

/* Calaculation function */

function myMove(tx, ty) {
  if (localStorage.points) {
    pointsArray = JSON.parse(localStorage.points);
    if (pointsArray.lines) {
      for (let i = 0; i < pointsArray.lines.length; i++) {
        if (pointsArray.lines[i].line == 0) {
          pointsArray.lines[i].x += tx;
          pointsArray.lines[i].y += ty;
        } else {
          pointsArray.lines[i].x += tx;
          pointsArray.lines[i].y += ty;
        }
      }
    }
    if (pointsArray.circles) {
      for (let i = 0; i < pointsArray.circles.length; i++) {
        pointsArray.circles[i].x += tx;
        pointsArray.circles[i].y += ty;
      }
    }
    if (pointsArray.curves) {
      for (let i = 0; i < pointsArray.curves.length; i++) {
        pointsArray.curves[i].startX += tx;
        pointsArray.curves[i].startY += ty;
        pointsArray.curves[i].cp1x += tx;
        pointsArray.curves[i].cp1y += ty;
        pointsArray.curves[i].cp2x += tx;
        pointsArray.curves[i].cp2y += ty;
        pointsArray.curves[i].x += tx;
        pointsArray.curves[i].y += ty;
      }
    }
  }
  localStorage.setItem("points", JSON.stringify(pointsArray));
}

function myScaling(s) {
  let dx, dy;
  if (localStorage.points) {
    pointsArray = JSON.parse(localStorage.points);
    if (pointsArray.lines) {
      for (let i = 0; i < pointsArray.lines.length; i++) {
        if (pointsArray.lines[i].line == 0) {
          pointsArray.lines[i].x *= s;
          pointsArray.lines[i].y *= s;
        } else {
          pointsArray.lines[i].x *= s;
          pointsArray.lines[i].y *= s;
        }
      }
    }
    if (pointsArray.circles) {
      for (let i = 0; i < pointsArray.circles.length; i++) {
        pointsArray.circles[i].r *= s;
        pointsArray.circles[i].x *= s;
        pointsArray.circles[i].y *= s;
      }
    }
    if (pointsArray.curves) {
      for (let i = 0; i < pointsArray.curves.length; i++) {
        pointsArray.curves[i].startX *= s;
        pointsArray.curves[i].startY *= s;
        pointsArray.curves[i].cp1x *= s;
        pointsArray.curves[i].cp1y *= s;
        pointsArray.curves[i].cp2x *= s;
        pointsArray.curves[i].cp2y *= s;
        pointsArray.curves[i].x *= s;
        pointsArray.curves[i].y *= s;
      }
    }
  }
  localStorage.setItem("points", JSON.stringify(pointsArray));
  /* move back to start points */

  /* calc move back delta */
  if (arguments[1] == "zoomIn") {
    dx = -Math.abs(pointsArray.lines[0].x - pointsArray.lines[0].x / 1.1);
    dy = -Math.abs(pointsArray.lines[0].y - pointsArray.lines[0].y / 1.1);
    console.log(dx, dy);
  } else if (arguments[1] == "zoomOut") {
    dx = Math.abs(pointsArray.lines[0].x - pointsArray.lines[0].x * 1.1);
    dy = Math.abs(pointsArray.lines[0].y - pointsArray.lines[0].y * 1.1);
    console.log(dx, dy);
  }
  console.log(dx, dy);
  myMove(dx, dy);
}

function calaXY(x, y, teta) {
  let tx =
    x * Math.cos((teta * Math.PI) / 180) - y * Math.sin((teta * Math.PI) / 180);

  let ty =
    x * Math.sin((teta * Math.PI) / 180) + y * Math.cos((teta * Math.PI) / 180);
  console.log(
    "teta: " + teta + " from: " + x + " : " + y + "to: " + tx + " : " + ty
  );
  return { tx: tx, ty: ty };
}

function myRotation(teta) {
  if (localStorage.points) {
    pointsArray = JSON.parse(localStorage.points);
  }
  console.log(teta);
  let XY;
  let dx = pointsArray.lines[0].x - 0;
  let dy = pointsArray.lines[0].y - 0;
  myMove(-dx, -dy);

  pointsArray = JSON.parse(localStorage.points);

  if (pointsArray.lines) {
    for (let i = 0; i < pointsArray.lines.length; i++) {
      if (pointsArray.lines[i].line == 0) {
        XY = calaXY(pointsArray.lines[i].x, pointsArray.lines[i].y, teta);
        pointsArray.lines[i].x = XY.tx;
        pointsArray.lines[i].y = XY.ty;
      } else {
        XY = calaXY(pointsArray.lines[i].x, pointsArray.lines[i].y, teta);
        pointsArray.lines[i].x = XY.tx;
        pointsArray.lines[i].y = XY.ty;
      }
    }
  }
  if (pointsArray.circles) {
    for (let i = 0; i < pointsArray.circles.length; i++) {
      XY = calaXY(pointsArray.circles[i].x, pointsArray.circles[i].y, teta);
      pointsArray.circles[i].x = XY.tx;
      pointsArray.circles[i].y = XY.ty;
    }
  }
  if (pointsArray.curves) {
    for (let i = 0; i < pointsArray.curves.length; i++) {
      XY = calaXY(
        pointsArray.curves[i].startX,
        pointsArray.curves[i].startY,
        teta
      );
      pointsArray.curves[i].startX = XY.tx;
      pointsArray.curves[i].startY = XY.ty;
      XY = calaXY(pointsArray.curves[i].cp1x, pointsArray.curves[i].cp1y, teta);
      pointsArray.curves[i].cp1x = XY.tx;
      pointsArray.curves[i].cp1y = XY.ty;
      XY = calaXY(pointsArray.curves[i].cp2x, pointsArray.curves[i].cp2y, teta);
      pointsArray.curves[i].cp2x = XY.tx;
      pointsArray.curves[i].cp2y = XY.ty;
      XY = calaXY(pointsArray.curves[i].x, pointsArray.curves[i].y, teta);
      pointsArray.curves[i].x = XY.tx;
      pointsArray.curves[i].y = XY.ty;
    }
  }
  localStorage.setItem("points", JSON.stringify(pointsArray));
  myMove(dx, dy);
}

function myReflectX() {
  let dx = pointsArray.lines[0].x - 0;
  let dy = pointsArray.lines[0].y - 0;
  myMove(-dx, -dy);

  if (localStorage.points) {
    pointsArray = JSON.parse(localStorage.points);
    if (pointsArray.lines) {
      for (let i = 0; i < pointsArray.lines.length; i++) {
        if (pointsArray.lines[i].line == 0) {
          if (pointsArray.lines[i].y != 0) {
            pointsArray.lines[i].y = -pointsArray.lines[i].y;
          }
        } else {
          if (pointsArray.lines[i].y != 0) {
            pointsArray.lines[i].y = -pointsArray.lines[i].y;
          }
        }
      }
    }
    if (pointsArray.circles) {
      for (let i = 0; i < pointsArray.circles.length; i++) {
        if (pointsArray.circles[i].y != 0) {
          pointsArray.circles[i].y = -pointsArray.circles[i].y;
        }
      }
    }
    if (pointsArray.curves) {
      for (let i = 0; i < pointsArray.curves.length; i++) {
        if (pointsArray.curves[i].startY != 0) {
          pointsArray.curves[i].startY = -pointsArray.curves[i].startY;
        }
        if (pointsArray.curves[i].cp1y != 0) {
          pointsArray.curves[i].cp1y = -pointsArray.curves[i].cp1y;
        }
        if (pointsArray.curves[i].cp2y != 0) {
          pointsArray.curves[i].cp2y = -pointsArray.curves[i].cp2y;
        }
        if (pointsArray.curves[i].y != 0) {
          pointsArray.curves[i].y = -pointsArray.curves[i].y;
        }
      }
    }
  }
  localStorage.setItem("points", JSON.stringify(pointsArray));
  myMove(pointsArray.lines[0].x - 0, pointsArray.lines[0].y - 0);
  myMove(dx, dy);
}

function myReflectY() {
  let dx = pointsArray.lines[0].x - 0;
  let dy = pointsArray.lines[0].y - 0;
  myMove(-dx, -dy);

  if (localStorage.points) {
    pointsArray = JSON.parse(localStorage.points);
    if (pointsArray.lines) {
      for (let i = 0; i < pointsArray.lines.length; i++) {
        if (pointsArray.lines[i].line == 0) {
          if (pointsArray.lines[i].x != 0) {
            pointsArray.lines[i].x = -pointsArray.lines[i].x;
          }
        } else {
          if (pointsArray.lines[i].x != 0) {
            pointsArray.lines[i].x = -pointsArray.lines[i].x;
          }
        }
      }
    }
    if (pointsArray.circles) {
      for (let i = 0; i < pointsArray.circles.length; i++) {
        if (pointsArray.circles[i].x != 0) {
          pointsArray.circles[i].x = -pointsArray.circles[i].x;
        }
      }
    }
    if (pointsArray.curves) {
      for (let i = 0; i < pointsArray.curves.length; i++) {
        if (pointsArray.curves[i].startX != 0) {
          pointsArray.curves[i].startX = -pointsArray.curves[i].startX;
        }
        if (pointsArray.curves[i].cp1x != 0) {
          pointsArray.curves[i].cp1x = -pointsArray.curves[i].cp1x;
        }
        if (pointsArray.curves[i].cp2x != 0) {
          pointsArray.curves[i].cp2x = -pointsArray.curves[i].cp2x;
        }
        if (pointsArray.curves[i].x != 0) {
          pointsArray.curves[i].x = -pointsArray.curves[i].x;
        }
      }
    }
  }
  localStorage.setItem("points", JSON.stringify(pointsArray));
  myMove(pointsArray.lines[0].x - 0, pointsArray.lines[0].y - 0);
  myMove(dx, dy);
}

function myShearX(shearX) {
  let dx = pointsArray.lines[0].x - 0;
  let dy = pointsArray.lines[0].y - 0;
  myMove(-dx, -dy);

  if (localStorage.points) {
    pointsArray = JSON.parse(localStorage.points);
    if (pointsArray.lines) {
      for (let i = 0; i < pointsArray.lines.length; i++) {
        if (pointsArray.lines[i].line == 0) {
          pointsArray.lines[i].x -= shearX * pointsArray.lines[i].y;
        } else {
          pointsArray.lines[i].x -= shearX * pointsArray.lines[i].y;
        }
      }
    }
    if (pointsArray.circles) {
      for (let i = 0; i < pointsArray.circles.length; i++) {
        pointsArray.circles[i].x -= shearX * pointsArray.circles[i].y;
      }
    }
    if (pointsArray.curves) {
      for (let i = 0; i < pointsArray.curves.length; i++) {
        pointsArray.curves[i].startX -= shearX * pointsArray.curves[i].startY;
        pointsArray.curves[i].cp1x -= shearX * pointsArray.curves[i].cp1y;
        pointsArray.curves[i].cp2x -= shearX * pointsArray.curves[i].cp2y;
        pointsArray.curves[i].x -= shearX * pointsArray.curves[i].y;
      }
    }
  }
  localStorage.setItem("points", JSON.stringify(pointsArray));
  myMove(dx, dy);
}

function compare(coord_1, coord_2) {
  let comparison = 0;
  if (coord_1 && coord_2) {
    if (coord_1.y >= coord_2.y) {
      comparison = 1;
    } else {
      comparison = -1;
    }
    return comparison;
  }
}
function getMinPoints() {
  let minPointsArray = [];
  let lineMinCoord, circleMinCoord, curveMinCoord;
  if (localStorage.points) {
    pointsArray = JSON.parse(localStorage.points);
    if (pointsArray.lines) {
      lineMinCoord = pointsArray.lines.sort(compare)[0];
      minPointsArray.push(lineMinCoord);
    }
    if (pointsArray.circles) {
      circleMinCoord = pointsArray.circles.sort(compare)[0];
      minPointsArray.push(circleMinCoord);
    }
    if (pointsArray.curves) {
      curveMinCoord = pointsArray.curves.sort(compare)[0];
      minPointsArray.push(curveMinCoord);
    }
    return minPointsArray.sort(compare)[0];
  }
}

function initAngleInput() {
  jQuery(
    '<div class="quantity-nav"><div class="quantity-button quantity-up">+</div><div class="quantity-button quantity-down">-</div></div>'
  ).insertAfter(".quantity input");
  jQuery(".quantity").each(function() {
    var spinner = jQuery(this),
      input = spinner.find('input[id="rotatAngleInput"]'),
      btnUp = spinner.find(".quantity-up"),
      btnDown = spinner.find(".quantity-down"),
      min = input.attr("min"),
      max = input.attr("max");

    btnUp.click(function() {
      var oldValue = parseFloat(input.val());
      if (oldValue >= max) {
        var newVal = oldValue;
      } else {
        var newVal = oldValue + 1;
      }
      spinner.find("input").val(newVal);
      spinner.find("input").trigger("change");
    });

    btnDown.click(function() {
      var oldValue = parseFloat(input.val());
      if (oldValue <= min) {
        var newVal = oldValue;
      } else {
        var newVal = oldValue - 1;
      }
      spinner.find("input").val(newVal);
      spinner.find("input").trigger("change");
    });
  });
}
/* Window on load */

window.onresize = () => {
  setLeftMenuAndCanvasHight();
};

window.onload = () => {
  /* Ajust canvas and left menu size*/
  setLeftMenuAndCanvasHight();
  initAngleInput();

  /* Canvas */
  let canvas = document.getElementById("myCanvas");
  let ctx = canvas.getContext("2d");

  /* Global scope variables */
  let fileName;
  let moveButtonFlag = false;
  let shearButtonFlag = false;
  let isDraw = false;

  /* Scaling variable */
  let scaleIn = parseFloat(1.1);
  let scaleOut = parseFloat(1 / scaleIn);

  /*  Set input file lisener*/

  function onChange(event) {
    var reader = new FileReader();
    fileName = event.target.files[0].name;
    document.getElementById("loadFileLable").children[1].innerHTML = fileName;
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0]);
  }

  function onReaderLoad(event) {
    var obj = JSON.parse(event.target.result);
    localStorage.setItem("points", JSON.stringify(obj));
    localStorage.setItem("refreshPoints", JSON.stringify(obj));
  }

  document.getElementById("loadFileInput").addEventListener("change", onChange);

  /* Set draw button lisener */

  let drawButton = document.getElementById("draw");
  drawButton.addEventListener("click", () => {
    if (!fileName) {
      alert("Please Load File...");
    } else {
      clearCanvas(ctx);
      drawObject(ctx);
      isDraw = true;
    }
  });

  let refreshButton = document.getElementById("refreshButton");
  refreshButton.addEventListener("click", () => {
    if (isDraw) {
      pointsArray = JSON.parse(localStorage.refreshPoints);
      localStorage.setItem("points", JSON.stringify(pointsArray));
      clearCanvas(ctx);
      drawObject(ctx);
    } else {
      alert("Load file Please...");
    }
  });

  /* Set moveButton listner */
  let moveButton = document.getElementById("moveButton");
  moveButton.addEventListener("click", () => {
    if (isDraw) {
      moveButton.style.backgroundColor = "darkgrey";
      moveButtonFlag = true;
    } else {
      alert("Load file Please...");
    }
  });

  /* Set zoom in / out button listeners*/

  let zoomInButton = document.getElementById("zoomInButton");
  zoomInButton.addEventListener("click", () => {
    myScaling(scaleIn, "zoomIn");
    drawObject(ctx);
  });

  let zoomOutButton = document.getElementById("zoomOutButton");
  zoomOutButton.addEventListener("click", () => {
    myScaling(scaleOut, "zoomOut");
    drawObject(ctx);
  });

  /* ---------------------------------------------------------- */

  /* Set Rotation listeners */

  let rotatRightButton = document.getElementById("rotatRightButton");
  let inputAngle = document.getElementById("rotatAngleInput");
  rotatRightButton.addEventListener("click", () => {
    if (localStorage.points) {
      myRotation(inputAngle.value);
      drawObject(ctx);
    }
  });

  /* Set x-axis Reflection listener */

  let reflectXbuttin = document.getElementById("reflectXbuttin");
  reflectXbuttin.addEventListener("click", () => {
    if (localStorage.points) {
      myReflectX();
      drawObject(ctx);
    }
  });

  /* Set y-axis Reflection listener */

  let reflectYbuttin = document.getElementById("reflectYbuttin");
  reflectYbuttin.addEventListener("click", () => {
    if (localStorage.points) {
      myReflectY();
      drawObject(ctx);
    }
  });

  /* Set Shear X listener */
  let minPoints;

  let shearFacotr = parseFloat(1.1);
  let shearReFacotr = -parseFloat(1.1);

  let shearXButton = document.getElementById("shearXButton");
  shearXButton.addEventListener("click", () => {
    if (isDraw) {
      shearXButton.style.backgroundColor = "darkgrey";
      shearButtonFlag = true;

      console.log(minPoints);
    } else {
      alert("Load file Please...");
    }
  });

  /* ----------------------------------------------------------- */

  /* Move variables */
  let movePoints = [];
  let movePointsIndex = 0;

  /* Shear variable */
  let shearClickPoint;
  let mouseClickedOnShear = false;
  let oldX;
  /* main */
  canvas.onclick = event => {
    /* Translate object logic */
    if (moveButtonFlag) {
      movePoints[movePointsIndex] = relMouseCoords(ctx.canvas, event);
      movePointsIndex++;

      if (movePoints.length == 2) {
        let tx = movePoints[1].x - movePoints[0].x;
        let ty = movePoints[1].y - movePoints[0].y;

        if (localStorage.points) {
          myMove(tx, ty);
          drawObject(ctx);
          movePoints = [];
          movePointsIndex = 0;
          moveButton.style.backgroundColor = "rgb(114, 111, 111)";
          moveButtonFlag = false;
        }
      }
    }

    if (shearButtonFlag) {
      shearClickPoint = relMouseCoords(ctx.canvas, event);
      console.log(shearClickPoint);
      shearButtonFlag = false;
      shearXButton.style.backgroundColor = "rgb(114, 111, 111)";
    }
  };

  /* Canvas listener */
  canvas.addEventListener(
    "wheel",
    function(event) {
      console.log(event);
      if (event.deltaY < 0) {
        myScaling(scaleIn, "zoomIn");
        drawObject(ctx);
      } else if (event.deltaY > 0) {
        myScaling(scaleOut, "zoomOut");
        drawObject(ctx);
      }
      event.preventDefault();
    },
    false
  );

  canvas.onmousemove = event => {
    event.preventDefault();
    event.stopPropagation();
    minPoints = getMinPoints();
    let mouseCoord;
    if (shearButtonFlag) {
      mouseCoord = relMouseCoords(ctx.canvas, event);
      if (
        mouseCoord.y >= minPoints.y - 10 &&
        mouseCoord.y <= minPoints.y + 10
      ) {
        canvas.style.cursor = "pointer";

        if (mouseClickedOnShear == true) {
          console.log("move");
          console.log("oldX--: " + oldX);
          if (event.pageX > oldX + 2) {
            console.log("right: " + event.pageX);
            myShearX(shearFacotr);
          } else if (event.pageX < oldX - 2) {
            myShearX(shearReFacotr);

            console.log("left: " + event.pageX);
          }
          oldX = event.pageX;

          drawObject(ctx);
        }
      } else {
        canvas.style.cursor = "default";
      }
    }
  };

  canvas.onmousedown = event => {
    minPoints = getMinPoints();
    mouseCoord = relMouseCoords(ctx.canvas, event);
    if (shearButtonFlag) {
      if (
        mouseCoord.y >= minPoints.y - 10 &&
        mouseCoord.y <= minPoints.y + 10
      ) {
        console.log("down");
        mouseClickedOnShear = true;
        oldX = event.pageX;
        console.log("oldX onClick: " + oldX);
      }
    }
  };

  canvas.onmouseup = event => {
    if (mouseClickedOnShear == true) {
      console.log("up");
      mouseClickedOnShear = false;
      canvas.style.cursor = "default";
    }
  };
};
