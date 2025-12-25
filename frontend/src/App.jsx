import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/user/Login.jsx";
import Home from "./pages/user/homePage.jsx";

import UserLayout from "./components/user/layout/UserLayout.jsx";

import AdminLayout from "./pages/admin/AdminLayout.jsx";
import RegisterUser from "./pages/admin/RegisterUser.jsx";
import Profile from "./pages/admin/Profile.jsx";

function App() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<Login />} />

      {/* ONLY Home & Analytics use layout */}
      <Route element={<UserLayout />}>
        <Route path="/home" element={<Home />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="register" replace />} />
        <Route path="register" element={<RegisterUser />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<h2>Page Not Found</h2>} />
    </Routes>
  );
}

export default App;
