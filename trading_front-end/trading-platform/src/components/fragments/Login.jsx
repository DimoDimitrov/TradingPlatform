export default function Login() {
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
                <input name="email" type="email" placeholder="Email" />
                <input name="password" type="password" placeholder="Password" />
                <button type="submit">Login</button>
            </form>
        </>
    )
}
