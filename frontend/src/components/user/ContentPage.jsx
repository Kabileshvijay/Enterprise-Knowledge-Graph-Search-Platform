import "../styles/content.css";
import { useNavigate } from "react-router-dom";

const ContentPage = () => {
  const navigate = useNavigate();

  return (
    <main className="content-area">
      <div className="content-inner">
        {/* Header actions */}
        <div className="content-actions">
          <div className="actions-left">
            {/* <span>Analytics</span>
            <span>Owner: Kabileshvijay</span> */}
          </div>

          <div className="actions-right">
            <button>View inline comments</button>

            {/* SAVE FOR LATER → REDIRECT */}
            <button onClick={() => navigate("/saved")}>
              Save for later
            </button>

            <button>Watch</button>
            <button>Share</button>
          </div>
        </div>

        {/* Hero welcome card */}
        <div className="welcome-card">
          <h1>Welcome to EntroGraph!</h1>
          <p>
            We store developer guides, team resources, runbooks,
            and onboarding documentation here.
          </p>

          <button className="primary-cta">
            Start with the Engineering Guide →
          </button>
        </div>

        {/* Quick links */}
        <div className="content-links">
          <div className="link-card">
            <h3>Learn…</h3>
          </div>

          <div className="link-card">
            <h3>Browse all wiki spaces</h3>
            <span>Space Directory →</span>
          </div>

          <div className="link-card">
            <h3>Read about Enterprise Engineering</h3>
            <span>Engineering Guide →</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ContentPage;
