import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/user/Login.jsx";
import Home from "./pages/user/homePage.jsx";
import UserAnalytics from "./pages/user/UserAnalytics.jsx";
import CreateDocument from "./pages/user/CreateDocument.jsx";
import UserProfile from "./pages/user/Profile.jsx";
import EditDocument from "./pages/user/EditDocument.jsx";
import DocumentView from "./pages/user/DocumentView.jsx";
import SavedDocuments from "./pages/user/SavedDocuments.jsx";
import People from "./pages/user/People.jsx";
import Documents from "./pages/user/Documents.jsx";

import UserLayout from "./components/user/layout/UserLayout.jsx";

// Admin
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import RegisterUser from "./pages/admin/RegisterUser.jsx";
import AdminProfile from "./pages/admin/Profile.jsx";
import ManageUser from "./pages/admin/manageUser.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import FeedBack from "./pages/admin/FeedBack.jsx";

import Snowfall from "react-snowfall";

function App() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<Login />} />

      {/* ONLY Home & Analytics use layout */}
      <Route element={<UserLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/analytics" element={<UserAnalytics />} />
      </Route>

      {/* Standalone pages (NO layout) */}
      <Route path="/create" element={<CreateDocument />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/documents/:id" element={<DocumentView />} />
      <Route path="/documents/edit/:id" element={<EditDocument />} />
      <Route path="/saved" element={<SavedDocuments />} />
      <Route path="/people" element={<People />} />
      <Route path="/documents" element={<Documents />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="register" element={<RegisterUser />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="users" element={<ManageUser />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="feedback" element={<FeedBack />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<h2>Page Not Found</h2>} />
    </Routes>
  );
}

export default App;
