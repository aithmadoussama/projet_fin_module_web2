package com.example.campusdelivery.ui;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView; // 👈 Import pour le titre personnalisé
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.example.campusdelivery.R;
import com.google.android.material.appbar.MaterialToolbar;

public class ProfileClientActivity extends AppCompatActivity {

    private TextView txtName, txtEmail, txtPhone, txtRole;
    private int clientId;
    private String URL = "http://192.168.1.10/delivery/public/users?id=";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        // 1. Initialisation de la Toolbar
        MaterialToolbar toolbar = findViewById(R.id.topAppBar);
        setSupportActionBar(toolbar);

        // 2. Configuration du titre personnalisé
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            // ❌ On cache le titre Android standard
            getSupportActionBar().setDisplayShowTitleEnabled(false);
        }

        // 🔹 Mise à jour du TextView personnalisé situé dans l'include
        TextView customTitle = findViewById(R.id.toolbar_title_text);
        if (customTitle != null) {
            customTitle.setText("Mon Profil");
        }

        // Action au clic sur la flèche retour
        toolbar.setNavigationOnClickListener(v -> onBackPressed());

        // 3. Liaison des vues du profil
        txtName = findViewById(R.id.txtName);
        txtEmail = findViewById(R.id.txtEmail);
        txtPhone = findViewById(R.id.txtPhone);
        txtRole = findViewById(R.id.txtRole);

        // 4. Récupération de l'ID passé par l'Intent
        clientId = getIntent().getIntExtra("client_id", -1);

        if (clientId == -1) {
            Toast.makeText(this, "Erreur : ID client introuvable", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        loadProfile();

        findViewById(R.id.btnEdit).setOnClickListener(v -> {
            Intent intent = new Intent(this, EditProfileClientActivity.class);
            intent.putExtra("client_id", clientId);
            startActivity(intent);
        });
    }

    // ... (Le reste de vos méthodes : loadProfile, onCreateOptionsMenu, etc. reste identique)

    private void loadProfile() {
        RequestQueue queue = Volley.newRequestQueue(this);
        JsonObjectRequest request = new JsonObjectRequest(
                Request.Method.GET,
                URL + clientId,
                null,
                response -> {
                    try {
                        Log.d("PROFILE_API", response.toString());
                        txtName.setText(response.getString("nom"));
                        txtEmail.setText(response.getString("email"));
                        txtRole.setText(response.getString("role"));

                        if (!response.isNull("numero")) {
                            txtPhone.setText(response.getString("numero"));
                        } else {
                            txtPhone.setText("Non renseigné");
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                        Toast.makeText(ProfileClientActivity.this, "Erreur de lecture", Toast.LENGTH_SHORT).show();
                    }
                },
                error -> {
                    Log.e("PROFILE_ERROR", error.toString());
                    Toast.makeText(ProfileClientActivity.this, "Erreur serveur", Toast.LENGTH_SHORT).show();
                }
        );
        queue.add(request);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.client_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();
        if (id == R.id.nav_history) {
            Intent intent = new Intent(this, HistoryClientActivity.class);
            intent.putExtra("client_id", clientId);
            startActivity(intent);
            return true;
        }
        if (id == R.id.nav_delivery) {
            Intent intent = new Intent(this, NewDeliveryActivity.class);
            intent.putExtra("client_id", clientId);
            startActivity(intent);
            return true;
        } else if (id == R.id.nav_home) {
            Intent intent = new Intent(this, ClientActivity.class);
            intent.putExtra("client_id", clientId);
            startActivity(intent);
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}