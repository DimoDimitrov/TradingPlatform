import React, { useState, useEffect, useRef } from 'react';
import { connectKrakenWebSocket } from './api/api_endpoint';

export default function Dashboard() {
    const [cryptoData, setCryptoData] = useState({});
    const wsRef = useRef(null);
    const isConnected = useRef(false);

    useEffect(() => {
        if (!isConnected.current) {
            isConnected.current = true;
            wsRef.current = connectKrakenWebSocket((symbol, data) => {
                setCryptoData(prev => ({
                    ...prev,
                    [symbol]: data
                }));
            });
        }

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
                isConnected.current = false;
            }
        };
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <div className="crypto-grid">
                {Object.entries(cryptoData).map(([symbol, data]) => (
                    <div key={symbol} className="crypto-card">
                        <h3>{symbol}</h3>
                        <p>Price: ${data.price}</p>
                        <p>Volume: {data.volume}</p>
                        <p>24h Change: {data.change24h}%</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
