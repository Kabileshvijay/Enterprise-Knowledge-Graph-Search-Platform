import { Link } from "react-router-dom";
import "../../styles/admin/sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <ul>
        <li>
          <Link to="/admin/register">Register User</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
