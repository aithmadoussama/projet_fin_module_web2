import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import "../../assets/styles/users.css";
import { useNavigate } from "react-router-dom";

export default function UsersList() {

    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.nom.toLowerCase().startsWith(search.toLowerCase())
    );

    // 📥 Charger les utilisateurs
    const fetchUsers = async () => {
        try {
            const res = await fetch("http://localhost/delivery/public/users", {
                credentials: "include"
            });
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
        }
    };

    // 🔄 Activer / Bloquer utilisateur (VERSION BASE DE DONNÉES)
    const toggleStatus = async (id, currentStatus) => {

        if (!window.confirm("Confirmez-vous la modification du statut de cet utilisateur ?")) return;

        const newStatus = currentStatus === "Actif" ? "Bloqué" : "Actif";

        try {
            const response = await fetch("http://localhost/delivery/public/users", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    id: id,
                    statut: newStatus
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error);
                return;
            }

            // 🔥 update UI sans reload
            setUsers(prev =>
                prev.map(user =>
                    user.id === id ? { ...user, statut: newStatus } : user
                )
            );

        } catch (error) {
            console.error(error);
        }
    };

    // ❌ supprimer utilisateur
    const deleteUser = async (id) => {

        if (!window.confirm("Supprimer cet utilisateur ?")) return;

        try {
            const response = await fetch(
                `http://localhost/delivery/public/users?id=${id}`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );

            if (!response.ok) {
                const err = await response.json().catch(() => ({ error: "Erreur inconnue" }));
                alert(err.error || "Erreur lors de la suppression");
                return;
            }

            setUsers(prev => prev.filter(u => u.id !== id));

        } catch (err) {
            console.error(err);
            alert("Erreur réseau ou serveur");
        }
    };

    // 👤 initiales
    const getInitials = (nom) =>
        nom?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || "?";

    return (
        <div className="users-page">
            <Sidebar />

            <div className="users-content">
                <Navbar />

                <div className="users-body">

                    <div className="deliveries-search-wrap">
                        
                        <input
                            className="deliveries-search"
                            placeholder="Rechercher"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>


                    {/* HEADER */}
                    <div className="users-header">
                        <h2 className="users-title">Liste des utilisateurs</h2>

                        <button
                            className="users-add-btn"
                            onClick={() => navigate("/users/adduser")}
                        >
                            + Ajouter utilisateur
                        </button>
                    </div>

                    {/* TABLE */}
                    <div className="users-table-wrapper">

                        <table className="users-table">

                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Email</th>
                                    <th>Rôle</th>
                                    <th>Statut</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id}>

                                            {/* NOM */}
                                            <td>
                                                <div className="users-info">
                                                    <div className="users-avatar">
                                                        {getInitials(user.nom)}
                                                    </div>
                                                    <span className="users-name">
                                                        {user.nom}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* EMAIL */}
                                            <td className="users-email">
                                                {user.email}
                                            </td>

                                            {/* ROLE */}
                                            <td>
                                                <span className={`users-role users-role--${user.role}`}>
                                                    {user.role}
                                                </span>
                                            </td>

                                            {/* STATUT */}
                                            <td>
                                                <span className={`users-status ${user.statut}`}>
                                                    {user.statut}
                                                </span>
                                            </td>

                                            {/* ACTIONS */}
                                            <td>
                                                <div className="users-actions">

                                                    {/* EDIT */}
                                                    <button
                                                        className="btn btn-edit"
                                                        onClick={() =>
                                                            navigate(`/users/edituser/${user.id}`)
                                                        }
                                                    >
                                                        ✏ Modifier
                                                    </button>

                                                    {/* DELETE */}
                                                    <button
                                                        className="btn btn-delete"
                                                        onClick={() => deleteUser(user.id)}
                                                    >
                                                        ✕ Supprimer
                                                    </button>

                                                    {/* TOGGLE STATUS */}
                                                    <button
                                                        className={`btn btn-${user.statut === "Actif" ? "deactivate" : "activate"}`}
                                                        onClick={() => toggleStatus(user.id, user.statut)}
                                                    >
                                                        {user.statut === "Actif" ? "Bloquer" : "Activer"}
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="users-empty">
                                            Aucun utilisateur disponible
                                        </td>
                                    </tr>
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>
            </div>
        </div>
    );
}