import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import "../../assets/styles/addresses.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddressesList() {

    const [addresses, setAddresses] = useState([]);
    const [search, setSearch] = useState("");
    const [filterCity, setFilterCity] = useState("all");

    const navigation = useNavigate();

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const response = await fetch("http://localhost/delivery/public/addresses", {
                credentials: "include",
            });

            const data = await response.json();
            setAddresses(Array.isArray(data) ? data : []);

        } catch (error) {
            console.log(error);
        }
    };

    const deleteAddresses = async (id) => {

        if (!window.confirm("Voulez vous vraiment supprimer cette adresse ?")) return;

        try {
            const response = await fetch(
                `http://localhost/delivery/public/addresses?id=${id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || "Erreur lors de la suppression");
                return;
            }

            alert(data.message || "Adresse supprimée avec succès");
            navigation("/addresses");

        } catch (error) {
            console.error(error);
            alert("Erreur serveur");
        }
    };

    const editaddress = (path) => {
        navigation(path);
    };

    // 🔎 FILTRAGE + RECHERCHE
    const filteredAddresses = addresses.filter((a) => {

        const q = search.toLowerCase();

        const matchSearch =
            !q ||
            a.adresse?.toLowerCase().includes(q) ||
            a.ville?.toLowerCase().includes(q);

        const matchCity =
            filterCity === "all" || a.ville === filterCity;

        return matchSearch && matchCity;
    });

    // 📍 villes uniques
    const cities = [...new Set(addresses.map(a => a.ville))];

    return (
        <div className="addresses-page">
            <Sidebar />

            <div className="addresses-content">
                <Navbar />

                <div className="addresses-body">

                    <h2 className="addresses-title">Liste des adresses</h2>

                    <div className="addresses-filters">

                        <div className="addresses-search-wrap">
                            <input
                                type="text"
                                className="addresses-search"
                                placeholder="Rechercher adresse ou ville..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <select
                            className="addresses-select"
                            value={filterCity}
                            onChange={(e) => setFilterCity(e.target.value)}
                        >
                            <option value="all">Toutes les villes</option>
                            {cities.map((city, index) => (
                                <option key={index} value={city}>{city}</option>
                            ))}
                        </select>

                    </div>

                    <div className="addresses-table-wrapper">

                        <table className="addresses-table">

                            <thead>
                                <tr>
                                    <th>Adresse</th>
                                    <th>Ville</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredAddresses.length > 0 ? (
                                    filteredAddresses.map((adresse) => (
                                        <tr key={adresse.id}>

                                            <td className="addresses-text">
                                                {adresse.adresse}
                                            </td>

                                            <td className="addresses-city">
                                                {adresse.ville}
                                            </td>

                                            <td>
                                                <div className="addresses-actions">

                                                    <button
                                                        onClick={() =>
                                                            editaddress(`/address/AddressEdit/${adresse.id}`)
                                                        }
                                                        className="addresses-btn addresses-btn-edit"
                                                    >
                                                        Modifier
                                                    </button>

                                                    <button
                                                        onClick={() => deleteAddresses(adresse.id)}
                                                        className="addresses-btn addresses-btn-delete"
                                                    >
                                                        Supprimer
                                                    </button>

                                                </div>
                                            </td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="addresses-empty">
                                            Aucune adresse trouvée
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