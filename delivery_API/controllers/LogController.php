<?php


header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}


require_once __DIR__ . "/../services/LogService.php";

$service = new LogService();

if ($_SERVER['REQUEST_METHOD'] == 'GET') {

    if (isset($_GET['client_id']) && isset($_GET['date'])) {
        echo json_encode(
            $service->getByLivraison($_GET['client_id'], $_GET['date'])
        );
    } else {
        echo json_encode(
            $service->getAll()
        );
    }
}
