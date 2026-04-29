package com.example.campusdelivery.ui;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.example.campusdelivery.R;
import com.google.android.material.appbar.MaterialToolbar;

import org.json.JSONObject;

public class ProfileLivreurActivity extends AppCompatActivity {

    private TextView txtName, txtEmail, txtPhone, txtRole;
    private int livreurId;

    private final String URL = "http://192.168.1.10/delivery/public/users?id=";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        // 🔹 Configuration de la Toolbar
        MaterialToolbar toolbar = findViewById(R.id.topAppBar);
        setSupportActionBar(toolbar);

        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setDisplayShowTitleEnabled(false);
        }

        TextView customTitle = findViewById(R.id.toolbar_title_text);
        if (customTitle != null) {
            customTitle.setText("Profil Livreur");
        }

        // Retour à l'écran précédent
        toolbar.setNavigationOnClickListener(v -> finish());

        // 🔹 Liaison des vues
        txtName = findViewById(R.id.txtName);
        txtEmail = findViewById(R.id.txtEmail);
        txtPhone = findViewById(R.id.txtPhone);
        txtRole = findViewById(R.id.txtRole);

        // 🔹 Récupération de l'ID Livreur
        livreurId = getIntent().getIntExtra("livreur_id", -1);

        if (livreurId == -1) {
            Toast.makeText(this, "Erreur : ID livreur introuvable", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        loadProfile();

        findViewById(R.id.btnEdit).setOnClickListener(v -> {
            Intent intent = new Intent(this, EditProfileClientActivity.class);
            intent.putExtra("livreur_id", livreurId);
            startActivity(intent);
        });
    }

    // 🔹 Chargement du menu spécifique livreur
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Remplacez 'bottom_nav_menu' par le nom exact de votre fichier menu livreur
        getMenuInflater().inflate(R.menu.livreur_menu, menu);
        return true;
    }

    // 🔹 Gestion des clics sur le menu (Utilisation de vos IDs fournis)
    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        int id = item.getItemId();

        if (id == R.id.nav_home_livreur) {
            Intent intent = new Intent(this, LivreurActivity.class);
            intent.putExtra("livreur_id", livreurId);
            startActivity(intent);
            return true;
        }

        if (id == R.id.nav_missions_livreur) {
            Intent intent = new Intent(this, MissionsActivity.class);
            intent.putExtra("livreur_id", livreurId);
            startActivity(intent);
            return true;
        }

        if (id == R.id.nav_history_livreur) {
            Intent intent = new Intent(this, HistoryLivreurActivity.class);
            intent.putExtra("livreur_id", livreurId);
            startActivity(intent);
            return true;
        }

        if (id == R.id.nav_profile_livreur) {
            return true; // Déjà sur le profil
        }

        return super.onOptionsItemSelected(item);
    }

    private void loadProfile() {
        RequestQueue queue = Volley.newRequestQueue(this);

        JsonObjectRequest request = new JsonObjectRequest(
                Request.Method.GET,
                URL + livreurId,
                null,
                response -> {
                    try {
                        Log.d("PROFILE_LIVREUR", response.toString());

                        JSONObject data = response.has("data")
                                ? response.getJSONObject("data")
                                : response;

                        // On affiche "Nom" ou "name" selon votre structure JSON
                        txtName.setText(data.optString("nom", data.optString("name", "Inconnu")));
                        txtEmail.setText(data.optString("email", "Non renseigné"));
                        txtRole.setText(data.optString("role", "Livreur"));

                        if (!data.isNull("numero")) {
                            txtPhone.setText(data.optString("numero"));
                        } else if (!data.isNull("phone")) {
                            txtPhone.setText(data.optString("phone"));
                        } else {
                            txtPhone.setText("Non renseigné");
                        }

                    } catch (Exception e) {
                        e.printStackTrace();
                        Toast.makeText(this, "Erreur lors de la lecture des données", Toast.LENGTH_SHORT).show();
                    }
                },
                error -> {
                    Log.e("PROFILE_ERROR", error.toString());
                    Toast.makeText(this, "Erreur de connexion au serveur", Toast.LENGTH_SHORT).show();
                }
        );

        queue.add(request);
    }
}