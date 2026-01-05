import "../../styles/user/content.css";
import { useState } from "react";
import SearchPanel from "./SearchPanel";
import FeedbackModal from "./FeedbackModal";
import AboutModal from "./AboutModal";

const ContentPage = () => {
  const [openSearch, setOpenSearch] = useState(false);
  const [openFeedback, setOpenFeedback] = useState(false);
  const [openAbout, setOpenAbout] = useState(false); // 👈 NEW

  return (
    <main className="content-area">
      <div className="content-inner">
        <div className="welcome-hero">
          <div className="welcome-card">
            <h1>Welcome to EntroGraph!</h1>
            <p>
              We store developer guides, team resources, runbooks, and
              onboarding documentation here.
            </p>

            <button className="primary-cta" onClick={() => setOpenSearch(true)}>
              Start with the Engineering Guide →
            </button>
          </div>
        </div>

        <div className="content-links">
          {/* ENGINEERING GUIDE */}
          <div className="link-card" onClick={() => setOpenAbout(true)}>
            <h3>Read about Enterprise Engineering</h3>
            <span>Engineering Guide →</span>
          </div>

          {/* SPACE DIRECTORY */}
          <div className="link-card">
            <h3>Browse all wiki spaces</h3>
            <span>Space Directory →</span>
          </div>

          {/* FEEDBACK */}
          <div className="link-card" onClick={() => setOpenFeedback(true)}>
            <h3>Give Feedback</h3>
            <span>Share your thoughts →</span>
          </div>
        </div>
      </div>

      {/* MODALS */}
      {openSearch && <SearchPanel onClose={() => setOpenSearch(false)} />}

      {openFeedback && <FeedbackModal onClose={() => setOpenFeedback(false)} />}

      {openAbout && <AboutModal onClose={() => setOpenAbout(false)} />}
    </main>
  );
};

export default ContentPage;
