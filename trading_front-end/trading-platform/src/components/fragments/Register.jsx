import { useState } from 'react';

export default function Register({ setIsLoggedIn, setUser }) {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const formEl = e.currentTarget;
        const formData = new FormData(formEl);
        const formDataObject = Object.fromEntries(formData);
        
        try {
            if (formDataObject.password !== formDataObject.confirmPassword) {
                setError("Passwords don't match");
                return;
            }

            const response = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formDataObject.username,
                    name: formDataObject.names,
                    email: formDataObject.email,
                    password: formDataObject.password,
                    funds: 1000.00
                }),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                setError('Registration failed');
                return;
            }

            setSuccess('Registration successful!');
            setIsLoggedIn(true);
            setUser(data);
            formEl.reset(); 
        } catch (error) {
            setError('Registration failed');
        }
    }

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} action="submit" className="log-reg-form">
                <input name="username" type="text" placeholder="Username" required />
                <input name="names" type="text" placeholder="Names" required />
                <input name="email" type="email" placeholder="Email" required />
                <input name="password" type="password" placeholder="Password" required />
                <input name="confirmPassword" type="password" placeholder="Confirm Password" required />
                <button type="submit">Register</button>
                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success}</div>}
            </form>
        </div>
    );
}
