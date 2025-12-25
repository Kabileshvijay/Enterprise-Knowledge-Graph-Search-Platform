import { FaSearch, FaBell, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import SearchPanel from "./SearchPanel";
import "../../styles/user/navbar.css"; 

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  /* ================= FETCH LOGGED-IN USER ================= */
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/employees/me`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => navigate("/login"));
  }, [API_BASE_URL, navigate]);

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    await fetch(`${API_BASE_URL}/api/employees/logout`, {
      method: "POST",
      credentials: "include",
    });

    navigate("/");
  };

  /* ================= CLOSE DROPDOWN ON OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="enterprise-navbar">
        <div className="nav-left">
          <span className="nav-logo" onClick={() => navigate("/home")}>
            EntroGraph
          </span>

          <ul className="nav-menu">
            <li>Spaces</li>
            <li>People</li>
            <li>Engineering Guide</li>
            <li onClick={() => navigate("/analytics")}>Analytics</li>
          </ul>
        </div>

        <div className="nav-right">
          <div className="nav-search">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search"
              readOnly
              onClick={() => setOpenSearch(true)}
              onFocus={() => setOpenSearch(true)}
            />
          </div>

          <button className="create-btn" onClick={() => navigate("/create")}>
            Create
          </button>

          <FaBell className="nav-icon" />

          <div className="profile-wrapper" ref={menuRef}>
            <FaUserCircle
              className="nav-icon profile"
              onClick={() => setShowMenu(!showMenu)}
            />

            {showMenu && (
              <div className="profile-dropdown">
                <p className="profile-name">
                  {user ? user.name : "Loading..."}
                </p>

                <button onClick={() => navigate("/profile")}>
                  View Profile
                </button>

                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {openSearch && <SearchPanel onClose={() => setOpenSearch(false)} />}
    </>
  );
};

export default Navbar;
