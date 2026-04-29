import "../assets/styles/navbar.css";
// import "../../public/logo.png"

export default function Navbar() {

    const admin = JSON.parse(localStorage.getItem("user"));
    return (
        <nav className="navbar">

            <div className="navbar-logo">
                {/* <img src="/logo.png" alt="logo" className="logo-img" /> */}
                CampusDelivery
            </div>

            {/* Search */}
            {/* <div className="navbar-search">
                <input type="text" placeholder="Search..." />
            </div> */}

            {/* Actions */}
            <div className="navbar-actions">

                {/* Notifications */}
                <div className="icon">
                    🔔
                    <span className="badge">3</span>
                </div>

                {admin.nom}
                <div className="profile">
                    <img
                        src="https://i.pravatar.cc/40"
                        alt="profile"
                    />
                </div>

            </div>
        </nav>
    );
}