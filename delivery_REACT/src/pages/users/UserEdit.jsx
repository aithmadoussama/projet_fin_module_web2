import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import "../../assets/styles/edituser.css";

export default function EditUser() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nom: "",
        email: "",
        role: "client",
        statut: "Actif"
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // zone de message
    const [message, setMessage] = useState({
        type: "",
        text: ""
    });

    useEffect(() => {
        fetchUser();
    }, [id]);

    const fetchUser = async () => {
        try {
            const res = await fetch(`http://localhost/delivery/public/users?id=${id}`, {
                credentials: "include"
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Erreur chargement utilisateur");
            }

            setFormData({
                nom: data.nom || "",
                email: data.email || "",
                role: data.role || "client",
                statut: data.statut || "Actif"
            });

        } catch (err) {
            console.error(err);
            setMessage({
                type: "error",
                text: "Erreur lors du chargement de l'utilisateur"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nom || !formData.email) {
            setMessage({
                type: "error",
                text: "Veuillez remplir tous les champs"
            });
            return;
        }

        if (!window.confirm("Voulez-vous vraiment modifier cet utilisateur ?")) return;

        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            const res = await fetch(`http://localhost/delivery/public/users`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    id: id,
                    nom: formData.nom,
                    email: formData.email,
                    role: formData.role,
                    statut: formData.statut
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage({
                    type: "error",
                    text: data.error || "Erreur lors de la modification"
                });
                return;
            }

            setMessage({
                type: "success",
                text: "Utilisateur modifié avec succès"
            });

            setTimeout(() => {
                navigate("/users");
            }, 1200);

        } catch (err) {
            console.error(err);
            setMessage({
                type: "error",
                text: "Erreur serveur"
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container">
                <Sidebar />
                <div className="content">
                    <Navbar />
                    <div className="page-body">
                        <p>Chargement...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <Sidebar />

            <div className="content">
                <Navbar />

                <div className="page-body add-user-page">

                    <div className="page-header">
                        <h2 className="title">Modifier utilisateur</h2>
                    </div>

                    <div className="form-card">

                        <div className="form-card-header">
                            <img src="/modifier_utilisateur.png"  alt="" />
                            <div>
                                <p className="form-card-title">Modification du compte</p>
                                <p className="form-card-sub">
                                    Vous pouvez mettre à jour les informations de l'utilisateur.
                                </p>
                            </div>
                        </div>

                        {/* MESSAGE ZONE */}
                        {message.text && (
                            <div className={`message-box ${message.type}`}>
                                {message.text}
                            </div>
                        )}

                        <form className="form" onSubmit={handleSubmit}>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="label">Nom complet</label>
                                    <input
                                        type="text"
                                        name="nom"
                                        className="input"
                                        value={formData.nom}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="label">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="input"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

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
                                    <option value="Actif">Actif</option>
                                    <option value="Bloqué">Bloqué</option>
                                </select>
                            </div>

                            <div className="form-actions">

                                <button
                                    type="button"
                                    className="btn-annuler"
                                    onClick={() => navigate("/users")}
                                    disabled={saving}
                                >
                                    Annuler
                                </button>

                                <button
                                    type="submit"
                                    className="btn-submit"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <span className="spinner" />
                                            Modification...
                                        </>
                                    ) : (
                                        <>✔ Modifier</>
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