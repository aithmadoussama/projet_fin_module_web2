<?php
require_once __DIR__ . "/../services/LivraisonService.php";
require_once __DIR__ . "/../classes/Livraison.php";

session_start();

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

$allowed_origins = [
    "http://localhost:3000",
    "http://10.0.2.2:3000"
];

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
}

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

$service = new LivraisonService();
$method = $_SERVER['REQUEST_METHOD'];


switch ($method) {

    case 'GET':

        try {

            if (isset($_GET['client_id'])) {

                $livraisons = $service->getByClientId($_GET['client_id']);
            } elseif (isset($_GET['livreur_id'])) {

                $livraisons = $service->getByLivreurId($_GET['livreur_id']);
            } else {
                $livraisons = $service->getAll();
            }

            echo json_encode([
                "success" => true,
                "data" => $livraisons
            ]);
            http_response_code(200);
        } catch (Exception $e) {

            echo json_encode([
                "success" => false,
                "error" => $e->getMessage()
            ]);
            http_response_code(500);
        }

        break;


    case 'POST':

        $input = json_decode(file_get_contents("php://input"), true);
        $data = $input ?? $_POST;

        if (
            !isset(
                $data['client_id'],
                $data['date_livraison'],
                $data['adresse_depart'],
                $data['adresse_arrivee']
            )
        ) {
            echo json_encode([
                "success" => false,
                "error" => "Données manquantes"
            ]);
            http_response_code(400);
            break;
        }

        try {

            $service->createWithAddresses(
                $data['client_id'],
                $data['date_livraison'],
                $data['adresse_depart'],
                $data['adresse_arrivee'],
                $data['ville'] ?? "Marrakech"
            );

            echo json_encode([
                "success" => true,
                "message" => "Livraison créée"
            ]);
            http_response_code(201);
        } catch (Exception $e) {

            echo json_encode([
                "success" => false,
                "error" => $e->getMessage()
            ]);
            http_response_code(500);
        }

        break;


    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);

        if (!isset($data['client_id'], $data['date_livraison'])) {
            echo json_encode([
                "success" => false,
                "error" => "Paramètres requis manquants (client_id, date_livraison)"
            ]);
            http_response_code(400);
            break;
        }

        try {
            $message = "";

            if (isset($data['livreur_id'])) {

                $service->assignLivreur(
                    $data['client_id'],
                    $data['date_livraison'],
                    $data['livreur_id']
                );
                $message = "Livreur assigné avec succès";
            }
            elseif (isset($data['statut'])) {

                $service->updateStatus(
                    $data['client_id'],
                    $data['date_livraison'],
                    $data['statut']
                );
                $message = "Statut mis à jour avec succès";
            } else {
                throw new Exception("Aucune donnée valide à modifier (livreur_id ou statut manquant)");
            }

            echo json_encode([
                "success" => true,
                "message" => $message
            ]);
            http_response_code(200);
        } catch (Exception $e) {
            echo json_encode([
                "success" => false,
                "error" => $e->getMessage()
            ]);
            http_response_code(500);
        }
        break;

    case 'DELETE':

        $data = json_decode(file_get_contents("php://input"), true);

        $client_id = $data['client_id'] ?? $_GET['client_id'] ?? null;
        $date = $data['date_livraison'] ?? $_GET['date_livraison'] ?? null;

        if (!$client_id || !$date) {
            echo json_encode([
                "success" => false,
                "error" => "Clé primaire requise"
            ]);
            http_response_code(400);
            break;
        }

        try {

            $service->delete($client_id, $date);

            echo json_encode([
                "success" => true,
                "message" => "Livraison supprimée"
            ]);
            http_response_code(200);
        } catch (Exception $e) {

            echo json_encode([
                "success" => false,
                "error" => $e->getMessage()
            ]);
            http_response_code(500);
        }

        break;



    default:

        echo json_encode([
            "success" => false,
            "error" => "Méthode non autorisée"
        ]);
        http_response_code(405);
        break;
}
