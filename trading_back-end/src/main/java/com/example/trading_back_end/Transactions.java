package com.example.trading_back_end;

public class Transactions {
    private int id;
    private int userId;
    private String sign;
    private double price_of_completion; // This is the price the user paid for the asset
    private double quantity;
    private double price_at_completion; // This is the price of the asset at the time of completion
    private String transaction_type;
    private String timestamp;

    public Transactions(int id, int userId, String sign, double price_of_completion, double quantity, double price_at_completion, String transaction_type, String timestamp) {
        this.id = id;
        this.userId = userId;
        this.sign = sign;
        this.price_of_completion = price_of_completion;
        this.quantity = quantity;
        this.price_at_completion = price_at_completion;
        this.transaction_type = transaction_type;
        this.timestamp = timestamp;
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
    
    public double getPrice_of_completion() {
        return price_of_completion;
    }

    public double getQuantity() {
        return quantity;
    }

    public double getPrice_at_completion() {
        return price_at_completion;
    }

    public String getTransaction_type() {
        return transaction_type;
    }

    public String getTimestamp() {
        return timestamp;
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

    public void setPrice_of_completion(double price_of_completion) {
        this.price_of_completion = price_of_completion;
    }

    public void setQuantity(double quantity) {
        this.quantity = quantity;
    }

    public void setPrice_at_completion(double price_at_completion) {
        this.price_at_completion = price_at_completion;
    }

    public void setTransaction_type(String transaction_type) {
        this.transaction_type = transaction_type;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "Transactions{" +
                "id=" + id +
                ", userId=" + userId +
                ", sign='" + sign + '\'' +
                ", price_of_completion=" + price_of_completion +
                ", quantity=" + quantity +
                ", price_at_completion=" + price_at_completion +
                ", transaction_type='" + transaction_type + '\'' +
                ", timestamp='" + timestamp + '\'' +
                '}';
    }
}
