import React, { useState, useEffect, useRef } from 'react';
import { connectKrakenWebSocket } from './api/api_endpoint';
import CryptoCard from './api/CryptoCard';
import Chart from 'chart.js/auto';

export default function Dashboard({isLoggedIn, setIsLoggedIn, user, setUser, assets, setAssets, transactions, setTransactions}) {
    const [cryptoData, setCryptoData] = useState({});
    const wsRef = useRef(null);
    const isConnected = useRef(false);
    const chartRefs = useRef({});

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (!isConnected.current) {
            isConnected.current = true;
            wsRef.current = connectKrakenWebSocket((symbol, data) => {
                setCryptoData(prev => ({
                    ...prev,
                    [symbol]: {
                        ...data,
                        priceHistory: [...(prev[symbol]?.priceHistory || []), data.last].slice(-20)
                    }
                }));
            });
        }

        return () => {
            // Cleanup charts on unmount
            Object.values(chartRefs.current).forEach(chart => chart.destroy());
            chartRefs.current = {};

            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
                isConnected.current = false;
            }
        };
    }, []);

    const initChart = (canvasRef, symbol) => {
        if (!canvasRef || chartRefs.current[symbol]) return;

        const ctx = canvasRef.getContext('2d');
        chartRefs.current[symbol] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array(cryptoData[symbol]?.priceHistory?.length || 0).fill(''),
                datasets: [{
                    label: 'Price',
                    data: cryptoData[symbol]?.priceHistory || [],
                    borderColor: '#01a7e1',
                    backgroundColor: 'rgba(1, 167, 225, 0.1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#888'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            display: false
                        }
                    }
                },
                animation: {
                    duration: 0
                }
            }
        });
    };

    useEffect(() => {
        // Update charts when data changes
        Object.entries(cryptoData).forEach(([symbol, data]) => {
            if (chartRefs.current[symbol]) {
                const chart = chartRefs.current[symbol];
                chart.data.labels = Array(data.priceHistory.length).fill('');
                chart.data.datasets[0].data = data.priceHistory;
                chart.update();
            }
        });
    }, [cryptoData]);

    const calculateSum = (e, symbol) => {
        const amount = parseFloat(e.target.value) || 0;
        const price = cryptoData[symbol]?.last || 0;
        const sum = (amount * price).toFixed(2);
        
        const cardElement = e.target.closest('.crypto-card');
        const sumInput = cardElement.querySelector('#sum');
        sumInput.value = sum;
    };

    return (
        <div className='dashboard-container'>
            <h1 className='dashboard-title'>Dashboard</h1>
            {Object.keys(cryptoData).length === 0 ? 
                <p className='loading'>Loading...</p> : 
                <div className="crypto-grid">
                    {Object.entries(cryptoData).map(([symbol, data]) => (
                        <CryptoCard 
                            key={symbol}
                            symbol={symbol}
                            data={data}
                            isLoggedIn={isLoggedIn}
                            initChart={initChart}
                            assets={assets}
                            transactions={transactions}
                            setAssets={setAssets}
                            setTransactions={setTransactions}
                            user={user}
                            setUser={setUser}
                        />
                    ))}
                </div>
            }
        </div>
    );
}
