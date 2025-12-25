import Navbar from "../Navbar.jsx";
import Sidebar from "../Sidebar.jsx";
import './layout.css';
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <>
      <Navbar />
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default UserLayout;
