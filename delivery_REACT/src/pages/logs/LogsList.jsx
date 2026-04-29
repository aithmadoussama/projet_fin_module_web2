import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import "../../assets/styles/logs.css";

const STATUTS = ["Créé", "Prise en charge", "En route", "Livrée", "Annulée"];

export default function LogsList() {

    const [logs, setLogs] = useState([]);
    const [enrichedLogs, setEnrichedLogs] = useState([]);
    const [usersCache, setUsersCache] = useState({});
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterDate, setFilterDate] = useState("");

    useEffect(() => { fetchLogs(); }, []);

    const fetchLogs = async () => {
        try {
            const res = await fetch("http://localhost/delivery/public/logs", { credentials: "include" });
            const data = await res.json();
            setLogs(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
    };

    const getUser = async (id) => {
        if (usersCache[id]) return usersCache[id];
        try {
            const res = await fetch(`http://localhost/delivery/public/users?id=${id}`, { credentials: "include" });
            const data = await res.json();
            setUsersCache(prev => ({ ...prev, [id]: data }));
            return data;
        } catch { return null; }
    };

    useEffect(() => {
        if (!logs.length) return;
        const load = async () => {
            const result = await Promise.all(
                logs.map(async (log) => {
                    const user = await getUser(log.client_id);
                    return { ...log, client_nom: user?.nom || "Inconnu", client_email: user?.email || "-" };
                })
            );
            setEnrichedLogs(result);
        };
        load();
    }, [logs]);

    const filtered = enrichedLogs.filter(log => {
        const matchStatus = filterStatus === "all" || log.statut === filterStatus;
        const matchDate = !filterDate || log.date_livraison === filterDate;
        const q = search.toLowerCase();
        const matchSearch = !q
            || log.client_nom?.toLowerCase().includes(q)
            || log.client_email?.toLowerCase().includes(q)
            || log.statut?.toLowerCase().includes(q);
        return matchStatus && matchDate && matchSearch;
    });

    const resetFiltres = () => {
        setSearch("");
        setFilterStatus("all");
        setFilterDate("");
    };

    const statusKey = (s) => s.replace(/\s/g, "_");

    return (
        <div className="logs-page">
            <Sidebar />

            <div className="logs-content">
                <Navbar />

                <div className="logs-body">

                    {/* ── HEADER ── */}
                    <div className="logs-header">
                        <h2 className="logs-title">Historique des livraisons</h2>
                    </div>

                    {/* ── FILTERS ── */}
                    <div className="logs-filters">

                        <div className="logs-search-wrap">
                            <span className="logs-search-icon"></span>
                            <input
                                className="logs-search"
                                placeholder="Rechercher un client, email, statut..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="logs-date-input"
                        />

                        {(search || filterStatus !== "all" || filterDate) && (
                            <button className="logs-reset-btn" onClick={resetFiltres}>
                                ↺ Réinitialiser
                            </button>
                        )}

                        <span className="logs-count">
                            {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
                        </span>

                    </div>

                    {/* ── STATUS TABS ── */}
                    <div className="logs-filter-tabs">
                        <button
                            className={`logs-filter-tab ${filterStatus === "all" ? "active" : ""}`}
                            onClick={() => setFilterStatus("all")}
                        >
                            Tous
                        </button>
                        {STATUTS.map(status => (
                            <button
                                key={status}
                                className={`logs-filter-tab ${filterStatus === status ? "active" : ""}`}
                                onClick={() => setFilterStatus(status)}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {/* ── TABLE ── */}
                    <div className="logs-table-wrapper">
                        <table className="logs-table">
                            <thead>
                                <tr>
                                    <th>Client</th>
                                    <th>Email</th>
                                    <th>Date livraison</th>
                                    <th>Statut</th>
                                    <th>Date changement</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length > 0 ? (
                                    filtered.map((log) => (
                                        <tr key={log.id}>
                                            <td>
                                                <div className="logs-client-info">
                                                    <div className="logs-avatar">
                                                        {log.client_nom?.charAt(0) || "?"}
                                                    </div>
                                                    <span className="logs-client-name">{log.client_nom}</span>
                                                </div>
                                            </td>
                                            <td className="logs-client-email">{log.client_email}</td>
                                            <td>{log.date_livraison}</td>
                                            <td>
                                                <span className={`logs-status logs-status--${statusKey(log.statut)}`}>
                                                    {log.statut}
                                                </span>
                                            </td>
                                            <td>{log.date_changement}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="logs-empty">
                                            😕 Aucun log trouvé
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="logs-footer">
                        {filtered.length} entrée{filtered.length !== 1 ? "s" : ""} affichée{filtered.length !== 1 ? "s" : ""}
                    </div>

                </div>
            </div>
        </div>
    );
}