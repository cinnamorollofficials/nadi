import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, Outlet, useLocation, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getMe } from "../api/admin";
import { useTheme } from "../context/ThemeContext";
import {
  Bot,
  Home,
  History as HistoryIcon,
  Activity,
  User as UserIcon,
} from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import { PERMS } from "../utils/permissions";
import { safeStringify } from "../utils/json";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/client";
import { MessageSquare } from "lucide-react";

const UserLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const { app_name, logo } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch AI Chat History globally
  const { data: chatHistory } = useQuery({
    queryKey: ["chat-history"],
    queryFn: async () => {
      try {
        const response = await apiClient.get("/chat/history");
        return response.data.data || [];
      } catch (err) {
        console.error("Failed to fetch chat history", err);
        return [];
      }
    },
    refetchInterval: 30000, // Refetch every 30s to keep sidebar fresh
  });

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  const refreshUserData = useCallback(async () => {
    try {
      const response = await getMe();
      if (response.success && response.data) {
        const updatedUser = response.data;
        console.log("[User Data]", updatedUser); // Debug log
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
    refreshUserData();
  }, [navigate, refreshUserData]);

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
    let title = "AI Consultation";

    if (path.includes("/profile")) title = "Profile Saya";
    else if (path.includes("/consultations/ai")) title = "Konsultasi AI";

    return title;
  }, [location.pathname]);

  // Update document title dynamically
  useEffect(() => {
    document.title = `${pageTitle} | ${app_name}`;
  }, [pageTitle, app_name]);

  const navigationSections = useMemo(() => {
    // Map AI Chat History to sidebar items
    const aiHistoryItems = (chatHistory || [])
      .filter((chat) =>
        chat.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .slice(0, 5) // Show only last 5 in sidebar
      .map((chat) => ({
        id: `chat-${chat.id}`,
        label: chat.title,
        path: `/consultations/ai/${chat.id}`,
      }));

    return [
      {
        label: "AI Services",
        items: [
          {
            label: "AI Consultation",
            path: "/consultations/ai",
            highlight: true,
          },
        ],
      },
      {
        label: "Recent AI Chats",
        items: aiHistoryItems,
      },
    ];
  }, [searchQuery, chatHistory]);

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
        profileTransition={{
          label: "Profile Saya",
          path: "/profile",
          icon: <UserIcon size={18} />
        }}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onSearch={setSearchQuery}
        usage={user?.usage}
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

        <main className="flex-1 overflow-hidden">
          <div className="h-full animate-fade-in-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
