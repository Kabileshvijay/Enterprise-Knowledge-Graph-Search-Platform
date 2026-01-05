import "../../styles/user/sidebar.css";
import {
  FaHome,
  FaChartBar,
  FaBook,
  FaTools,
  FaSnowflake,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import SearchPanel from "./SearchPanel";
import { useSnow } from "../../context/SnowContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showTools, setShowTools] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  const { isSnowOn, toggleSnow } = useSnow();

  // 🔹 Ref for popup
  const popupRef = useRef(null);

  // 🔹 Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowTools(false);
      }
    };

    if (showTools) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTools]);

  return (
    <>
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

          {/* SAVED */}
          <div
            className={`wiki-sidebar-item ${
              location.pathname === "/saved" ? "active" : ""
            }`}
            onClick={() => navigate("/saved")}
          >
            <FaBook />
            <span>Saved For Later</span>
          </div>

          {/* ENGINEERING GUIDE → OPEN SEARCH */}
          <div
            className="wiki-sidebar-item"
            onClick={() => setOpenSearch(true)}
          >
            <FaBook />
            <span>Engineering Guide</span>
          </div>

          <div className="wiki-sidebar-info">
            See incorrect, stale, or missing information on a page? Share
            feedback by clicking <b>Give Feedback</b> on the home page.
          </div>
        </div>

        {/* 🔧 SPACE TOOLS */}
        <div
          className="wiki-sidebar-bottom"
          onClick={(e) => {
            e.stopPropagation();
            setShowTools(!showTools);
          }}
        >
          <FaTools />
          <span>Space tools</span>
        </div>

        {/* 🌨 Snow Popup */}
        {showTools && (
          <div className="space-tools-popup" ref={popupRef}>
            <div
              className="space-tools-item"
              onClick={() => {
                toggleSnow();
                setShowTools(false);
              }}
            >
              <FaSnowflake />
              <span>{isSnowOn ? "Turn Snow Off" : "Turn Snow On"}</span>
            </div>
          </div>
        )}
      </aside>

      {/* 🔍 SEARCH PANEL */}
      {openSearch && (
        <SearchPanel onClose={() => setOpenSearch(false)} />
      )}
    </>
  );
};

export default Sidebar;
