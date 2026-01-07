import { useEffect, useState } from "react";
import "../../styles/user/feedbackModal.css";

const FeedbackModal = ({ onClose }) => {
  const [user, setUser] = useState(null);
  const [type, setType] = useState("GENERAL");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch logged-in user from backend using JWT cookie
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/employees/me`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => {});
  }, [API_BASE_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      alert("Please enter feedback");
      return;
    }

    setLoading(true);

    // MULTIPART FORM DATA
    const formData = new FormData();

    // JSON part
    formData.append(
      "data",
      new Blob(
        [JSON.stringify({ type, message })],
        { type: "application/json" }
      )
    );

    // Optional screenshot
    if (file) {
      formData.append("screenshot", file);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        alert("Thank you for your feedback!");
        onClose();
      } else {
        alert("Failed to submit feedback");
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="feedback-overlay">
      <div className="feedback-modal">
        <button className="close-btn" onClick={onClose}>✕</button>

        <h2>Share Your Feedback</h2>

        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input value={user.name} disabled />

          <label>Email</label>
          <input value={user.email} disabled />

          <label>Feedback Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="GENERAL">General</option>
            <option value="ISSUE">Website Issue</option>
            <option value="FEATURE">Feature Request</option>
            <option value="OTHER">Other</option>
          </select>

          <label>Your Message</label>
          <textarea
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what you think..."
          />

          {/* ✅ Screenshot Upload */}
          <label>Screenshot (optional)</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button className="submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
