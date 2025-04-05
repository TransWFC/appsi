<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
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

// Handle different CRUD actions
$requestMethod = $_SERVER['REQUEST_METHOD'];
$conn = openConnection();


switch ($requestMethod) {
    case 'GET':
        // Read coffee menu
        if (isset($_GET['id'])) {
            $id = $_GET['id'];
            $query = "SELECT * FROM coffee_menu WHERE id = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();
            $data = $result->fetch_assoc();
            echo json_encode($data);
        } else {
            $query = "SELECT * FROM coffee_menu";
            $result = $conn->query($query);
            $data = $result->fetch_all(MYSQLI_ASSOC);
            echo json_encode($data);
        }
        break;

    case 'POST':
        // Create a new coffee entry
        $json = file_get_contents("php://input");
        $data = json_decode($json, true);

        if (isset($data['name']) && isset($data['price'])) {
            $name = $data['name'];
            $price = $data['price'];

            $query = "INSERT INTO coffee_menu (name, price) VALUES (?, ?)";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("sd", $name, $price);
            if ($stmt->execute()) {
                echo 'Coffee added successfully';
            } else {
                echo 'Error adding coffee';
            }
        } else {
            echo 'Error: Missing data';
        }
        break;

    case 'PUT':
        // Update coffee menu entry
        echo 'PUT request received';
        $json = file_get_contents("php://input");
        $data = json_decode($json, true);
        echo 'Antes del isset';
        if (isset($data['id']) && isset($data['name']) && isset($data['price'])) {
            echo 'dentro del isset';
            $id = $data['id'];
            $name = $data['name'];
            $price = $data['price'];

            $query = "UPDATE coffee_menu SET name = ?, price = ? WHERE id = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("sdi", $name, $price, $id);
            if ($stmt->execute()) {
                echo 'Coffee updated successfully';
            } else {
                echo 'Error updating coffee';
            }
        } else {
            echo 'Error: Missing data';
        }
        break;

    case 'DELETE':
        // Delete coffee menu entry
        if (isset($_GET['id'])) {
            $id = $_GET['id'];
            $query = "DELETE FROM coffee_menu WHERE id = ?";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("i", $id);
            if ($stmt->execute()) {
                echo 'Coffee deleted successfully';
            } else {
                echo 'Error deleting coffee';
            }
        } else {
            echo 'Error: Missing ID';
        }
        break;

    default:
        echo 'Invalid Request Method';
}

closeConnection($conn);
?>
