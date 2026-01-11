import { useEffect, useState } from "react";
import "../../styles/admin/adminDashboard.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function AdminDashboard() {
  const [userCount, setUserCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [feedbackStats, setFeedbackStats] = useState({
    total: 0,
    solved: 0,
    unsolved: 0,
  });

  useEffect(() => {
    fetchUserCount();
    fetchPostCount();
    fetchFeedbackStats();
  }, []);

  /* ================= USERS (EXCLUDE ADMIN) ================= */

  const fetchUserCount = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/employees`, {
        credentials: "include",
      });
      if (!res.ok) return;

      const users = await res.json();
      const nonAdmins = users.filter((u) => u.role !== "ROLE_ADMIN");
      setUserCount(nonAdmins.length);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  /* ================= POSTS (DOCUMENTS) ================= */

  const fetchPostCount = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/documents`, {
        credentials: "include",
      });
      if (!res.ok) return;

      const documents = await res.json();
      setPostCount(documents.length);
    } catch (err) {
      console.error("Failed to fetch documents", err);
    }
  };

  /* ================= FEEDBACK ================= */

  const fetchFeedbackStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback`, {
        credentials: "include",
      });
      if (!res.ok) return;

      const data = await res.json();

      const total = data.length;
      const solved = data.filter((f) => f.status === "SOLVED").length;
      const unsolved = data.filter((f) => f.status === "UNSOLVED").length;

      setFeedbackStats({ total, solved, unsolved });
    } catch (err) {
      console.error("Failed to fetch feedback stats", err);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">📊 Admin Dashboard Overview</h2>

      <div className="dashboard-row two-cols">
        <div className="dashboard-card blue">
          <h1>{userCount}</h1>
          <p>Total Users</p>
        </div>

        <div className="dashboard-card teal">
          <h1>{postCount}</h1>
          <p>Total Documents</p>
        </div>
      </div>

      <div className="dashboard-row three-cols">
        <div className="dashboard-card purple">
          <h1>{feedbackStats.total}</h1>
          <p>Total Feedback</p>
        </div>

        <div className="dashboard-card green">
          <h1>{feedbackStats.solved}</h1>
          <p>Solved</p>
        </div>

        <div className="dashboard-card red">
          <h1>{feedbackStats.unsolved}</h1>
          <p>Unsolved</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
