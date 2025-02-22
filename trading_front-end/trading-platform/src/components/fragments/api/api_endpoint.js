import { useState, useEffect } from 'react';

export const connectKrakenWebSocket = (onDataUpdate) => {
    const ws = new WebSocket('wss://ws.kraken.com/v2');

    ws.onopen = () => {
        console.log('Connected to Kraken WebSocket');
        ws.send(JSON.stringify({
            "method": "subscribe",
            "params": {
                "channel": "ticker",
                "symbol": ["BTC/USD", "ETH/USD", "SOL/USD"]
            }
        }));
    };

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        // Log subscription confirmations and ticker data
        if (message.method === "subscribe" || 
            (message.channel === "ticker" && 
            (message.type === "snapshot" || message.type === "update"))) {
            console.log('Received message:', message);
        }
        
        // Process ticker updates and snapshots
        if (message.channel === "ticker" && 
           (message.type === "snapshot" || message.type === "update")) {
            const data = message.data[0];
            onDataUpdate(data.symbol, {
                price: data.price || "N/A",
                volume: data.volume || "N/A",
                high: data.high || "N/A",
                low: data.low || "N/A",
                change24h: data.change || "N/A"
            });
        }
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
        console.log('Disconnected from Kraken WebSocket');
    };

    return ws;
};
