<?php
header('Access-Control-Allow-Origin: *');  
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Load sensitive data from environment variables
$host = getenv('DB_HOST');
$user = getenv('DB_USER');
$password = getenv('DB_PASSWORD');
$database = getenv('DB_NAME');

// Function to open the secure connection
function openConnection() {
    global $host, $user, $password, $database;

    $conn = new mysqli($host, $user, $password, $database);

    // Check for a successful connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    return $conn;
}

// Function to close the connection
function closeConnection($conn) {
    $conn->close();
}

// Function to create a user with a hashed password
function createUser($conn) {
    $usuario = 'joshualuna@gmail.com';
    $password = 'AlphaPrime1#';

    // Hash the password securely
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Prepare the insert query to add the new user
    $query = "INSERT INTO usuarios (usuario, contrasena) VALUES (?, ?)";

    if ($stmt = $conn->prepare($query)) {
        $stmt->bind_param("ss", $usuario, $hashed_password);
        $stmt->execute();
        $stmt->close();
    }
}

// Receive JSON input
$json = file_get_contents("php://input");
error_log("JSON crudo recibido: " . $json);

$data = json_decode($json, true);
error_log("JSON decodificado: " . print_r($data, true));

if (!isset($data['usuario']) || !isset($data['contrasena'])) {
    die("Error: Datos incompletos");
}

$usuario = $data['usuario'];
$contrasena = $data['contrasena'];

$conn = openConnection();

// Query to fetch user and password hash
$query = "SELECT contrasena FROM usuarios WHERE usuario = ?";

if ($stmt = $conn->prepare($query)) {
    $stmt->bind_param("s", $usuario); // Bind parameter to prevent SQL injection
    $stmt->execute();
    $stmt->store_result();
    
    if ($stmt->num_rows > 0) {
        // Bind result to get the hashed password from the query
        $stmt->bind_result($hashed_password_from_db);
        $stmt->fetch();

        // Verify the password with the hash stored in the database
        if (password_verify($contrasena, $hashed_password_from_db)) {
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
