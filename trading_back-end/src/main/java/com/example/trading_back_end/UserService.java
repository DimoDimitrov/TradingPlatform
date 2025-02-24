package com.example.trading_back_end;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.dao.EmptyResultDataAccessException;

@Service
public class UserService {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Users registerUser(Users user) {
        String sql = "INSERT INTO users (username, name, password, email, funds) VALUES (?, ?, ?, ?, ?)";
        try {
            jdbcTemplate.update(sql,
                user.getUsername(),
                user.getName(),
                user.getPassword(), // Note: In production, this should be hashed
                user.getEmail(),
                user.getFunds()
            );
            return user;
        } catch (DuplicateKeyException e) {
            throw new RuntimeException("Username or email already exists");
        }
    }

    public Users loginUser(String email, String password) {
        String sql = "SELECT * FROM users WHERE email = ? AND password = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new Object[]{email, password},
                (rs, rowNum) -> new Users(
                    rs.getInt("id"),
                    rs.getString("username"),
                    rs.getString("name"),
                    rs.getString("password"),
                    rs.getString("email"),
                    rs.getDouble("funds")
                )
            );
        } catch (EmptyResultDataAccessException e) {
            throw new RuntimeException("Invalid credentials");
        }
    }

    public Users getUserByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new Object[]{email},
                (rs, rowNum) -> new Users(
                    rs.getInt("id"),
                    rs.getString("username"),
                    rs.getString("name"),
                    rs.getString("password"),
                    rs.getString("email"),
                    rs.getDouble("funds")
                )
            );
        } catch (EmptyResultDataAccessException e) {
            throw new RuntimeException("User not found");
        }
    }

    public void updateUserFunds(String email, double newFunds) {
        String sql = "UPDATE users SET funds = ? WHERE email = ?";
        int rowsAffected = jdbcTemplate.update(sql, newFunds, email);
        if (rowsAffected == 0) {
            throw new RuntimeException("User not found");
        }
    }

    public Users getUserById(int id) {
        String sql = "SELECT * FROM users WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{id},
            (rs, rowNum) -> new Users(
                rs.getInt("id"),
                rs.getString("username"),
                rs.getString("name"),
                rs.getString("password"),
                rs.getString("email"),
                rs.getDouble("funds")
            )
        );
    }
}
