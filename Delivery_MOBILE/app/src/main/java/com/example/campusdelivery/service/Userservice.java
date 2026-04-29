package com.example.campusdelivery.service;

import android.content.Context;
import android.content.Intent;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.example.campusdelivery.classes.User;
import com.example.campusdelivery.dao.Callback;
import com.example.campusdelivery.dao.IDao;
import com.example.campusdelivery.ui.ClientActivity;
import com.example.campusdelivery.ui.LivreurActivity;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Userservice implements IDao {

    private Context context ;

    public Userservice(Context context) {
        this.context = context;
    }

    public void findByusername(String username, Callback<User> callback) {

        String url = "http://10.0.2.2/CampusDelivery/api/public/utilisateur-find";

        RequestQueue queue = Volley.newRequestQueue(context);
        StringRequest request = new StringRequest(Request.Method.POST, url,
                response -> {
                    try {
                        JSONObject obj = new JSONObject(response);
                        boolean success = obj.getBoolean("success");
                        if (success) {
                            JSONObject userobj;
                            if (obj.has("user")) {
                                userobj = obj.getJSONObject("user");
                            } else {
                                userobj = obj;
                            }
                            int id = userobj.getInt("id");
                            String nom = userobj.getString("nom");
                            String email = userobj.getString("email");
                            String password = userobj.getString("mot_de_passe");
                            String role = userobj.getString("role");
                            String date_creation = userobj.getString("date_creation");
                            User user = new User(id, nom, email, password, role, date_creation);
                            callback.onSuccess(user);
                        } else {
                            callback.onError("Nom Utilisateur incorrecte");
                        }

                    } catch (JSONException e) {
                        callback.onError(e.getMessage());
                    }
                },
                error -> {
                    callback.onError("Erreur dans la connexion API");
                }
        ) {
            @Override
            protected Map<String, String> getParams() {
                Map<String, String> params = new HashMap<>();
                params.put("user_name", username);
                return params;
            }
        };

        queue.add(request);

    }
    public void login(User user, String password) {
        if (user.getMot_de_passe().equals(password)) {
            if (user.getRole().equals("client")) {
                Intent i = new Intent(context, ClientActivity.class);
                context.startActivity(i);
            } else if(user.getRole().equals("livreur")) {
                Intent i = new Intent(context, LivreurActivity.class);
                context.startActivity(i);
            }else {
                Toast.makeText(context, "Role non trouve", Toast.LENGTH_LONG).show();
            }
        } else {
            Toast.makeText(context, "Mot de passe incorrect", Toast.LENGTH_LONG).show();
        }
    }

    @Override
    public boolean create(Object o) {
        return false;
    }

    @Override
    public boolean delete(Object o) {
        return false;
    }

    @Override
    public boolean update(Object o) {
        return false;
    }

    @Override
    public Object findById(int id) {
        return null;
    }

    @Override
    public List findAll() {
        return Collections.emptyList();
    }
}
