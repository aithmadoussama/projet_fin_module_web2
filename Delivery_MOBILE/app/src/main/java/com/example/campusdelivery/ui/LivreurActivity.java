package com.example.campusdelivery.ui;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.example.campusdelivery.R;
import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.card.MaterialCardView;

import org.json.JSONArray;
import org.json.JSONObject;

public class LivreurActivity extends AppCompatActivity {

    private int livreurId;

    // Vues (Assurez-vous que ces IDs existent dans activity_livreur.xml)
    private TextView txtWelcomeLivreur;
    private TextView txtStatTotalMissions, txtStatTerminees, txtStatEnCoursLivreur;
    private MaterialCardView cardMissions, cardHistoryLivreur, cardProfileLivreur;

    // URL API (à adapter selon votre backend)
    private final String URL_BASE = "http://192.168.1.10/delivery/public/";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_livreur);

        // --- 1. TOOLBAR ---
        MaterialToolbar toolbar = findViewById(R.id.topAppBar);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayShowTitleEnabled(false);
        }

        TextView customTitle = findViewById(R.id.toolbar_title_text);
        if (customTitle != null) customTitle.setText("Espace Livreur");

        toolbar.setNavigationOnClickListener(v -> finish());

        // --- 2. INITIALISATION ---
        livreurId = getIntent().getIntExtra("livreur_id", -1);

        if (livreurId == -1) {
            Toast.makeText(this, "Erreur d'authentification livreur", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        txtWelcomeLivreur      = findViewById(R.id.txtWelcomeLivreur);
        txtStatTotalMissions   = findViewById(R.id.txtStatTotalMissions);
        txtStatTerminees       = findViewById(R.id.txtStatTerminees);
        txtStatEnCoursLivreur  = findViewById(R.id.txtStatEnCoursLivreur);

        cardMissions           = findViewById(R.id.cardMissions);
        cardHistoryLivreur     = findViewById(R.id.cardHistoryLivreur);
        cardProfileLivreur     = findViewById(R.id.cardProfileLivreur);

        // --- 3. NAVIGATION ---
        // Adaptez les classes (.class) vers vos activités spécifiques livreur
        cardMissions.setOnClickListener(v -> navigateTo(MissionsActivity.class));
        cardHistoryLivreur.setOnClickListener(v -> navigateTo(HistoryLivreurActivity.class));
        cardProfileLivreur.setOnClickListener(v -> navigateTo(ProfileLivreurActivity.class));

        // --- 4. CHARGEMENT DONNÉES ---
        loadLivreurData();
        loadLivreurStats();

        // --- 5. INSETS (Edge-to-Edge) ---
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.delivryman_layout), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
    }

    private void navigateTo(Class<?> activityClass) {
        Intent intent = new Intent(this, activityClass);
        intent.putExtra("livreur_id", livreurId); // On passe l'ID du livreur
        startActivity(intent);
    }

    private void loadLivreurData() {
        String url = "http://192.168.1.10/delivery/public/users?id=" + livreurId;
        RequestQueue queue = Volley.newRequestQueue(this);

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, url, null,
                response -> {
                    try {
                        JSONObject data = response.has("data") ? response.getJSONObject("data") : response;
                        String nom = data.optString("nom", "Livreur");
                        txtWelcomeLivreur.setText("Bonjour, " + nom);
                    } catch (Exception e) {
                        Log.e("API", "Erreur infos livreur: " + e.getMessage());
                    }
                },
                error -> Log.e("API", "Erreur serveur: " + error.toString())
        );
        queue.add(request);
    }

    private void loadLivreurStats() {
        String url = "http://192.168.1.10/delivery/public/livraisons?livreur_id=" + livreurId;
        RequestQueue queue = Volley.newRequestQueue(this);

        JsonObjectRequest request = new JsonObjectRequest(Request.Method.GET, url, null,
                response -> {
                    try {
                        JSONArray data = response.getJSONArray("data");

                        int total = data.length();
                        int terminees = 0;
                        int enCours = 0;

                        for (int i = 0; i < total; i++) {
                            String statut = data.getJSONObject(i).optString("statut");

                            if ("Livrée".equalsIgnoreCase(statut)) {
                                terminees++;
                            } else if ("En route".equalsIgnoreCase(statut)
                                    || "Acceptée".equalsIgnoreCase(statut)) {
                                enCours++;
                            }
                        }

                        txtStatTotalMissions.setText(String.valueOf(total));
                        txtStatTerminees.setText(String.valueOf(terminees));
                        txtStatEnCoursLivreur.setText(String.valueOf(enCours));

                    } catch (Exception e) {
                        Log.e("API_STATS", e.getMessage());
                    }
                },
                error -> Log.e("API_STATS", error.toString())
        );

        queue.add(request);
    }
}