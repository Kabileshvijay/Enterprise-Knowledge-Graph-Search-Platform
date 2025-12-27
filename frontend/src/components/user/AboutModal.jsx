import "../../styles/user/feedbackModal.css";

const AboutModal = ({ onClose }) => {
  return (
    <div className="feedback-overlay" onClick={onClose}>
      <div
        className="feedback-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>×</button>

        <h2>About EntroGraph</h2>

        <p style={{ fontSize: "14px", color: "#374151", lineHeight: "1.6" }}>
          Welcome to <strong>EntroGraph</strong>! This platform is your central
          knowledge hub where teams can explore developer guides, access
          enterprise documentation, read runbooks, and discover onboarding
          resources. It helps employees find the right information faster,
          collaborate better, and stay aligned with engineering standards.
        </p>
      </div>
    </div>
  );
};

export default AboutModal;
