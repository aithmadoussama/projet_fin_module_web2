package com.example.campusdelivery.ui;

import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.example.campusdelivery.R;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class LoginActivity extends AppCompatActivity {

    private static final String LOGIN_URL = "http://192.168.1.10/delivery/public/users";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_login);

        TextInputEditText emailInput    = findViewById(R.id.user_name);
        TextInputEditText passwordInput = findViewById(R.id.user_password);
        MaterialButton btnLogin         = findViewById(R.id.btn_login);
        TextView txtRegister            = findViewById(R.id.txtRegister);

        btnLogin.setOnClickListener(v -> {
            String email    = emailInput.getText().toString().trim();
            String password = passwordInput.getText().toString().trim();

            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Champs vides", Toast.LENGTH_SHORT).show();
                return;
            }

            loginUser(email, password);
        });

        // 🔹 Aller vers l'écran d'inscription
        txtRegister.setOnClickListener(v -> {
            Intent intent = new Intent(LoginActivity.this, RegisterActivity.class);
            startActivity(intent);
        });
    }

    private void loginUser(String email, String password) {

        RequestQueue queue = Volley.newRequestQueue(this);

        StringRequest request = new StringRequest(Request.Method.POST, LOGIN_URL,
                response -> {
                    try {
                        JSONObject json = new JSONObject(response);
                        JSONObject user = json.getJSONObject("user");

                        int id       = user.getInt("id");
                        String role  = user.getString("role");
                        String nom   = user.getString("nom");

                        if (role.equals("client")) {
                            Toast.makeText(this, "Bienvenue " + nom, Toast.LENGTH_SHORT).show();
                            Intent intent = new Intent(LoginActivity.this, ClientActivity.class);
                            intent.putExtra("client_id", id);
                            startActivity(intent);
                            finish();
                        } else if (role.equals("livreur")) {
                            Toast.makeText(this, "Bienvenue Livreur " + nom, Toast.LENGTH_SHORT).show();
                            Intent intent = new Intent(LoginActivity.this, LivreurActivity.class);
                            intent.putExtra("livreur_id", id);
                            startActivity(intent);
                            finish();
                        } else {
                            Toast.makeText(this, "Accès refusé admin", Toast.LENGTH_LONG).show();
                        }

                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                },
                error -> Toast.makeText(this, "Erreur login", Toast.LENGTH_LONG).show()
        ) {
            @Override
            protected Map<String, String> getParams() {
                Map<String, String> params = new HashMap<>();
                params.put("email", email);
                params.put("password", password);
                return params;
            }
        };

        queue.add(request);
    }
}
