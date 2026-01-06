import { useEffect, useState } from "react";
import "../../styles/admin/manageUser.css";

const USERS_PER_PAGE = 5;

const TEAMS = [
  "Frontend Team",
  "Backend Team",
  "Full Stack Team",
  "Database Team",
  "QA / Testing Team",
  "DevOps Team",
  "UI/UX Design Team",
];

/* ================= EMPLOYMENT DURATION UTILITIES ================= */

const getEmploymentDuration = (createdAt) => {
  if (!createdAt) return "-";

  const start = new Date(createdAt);
  const now = new Date();

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years === 0 && months === 0) return "Less than 1 month";
  if (years === 0) return `${months} month${months > 1 ? "s" : ""}`;
  if (months === 0) return `${years} year${years > 1 ? "s" : ""}`;

  return `${years} year${years > 1 ? "s" : ""} ${months} month${
    months > 1 ? "s" : ""
  }`;
};

const getDurationInMonths = (createdAt) => {
  if (!createdAt) return 0;

  const start = new Date(createdAt);
  const now = new Date();

  const months =
    (now.getFullYear() - start.getFullYear()) * 12 +
    (now.getMonth() - start.getMonth());

  return months < 0 ? 0 : months;
};

function ManageUser() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [durationFilter, setDurationFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  /* ================= FETCH USERS ================= */

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/employees`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Unauthorized");

      const data = await res.json();

      const filteredUsers = data.filter(
        (user) => user.email !== "admin@gmail.com"
      );

      setUsers(filteredUsers);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE USER ================= */

  const deleteUser = async (email) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/employees/${email}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      setUsers((prev) => prev.filter((u) => u.email !== email));
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  /* ================= FILTER + SORT ================= */

  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTeam =
        selectedTeam === "" || user.team === selectedTeam;

      const months = getDurationInMonths(user.createdAt);

      let matchesDuration = true;
      if (durationFilter === "<1") matchesDuration = months < 12;
      if (durationFilter === "1-2")
        matchesDuration = months >= 12 && months <= 24;
      if (durationFilter === ">2") matchesDuration = months > 24;

      return matchesSearch && matchesTeam && matchesDuration;
    })
    .sort((a, b) => {
      if (!sortOrder) return 0;

      const aMonths = getDurationInMonths(a.createdAt);
      const bMonths = getDurationInMonths(b.createdAt);

      return sortOrder === "asc"
        ? aMonths - bMonths
        : bMonths - aMonths;
    });

  /* ================= PAGINATION ================= */

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + USERS_PER_PAGE
  );

  /* ================= CLEAR FILTER ================= */

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTeam("");
    setDurationFilter("");
    setSortOrder("");
    setCurrentPage(1);
  };

  if (loading)
    return <p style={{ textAlign: "center" }}>Loading users...</p>;

  return (
    <div className="manage-user-page">
      <h2>Manage Users</h2>

      {/* ================= FILTER BAR ================= */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        <select
          value={selectedTeam}
          onChange={(e) => {
            setSelectedTeam(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Teams</option>
          {TEAMS.map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
        </select>

        <select
          value={durationFilter}
          onChange={(e) => {
            setDurationFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Durations</option>
          <option value="<1">Less than 1 year</option>
          <option value="1-2">1 – 2 years</option>
          <option value=">2">More than 2 years</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Sort by Duration</option>
          <option value="asc">Shortest First</option>
          <option value="desc">Longest First</option>
        </select>

        <button className="clear-btn" onClick={clearFilters}>
          Clear
        </button>
      </div>

      {/* ================= TABLE ================= */}

      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Team</th>
            <th>Employment Duration</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {currentUsers.length === 0 ? (
            <tr>
              <td colSpan="5">No users found</td>
            </tr>
          ) : (
            currentUsers.map((user) => (
              <tr key={user.email}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.team}</td>
                <td>{getEmploymentDuration(user.createdAt)}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteUser(user.email)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ================= PAGINATION ================= */}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>

          <span>
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ManageUser;
