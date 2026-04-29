package com.example.campusdelivery.ui;

import android.os.Bundle;
import android.util.Log;
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
import com.google.android.material.textfield.TextInputEditText;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class RegisterActivity extends AppCompatActivity {

    TextInputEditText editNom, editEmail, editPassword;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_register);

        editNom      = findViewById(R.id.editNom);
        editEmail    = findViewById(R.id.editEmail);
        editPassword = findViewById(R.id.editPassword);

        findViewById(R.id.btnRegister).setOnClickListener(v -> register());

        // Retour vers LoginActivity
        findViewById(R.id.txtLogin).setOnClickListener(v -> finish());

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.register), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
    }

    private void register() {
        String nom      = editNom.getText().toString().trim();
        String email    = editEmail.getText().toString().trim();
        String password = editPassword.getText().toString().trim();

        // Validation
        if (nom.isEmpty()) {
            editNom.setError("Nom obligatoire");
            editNom.requestFocus();
            return;
        }
        if (email.isEmpty()) {
            editEmail.setError("Email obligatoire");
            editEmail.requestFocus();
            return;
        }
        if (password.isEmpty()) {
            editPassword.setError("Mot de passe obligatoire");
            editPassword.requestFocus();
            return;
        }

        String url = "http://192.168.1.10/delivery/public/users";
        RequestQueue queue = Volley.newRequestQueue(this);

        final String fNom      = nom;
        final String fEmail    = email;
        final String fPassword = password;

        StringRequest request = new StringRequest(Request.Method.POST, url,
                response -> {
                    try {
                        JSONObject json = new JSONObject(response);

                        if (json.has("message")) {
                            Toast.makeText(this,
                                    "✓ Compte créé ! Vérifiez votre email.",
                                    Toast.LENGTH_LONG).show();
                            finish(); // Retour au login
                        } else {
                            String error = json.optString("error", "Erreur lors de la création");
                            Toast.makeText(this, error, Toast.LENGTH_SHORT).show();
                        }

                    } catch (Exception e) {
                        Log.e("REGISTER", "Erreur réponse: " + e.getMessage());
                    }
                },
                error -> {
                    // Vérifier si c'est un 409 (email déjà utilisé)
                    if (error.networkResponse != null && error.networkResponse.statusCode == 409) {
                        Toast.makeText(this, "Cet email est déjà utilisé", Toast.LENGTH_SHORT).show();
                    } else {
                        Log.e("API_ERROR", "register: " + error.toString());
                        Toast.makeText(this, "Erreur réseau", Toast.LENGTH_SHORT).show();
                    }
                }
        ) {
            @Override
            protected Map<String, String> getParams() {
                Map<String, String> params = new HashMap<>();
                params.put("nom",    fNom);
                params.put("email",  fEmail);
                params.put("password", fPassword);
                params.put("role",   "client");
                params.put("statut", "Actif");
                return params;
            }

            @Override
            public String getBodyContentType() {
                return "application/x-www-form-urlencoded";
            }
        };

        queue.add(request);
    }
}
