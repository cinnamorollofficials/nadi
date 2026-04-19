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
    },
    {
      id: 2,
      label: "Sakit Kepala Sebelah Kiri",
      path: "/new-check?id=2",
    },
    {
      id: 3,
      label: "Nyeri Punggung Bawah",
      path: "/new-check?id=3",
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
      //
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
        theme={theme}
        onToggleTheme={toggleTheme}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onSearch={setSearchQuery}
        headerAction={
          <button
            onClick={() => navigate("/start-new")}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-primary text-on-primary rounded-2xl font-bold group hover:brightness-110 active:scale-95 transition-all duration-300"
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
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-bold text-surface-on truncate max-w-[150px]">
                  {user.email}
                </span>
              </div>
              <Link
                to="/profile"
                className="relative group p-0.5 rounded-xl border border-outline-variant/30 hover:border-primary/50 transition-all overflow-hidden"
              >
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs overflow-hidden">
                  {user.picture || user.avatar ? (
                    <img
                      src={user.picture || user.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerText = user.email
                          .charAt(0)
                          .toUpperCase();
                      }}
                    />
                  ) : (
                    user.email.charAt(0).toUpperCase()
                  )}
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
