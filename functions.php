<?php

if (!isset($_GET["from_id"]) || $_GET["from_id"] == "" ||
    !isset($_GET["to_id"]) || $_GET["to_id"] == ""
) {
    die("Erforderliche Parameter nicht angegeben!");
}

$con = mysqli_connect("localhost", "root", "", "rbc");
if (!$con) {
    die('Could not connect: ' . mysqli_error($con));
}

$from_id = mysqli_real_escape_string($con, $_GET["from_id"]);
$to_id = mysqli_real_escape_string($con, $_GET["to_id"]);

$sql = "SELECT speed FROM rbc.speed WHERE from_id='" . $from_id . "' AND to_id = '" . $to_id . "'";
$result = mysqli_query($con, $sql);
$row = mysqli_fetch_assoc($result);

echo $row["speed"];

mysqli_close($con);

?>