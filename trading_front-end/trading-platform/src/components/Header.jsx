export default function Header({isLoggedIn}) {
    return (
        <div className="header">
            <svg width="400" height="100" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
            <text x="20" y="60" font-family="Arial, sans-serif" font-size="40" fill="#e3ecef" font-weight="bold">BG</text>
            <text x="90" y="60" font-family="Arial, sans-serif" font-size="40" fill="#01a7e1">TRADING</text>
            </svg>
            <div className="header-links">
                <a href="\">Dashboard</a>
                <a href="\profile">Profile</a>
                {!isLoggedIn && <a href="\login">Login</a>}
                {!isLoggedIn && <a href="\register">Register</a>}
            </div>
        </div>
    )
}
