<?php

class User
{
    private $id;
    private $nom;
    private $email;
    private $password;
    private $role;
    private $statut;

    public function __construct($id, $nom, $email, $password, $role, $statut)
    {
        $this->id = $id;
        $this->nom = $nom;
        $this->email = $email;
        $this->password = $password;
        $this->role = $role;
        $this->statut = $statut;
    }

    public function getStatut()
    {
        return $this->statut;
    }
    public function setStatut($statut)
    {
        $this->id = $statut;
    }

    public function getId()
    {
        return $this->id;
    }
    public function setId($id)
    {
        $this->id = $id;
    }

    public function getNom()
    {
        return $this->nom;
    }
    public function setNom($nom)
    {
        $this->nom = $nom;
    }

    public function getEmail()
    {
        return $this->email;
    }
    public function setEmail($email)
    {
        $this->email = $email;
    }

    public function getPassword()
    {
        return $this->password;
    }
    public function setPassword($password)
    {
        $this->password = $password;
    }

    public function getRole()
    {
        return $this->role;
    }
    public function setRole($role)
    {
        $this->role = $role;
    }
}
