package com.example.trading_back_end;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.dao.EmptyResultDataAccessException;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AssetService {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private UserService userService;

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

    public Assets getAsset(String userEmail, String symbol) {
        // Get user ID first
        String userIdSql = "SELECT id FROM users WHERE email = ?";
        Integer userId;
        try {
            userId = jdbcTemplate.queryForObject(userIdSql, new Object[]{userEmail}, Integer.class);
        } catch (EmptyResultDataAccessException e) {
            throw new RuntimeException("User not found");
        }

        // Then get asset for that user ID and symbol
        String sql = "SELECT * FROM assets WHERE user_id = ? AND sign = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new Object[]{userId, symbol},
                (rs, rowNum) -> new Assets(
                    rs.getInt("id"),
                    rs.getInt("user_id"),
                    rs.getString("sign"),
                    rs.getDouble("quantity"),
                    rs.getDouble("bought_at")
                )
            );
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    @Transactional
    public Assets buyAsset(String userEmail, String symbol, double quantity, double price) {
        // Get user first
        Users user = userService.getUserByEmail(userEmail);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        // Check if user has enough funds
        double totalCost = quantity * price;
        if (user.getFunds() < totalCost) {
            throw new RuntimeException("Insufficient funds");
        }

        // Update user funds
        userService.updateUserFunds(userEmail, user.getFunds() - totalCost);

        // Check if asset exists
        Assets existingAsset = getAsset(userEmail, symbol);
        if (existingAsset != null) {
            // Update existing asset
            double newQuantity = existingAsset.getQuantity() + quantity;
            double newAvgPrice = ((existingAsset.getQuantity() * existingAsset.getBought_at()) + 
                                (quantity * price)) / newQuantity;
            
            String sql = "UPDATE assets SET quantity = ?, bought_at = ? WHERE user_id = ? AND sign = ?";
            jdbcTemplate.update(sql, newQuantity, newAvgPrice, user.getId(), symbol);
            
            existingAsset.setQuantity(newQuantity);
            existingAsset.setBought_at(newAvgPrice);
            return existingAsset;
        } else {
            // Create new asset
            String sql = "INSERT INTO assets (user_id, sign, quantity, bought_at) VALUES (?, ?, ?, ?)";
            jdbcTemplate.update(sql, user.getId(), symbol, quantity, price);
            
            return new Assets(0, user.getId(), symbol, quantity, price);
        }
    }

    @Transactional
    public Assets sellAsset(String userEmail, String symbol, double quantity, double price) {
        // Get user first
        Users user = userService.getUserByEmail(userEmail);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        // Check if asset exists and has enough quantity
        Assets existingAsset = getAsset(userEmail, symbol);
        if (existingAsset == null || existingAsset.getQuantity() < quantity) {
            throw new RuntimeException("Insufficient asset quantity");
        }

        // Calculate sale proceeds
        double proceeds = quantity * price;

        // Update user funds
        userService.updateUserFunds(userEmail, user.getFunds() + proceeds);

        // Update asset quantity
        double newQuantity = existingAsset.getQuantity() - quantity;
        if (newQuantity > 0) {
            // Update existing asset
            String sql = "UPDATE assets SET quantity = ? WHERE user_id = ? AND sign = ?";
            jdbcTemplate.update(sql, newQuantity, user.getId(), symbol);
            
            existingAsset.setQuantity(newQuantity);
            return existingAsset;
        } else {
            // Delete asset if quantity is 0
            deleteAsset(userEmail, symbol);
            return null;
        }
    }

    public void deleteAsset(String userEmail, String symbol) {
        // Get user ID first
        Users user = userService.getUserByEmail(userEmail);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        String sql = "DELETE FROM assets WHERE user_id = ? AND sign = ?";
        int rowsAffected = jdbcTemplate.update(sql, user.getId(), symbol);
        
        if (rowsAffected == 0) {
            throw new RuntimeException("Asset not found");
        }
    }

    public void updateAssetQuantity(String userEmail, String symbol, double newQuantity) {
        // Get user ID first
        Users user = userService.getUserByEmail(userEmail);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        String sql = "UPDATE assets SET quantity = ? WHERE user_id = ? AND sign = ?";
        int rowsAffected = jdbcTemplate.update(sql, newQuantity, user.getId(), symbol);
        
        if (rowsAffected == 0) {
            throw new RuntimeException("Asset not found");
        }
    }

    public void deleteAllAssets(String userEmail) {
        // Get user first
        Users user = userService.getUserByEmail(userEmail);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        // Delete all assets
        String sql = "DELETE FROM assets WHERE user_id = ?";
        jdbcTemplate.update(sql, user.getId());
        
        // Reset user funds to default 1000
        userService.updateUserFunds(userEmail, 1000.00);
    }

    public Assets updateAsset(String userEmail, String symbol, double newQuantity, double newPrice) {
        // Get user first
        Users user = userService.getUserByEmail(userEmail);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        try {
            // Check if asset exists
            String checkSql = "SELECT * FROM assets WHERE user_id = ? AND sign = ?";
            Assets existingAsset = jdbcTemplate.queryForObject(checkSql, 
                new Object[]{user.getId(), symbol},
                (rs, rowNum) -> new Assets(
                    rs.getInt("id"),
                    rs.getInt("user_id"),
                    rs.getString("sign"),
                    rs.getDouble("quantity"),
                    rs.getDouble("bought_at")
                )
            );

            // Update existing asset
            String updateSql = "UPDATE assets SET quantity = ?, bought_at = ? WHERE user_id = ? AND sign = ?";
            jdbcTemplate.update(updateSql, newQuantity, newPrice, user.getId(), symbol);
            
            existingAsset.setQuantity(newQuantity);
            existingAsset.setBought_at(newPrice);
            return existingAsset;

        } catch (EmptyResultDataAccessException e) {
            // Create new asset if it doesn't exist
            String insertSql = "INSERT INTO assets (user_id, sign, quantity, bought_at) VALUES (?, ?, ?, ?)";
            jdbcTemplate.update(insertSql, user.getId(), symbol, newQuantity, newPrice);
            
            return new Assets(0, user.getId(), symbol, newQuantity, newPrice);
        }
    }
}