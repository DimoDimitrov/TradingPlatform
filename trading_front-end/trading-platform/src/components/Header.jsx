import { Link } from 'react-router-dom';

export default function Header({isLoggedIn, setIsLoggedIn, user, setUser}) {

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
