import React, { useState, useEffect, useRef } from 'react';
import { connectKrakenWebSocket } from './api/api_endpoint';
import Chart from 'chart.js/auto';

export default function Dashboard() {
    const [cryptoData, setCryptoData] = useState({});
    const wsRef = useRef(null);
    const isConnected = useRef(false);
    const chartRefs = useRef({});

    useEffect(() => {
        if (!isConnected.current) {
            isConnected.current = true;
            wsRef.current = connectKrakenWebSocket((symbol, data) => {
                setCryptoData(prev => {
                    const newData = {
                        ...prev,
                        [symbol]: {
                            ...data,
                            priceHistory: [...(prev[symbol]?.priceHistory || []), data.last].slice(-20) // Keep last 20 points
                        }
                    };
                    
                    // Update chart if it exists
                    if (chartRefs.current[symbol]) {
                        const chart = chartRefs.current[symbol];
                        chart.data.labels = Array(newData[symbol].priceHistory.length).fill('');
                        chart.data.datasets[0].data = newData[symbol].priceHistory;
                        chart.update();
                    }
                    
                    return newData;
                });
            });
        }

        return () => {
            // Cleanup charts
            Object.values(chartRefs.current).forEach(chart => chart.destroy());
            chartRefs.current = {};
            
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
                isConnected.current = false;
            }
        };
    }, []);

    // Create or update chart
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
                    borderColor: '#01a7e1',         // Line color
                    backgroundColor: 'rgba(1, 167, 225, 0.1)',  // Area fill color
                    borderWidth: 2,                 // Line thickness
                    pointRadius: 0,                 // Hide points
                    tension: 0.4,                   // Smooth line
                    fill: true                      // Fill area under the line
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
                            color: 'rgba(255, 255, 255, 0.1)'  // Grid line color
                        },
                        ticks: {
                            color: '#888'  // Y-axis labels color
                        }
                    },
                    x: {
                        grid: {
                            display: false  // Hide X grid lines
                        },
                        ticks: {
                            display: false  // Hide X-axis labels
                        }
                    }
                },
                animation: {
                    duration: 0
                }
            }
        });
    };

    return (
        <div className='dashboard-container'>
            <h1 className='dashboard-title'>Dashboard</h1>
            {Object.keys(cryptoData).length === 0 ? <p className='loading'>Loading...</p> : 
             <div className="crypto-grid">
                {Object.entries(cryptoData).map(([symbol, data]) => (
                    <div key={symbol} className="crypto-card">
                        <h3>{symbol}</h3>
                        <div className='price-info-container'>
                        <div className="price-info">
                            <p>Last: ${parseFloat(data.last).toFixed(2)}</p>
                            <p>Bid: ${parseFloat(data.bid).toFixed(2)} ({parseFloat(data.bid_qty).toFixed(4)})</p>
                            <p>Ask: ${parseFloat(data.ask).toFixed(2)} ({parseFloat(data.ask_qty).toFixed(4)})</p>
                        </div>
                        <div className="market-info">
                            <p>24h High: ${parseFloat(data.high).toFixed(2)}</p>
                            <p>24h Low: ${parseFloat(data.low).toFixed(2)}</p>
                            <p>24h Change: {parseFloat(data.change).toFixed(2)} ({parseFloat(data.change_pct).toFixed(2)}%)</p>
                        </div>
                        <div className="volume-info">
                            <p>Volume: {parseFloat(data.volume).toFixed(2)}</p>
                            <p>VWAP: ${parseFloat(data.vwap).toFixed(2)}</p>
                        </div>
                        </div>
                        <div className="chart-container" style={{ height: '200px' }}>
                            <canvas ref={ref => initChart(ref, symbol)}></canvas>
                        </div>

                    </div>
                ))}
              </div>}
        </div>
    );
}
