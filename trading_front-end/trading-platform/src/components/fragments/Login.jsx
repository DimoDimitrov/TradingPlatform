export default function Login() {
    return (
        <>
            <form action="submit" className="log-reg-form">
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <button type="submit">Login</button>
            </form>
        </>
    )
}
