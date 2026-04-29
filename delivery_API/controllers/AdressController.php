<?php


session_start();

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

require_once __DIR__ . "../../services/AdressService.php";

$service = new AddressService();
$method = $_SERVER['REQUEST_METHOD'];

header("Content-Type: application/json");

switch ($method) {

    case 'GET':
        echo json_encode($service->getAll());
        http_response_code(200);
        break;

    case 'POST':

        $data = $_POST;

        if (!isset($data['adresse']) || !isset($data['ville'])) {
            echo json_encode(["error" => "Données invalides"]);
            http_response_code(400);
            break;
        }

        $service->create($data['adresse'], $data['ville']);

        echo json_encode(["message" => "Adresse ajoutée"]);
        http_response_code(201);
        break;

    case 'PUT':

        parse_str(file_get_contents("php://input"), $data);

        if (!isset($data['id'])) {
            echo json_encode(["error" => "ID requis"]);
            http_response_code(400);
            break;
        }

        if (!isset($data['adresse']) || !isset($data['ville'])) {
            echo json_encode(["error" => "Champs manquants"]);
            http_response_code(400);
            break;
        }

        $service->update(
            $data['id'],
            $data['adresse'],
            $data['ville']
        );

        echo json_encode(["message" => "Adresse mise à jour"]);
        http_response_code(200);
        break;

    case 'DELETE':

        parse_str(file_get_contents("php://input"), $data);

        $id = $data['id'] ?? $_GET['id'] ?? null;

        if (!$id) {
            echo json_encode(["error" => "ID requis"]);
            http_response_code(400);
            break;
        }

        $service->delete($id);

        echo json_encode(["message" => "Adresse supprimée"]);
        http_response_code(200);
        break;

    default:
        echo json_encode(["error" => "Méthode non autorisée"]);
        http_response_code(405);
        break;
}
