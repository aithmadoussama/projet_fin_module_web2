package com.example.campusdelivery.classes;

public class Livraison {

    private int client_id;
    private int livreur_id;
    private String adresse_depart;
    private String adresse_arrivee;
    private String statut;
    private String date_livraison;

    public Livraison(int client_id, int livreur_id,
                     String adresse_depart, String adresse_arrivee,
                     String statut, String date_livraison) {

        this.client_id = client_id;
        this.livreur_id = livreur_id;
        this.adresse_depart = adresse_depart;
        this.adresse_arrivee = adresse_arrivee;
        this.statut = statut;
        this.date_livraison = date_livraison;
    }

    public int getClient_id() { return client_id; }
    public int getLivreur_id() { return livreur_id; }
    public String getAdresse_depart() { return adresse_depart; }
    public String getAdresse_arrivee() { return adresse_arrivee; }
    public String getStatut() { return statut; }
    public String getDate_livraison() { return date_livraison; }
}