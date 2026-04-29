import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import "../../assets/styles/editlivraison.css";

export default function EditLivraison() {

    // On récupère client_id et date_livraison depuis l'URL
    const { client_id, date_livraison } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        livreur_id: "",
    });

    const [livreurs, setLivreurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState({
        type: "",
        text: ""
    });

    useEffect(() => {
        fetchData();
    }, [client_id, date_livraison]);

    const fetchData = async () => {
        try {
            // 1. Récupérer uniquement les livreurs
            const resLivreurs = await fetch(`http://localhost/delivery/public/users?role=livreur`, { credentials: "include" });
            const dataLivreurs = await resLivreurs.json();
            
            const livreursArray = dataLivreurs.data || dataLivreurs;
            setLivreurs(Array.isArray(livreursArray) ? livreursArray : []);

            // 2. (Optionnel) Essayer de récupérer la livraison actuelle pour pré-sélectionner le livreur
            const resLivraison = await fetch(`http://localhost/delivery/public/livraisons?client_id=${client_id}`, { credentials: "include" });
            const dataLivraison = await resLivraison.json();
            
            const livraisonsArray = dataLivraison.data || [];
            const currentLivraison = livraisonsArray.find(d => d.date_livraison === decodeURIComponent(date_livraison));

            if (currentLivraison && currentLivraison.livreur_id) {
                setFormData({ livreur_id: currentLivraison.livreur_id });
            }

        } catch (err) {
            console.error(err);
            setMessage({
                type: "error",
                text: "Erreur lors du chargement des données"
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

        if (!formData.livreur_id) {
            setMessage({
                type: "error",
                text: "Veuillez sélectionner un livreur"
            });
            return;
        }

        if (!window.confirm("Voulez-vous vraiment assigner ce livreur ?")) return;

        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            // Envoi des 3 informations requises à l'API en format JSON
            const res = await fetch(`http://localhost/delivery/public/livraisons`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    client_id: client_id,
                    date_livraison: decodeURIComponent(date_livraison),
                    livreur_id: formData.livreur_id
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
                text: "Livreur assigné avec succès"
            });

            setTimeout(() => {
                navigate("/livraisons");
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

                <div className="page-body edit-livraison-page">

                    <div className="page-header">
                        <h2 className="title">Assigner un livreur</h2>
                    </div>

                    <div className="form-card">

                        <div className="form-card-header">
                            <img src="/livraison.png"  alt="" />
                            <div>
                                <p className="form-card-title">Attribution de la livraison</p>
                                <p className="form-card-sub">
                                    Veuillez choisir le livreur en charge de cette course.
                                </p>
                            </div>
                        </div>

                        {message.text && (
                            <div className={`message-box ${message.type}`}>
                                {message.text}
                            </div>
                        )}

                        <form className="form" onSubmit={handleSubmit}>

                            <div className="form-row">
                                <div className="form-group" style={{ width: "100%" }}>
                                    <label className="label">Livreur</label>
                                    <select
                                        name="livreur_id"
                                        className="select"
                                        value={formData.livreur_id}
                                        onChange={handleChange}
                                    >
                                        <option value="">Sélectionner un livreur</option>
                                        {livreurs.map((l) => (
                                            <option key={l.id} value={l.id}>{l.nom}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-actions">

                                <button
                                    type="button"
                                    className="btn-annuler"
                                    onClick={() => navigate("/livraisons")}
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
                                        <>✔ Assigner le livreur</>
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