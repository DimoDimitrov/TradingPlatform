import { useState, useEffect } from 'react';

export default function Profile({isLoggedIn, setIsLoggedIn, user, setUser, assets, setAssets, transactions, setTransactions}) {
    const [error, setError] = useState(null);

    const resetAssets = async () => {
        if (!user || !user.email) {
            console.error('No user logged in');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/assets/${user.email}/all`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to reset assets');
            }

            setAssets([]);
            setUser({...user, funds: 1000});
        } catch (err) {
            console.error('Reset assets error:', err);
            setError(err.message);
        }
    };

    return (
        <div className='profile-container'>
            {error ? <p style={{color: 'red'}}>{error}</p> :    
            <>
            <div className='profile-header'>
                <h2>User Details</h2>
                <p>Username: {user && user.username}</p>
                <p>Name: {user && user.name}</p>
                <p>Email: {user && user.email}</p>
                <p>Funds: ${user && user.funds}</p>
            </div>
            <div className='profile-assets'>
                <h2>My Assets</h2>
                {assets.length > 0 && <button onClick={resetAssets}>Reset</button>}
                <ul>
                {assets.map(asset => (
                    <li key={asset.id}>
                        {asset.sign}: {asset.quantity} units (Bought at: ${asset.bought_at})
                    </li>
                ))}
                </ul>
            </div>
            <div className='profile-transactions'>
                <h2>My Transactions</h2>
                <ul>
                {transactions.map(transaction => (
                    <li key={transaction.id}>
                        {transaction.sign}: {transaction.quantity} units (Bought at: ${transaction.bought_at})
                    </li>
                ))}
                </ul>
            </div>
            </>
            }
        </div>
    );
}
