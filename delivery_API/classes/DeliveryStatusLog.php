<?php

class DeliveryStatusLog
{
    private $id;
    private $client_id;
    private $date_livraison;
    private $statut;
    private $date_changement;

    public function __construct($id, $client_id, $date_livraison, $statut, $date_changement)
    {
        $this->id = $id;
        $this->client_id = $client_id;
        $this->date_livraison = $date_livraison;
        $this->statut = $statut;
        $this->date_changement = $date_changement;
    }

    public function getId()
    {
        return $this->id;
    }
    public function setId($id)
    {
        $this->id = $id;
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

    public function getStatut()
    {
        return $this->statut;
    }
    public function setStatut($statut)
    {
        $this->statut = $statut;
    }

    public function getDateChangement()
    {
        return $this->date_changement;
    }
    public function setDateChangement($date_changement)
    {
        $this->date_changement = $date_changement;
    }
}
