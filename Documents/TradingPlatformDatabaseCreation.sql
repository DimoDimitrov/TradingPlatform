DROP DATABASE IF EXISTS CryptoTrading;
CREATE DATABASE CryptoTrading;
USE CryptoTrading;

CREATE TABLE Users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL, -- Store hashed passwords
    email VARCHAR(100) UNIQUE NOT NULL,
    funds DECIMAL(15,2) DEFAULT 0.00 -- Stored in BGN
);

CREATE TABLE Transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    sign VARCHAR(10) NOT NULL, -- Crypto symbol like BTC, ETH
    price_of_completion DECIMAL(15,2) NOT NULL,
    quantity DECIMAL(15,8) NOT NULL,
    price_at_completion DECIMAL(15,2) NOT NULL,
    transaction_type ENUM('BUY', 'SELL') NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Assets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    sign VARCHAR(10) NOT NULL, -- Crypto symbol like BTC, ETH
    quantity DECIMAL(15,8) NOT NULL,
    bought_at DECIMAL(15,2) NOT NULL, -- Price at which it was bought
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Dummy user data
INSERT INTO Users (username, name, password, email, funds)
VALUES
    ('john_doe', 'John Doe', SHA2('securepassword', 256), 'john@example.com', 1000.00),
    ('jane_smith', 'Jane Smith', SHA2('anotherpassword', 256), 'jane@example.com', 500.00);

-- Dummy transactions data
INSERT INTO Transactions (user_id, sign, price_of_completion, quantity, price_at_completion, transaction_type)
VALUES
    (1, 'BTC', 500.00, 0.01, 50000.00, 'BUY'),
    (2, 'BTC', 200.00, 0.004, 50000.00, 'BUY');

-- Dummy assets data
INSERT INTO Assets (user_id, sign, quantity, bought_at)
VALUES
    (1, 'BTC', 0.01, 50000.00),
    (2, 'BTC', 0.004, 50000.00);