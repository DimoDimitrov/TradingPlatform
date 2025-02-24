package com.example.trading_back_end;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Map;
import java.util.List;

@RestController
public class ApiController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private AssetService assetService;
    
    @Autowired
    private TransactionService transactionService;

    @PostMapping("/auth/register")
    public ResponseEntity<?> registerUser(@RequestBody Users user) {
        try {
            Users registeredUser = userService.registerUser(user);
            return ResponseEntity.ok(registeredUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> credentials) {
        try {
            Users user = userService.loginUser(credentials.get("email"), credentials.get("password"));
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/assets/{email}")
    public ResponseEntity<?> getUserAssets(@PathVariable String email) {
        try {
            List<Assets> assets = assetService.getUserAssets(email);
            return ResponseEntity.ok(assets);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/transactions/{email}")
    public ResponseEntity<?> getUserTransactions(@PathVariable String email) {
        try {
            List<Transactions> transactions = transactionService.getUserTransactions(email);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/transactions")
    public ResponseEntity<?> createTransaction(@RequestBody Transactions transaction) {
        try {
            Transactions newTransaction = transactionService.createTransaction(transaction);
            return ResponseEntity.ok(newTransaction);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}