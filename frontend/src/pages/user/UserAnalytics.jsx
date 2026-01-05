import { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useNavigate } from "react-router-dom";
import "../../styles/user/analytics.css";

const COLORS = ["#4F46E5", "#22C55E", "#F97316", "#EF4444", "#06B6D4"];
const ITEMS_PER_PAGE = 5;

const UserAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  /* ================= FETCH USER ANALYTICS ================= */
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/analytics/user`, {
      credentials: "include"
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => setStats(data))
      .catch(() => navigate("/login"));
  }, [navigate]);

  /* ================= SORT DOCUMENTS (LATEST FIRST) ================= */
  const sortedDocuments = useMemo(() => {
    if (!stats?.documents) return [];
    return [...stats.documents].sort(
      (a, b) => new Date(b.lastOpened) - new Date(a.lastOpened)
    );
  }, [stats]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(sortedDocuments.length / ITEMS_PER_PAGE);

  const paginatedDocs = sortedDocuments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /* ================= LOADING ================= */
  if (!stats) return <p>Loading analytics...</p>;

  return (
    <div className="analytics-page">
      <h1>Your Analytics</h1>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="analytics-cards">
        <div className="card">
          <h3>Total Time Spent</h3>
          <p>{stats.totalTime} mins</p>
        </div>

        <div className="card">
          <h3>Documents Opened</h3>
          <p>{stats.documentsOpened}</p>
        </div>

        <div className="card">
          <h3>Most Viewed</h3>
          <p>{stats.mostViewedDoc}</p>
        </div>

        <div className="card">
          <h3>Avg Time / Doc</h3>
          <p>{stats.avgTimePerDoc} mins</p>
        </div>
      </div>

      {/* ================= BAR CHART ================= */}
      <h2>Time Spent per Document</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.documents}>
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="timeSpent" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ================= PIE CHART ================= */}
      <h2>Reading Distribution</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={stats.documents}
              dataKey="timeSpent"
              nameKey="title"
              outerRadius={100}
              label
            >
              {stats.documents.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ================= TABLE ================= */}
      <h2>Document Activity (Latest First)</h2>

      <table className="analytics-table">
        <thead>
          <tr>
            <th>Document</th>
            <th>Time Spent (mins)</th>
            <th>Last Opened</th>
          </tr>
        </thead>
        <tbody>
          {paginatedDocs.map((doc) => (
            <tr key={doc.documentId}>
              <td>{doc.title}</td>
              <td>{doc.timeSpent}</td>
              <td>{new Date(doc.lastOpened).toDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= PAGINATION ================= */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={currentPage === index + 1 ? "active" : ""}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserAnalytics;
