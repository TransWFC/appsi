<?php
header('Access-Control-Allow-Origin: *');  
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

function openConnection() {
    $servername = "localhost";
    $username = "root";
    $password = "Moreno0310SM21"; 
    $dbname = "seguridad";  

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        http_response_code(500);
        echo json_encode(["error" => "Database connection failed"]);
        exit();
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

    if (!isset($data['usuario']) || !isset($data['contrasena'])) {
        http_response_code(400);
        echo json_encode(["error" => "Datos incompletos"]);
        exit();
    }

    $usuario = trim($data['usuario']);
    $contrasena = trim($data['contrasena']);

    // Validaciones de entrada (Evita inyección y ataques XSS)
    if (empty($usuario) || empty($contrasena) || !preg_match('/^[a-zA-Z0-9_]{3,30}$/', $usuario)) {
        http_response_code(400);
        echo json_encode(["error" => "Usuario o contraseña no válidos"]);
        exit();
    }

    $conn = openConnection();

    $query = "SELECT contrasena FROM usuarios WHERE usuario = ?";
    
    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param("s", $usuario);
        $stmt->execute();
        $stmt->bind_result($hashed_password);
        
        if ($stmt->fetch() && password_verify($contrasena, $hashed_password)) {
            echo json_encode(["status" => "success"]);
        } else {
            http_response_code(401);
            echo json_encode(["error" => "Credenciales incorrectas"]);
        }

        $stmt->close();
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Error en la consulta"]);
    }

    closeConnection($conn);
}
?>
