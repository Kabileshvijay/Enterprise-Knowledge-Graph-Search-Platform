import "../../styles/user/summaryModal.css";

const SummaryModal = ({ summary, onClose, loading }) => {
  return (
    <div className="summary-overlay">
      <div className="summary-modal">
        <h3>📄 AI Summary</h3>

        {loading ? (
          <div className="summary-loading">
            <div className="loader"></div>
            <span>Generating summary...</span>
          </div>
        ) : (
          <p className="summary-text">
            {summary || "No summary available."}
          </p>
        )}

        <button className="summary-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default SummaryModal;
