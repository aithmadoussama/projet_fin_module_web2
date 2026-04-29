package com.example.campusdelivery.adapter;

import android.content.res.ColorStateList;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.campusdelivery.R;
import com.example.campusdelivery.classes.Livraison;

import java.util.List;

public class LivraisonAdapter extends RecyclerView.Adapter<LivraisonAdapter.ViewHolder> {

    private List<Livraison> list;

    public LivraisonAdapter(List<Livraison> list) {
        this.list = list;
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {

        TextView statut, date, adresse;

        public ViewHolder(View itemView) {
            super(itemView);
            statut = itemView.findViewById(R.id.txtStatut);
            date = itemView.findViewById(R.id.txtDate);
            adresse = itemView.findViewById(R.id.txtAdresse);
        }
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View v = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_commande, parent, false);
        return new ViewHolder(v);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {

        Livraison l = list.get(position);

        holder.statut.setText("Statut : " + l.getStatut());
        holder.date.setText("Date : " + l.getDate_livraison());

        holder.adresse.setText(
                "Départ: " + l.getAdresse_depart() +
                        " → Destination: " + l.getAdresse_arrivee()
        );

        switch (l.getStatut()) {

            case "En cours":
                holder.statut.setTextColor(Color.parseColor("#5B21B6"));
                holder.statut.setBackgroundResource(R.drawable.bg_badge_statut);
                break;

            case "Livré":
                holder.statut.setTextColor(Color.parseColor("#3B6D11"));
                holder.statut.setBackgroundTintList(
                        ColorStateList.valueOf(Color.parseColor("#EAF3DE"))
                );
                break;

            case "Annulé":
                holder.statut.setTextColor(Color.parseColor("#A32D2D"));
                holder.statut.setBackgroundTintList(
                        ColorStateList.valueOf(Color.parseColor("#FCEBEB"))
                );
                break;
        }
    }

    @Override
    public int getItemCount() {
        return list.size();
    }
}