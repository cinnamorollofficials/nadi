import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, Outlet, useLocation, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getMe } from "../api/admin";
import { useTheme } from "../context/ThemeContext";
import { useSettings } from "../context/SettingsContext";
import { PERMS } from "../utils/permissions";

const UserLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const { app_name, logo } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const refreshUserData = useCallback(async () => {
    try {
      const response = await getMe();
      if (response.success && response.data) {
        const updatedUser = response.data;
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const path = location.pathname;
    let pageTitle = "Dashboard";
    if (path.includes("/profile")) pageTitle = "Profile";
    if (path.includes("/storage")) pageTitle = "My Files";
    
    document.title = `${pageTitle} | ${app_name}`;
  }, [location.pathname, app_name]);

  const navigationSections = [
    {
      label: "Home",
      items: [
        {
          path: "/dashboard",
          label: "Dashboard",
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          ),
        },
      ],
    },
    {
      label: "Services",
      items: [
        {
          path: "/storage",
          label: "My Storage",
          permission: PERMS.GET_FILE,
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          ),
        }
      ],
    },
  ];

  // Filter navigation based on user permissions
  const filteredNavigation = useMemo(() => {
    if (!user) return [];
    if (user.role_id === 1) return navigationSections;

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

    return navigationSections
      .map((section) => ({
        ...section,
        items: filterItems(section.items),
      }))
      .filter((section) => section.items.length > 0);
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
      />

      <div className="flex-1 flex flex-col min-w-0 bg-surface relative">
        <header className="h-14 flex items-center justify-between px-6 bg-surface-container-low border-b border-outline-variant/30 sticky top-0 z-10">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-[10px] font-bold text-surface-on-variant uppercase tracking-widest">
              User Portal
            </h2>
            <span className="text-sm font-bold text-surface-on truncate max-w-[200px]">
              Welcome, {user.name || user.email.split('@')[0]}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-surface-variant/30 text-surface-on-variant transition-all duration-200 active:scale-95"
            >
              {theme === "light" ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            <div className="flex items-center gap-3 pl-2 border-l border-outline-variant/30">
               <div className="hidden md:flex flex-col items-end">
                  <span className="text-xs font-bold text-surface-on truncate max-w-[150px]">
                    {user.email}
                  </span>
                  <span className="text-[10px] text-surface-on-variant font-bold uppercase tracking-tighter opacity-70">
                    {user.role?.name || 'Member'}
                  </span>
               </div>
               <Link
                 to="/profile"
                 className="relative group p-0.5 rounded-full border border-outline-variant/30 hover:border-primary/50 transition-all"
               >
                 <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                   {user.email.charAt(0).toUpperCase()}
                 </div>
               </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto animate-fade-in-up pb-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
