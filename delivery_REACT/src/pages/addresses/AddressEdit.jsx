import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import "../../assets/styles/editadress.css";

const VILLES_MAROC = [
    "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir",
    "Meknès", "Oujda", "Kénitra", "Tétouan", "Safi", "El Jadida",
    "Béni Mellal", "Nador", "Settat", "Berrechid", "Khouribga",
    "Taza", "Larache", "Khémisset", "Guelmim", "Essaouira",
    "Dakhla", "Laâyoune", "Ifrane", "Chefchaouen", "Ouarzazate",
    "Errachidia", "Tiznit", "Al Hoceïma"
];

export default function AddressEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ adresse: "", ville: "" });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [villeInput, setVilleInput] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => { fetchAddress(); }, [id]);

    const fetchAddress = async () => {
        try {
            const res = await fetch(
                `http://localhost/delivery/public/addresses?id=${id}`,
                { credentials: "include" }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Erreur chargement adresse");
            setFormData({ adresse: data.adresse || "", ville: data.ville || "" });
            setVilleInput(data.ville || "");
        } catch (err) {
            console.error(err);
            setMessage({ type: "error", text: "Erreur lors du chargement de l'adresse" });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleVilleChange = (e) => {
        const value = e.target.value;
        setVilleInput(value);
        setFormData({ ...formData, ville: value });
        setShowSuggestions(true);
    };

    const handleVilleSelect = (ville) => {
        setVilleInput(ville);
        setFormData({ ...formData, ville });
        setShowSuggestions(false);
    };

    const filteredVilles = VILLES_MAROC.filter((v) =>
        v.toLowerCase().includes(villeInput.toLowerCase())
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.adresse || !formData.ville) {
            setMessage({ type: "error", text: "Veuillez remplir tous les champs" });
            return;
        }
        if (!window.confirm("Voulez-vous vraiment modifier cette adresse ?")) return;

        setSaving(true);
        setMessage({ type: "", text: "" });

        try {
            const res = await fetch("http://localhost/delivery/public/addresses", {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ id, adresse: formData.adresse, ville: formData.ville })
            });
            const data = await res.json();
            if (!res.ok) {
                setMessage({ type: "error", text: data.error || "Erreur modification" });
                return;
            }
            setMessage({ type: "success", text: "Adresse modifiée avec succès" });
            setTimeout(() => navigate("/addresses"), 1200);
        } catch (err) {
            console.error(err);
            setMessage({ type: "error", text: "Erreur serveur" });
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
                    <div className="page-body"><p>Chargement...</p></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <Sidebar />
            <div className="content">
                <Navbar />
                <div className="page-body edit-adresse-page">

                    <div className="edit-adresse-header">
                        <h2 className="edit-adresse-title">Modifier adresse</h2>
                    </div>

                    <div className="edit-adresse-card">

                        <div className="edit-adresse-card-header">
                            <div className="edit-adresse-icon">📍</div>
                            <div>
                                <p className="edit-adresse-card-title">Modification de l'adresse</p>
                                <p className="edit-adresse-card-sub">
                                    Vous pouvez mettre à jour les informations de l'adresse.
                                </p>
                            </div>
                        </div>

                        {message.text && (
                            <div className={`edit-adresse-message ${message.type}`}>
                                {message.text}
                            </div>
                        )}

                        <form className="edit-adresse-form" onSubmit={handleSubmit}>
                            <div className="edit-adresse-row">

                                <div className="edit-adresse-group">
                                    <label className="edit-adresse-label">Adresse</label>
                                    <input
                                        type="text"
                                        name="adresse"
                                        className="edit-adresse-input"
                                        value={formData.adresse}
                                        onChange={handleChange}
                                        placeholder="Ex : 12 Rue Hassan II"
                                    />
                                </div>

                                <div className="edit-adresse-group" style={{ position: "relative" }}>
                                    <label className="edit-adresse-label">Ville</label>
                                    <input
                                        type="text"
                                        name="ville"
                                        className="edit-adresse-input"
                                        value={villeInput}
                                        onChange={handleVilleChange}
                                        onFocus={() => setShowSuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                                        placeholder="Ex : Casablanca"
                                        autoComplete="off"
                                    />
                                    {showSuggestions && filteredVilles.length > 0 && (
                                        <ul className="edit-adresse-suggestions">
                                            {filteredVilles.map((ville) => (
                                                <li
                                                    key={ville}
                                                    className="edit-adresse-suggestion-item"
                                                    onMouseDown={() => handleVilleSelect(ville)}
                                                >
                                                    {ville}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                            </div>

                            <div className="edit-adresse-actions">
                                <button
                                    type="button"
                                    className="edit-adresse-btn-annuler"
                                    onClick={() => navigate("/addresses")}
                                    disabled={saving}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="edit-adresse-btn-submit"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <span className="edit-adresse-spinner" />
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