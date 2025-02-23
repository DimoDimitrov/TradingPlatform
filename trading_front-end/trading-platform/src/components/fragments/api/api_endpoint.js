import { useState, useEffect } from 'react';

export const connectKrakenWebSocket = (onDataUpdate) => {
    const ws = new WebSocket('wss://ws.kraken.com/v2');
    let isSubscribed = false;

    ws.onopen = () => {
        console.log('Connected to Kraken WebSocket');
        if (!isSubscribed) {
            isSubscribed = true;
            ws.send(JSON.stringify({
                "method": "subscribe",
                "params": {
                    "channel": "ticker",
                    "symbol": ["BTC/USD", "ETH/USD", "SOL/USD", "XRP/USD", "ADA/USD", 
                              "DOGE/USD", "DOT/USD", "LINK/USD", "UNI/USD", "LTC/USD", 
                              "MATIC/USD", "ATOM/USD", "AVAX/USD", "ALGO/USD", "FIL/USD", 
                              "XLM/USD", "AAVE/USD", "EOS/USD", "XTZ/USD", "COMP/USD"]
                }
            }));
        }
    };

    ws.onmessage = (event) => {
        if (!isSubscribed) return;
        
        const message = JSON.parse(event.data);
        
        if (message.channel === "ticker" && message.data && Array.isArray(message.data)) {
            const tickerData = message.data[0];
            console.log('Processing ticker data:', tickerData);
            
            if (tickerData) {
                onDataUpdate(tickerData.symbol, {
                    last: tickerData.last || "N/A",
                    bid: tickerData.bid || "N/A",
                    bid_qty: tickerData.bid_qty || "N/A",
                    ask: tickerData.ask || "N/A",
                    ask_qty: tickerData.ask_qty || "N/A",
                    high: tickerData.high || "N/A",
                    low: tickerData.low || "N/A",
                    change: tickerData.change || "N/A",
                    change_pct: tickerData.change_pct || "N/A",
                    volume: tickerData.volume || "N/A",
                    vwap: tickerData.vwap || "N/A"
                });
            }
        }
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        isSubscribed = false;
    };

    ws.onclose = () => {
        console.log('Disconnected from Kraken WebSocket');
        isSubscribed = false;
    };

    return {
        close: () => {
            isSubscribed = false;
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        }
    };
};
