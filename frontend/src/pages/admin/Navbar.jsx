import { Link, useNavigate } from "react-router-dom";
import "../../styles/admin/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/employees/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      navigate("/");
    }
  };

  return (
    <div className="navbar">
      <div className="navbar-right">
        <div className="profile-menu">
          <span className="profile-icon">👤</span>
          <div className="dropdown">
            <Link to="/admin/profile">View Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
