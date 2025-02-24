export default function Header({isLoggedIn, setIsLoggedIn}) {

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    return (
        <div className="header">
            <svg width="400" height="100" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
            <text x="20" y="60" fontFamily="Arial, sans-serif" fontSize="40" fill="#e3ecef" fontWeight="bold">BG</text>
            <text x="90" y="60" fontFamily="Arial, sans-serif" fontSize="40" fill="#01a7e1">TRADING</text>
            </svg>
            <div className="header-links">
                <a href="\">Dashboard</a>
                <a href="\profile">Profile</a>
                {!isLoggedIn ? <a href="\login">Login</a> : <a href="\logout" onClick={handleLogout}>Logout</a>}
                {!isLoggedIn && <a href="\register">Register</a>}
            </div>
        </div>
    )
}
