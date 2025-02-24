import { useState, useEffect } from 'react';

export default function Profile({isLoggedIn, setIsLoggedIn, user, setUser}) {
    const [assets, setAssets] = useState([]);
    const [error, setError] = useState(null);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                // Replace 'test@example.com' with actual user email from your auth system
                const response = await fetch('http://localhost:8080/assets/john@example.com');
                if (!response.ok) {
                    throw new Error('Failed to fetch assets');
                }
                const data = await response.json();
                setAssets(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchAssets();
    }, []);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch('http://localhost:8080/transactions/john@example.com');
                if (!response.ok) {
                    throw new Error('Failed to fetch transactions');
                }
                const data = await response.json();
                setTransactions(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchTransactions();
    }, []);

    return (
        <div>
            <h1>Profile</h1> {isLoggedIn && <h1>User logged in</h1>}
            {error && <p style={{color: 'red'}}>{error}</p>}
            <h2>My Assets</h2>
            <ul>
                {assets.map(asset => (
                    <li key={asset.id}>
                        {asset.sign}: {asset.quantity} units (Bought at: ${asset.bought_at})
                    </li>
                ))}
            </ul>
            <h2>My Transactions</h2>
            <ul>
                {transactions.map(transaction => (
                    <li key={transaction.id}>
                        {transaction.sign}: {transaction.quantity} units (Bought at: ${transaction.bought_at})
                    </li>
                ))}
            </ul>
        </div>
    );
}
