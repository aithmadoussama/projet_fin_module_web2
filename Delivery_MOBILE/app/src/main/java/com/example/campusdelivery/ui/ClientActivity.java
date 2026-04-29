package com.example.campusdelivery.ui;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;

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

public class ClientActivity extends AppCompatActivity {

    int clientId;

    // Vues
    TextView txtWelcomeName;
    TextView txtLastId, txtLastAdresse, txtLastStatut;
    TextView txtStatTotal, txtStatLivre, txtStatEnCours, txtStatAnnule;

    MaterialCardView cardDelivery, cardHistory, cardProfile, cardSupport;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_client);

        // Toolbar
        MaterialToolbar toolbar = findViewById(R.id.topAppBar);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayShowTitleEnabled(false);
        }

        TextView customTitle = toolbar.findViewById(R.id.toolbar_title_text);
        if (customTitle != null) customTitle.setText("Espace Client");

        toolbar.setNavigationOnClickListener(v -> finish());

        clientId = getIntent().getIntExtra("client_id", -1);

        // Liaison des vues
        txtWelcomeName  = findViewById(R.id.txtWelcomeName);
        txtLastId       = findViewById(R.id.txtLastId);
        txtLastAdresse  = findViewById(R.id.txtLastAdresse);
        txtLastStatut   = findViewById(R.id.txtLastStatut);
        txtStatTotal    = findViewById(R.id.txtStatTotal);
        txtStatLivre    = findViewById(R.id.txtStatLivre);
        txtStatEnCours  = findViewById(R.id.txtStatEnCours);
        txtStatAnnule   = findViewById(R.id.txtStatAnnule);

        cardDelivery = findViewById(R.id.cardDelivery);
        cardHistory  = findViewById(R.id.cardHistory);
        cardProfile  = findViewById(R.id.cardProfile);
        cardSupport  = findViewById(R.id.cardSupport);



        // Navigation
        cardDelivery.setOnClickListener(v -> navigateTo(NewDeliveryActivity.class));
        cardHistory.setOnClickListener(v  -> navigateTo(HistoryClientActivity.class));
        cardProfile.setOnClickListener(v  -> navigateTo(ProfileClientActivity.class));

        // Chargement des données
        loadClientData();
        loadLivraisonsStats();

        // Insets
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.client_layout), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
    }

    private void navigateTo(Class<?> activityClass) {
        Intent intent = new Intent(this, activityClass);
        intent.putExtra("client_id", clientId);
        startActivity(intent);
    }

    // ===========================
    // 🔹 Charger infos client
    // ===========================
    private void loadClientData() {
        String url = "http://192.168.1.10/delivery/public/users?id=" + clientId;
        RequestQueue queue = Volley.newRequestQueue(this);

        JsonObjectRequest request = new JsonObjectRequest(
                Request.Method.GET, url, null,
                response -> {
                    try {
                        JSONObject data = response.has("data")
                                ? response.getJSONObject("data")
                                : response;

                        String nom = data.optString("name",
                                data.optString("nom", "Client"));

                        txtWelcomeName.setText(nom);

                    } catch (Exception e) {
                        Log.e("CLIENT_DATA", e.toString());
                    }
                },
                error -> Log.e("API_ERROR", error.toString())
        );

        queue.add(request);
    }

    // ===========================
    // 🔹 Charger stats + dernière livraison
    // ===========================
    private void loadLivraisonsStats() {
        String url = "http://192.168.1.10/delivery/public/livraisons?client_id=" + clientId;
        RequestQueue queue = Volley.newRequestQueue(this);

        JsonObjectRequest request = new JsonObjectRequest(
                Request.Method.GET, url, null,
                response -> {
                    try {
                        if (!response.has("success") || !response.getBoolean("success")) {
                            Log.e("API", "Réponse invalide");
                            return;
                        }

                        JSONArray data = response.getJSONArray("data");

                        int total = data.length();
                        int livre = 0, enCours = 0, annule = 0;

                        for (int i = 0; i < total; i++) {
                            JSONObject obj = data.getJSONObject(i);
                            String statut = obj.optString("statut");

                            switch (statut) {
                                case "Livrée":    livre++; break;
                                case "En route": enCours++; break;
                                case "Annulée":   annule++; break;
                            }
                        }

                        // Stats
                        txtStatTotal.setText(String.valueOf(total));
                        txtStatLivre.setText(String.valueOf(livre));
                        txtStatEnCours.setText(String.valueOf(enCours));
                        txtStatAnnule.setText(String.valueOf(annule));

                        // Dernière livraison
                        if (total > 0) {
                            JSONObject last = data.getJSONObject(0);

                            Log.d("JSON_LAST", last.toString()); // DEBUG

                            // 🔥 correction ici
                            int id = last.optInt("id", last.optInt("client_id", 0));

                            txtLastId.setText(String.format("%05d", id));

                            txtLastAdresse.setText(
                                    last.optString("adresse_depart") + " → " +
                                            last.optString("adresse_arrivee")
                            );

                            txtLastStatut.setText(last.optString("statut"));
                        }

                    } catch (Exception e) {
                        Log.e("JSON_ERROR", e.toString());
                    }
                },
                error -> Log.e("API_ERROR", error.toString())
        );

        queue.add(request);
    }
}