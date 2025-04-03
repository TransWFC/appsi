<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Route handler
$requestMethod = $_SERVER['REQUEST_METHOD'];
$requestUri = $_SERVER['REQUEST_URI'];
$uriParts = explode('/', trim($requestUri, '/'));

if (count($uriParts) >= 2 && $uriParts[0] === 'api') {
    $route = $uriParts[1];
    if ($route === 'login' && $requestMethod === 'POST') {
        require 'login.php';
    } elseif ($route === 'menu' && count($uriParts) === 3) {
        require 'crud.php';
    } else {
        echo 'Invalid API Route';
    }
} else {
    echo 'Invalid API Route';
}
?>
