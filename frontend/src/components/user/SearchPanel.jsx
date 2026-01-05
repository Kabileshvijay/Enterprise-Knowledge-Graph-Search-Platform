import { FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  searchDocumentsBackend,
  getContributors
} from "../../services/documentService";
import "../../styles/user/searchPanel.css";

const SearchPanel = ({ onClose }) => {
  const navigate = useNavigate();

  // SEARCH & FILTER STATES
  const [query, setQuery] = useState("");
  const [selectedSpace, setSelectedSpace] = useState("");
  const [selectedContributor, setSelectedContributor] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  const [tagInput, setTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  // RESULTS
  const [documents, setDocuments] = useState([]);
  const [contributors, setContributors] = useState([]);

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10;

  /* ================= LOAD CONTRIBUTORS (ONCE) ================= */
  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const data = await getContributors();
        setContributors(data);
      } catch (err) {
        console.error("Failed to load contributors", err);
      }
    };

    fetchContributors();
  }, []);

  /* ================= FETCH SEARCH RESULTS ================= */
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await searchDocumentsBackend({
          q: query || null,
          space: selectedSpace || null,
          contributor: selectedContributor || null,
          tags: selectedTags.length ? selectedTags.join(",") : null,
          date: dateFilter !== "all" ? dateFilter : null,
          page: currentPage - 1,
          size: itemsPerPage,
        });

        setDocuments(data.content || []);
        setTotalPages(data.totalPages || 0);
      } catch (err) {
        console.error("Search failed", err);
      }
    };

    fetchResults();
  }, [
    query,
    selectedSpace,
    selectedContributor,
    selectedTags,
    dateFilter,
    currentPage,
  ]);

  /* ================= TAG HANDLERS ================= */
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!selectedTags.includes(tagInput.trim())) {
        setSelectedTags([...selectedTags, tagInput.trim()]);
      }
      setTagInput("");
      setCurrentPage(1);
    }
  };

  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
    setCurrentPage(1);
  };

  /* ================= CLEAR FILTERS ================= */
  const clearFilters = () => {
    setQuery("");
    setSelectedSpace("");
    setSelectedContributor("");
    setDateFilter("all");
    setSelectedTags([]);
    setTagInput("");
    setCurrentPage(1);
  };

  const hasActiveFilters = () =>
    query.trim() ||
    selectedSpace ||
    selectedContributor ||
    selectedTags.length ||
    dateFilter !== "all";

  /* ================= PAGINATION ================= */
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-panel" onClick={(e) => e.stopPropagation()}>
        <div className="search-header">
          <h3>Search</h3>
          <FaTimes className="close-icon" onClick={onClose} />
        </div>

        <input
          type="text"
          className="search-input"
          placeholder="Search"
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setCurrentPage(1);
          }}
        />

        <div className="search-body">
          <div className="filters">
            <p>FILTER BY</p>

            <select value={selectedSpace} onChange={(e) => setSelectedSpace(e.target.value)}>
              <option value="">Space</option>
              <option value="Engineering">Engineering</option>
              <option value="Analytics">Analytics</option>
              <option value="Architecture">Architecture</option>
              <option value="Runbooks">Runbooks</option>
            </select>

            <select
              value={selectedContributor}
              onChange={(e) => {
                setSelectedContributor(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">Contributor</option>
              {contributors.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select value={dateFilter} onChange={(e) => {
              setDateFilter(e.target.value);
              setCurrentPage(1);
            }}>
              <option value="all">Date</option>
              <option value="day">Past 24 hours</option>
              <option value="week">Past week</option>
              <option value="month">Past month</option>
            </select>

            <input
              type="text"
              className="tag-input"
              placeholder="Label"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
            />

            {selectedTags.length > 0 && (
              <div className="tag-chips">
                {selectedTags.map((tag) => (
                  <span key={tag} className="tag-chip">
                    {tag}
                    <FaTimes onClick={() => removeTag(tag)} />
                  </span>
                ))}
              </div>
            )}

            {hasActiveFilters() && (
              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear filters
              </button>
            )}
          </div>

          <div className="results">
            <p className="section-title">
              {hasActiveFilters() ? "SEARCH RESULTS" : "RECENTLY VISITED"}
            </p>

            {documents.length > 0 ? (
              <>
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="search-result-item"
                    onClick={() => {
                      onClose();
                      navigate(`/documents/${doc.id}`);
                    }}
                  >
                    <p className="result-title">{doc.title}</p>
                    <p className="result-space">{doc.category}</p>
                  </div>
                ))}

                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      disabled={currentPage === 1}
                      onClick={() => goToPage(currentPage - 1)}
                    >
                      Previous
                    </button>

                    {getPageNumbers().map((p, i) => (
                      <button
                        key={i}
                        className={`pagination-btn ${p === currentPage ? "active" : ""}`}
                        disabled={p === "..."}
                        onClick={() => typeof p === "number" && goToPage(p)}
                      >
                        {p}
                      </button>
                    ))}

                    <button
                      className="pagination-btn"
                      disabled={currentPage === totalPages}
                      onClick={() => goToPage(currentPage + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="empty-state">No documents found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
