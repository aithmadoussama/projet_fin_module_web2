import "../assets/styles/sidebar.css";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
    return (
        <aside className="sidebar">

            <h2 className="sidebar-logo">CampusDelivery</h2>

            <ul className="sidebar-menu">
                <li>
                    <NavLink to="/dashboard">
                        <i className="fi fi-sr-dashboard"></i>
                        <span>Dashboard</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/users">
                        <i className="fi fi-sr-users"></i>
                        <span>Users</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/livraisons">
                        <i className="fi fi-sr-box"></i>
                        <span>Livraisons</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/addresses">
                        <i className="fi fi-sr-marker"></i>
                        <span>Addresses</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/logs">
                        <i className="fi fi-sr-document"></i>
                        <span>Logs</span>
                    </NavLink>
                </li>
            </ul>

        </aside>
    );
}