package com.example.campusdelivery.dao;

import java.util.List;

public interface IDao <T>{
    boolean create(T t);
    boolean delete(T t);
    boolean update(T t);
    T findById(int id);
    List<T> findAll();
}
