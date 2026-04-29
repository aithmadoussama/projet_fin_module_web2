import './App.css';
import Dashboard from './pages/Dashboard';
import './pages/login'
import Login from './pages/login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UsersList from './pages/users/UsersList';
import AddressesList from './pages/addresses/AddressList';
import LivraisonsList from './pages/livraisons/LivraisonsList';
import UserCreate from './pages/users/UserCreate';
import EditUser from './pages/users/UserEdit';
import AddressEdit from './pages/addresses/AddressEdit';
import LogsList from './pages/logs/LogsList';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import LivraisonEdit from './pages/livraisons/LivraisonEdit';

function App() {
  return (

    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/livraisons" element={<LivraisonsList />} />
          <Route path="/livraisons/editlivraison/:client_id/:date_livraison" element={<LivraisonEdit />} />          <Route path="/addresses" element={<AddressesList />} />
          <Route path="/users/adduser" element={<UserCreate />} />
          <Route path="/users/edituser/:id" element={<EditUser />} />
          <Route path="/address/AddressEdit/:id" element={<AddressEdit />} />
          <Route path="/logs" element={<LogsList />} />
          <Route path="/login/forgotpassword" element={<ForgotPassword />} />
          <Route path="/login/resetpassword" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </div>

  );
}

export default App;
