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
        // 🚫 EXCLUDE ADMIN USER
        const filteredPeople = data.content.filter(
          (person) => person.email !== "admin@gmail.com"
        );

        setPeople(filteredPeople);
        setTotalPages(data.totalPages);
      })
      .catch(console.error);
  }, [API_BASE_URL, page]);

  return (
    <div id="people-page" className="people-page">
      <h2 className="people-title">People</h2>

      <div className="people-grid">
        {people.map((person) => (
          <div key={person.id} className="people-card">
            <div className="people-avatar">
              {person.name?.charAt(0).toUpperCase()}
            </div>

            <h3 className="people-name">{person.name}</h3>
            <p className="people-team">{person.team}</p>

            <div className="people-skills">
              {person.skills?.length ? (
                person.skills.map((skill) => (
                  <span key={skill} className="people-skill-tag">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="people-skill-tag muted">
                  No skills added
                </span>
              )}
            </div>

            <div className="people-stats">
              <span>📄 {person.documentCount} Docs</span>
              <span>❤️ {person.totalLikes} Likes</span>
            </div>

            <div className="people-actions">
              <button onClick={() => setSelectedPerson(person)}>
                View Profile
              </button>

              <button
                className="people-secondary-btn"
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
        <div className="people-pagination">
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
        <div
          className="people-modal-overlay"
          onClick={() => setSelectedPerson(null)}
        >
          <div
            className="people-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="people-modal-close"
              onClick={() => setSelectedPerson(null)}
            >
              ✕
            </button>

            <div className="people-modal-avatar">
              {selectedPerson.name.charAt(0).toUpperCase()}
            </div>

            <h2>{selectedPerson.name}</h2>
            <p className="people-team">{selectedPerson.team}</p>

            <div className="people-modal-section">
              <strong>Email:</strong>
              <p>{selectedPerson.email}</p>
            </div>

            <div className="people-modal-section">
              <strong>Skills:</strong>
              <div className="people-skills">
                {selectedPerson.skills?.length ? (
                  selectedPerson.skills.map((s) => (
                    <span key={s} className="people-skill-tag">
                      {s}
                    </span>
                  ))
                ) : (
                  <span>No skills added</span>
                )}
              </div>
            </div>

            <div className="people-modal-stats">
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
