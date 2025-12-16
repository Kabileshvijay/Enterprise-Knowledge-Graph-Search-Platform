import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
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
