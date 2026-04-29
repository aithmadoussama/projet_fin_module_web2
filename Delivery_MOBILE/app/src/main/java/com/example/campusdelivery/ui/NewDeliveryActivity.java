package com.example.campusdelivery.ui;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.example.campusdelivery.R;
import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;

import java.util.HashMap;
import java.util.Map;

public class NewDeliveryActivity extends AppCompatActivity {

    private int clientId;
    private TextInputEditText editDepart, editArrivee, editDate;
    private MaterialButton btnValider;

    private final String POST_URL = "http://192.168.1.10/delivery/public/livraisons";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_delivery);

        // --- 1. CONFIGURATION DE LA TOOLBAR ---
        MaterialToolbar toolbar = findViewById(R.id.topAppBar);
        setSupportActionBar(toolbar);

        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            // On cache le titre Android par défaut pour laisser place au TextView
            getSupportActionBar().setDisplayShowTitleEnabled(false);
        }

        // --- 2. GESTION DU TITRE PERSONNALISÉ ---
        // Utilisation de l'ID correct : toolbar_title_text
        TextView customTitle = findViewById(R.id.toolbar_title_text);
        if (customTitle != null) {
            customTitle.setText("Nouvelle Livraison");
        }

        // Action flèche retour
        toolbar.setNavigationOnClickListener(v -> onBackPressed());

        // --- 3. INITIALISATION DES COMPOSANTS ---
        clientId = getIntent().getIntExtra("client_id", -1);
        editDepart = findViewById(R.id.edit_depart);
        editArrivee = findViewById(R.id.edit_arrivee);
        editDate = findViewById(R.id.edit_date);
        btnValider = findViewById(R.id.btn_valider);

        btnValider.setOnClickListener(v -> {
            String depart = editDepart.getText().toString().trim();
            String arrivee = editArrivee.getText().toString().trim();
            String date = editDate.getText().toString().trim();

            if (depart.isEmpty() || arrivee.isEmpty() || date.isEmpty()) {
                Toast.makeText(this, "Veuillez remplir tous les champs", Toast.LENGTH_SHORT).show();
            } else {
                ajouterLivraison(depart, arrivee, date);
            }
        });

        // Gestion du design EdgeToEdge
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
    }

    private void ajouterLivraison(String depart, String arrivee, String date) {
        RequestQueue queue = Volley.newRequestQueue(this);
        StringRequest stringRequest = new StringRequest(Request.Method.POST, POST_URL,
                response -> {
                    Log.d("API_SUCCESS", response);
                    Toast.makeText(this, "Livraison enregistrée !", Toast.LENGTH_SHORT).show();
                    finish();
                },
                error -> {
                    String errorMsg = "Erreur inconnue";
                    if (error.networkResponse != null && error.networkResponse.data != null) {
                        errorMsg = new String(error.networkResponse.data);
                    }
                    Log.e("API_ERROR_DETAIL", errorMsg);
                    Toast.makeText(this, "Détail : " + errorMsg, Toast.LENGTH_LONG).show();
                }) {
            @Override
            protected Map<String, String> getParams() {
                Map<String, String> params = new HashMap<>();
                params.put("client_id", String.valueOf(clientId));
                params.put("date_livraison", date);
                params.put("adresse_depart", depart);
                params.put("adresse_arrivee", arrivee);
                params.put("statut", "Créé");
                return params;
            }
        };
        queue.add(stringRequest);
    }

    // 🔥 CONSERVATION DES 3 POINTS (MENU) 🔥
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.client_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();

        if (id == android.R.id.home) { // Gestion de la flèche retour système
            onBackPressed();
            return true;
        }

        if (id == R.id.nav_profile) {
            Intent intent = new Intent(this, ProfileClientActivity.class);
            intent.putExtra("client_id", clientId);
            startActivity(intent);
            return true;
        } else if (id == R.id.nav_history) {
            Intent intent = new Intent(this, HistoryClientActivity.class);
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