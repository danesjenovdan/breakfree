<?php

header('Access-Control-Allow-Origin: *');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "djnd";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("connect_error: " . $conn->connect_error);
}

$table = isset($_REQUEST['k']) ? trim($conn->real_escape_string($_REQUEST['k'])) : '';
$table = trim(preg_replace('/[^0-9a-z]/', '', $table));

if (empty($table)) {
    die('invalid key');
}

/* CREATE */
if ($result = $conn->query("SHOW TABLES LIKE '" . $table . "'")) {
    if($result->num_rows != 1) {
        if (isset($_REQUEST['create'])) {
            $sql = "CREATE TABLE $table (
                id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(30) NOT NULL,
                email VARCHAR(50) NOT NULL UNIQUE,
                subscribe_djnd BOOLEAN NOT NULL DEFAULT 0,
                subscribe_greenpeace BOOLEAN NOT NULL DEFAULT 0
            )";

            if ($conn->query($sql)) {
                die("create error");
            }
            echo("created");
            exit();
        } else {
            die("key doesnt exist");
        }
        $result->close();
    }
} else {
    die("exists error");
}

/* COUNT */
if (isset($_REQUEST['count'])) {
    $sql = "SELECT COUNT(1) FROM $table";
    if($result = $conn->query($sql)) {
        echo $result->fetch_row()[0];
        $result->close();
    } else {
        die('count error');
    }
    exit();
}

/* LIST */
$list = array();
if (isset($_REQUEST['list'])) {
    $sql = "SELECT name FROM $table";
    if($result = $conn->query($sql)) {
        while($row = $result->fetch_row()) {
            array_push($list, $row[0]);
        }
        echo join(', ', $list);
        $result->close();
    } else {
        die('list error');
    }
    exit();
}

/* INSERT */
$name = isset($_REQUEST['name']) ? trim($conn->real_escape_string($_REQUEST['name'])) : '';
$name = htmlspecialchars($name);
if (empty($name)) { die('invalid name'); }
$email = isset($_REQUEST['email']) ? trim($conn->real_escape_string($_REQUEST['email'])) : '';
$email = htmlspecialchars($email);
if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) { die('invalid email'); }
$subscribe_djnd = isset($_REQUEST['subscribe_djnd']) ? trim($conn->real_escape_string($_REQUEST['subscribe_djnd'])) : '';
$subscribe_djnd = filter_var(htmlspecialchars($subscribe_djnd), FILTER_VALIDATE_BOOLEAN);
$subscribe_greenpeace = isset($_REQUEST['subscribe_greenpeace']) ? trim($conn->real_escape_string($_REQUEST['subscribe_greenpeace'])) : '';
$subscribe_greenpeace = filter_var(htmlspecialchars($subscribe_greenpeace), FILTER_VALIDATE_BOOLEAN);

$sql = "INSERT INTO $table (name, email, subscribe_djnd, subscribe_greenpeace) VALUES ('$name', '$email', '$subscribe_djnd', '$subscribe_greenpeace')";

if($conn->query($sql)) {
    exit("success");
} else {
    die("insert error");
}

$conn->close();
?>
