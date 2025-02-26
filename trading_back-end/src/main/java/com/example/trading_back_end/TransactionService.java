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
        try {
            // First get the user ID from email
            Users user = userService.getUserByEmail(userEmail);
            if (user == null) {
                throw new RuntimeException("User not found");
            }

            String sql = "SELECT * FROM transactions WHERE user_id = ? ORDER BY timestamp DESC";
            return jdbcTemplate.query(sql, new Object[]{user.getId()},
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
        } catch (Exception e) {
            throw new RuntimeException("Error fetching transactions: " + e.getMessage());
        }
    }

    @Transactional
    public Transactions createTransaction(Transactions transaction) {
        // Get user's current funds
        Users user = userService.getUserById(transaction.getUserId());
        if (user == null) {
            throw new RuntimeException("User not found with id: " + transaction.getUserId());
        }

        double totalCost = transaction.getQuantity() * transaction.getPrice_of_completion();
        
        if (transaction.getTransaction_type().equals("BUY")) {
            if (user.getFunds() < totalCost) {
                throw new RuntimeException("Insufficient funds");
            }
            userService.updateUserFunds(user.getEmail(), user.getFunds() - totalCost);
        }

        // Debug print
        System.out.println("Attempting to insert transaction: " + transaction);

        // Simplified SQL query with backticks to escape column names
        String sql = "INSERT INTO `transactions` (`user_id`, `sign`, `price_of_completion`, `quantity`, " +
                    "`price_at_completion`, `transaction_type`) VALUES (?, ?, ?, ?, ?, ?)";
        
        KeyHolder keyHolder = new GeneratedKeyHolder();
        try {
            jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setInt(1, transaction.getUserId());
                ps.setString(2, transaction.getSign());
                ps.setDouble(3, transaction.getPrice_of_completion());
                ps.setDouble(4, transaction.getQuantity());
                ps.setDouble(5, transaction.getPrice_at_completion());
                ps.setString(6, transaction.getTransaction_type());
                
                // Debug print
                System.out.println("Prepared SQL: " + ps.toString());
                
                return ps;
            }, keyHolder);
        } catch (Exception e) {
            // More detailed error message
            System.err.println("Database error details: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Database error: " + e.getMessage());
        }

        transaction.setId(keyHolder.getKey().intValue());
        return transaction;
    }
}