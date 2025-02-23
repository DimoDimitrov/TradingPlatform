export default function Register() {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formEl = e.currentTarget;
        const formData = new FormData(formEl);
        const formDataObject = Object.fromEntries(formData);
        console.log(formDataObject);
        formEl.reset();
    }
    return (
        <>
            <form onSubmit={handleSubmit} action="submit" className="log-reg-form">
                <input name="username" type="text" placeholder="Username" required />
                <input name="names" type="text" placeholder="Names" required />
                <input name="email" type="email" placeholder="Email" required />
                <input name="password" type="password" placeholder="Password" required />
                <input name="confirmPassword" type="password" placeholder="Confirm Password" required />
                <button type="submit">Register</button>
            </form>
        </>
    )
}
