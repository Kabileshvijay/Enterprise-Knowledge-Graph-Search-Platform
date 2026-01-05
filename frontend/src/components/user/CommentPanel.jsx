import { useEffect, useState } from "react";
import "../../styles/user/commentPanel.css";

const CommentPanel = ({ documentId, onClose }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  /* ================= FETCH CURRENT USER ================= */
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/employees/me`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setCurrentUser(data))
      .catch(() => setCurrentUser(null));
  }, []);

  /* ================= FETCH COMMENTS ================= */
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/comments/${documentId}`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(console.error);
  }, [documentId]);

  /* ================= ADD COMMENT ================= */
  const submitComment = async () => {
    if (!text.trim()) return;

    const res = await fetch(`${API_BASE_URL}/api/comments`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId, text }),
    });

    if (res.ok) {
      const newComment = await res.json();
      setComments(prev => [...prev, newComment]);
      setText("");
    }
  };

  /* ================= ADD REPLY ================= */
  const submitReply = async (parentId) => {
    if (!replyText.trim()) return;

    const res = await fetch(`${API_BASE_URL}/api/comments`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        documentId,
        parentId,
        text: replyText,
      }),
    });

    if (res.ok) {
      const reply = await res.json();
      setComments(prev => [...prev, reply]);
      setReplyText("");
      setReplyTo(null);
    }
  };

  /* ================= EDIT COMMENT ================= */
  const saveEdit = async (id) => {
    if (!editText.trim()) return;

    const res = await fetch(`${API_BASE_URL}/api/comments/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: editText }),
    });

    if (res.ok) {
      const updated = await res.json();
      setComments(prev =>
        prev.map(c => (c.id === id ? updated : c))
      );
      setEditingId(null);
    }
  };

  /* ================= DELETE COMMENT ================= */
  const deleteComment = async (id) => {
    if (!window.confirm("Delete this comment?")) return;

    await fetch(`${API_BASE_URL}/api/comments/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    setComments(prev => prev.filter(c => c.id !== id));
  };

  /* ================= ENTER KEY ================= */
  const handleKeyDown = (e, action) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      action();
    }
  };

  /* ================= RENDER THREAD ================= */
  const renderReplies = (parentId) =>
    comments
      .filter(c => c.parentId === parentId)
      .map(reply => (
        <div key={reply.id} className="comment-reply">
          <strong>{reply.authorName}</strong>
          <p>{reply.text}</p>
          <span>
            {new Date(reply.createdAt).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>

          {currentUser &&
            reply.authorEmail === currentUser.email && (
              <div className="comment-actions">
                <button
                  onClick={() => {
                    setEditingId(reply.id);
                    setEditText(reply.text);
                  }}
                >
                  Edit
                </button>
                <button onClick={() => deleteComment(reply.id)}>
                  Delete
                </button>
              </div>
            )}
        </div>
      ));

  return (
    <div className="comment-panel">
      {/* HEADER */}
      <div className="comment-panel-header">
        <h3>Comments</h3>
        <button onClick={onClose}>✕</button>
      </div>

      {/* COMMENTS */}
      <div className="comment-panel-body">
        {comments.filter(c => !c.parentId).length === 0 && (
          <p>No comments yet</p>
        )}

        {comments
          .filter(c => !c.parentId)
          .map(c => (
            <div key={c.id} className="comment-item">
              <strong>{c.authorName}</strong>

              {editingId === c.id ? (
                <textarea
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                />
              ) : (
                <p>{c.text}</p>
              )}

              <span>
                {new Date(c.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>

              {/* ACTIONS */}
              {currentUser &&
                c.authorEmail === currentUser.email && (
                  <div className="comment-actions">
                    {editingId === c.id ? (
                      <>
                        <button onClick={() => saveEdit(c.id)}>Save</button>
                        <button onClick={() => setEditingId(null)}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(c.id);
                            setEditText(c.text);
                          }}
                        >
                          Edit
                        </button>
                        <button onClick={() => deleteComment(c.id)}>
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                )}

              {/* REPLY */}
              <button
                className="reply-btn"
                onClick={() => setReplyTo(c.id)}
              >
                Reply
              </button>

              {replyTo === c.id && (
                <textarea
                  className="reply-box"
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onKeyDown={e =>
                    handleKeyDown(e, () => submitReply(c.id))
                  }
                />
              )}

              {/* REPLIES */}
              <div className="reply-thread">
                {renderReplies(c.id)}
              </div>
            </div>
          ))}
      </div>

      {/* INPUT */}
      <div className="comment-panel-footer">
        <textarea
          placeholder="Write a comment..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => handleKeyDown(e, submitComment)}
        />
        <button onClick={submitComment}>Post</button>
      </div>
    </div>
  );
};

export default CommentPanel;
