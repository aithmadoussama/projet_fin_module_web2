# 📦 Campus Delivery - Système de Suivi de Livraison Locale

<img width="1408" height="768" alt="icon" src="https://github.com/user-attachments/assets/427047a5-4cb4-4c23-852d-d55d8a2095ec" />

## 📝 Présentation du Projet 
**LocalTrack Delivery** est une solution complète de gestion logistique conçue pour optimiser le suivi des livraisons de proximité. Ce projet a été réalisé dans le cadre du **Projet de fin de module web et mobile 2**. 

Le système permet une interaction fluide entre trois acteurs principaux :
- **Client :** Création de demandes et suivi en temps réel.
- **Livreur :** Gestion des courses et mise à jour des statuts via mobile.
- **Administrateur :** Supervision globale, statistiques et gestion des données via un dashboard Web.

---

## 🚀 Fonctionnalités Clés

### 📱 Application Mobile (Android)
- **Espace Client :** Authentification JWT, saisie d'adresses (Départ/Arrivée), consultation de l'historique.
- **Espace Livreur :** Liste des tâches assignées, boutons de mise à jour de statut (Prise en charge -> En route -> Livré).

### 💻 Dashboard Web (React)
- Visualisation en temps réel des livraisons en cours.
- Consultation des logs d'historique (Traçabilité complète).
- Gestion des utilisateurs et statistiques opérationnelles.

### ⚙️ Backend (API REST)
- API sécurisée développée en PHP.
- Gestion d'authentification par Token JWT.
- Architecture basée sur 4 tables optimisées (Users, Addresses, Livraisons, Logs).

---

## 🛠️ Stack Technique
- **Mobile :** Android SDK (Java/Kotlin), Retrofit/Volley.
- **Web :** React.js, CSS/Tailwind.
- **Backend :** PHP (Architecture orientée services).
- **Base de données :** MySQL (SGBDR).
- **Outils :** XAMPP, Postman, VS Code, Android Studio.

---

## Architecture du projet 

<img width="1406" height="768" alt="Gemini_Generated_Image_2qgh6f2qgh6f2qgh" src="https://github.com/user-attachments/assets/fa302fcd-ef93-419c-9887-6abb15d3d4d8" />

---

## 📊 Conception & Architecture

### 1. Modélisation de la Base de Données
Le système repose sur un schéma relationnel de 4 tables pour garantir performance et simplicité.

````
CREATE TABLE users (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nom VARCHAR(100) DEFAULT NULL,
    email VARCHAR(100) DEFAULT NULL,
    password VARCHAR(255) DEFAULT NULL,
    role ENUM('client','livreur','admin') NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE addresses (
    id INT(11) NOT NULL AUTO_INCREMENT,
    adresse TEXT NOT NULL,
    ville VARCHAR(100) DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE livraisons (
    client_id INT(11) NOT NULL,
    date_livraison DATE NOT NULL,
    livreur_id INT(11) DEFAULT NULL,
    adresse_depart_id INT(11) DEFAULT NULL,
    adresse_arrivee_id INT(11) DEFAULT NULL,
    statut ENUM('cree','prise_en_charge','en_route','livree','annulee') DEFAULT 'cree',

    PRIMARY KEY (client_id, date_livraison),

    KEY livreur_id (livreur_id),
    KEY adresse_depart_id (adresse_depart_id),
    KEY adresse_arrivee_id (adresse_arrivee_id),

    CONSTRAINT livraisons_ibfk_1 FOREIGN KEY (client_id) REFERENCES users(id),
    CONSTRAINT livraisons_ibfk_2 FOREIGN KEY (livreur_id) REFERENCES users(id),
    CONSTRAINT livraisons_ibfk_3 FOREIGN KEY (adresse_depart_id) REFERENCES addresses(id),
    CONSTRAINT livraisons_ibfk_4 FOREIGN KEY (adresse_arrivee_id) REFERENCES addresses(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE delivery_status_logs (
    id INT(11) NOT NULL AUTO_INCREMENT,
    client_id INT(11) DEFAULT NULL,
    date_livraison DATE DEFAULT NULL,
    statut VARCHAR(50) DEFAULT NULL,
    date_changement DATE DEFAULT NULL,

    PRIMARY KEY (id),

    KEY client_id (client_id, date_livraison),

    CONSTRAINT delivery_status_logs_ibfk_1 
    FOREIGN KEY (client_id, date_livraison)
    REFERENCES livraisons (client_id, date_livraison)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

````
### 2. Diagramme de classes 

<img width="729" height="413" alt="diagramme_classe" src="https://github.com/user-attachments/assets/f20f406c-f5fa-4520-82ff-a3c03de61fe6" />

---

## Demonstaration 
### Partie *admin*
https://github.com/user-attachments/assets/1bcb3ef2-2def-4b79-9573-68e1433060ad

### Partie *livreur*
https://github.com/user-attachments/assets/ae1c2e95-75c8-4e3a-8481-6ffb6b70a21b


---
