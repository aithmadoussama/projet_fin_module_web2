<?php

class Livraison
{
    private $client_id;
    private $date_livraison;
    private $livreur_id;
    private $adresse_depart_id;
    private $adresse_arrivee_id;
    private $statut;

    public function __construct($client_id, $date_livraison, $livreur_id, $adresse_depart_id, $adresse_arrivee_id, $statut = 'cree')
    {
        $this->client_id = $client_id;
        $this->date_livraison = $date_livraison;
        $this->livreur_id = $livreur_id;
        $this->adresse_depart_id = $adresse_depart_id;
        $this->adresse_arrivee_id = $adresse_arrivee_id;
        $this->statut = $statut;
    }

    public function getClientId()
    {
        return $this->client_id;
    }
    public function setClientId($client_id)
    {
        $this->client_id = $client_id;
    }

    public function getDateLivraison()
    {
        return $this->date_livraison;
    }
    public function setDateLivraison($date_livraison)
    {
        $this->date_livraison = $date_livraison;
    }

    public function getLivreurId()
    {
        return $this->livreur_id;
    }
    public function setLivreurId($livreur_id)
    {
        $this->livreur_id = $livreur_id;
    }

    public function getAdresseDepartId()
    {
        return $this->adresse_depart_id;
    }
    public function setAdresseDepartId($adresse_depart_id)
    {
        $this->adresse_depart_id = $adresse_depart_id;
    }

    public function getAdresseArriveeId()
    {
        return $this->adresse_arrivee_id;
    }
    public function setAdresseArriveeId($adresse_arrivee_id)
    {
        $this->adresse_arrivee_id = $adresse_arrivee_id;
    }

    public function getStatut()
    {
        return $this->statut;
    }
    public function setStatut($statut)
    {
        $this->statut = $statut;
    }
}
