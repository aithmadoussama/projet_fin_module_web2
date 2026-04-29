<?php
require_once __DIR__ . "/../config/Database.php";

class LivraisonService
{

    public function getAll()
    {
        $sql = "
        SELECT 
            l.*,
            c.nom AS client_nom,
            c.email AS client_email,
            lv.nom AS livreur_nom,
            lv.email AS livreur_email,
            ad_dep.adresse AS adresse_depart,
            ad_arr.adresse AS adresse_arrivee

        FROM livraisons l

        LEFT JOIN users c 
            ON l.client_id = c.id

        LEFT JOIN users lv 
            ON l.livreur_id = lv.id

        LEFT JOIN addresses ad_dep 
            ON l.adresse_depart_id = ad_dep.id

        LEFT JOIN addresses ad_arr 
            ON l.adresse_arrivee_id = ad_arr.id
    ";

        $db = $db = Database::connect();
        $stmt = $db->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getByClientId($client_id)
    {
        $sql = "
        SELECT 
            l.*,
            ad_dep.adresse AS adresse_depart,
            ad_arr.adresse AS adresse_arrivee

        FROM livraisons l

        LEFT JOIN addresses ad_dep 
            ON l.adresse_depart_id = ad_dep.id

        LEFT JOIN addresses ad_arr 
            ON l.adresse_arrivee_id = ad_arr.id

        WHERE l.client_id = :client_id
        ORDER BY l.date_livraison DESC
    ";

        $db = Database::connect();
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':client_id', $client_id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getByLivreurId($livreur_id)
    {
        $sql = "
            SELECT 
                l.*,
                ad_dep.adresse AS adresse_depart,
                ad_arr.adresse AS adresse_arrivee

            FROM livraisons l

            LEFT JOIN addresses ad_dep 
                ON l.adresse_depart_id = ad_dep.id

            LEFT JOIN addresses ad_arr 
                ON l.adresse_arrivee_id = ad_arr.id

            WHERE l.livreur_id = :livreur_id
            ORDER BY l.date_livraison DESC
        ";

        $db = Database::connect();
        $stmt = $db->prepare($sql);
        $stmt->bindParam(':livreur_id', $livreur_id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    public function create($livraison)
    {
        $db = Database::connect();
        $stmt = $db->prepare("INSERT INTO livraisons VALUES(?,?,?,?,?,?)");

        $livreurId = $livraison->getLivreurId();
        if ($livreurId === "" || $livreurId === 0) {
            $livreurId = null;
        }

        $stmt->execute([
            $livraison->getClientId(),
            $livraison->getDateLivraison(),
            $livreurId,
            $livraison->getAdresseDepartId(),
            $livraison->getAdresseArriveeId(),
            $livraison->getStatut()
        ]);

        $this->addLog($livraison->getClientId(), $livraison->getDateLivraison(), $livraison->getStatut());
    }

    public function updateStatus($client_id, $date, $statut)
    {
        $db = Database::connect();

        $stmt = $db->prepare("UPDATE livraisons SET statut=? WHERE client_id=? AND date_livraison=?");
        $stmt->execute([$statut, $client_id, $date]);

        $this->addLog($client_id, $date, $statut);
    }

    public function delete($client_id, $date)
    {
        $stmt = Database::connect()->prepare("DELETE FROM livraisons WHERE client_id=? AND date_livraison=?");
        return $stmt->execute([$client_id, $date]);
    }

    private function addLog($client_id, $date, $statut)
    {
        $stmt = Database::connect()->prepare(
            "INSERT INTO delivery_status_logs(client_id,date_livraison,statut,date_changement) VALUES(?,?,?,CURDATE())"
        );
        $stmt->execute([$client_id, $date, $statut]);
    }


    public function createWithAddresses($client_id, $date, $adresse_dep_text, $adresse_arr_text, $ville = "Marrakech")
    {
        $db = Database::connect();

        try {
            $db->beginTransaction();

            $stmt1 = $db->prepare("INSERT INTO addresses (adresse, ville) VALUES (?, ?)");
            $stmt1->execute([$adresse_dep_text, $ville]);
            $dep_id = $db->lastInsertId();

            $stmt2 = $db->prepare("INSERT INTO addresses (adresse, ville) VALUES (?, ?)");
            $stmt2->execute([$adresse_arr_text, $ville]);
            $arr_id = $db->lastInsertId();


            $sql = "INSERT INTO livraisons (client_id, date_livraison, livreur_id, adresse_depart_id, adresse_arrivee_id, statut) 
                    VALUES (?, ?, NULL, ?, ?, 'Créé')";

            $stmt3 = $db->prepare($sql);
            $stmt3->execute([$client_id, $date, $dep_id, $arr_id]);

            $db->commit();
            return true;
        } catch (Exception $e) {
            $db->rollBack();
            throw new Exception("Erreur SQL : " . $e->getMessage());
        }
    }

   
    public function assignLivreur($client_id, $date_livraison, $livreur_id) {

    $db = Database::connect();
       
        $query = "UPDATE livraisons 
                  SET livreur_id = :livreur_id, statut = 'Prise en charge' 
                  WHERE client_id = :client_id AND date_livraison = :date_livraison";

        $stmt = $db->prepare($query); 
        
        $stmt->bindParam(':livreur_id', $livreur_id);
        $stmt->bindParam(':client_id', $client_id);
        $stmt->bindParam(':date_livraison', $date_livraison);

        if (!$stmt->execute()) {
            throw new Exception("Erreur lors de l'assignation du livreur.");
        }

        return true;
    }
}


// $ls = new LivraisonService();
// $ls->getAll();
