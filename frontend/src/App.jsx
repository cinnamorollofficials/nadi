import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { useEffect } from "react";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import AdminLayout from "./layouts/AdminLayout";
import Users from "./pages/admin/Users";
import Roles from "./pages/admin/Roles";
import Permissions from "./pages/admin/Permissions";
import Logs from "./pages/admin/Logs";
import HttpLogs from "./pages/admin/HttpLogs";
import GeneratorPage from "./pages/admin/GeneratorPage";
import { ThemeProvider } from "./context/ThemeContext";
import ProdukPage from "./pages/admin/ProdukPage";
import TwoFAChallengePage from "./pages/TwoFAChallengePage";
import ProfilePage from "./pages/admin/ProfilePage";
import StoragePage from "./pages/admin/StoragePage";
import SharePage from "./pages/SharePage";
import SettingsPage from "./pages/admin/SettingsPage";
import TwoFAResetRequestPage from "./pages/TwoFAResetRequestPage";
import TwoFAResetConfirmPage from "./pages/TwoFAResetConfirmPage";
import VerifyEmail from "./pages/VerifyEmail";

import ApiKeyPage from "./pages/admin/ApiKeyPage";
import UserLayout from "./layouts/UserLayout";
import ClientDashboard from "./pages/client/Dashboard";
import { PERMS } from "./utils/permissions";

/**
 * A wrapper component that checks if the logged-in user has the required permission.
 * If not, it redirects them to the dashboard and shows an error.
 */
function PermissionGuard({ permission, children }) {
  const userData = localStorage.getItem("user");
  if (!userData) return <Navigate to="/login" replace />;
  
  const user = JSON.parse(userData);
  const mask = BigInt(user.permissions_mask || 0n);
  
  const hasPermission = (mask & permission) !== 0n;
  
  // Also check if admin (role_id 1) to allow everything
  if (user.role_id === 1 || hasPermission) {
    return children;
  }
  
  // Show error on next tick to avoid React warnings during render
  setTimeout(() => toast.error("You don't have permission to access that page."), 0);
  return <Navigate to="/dashboard" replace />;
}

import BlogPostPage from './pages/admin/BlogPostPage';
// [GENERATOR_INSERT_IMPORT]

function RoleBasedLayout() {
  const userData = localStorage.getItem("user");
  if (!userData) return <Navigate to="/login" replace />;
  const user = JSON.parse(userData);
  
  // Role ID 1 is Admin, Role ID 3 is User (Module Client User)
  // We'll treat Admin (1) and Auditor (2) as AdminLayout for now, 
  // and Role ID 3 (Client) as UserLayout.
  if (user.role_id === 3) {
    return <UserLayout />;
  }
  
  return <AdminLayout />;
}

function RoleBasedDashboard() {
  const userData = localStorage.getItem("user");
  if (!userData) return <Navigate to="/login" replace />;
  const user = JSON.parse(userData);
  
  if (user.role_id === 3) {
    return <ClientDashboard />;
  }
  
  return <Dashboard />;
}

function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/2fa-challenge" element={<TwoFAChallengePage />} />
        <Route path="/twofa/reset-request" element={<TwoFAResetRequestPage />} />
        <Route path="/twofa/reset-confirm" element={<TwoFAResetConfirmPage />} />

        {/* Dynamic Layout selection based on Role */}
        <Route path="/" element={<RoleBasedLayout />}>
          <Route path="dashboard" element={<RoleBasedDashboard />} />
          <Route path="profile" element={<ProfilePage />} />
          
          {/* Protected Storage Route */}
          <Route 
            path="storage" 
            element={
              <PermissionGuard permission={PERMS.GET_FILE}>
                <StoragePage />
              </PermissionGuard>
            } 
          />
          
          <Route path="admin">
            <Route path="apikeys" element={<ApiKeyPage />} />
            <Route path="users" element={<Users />} />
            <Route path="roles" element={<Roles />} />
            <Route path="permissions" element={<Permissions />} />
            <Route path="logs" element={<Navigate to="/admin/logs/all" replace />} />
            <Route path="logs/http" element={<HttpLogs />} />
            <Route path="logs/:type" element={<Logs />} />
            <Route path="generator" element={<GeneratorPage />} />
            <Route path="produk" element={<ProdukPage />} />
            <Route path="storage" element={<StoragePage />} />
            <Route path="settings" element={<Navigate to="/admin/settings/website" replace />} />
            <Route path="settings/:category" element={<SettingsPage />} />
          </Route>
          
          					<Route path="admin/blogpost" element={<BlogPostPage />} />
					// [GENERATOR_INSERT_ROUTE]
        </Route>

        {/* Public share page — outside layout, no auth required */}
        <Route path="/share/:token" element={<SharePage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
