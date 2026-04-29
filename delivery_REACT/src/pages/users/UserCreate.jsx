import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import "../../assets/styles/adduser.css";
import { useNavigate } from "react-router-dom";

export default function UserCreate() {

    const navigate = useNavigate();
    const [sending, setSending] = useState(false);

    const [formData, setFormData] = useState({
        nom: "",
        email: "",
        role: "livreur"
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);

        try {
            const response = await fetch("http://localhost/delivery/public/users", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error);
                setSending(false);
                return;
            }

            alert("Utilisateur créé. Un email de configuration a été envoyé.");

            setFormData({
                nom: "",
                email: "",
                role: "livreur",
                statut: "Actif" 
            }); navigate("/users");

        } catch (err) {
            console.error(err);
            alert("Erreur serveur");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="container">
            <Sidebar />

            <div className="content">
                <Navbar />

                <div className="page-body add-user-page">

                    {/* HEADER */}
                    <div className="page-header">
                        <h2 className="title">Ajouter un utilisateur</h2>
                    </div>

                    {/* CARD */}
                    <div className="form-card">

                        <div className="form-card-header">
                            <div className="form-icon">👤</div>
                            <div>
                                <p className="form-card-title">Nouveau compte</p>
                                <p className="form-card-sub">
                                    L'utilisateur recevra un email pour définir son mot de passe.
                                </p>
                            </div>
                        </div>

                        <form className="form" onSubmit={handleSubmit}>

                            {/* NOM + EMAIL */}
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="label">Nom complet</label>
                                    <input
                                        type="text"
                                        name="nom"
                                        className="input"
                                        placeholder="Ex : Amine Karimi"
                                        value={formData.nom}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="label">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="input"
                                        placeholder="Ex : amine@campus.ma"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* ROLE */}
                            <div className="form-group">
                                <label className="label">Rôle</label>
                                <select
                                    name="role"
                                    className="select"
                                    value={formData.role}
                                    onChange={handleChange}
                                >
                                    <option value="livreur">Livreur</option>
                                    <option value="admin">Admin</option>
                                    <option value="client">Client</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="label">Statut</label>
                                <select
                                    name="statut"
                                    className="select"
                                    value={formData.statut}
                                    onChange={handleChange}
                                >
                                    <option value="Bloqué">Bloqué</option>
                                    <option value="Actif">Actif</option>
                                </select>
                            </div>

                            {/* NOTICE EMAIL */}
                            <div className="email-notice">
                                <span className="email-notice-icon">✉</span>
                                <span>
                                    Un email sera envoyé à{" "}
                                    <strong>{formData.email || "l'adresse saisie"}</strong>{" "}
                                    pour définir le mot de passe.
                                </span>
                            </div>

                            {/* ACTIONS */}
                            <div className="form-actions">

                                <button
                                    type="button"
                                    className="btn-annuler"
                                    onClick={() => navigate("/users")}
                                    disabled={sending}
                                >
                                    Annuler
                                </button>

                                <button
                                    type="submit"
                                    className="btn-submit"
                                    disabled={sending}
                                >
                                    {sending ? (
                                        <>
                                            <span className="spinner" />
                                            Création en cours…
                                        </>
                                    ) : (
                                        <>✚ Créer</>
                                    )}
                                </button>
                                

                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}