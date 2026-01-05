import { useEffect, useState } from "react";
import "../../styles/user/profile.css";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 5;

const Profile = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  /* STATUS + PAGINATION */
  const [activeStatus, setActiveStatus] = useState("PUBLISHED");
  const [currentPage, setCurrentPage] = useState(1);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  /* ================= STRIP HTML ================= */
  const stripHtml = (html) => {
    if (!html) return "";
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  /* ================= TIME AGO ================= */
  const timeAgo = (dateTime) => {
    if (!dateTime) return "";

    const normalized = dateTime.replace(" ", "T").split(".")[0];
    const created = new Date(normalized);
    const now = new Date();

    const diff = Math.floor((now - created) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;

    return created.toLocaleDateString();
  };

  /* ================= FETCH USER + DOCUMENTS ================= */
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // 🔐 Fetch logged-in user
        const userRes = await fetch(`${API_BASE_URL}/api/employees/me`, {
          credentials: "include",
        });

        if (!userRes.ok) throw new Error("Not authenticated");

        const userData = await userRes.json();
        setUser(userData);

        // 📄 Fetch user's documents
        const docRes = await fetch(`${API_BASE_URL}/api/documents/my`, {
          credentials: "include",
        });

        if (docRes.ok) {
          const docs = await docRes.json();
          const sorted = docs.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setDocuments(sorted);
        }
      } catch (err) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  /* ================= DELETE DOCUMENT ================= */
  const handleDelete = (id) => {
    if (!window.confirm("Delete this document?")) return;

    fetch(`${API_BASE_URL}/api/documents/${id}`, {
      method: "DELETE",
      credentials: "include",
    }).then(() => {
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    });
  };

  /* ================= COUNTS ================= */
  const publishedCount = documents.filter(
    (doc) => doc.status === "PUBLISHED"
  ).length;

  const draftCount = documents.filter((doc) => doc.status === "DRAFT").length;

  /* ================= FILTER + PAGINATION ================= */
  const filteredDocs = documents.filter((doc) => doc.status === activeStatus);

  const totalPages = Math.ceil(filteredDocs.length / ITEMS_PER_PAGE);

  const paginatedDocs = filteredDocs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleStatusChange = (status) => {
    setActiveStatus(status);
    setCurrentPage(1);
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="profile-page">
      {/* 🔙 BACK BUTTON */}
      <button className="back-btn" onClick={() => navigate("/home")}>
        ← Back
      </button>

      <h2>My Profile</h2>

      <div className="profile-card">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
      </div>

      <h3>My Documents</h3>

      {/* ================= FILTER BUTTONS ================= */}
      <div className="doc-filter">
        <button
          className={`filter-btn ${
            activeStatus === "PUBLISHED" ? "active" : ""
          }`}
          onClick={() => handleStatusChange("PUBLISHED")}
        >
          Published ({publishedCount})
        </button>

        <button
          className={`filter-btn ${activeStatus === "DRAFT" ? "active" : ""}`}
          onClick={() => handleStatusChange("DRAFT")}
        >
          Draft ({draftCount})
        </button>
      </div>

      {/* ================= DOCUMENT LIST ================= */}
      {filteredDocs.length === 0 ? (
        <div className="no-documents">
          No {activeStatus.toLowerCase()} documents found
        </div>
      ) : (
        paginatedDocs.map((doc) => (
          <div className="doc-card" key={doc.id}>
            <div className="doc-content">
              <h4>{doc.title}</h4>

              <span className={`status-badge ${doc.status}`}>{doc.status}</span>

              <p>{stripHtml(doc.content).substring(0, 120)}...</p>

              <span className="doc-time">{timeAgo(doc.createdAt)}</span>
            </div>

            <div className="doc-actions">
              <button
                className="edit-btn"
                onClick={() => navigate(`/documents/edit/${doc.id}`)}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDelete(doc.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}

      {/* ================= PAGINATION ================= */}
      {filteredDocs.length > 0 && totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
