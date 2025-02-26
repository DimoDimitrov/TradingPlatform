import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

export default function CryptoCard({ symbol, data, isLoggedIn, user, assets, setAssets, transactions, setTransactions, setUser }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef.current && !chartInstance.current) {
            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array(data.priceHistory.length).fill(''),
                    datasets: [{
                        label: 'Price',
                        data: data.priceHistory,
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
        } else if (chartInstance.current) {
            chartInstance.current.data.labels = Array(data.priceHistory.length).fill('');
            chartInstance.current.data.datasets[0].data = data.priceHistory;
            chartInstance.current.update();
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }
        };
    }, [data.priceHistory]);

    const calculateSum = (e) => {
        const amount = parseFloat(e.target.value) || 0;
        const price = data.last || 0;
        const sum = (amount * price).toFixed(2);
        
        const cardElement = e.target.closest('.crypto-card');
        const sumInput = cardElement.querySelector('#sum');
        sumInput.value = sum;
    };

    const handleBuy = async () => {
        if (!user || !user.id) {
            alert('Please log in to make transactions');
            return;
        }

        const cardElement = document.querySelector(`.crypto-card[data-symbol="${symbol}"]`);
        const amountInput = cardElement.querySelector('#amount');
        
        const amount = parseFloat(amountInput.value) || 0;
        const price = data.last || 0;
        const sum = parseFloat((amount * price).toFixed(2));

        if (amount <= 0 || sum <= 0) {
            alert('Invalid amount or sum');
            return;
        }

        const transaction = {
            userId: user.id,
            sign: symbol,  // Using full symbol (e.g., "SOL/USD")
            price_of_completion: price,
            quantity: amount,
            price_at_completion: price,
            transaction_type: "BUY"
        };

        try {
            console.log('Sending transaction:', transaction);

            // Update user funds first
            const responseFunds = await fetch(`http://localhost:8080/users/${user.email}/funds`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    funds: user.funds - sum
                })
            });

            if (!responseFunds.ok) {
                const errorText = await responseFunds.text();
                throw new Error(`Failed to update user funds: ${errorText}`);
            }

            const updatedUser = await responseFunds.json();
            // Update the user state through the parent component
            if (typeof setUser === 'function') {
                setUser(updatedUser);
            }

            const responseTransaction = await fetch(`http://localhost:8080/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(transaction)
            });

            if (!responseTransaction.ok) {
                const errorText = await responseTransaction.text();
                console.error('Error response:', errorText);
                throw new Error(`Failed to buy crypto: ${errorText}`);
            }   

            const transactionData = await responseTransaction.json();
            console.log('Transaction created:', transactionData);
            setTransactions([...transactions, transactionData]);

            // Check if asset already exists
            const existingAsset = assets.find(asset => asset.sign === symbol);
            
            if (existingAsset) {
                // Update existing asset
                const responseAsset = await fetch(`http://localhost:8080/assets/${user.email}/${symbol}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        quantity: existingAsset.quantity + amount,
                        price: price
                    })
                });

                if (!responseAsset.ok) {
                    const errorText = await responseAsset.text();
                    throw new Error(`Failed to update asset: ${errorText}`);
                }

                const updatedAsset = await responseAsset.json();
                setAssets(assets.map(asset => 
                    asset.sign === symbol ? updatedAsset : asset
                ));
            } else {
                // Create new asset
                const responseAsset = await fetch(`http://localhost:8080/assets/buy`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: user.email,
                        symbol: symbol,
                        quantity: amount,
                        price: price
                    })
                });

                if (!responseAsset.ok) {
                    const errorText = await responseAsset.text();
                    console.error('Asset creation error:', errorText);
                    throw new Error(`Failed to create asset: ${errorText}`);
                }

                const newAsset = await responseAsset.json();
                setAssets([...assets, newAsset]);
            }

        } catch (err) {
            console.error('Buy error details:', {
                message: err.message,
                stack: err.stack,
                transaction: transaction
            });
            alert(`Error: ${err.message}`);
        }
    };

    const handleSell = async () => {
        if (!user || !user.id) {
            alert('Please log in to make transactions');
            return;
        }

        const cardElement = document.querySelector(`.crypto-card[data-symbol="${symbol}"]`);
        const amountInput = cardElement.querySelector('#amount');
        
        const amount = parseFloat(amountInput.value) || 0;
        const price = data.last || 0;
        const sum = parseFloat((amount * price).toFixed(2));

        if (amount <= 0 || sum <= 0) {
            alert('Invalid amount or sum');
            return;
        }

        const transaction = {
            userId: user.id,
            sign: symbol,  // Using full symbol (e.g., "SOL/USD")
            price_of_completion: price,
            quantity: amount,
            price_at_completion: price,
            transaction_type: "SELL"
        };

        try {
            console.log('Sending transaction:', transaction);

            const responseTransaction = await fetch(`http://localhost:8080/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(transaction)
            });

            if (!responseTransaction.ok) {
                const errorText = await responseTransaction.text();
                console.error('Error response:', errorText);
                throw new Error(`Failed to sell crypto: ${errorText}`);
            }   

            const transactionData = await responseTransaction.json();
            console.log('Transaction created:', transactionData);
            setTransactions([...transactions, transactionData]);

            // Calculate new quantity and sale proceeds
            const existingAsset = assets.find(asset => asset.sign === symbol);
            if (!existingAsset || existingAsset.quantity < amount) {
                alert(`Insufficient ${symbol} balance. Available: ${existingAsset ? existingAsset.quantity : 0}`);
                return;
            }

            const newQuantity = existingAsset.quantity - amount;
            const saleProceeds = amount * price;

            // Update user funds first
            const responseFunds = await fetch(`http://localhost:8080/users/${user.email}/funds`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    funds: user.funds + saleProceeds
                })
            });

            if (!responseFunds.ok) {
                const errorText = await responseFunds.text();
                throw new Error(`Failed to update user funds: ${errorText}`);
            }

            const updatedUser = await responseFunds.json();
            // Update the user state through the parent component
            if (typeof setUser === 'function') {
                setUser(updatedUser);
            }

            if (newQuantity > 0) {
                // Update existing asset through POST
                const responseAsset = await fetch(`http://localhost:8080/assets/update`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        email: user.email,
                        symbol: symbol,
                        quantity: newQuantity,
                        price: existingAsset.bought_at
                    })
                });

                if (!responseAsset.ok) {
                    const errorText = await responseAsset.text();
                    throw new Error(`Failed to update asset: ${errorText}`);
                }

                const updatedAsset = await responseAsset.json();
                setAssets(assets.map(asset => 
                    asset.sign === symbol ? updatedAsset : asset
                ));
            } else {
                // Delete asset through POST
                const responseAsset = await fetch(`http://localhost:8080/assets/delete`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        email: user.email,
                        symbol: symbol
                    })
                });

                if (!responseAsset.ok) {
                    const errorText = await responseAsset.text();
                    throw new Error(`Failed to delete asset: ${errorText}`);
                }

                // Remove asset from state
                setAssets(assets.filter(asset => asset.sign !== symbol));
            }

            // Clear input field after successful transaction
            amountInput.value = '';
            const sumInput = cardElement.querySelector('#sum');
            sumInput.value = '';

        } catch (err) {
            console.error('Sell error details:', {
                message: err.message,
                stack: err.stack,
                transaction: transaction
            });
            alert(`Error: ${err.message}`);
        }
    };

    return (
        <div className="crypto-card" data-symbol={symbol}>
            <h3>{symbol}</h3>
            <div className='price-info-container'>
                <div className="price-info">
                    <p>Last: ${parseFloat(data.last).toFixed(2)}</p>
                    <p>Bid: ${parseFloat(data.bid).toFixed(2)} ({parseFloat(data.bid_qty).toFixed(4)})</p>
                    <p>Ask: ${parseFloat(data.ask).toFixed(2)} ({parseFloat(data.ask_qty).toFixed(4)})</p>
                </div>
                <div className="market-info">
                    <p>Volume: {parseFloat(data.volume).toFixed(2)}</p>
                    <p>Low: ${parseFloat(data.low).toFixed(2)}</p>
                    <p>High: ${parseFloat(data.high).toFixed(2)}</p>
                </div>
            </div>
            <div className="chart-container" style={{ height: '200px' }}>
                <canvas ref={chartRef}></canvas>
            </div>
            {isLoggedIn && <div className='crypto-card-actions'>
                <button className='buy-button' onClick={handleBuy}>Buy</button>
                <input 
                    type="number" 
                    onChange={calculateSum}
                    placeholder='Amount' 
                    id='amount'
                />
                <button className='sell-button' onClick={handleSell}>Sell</button>
                <input 
                    type="number" 
                    id='sum' 
                    placeholder='Sum of transaction' 
                    readOnly
                />
            </div>}
        </div>
    );
}
