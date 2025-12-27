import { useEffect, useState } from "react";
import { getSavedDocuments } from "../../services/documentService";
import { useNavigate } from "react-router-dom";
import "../../styles/user/SavedDocuments.css";

const SavedDocuments = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="doc-container">
      {/* BACK BUTTON */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2>Saved for Later</h2>

      {docs.length === 0 && <p>No saved documents</p>}

      {docs.map((doc) => (
        <div
          key={doc.id}
          className="search-result-item"
          onClick={() => navigate(`/documents/${doc.id}`)}
        >
          <p className="result-title">{doc.title}</p>
          <p className="result-space">{doc.category}</p>
        </div>
      ))}
    </div>
  );
};

export default SavedDocuments;
