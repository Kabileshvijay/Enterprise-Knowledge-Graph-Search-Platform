import { useEffect, useState } from "react";
import "../../styles/admin/feedbackAdmin.css";

function FeedBack() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    const res = await fetch(`${API_BASE_URL}/api/feedback`, {
      credentials: "include",
    });

    if (!res.ok) return;

    const data = await res.json();

    // UNSOLVED FIRST
    const sorted = data.sort((a, b) =>
      a.status === "UNSOLVED" && b.status === "SOLVED" ? -1 : 1
    );

    setFeedbacks(sorted);
    setCurrentPage(1);
  };

  const markAsSolved = async (id) => {
    await fetch(`${API_BASE_URL}/api/feedback/${id}/solve`, {
      method: "PUT",
      credentials: "include",
    });
    fetchFeedbacks();
  };

  // 📊 STATS
  const total = feedbacks.length;
  const solved = feedbacks.filter((f) => f.status === "SOLVED").length;
  const unsolved = feedbacks.filter((f) => f.status === "UNSOLVED").length;

  // 🔢 PAGINATION LOGIC
  const totalPages = Math.ceil(feedbacks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = feedbacks.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="feedback-admin-page">
      <h1>Feedback Management</h1>

      {/* 📊 STATS */}
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total</h3>
          <p>{total}</p>
        </div>
        <div className="stat-card solved">
          <h3>Solved</h3>
          <p>{solved}</p>
        </div>
        <div className="stat-card unsolved">
          <h3>Unsolved</h3>
          <p>{unsolved}</p>
        </div>
      </div>

      {/* 📋 TABLE */}
      <table className="feedback-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Type</th>
            <th>Message</th>
            <th>Screenshot</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {currentItems.map((f) => (
            <tr
              key={f.id}
              className={f.status === "UNSOLVED" ? "row-unsolved" : ""}
            >
              <td>{f.name}</td>
              <td>{f.email}</td>
              <td>{f.type}</td>
              <td className="message-cell">{f.message}</td>

              <td>
                {f.screenshotPath ? (
                  <button
                    className="link-btn"
                    onClick={() => setSelectedImage(f.screenshotPath)}
                  >
                    View
                  </button>
                ) : "—"}
              </td>

              <td>
                <span className={`status ${f.status.toLowerCase()}`}>
                  {f.status}
                </span>
              </td>

              <td>
                {f.status === "UNSOLVED" ? (
                  <button
                    className="solve-btn"
                    onClick={() => markAsSolved(f.id)}
                  >
                    Mark Solved
                  </button>
                ) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔢 PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* 🖼️ IMAGE POPUP */}
      {selectedImage && (
        <div className="image-overlay" onClick={() => setSelectedImage(null)}>
          <div className="image-modal">
            <img
              src={`${API_BASE_URL}${selectedImage}`}
              alt="Screenshot"
            />
            <button onClick={() => setSelectedImage(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeedBack;
