import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../assets/styles/dashboard.css";
import { useNavigate } from "react-router-dom";
import {
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

const STATUT_COLORS = {
    "Créé": "#dbeafe",
    "Prise en charge": "#e0e0d8",
    "En route": "#fef3c7",
    "Livrée": "#d1fae5",
    "Annulée": "#fee2e2",
};

const STATUT_TEXT = {
    "Créé": "#1e40af",
    "Prise en charge": "#78716c",
    "En route": "#92400e",
    "Livrée": "#065f46",
    "Annulée": "#991b1b",
};

const STATUTS = ["Créé", "Prise en charge", "En route", "Livrée", "Annulée"];
const ROLE_COLORS = ["#7F77DD", "#534AB7", "#AFA9EC"];
const STATUS_COLORS = ["#d1fae5", "#fee2e2"];
const STATUS_TEXT = ["#065f46", "#991b1b"];

export default function Dashboard() {

    const navigate = useNavigate();

    const [livraisonsStats, setLivraisonsStats] = useState([]);
    const [usersStatusStats, setUsersStatusStats] = useState([]);
    const [usersRoleStats, setUsersRoleStats] = useState([]);
    const [todayLivraisons, setTodayLivraisons] = useState([]);
    const [loading, setLoading] = useState(true);

    // ── Statut modal ──
    const [statutModal, setStatutModal] = useState(null);
    const [newStatut, setNewStatut] = useState("");
    const [savingStatut, setSavingStatut] = useState(false);
    const [statutMsg, setStatutMsg] = useState({ type: "", text: "" });

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        try {
            const [resLivraisons, resUsers] = await Promise.all([
                fetch("http://localhost/delivery/public/livraisons", { credentials: "include" }),
                fetch("http://localhost/delivery/public/users", { credentials: "include" }),
            ]);

            const livraisonsResponse = await resLivraisons.json();
            const users = await resUsers.json();
            const livraisons = livraisonsResponse.data || [];

            // ── Stats statuts livraisons ──
            const statutMap = {};
            (Array.isArray(livraisons) ? livraisons : []).forEach(l => {
                statutMap[l.statut] = (statutMap[l.statut] || 0) + 1;
            });
            setLivraisonsStats(Object.entries(statutMap).map(([name, value]) => ({ name, value })));

            // ── Livraisons du jour ──
            const today = new Date().toISOString().split("T")[0];
            setTodayLivraisons(
                (Array.isArray(livraisons) ? livraisons : []).filter(l => l.date_livraison === today)
            );

            // ── Stats utilisateurs statut ──
            const actif = (Array.isArray(users) ? users : []).filter(u => u.statut === "Actif").length;
            const bloque = (Array.isArray(users) ? users : []).filter(u => u.statut === "Bloqué").length;
            setUsersStatusStats([
                { name: "Actif", value: actif },
                { name: "Bloqué", value: bloque },
            ]);

            // ── Stats utilisateurs rôle ──
            const roleMap = {};
            (Array.isArray(users) ? users : []).forEach(u => {
                roleMap[u.role] = (roleMap[u.role] || 0) + 1;
            });
            setUsersRoleStats(Object.entries(roleMap).map(([name, value]) => ({ name, value })));

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ── Supprimer une livraison ──
    const deleteDelivery = async (client_id, date_livraison) => {
        if (!window.confirm("Supprimer cette livraison ?")) return;
        try {
            const res = await fetch(
                `http://localhost/delivery/public/livraisons?client_id=${client_id}&date_livraison=${date_livraison}`,
                { method: "DELETE", credentials: "include" }
            );
            if (!res.ok) { alert("Erreur suppression"); return; }
            setTodayLivraisons(prev =>
                prev.filter(d => !(d.client_id === client_id && d.date_livraison === date_livraison))
            );
        } catch (err) { console.error(err); }
    };

    // ── Ouvrir modal statut ──
    const openStatutModal = (l) => {
        setStatutModal({ client_id: l.client_id, date_livraison: l.date_livraison, statut: l.statut });
        setNewStatut(l.statut);
        setStatutMsg({ type: "", text: "" });
    };

    const closeStatutModal = () => {
        setStatutModal(null);
        setNewStatut("");
        setStatutMsg({ type: "", text: "" });
    };

    // ── Soumettre le nouveau statut ──
    const handleStatutSubmit = async () => {
        if (!newStatut || newStatut === statutModal.statut) {
            setStatutMsg({ type: "error", text: "Veuillez choisir un statut différent." });
            return;
        }
        setSavingStatut(true);
        setStatutMsg({ type: "", text: "" });
        try {
            const res = await fetch("http://localhost/delivery/public/livraisons/statut", {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
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
            setTodayLivraisons(prev =>
                prev.map(d =>
                    d.client_id === statutModal.client_id && d.date_livraison === statutModal.date_livraison
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

    const statusKey = (s) => s?.replace(/\s/g, "_");
    const getInitials = (name) =>
        name?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || "?";
    const formatStatut = (s) => s?.replaceAll(" ", "_") || "inconnu";

    if (loading) {
        return (
            <div className="dashboard-page">
                <Sidebar />
                <div className="dashboard-content">
                    <Navbar />
                    <div className="dashboard-body">
                        <div className="dashboard-loading">
                            <div className="dashboard-spinner" />
                            Chargement du tableau de bord...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <Sidebar />

            <div className="dashboard-content">
                <Navbar />

                <div className="dashboard-body">

                    {/* ── HEADER ── */}
                    <div className="dashboard-header">
                        <h2 className="dashboard-title">Tableau de bord</h2>
                        <span className="dashboard-date">
                            {new Date().toLocaleDateString("fr-FR", {
                                weekday: "long", day: "numeric",
                                month: "long", year: "numeric"
                            })}
                        </span>
                    </div>

                    {/* ── KPI CARDS ── */}
                    <div className="dashboard-kpis">

                        <div className="kpi-card">
                            <img className="kpi-icon" src="/livraison.png" alt="" />
                            <div>
                                <p className="kpi-label">Total livraisons</p>
                                <p className="kpi-value">
                                    {livraisonsStats.reduce((s, i) => s + i.value, 0)}
                                </p>
                            </div>
                        </div>

                        <div className="kpi-card">
                            <img className="kpi-icon" src="/livree.png" alt="" />
                            <div>
                                <p className="kpi-label">Livrées</p>
                                <p className="kpi-value kpi-green">
                                    {livraisonsStats.find(s => s.name === "Livrée")?.value || 0}
                                </p>
                            </div>
                        </div>

                        <div className="kpi-card">
                            <img className="kpi-icon" src="/utilisateurs_actifs.png" alt="" />
                            <div>
                                <p className="kpi-label">Utilisateurs actifs</p>
                                <p className="kpi-value kpi-purple">
                                    {usersStatusStats.find(s => s.name === "Actif")?.value || 0}
                                </p>
                            </div>
                        </div>

                        <div className="kpi-card">
                            <img className="kpi-icon" src="/livraison_jour.png" alt="" />
                            <div>
                                <p className="kpi-label">Livraisons aujourd'hui</p>
                                <p className="kpi-value kpi-blue">
                                    {todayLivraisons.length}
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* ── CHARTS ROW ── */}
                    <div className="dashboard-charts">

                        {/* Graphe 1 — Statuts livraisons */}
                        <div className="chart-card">
                            <div className="chart-card-header">
                                <img className="kpi-icon" src="/livraison.png" alt="" />
                                <div>
                                    <p className="chart-title">Statuts des livraisons</p>
                                    <p className="chart-sub">Répartition par statut</p>
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height={240}>
                                <PieChart>
                                    <Pie
                                        data={livraisonsStats}
                                        cx="50%" cy="50%"
                                        innerRadius={60} outerRadius={90}
                                        paddingAngle={3} dataKey="value"
                                    >
                                        {livraisonsStats.map((entry, i) => (
                                            <Cell
                                                key={i}
                                                fill={STATUT_COLORS[entry.name] || "#e5e7eb"}
                                                stroke={STATUT_TEXT[entry.name] || "#6b7280"}
                                                strokeWidth={1.5}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "0.82rem" }} />
                                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "0.78rem" }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Graphe 2 — Statut utilisateurs */}
                        <div className="chart-card">
                            <div className="chart-card-header">
                                <img className="kpi-icon" src="/profile.png" alt="" />
                                <div>
                                    <p className="chart-title">Statut des utilisateurs</p>
                                    <p className="chart-sub">Actifs vs Bloqués</p>
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height={240}>
                                <PieChart>
                                    <Pie
                                        data={usersStatusStats}
                                        cx="50%" cy="50%"
                                        innerRadius={60} outerRadius={90}
                                        paddingAngle={3} dataKey="value"
                                    >
                                        {usersStatusStats.map((entry, i) => (
                                            <Cell
                                                key={i}
                                                fill={STATUS_COLORS[i]}
                                                stroke={STATUS_TEXT[i]}
                                                strokeWidth={1.5}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "0.82rem" }} />
                                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "0.78rem" }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Graphe 3 — Rôles utilisateurs */}
                        <div className="chart-card">
                            <div className="chart-card-header">
                                <img className="kpi-icon" src="/role_utilisateur.png" alt="" />
                                <div>
                                    <p className="chart-title">Rôles des utilisateurs</p>
                                    <p className="chart-sub">Admin · Livreur · Client</p>
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height={240}>
                                <BarChart
                                    data={usersRoleStats}
                                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                    barSize={36}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(83,74,183,0.08)" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "0.82rem" }} cursor={{ fill: "rgba(83,74,183,0.05)" }} />
                                    <Bar dataKey="value" name="Utilisateurs" radius={[6, 6, 0, 0]}>
                                        {usersRoleStats.map((_, i) => (
                                            <Cell key={i} fill={ROLE_COLORS[i % ROLE_COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                    </div>

                    {/* ── TODAY TABLE ── */}
                    <div className="chart-card">
                        <div className="chart-card-header">
                            <img className="kpi-icon" src="/livraison_jour.png" alt="" />
                            <div>
                                <p className="chart-title">Livraisons du jour</p>
                                <p className="chart-sub">
                                    {todayLivraisons.length} livraison{todayLivraisons.length !== 1 ? "s" : ""} prévue{todayLivraisons.length !== 1 ? "s" : ""} aujourd'hui
                                </p>
                            </div>
                        </div>

                        <div className="dashboard-table-wrapper">
                            <table className="dashboard-table">
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
                                    {todayLivraisons.length > 0 ? (
                                        todayLivraisons.map((l) => (
                                            <tr key={`${l.client_id}-${l.date_livraison}`}>

                                                <td>
                                                    <span className={`dashboard-badge dashboard-badge--${statusKey(l.statut)}`}>
                                                        {l.statut || "Non défini"}
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="dashboard-delivery-info">
                                                        <div className="dashboard-avatar">{getInitials(l.client_nom)}</div>
                                                        <span className="dashboard-delivery-name">{l.client_nom}</span>
                                                    </div>
                                                </td>

                                                <td className="dashboard-delivery-email">{l.client_email}</td>

                                                <td>
                                                    <div className="dashboard-delivery-info">
                                                        <div className="dashboard-avatar">{getInitials(l.livreur_nom)}</div>
                                                        <span className="dashboard-delivery-name">{l.livreur_nom}</span>
                                                    </div>
                                                </td>

                                                <td className="dashboard-delivery-email">{l.livreur_email}</td>
                                                <td className="dashboard-delivery-address">{l.adresse_depart}</td>
                                                <td className="dashboard-delivery-address">{l.adresse_arrivee}</td>

                                                <td>
                                                    <div className="dashboard-actions">

                                                        {/* ── Modifier statut ── */}
                                                        <button
                                                            className="dashboard-btn dashboard-btn-statut"
                                                            onClick={() => openStatutModal(l)}
                                                        >
                                                            🔄 Statut
                                                        </button>

                                                        {/* ── Attribuer livreur ── */}
                                                        <button
                                                            className="dashboard-btn dashboard-btn-edit"
                                                            onClick={() =>
                                                                navigate(`/livraisons/editlivraison/${l.client_id}/${encodeURIComponent(l.date_livraison)}`)
                                                            }
                                                        >
                                                            Attribuer
                                                        </button>

                                                        {/* ── Supprimer ── */}
                                                        <button
                                                            className="dashboard-btn dashboard-btn-delete"
                                                            onClick={() => deleteDelivery(l.client_id, l.date_livraison)}
                                                        >
                                                            Supprimer
                                                        </button>

                                                    </div>
                                                </td>

                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="dashboard-empty">
                                                😕 Aucune livraison prévue aujourd'hui
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            {/* ══════════════════════════════════
                MODAL CHANGEMENT DE STATUT
            ══════════════════════════════════ */}
            {statutModal && (
                <div className="statut-overlay" onClick={closeStatutModal}>
                    <div className="statut-modal" onClick={e => e.stopPropagation()}>

                        <div className="statut-modal-header">
                            <div className="statut-modal-icon">🔄</div>
                            <div>
                                <p className="statut-modal-title">Modifier le statut</p>
                                <p className="statut-modal-sub">
                                    Client #{statutModal.client_id} · {statutModal.date_livraison}
                                </p>
                            </div>
                            <button className="statut-close-btn" onClick={closeStatutModal}>✕</button>
                        </div>

                        <div className="statut-current">
                            <span className="statut-current-label">Statut actuel</span>
                            <span className={`dashboard-badge dashboard-badge--${formatStatut(statutModal.statut)}`}>
                                {statutModal.statut}
                            </span>
                        </div>

                        <div className="statut-choices">
                            {STATUTS.map(s => (
                                <button
                                    key={s}
                                    className={`statut-choice-btn statut-choice--${formatStatut(s)} ${newStatut === s ? "selected" : ""}`}
                                    onClick={() => setNewStatut(s)}
                                >
                                    {s}
                                    {newStatut === s && <span className="statut-check">✔</span>}
                                </button>
                            ))}
                        </div>

                        {statutMsg.text && (
                            <div className={`statut-msg statut-msg--${statutMsg.type}`}>
                                {statutMsg.text}
                            </div>
                        )}

                        <div className="statut-modal-actions">
                            <button className="statut-btn-cancel" onClick={closeStatutModal} disabled={savingStatut}>
                                Annuler
                            </button>
                            <button className="statut-btn-confirm" onClick={handleStatutSubmit} disabled={savingStatut}>
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