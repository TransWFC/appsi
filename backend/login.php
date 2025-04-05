<?php
header('Access-Control-Allow-Origin: *');  
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

function openConnection() {
    $host = "localhost";
    $user = "webuser";
    $password = "password123";
    $database = "seguridad";
    
    $conn = new mysqli($host, $user, $password, $database);
    if ($conn->connect_error) {
        die(json_encode(["status" => "error", "error" => "Connection failed"]));
    }
    return $conn;
}

function closeConnection($conn) {
    $conn->close();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $json = file_get_contents("php://input");
    $data = json_decode($json, true);

    error_log("Datos recibidos: " . print_r($data, true));

    if (!isset($data['usuario']) || !isset($data['contrasena'])) {
        echo json_encode(["status" => "error", "error" => "Datos incompletos"]);
        exit;
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
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "failure", "error" => "Credenciales incorrectas"]);
        }

        $stmt->close();
    }

    closeConnection($conn);
}
?>
