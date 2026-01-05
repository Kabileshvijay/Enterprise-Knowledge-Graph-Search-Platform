import { useEffect, useState } from "react";
import { getSavedDocuments } from "../../services/documentService";
import { useNavigate } from "react-router-dom";
import "../../styles/user/SavedDocuments.css";

const ITEMS_PER_PAGE = 4; 

const SavedDocuments = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const data = await getSavedDocuments();
        setDocs(Array.isArray(data) ? data : []);
      } catch (err) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [navigate]);

  if (loading) return <p>Loading...</p>;

  /* ================= PAGINATION LOGIC ================= */
  const totalPages = Math.ceil(docs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentDocs = docs.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="doc-container">
      {/* BACK BUTTON */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2>Saved for Later</h2>

      {docs.length === 0 && <p>No saved documents</p>}

      {/* DOCUMENT LIST */}
      {currentDocs.map((doc) => (
        <div
          key={doc.id}
          className="search-result-item"
          onClick={() => navigate(`/documents/${doc.id}`)}
        >
          <p className="result-title">{doc.title}</p>
          <p className="result-space">{doc.category}</p>
        </div>
      ))}

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
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
    </div>
  );
};

export default SavedDocuments;
