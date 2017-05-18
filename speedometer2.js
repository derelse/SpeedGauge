/**
 * Created by ElsE on 13.05.2017.
 */

/*jslint plusplus: true, sloppy: true, indent: 4 */
(function () {
    "use strict";
    // this function is strict...
}());

var iCurrentSpeed = 250,
    iTargetSpeed = 100,
    bDecrement = null,
    job = null;
yellow = "rgb(244, 247, 74)";
grey = "rgb(189,201,197)";
color = grey;


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
    var i = 0;
    options.ctx.globalAlpha = 1;
    options.ctx.fillStyle = "rgb(15,32,50)";

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

function drawLargeTickMarks(options) {
    /* The small tick marks against the coloured
     * arc drawn every 5 mph from 10 degrees to
     * 170 degrees.
     */

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

    // Tick every 20 degrees (big ticks)
    for (iTick = 0; iTick <= 315; iTick += 45) {

        iTickRad = degToRad(iTick);

        /* Calculate the X and Y of both ends of the
         * line I need to draw at angle represented at Tick.
         * The aim is to draw the a line starting on the
         * coloured arc and continueing towards the outer edge
         * in the direction from the center of the gauge.
         */

        onArchX = gaugeOptions.radius - (Math.cos(iTickRad) * tickvalue);
        onArchY = gaugeOptions.radius - (Math.sin(iTickRad) * tickvalue);
        innerTickX = gaugeOptions.radius - (Math.cos(iTickRad) * gaugeOptions.radius);
        innerTickY = gaugeOptions.radius - (Math.sin(iTickRad) * gaugeOptions.radius);

        fromX = (options.center.X - gaugeOptions.radius) + onArchX;
        fromY = (gaugeOptions.center.Y - gaugeOptions.radius) + onArchY;
        toX = (options.center.X - gaugeOptions.radius) + innerTickX;
        toY = (gaugeOptions.center.Y - gaugeOptions.radius) + innerTickY;

        // Create a line expressed in JSON
        line = createLine(fromX, fromY, toX, toY, "rgb(189,201,197)", 3, 1);

        // Draw the line
        drawLine(options, line);

    }
}

function drawSmallTickMarks(options) {
    /* The large tick marks against the coloured
     * arc drawn every 10 mph from 10 degrees to
     * 170 degrees.
     */

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

    // 10 units (small ticks)
    for (iTick = 0; iTick <= 315; iTick += 9) {

        iTickRad = degToRad(iTick);

        /* Calculate the X and Y of both ends of the
         * line I need to draw at angle represented at Tick.
         * The aim is to draw the a line starting on the
         * coloured arc and continueing towards the outer edge
         * in the direction from the center of the gauge.
         */
        //angle of ticks
        onArchX = gaugeOptions.radius - (Math.cos(iTickRad) * tickvalue);
        onArchY = gaugeOptions.radius - (Math.sin(iTickRad) * tickvalue);
        //length of ticks
        innerTickX = gaugeOptions.radius - (Math.cos(iTickRad) * gaugeOptions.radius) * 1.1;
        innerTickY = gaugeOptions.radius - (Math.sin(iTickRad) * gaugeOptions.radius) * 1.1;
        //angle
        fromX = (options.center.X - gaugeOptions.radius) + onArchX;
        fromY = (gaugeOptions.center.Y - gaugeOptions.radius) + onArchY;
        toX = (options.center.X - gaugeOptions.radius) + innerTickX;
        toY = (gaugeOptions.center.Y - gaugeOptions.radius) + innerTickY;

        // Create a line expressed in JSON
        line = createLine(fromX, fromY, toX, toY, "rgb(127,127,127)", 3, 1);

        // Draw the line
        drawLine(options, line);
    }
}

function drawTicks(options) {
    /* Two tick in the coloured arc!
     * Small ticks every 4°
     * Large ticks every 20°
     */
    drawSmallTickMarks(options);
    drawLargeTickMarks(options);
}

function drawTextMarkers(options) {
    /* The text labels marks above the coloured
     * arc drawn every 10 mph from 10 degrees to
     * 170 degrees.
     */
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


function drawSpeedometerOuterSpeedArc(options) {


    var iTargetSpeedAsAngle = convertTargetSpeedToAngle();
    //console.log("Target Speed Angle=" + iTargetSpeedAsAngle);
    var iTargetSpeedAsAngleRad = degToRad(iTargetSpeedAsAngle);
    //console.log("Target Speed Angle=" + iTargetSpeedAsAngleRad);
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

    // Fill the last object
    options.ctx.stroke();

}


function drawNeedleDial(options, alphaValue, strokeStyle, fillStyle) {
    /* Draws the metallic dial that covers the base of the
     * needle.
     */
    var i = 0;



    options.ctx.globalAlpha = alphaValue;
    options.ctx.lineWidth = 3;
    options.ctx.strokeStyle = strokeStyle;
    options.ctx.fillStyle = fillStyle;

    // Draw several transparent circles with alpha


    for (i = 0; i < 30; i++) {

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
    /* Draw the needle in a nice read colour at the
     * angle that represents the options.speed value.
     */


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
        toY = (gaugeOptions.center.Y - gaugeOptions.radius) + endNeedleY,
        line = createLine(fromX, fromY, toX, toY, color, 5, 1);

    drawLine(options, line);
    // Two circle to draw the dial at the base (give its a nice effect?)
    drawNeedleDial(options, 1, color, color);
    drawNeedleDial(options, 1, color, color);

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


function convertSpeedToAngle(options) {
    /* Helper function to convert a speed to the
     * equivelant angle.
     */
    var iSpeed = (options.speed);
    var iSpeedAsAngle;

    iSpeedAsAngle = (iSpeed * 0.9);

    return iSpeedAsAngle;
}

function convertTargetSpeedToAngle() {
    var targetSpeed = (iTargetSpeed );
    var iTargetSpeedAsAngle;


    iTargetSpeedAsAngle = (targetSpeed * 0.9);

    return iTargetSpeedAsAngle;

}


function drawSpeedBox(options) {

    var startX = options.center.X - 35,
        starty = options.center.Y + 150;


    options.ctx.font = 'bold 36px sans-serif';
    options.ctx.fillStyle = color;
    options.ctx.fillText(Math.round(iCurrentSpeed), startX, starty);

}

function clearCanvas(options) {
    options.ctx.clearRect(0, 0, 800, 600);
    applyDefaultContextSettings(options);
}

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
        checkSpeed();
        // Draw speedometer outer speed arc
        drawSpeedometerOuterSpeedArc(options);

        // Draw tick marks
        drawTicks(options);

        // Draw labels on markers
        drawTextMarkers(options);
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

    job = setTimeout("draw()", 10);
}
function checkSpeed() {
    //-1 to escape edge case where CurrentSpeed comes from above and it somehow doesn't reset to grey
    var cSpeed = iCurrentSpeed;
    cSpeed = cSpeed - 1;
    if ((cSpeed) > (iTargetSpeed)) {
        color = yellow;
    } else {
        (color = grey);
    }
}

function drawWithInputValue() {


    var txtSpeed = document.getElementById('txtTargetSpeed');

    if (txtSpeed !== null) {

        iTargetSpeed = txtSpeed.value;

        // Sanity checks
        if (isNaN(iTargetSpeed)) {
            iTargetSpeed = 0;
        } else if (iTargetSpeed < 0) {
            iTargetSpeed = 0;
        } else if (iTargetSpeed > 350) {
            iTargetSpeed = 350;
        }

        job = setTimeout("draw()", 10);

    }
}

function setCurrentSpeed() {


    var txtSpeed = document.getElementById('txtCurrentSpeed');

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

        job = setTimeout("draw()", 10);

    }
}