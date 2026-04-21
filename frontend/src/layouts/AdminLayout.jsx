import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, Outlet, useLocation, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getHealthStatus, getMe } from "../api/admin";
import { useTheme } from "../context/ThemeContext";
import { useSettings } from "../context/SettingsContext";
import { PERMS } from "../utils/permissions";
import { safeStringify } from "../utils/json";
import { ROLES } from "../utils/constants";
import { safeParse } from "../utils/json";

const AdminLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const { app_name, logo } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const historyItems = [
    {
      id: 1,
      label: "Demam Panas Lebih dari 3 Hari",
      path: "/new-check?id=1",
    },
    {
      id: 2,
      label: "Sakit Kepala Sebelah Kiri",
      path: "/new-check?id=2",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      ),
    },
    {
      id: 3,
      label: "Nyeri Punggung Bawah",
      path: "/new-check?id=3",
      icon: (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      ),
    },
  ];

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  // Function to refresh user profile and permissions from server
  const refreshUserData = useCallback(async () => {
    try {
      const response = await getMe();
      if (response.success && response.data) {
        const updatedUser = response.data;
        setUser(updatedUser);
        localStorage.setItem("user", safeStringify(updatedUser));
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  }, []);

  // Periodic refresh of user metadata (every 60 seconds)
  useEffect(() => {
    const interval = setInterval(refreshUserData, 60000);
    return () => clearInterval(interval);
  }, [refreshUserData]);

  // Auto-collapse sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      setSidebarCollapsed(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      navigate("/login");
      return;
    }

    if (userData) {
      try {
        const parsedUser = safeParse(userData);
        setUser(parsedUser);

        // Secondary safety check: Redirect 'user' role out of admin layout
        if (parsedUser.role_id === ROLES.USER) {
          navigate("/consultations/ai");
        }
      } catch (err) {
        console.error("Admin layout auth parsing error:", err);
        localStorage.removeItem("user");
        navigate("/login");
      }
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const { logoutApi } = await import("../api/auth");
      await logoutApi("user_clicked");
    } catch (err) {
      console.error("Logout API failed:", err);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  // Determine dynamic page title based on route
  const pageTitle = useMemo(() => {
    const path = location.pathname;
    let title = "Dashboard";

    if (path.includes("/admin/users")) title = "Users Management";
    else if (path.includes("/admin/roles")) title = "Roles & Access";
    else if (path.includes("/admin/permissions")) title = "Permissions Matrix";
    else if (path.includes("/admin/apikeys")) title = "API Security Keys";
    else if (path.includes("/admin/settings")) title = "System Settings";
    else if (path.includes("/admin/storage")) title = "Cloud Storage";
    else if (path.includes("/profile")) title = "User Profile";
    else if (path.includes("/new-check"))
      title = "Demam Panas Lebih dari 3 Hari";
    else if (path.includes("/history")) title = "Assessment History";

    // Special handling for dynamic settings categories
    if (path.startsWith("/admin/settings/")) {
      const category = path.split("/").pop();
      title =
        category.charAt(0).toUpperCase() + category.slice(1) + " Configuration";
    }

    return title;
  }, [location.pathname]);

  // Update document title dynamically
  useEffect(() => {
    document.title = `${pageTitle} | ${app_name}`;
  }, [pageTitle, app_name]);

  // Navigation Configuration
  const navigationSections = [
    {
      label: "Main",
      items: [
        {
          path: "/admin",
          label: "Dashboard",
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          ),
        },
      ],
    },
    {
      label: "Management",
      items: [
        {
          label: "Administrator",
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          ),
          permission: [
            PERMS.USER_VIEW,
            PERMS.ROLE_VIEW,
            PERMS.PERMISSION_VIEW,
            PERMS.APIKEY_VIEW,
          ],
          subItems: [
            {
              path: "/admin/users",
              label: "Users",
              permission: PERMS.USER_VIEW,
              icon: (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ),
            },
            {
              path: "/admin/roles",
              label: "Roles",
              permission: PERMS.ROLE_VIEW,
              icon: (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              ),
            },
            {
              path: "/admin/permissions",
              label: "Permissions",
              permission: PERMS.PERMISSION_VIEW,
              icon: (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              ),
            },
            {
              path: "/admin/apikeys",
              label: "API Keys",
              permission: PERMS.APIKEY_VIEW,
              icon: (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                  />
                </svg>
              ),
            },
          ],
        },

        // [GENERATOR_INSERT_ADMIN_ITEM]
      ],
    },
    {
      label: "CMS",
      items: [
        {
          label: "Medicpedia",
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          ),
          permission: [PERMS.PENYAKIT_VIEW, PERMS.NUTRISI_VIEW],
          subItems: [
            {
              path: "/admin/medicpediapenyakit",
              label: "Penyakit A-Z",
              permission: PERMS.PENYAKIT_VIEW,
              icon: (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ),
            },
            {
              path: "/admin/medicpedianutrisi",
              label: "Nutrisi A-Z",
              permission: PERMS.NUTRISI_VIEW,
              icon: (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              ),
            },
          ],
        },
        {
          label: "BlogPost",
          path: "/admin/blogpost",
          permission: PERMS.BLOGPOST_VIEW,
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          ),
        },

        {
          label: "FAQ",
          path: "/admin/faq",
          permission: PERMS.FAQ_VIEW,
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        },
        {
          label: "Storage",
          path: "/admin/storage",
          permission: PERMS.STORAGE_VIEW,
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
          ),
        },
      ],
    },
    {
      label: "System & Operations",
      items: [
        {
          label: "Settings",
          permission: [
            PERMS.SETTING_VIEW_WEBSITE,
            PERMS.SETTING_VIEW_SMTP,
            PERMS.SETTING_VIEW_STORAGE,
            PERMS.SETTING_VIEW_SECURITY,
            PERMS.SETTING_VIEW_INFRA,
            PERMS.SETTING_VIEW_ADVANCE,
          ],
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          ),
          subItems: [
            {
              path: "/admin/settings/website",
              label: "Website",
              permission: PERMS.SETTING_VIEW_WEBSITE,
              icon: (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              ),
            },
            {
              path: "/admin/settings/smtp",
              label: "Email (SMTP)",
              permission: PERMS.SETTING_VIEW_SMTP,
              icon: (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              ),
            },
            {
              path: "/admin/settings/storage",
              label: "Storages",
              permission: PERMS.SETTING_VIEW_STORAGE,
              icon: (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
              ),
            },
            {
              path: "/admin/settings/security",
              label: "Security",
              permission: PERMS.SETTING_VIEW_SECURITY,
              icon: (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              ),
            },
            {
              path: "/admin/settings/internal",
              label: "Infrastructure",
              permission: PERMS.SETTING_VIEW_INFRA,
              icon: (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                  />
                </svg>
              ),
            },
            {
              path: "/admin/settings/advance",
              label: "Advanced",
              permission: PERMS.SETTING_VIEW_ADVANCE,
              icon: (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              ),
            },
          ],
        },
        {
          label: "Services",
          permission: [PERMS.SERVICE_VIEW_REDIS, PERMS.SERVICE_VIEW_KAFKA],
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
              />
            </svg>
          ),
          subItems: [
            {
              path: "/admin/services/redis",
              label: "Redis",
              permission: PERMS.SERVICE_VIEW_REDIS,
              icon: (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
              ),
            },
            {
              path: "/admin/services/kafka",
              label: "Kafka",
              permission: PERMS.SERVICE_VIEW_KAFKA,
              icon: (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              ),
            },
          ],
        },
        {
          label: "Logs",
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          ),
          permission: [PERMS.LOG_AUDIT, PERMS.LOG_SYSTEM, PERMS.LOG_HTTP],
          subItems: [
            {
              path: "/admin/logs/audit",
              label: "Audit",
              permission: PERMS.LOG_AUDIT,
              icon: (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              ),
            },
            {
              path: "/admin/logs/system",
              label: "System",
              permission: PERMS.LOG_SYSTEM,
              icon: (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              ),
            },
            {
              path: "/admin/logs/http",
              label: "HTTP",
              permission: PERMS.LOG_HTTP,
              icon: (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              ),
            },
          ],
        },
        {
          path: "/admin/generator",
          label: "Module Generator",
          permission: PERMS.SYSTEM_GEN,
          icon: (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          ),
        },
      ],
    },
  ];

  const filteredNavigation = useMemo(() => {
    const filteredHistory = historyItems.filter((item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const historySection = {
      label: "Recent Conversations",
      items: filteredHistory,
    };

    if (!user || user.role_id === ROLES.SUPERADMIN) {
      return [historySection, ...navigationSections];
    }

    const checkPermission = (item) => {
      if (item.permission === undefined) return true;
      if (!user.permissions_mask) return false;
      const mask = BigInt(user.permissions_mask);

      if (typeof item.permission === "bigint")
        return (mask & item.permission) !== 0n;
      if (Array.isArray(item.permission))
        return item.permission.some((p) => (mask & p) !== 0n);
      return false;
    };

    const filterItems = (items) => {
      return items
        .map((item) => {
          if (item.subItems) {
            const filteredSubItems = filterItems(item.subItems);
            return filteredSubItems.length > 0
              ? { ...item, subItems: filteredSubItems }
              : null;
          }
          return checkPermission(item) ? item : null;
        })
        .filter(Boolean);
    };

    const baseSections = navigationSections
      .map((section) => ({
        ...section,
        items: filterItems(section.items),
      }))
      .filter((section) => section.items.length > 0);

    return [historySection, ...baseSections];
  }, [user, searchQuery]);

  if (!user) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-primary-500 animate-pulse">
          Loading MD3 Expressive...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        sections={filteredNavigation}
        title={app_name}
        logo={logo}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={toggleTheme}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onSearch={setSearchQuery}
        headerAction={
          <button
            onClick={() => navigate("/new-check")}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-primary text-on-primary rounded-2xl font-bold   group hover:brightness-110 active:scale-95 transition-all duration-300"
          >
            <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <span className="text-[13px] tracking-tight">New Conversation</span>
          </button>
        }
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-surface relative">
        {/* Compact Header (MD3 Layered Style) */}
        <header className="h-14 flex items-center justify-between px-4 lg:px-6 bg-surface-container-low border-b border-outline-variant/30 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-surface-variant/30 text-surface-on-variant transition-all duration-200 active:scale-95"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className="flex flex-col gap-0.5 mt-0.5">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-sm font-bold text-surface-on truncate max-w-[180px] lg:max-w-none">
                  {pageTitle}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-surface-variant/30 text-surface-on-variant transition-all duration-200 active:scale-95"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 3v1m0 16v1m9-9h1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              )}
            </button>

            <div className="flex items-center gap-3 pl-2 border-l border-outline-variant/30">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-bold text-surface-on truncate max-w-[150px]">
                  {user.email}
                </span>
                <span className="text-[10px] text-surface-on-variant font-bold uppercase tracking-tighter opacity-70">
                  Administrator
                </span>
              </div>
              <Link
                to="/profile"
                className="relative group p-0.5 rounded-full border border-outline-variant/30 hover:border-primary/50 transition-all active:scale-95"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs group-hover:bg-primary/20 transition-colors">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                {/* Status indicator */}
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-surface-container rounded-full "></div>
              </Link>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-6xl mx-auto animate-fade-in-up pb-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
