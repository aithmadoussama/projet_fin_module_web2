import '../assets/styles/login.css';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import ProgressCard from '../components/ProgressCard';

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost/delivery/public/users", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    email: form.email,
                    password: form.password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Erreur de connexion");
            }

            localStorage.setItem("user", JSON.stringify(data.user));

            setTimeout(() => {
                navigate("/Dashboard");
            }, 5000);

        } catch (err) {
            console.error(err);
            setError(err.message);
            setLoading(false);
        }

    };

    return (
        <div className="login-container">
            <div className="login-card">

                {/* Logo / Icône */}
                <div className="login-logo">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                    </svg>
                </div>

                <h2>Admin Login</h2>
                <p className="login-subtitle">Connectez-vous à votre espace</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <div className="input-wrap">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                            <input
                                type="email"
                                name="email"
                                placeholder="votre@email.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Mot de passe</label>
                        <div className="input-wrap">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-login" disabled={loading}>
                        {loading ? (
                            <><span className="spinner"></span> Connexion...</>
                        ) : "Login"}
                    </button>
                </form>

                {error && <div className="login-error">{error}</div>}

                <p className="forgot-password">
                    <a href="/login/forgotpassword">Mot de passe oublié ?</a>
                </p>
            </div>
        </div>
    );
}