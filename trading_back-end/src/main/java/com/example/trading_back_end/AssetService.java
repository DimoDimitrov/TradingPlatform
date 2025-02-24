package com.example.trading_back_end;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.dao.EmptyResultDataAccessException;
import java.util.List;

@Service
public class AssetService {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Assets> getUserAssets(String userEmail) {
        // Get user ID first
        String userIdSql = "SELECT id FROM users WHERE email = ?";
        Integer userId;
        try {
            userId = jdbcTemplate.queryForObject(userIdSql, new Object[]{userEmail}, Integer.class);
        } catch (EmptyResultDataAccessException e) {
            throw new RuntimeException("User not found");
        }

        // Then get assets for that user ID
        String sql = "SELECT * FROM assets WHERE user_id = ?";
        return jdbcTemplate.query(sql, new Object[]{userId},
            (rs, rowNum) -> new Assets(
                rs.getInt("id"),
                rs.getInt("user_id"),
                rs.getString("sign"),
                rs.getDouble("quantity"),
                rs.getDouble("bought_at")
            )
        );
    }

    public void updateAsset(String userEmail, String symbol, double quantity, double price) {
        // First try to update existing asset
        String updateSql = "UPDATE assets SET quantity = ?, bought_at = ? WHERE user_email = ? AND symbol = ?";
        int rowsAffected = jdbcTemplate.update(updateSql, quantity, price, userEmail, symbol);
        
        // If no asset exists, create new one
        if (rowsAffected == 0) {
            String insertSql = "INSERT INTO assets (user_email, symbol, quantity, bought_at) VALUES (?, ?, ?, ?)";
            jdbcTemplate.update(insertSql, userEmail, symbol, quantity, price);
        }
    }

    public Assets getAsset(String userEmail, String symbol) {
        String sql = "SELECT * FROM assets WHERE user_email = ? AND symbol = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new Object[]{userEmail, symbol},
                (rs, rowNum) -> new Assets(
                    rs.getInt("id"),
                    rs.getInt("user_id"),
                    rs.getString("symbol"),
                    rs.getDouble("quantity"),
                    rs.getDouble("bought_at")
                )
            );
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }
}