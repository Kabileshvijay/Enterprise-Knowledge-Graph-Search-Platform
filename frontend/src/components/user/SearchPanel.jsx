import { FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllDocuments,
  searchDocuments,
} from "../../services/documentService";
import "../../styles/user/SearchPanel.css";

const SearchPanel = ({ onClose }) => {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [allDocs, setAllDocs] = useState([]);
  const [visibleDocs, setVisibleDocs] = useState([]);

  // FILTER STATES
  const [dateFilter, setDateFilter] = useState("all");
  const [tagInput, setTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [selectedContributor, setSelectedContributor] = useState("");
  const [selectedSpace, setSelectedSpace] = useState("");

  // PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  /* ================= LOAD ALL DOCUMENTS ================= */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await getAllDocuments();
        const docs = Array.isArray(data) ? data : [];

        setAllDocs(docs);
        setVisibleDocs(docs);

        const uniqueContributors = [
          ...new Set(docs.map((doc) => doc.authorName).filter(Boolean)),
        ];
        setContributors(uniqueContributors);
      } catch (err) {
        console.error("Failed to load documents", err);
        navigate("/");
      }
    };

    fetchAll();
  }, [navigate]);

  /* ================= APPLY SEARCH + FILTERS ================= */
  useEffect(() => {
    const applyFilters = async () => {
      let docs = [];

      // SEARCH
      if (query.trim() !== "") {
        try {
          const results = await searchDocuments(query);
          docs = Array.isArray(results) ? results : [];
        } catch {
          docs = allDocs;
        }
      } else {
        docs = [...allDocs];
      }

      // SPACE FILTER
      if (selectedSpace) {
        docs = docs.filter((doc) => doc.category === selectedSpace);
      }

      // DATE FILTER
      if (dateFilter !== "all") {
        const now = new Date();

        docs = docs.filter((doc) => {
          if (!doc.createdAt) return false;

          const created = new Date(
            doc.createdAt.replace(" ", "T").split(".")[0]
          );

          const diffDays = (now - created) / (1000 * 60 * 60 * 24);

          if (dateFilter === "day") return diffDays <= 1;
          if (dateFilter === "week") return diffDays <= 7;
          if (dateFilter === "month") return diffDays <= 30;

          return true;
        });
      }

      // TAG FILTER
      if (selectedTags.length > 0) {
        docs = docs.filter((doc) => {
          if (!doc.tags) return false;

          const docTags = doc.tags
            .split(",")
            .map((t) => t.trim().toLowerCase());

          return selectedTags.every((tag) =>
            docTags.includes(tag.toLowerCase())
          );
        });
      }

      // CONTRIBUTOR FILTER
      if (selectedContributor) {
        docs = docs.filter((doc) => doc.authorName === selectedContributor);
      }

      setVisibleDocs(docs);
      setCurrentPage(1);
    };

    applyFilters();
  }, [
    query,
    selectedSpace,
    dateFilter,
    selectedTags,
    selectedContributor,
    allDocs,
  ]);

  /* ================= TAG HANDLERS ================= */
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();

      if (!selectedTags.includes(tagInput.trim())) {
        setSelectedTags([...selectedTags, tagInput.trim()]);
      }

      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setSelectedTags(selectedTags.filter((t) => t !== tagToRemove));
  };

  /* ================= CLEAR FILTERS ================= */
  const clearFilters = () => {
    setQuery("");
    setSelectedSpace("");
    setDateFilter("all");
    setSelectedTags([]);
    setTagInput("");
    setSelectedContributor("");
    setVisibleDocs(allDocs);
    setCurrentPage(1);
  };

  const hasActiveFilters = () => {
    return (
      selectedSpace ||
      dateFilter !== "all" ||
      selectedTags.length > 0 ||
      selectedContributor ||
      query.trim()
    );
  };

  /* ================= PAGINATION LOGIC ================= */
  const totalPages = Math.ceil(visibleDocs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDocs = visibleDocs.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="search-body">
          <div className="filters">
            <p>FILTER BY</p>

            <select
              value={selectedSpace}
              onChange={(e) => setSelectedSpace(e.target.value)}
            >
              <option value="">Space</option>
              <option value="Engineering">Engineering</option>
              <option value="Analytics">Analytics</option>
              <option value="Architecture">Architecture</option>
              <option value="Runbooks">Runbooks</option>
            </select>

            <select
              value={selectedContributor}
              onChange={(e) => setSelectedContributor(e.target.value)}
            >
              <option value="">Contributor</option>
              {contributors.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
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

            {currentDocs.length > 0 ? (
              <>
                {currentDocs
                  .filter((doc) => doc.status === "PUBLISHED")
                  .map((doc) => (
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
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>

                    {getPageNumbers().map((page, index) => (
                      <button
                        key={index}
                        className={`pagination-btn ${
                          page === currentPage ? "active" : ""
                        }`}
                        onClick={() =>
                          typeof page === "number" && goToPage(page)
                        }
                        disabled={page === "..."}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      className="pagination-btn"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
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
