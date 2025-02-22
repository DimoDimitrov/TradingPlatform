
export default function Register() {
    return (
        <>
            <form action="submit" className="log-reg-form">
                <input type="text" placeholder="Username" />
                <input type="text" placeholder="Names" />
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <input type="password" placeholder="Confirm Password" />
                <button type="submit">Register</button>
            </form>
        </>
    )
}
