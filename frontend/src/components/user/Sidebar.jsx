import "../../styles/user/sidebar.css";
import { FaHome, FaChartBar, FaBook, FaTools } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  return (
    <aside className="wiki-sidebar">
      <div className="wiki-sidebar-top">
        
        {/* HOME */}
        <div
          className={`wiki-sidebar-item ${
            location.pathname === "/home" ? "active" : ""
          }`}
          onClick={() => navigate("/home")}
        >
          <FaHome />
          <span>EngWiki Home</span>
        </div>

        {/* ANALYTICS */}
        <div
          className={`wiki-sidebar-item ${
            location.pathname === "/analytics" ? "active" : ""
          }`}
          onClick={() => navigate("/analytics")}
        >
          <FaChartBar />
          <span>Analytics</span>
        </div>

        <p className="wiki-sidebar-title">SPACE SHORTCUTS</p>

        {/* ✅ SAVE FOR LATER */}
        <div
          className={`wiki-sidebar-item ${
            location.pathname === "/saved" ? "active" : ""
          }`}
          onClick={() => navigate("/saved")}
        >
          <FaBook />
          <span>Save For Later</span>
        </div>

        <div className="wiki-sidebar-item">
          <FaBook />
          <span>Engineering Guide</span>
        </div>

        <div className="wiki-sidebar-info">
          See incorrect, stale, or missing information on a page?
          Share feedback by clicking <b>Give Feedback</b> on the home page.
        </div>
      </div>

      <div className="wiki-sidebar-bottom">
        <FaTools />
        <span>Space tools</span>
      </div>
    </aside>
  );
};

export default Sidebar;
