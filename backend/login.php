<?php
header('Access-Control-Allow-Origin: *');  
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

function openConnection() {
    $servername = "localhost";
    $username = "root";
    $password = ""; 
    $dbname = "seguridad";  

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    return $conn;
}

function closeConnection($conn) {
    $conn->close();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Leer y decodificar el JSON recibido
    $json = file_get_contents("php://input");
    $data = json_decode($json, true);

    // Depurar: Ver qué está recibiendo PHP
    error_log("Datos recibidos: " . print_r($data, true));

    if (!isset($data['usuario']) || !isset($data['contrasena'])) {
        die("Error: Datos incompletos");
    }

    $usuario = $data['usuario'];
    $contrasena = $data['contrasena'];

    $conn = openConnection();

    $query = "SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?";
    
    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param("ss", $usuario, $contrasena);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            echo 'success'; 
        } else {
            echo 'failure'; 
        }

        $stmt->close();
    }

    closeConnection($conn);
}
?>
