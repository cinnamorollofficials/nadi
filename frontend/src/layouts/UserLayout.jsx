import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, Outlet, useLocation, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getMe } from "../api/admin";
import { useTheme } from "../context/ThemeContext";
import { useSettings } from "../context/SettingsContext";
import { PERMS } from "../utils/permissions";
import { safeStringify } from "../utils/json";

const UserLayout = () => {
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

  useEffect(() => {
    const interval = setInterval(refreshUserData, 60000);
    return () => clearInterval(interval);
  }, [refreshUserData]);

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
      setUser(JSON.parse(userData));
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

    if (path.includes("/new-check")) title = "New Consultation";
    else if (path.includes("/history")) title = "History";
    else if (path.includes("/consultations")) title = "Consultations";
    else if (path.includes("/health-stats")) title = "Health Statistics";
    else if (path.includes("/profile")) title = "Profile";

    return title;
  }, [location.pathname]);

  // Update document title dynamically
  useEffect(() => {
    document.title = `${pageTitle} | ${app_name}`;
  }, [pageTitle, app_name]);

  const navigationSections = useMemo(() => {
    const filteredHistory = historyItems.filter((item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return [
      {
        label: "Recent Conversations",
        items: filteredHistory,
      },
      {
        label: "Portal",
        items: [
          {
            path: "/dashboard",
            label: "Overview",
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
          {
            path: "/consultations",
            label: "Physicians",
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            ),
          },
          {
            path: "/health-stats",
            label: "Vitals & Stats",
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            ),
          },
        ],
      },
    ];
  }, [searchQuery]);

  // Filter navigation based on user permissions
  const filteredNavigation = useMemo(() => {
    if (!user) return [];
    return navigationSections;
  }, [user, navigationSections]);

  if (!user) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-primary-500 animate-pulse">
          Loading User Portal...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar
        sections={filteredNavigation}
        title={app_name}
        logo={logo}
        onLogout={handleLogout}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onSearch={setSearchQuery}
        headerAction={
          <button
            onClick={() => navigate("/new-check")}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-primary text-on-primary rounded-2xl font-bold shadow-lg shadow-primary/20 group hover:brightness-110 active:scale-95 transition-all duration-300"
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
      <div className="flex-1 flex flex-col min-w-0 bg-surface relative">
        <header className="flex h-16 items-center justify-between px-4 lg:px-6 bg-surface sticky top-0 z-10 transition-colors">
          <div className="flex items-center gap-4 flex-1">
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
            <div className="flex items-center gap-6 flex-1">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-surface-on truncate max-w-[200px]">
                  {pageTitle}
                </span>
              </div>

              {/* Search Bar */}
              <div className="hidden md:flex items-center flex-1 max-w-md">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="w-4 h-4 text-surface-on-variant"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search medical records..."
                    className="w-full pl-10 pr-4 py-2 text-sm bg-surface-variant/20 border border-outline-variant/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-bold text-surface-on truncate max-w-[150px]">
                  {user.email}
                </span>
                <span className="text-[10px] text-surface-on-variant font-bold uppercase tracking-tighter opacity-70">
                  {user.role?.name || "Member"}
                </span>
              </div>
              <Link
                to="/profile"
                className="relative group p-0.5 rounded-xl border border-outline-variant/30 hover:border-primary/50 transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                  {user.email.charAt(0).toUpperCase()}
                </div>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-6xl mx-auto animate-fade-in-up pb-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
