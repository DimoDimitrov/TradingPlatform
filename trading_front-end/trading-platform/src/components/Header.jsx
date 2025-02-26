import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Header({isLoggedIn, setIsLoggedIn, user, setUser, assets, setAssets, transactions, setTransactions}) {

    useEffect(() => {
        if (user && user.email) {
            fetchAssets();
            fetchTransactions();
        }
    }, [user]);

    const fetchAssets = async () => {
        if (!user || !user.email) return;
        
        try {
            const response = await fetch(`http://localhost:8080/assets/${user.email}`);
            if (!response.ok) {
                throw new Error('Failed to fetch assets');
            }
            const data = await response.json();
            setAssets(data);
        } catch (err) {
            console.log(err.message);
        }
    };

    const fetchTransactions = async () => {
        if (!user || !user.email) return;
        
        try {
            const response = await fetch(`http://localhost:8080/transactions/${user.email}`);
            if (!response.ok) {
                throw new Error('Failed to fetch transactions');
            }
            const data = await response.json();
            setTransactions(data);
        } catch (err) {
            console.log(err.message);
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUser(null);
    };

    return (
        <div className="header">
            <svg width="400" height="100" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
            <text x="20" y="60" fontFamily="Arial, sans-serif" fontSize="40" fill="#e3ecef" fontWeight="bold">BG</text>
            <text x="90" y="60" fontFamily="Arial, sans-serif" fontSize="40" fill="#01a7e1">TRADING</text>
            </svg>
            <div className="header-user">
                {isLoggedIn && <p>{user.name} | {user.funds}</p>}
            </div>
            <div className="header-links">
                <Link to="/">Dashboard</Link>
                <Link to="/profile">Profile</Link>
                {!isLoggedIn ? <Link to="/login">Login</Link> : <Link to="/" onClick={handleLogout}>Logout</Link>}
                {!isLoggedIn && <Link to="/register">Register</Link>}
            </div>
        </div>
    )
}
