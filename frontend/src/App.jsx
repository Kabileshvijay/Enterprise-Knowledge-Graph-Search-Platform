import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Home from "./pages/homePage.jsx";

import AdminLayout from "./admin/pages/AdminLayout.jsx";
import RegisterUser from "./admin/pages/RegisterUser.jsx";
import Profile from "./admin/pages/Profile.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />

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
