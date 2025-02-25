import { useState, useEffect } from 'react';

export default function Login({isLoggedIn, setIsLoggedIn, user, setUser}) {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formEl = e.currentTarget;
        const formData = new FormData(formEl);
        const formDataObject = Object.fromEntries(formData);
        
        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formDataObject.email,
                    password: formDataObject.password
                }),
                credentials: 'include'
            });

            if (!response.ok) {
                setError(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            formEl.reset();
            setUser(data);
            setIsLoggedIn(true);
            setSuccess('Login successful');
            
        } catch (error) {
            console.error('Login failed:', error);
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} action="submit" className="log-reg-form">
                <input name="email" type="email" placeholder="Email" required />
                <input name="password" type="password" placeholder="Password" required />
                <button type="submit">Login</button>
                {error && <p className="error">{error.message}</p>}
                {success && <p className="success">{success}</p>}
            </form>
        </>
    );
}
