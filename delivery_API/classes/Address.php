<?php

class Address
{
    private $id;
    private $adresse;
    private $ville;

    public function __construct($id, $adresse, $ville)
    {
        $this->id = $id;
        $this->adresse = $adresse;
        $this->ville = $ville;
    }

    public function getId()
    {
        return $this->id;
    }
    public function setId($id)
    {
        $this->id = $id;
    }

    public function getAdresse()
    {
        return $this->adresse;
    }
    public function setAdresse($adresse)
    {
        $this->adresse = $adresse;
    }

    public function getVille()
    {
        return $this->ville;
    }
    public function setVille($ville)
    {
        $this->ville = $ville;
    }
}
