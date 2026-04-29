import '../assets/styles/resetPassword.css';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        code: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        if (form.password.length < 8) {
            setError("Le mot de passe doit contenir au moins 8 caractères.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("http://localhost/delivery/public/users", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    code: form.code,
                    password: form.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Code invalide ou expiré.");
                setLoading(false);
                return;
            }

            setSuccess(true);

        } catch (err) {
            console.error(err);
            setError("Erreur serveur.");
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
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                </div>

                <h2>Réinitialisation</h2>
                <p className="login-subtitle">
                    Entrez le code reçu par email et votre nouveau mot de passe
                </p>

                {!success ? (
                    <form onSubmit={handleSubmit}>

                        {/* Code de vérification */}
                        <div className="form-group">
                            <label>Code de vérification</label>
                            <div className="input-wrap">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="3" width="20" height="14" rx="2" />
                                    <path d="M8 21h8M12 17v4" />
                                </svg>
                                <input
                                    type="text"
                                    name="code"
                                    placeholder="Ex : 483921"
                                    value={form.code}
                                    onChange={handleChange}
                                    maxLength={8}
                                    required
                                />
                            </div>
                        </div>

                        {/* Nouveau mot de passe */}
                        <div className="form-group">
                            <label>Nouveau mot de passe</label>
                            <div className="input-wrap">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Min. 8 caractères"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {/* Barre de force du mot de passe */}
                            {form.password.length > 0 && (
                                <div className="password-strength">
                                    <div className="strength-bars">
                                        <span className={`bar ${form.password.length >= 1 ? 'active weak' : ''}`}></span>
                                        <span className={`bar ${form.password.length >= 6 ? 'active medium' : ''}`}></span>
                                        <span className={`bar ${form.password.length >= 10 ? 'active strong' : ''}`}></span>
                                    </div>
                                    <span className="strength-label">
                                        {form.password.length < 6 ? 'Faible' :
                                            form.password.length < 10 ? 'Moyen' : 'Fort'}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Confirmation mot de passe */}
                        <div className="form-group">
                            <label>Confirmer le mot de passe</label>
                            <div className={`input-wrap ${form.confirmPassword.length > 0
                                ? form.password === form.confirmPassword
                                    ? 'match' : 'no-match'
                                : ''}`}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 12l2 2 4-4" />
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Répétez le mot de passe"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                                {form.confirmPassword.length > 0 && (
                                    <span className="match-icon">
                                        {form.password === form.confirmPassword ? (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="#1D9E75"
                                                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        ) : (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="#E24B4A"
                                                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        )}
                                    </span>
                                )}
                            </div>
                        </div>

                        <button type="submit" className="btn-login" disabled={loading}>
                            {loading ? (
                                <><span className="spinner"></span> Réinitialisation...</>
                            ) : "Réinitialiser le mot de passe"}
                        </button>

                    </form>
                ) : (
                    <div className="success-box">
                        <div className="success-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="#0F6E56"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <p className="success-title">Mot de passe réinitialisé !</p>
                        <p className="success-text">
                            Votre mot de passe a été mis à jour avec succès.
                        </p>
                        <button
                            className="btn-login"
                            style={{ marginTop: '0.75rem' }}
                            onClick={() => navigate("/login")}
                        >
                            Se connecter
                        </button>
                    </div>
                )}

                {error && <div className="login-error">{error}</div>}

                {!success && (
                    <p className="forgot-password">
                        <span onClick={() => navigate("/login/forgotpassword")} className="back-link">
                            ← Renvoyer le code
                        </span>
                    </p>
                )}

            </div>
        </div>
    );
}