import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import "../../assets/styles/livraisons.css";
import { useNavigate } from "react-router-dom";

const STATUTS = ["Créé", "Prise en charge", "En route", "Livrée", "Annulée"];

export default function Deliveries() {

    const navigate = useNavigate();

    const [deliveries, setDeliveries] = useState([]);
    const [livreurs, setLivreurs] = useState([]);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilter] = useState("all");
    const [filterDate, setFilterDate] = useState("");
    const [filterLivreur, setFilterLivreur] = useState("all");

    // ── Statut modal ──
    const [statutModal, setStatutModal] = useState(null); // { client_id, date_livraison, statut }
    const [newStatut, setNewStatut] = useState("");
    const [savingStatut, setSavingStatut] = useState(false);
    const [statutMsg, setStatutMsg] = useState({ type: "", text: "" });

    useEffect(() => {
        fetchDeliveries();
        fetchLivreurs();
    }, []);

    const filtered = deliveries.filter(d => {
        const matchStatus = filterStatus === "all" || d.statut === filterStatus;
        const q = search.toLowerCase();
        const matchSearch =
            !q ||
            Object.values(d)
                .filter(v => v !== null && v !== undefined)
                .some(v => v.toString().toLowerCase().includes(q));

        const matchDate = !filterDate || d.date_livraison?.startsWith(filterDate);
        const matchLivreur = filterLivreur === "all" || d.livreur_id == filterLivreur;

        return matchStatus && matchSearch && matchDate && matchLivreur;
    });

    const fetchDeliveries = async () => {
        try {
            const res = await fetch("http://localhost/delivery/public/livraisons");
            const responseData = await res.json();
            const dataArray = responseData.data || [];
            setDeliveries(Array.isArray(dataArray) ? dataArray : []);
        } catch (err) { console.error(err); }
    };

    const fetchLivreurs = async () => {
        try {
            const res = await fetch("http://localhost/delivery/public/users?role=livreur", { credentials: "include" });
            const responseData = await res.json();
            const dataArray = responseData.data || responseData;
            setLivreurs(Array.isArray(dataArray) ? dataArray : []);
        } catch (err) { console.error(err); }
    };

    const deleteDelivery = async (client_id, date_livraison) => {
        if (!window.confirm("Supprimer cette livraison ?")) return;
        try {
            const res = await fetch(
                `http://localhost/delivery/public/livraisons?client_id=${client_id}&date_livraison=${date_livraison}`,
                { method: "DELETE" }
            );
            if (!res.ok) { alert("Erreur suppression"); return; }
            setDeliveries(prev =>
                prev.filter(d => !(d.client_id === client_id && d.date_livraison === date_livraison))
            );
        } catch (err) { console.error(err); }
    };

    // ── Ouvrir la modal statut ──
    const openStatutModal = (d) => {
        setStatutModal({ client_id: d.client_id, date_livraison: d.date_livraison, statut: d.statut });
        setNewStatut(d.statut);
        setStatutMsg({ type: "", text: "" });
    };

    const closeStatutModal = () => {
        setStatutModal(null);
        setNewStatut("");
        setStatutMsg({ type: "", text: "" });
    };

    // ── Envoyer le nouveau statut à l'API ──
    const handleStatutSubmit = async () => {
        if (!newStatut || newStatut === statutModal.statut) {
            setStatutMsg({ type: "error", text: "Veuillez choisir un statut différent." });
            return;
        }

        setSavingStatut(true);
        setStatutMsg({ type: "", text: "" });

        try {
            const res = await fetch("http://localhost/delivery/public/livraisons", {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    client_id: statutModal.client_id,
                    date_livraison: statutModal.date_livraison,
                    statut: newStatut
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setStatutMsg({ type: "error", text: data.error || "Erreur lors de la mise à jour." });
                return;
            }

            // 🔥 MAJ locale sans refetch
            setDeliveries(prev =>
                prev.map(d =>
                    d.client_id === statutModal.client_id &&
                        d.date_livraison === statutModal.date_livraison
                        ? { ...d, statut: newStatut }
                        : d
                )
            );

            setStatutMsg({ type: "success", text: "Statut mis à jour avec succès !" });

            setTimeout(() => closeStatutModal(), 1000);

        } catch (err) {
            console.error(err);
            setStatutMsg({ type: "error", text: "Erreur serveur." });
        } finally {
            setSavingStatut(false);
        }
    };

    const getInitials = (name) => name?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || "?";
    const formatStatut = (statut) => statut ? statut.replaceAll(" ", "_") : "inconnu";

    return (
        <div className="deliveries-page">
            <Navbar />

            <div className="deliveries-content">
                <Sidebar />

                <div className="deliveries-body">

                    {/* HEADER */}
                    <div className="deliveries-header">
                        <h1 className="deliveries-title">Liste des Livraisons</h1>
                    </div>

                    {/* STATS */}
                    <div className="deliveries-stats">
                        {STATUTS.map(status => (
                            <div className="stat-card" key={status}>
                                <span className="stat-label">{status}</span>
                                <span className="stat-count">
                                    {deliveries.filter(d => d.statut === status).length}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* FILTERS */}
                    <div className="deliveries-filters">
                        <div className="deliveries-search-wrap">
                            <input
                                className="deliveries-search"
                                placeholder="Rechercher..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="deliveries-date-filter">
                            <input
                                type="date"
                                className="deliveries-date-input"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                            />
                        </div>
                        <div className="deliveries-livreur-filter">
                            <select
                                className="deliveries-livreur-select"
                                value={filterLivreur}
                                onChange={(e) => setFilterLivreur(e.target.value)}
                            >
                                <option value="all">Tous les livreurs</option>
                                {livreurs.map(l => (
                                    <option key={l.id} value={l.id}>{l.nom}</option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-tabs">
                            <button
                                className={`filter-tab ${filterStatus === "all" ? "active" : ""}`}
                                onClick={() => setFilter("all")}
                            >
                                Tous
                            </button>
                            {STATUTS.map(status => (
                                <button
                                    key={status}
                                    className={`filter-tab ${filterStatus === status ? "active" : ""}`}
                                    onClick={() => setFilter(status)}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="deliveries-table-wrapper">
                        <table className="deliveries-table">
                            <thead>
                                <tr>
                                    <th>Statut</th>
                                    <th>Client</th>
                                    <th>Email client</th>
                                    <th>Livreur</th>
                                    <th>Email livreur</th>
                                    <th>Départ</th>
                                    <th>Arrivée</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length > 0 ? (
                                    filtered.map(d => (
                                        <tr key={`${d.client_id}-${d.date_livraison}`}>
                                            <td>
                                                <span className={`delivery-status delivery-status--${formatStatut(d.statut)}`}>
                                                    {d.statut || "Non défini"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="delivery-info">
                                                    <div className="delivery-avatar">{getInitials(d.client_nom)}</div>
                                                    {d.client_nom}
                                                </div>
                                            </td>
                                            <td className="delivery-email">{d.client_email}</td>
                                            <td>
                                                <div className="delivery-info">
                                                    <div className="delivery-avatar">{getInitials(d.livreur_nom)}</div>
                                                    {d.livreur_nom}
                                                </div>
                                            </td>
                                            <td className="delivery-email">{d.livreur_email}</td>
                                            <td className="delivery-address">{d.adresse_depart}</td>
                                            <td className="delivery-address">{d.adresse_arrivee}</td>
                                            <td>
                                                <div className="delivery-actions">

                                                    {/* ── BOUTON STATUT ── */}
                                                    <button
                                                        className="btn btn-statut"
                                                        onClick={() => openStatutModal(d)}
                                                    >
                                                        🔄 Statut
                                                    </button>

                                                    <button
                                                        className="btn btn-edit"
                                                        onClick={() =>
                                                            navigate(`/livraisons/editlivraison/${d.client_id}/${encodeURIComponent(d.date_livraison)}`)
                                                        }
                                                    >
                                                        Attribuer un livreur
                                                    </button>

                                                    <button
                                                        className="btn btn-delete"
                                                        onClick={() => deleteDelivery(d.client_id, d.date_livraison)}
                                                    >
                                                        Supprimer
                                                    </button>

                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="deliveries-empty">
                                            Aucune livraison trouvée
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <p className="deliveries-footer">
                        {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
                    </p>

                </div>
            </div>

            {/* ══════════════════════════════════
                MODAL CHANGEMENT DE STATUT
            ══════════════════════════════════ */}
            {statutModal && (
                <div className="statut-overlay" onClick={closeStatutModal}>
                    <div className="statut-modal" onClick={e => e.stopPropagation()}>

                        {/* Header modal */}
                        <div className="statut-modal-header">
                            {/* <div className="statut-modal-icon">🔄</div> */}
                            <img src="/modifier_statut" className="statut-modal-icon" alt="" />
                            <div>
                                <p className="statut-modal-title">Modifier le statut</p>
                                <p className="statut-modal-sub">
                                    Client #{statutModal.client_id} · {statutModal.date_livraison}
                                </p>
                            </div>
                            <button className="statut-close-btn" onClick={closeStatutModal}>✕</button>
                        </div>

                        {/* Statut actuel */}
                        <div className="statut-current">
                            <span className="statut-current-label">Statut actuel</span>
                            <span className={`delivery-status delivery-status--${formatStatut(statutModal.statut)}`}>
                                {statutModal.statut}
                            </span>
                        </div>

                        {/* Choix du nouveau statut */}
                        <div className="statut-choices">
                            {STATUTS.map(s => (
                                <button
                                    key={s}
                                    className={`statut-choice-btn statut-choice--${formatStatut(s)} ${newStatut === s ? "selected" : ""}`}
                                    onClick={() => setNewStatut(s)}
                                >
                                    {newStatut === s && <span className="statut-check">✔</span>}
                                    {s}
                                </button>
                            ))}
                        </div>

                        {/* Message feedback */}
                        {statutMsg.text && (
                            <div className={`statut-msg statut-msg--${statutMsg.type}`}>
                                {statutMsg.text}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="statut-modal-actions">
                            <button
                                className="statut-btn-cancel"
                                onClick={closeStatutModal}
                                disabled={savingStatut}
                            >
                                Annuler
                            </button>
                            <button
                                className="statut-btn-confirm"
                                onClick={handleStatutSubmit}
                                disabled={savingStatut}
                            >
                                {savingStatut ? (
                                    <><span className="statut-spinner" /> Enregistrement...</>
                                ) : (
                                    <>✔ Confirmer</>
                                )}
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}