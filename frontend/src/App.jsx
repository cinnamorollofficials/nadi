import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
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
import PublicLayout from "./layouts/PublicLayout";
import ClientDashboard from "./pages/client/Dashboard";
import MedicpediaHome from "./pages/client/medicpedia/MedicpediaHome";
import { PERMS } from "./utils/permissions";

// Admin pages
import BlogPostPage from "./pages/admin/BlogPostPage";
import MedicpediaPenyakitPage from "./pages/admin/MedicpediaPenyakitPage";
import MedicpediaNutrisiPage from "./pages/admin/MedicpediaNutrisiPage";
import FaqPage from './pages/admin/FaqPage';
// [GENERATOR_INSERT_IMPORT]

// Client / reader pages
import PenyakitList from "./pages/client/medicpedia/PenyakitList";
import PenyakitDetail from "./pages/client/medicpedia/PenyakitDetail";
import NutrisiList from "./pages/client/medicpedia/NutrisiList";
import NutrisiDetail from "./pages/client/medicpedia/NutrisiDetail";
import PublicFaqPage from "./pages/client/FaqPage";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFoundPage from "./pages/NotFoundPage";

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

  if (user.role_id === 1 || hasPermission) {
    return children;
  }

  setTimeout(
    () => toast.error("You don't have permission to access that page."),
    0,
  );
  return <Navigate to="/dashboard" replace />;
}

function RoleBasedLayout() {
  const userData = localStorage.getItem("user");
  if (!userData) return <Navigate to="/login" replace />;
  const user = JSON.parse(userData);

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
        {/* Public Routes with Shared Layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/medicpedia" element={<MedicpediaHome />} />
          <Route path="/medicpedia/penyakit" element={<PenyakitList />} />
          <Route
            path="/medicpedia/penyakit/:slug"
            element={<PenyakitDetail />}
          />
          <Route path="/medicpedia/nutrisi" element={<NutrisiList />} />
          <Route path="/medicpedia/nutrisi/:slug" element={<NutrisiDetail />} />
          <Route path="/faq" element={<PublicFaqPage />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Route>

        {/* Public standalone pages (No shared layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/2fa-challenge" element={<TwoFAChallengePage />} />
        <Route
          path="/twofa/reset-request"
          element={<TwoFAResetRequestPage />}
        />
        <Route
          path="/twofa/reset-confirm"
          element={<TwoFAResetConfirmPage />}
        />

        {/* Dynamic Layout based on Role (Logged-in only) */}
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

          {/* Admin Routes */}
          <Route path="admin">
            <Route path="apikeys" element={<ApiKeyPage />} />
            <Route path="users" element={<Users />} />
            <Route path="roles" element={<Roles />} />
            <Route path="permissions" element={<Permissions />} />
            <Route
              path="logs"
              element={<Navigate to="/admin/logs/all" replace />}
            />
            <Route path="logs/http" element={<HttpLogs />} />
            <Route path="logs/:type" element={<Logs />} />
            <Route path="generator" element={<GeneratorPage />} />
            <Route path="storage" element={<StoragePage />} />
            <Route
              path="settings"
              element={<Navigate to="/admin/settings/website" replace />}
            />
            <Route path="settings/:category" element={<SettingsPage />} />
            <Route path="blogpost" element={<BlogPostPage />} />
            <Route
              path="medicpediapenyakit"
              element={<MedicpediaPenyakitPage />}
            />
            <Route
              path="medicpedianutrisi"
              element={<MedicpediaNutrisiPage />}
            />
            <Route path="faq" element={<FaqPage />} />
            {/* [GENERATOR_INSERT_ROUTE] */}
          </Route>
        </Route>

        {/* Public share page — outside layout, no auth required */}
        <Route path="/share/:token" element={<SharePage />} />

        {/* 404 Catch All */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
