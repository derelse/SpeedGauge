/**
 * Created by ElsE on 13.05.2017.
 */


var currentSpeed = 0;
var aimedSpeed = 0;
var minSpeed = 0;
var maxSpeed = 400;


function drawTacho() {
    drawCircle();
    drawLine(500, 500, 600, 600);
}

function speedToAngle() {
    var speed = (currentSpeed ),
        speedAngle = (speed * 2) % 180;

    //speed is doubled, so the division by 180 ends in a half circle
    // make sure angle is in the upper half
    if (speedAngle > 180) {
        speedAngle = speedAngle - 180;
    } else if (speedAngle < 0) {
        speedAngle = speedAngle + 180;
    }
    return speedAngle;
}

function drawCircle() {

    var c = document.getElementById("tacho");
    var ctx = c.getContext("2d");
    ctx.moveTo(500, 500);
    ctx.beginPath();

    start = degToRad(180);
    end = degToRad(360);
    // /ctx.arc(xPos, yPos, Radius, StartPoint, EndPoint)
    ctx.arc(500, 500, 250, start, end);
    ctx.stroke();
}

function drawLineToSpeed(currentSpeed) {


}

function speedToPositionOnArc(speed) {

}

function drawTicks() {
    //tics every 10 km/h


}

function drawLine(startX, startY, endX, endY) {

    //start is always the center of the gauge
    //end is the representation of the current speed on the circle

    var c = document.getElementById("tacho");
    var ctx = c.getContext("2d");

    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

}

function degToRad(angle) {
    // Degrees to radians
    return ((angle * Math.PI) / 180);
}

function radToDeg(angle) {
    // Radians to degree
    return ((angle * 180) / Math.PI);
}


// obkect mit currentValues erstellen, indem die aktuellen Daten gespeichert werden!
