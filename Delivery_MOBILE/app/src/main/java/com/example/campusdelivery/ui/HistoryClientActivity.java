package com.example.campusdelivery.ui;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.TextView;

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

public class HistoryClientActivity extends AppCompatActivity {

    RecyclerView recyclerView;
    LivraisonAdapter adapter;
    ArrayList<Livraison> list;

    int clientId;
    String URL;

    TextView txtCount; // ✅ compteur global

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_history);

        // 🔹 Toolbar
        MaterialToolbar toolbar = findViewById(R.id.topAppBar);
        setSupportActionBar(toolbar);

        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setDisplayShowTitleEnabled(false);
        }

        TextView customTitle = findViewById(R.id.toolbar_title_text);
        if (customTitle != null) {
            customTitle.setText("Historique");
        }

        toolbar.setNavigationOnClickListener(v -> onBackPressed());

        // 🔹 RecyclerView
        recyclerView = findViewById(R.id.recyclerView);
        list = new ArrayList<>();
        adapter = new LivraisonAdapter(list);

        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        recyclerView.setAdapter(adapter);

        // 🔹 compteur
        txtCount = findViewById(R.id.txtCount);
        txtCount.setText("0 commandes");

        // 🔹 récupérer client_id
        clientId = getIntent().getIntExtra("client_id", -1);

        if (clientId == -1) {
            Log.e("ERROR", "client_id manquant !");
            return;
        }

        // 🔹 URL API
        URL = "http://192.168.1.10/delivery/public/livraisons?client_id=" + clientId;

        // 🔹 charger les données
        loadLivraisons();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.client_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();

        if (id == R.id.nav_profile) {
            Intent intent = new Intent(this, ProfileClientActivity.class);
            intent.putExtra("client_id", clientId);
            startActivity(intent);
            return true;

        } else if (id == R.id.nav_history) {
            return true;

        } else if (id == R.id.nav_delivery) {
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

    private void loadLivraisons() {
        RequestQueue queue = Volley.newRequestQueue(this);

        JsonObjectRequest request = new JsonObjectRequest(
                Request.Method.GET,
                URL,
                null,
                response -> {
                    try {
                        boolean success = response.getBoolean("success");

                        if (success) {
                            list.clear();
                            JSONArray data = response.getJSONArray("data");

                            for (int i = 0; i < data.length(); i++) {
                                JSONObject obj = data.getJSONObject(i);

                                Livraison l = new Livraison(
                                        obj.getInt("client_id"),
                                        obj.isNull("livreur_id") ? 0 : obj.getInt("livreur_id"),
                                        obj.getString("adresse_depart"),
                                        obj.getString("adresse_arrivee"),
                                        obj.getString("statut"),
                                        obj.getString("date_livraison")
                                );

                                list.add(l);
                            }

                            adapter.notifyDataSetChanged();

                            // ✅ Mise à jour correcte du compteur
                            txtCount.setText(list.size() + " commandes");
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