import { useEffect, useState } from "react";
import "../../styles/user/people.css";

const People = () => {
  const [people, setPeople] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // ✅ MODAL STATE
  const [selectedPerson, setSelectedPerson] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/people?page=${page}&size=6`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch people");
        return res.json();
      })
      .then((data) => {
        setPeople(data.content);
        setTotalPages(data.totalPages);
      })
      .catch(console.error);
  }, [API_BASE_URL, page]);

  return (
    <div className="people-page">
      <h2 className="people-title">People</h2>

      <div className="people-grid">
        {people.map((person) => (
          <div key={person.id} className="people-card">
            <div className="avatar">
              {person.name?.charAt(0).toUpperCase()}
            </div>

            <h3>{person.name}</h3>
            <p className="team">{person.team}</p>

            <div className="skills">
              {person.skills?.length ? (
                person.skills.map((skill) => (
                  <span key={skill} className="skill-tag">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="skill-tag muted">No skills added</span>
              )}
            </div>

            <div className="stats">
              <span>📄 {person.documentCount} Docs</span>
              <span>❤️ {person.totalLikes} Likes</span>
            </div>

            <div className="actions">
              {/* ✅ OPEN POPUP */}
              <button onClick={() => setSelectedPerson(person)}>
                View Profile
              </button>

              <button
                className="secondary"
                onClick={() =>
                  window.location.href = `/documents?author=${encodeURIComponent(
                    person.email
                  )}`
                }
              >
                View Docs
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 0} onClick={() => setPage(page - 1)}>
            ← Previous
          </button>

          <span>
            Page {page + 1} of {totalPages}
          </span>

          <button
            disabled={page === totalPages - 1}
            onClick={() => setPage(page + 1)}
          >
            Next →
          </button>
        </div>
      )}

      {/* ✅ PROFILE MODAL */}
      {selectedPerson && (
        <div className="modal-overlay" onClick={() => setSelectedPerson(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setSelectedPerson(null)}
            >
              ✕
            </button>

            <div className="modal-avatar">
              {selectedPerson.name.charAt(0).toUpperCase()}
            </div>

            <h2>{selectedPerson.name}</h2>
            <p className="team">{selectedPerson.team}</p>

            <div className="modal-section">
              <strong>Email:</strong>
              <p>{selectedPerson.email}</p>
            </div>

            <div className="modal-section">
              <strong>Skills:</strong>
              <div className="skills">
                {selectedPerson.skills?.length ? (
                  selectedPerson.skills.map((s) => (
                    <span key={s} className="skill-tag">
                      {s}
                    </span>
                  ))
                ) : (
                  <span>No skills added</span>
                )}
              </div>
            </div>

            <div className="modal-stats">
              <span>📄 {selectedPerson.documentCount} Documents</span>
              <span>❤️ {selectedPerson.totalLikes} Likes</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default People;
