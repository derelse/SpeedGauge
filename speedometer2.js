/**
 * Created by ElsE on 13.05.2017.
 */

//global variables
var iCurrentSpeed = 150,
    iTargetSpeed = 100,
    bDecrement = null,
    job = null,
    red = "rgb(255,0,0)",   //color codes so you dont have to type them if needed
    yellow = "rgb(244, 247, 74)",
    grey = "rgb(189,201,197)",
    color = grey,
    route = 1,
    currentTrack = 1,
    nextTrack = 2,
    tooFast = false;

function draw() {
    /* Main entry point for drawing the speedometer
     * If canvas is not support alert the user.
     */

    //console.log('Target: ' + iTargetSpeed);
    //console.log('Current: ' + iCurrentSpeed);
    document.getElementById('currentSpeed').innerHTML = Math.round(iCurrentSpeed);
    document.getElementById('targetSpeed').innerHTML = Math.round(iTargetSpeed);
    var canvas = document.getElementById('tacho'),
        options = null;


    // Canvas good?
    if (canvas !== null && canvas.getContext) {
        options = buildOptionsAsJSON(canvas, iCurrentSpeed);

        // Clear canvas
        clearCanvas(options);
        //draw Background box
        drawBackground(options);
        //set the color to yellow or grey
        checkSpeed(options);
        // Draw speedometer outer speed arc
        drawOuterArc(options);
        // Draw tick marks
        drawTicks(options);
        // Draw the needle and base
        drawNeedle(options);
        //draw the current speed in numbers
        drawSpeedBox(options);

    } else {
        alert("Canvas not supported by your browser!");
    }
    if (iTargetSpeed == Math.round(iCurrentSpeed)) {
        clearTimeout(job);
        return;
    } else if (iTargetSpeed < iCurrentSpeed) {
        bDecrement = true;
    } else if (iTargetSpeed > iCurrentSpeed) {
        bDecrement = false;
    }
    if (bDecrement) {
        iCurrentSpeed = iCurrentSpeed - 0.1;
    } else {
        iCurrentSpeed = iCurrentSpeed + 0.1;
    }

    job = setTimeout("draw()", 5);
}

function degToRad(angle) {
    // Degrees to radians

    var rad = ((angle * Math.PI) / 180);


    //shift the start so the open space is at the bottom
    rad = rad - (Math.PI * (3 / 8));
    return rad;
}

function radToDeg(angle) {
    // Radians to degree
    var degree = (angle * 180) / Math.PI;


    //shift the start so the open space is at the bottom
    degree = degree - (Math.PI * (3 / 8));
    return degree;
}

function convertSpeedToAngle(options) {
    /* Helper function to convert a speed to the
     * equivelant angle.
     */
    var iSpeed = (iCurrentSpeed);
    var iSpeedAsAngle;
    //10 km/h = 9 degrees
    iSpeedAsAngle = (iSpeed * 0.9);
    return iSpeedAsAngle;
}

function convertTargetSpeedToAngle() {
    /* Helper function to convert a speed to the
     * equivelant angle.
     */
    var targetSpeed = (iTargetSpeed );
    var iTargetSpeedAsAngle;
    //10 km/h = 9 degrees
    iTargetSpeedAsAngle = (targetSpeed * 0.9);
    return iTargetSpeedAsAngle;
}

function drawLine(options, line) {
    // Draw a line using the line object passed in
    options.ctx.beginPath();

    // Set attributes of open
    options.ctx.globalAlpha = line.alpha;
    options.ctx.lineWidth = line.lineWidth;
    options.ctx.fillStyle = line.fillStyle;
    options.ctx.strokeStyle = line.fillStyle;
    options.ctx.moveTo(line.from.X,
        line.from.Y);

    // Plot the line
    options.ctx.lineTo(
        line.to.X,
        line.to.Y
    );

    options.ctx.stroke();
}

function createLine(fromX, fromY, toX, toY, fillStyle, lineWidth, alpha) {
    // Create a line object using Javascript object notation
    return {
        from: {
            X: fromX,
            Y: fromY
        },
        to: {
            X: toX,
            Y: toY
        },
        fillStyle: fillStyle,
        lineWidth: lineWidth,
        alpha: alpha
    };
}

function drawBackground(options) {
    //draws the Background in a blueish colour
    var i = 0;
    options.ctx.globalAlpha = 1;
    options.ctx.fillStyle = "rgb(15,32,50)";
    //define the size of the background
    options.ctx.rect(0, 0, 500, 500);

    options.ctx.fill();
}

function applyDefaultContextSettings(options) {
    /* Helper function to revert to gauges
     * default settings
     */

    options.ctx.lineWidth = 2;
    options.ctx.globalAlpha = 1;
    options.ctx.strokeStyle = "rgb(255, 255, 255)";
    options.ctx.fillStyle = 'rgb(255,255,255)';
}

function drawSmallTickMarks(options) {
    //draw the small ticks every 10 km/h
    //ticks start at outer arc and move inwards
    //each tick has a different angle
    var tickvalue = options.levelRadius,
        iTick = 0,
        gaugeOptions = options.gaugeOptions,
        iTickRad = 0,
        innerTickY,
        innerTickX,
        onArchX,
        onArchY,
        fromX,
        fromY,
        toX,
        toY,
        line;

    applyDefaultContextSettings(options);

    tickvalue = options.levelRadius + 50;

    // small ticks every 10 km/h (9 degrees)
    for (iTick = 0; iTick <= 315; iTick += 9) {

        iTickRad = degToRad(iTick);

        /* Calculate the X and Y of both ends of the
         * line you need to draw at angle represented at Tick.
         * The aim is to draw the a line starting on the
         * outer arc and continueing towards the center
         */

        //angle of ticks
        onArchX = gaugeOptions.radius - (Math.cos(iTickRad) * tickvalue);
        onArchY = gaugeOptions.radius - (Math.sin(iTickRad) * tickvalue);
        //length of ticks
        innerTickX = gaugeOptions.radius - (Math.cos(iTickRad) * gaugeOptions.radius) * 1.1;
        innerTickY = gaugeOptions.radius - (Math.sin(iTickRad) * gaugeOptions.radius) * 1.1;
        //start Coordinates
        fromX = (options.center.X - gaugeOptions.radius) + onArchX;
        fromY = (gaugeOptions.center.Y - gaugeOptions.radius) + onArchY;
        //end Coordinates
        toX = (options.center.X - gaugeOptions.radius) + innerTickX;
        toY = (gaugeOptions.center.Y - gaugeOptions.radius) + innerTickY;

        // Create a line expressed in JSON
        line = createLine(fromX, fromY, toX, toY, "rgb(127,127,127)", 3, 1);

        // Draw the line
        drawLine(options, line);
    }
}

function drawLargeTickMarks(options) {
    //draw the big ticks every 10 km/h
    //ticks start at outer arc and move inwards
    //each tick has a different angle

    var tickvalue = options.levelRadius + 50,
        iTick = 0,
        gaugeOptions = options.gaugeOptions,
        iTickRad = 0,
        onArchX,
        onArchY,
        innerTickX,
        innerTickY,
        fromX,
        fromY,
        line,
        toX,
        toY;

    applyDefaultContextSettings(options);
    // Tick every 50 kmh (45 degrees)
    for (iTick = 0; iTick <= 315; iTick += 45) {

        iTickRad = degToRad(iTick);

        /* Calculate the X and Y of both ends of the
         * line you need to draw at angle represented at Tick.
         * The aim is to draw the a line starting on the
         * outer arc and continueing towards the center
         */
        //angle of ticks
        onArchX = gaugeOptions.radius - (Math.cos(iTickRad) * tickvalue);
        onArchY = gaugeOptions.radius - (Math.sin(iTickRad) * tickvalue);
        //length of ticks
        innerTickX = gaugeOptions.radius - (Math.cos(iTickRad) * gaugeOptions.radius);
        innerTickY = gaugeOptions.radius - (Math.sin(iTickRad) * gaugeOptions.radius);
        //start Coordinates
        fromX = (options.center.X - gaugeOptions.radius) + onArchX;
        fromY = (gaugeOptions.center.Y - gaugeOptions.radius) + onArchY;
        //end Coordinates
        toX = (options.center.X - gaugeOptions.radius) + innerTickX;
        toY = (gaugeOptions.center.Y - gaugeOptions.radius) + innerTickY;

        // Create a line expressed in JSON
        line = createLine(fromX, fromY, toX, toY, "rgb(189,201,197)", 3, 1);
        // Draw the line
        drawLine(options, line);

    }
}

function drawTextMarkers(options) {
    //every big Tick gets a textmarker to show the speed
    var innerTickX = 0,
        innerTickY = 0,
        iTick = 0,
        gaugeOptions = options.gaugeOptions,
        iTickToPrint = 0;

    applyDefaultContextSettings(options);

    // Font styling

    options.ctx.font = 'italic 16px sans-serif';
    options.ctx.textBaseline = 'top';
    options.ctx.strokeStyle = "#F2FDFD";


    options.ctx.beginPath();

    // Tick every 45 (Big ticks)
    for (iTick = 0; iTick <= 315; iTick += 45) {

        innerTickX = gaugeOptions.radius - (Math.cos(degToRad(iTick)) * gaugeOptions.radius) * 0.85;
        innerTickY = gaugeOptions.radius - (Math.sin(degToRad(iTick)) * gaugeOptions.radius) * 0.85;

        // Some cludging to center the values (TODO: Improve)
        if (iTick <= 10) {
            options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX,
                (gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY + 5);
        } else if (iTick < 50) {
            options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX - 5,
                (gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY + 5);
        } else if (iTick < 90) {
            options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX,
                (gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY);
        } else if (iTick === 90) {
            options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX + 4,
                (gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY);
        } else if (iTick < 145) {
            options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX + 10,
                (gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY);
        } else {
            options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 20 ) + innerTickX + 10,
                (gaugeOptions.center.Y - gaugeOptions.radius) - 12 + innerTickY);
        }

        // KMH increase by 50 every 45 degrees
        iTickToPrint += Math.round(50);
    }

    options.ctx.stroke();
}

function drawTicks(options) {
    //Calls the functions to draw small/big ticks
    //Also draws the TextMarkers to big ticks
    drawSmallTickMarks(options);
    drawLargeTickMarks(options);
    drawTextMarkers(options);
}

function drawOuterArc(options) {
    //draws the outer arc, representing the target speed

    var iTargetSpeedAsAngle = convertTargetSpeedToAngle();
    var iTargetSpeedAsAngleRad = degToRad(iTargetSpeedAsAngle);
    var iCurrentSpeedAsAngle = convertSpeedToAngle();
    var iCurrentSpeedAsAngleRad = degToRad(iCurrentSpeedAsAngle);

    options.ctx.beginPath();
    options.ctx.strokeStyle = color;
    options.ctx.lineWidth = 25;
    options.ctx.arc(
        options.center.X,
        options.center.Y,
        options.radius - 10,
        degToRad(180),                 //START
        iTargetSpeedAsAngleRad - Math.PI,   //END
        false);

    // Fill the object
    options.ctx.stroke();

    // if the train is over the targetSpeed, add a red section to the current speed
    if (iCurrentSpeed > iTargetSpeed){
        options.ctx.beginPath();
        options.ctx.strokeStyle = red;

        options.ctx.arc(
            options.center.X,
            options.center.Y,
            options.radius - 10,
            iTargetSpeedAsAngleRad - Math.PI,  //START
            iCurrentSpeedAsAngleRad - Math.PI,      //END
            false);
        options.ctx.stroke();
    }


}

function drawNeedleDial(options, alphaValue, fillStyle) {
    /* Draws the metallic dial that covers the base of the
     * needle.
     */
    var i = 0;



    options.ctx.globalAlpha = alphaValue;
    options.ctx.lineWidth = 3;
    options.ctx.fillStyle = fillStyle;

    // Draw several transparent circles with alpha


    for (i = 0; i < 35; i++) {

        options.ctx.beginPath();
        options.ctx.arc(options.center.X,
            options.center.Y,
            i,
            0,
            2 * Math.PI,
            true);

        options.ctx.fill();
        options.ctx.stroke();
    }
}

function drawNeedle(options) {
    /* Draw the needle  at the angle that represents the current speed
     */

    var needleColor = color;
    var iSpeedAsAngle = convertSpeedToAngle(options),
        iSpeedAsAngleRad = degToRad(iSpeedAsAngle),
        gaugeOptions = options.gaugeOptions,

        innerTickX = gaugeOptions.radius - (Math.cos(iSpeedAsAngleRad) * 20),
        innerTickY = gaugeOptions.radius - (Math.sin(iSpeedAsAngleRad) * 20),

        fromX = (options.center.X - gaugeOptions.radius) + innerTickX,
        fromY = (gaugeOptions.center.Y - gaugeOptions.radius) + innerTickY,

        endNeedleX = gaugeOptions.radius - (Math.cos(iSpeedAsAngleRad) * gaugeOptions.radius),
        endNeedleY = gaugeOptions.radius - (Math.sin(iSpeedAsAngleRad) * gaugeOptions.radius),

        toX = (options.center.X - gaugeOptions.radius) + endNeedleX,
        toY = (gaugeOptions.center.Y - gaugeOptions.radius) + endNeedleY;

    if (tooFast == true) {
        needleColor = red;
    }
    var line = createLine(fromX, fromY, toX, toY, needleColor, 5, 1);

    drawLine(options, line);
    //  draw the dial at the base
    drawNeedleDial(options, 1, needleColor);


}

function drawSpeedBox(options) {
    //draw the current Speed as numbers in the Center of the needle

    var startX = options.center.X -28 ,
        starty = options.center.Y -20,
        roundedSpeed = Math.round(iCurrentSpeed),
        speedAsString = roundedSpeed.toString();


    options.ctx.font = 'bold 36px sans-serif';
    options.ctx.fillStyle = "rgb(0, 0, 0)";

    if (roundedSpeed <100 && roundedSpeed >=10){
        speedAsString = "0" + speedAsString;
    }
    else if (roundedSpeed < 10){
        speedAsString = "00"+speedAsString;
    }

    options.ctx.fillText(speedAsString, startX, starty);

}

function buildOptionsAsJSON(canvas, iSpeed) {
    /* Setting for the speedometer
     * Alter these to modify its look and feel
     */

    var centerX = 210,
        centerY = 210,
        radius = 140,
        outerRadius = 200;

    // Create a speedometer object using Javascript object notation
    return {
        ctx: canvas.getContext('2d'),
        speed: iSpeed,
        center: {
            X: centerX,
            Y: centerY
        },
        levelRadius: radius - 10,
        gaugeOptions: {
            center: {
                X: centerX,
                Y: centerY
            },
            radius: radius
        },
        radius: outerRadius
    };
}

function clearCanvas(options) {
    options.ctx.clearRect(0, 0, 800, 600);
    applyDefaultContextSettings(options);
}

function checkSpeed() {
    //-1 to escape edge case where CurrentSpeed comes from above and it somehow doesn't reset to grey
    var cSpeed = iCurrentSpeed;
    cSpeed = cSpeed - 1;
    if ((cSpeed) > (iTargetSpeed)) {
        color = yellow;
        tooFast = true;
    } else {
        color = grey;
        tooFast = false;
    }
}

function setTargetSpeed(target) {

    if (target !== null) {
        iTargetSpeed = target;
        // Sanity checks
        if (isNaN(iTargetSpeed)) {
            iTargetSpeed = 0;
        } else if (iTargetSpeed < 0) {
            iTargetSpeed = 0;
        } else if (iTargetSpeed > 350) {
            iTargetSpeed = 350;
        }
        job = setTimeout("draw()", 5);
    }
}

function setCurrentSpeed() {
    var txtSpeed = document.getElementById('txtCurrentSpeed'.valueOf());
    if (txtSpeed !== null) {
        iCurrentSpeed = txtSpeed.value;
        // Sanity checks
        if (isNaN(iCurrentSpeed)) {
            iCurrentSpeed = 1;
        } else if (iCurrentSpeed < 0) {
            iCurrentSpeed = 1;
        } else if (iCurrentSpeed > 350) {
            iCurrentSpeed = 350;
        }
        job = setTimeout("draw()", 5);
    }
}


function advance() {
    changeTrack();
    currentTrack = nextTrack;
    getNextTrack();

}
function changeTrack() {

    var fromID = currentTrack;
    var toID = nextTrack;


    document.getElementById('currentTrack').innerHTML = "Aktueller Track: " + fromID;
    document.getElementById('nextTrack').innerHTML = "Nächster Track: " + toID;


    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            setTargetSpeed(xmlhttp.responseText.valueOf());
            //document.getElementById("txtTargetSpeed").innerHTML = xmlhttp.responseText;
        }
    };
    xmlhttp.open("GET", "getTargetSpeed.php?from_id=" + fromID + "&to_id=" + toID, true);
    xmlhttp.send();

}


function getNextTrack() {

    var cur = currentTrack;
    var tempRoute = route;
    //get next track based on current Track and current Route
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            setNextTrack(xhttp.responseText);

            //document.getElementById("txtTargetSpeed").innerHTML = xmlhttp.responseText;
        }
    };

    xhttp.open("GET", "getNext.php?id=" + cur + "&route=" + tempRoute, true);
    xhttp.send();

}
function setCurrentTrack(id) {
    currentTrack = id;
}
function setNextTrack(id) {
    nextTrack = id;
}


function setRoute() {

    //switch between teh routes
    //init needed variables

    if (document.getElementById('route1').checked) {

        route = 1;
        currentTrack = 1;
        nextTrack = 2

        document.getElementById('currentRoute').innerHTML = "Aktuelle Route: 1";
    }
    else if (document.getElementById('route2').checked) {

        route = 2;
        currentTrack = 1;
        nextTrack = 2

        document.getElementById('currentRoute').innerHTML = "Aktuelle Route: 2";
    }
    else if (document.getElementById('route3').checked) {

        route = 3;
        currentTrack = 9;
        nextTrack = 10;

        document.getElementById('currentRoute').innerHTML = "Aktuelle Route: 3";
    }
    ;

}




























