import "../../styles/user/content.css";
import { useState } from "react";
import SearchPanel from "./SearchPanel";

const ContentPage = () => {
  const [openSearch, setOpenSearch] = useState(false);

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

            <button
              className="primary-cta"
              onClick={() => setOpenSearch(true)}
            >
              Start with the Engineering Guide →
            </button>
          </div>
        </div>

        <div className="content-links">
          <div className="link-card">
            <h3>Read about Enterprise Engineering</h3>
            <span>Engineering Guide →</span>
          </div>

          <div className="link-card">
            <h3>Browse all wiki spaces</h3>
            <span>Space Directory →</span>
          </div>

          <div className="link-card">
            <h3>Give Feedback</h3>
            <span>Share your thoughts →</span>
          </div>
        </div>
      </div>

      {openSearch && <SearchPanel onClose={() => setOpenSearch(false)} />}
    </main>
  );
};

export default ContentPage;
