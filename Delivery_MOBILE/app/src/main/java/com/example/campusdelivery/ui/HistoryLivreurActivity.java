package com.example.campusdelivery.ui;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.example.campusdelivery.R;
import com.example.campusdelivery.adapter.LivraisonAdapter;
import com.example.campusdelivery.classes.Livraison;
import com.google.android.material.appbar.MaterialToolbar;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;

public class HistoryLivreurActivity extends AppCompatActivity {

    RecyclerView recyclerView;
    LivraisonAdapter adapter;
    ArrayList<Livraison> list;

    int livreurId;
    String URL;

    TextView txtCount;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_history_livreur);

        // 🔹 Toolbar
        MaterialToolbar toolbar = findViewById(R.id.topAppBar);
        setSupportActionBar(toolbar);

        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setDisplayShowTitleEnabled(false);
        }

        TextView customTitle = findViewById(R.id.toolbar_title_text);
        if (customTitle != null) {
            customTitle.setText("Historique Livreur");
        }

        toolbar.setNavigationOnClickListener(v -> onBackPressed());

        // 🔹 RecyclerView
        recyclerView = findViewById(R.id.recyclerView);
        list = new ArrayList<>();
        adapter = new LivraisonAdapter(list);

        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        recyclerView.setAdapter(adapter);

        // 🔹 Compteur
        txtCount = findViewById(R.id.txtCount);
        txtCount.setText("0 missions");

        // 🔹 ID Livreur
        livreurId = getIntent().getIntExtra("livreur_id", -1);

        if (livreurId == -1) {
            Log.e("ERROR", "livreur_id manquant !");
            return;
        }

        URL = "http://192.168.1.10/delivery/public/livraisons?livreur_id=" + livreurId;

        loadMissions();
    }

    // 🔹 Chargement du menu livreur (bottom_nav_menu.xml)
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.livreur_menu, menu);
        return true;
    }

    // 🔹 Navigation avec vos nouveaux IDs
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
            return true; // Déjà ici
        }

        if (id == R.id.nav_profile_livreur) {
            Intent intent = new Intent(this, ProfileLivreurActivity.class);
            intent.putExtra("livreur_id", livreurId);
            startActivity(intent);
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    private void loadMissions() {
        RequestQueue queue = Volley.newRequestQueue(this);

        JsonObjectRequest request = new JsonObjectRequest(
                Request.Method.GET,
                URL,
                null,
                response -> {
                    try {
                        if (response.getBoolean("success")) {
                            list.clear();
                            JSONArray data = response.getJSONArray("data");

                            for (int i = 0; i < data.length(); i++) {
                                JSONObject obj = data.getJSONObject(i);
                                String statut = obj.getString("statut");

                                // 🔥 FILTRE : Uniquement les livraisons terminées
                                if (statut.equalsIgnoreCase("Livrée")) {
                                    Livraison l = new Livraison(
                                            obj.getInt("client_id"),
                                            obj.isNull("livreur_id") ? 0 : obj.getInt("livreur_id"),
                                            obj.getString("adresse_depart"),
                                            obj.getString("adresse_arrivee"),
                                            statut,
                                            obj.getString("date_livraison")
                                    );
                                    list.add(l);
                                }
                            }
                            adapter.notifyDataSetChanged();
                            txtCount.setText(list.size() + " livraisons terminées");
                        }
                    } catch (Exception e) {
                        Log.e("JSON_ERROR", e.getMessage());
                    }
                },
                error -> Log.e("API_ERROR", error.toString())
        );

        queue.add(request);
    }
}