package com.example.trading_back_end;

public class Assets {
    private int id;
    private int userId;
    private String sign;
    private double quantity;
    private double bought_at;

    public Assets(int id, int userId, String sign, double quantity, double bought_at) {
        this.id = id;
        this.userId = userId;
        this.sign = sign;
        this.quantity = quantity;
        this.bought_at = bought_at;
    }       

    public int getId() {
        return id;
    }
    
    public int getUserId() {
        return userId;
    }

    public String getSign() {
        return sign;
    }

    public double getQuantity() {
        return quantity;
    }

    public double getBought_at() {
        return bought_at;
    }   

    public void setId(int id) {
        this.id = id;
    }       

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public void setSign(String sign) {
        this.sign = sign;
    }

    public void setQuantity(double quantity) {
        this.quantity = quantity;
    }

    public void setBought_at(double bought_at) {
        this.bought_at = bought_at;
    }

    @Override
    public String toString() {
        return "Assets{" +
                "id=" + id +
                ", userId=" + userId +
                ", sign='" + sign + '\'' +
                ", quantity=" + quantity +
                ", bought_at=" + bought_at +
                '}';
    }
}
