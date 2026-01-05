import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchDocumentsBackend } from "../../services/documentService";
import "../../styles/user/documents.css";

const Documents = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const authorEmail = searchParams.get("author");

  const [docs, setDocs] = useState([]);
  const [authorName, setAuthorName] = useState("");
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!authorEmail) return;

    setLoading(true);

    // 1️⃣ FETCH DOCUMENTS
    searchDocumentsBackend({
      contributor: authorEmail,
      page: 0,
      size: 10,
    })
      .then((data) => {
        setDocs(data.content || []);
      })
      .catch(console.error);

    // 2️⃣ FETCH USER NAME
    fetch(
      `${API_BASE_URL}/api/people/by-email?email=${encodeURIComponent(
        authorEmail
      )}`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((data) => setAuthorName(data.name))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [authorEmail, API_BASE_URL]);

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading documents...</p>;
  }

  return (
    <div className="documents-page">
      {/* 🔙 BACK BUTTON */}
      <button
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h2 className="documents-title">
        Documents by <span>{authorName || "Unknown User"}</span>
      </h2>

      {docs.length === 0 && (
        <p style={{ marginTop: "20px" }}>
          No documents posted by this user.
        </p>
      )}

      <div className="documents-list">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="document-card"
            onClick={() => navigate(`/documents/${doc.id}`)}
          >
            <h3>{doc.title}</h3>
            <p className="category">{doc.category}</p>

            {/* ✅ DOCUMENT STATS */}
            <div className="doc-meta">
              <span>❤️ {doc.likeCount} Likes</span>
              <span>💬 {doc.commentCount} Comments</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Documents;
