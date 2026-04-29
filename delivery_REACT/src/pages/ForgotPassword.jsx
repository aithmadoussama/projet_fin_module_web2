import '../assets/styles/forgotPassword.css';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost/delivery/public/users", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Adresse email introuvable");
                setLoading(false);
                return;
            }

            setSuccess(true);

            setTimeout(() => {
                navigate("/login/resetpassword");
            }, 5000);

        } catch (err) {
            console.error(err);
            setError("Erreur serveur");
        }

        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-card">

                {/* Icône */}
                <div className="login-logo">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                </div>

                <h2>Mot de passe oublié</h2>
                <p className="login-subtitle">
                    Entrez votre email pour recevoir un code de vérification
                </p>

                {!success ? (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Adresse email</label>
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-login" disabled={loading}>
                            {loading ? (
                                <><span className="spinner"></span> Envoi en cours...</>
                            ) : "Envoyer le code"}
                        </button>
                    </form>
                ) : (
                    <div className="success-box">
                        <div className="success-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#0F6E56"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                        </div>
                        <p className="success-title">Email envoyé !</p>
                        <p className="success-text">
                            Un code de vérification a été envoyé à <strong>{email}</strong>.
                            Vérifiez votre boîte mail.
                        </p>
                    </div>
                )}

                {error && <div className="login-error">{error}</div>}

                <p className="forgot-password">
                    <span
                        onClick={() => navigate("/login")}
                        className="back-link"
                    >
                        ← Retour à la connexion
                    </span>
                </p>
            </div>
        </div>
    );
}