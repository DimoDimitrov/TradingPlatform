package com.example.trading_back_end;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;

@SpringBootApplication
public class TradingBackEndApplication implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public static void main(String[] args) {
        SpringApplication.run(TradingBackEndApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        // Test reading users
        String countSql = "SELECT COUNT(*) FROM users";
        int count = jdbcTemplate.queryForObject(countSql, Integer.class);
        System.out.println("Total users in database: " + count);

        // Test inserting a user
        String insertSql = "INSERT INTO users (username, name, password, email, funds) VALUES (?, ?, ?, ?, ?)";
        jdbcTemplate.update(insertSql, 
            "testuser",
            "Test User",
            "password123",
            "test@example.com",
            1000.00  // Initial funds amount
        );
		
        // Verify the insert
        count = jdbcTemplate.queryForObject(countSql, Integer.class);
        System.out.println("Total users after insert: " + count);
    }
}