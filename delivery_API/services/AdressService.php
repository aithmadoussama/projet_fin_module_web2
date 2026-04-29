<?php
require_once __DIR__ . "/../config/Database.php";

class AddressService {

    public function getAll() {
        return Database::connect()
            ->query("SELECT * FROM addresses")
            ->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create($adresse, $ville) {
        $stmt = Database::connect()->prepare(
            "INSERT INTO addresses(adresse, ville) VALUES(?,?)"
        );
        return $stmt->execute([$adresse, $ville]);
    }

    public function update($id, $adresse, $ville) {
        $stmt = Database::connect()->prepare(
            "UPDATE addresses SET adresse=?, ville=? WHERE id=?"
        );
        return $stmt->execute([$adresse, $ville, $id]);
    }

    public function delete($id) {
        return Database::connect()
            ->prepare("DELETE FROM addresses WHERE id=?")
            ->execute([$id]);
    }
}