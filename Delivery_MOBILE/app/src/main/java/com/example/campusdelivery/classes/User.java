package com.example.campusdelivery.classes;

public class User {

    private int id;
    private String nom;
    private String email;
    private String mot_de_passe;
    private String role;
    private String date_creation;

    public User() {
    }

    public User(int id, String nom, String email, String mot_de_passe, String role, String date_creation) {
        this.id = id;
        this.nom = nom;
        this.email = email;
        this.mot_de_passe = mot_de_passe;
        this.role = role;
        this.date_creation = date_creation;
    }

    public User(String nom, String email, String mot_de_passe, String role) {
        this.nom = nom;
        this.email = email;
        this.mot_de_passe = mot_de_passe;
        this.role = role;
    }

    public int getId() {
        return id;
    }

    public String getNom() {
        return nom;
    }

    public String getEmail() {
        return email;
    }

    public String getMot_de_passe() {
        return mot_de_passe;
    }

    public String getRole() {
        return role;
    }

    public String getDate_creation() {
        return date_creation;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setMot_de_passe(String mot_de_passe) {
        this.mot_de_passe = mot_de_passe;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setDate_creation(String date_creation) {
        this.date_creation = date_creation;
    }

    @Override
    public String toString() {
        return "Produit{" +
                "id=" + id +
                ", nom='" + nom + '\'' +
                ", email='" + email + '\'' +
                ", mot_de_passe='" + mot_de_passe + '\'' +
                ", role='" + role + '\'' +
                ", date_creation='" + date_creation + '\'' +
                '}';
    }
}
