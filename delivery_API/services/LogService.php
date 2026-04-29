<?php
require_once __DIR__ . "/../config/Database.php";

class LogService
{

    public function getAll()
    {
        return Database::connect()
            ->query("SELECT * FROM delivery_status_logs ORDER BY date_changement DESC")
            ->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getByLivraison($client_id, $date)
    {
        $stmt = Database::connect()->prepare(
            "SELECT * FROM delivery_status_logs WHERE client_id=? AND date_livraison=?"
        );
        $stmt->execute([$client_id, $date]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
