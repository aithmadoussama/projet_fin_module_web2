<?php

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];



try {

    if (!empty($_GET['demande'])) {

        $demande = $_GET['demande'];

        switch ($demande) {
            case "users":
                require_once __DIR__ . "/../controllers/UserController.php";
                break;
            case "livraisons":
                require_once __DIR__ . "/../controllers/LivraisonController.php";
                break;
            case "logs":
                require_once __DIR__ . "/../controllers/LogController.php";
                break;
            case "addresses":
                require_once __DIR__ . "/../controllers/AdressController.php";
        }
    } else {
        throw new Exception("Demande vide !");
    }
} catch (Exception $ex) {
    echo json_encode([
        'status' => 'error',
        'message' => $ex->getMessage()
    ]);
}
