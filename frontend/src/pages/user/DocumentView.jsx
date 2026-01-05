import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CommentPanel from "../../components/user/CommentPanel";
import SummaryModal from "../../components/user/SummaryModal";
import "../../styles/user/documentView.css";

const DocumentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doc, setDoc] = useState(null);
  const [liking, setLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // 🔹 AI Summary States
  const [showSummary, setShowSummary] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summary, setSummary] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  /* ================= FETCH DOCUMENT ================= */
  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/documents/${id}`, {
          credentials: "include",
        });

        if (res.status === 401) {
          navigate("/login");
          return;
        }

        const data = await res.json();
        setDoc(data);

        if (data.hasLiked !== undefined) {
          setHasLiked(data.hasLiked);
        }

        const savedRes = await fetch(`${API_BASE_URL}/api/documents/saved`, {
          credentials: "include",
        });

        if (savedRes.ok) {
          const savedDocs = await savedRes.json();
          setSaved(savedDocs.some((d) => d.id === data.id));
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchDoc();
  }, [id, navigate]);

  /* ================= ANALYTICS TRACKING ================= */
  useEffect(() => {
    if (!doc) return;

    const startTime = Date.now();

    return () => {
      const endTime = Date.now();
      const timeSpentMinutes = Math.max(
        1,
        Math.floor((endTime - startTime) / 60000)
      );

      fetch(`${API_BASE_URL}/api/analytics/track`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: doc.id,
          title: doc.title,
          timeSpent: timeSpentMinutes,
        }),
      });
    };
  }, [doc]);

  /* ================= LIKE ================= */
  const handleLike = async () => {
    if (liking || hasLiked) return;

    setLiking(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/documents/${id}/like`, {
        method: "PUT",
        credentials: "include",
      });

      if (res.ok) {
        const updatedDoc = await res.json();
        setDoc(updatedDoc);
        setHasLiked(true);
      }
    } finally {
      setLiking(false);
    }
  };

  /* ================= SAVE / UNSAVE ================= */
  const handleSave = async () => {
    const res = await fetch(`${API_BASE_URL}/api/documents/${id}/save`, {
      method: "PUT",
      credentials: "include",
    });

    if (res.status === 401) {
      navigate("/login");
      return;
    }

    setSaved((prev) => !prev);
  };

  /* ================= AI SUMMARIZE ================= */
  const handleSummarize = async () => {
    setShowSummary(true);
    setSummaryLoading(true);
    setSummary("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/summarize`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: doc.content.replace(/<[^>]+>/g, ""),
        }),
      });

      const data = await res.json();
      setSummary(data.summary);
    } catch (err) {
      setSummary("Failed to generate summary.");
    } finally {
      setSummaryLoading(false);
    }
  };

  if (!doc) return <p>Loading...</p>;

  return (
    <>
      {/* 🔙 BACK BUTTON */}
      <button className="document-view-back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* MAIN CONTENT */}
      <div className="document-view-container">
        <h1 className="document-view-title">{doc.title}</h1>

        <div className="document-view-meta">
          <span>{doc.authorName}</span>
          <span>• {doc.category}</span>
          <span>• {new Date(doc.createdAt).toDateString()}</span>
        </div>

        {/* DOCUMENT CONTENT */}
        <div
          className="document-view-content"
          dangerouslySetInnerHTML={{ __html: doc.content }}
        />

        {/* ACTION BAR */}
        <div className="document-view-actions">
          {/* 👍 LIKE */}
          <button
            className={`document-view-like-btn ${hasLiked ? "liked" : ""}`}
            onClick={handleLike}
            disabled={hasLiked || liking}
          >
            👍 Like
          </button>

          <span className="document-view-like-count">
            {doc.likes} likes
          </span>

          {/* 💾 SAVE */}
          <button
            className={`document-view-save-btn ${
              saved ? "document-view-saved" : "document-view-unsaved"
            }`}
            onClick={handleSave}
          >
            {saved ? "★ Saved" : "☆ Save for later"}
          </button>

          {/* 🤖 SUMMARIZE */}
          <button
            className="document-view-summarize-btn"
            onClick={handleSummarize}
          >
            🤖 Summarize
          </button>

          {/* 💬 COMMENTS */}
          <button
            className={`document-view-comment-btn ${
              showComments ? "active" : ""
            }`}
            onClick={() => setShowComments(true)}
          >
            💬 Comments
          </button>
        </div>
      </div>

      {/* COMMENT PANEL */}
      {showComments && (
        <CommentPanel
          documentId={doc.id}
          onClose={() => setShowComments(false)}
        />
      )}

      {/* SUMMARY MODAL */}
      {showSummary && (
        <SummaryModal
          summary={summary}
          loading={summaryLoading}
          onClose={() => setShowSummary(false)}
        />
      )}
    </>
  );
};

export default DocumentView;
