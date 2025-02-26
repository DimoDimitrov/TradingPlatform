package com.example.trading_back_end;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Map;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {
    RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS
}, allowCredentials = "true")
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
            // Log the received transaction
            System.out.println("Received transaction: " + transaction);
            
            Transactions newTransaction = transactionService.createTransaction(transaction);
            
            // Log the created transaction
            System.out.println("Created transaction: " + newTransaction);
            
            return ResponseEntity.ok(newTransaction);
        } catch (Exception e) {
            System.err.println("Error creating transaction: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/assets/buy")
    public ResponseEntity<?> buyAsset(@RequestBody Map<String, Object> request) {
        try {
            String email = (String) request.get("email");
            String symbol = (String) request.get("symbol");
            double quantity = Double.parseDouble(request.get("quantity").toString());
            double price = Double.parseDouble(request.get("price").toString());
            
            Assets asset = assetService.buyAsset(email, symbol, quantity, price);
            return ResponseEntity.ok(asset);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/assets/sell")
    public ResponseEntity<?> sellAsset(@RequestBody Map<String, Object> request) {
        try {
            String email = (String) request.get("email");
            String symbol = (String) request.get("symbol");
            double quantity = Double.parseDouble(request.get("quantity").toString());
            double price = Double.parseDouble(request.get("price").toString());
            
            Assets asset = assetService.sellAsset(email, symbol, quantity, price);
            return ResponseEntity.ok(asset);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/assets/{email}/{symbol}")
    public ResponseEntity<?> deleteAsset(@PathVariable String email, @PathVariable String symbol) {
        try {
            String decodedSymbol = java.net.URLDecoder.decode(symbol, "UTF-8");
            assetService.deleteAsset(email, decodedSymbol);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/assets/{email}/{symbol}")
    public ResponseEntity<?> updateAsset(
            @PathVariable String email, 
            @PathVariable String symbol, 
            @RequestBody Map<String, Double> request) {
        try {
            String decodedSymbol = java.net.URLDecoder.decode(symbol, "UTF-8");
            double newQuantity = request.get("quantity");
            double newPrice = request.get("price");
            Assets asset = assetService.updateAsset(email, decodedSymbol, newQuantity, newPrice);
            return ResponseEntity.ok(asset);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/assets/{email}/all")
    public ResponseEntity<?> deleteAllAssets(@PathVariable String email) {
        try {
            assetService.deleteAllAssets(email);
            return ResponseEntity.ok().body("All assets deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/assets/update")
    public ResponseEntity<?> updateAssetPost(@RequestBody Map<String, Object> request) {
        try {
            String email = (String) request.get("email");
            String symbol = (String) request.get("symbol");
            double newQuantity = Double.parseDouble(request.get("quantity").toString());
            double newPrice = Double.parseDouble(request.get("price").toString());
            
            Assets asset = assetService.updateAsset(email, symbol, newQuantity, newPrice);
            return ResponseEntity.ok(asset);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/assets/delete")
    public ResponseEntity<?> deleteAssetPost(@RequestBody Map<String, Object> request) {
        try {
            String email = (String) request.get("email");
            String symbol = (String) request.get("symbol");
            
            assetService.deleteAsset(email, symbol);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/users/{email}/funds")
    public ResponseEntity<?> updateUserFunds(@PathVariable String email, @RequestBody Map<String, Double> request) {
        try {
            double newFunds = request.get("funds");
            Users updatedUser = userService.updateUserFundsAndReturn(email, newFunds);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}