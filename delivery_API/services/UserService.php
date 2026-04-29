<?php
require_once __DIR__ . "/../config/Database.php";
require_once __DIR__ . "/../classes/User.php";

class UserService
{

    public function getAll()
    {
        $db = Database::connect();
        return $db->query("SELECT * FROM users")->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getById($id)
    {
        $db = Database::connect();
        $stmt = $db->prepare("SELECT * FROM users WHERE id=?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($user)
    {
        $db = Database::connect();
        $hashedPassword = password_hash($user->getPassword(), PASSWORD_DEFAULT);
        $stmt = $db->prepare("INSERT INTO users(nom,email,password,role,statut) VALUES(?,?,?,?,?)");
        return $stmt->execute([
            $user->getNom(),
            $user->getEmail(),
            $hashedPassword,
            $user->getRole(),
            $user->getStatut()
        ]);
    }

    public function update($user)
    {
        $db = Database::connect();
        $stmt = $db->prepare("UPDATE users SET nom=?, email=?, role=? WHERE id=?");
        return $stmt->execute([
            $user->getNom(),
            $user->getEmail(),
            $user->getRole(),
            $user->getId()
        ]);
    }

    public function delete($id)
    {
        $db = Database::connect();
        return $db->prepare("DELETE FROM users WHERE id=?")->execute([$id]);
    }

    public function findByEmail($email)
    {
        $db = Database::connect();
        $stmt = $db->prepare("SELECT * FROM users WHERE email=?");
        $stmt->execute([$email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function resetPassword($email, $new_password)
    {
        $db = Database::connect();
        $stmt = $db->prepare("UPDATE users SET password = ? WHERE email = ?");
        return $stmt->execute([
            $new_password,
            $email
        ]);
    }

    public function saveResetToken($email, $token)
    {
        $db = Database::connect();
        $stmt = $db->prepare("UPDATE users SET reset_token = ? WHERE email = ?");
        return $stmt->execute([$token, $email]);
    }

    public function updateStatut($id, $newStatus)
    {
        $db = Database::connect();
        $stmt = $db->prepare("UPDATE users SET statut = ? WHERE id = ?");
        return $stmt->execute([$newStatus, $id]);
    }

    public function updateClient($user)
    {
        $db = Database::connect();

        $stmt = $db->prepare("
        UPDATE users 
        SET email = ?, numero = ?, password = ? 
        WHERE id = ?
    ");

        $passwordHash = password_hash($user->password, PASSWORD_DEFAULT);

        return $stmt->execute([
            $user->email,
            $user->numero,
            $passwordHash,
            $user->id
        ]);
    }

    public function createClient($user)
    {
        $db = Database::connect();

        $stmt = $db->prepare("
        INSERT INTO users (nom, email, password, role, statut)
        VALUES (?, ?, ?, ?, ?)
    ");

        return $stmt->execute([
            $user->nom,
            $user->email,
            $user->password, // déjà hashé avant l'appel
            $user->role,
            $user->statut
        ]);
    }


    public function getByRole($role)
    {
        $db = Database::connect();
        $stmt = $db->prepare("SELECT * FROM users WHERE role = ?");
        $stmt->execute([$role]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
