import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AiConsultation from "./pages/client/AiConsultation";
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
import MedicpediaHome from "./pages/client/medicpedia/MedicpediaHome";
import { PERMS } from "./utils/permissions";
import { ROLES } from "./utils/constants";
import { safeParse } from "./utils/json";

// Admin pages
import BlogPostPage from "./pages/admin/BlogPostPage";
import MedicpediaPenyakitPage from "./pages/admin/MedicpediaPenyakitPage";
import MedicpediaNutrisiPage from "./pages/admin/MedicpediaNutrisiPage";
import FaqPage from "./pages/admin/FaqPage";
import RedisServicePage from "./pages/admin/RedisServicePage";
import KafkaServicePage from "./pages/admin/KafkaServicePage";
import AiUsage from "./pages/admin/AiUsage";
// [GENERATOR_INSERT_IMPORT]

// Client / reader pages
import PenyakitList from "./pages/client/medicpedia/PenyakitList";
import PenyakitDetail from "./pages/client/medicpedia/PenyakitDetail";
import NutrisiList from "./pages/client/medicpedia/NutrisiList";
import NutrisiDetail from "./pages/client/medicpedia/NutrisiDetail";
import PublicFaqPage from "./pages/client/FaqPage";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import About from "./pages/About";
import NotFoundPage from "./pages/NotFoundPage";

/**
 * A wrapper component that checks if the logged-in user has the required permission.
 * If not, it redirects them to the dashboard and shows an error.
 */
function PermissionGuard({ permission, children }) {
  const userData = localStorage.getItem("user");
  if (!userData) return <Navigate to="/login" replace />;

  try {
    const user = safeParse(userData);
    const mask = BigInt(user.permissions_mask || 0n);

    const checkPermission = (p) => {
      if (Array.isArray(p)) return p.some((perm) => (mask & perm) !== 0n);
      return (mask & p) !== 0n;
    };

    const hasPermission = checkPermission(permission);

    if (user.role_id === ROLES.SUPERADMIN || hasPermission) {
      return children;
    }

    setTimeout(
      () => toast.error("You don't have permission to access that page."),
      0,
    );
    return <Navigate to="/consultations/ai" replace />;
  } catch (error) {
    console.error("Auth redirection error:", error);
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }
}

function RoleBasedLayout() {
  const userData = localStorage.getItem("user");
  if (!userData) return <Navigate to="/login" replace />;
  
  try {
    const user = safeParse(userData);
    if (user.role_id === ROLES.USER) {
      return <UserLayout />;
    }
    return <AdminLayout />;
  } catch (error) {
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }
}

function RoleBasedDashboard() {
  const userData = localStorage.getItem("user");
  if (!userData) return <Navigate to="/login" replace />;
  
  try {
    const user = safeParse(userData);
    if (user.role_id === ROLES.USER) {
      return <Navigate to="/consultations/ai" replace />;
    }
    return <Dashboard />;
  } catch (error) {
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }
}

function AdminGuard({ children }) {
  const userData = localStorage.getItem("user");
  if (!userData) return <Navigate to="/login" replace />;
  
  try {
    const user = safeParse(userData);
    if (user.role_id === ROLES.USER) {
      setTimeout(
        () => toast.error("Role 'User' is not allowed to access administration."),
        0,
      );
      return <Navigate to="/consultations/ai" replace />;
    }
    return children || <Outlet />;
  } catch (error) {
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }
}

function App() {
  return (
    <GoogleOAuthProvider
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "PLACEHOLDER"}
    >
      <ThemeProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/2fa-challenge" element={<TwoFAChallengePage />} />
          <Route path="/2fa-reset-request" element={<TwoFAResetRequestPage />} />
          <Route path="/2fa-reset-confirm" element={<TwoFAResetConfirmPage />} />

          {/* Standalone Route for Auth Checks (Priority) */}
          <Route path="/" element={localStorage.getItem("token") ? <Navigate to="/consultations/ai" replace /> : <PublicLayout />}>
            <Route index element={<Landing />} />
            <Route path="medicpedia" element={<MedicpediaHome />} />
            <Route path="medicpedia/penyakit" element={<PenyakitList />} />
            <Route
              path="medicpedia/penyakit/:slug"
              element={<PenyakitDetail />}
            />
            <Route path="medicpedia/nutrisi" element={<NutrisiList />} />
            <Route
              path="medicpedia/nutrisi/:slug"
              element={<NutrisiDetail />}
            />
            <Route path="faq" element={<PublicFaqPage />} />
            <Route path="terms" element={<TermsConditions />} />
            <Route path="privacy" element={<PrivacyPolicy />} />
            <Route path="about" element={<About />} />
          </Route>

          {/* Dynamic Layout based on Role (Logged-in only) */}
          <Route path="/" element={<RoleBasedLayout />}>
            <Route path="consultations/ai" element={<AiConsultation />} />
            <Route path="consultations/ai/:id" element={<AiConsultation />} />
            <Route path="profile" element={<ProfilePage />} />

            {/* Protected Storage Route */}
            <Route
              path="storage"
              element={
                <PermissionGuard permission={PERMS.STORAGE_VIEW}>
                  <StoragePage />
                </PermissionGuard>
              }
            />

            {/* Admin Routes */}
            <Route path="admin" element={<AdminGuard />}>
              <Route index element={<Dashboard />} />
              <Route
                path="apikeys"
                element={
                  <PermissionGuard permission={PERMS.APIKEY_VIEW}>
                    <ApiKeyPage />
                  </PermissionGuard>
                }
              />
              <Route
                path="users"
                element={
                  <PermissionGuard permission={PERMS.USER_VIEW}>
                    <Users />
                  </PermissionGuard>
                }
              />
              <Route
                path="roles"
                element={
                  <PermissionGuard permission={PERMS.ROLE_VIEW}>
                    <Roles />
                  </PermissionGuard>
                }
              />
              <Route
                path="permissions"
                element={
                  <PermissionGuard permission={PERMS.PERMISSION_VIEW}>
                    <Permissions />
                  </PermissionGuard>
                }
              />
              <Route
                path="logs"
                element={<Navigate to="/admin/logs/all" replace />}
              />
              <Route
                path="logs/http"
                element={
                  <PermissionGuard permission={PERMS.LOG_HTTP}>
                    <HttpLogs />
                  </PermissionGuard>
                }
              />
              <Route
                path="logs/:type"
                element={
                  <PermissionGuard
                    permission={[
                      PERMS.LOG_SYSTEM,
                      PERMS.LOG_AUDIT,
                      PERMS.LOG_HTTP,
                    ]}
                  >
                    <Logs />
                  </PermissionGuard>
                }
              />
              <Route
                path="generator"
                element={
                  <PermissionGuard permission={PERMS.SYSTEM_GEN}>
                    <GeneratorPage />
                  </PermissionGuard>
                }
              />
              <Route
                path="storage"
                element={
                  <PermissionGuard permission={PERMS.STORAGE_VIEW}>
                    <StoragePage />
                  </PermissionGuard>
                }
              />
              <Route
                path="settings"
                element={<Navigate to="/admin/settings/website" replace />}
              />
              <Route
                path="settings/:category"
                element={
                  <PermissionGuard
                    permission={[
                      PERMS.SETTING_VIEW_WEBSITE,
                      PERMS.SETTING_VIEW_SMTP,
                      PERMS.SETTING_VIEW_STORAGE,
                      PERMS.SETTING_VIEW_SECURITY,
                      PERMS.SETTING_VIEW_INFRA,
                      PERMS.SETTING_VIEW_ADVANCE,
                    ]}
                  >
                    <SettingsPage />
                  </PermissionGuard>
                }
              />
              <Route
                path="blogpost"
                element={
                  <PermissionGuard permission={PERMS.BLOGPOST_VIEW}>
                    <BlogPostPage />
                  </PermissionGuard>
                }
              />
              <Route
                path="medicpediapenyakit"
                element={
                  <PermissionGuard permission={PERMS.PENYAKIT_VIEW}>
                    <MedicpediaPenyakitPage />
                  </PermissionGuard>
                }
              />
              <Route
                path="medicpedianutrisi"
                element={
                  <PermissionGuard permission={PERMS.NUTRISI_VIEW}>
                    <MedicpediaNutrisiPage />
                  </PermissionGuard>
                }
              />
              <Route
                path="faq"
                element={
                  <PermissionGuard permission={PERMS.FAQ_VIEW}>
                    <FaqPage />
                  </PermissionGuard>
                }
              />

              {/* Services Monitoring */}
              <Route
                path="services/redis"
                element={
                  <PermissionGuard permission={PERMS.SERVICE_VIEW_REDIS}>
                    <RedisServicePage />
                  </PermissionGuard>
                }
              />
              <Route
                path="services/kafka"
                element={
                  <PermissionGuard permission={PERMS.SERVICE_VIEW_KAFKA}>
                    <KafkaServicePage />
                  </PermissionGuard>
                }
              />
              <Route
                path="ai-usage"
                element={
                  <PermissionGuard permission={PERMS.SYSTEM_STAT}>
                    <AiUsage />
                  </PermissionGuard>
                }
              />

              {/* [GENERATOR_INSERT_ROUTE] */}
            </Route>
          </Route>

          {/* Public share page — outside layout, no auth required */}
          <Route path="/share/:token" element={<SharePage />} />

          {/* 404 Catch All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
