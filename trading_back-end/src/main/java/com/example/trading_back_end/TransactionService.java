package com.example.trading_back_end;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;


@Service
public class TransactionService {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private AssetService assetService;

    public List<Transactions> getUserTransactions(String userEmail) {
        String sql = "SELECT * FROM transactions WHERE user_email = ? ORDER BY timestamp DESC";
        return jdbcTemplate.query(sql, new Object[]{userEmail},
            (rs, rowNum) -> new Transactions(
                rs.getInt("id"),
                rs.getInt("user_id"),
                rs.getString("sign"),
                rs.getDouble("price_of_completion"),
                rs.getDouble("quantity"),
                rs.getDouble("price_at_completion"),
                rs.getString("transaction_type"),
                rs.getString("timestamp")
            )
        );
    }

    @Transactional
    public Transactions createTransaction(Transactions transaction) {
        // Get user's current funds
        Users user = userService.getUserById(transaction.getUserId());
        double totalCost = transaction.getQuantity() * transaction.getPrice_of_completion();
        
        if (transaction.getTransaction_type().equals("BUY")) {
            if (user.getFunds() < totalCost) {
                throw new RuntimeException("Insufficient funds");
            }
            userService.updateUserFunds(user.getEmail(), user.getFunds() - totalCost);
        }

        // Insert transaction
        String sql = "INSERT INTO transactions (user_id, sign, price_of_completion, quantity, price_at_completion, transaction_type, timestamp) " +
                    "VALUES (?, ?, ?, ?, ?, ?, NOW())";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, transaction.getUserId());
            ps.setString(2, transaction.getSign());
            ps.setDouble(3, transaction.getPrice_of_completion());
            ps.setDouble(4, transaction.getQuantity());
            ps.setDouble(5, transaction.getPrice_at_completion());
            return ps;
        }, keyHolder);

        // Update asset
        Assets currentAsset = assetService.getAsset(user.getEmail(), transaction.getSign());
        double newQuantity;
        double newAvgPrice;
        
        if (currentAsset == null) {
            newQuantity = transaction.getQuantity();
            newAvgPrice = transaction.getPrice_at_completion();
        } else {
            if (transaction.getTransaction_type().equals("BUY")) {
                newQuantity = currentAsset.getQuantity() + transaction.getQuantity();
                newAvgPrice = ((currentAsset.getQuantity() * currentAsset.getBought_at()) + 
                             (transaction.getQuantity() * transaction.getPrice_at_completion())) / newQuantity;
            } else {
                newQuantity = currentAsset.getQuantity() - transaction.getQuantity();
                newAvgPrice = currentAsset.getBought_at();
            }
        }
        
        assetService.updateAsset(user.getEmail(), transaction.getSign(), newQuantity, newAvgPrice);

        transaction.setId(keyHolder.getKey().intValue());
        return transaction;
    }
}