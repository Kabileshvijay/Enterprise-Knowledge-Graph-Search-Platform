import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/user/Login.jsx";
import Home from "./pages/user/homePage.jsx";
import CreateDocument from "./pages/user/CreateDocument.jsx";

import UserLayout from "./components/user/layout/UserLayout.jsx";

import AdminLayout from "./pages/admin/AdminLayout.jsx";
import RegisterUser from "./pages/admin/RegisterUser.jsx";
import Profile from "./pages/admin/Profile.jsx";

function App() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<Login />} />

      {/* Only Pages use layout */}
      <Route element={<UserLayout />}>
        <Route path="/home" element={<Home />} />
      </Route>

      {/* Standalone pages (NO layout) */}
      <Route path="/create" element={<CreateDocument />} />
      
      {/* Admin Pages */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="register" replace />} />
        <Route path="register" element={<RegisterUser />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<h2>Page Not Found</h2>} />
    </Routes>
  );
}

export default App;
