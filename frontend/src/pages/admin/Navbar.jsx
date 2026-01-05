import { Link, useNavigate } from "react-router-dom";
import "../../styles/admin/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/api/employees/logout", {
        method: "POST",
        credentials: "include" 
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
