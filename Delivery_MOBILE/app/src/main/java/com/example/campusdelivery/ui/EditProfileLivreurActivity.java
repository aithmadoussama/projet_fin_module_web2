package com.example.campusdelivery.ui;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
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
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.example.campusdelivery.R;
import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.textfield.TextInputEditText;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class EditProfileLivreurActivity extends AppCompatActivity {

    int livreurId;

    TextInputEditText editEmail, editPhone, editPassword;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_edit_profil);

        MaterialToolbar toolbar = findViewById(R.id.topAppBar);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null)
            getSupportActionBar().setDisplayShowTitleEnabled(false);

        TextView customTitle = toolbar.findViewById(R.id.toolbar_title_text);
        if (customTitle != null) customTitle.setText("Modifier le profil");

        toolbar.setNavigationOnClickListener(v -> finish());

        livreurId = getIntent().getIntExtra("livreur_id", -1);

        editEmail    = findViewById(R.id.editEmail);
        editPhone    = findViewById(R.id.editPhone);
        editPassword = findViewById(R.id.editNewPassword);

        loadCurrentData();

        View btnSave = findViewById(R.id.btnSave);
        if (btnSave != null) {
            btnSave.setOnClickListener(v -> saveChanges());
        } else {
            Log.e("VIEW_ERROR", "btnSave introuvable");
        }

        View root = findViewById(R.id.main);
        if (root != null) {
            ViewCompat.setOnApplyWindowInsetsListener(root, (v, insets) -> {
                Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
                v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
                return insets;
            });
        }
    }

    private String getBaseUrl() {
        return "http://192.168.1.10/delivery/public/";
    }

    private void loadCurrentData() {
        String url = getBaseUrl() + "users?id=" + livreurId;
        RequestQueue queue = Volley.newRequestQueue(this);

        JsonObjectRequest request = new JsonObjectRequest(
                Request.Method.GET, url, null,
                response -> {
                    try {
                        Log.d("API_RESPONSE", response.toString());

                        JSONObject data = response.has("data") && response.get("data") instanceof JSONObject
                                ? response.getJSONObject("data")
                                : response;

                        editEmail.setText(data.optString("email", ""));
                        editPhone.setText(data.optString("numero", ""));

                    } catch (Exception e) {
                        Log.e("EDIT_PROFIL", "Parsing: " + e.getMessage());
                    }
                },
                error -> Log.e("API_ERROR", "load: " + error.toString())
        );

        queue.add(request);
    }

    private void saveChanges() {
        String email = editEmail.getText() != null ? editEmail.getText().toString().trim() : "";
        String numero = editPhone.getText() != null ? editPhone.getText().toString().trim() : "";
        String password = editPassword.getText() != null ? editPassword.getText().toString().trim() : "";

        if (email.isEmpty()) {
            editEmail.setError("Email obligatoire");
            return;
        }

        if (numero.isEmpty()) {
            editPhone.setError("Numéro obligatoire");
            return;
        }

        if (password.isEmpty()) {
            editPassword.setError("Mot de passe obligatoire");
            return;
        }

        String url = getBaseUrl() + "users";
        RequestQueue queue = Volley.newRequestQueue(this);

        final String fEmail = email;
        final String fNumero = numero;
        final String fPassword = password;

        StringRequest request = new StringRequest(Request.Method.PUT, url,
                response -> {
                    try {
                        Log.d("API_RESPONSE", response);

                        JSONObject json = new JSONObject(response);
                        boolean success = json.optBoolean("success", false);

                        if (success) {
                            Toast.makeText(this, "✓ Profil mis à jour", Toast.LENGTH_SHORT).show();
                            finish();
                        } else {
                            String msg = json.optString("error", "Erreur");
                            Toast.makeText(this, msg, Toast.LENGTH_SHORT).show();
                        }

                    } catch (Exception e) {
                        Log.e("JSON_ERROR", e.toString());
                    }
                },
                error -> {
                    Log.e("API_ERROR", error.toString());
                    Toast.makeText(this, "Erreur réseau", Toast.LENGTH_SHORT).show();
                }
        ) {
            @Override
            protected Map<String, String> getParams() {
                Map<String, String> params = new HashMap<>();
                params.put("id", String.valueOf(livreurId));
                params.put("email", fEmail);
                params.put("numero", fNumero);
                params.put("password", fPassword);
                return params;
            }

            @Override
            public String getBodyContentType() {
                return "application/x-www-form-urlencoded; charset=UTF-8";
            }
        };

        queue.add(request);
    }
}