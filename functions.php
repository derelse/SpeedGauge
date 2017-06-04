<?php

$id = $_GET['id'];

$con = mysqli_connect("localhost", "root", "", "rbc");
if (!$con) {
    die('Could not connect: ' . mysqli_error($con));
}
mysqli_select_db($con, rbc);
$sql = "SELECT speed FROM rbc.speed WHERE to_id = '$id'";

$result = mysqli_query($con, $sql);

echo $result;
mysqli_close($con);
?>
