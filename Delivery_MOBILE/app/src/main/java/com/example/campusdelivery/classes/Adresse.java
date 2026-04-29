package com.example.campusdelivery.classes;

public class Adresse {

    private int id ;
    private String libelle ;
    private String rue ;
    private String ville ;
    private long latitude ;
    private long longitude ;

    public Adresse(int id) {

    }

    public Adresse(int id, String libelle, String rue, String ville, long latitude, long longitude) {
        this.id = id;
        this.libelle = libelle;
        this.rue = rue;
        this.ville = ville;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Adresse(String libelle, String rue, String ville, long latitude, long longitude) {
        this.libelle = libelle;
        this.rue = rue;
        this.ville = ville;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getLibelle() {
        return libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public String getRue() {
        return rue;
    }

    public void setRue(String rue) {
        this.rue = rue;
    }

    public String getVille() {
        return ville;
    }

    public void setVille(String ville) {
        this.ville = ville;
    }

    public long getLatitude() {
        return latitude;
    }

    public void setLatitude(long latitude) {
        this.latitude = latitude;
    }

    public long getLongitude() {
        return longitude;
    }

    public void setLongitude(long longitude) {
        this.longitude = longitude;
    }

    @Override
    public String toString() {
        return "Adresse{" +
                "id=" + id +
                ", libelle='" + libelle + '\'' +
                ", rue='" + rue + '\'' +
                ", ville='" + ville + '\'' +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                '}';
    }
}
