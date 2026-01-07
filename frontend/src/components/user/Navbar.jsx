import { FaSearch, FaBell, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import SearchPanel from "./SearchPanel";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import "../../styles/user/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  const [user, setUser] = useState(null);

  // Notifications
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const menuRef = useRef();
  const notificationRef = useRef();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  /* ================= FETCH USER (ONLY AUTH CHECK) ================= */
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/employees/me`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then(setUser)
      .catch(() => navigate("/"));
  }, [API_BASE_URL, navigate]);

  /* ================= FETCH NOTIFICATION COUNT ================= */
  const loadNotificationCount = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/notifications/count`,
        { credentials: "include" }
      );

      // ❗ Ignore auth failure — DO NOT LOGOUT
      if (!res.ok) {
        setUnreadCount(0);
        return;
      }

      const data = await res.json();
      setUnreadCount(data);
    } catch (err) {
      console.error("Notification count failed", err);
      setUnreadCount(0);
    }
  };

  /* ================= FETCH NOTIFICATIONS ================= */
  const loadNotifications = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/notifications`,
        { credentials: "include" }
      );

      if (!res.ok) {
        setNotifications([]);
        return;
      }

      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Notifications fetch failed", err);
      setNotifications([]);
    }
  };

  useEffect(() => {
    loadNotificationCount();
  }, []);

  /* ================= REAL-TIME WEBSOCKET ================= */
  useEffect(() => {
    if (!user?.email) return;

    const socket = new SockJS(`${API_BASE_URL}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });

    client.onConnect = () => {
      client.subscribe(
        `/topic/notifications/${user.email}`,
        (msg) => {
          const notification = JSON.parse(msg.body);
          setNotifications((prev) => [notification, ...prev]);
          setUnreadCount((c) => c + 1);
        }
      );
    };

    client.activate();
    return () => client.deactivate();
  }, [user, API_BASE_URL]);

  /* ================= MARK AS READ ================= */
  const markAsRead = async (notification) => {
    try {
      await fetch(
        `${API_BASE_URL}/api/notifications/${notification.id}/read`,
        {
          method: "PUT",
          credentials: "include",
        }
      );
    } catch (e) {
      console.error("Mark read failed");
    }

    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notification.id ? { ...n, isRead: true } : n
      )
    );

    setUnreadCount((c) => Math.max(0, c - 1));
    setShowNotifications(false);

    if (notification.documentId) {
      navigate(`/documents/${notification.documentId}`);
    }
  };

  /* ================= OUTSIDE CLICK ================= */
  useEffect(() => {
    const handleClick = (e) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    await fetch(`${API_BASE_URL}/api/employees/logout`, {
      method: "POST",
      credentials: "include",
    });
    navigate("/");
  };

  return (
    <>
      <nav className="enterprise-navbar">
        <div className="nav-left">
          <span className="nav-logo" onClick={() => navigate("/home")}>
            EntroGraph
          </span>

          <ul className="nav-menu">
            <li onClick={() => navigate("/people")}>People</li>
            <li onClick={() => setOpenSearch(true)}>Engineering Guide</li>
            <li onClick={() => navigate("/analytics")}>Analytics</li>
          </ul>
        </div>

        <div className="nav-right">
          {/* SEARCH */}
          <div className="nav-search">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search"
              readOnly
              onClick={() => setOpenSearch(true)}
            />
          </div>

          <button className="create-btn" onClick={() => navigate("/create")}>
            Create
          </button>

          {/* NOTIFICATIONS */}
          <div className="notification-wrapper" ref={notificationRef}>
            <FaBell
              className="nav-icon"
              onClick={() => {
                setShowNotifications((s) => !s);
                loadNotifications();
              }}
            />

            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}

            {showNotifications && (
              <div className="notification-dropdown">
                <h4>Notifications</h4>

                {notifications.length === 0 && (
                  <p className="no-notifications">No notifications</p>
                )}

                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`notification-item ${
                      n.isRead ? "read" : "unread"
                    }`}
                    onClick={() => markAsRead(n)}
                  >
                    <p>{n.message}</p>
                    <span>
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PROFILE */}
          <div className="profile-wrapper" ref={menuRef}>
            <FaUserCircle
              className="nav-icon profile"
              onClick={() => setShowMenu((p) => !p)}
            />

            <div className={`profile-dropdown ${showMenu ? "open" : ""}`}>
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
          </div>
        </div>
      </nav>

      {openSearch && <SearchPanel onClose={() => setOpenSearch(false)} />}
    </>
  );
};

export default Navbar;
