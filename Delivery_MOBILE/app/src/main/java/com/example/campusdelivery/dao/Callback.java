package com.example.campusdelivery.dao;

public interface Callback <T>{
    void onSuccess(T t);
    void onError(String message);
}
