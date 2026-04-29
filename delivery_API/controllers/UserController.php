<?php

session_start();

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
} else {
    header("Access-Control-Allow-Origin: *");
}

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

require_once __DIR__ . "/../services/UserService.php";
require_once __DIR__ . "/../classes/User.php";

$service = new UserService();
$method = $_SERVER['REQUEST_METHOD'];

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

require_once __DIR__ . "/../services/UserService.php";
require_once __DIR__ . "/../classes/User.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . "/../vendor/autoload.php";

$service = new UserService();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    case 'GET':

        if (isset($_GET['id'])) {
            $user = $service->getById($_GET['id']);

            if ($user) {
                http_response_code(200);
                echo json_encode($user);
            } else {
                http_response_code(404);
                echo json_encode(["error" => "Utilisateur introuvable"]);
            }

            break;
        }

        if (isset($_GET['role']) && in_array($_GET['role'], ['livreur', 'client'])) {
            http_response_code(200);
            echo json_encode($service->getByRole($_GET['role']));
            break;
        }

        http_response_code(200);
        echo json_encode($service->getAll());
        break;

    case 'POST':
        $data = $_POST;

        // login utilisateur (admin, livreur, client) 
        if (isset($data['email'], $data['password'])) {

            $user = $service->findByEmail($data['email']);

            if (!$user) {
                http_response_code(400);
                echo json_encode(["error" => "Identifiants invalides (Email)"]);
                break;
            }


            if (!password_verify($data['password'], $user['password'])) {
                http_response_code(401);
                echo json_encode(["error" => "Mot de passe incorrect"]);
                break;
            }

            if ($user['statut'] !== "Actif") {
                http_response_code(403);
                echo json_encode(["error" => "Votre compte est bloqué. Contactez l'administrateur : aithmadoussama58@gmail.com"]);
                break;
            }


            if (isset($data['request_source']) && $data['request_source'] === "web_admin") {
                if ($user['role'] !== "admin") {
                    http_response_code(403);
                    echo json_encode(["error" => "Accès réservé aux administrateurs"]);
                    break;
                }
            }


            $_SESSION['user'] = [
                "id"    => $user['id'],
                "nom"   => $user['nom'],
                "email" => $user['email'],
                "role"  => $user['role']
            ];

            http_response_code(200);
            echo json_encode([
                "message" => "Connexion réussie",
                "user"    => $_SESSION['user']
            ]);
            break;
        }

        // mot de passe oublie 
        if (isset($data['email']) && count($data) === 1) {

            $user = $service->findByEmail($data['email']);

            if (!$user) {
                http_response_code(400);
                echo json_encode(["error" => "Adresse email introuvable"]);
                break;
            }

            if ($user['role'] !== "admin") {
                http_response_code(403);
                echo json_encode(["error" => "Accès refusé"]);
                break;
            }

            $verificationCode = str_pad(random_int(0, 99999999), 8, '0', STR_PAD_LEFT);

            $_SESSION['reset_code']  = $verificationCode;
            $_SESSION['reset_email'] = $data['email'];

            $mail = new PHPMailer(true);

            try {
                $mail->isSMTP();
                $mail->Host       = 'smtp.gmail.com';
                $mail->SMTPAuth   = true;
                $mail->Username   = 'aithmadoussama458@gmail.com';
                $mail->Password   = 'uvce bnsm ammh ddsz';
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port       = 587;
                $mail->CharSet    = 'UTF-8';

                $mail->setFrom('aithmadoussama458@gmail.com', 'CampusDelivery');
                $mail->addAddress($data['email']);

                $mail->Subject = 'Code de réinitialisation';
                $mail->Body    = "Bonjour,\n\nVotre code est : $verificationCode\n\nValable 10 minutes.";

                $mail->send();

                http_response_code(200);
                echo json_encode([
                    "success" => true,
                    "message" => "Code envoyé"
                ]);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(["error" => "Erreur d'envoi : " . $mail->ErrorInfo]);
            }

            break;
        }

        // reset mot de passe 
        if (isset($data['code'], $data['password'])) {

            if (
                !isset($_SESSION['reset_code'], $_SESSION['reset_email']) ||
                $data['code'] !== $_SESSION['reset_code']
            ) {
                http_response_code(400);
                echo json_encode(["error" => "Code invalide ou expiré"]);
                break;
            }

            $newPassword = password_hash($data['password'], PASSWORD_DEFAULT);
            $service->resetPassword($_SESSION['reset_email'], $newPassword);

            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "Mot de passe modifié avec succès"
            ]);

            break;
        }

        // creation
        if (isset($data['nom'], $data['email'], $data['role'], $data['statut'], $data['password'])) {

            if ($service->findByEmail($data['email'])) {
                http_response_code(409);
                echo json_encode(["error" => "Email déjà utilisé"]);
                break;
            }

            $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);

            $user = new User(
                null,
                $data['nom'],
                $data['email'],
                $hashedPassword,
                $data['role'],
                $data['statut']
            );

            $result = $service->createClient($user);

            if ($result) {
                http_response_code(201);
                echo json_encode(["success" => true, "message" => "Compte créé avec succès"]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Erreur lors de la création du compte"]);
            }

            break;
        }

        // Cas création admin (password généré + email envoyé)
        if (!isset($data['nom'], $data['email'], $data['role'], $data['statut'])) {
            http_response_code(400);
            echo json_encode(["error" => "Données manquantes"]);
            break;
        }

        if ($service->findByEmail($data['email'])) {
            http_response_code(409);
            echo json_encode(["error" => "Email déjà utilisé"]);
            break;
        }

        $generatedPassword = bin2hex(random_bytes(4));
        $hashedPassword = password_hash($generatedPassword, PASSWORD_DEFAULT);

        $user = new User(
            null,
            $data['nom'],
            $data['email'],
            $hashedPassword,
            $data['role'],
            $data['statut']
        );

        $service->create($user);

        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'aithmadoussama458@gmail.com';
            $mail->Password = 'uvce bnsm ammh ddsz';
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;

            $mail->setFrom('aithmadoussama458@gmail.com', 'CampusDelivery');
            $mail->addAddress($data['email'], $data['nom']);

            $mail->isHTML(true);
            $mail->Subject = 'Création de votre compte';

            $mail->Body = "
                <h2>Bienvenue {$data['nom']}</h2>
                <p>Votre compte a été créé avec succès.</p>
                <p><strong>Email :</strong> {$data['email']}</p>
                <p><strong>Mot de passe :</strong> {$generatedPassword}</p>
                <p><strong>Rôle :</strong> {$data['role']}</p>
                <p>Veuillez changer votre mot de passe après votre première connexion.</p>
            ";

            $mail->send();

            http_response_code(201);
            echo json_encode(["message" => "Utilisateur créé + email envoyé"]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => $mail->ErrorInfo]);
        }

        break;

    case 'PUT':
        parse_str(file_get_contents("php://input"), $data);

        try {

            if (!isset($data['id'])) {
                http_response_code(400);
                echo json_encode(["error" => "ID requis"]);
                break;
            }

            if (isset($data['nom'], $data['email'], $data['role'], $data['statut'])) {

                $password = !empty($data['password'])
                    ? password_hash($data['password'], PASSWORD_DEFAULT)
                    : null;

                $user = new User(
                    $data['id'],
                    $data['nom'],
                    $data['email'],
                    $password,
                    $data['role'],
                    $data['statut']
                );

                $result = $service->update($user);

                if ($result) {
                    http_response_code(200);
                    echo json_encode(["success" => true, "message" => "Utilisateur mis à jour"]);
                } else {
                    http_response_code(500);
                    echo json_encode(["error" => "Échec de mise à jour"]);
                }
                break;
            }

            if (isset($data['statut'])) {

                $result = $service->updateStatut($data['id'], $data['statut']);

                if ($result) {
                    http_response_code(200);
                    echo json_encode(["success" => true, "message" => "Statut mis à jour"]);
                } else {
                    http_response_code(500);
                    echo json_encode(["error" => "Échec de mise à jour du statut"]);
                }
                break;
            }

            if (isset($data['email'], $data['numero'], $data['password'])) {

                if (empty($data['email']) || empty($data['numero']) || empty($data['password'])) {
                    http_response_code(400);
                    echo json_encode(["error" => "email, numero et password sont obligatoires"]);
                    break;
                }

                $user = new stdClass();
                $user->id       = $data['id'];
                $user->email    = $data['email'];
                $user->numero   = $data['numero'];
                $user->password = $data['password'];

                $result = $service->updateClient($user);

                if ($result) {
                    http_response_code(200);
                    echo json_encode(["success" => true, "message" => "Profil mis à jour"]);
                } else {
                    http_response_code(500);
                    echo json_encode(["success" => false, "error" => "Échec de la mise à jour"]);
                }
                break;
            }

            http_response_code(400);
            echo json_encode(["error" => "Paramètres invalides"]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "error"   => "Erreur serveur",
                "details" => $e->getMessage()
            ]);
        }
        break;

    case 'DELETE':

        // supprimer utilisateur 
        parse_str($_SERVER['QUERY_STRING'] ?? '', $queryData);
        $id = $_GET['id'] ?? $queryData['id'] ?? null;

        if (!$id) {
            http_response_code(400);
            echo json_encode(["error" => "ID requis"]);
            break;
        }

        try {
            $service->delete($id);
            http_response_code(200);
            echo json_encode(["message" => "Utilisateur supprimé"]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Méthode non autorisée"]);
        break;
}
