<?php

if (!isset($_GET["id"]) || $_GET["id"] == "" ||
    !isset($_GET["route"]) || $_GET["route"] == ""
) {
    die("Erforderliche Parameter nicht angegeben!");
}

$con = mysqli_connect("localhost", "root", "", "rbc");
if (!$con) {
    die('Could not connect: ' . mysqli_error($con));
}

$id = mysqli_real_escape_string($con, $_GET["id"]);
$route = mysqli_real_escape_string($con, $_GET["route"]);


$sql = "SELECT next_id FROM rbc.route_" . $route . " WHERE id='" . $id . "'";
$result = mysqli_query($con, $sql);
$row = mysqli_fetch_assoc($result);

echo $row["next_id"];

mysqli_close($con);

?>