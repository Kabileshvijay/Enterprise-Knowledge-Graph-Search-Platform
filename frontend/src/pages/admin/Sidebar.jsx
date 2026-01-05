import { Link } from "react-router-dom";
import "../../styles/admin/adminSidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <ul>
        <li>
          <Link to="/admin/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/admin/register">Register User</Link>
        </li>
        <li>
          <Link to="/admin/users">Manage User</Link>
        </li>
        <li>
          <Link to="/admin/feedback">Feedback</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
