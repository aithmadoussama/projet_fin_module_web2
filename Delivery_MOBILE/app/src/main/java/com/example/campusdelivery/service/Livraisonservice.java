package com.example.campusdelivery.service;

import android.content.Context;

import com.example.campusdelivery.classes.Livraison;
import com.example.campusdelivery.dao.IDao;

import java.util.Collections;
import java.util.List;

public class Livraisonservice implements IDao<Livraison> {

    private Context context ;

    public Livraisonservice(Context context) {
        this.context = context;
    }

    @Override
    public boolean create(Livraison livraison) {
        return false;
    }

    @Override
    public boolean delete(Livraison livraison) {
        return false;
    }

    @Override
    public boolean update(Livraison livraison) {
        return false;
    }

    @Override
    public Livraison findById(int id) {
        return null;
    }

    @Override
    public List<Livraison> findAll() {
        String url = "";


        return null ;
    }
}
