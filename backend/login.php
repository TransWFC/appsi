<?php
header('Access-Control-Allow-Origin: *');  
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

function openConnection() {
    $host = "localhost";
    $user = "webuser";
    $password = "password123";
    $database = "seguridad";
    
    $conn = new mysqli($host, $user, $password, $database);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    return $conn;
}

function closeConnection($conn) {
    $conn->close();
}

$json = file_get_contents("php://input");
$data = json_decode($json, true);

if (!isset($data['usuario']) || !isset($data['contrasena'])) {
    die(json_encode(["status" => "failure", "error" => "Datos incompletos"]));
}

$usuario = $data['usuario'];
$contrasena = $data['contrasena'];

$conn = openConnection();

// Selecciona solo el hash de la contraseña del usuario
$query = "SELECT contrasena FROM usuarios WHERE usuario = ?";

if ($stmt = $conn->prepare($query)) {
    $stmt->bind_param("s", $usuario);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows === 1) {
        $stmt->bind_result($hashGuardado);
        $stmt->fetch();

        // Verificar la contraseña ingresada con el hash
        if (password_verify($contrasena, $hashGuardado)) {
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "failure", "error" => "Credenciales incorrectas"]);
        }
    } else {
        echo json_encode(["status" => "failure", "error" => "Usuario no encontrado"]);
    }

    $stmt->close();
}

closeConnection($conn);
?>
