import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const Sidebar = ({
  sections = [],
  title = "Admin Panel",
  logo,
  onLogout,
  collapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
  onSearch,
  headerAction,
  theme = "light",
  onToggleTheme,
}) => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({});
  const isActuallyCollapsed = collapsed && !mobileOpen;

  const isActive = (path) => location.pathname === path;
  const isChildActive = (item) => {
    if (!item.subItems) return isActive(item.path);
    return item.subItems.some((sub) => isActive(sub.path));
  };

  // Auto-expand section if a child is active (only when not collapsed)
  useEffect(() => {
    if (collapsed) return;
    const newExpanded = { ...expandedSections };
    let changed = false;
    sections.forEach((section) => {
      section.items.forEach((item) => {
        if (
          item.subItems &&
          isChildActive(item) &&
          !expandedSections[item.label]
        ) {
          newExpanded[item.label] = true;
          changed = true;
        }
      });
    });
    if (changed) setExpandedSections(newExpanded);
  }, [location.pathname, sections, collapsed]);

  const toggleSection = (label) => {
    if (collapsed) return;
    setExpandedSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`nav-drawer flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out 
          ${isActuallyCollapsed ? "w-[56px]" : "w-56"} 
          fixed inset-y-0 left-0 z-[70] lg:relative lg:translate-x-0
          ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{ overflow: (isActuallyCollapsed && !mobileOpen) ? "visible" : "hidden" }}
      >
      {/* Header with toggle button */}
      <div
        className={`h-12 flex items-center flex-shrink-0 ${isActuallyCollapsed ? "justify-center px-2" : "justify-between px-3"}`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {logo && (
            <div
              className={`flex-shrink-0 transition-all duration-300 ${isActuallyCollapsed ? "w-8 h-8" : "w-7 h-7"} rounded-md border border-outline-variant/30 overflow-hidden bg-surface-variant/20`}
            >
              <img
                src={`${import.meta.env.VITE_API_URL}/public/storage/${logo}`}
                alt="Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}
          {!isActuallyCollapsed && (
            <h2 className="text-sm font-semibold text-surface-on truncate">
              {title}
            </h2>
          )}
        </div>
        <button
          onClick={mobileOpen ? onCloseMobile : onToggleCollapse}
          className="p-1.5 rounded-full hover:bg-surface-variant/40 text-surface-on-variant transition-all duration-200 flex-shrink-0"
          title={mobileOpen ? "Close sidebar" : collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${isActuallyCollapsed ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* Search & Action Section */}
      {!isActuallyCollapsed && (onSearch || headerAction) && (
        <div className="px-3 pb-2 pt-1 border-b border-outline-variant/10 space-y-3">
          {onSearch && (
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-3.5 h-3.5 text-surface-on-variant opacity-50 group-focus-within:opacity-100 group-focus-within:text-primary transition-all"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search history..."
                className="w-full pl-9 pr-3 py-2 text-[11px] font-bold uppercase tracking-wider bg-surface-container-highest/50 border border-outline-variant/30 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all placeholder:text-[10px] placeholder:tracking-widest"
              />
            </div>
          )}
          {headerAction && <div className="animate-fade-in">{headerAction}</div>}
        </div>
      )}


      {/* Navigation */}
      <nav className={`flex-1 ${isActuallyCollapsed ? "overflow-visible" : "overflow-y-auto overflow-x-hidden"} py-2 custom-scrollbar`}>
        {sections.map((section, idx) => (
          <div key={idx} className="mb-4">
            {section.label && !isActuallyCollapsed && (
              <div className="px-4 py-2">
                <h3 className="text-xs font-bold text-surface-on tracking-tight">
                  {section.label}
                </h3>
                {section.subtitle && (
                  <p className="text-[10px] text-surface-on-variant opacity-70 mt-0.5">
                    {section.subtitle}
                  </p>
                )}
              </div>
            )}
            {section.label && collapsed && (
              <div className="px-2 py-2">
                <div className="border-t border-outline-variant/30" />
              </div>
            )}
            <ul className={`space-y-1 ${collapsed ? "px-1.5" : "px-2"}`}>
              {section.items.map((item) => {
                const active = isChildActive(item);
                const hasSubItems = !!item.subItems;
                const isExpanded = expandedSections[item.label];

                if (isActuallyCollapsed) {
                  // Icon-only mode: floating submenu or tooltip on hover
                  const href = item.subItems
                    ? item.subItems[0]?.path
                    : item.path;
                  return (
                    <li key={item.label} className="relative group/sidebar-item">
                      <Link
                        to={href || "#"}
                        className={`flex items-center justify-center w-full p-2 rounded-xl transition-all duration-200 ${
                          active
                            ? "bg-primary text-on-primary shadow-md"
                            : item.highlight
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : item.emergency
                            ? "bg-error/10 text-error border border-error/20"
                            : "text-surface-on-variant hover:bg-primary/10 hover:text-primary"
                        }`}
                      >
                        {item.icon}
                      </Link>

                      {/* Floating Menu / Tooltip */}
                      <div className="absolute left-full top-0 ml-2 invisible opacity-0 -translate-x-2 group-hover/sidebar-item:visible group-hover/sidebar-item:opacity-100 group-hover/sidebar-item:translate-x-0 transition-all duration-200 z-50">
                        {hasSubItems ? (
                          <div className="w-52 bg-surface-container-highest/90 backdrop-blur-xl rounded-2xl p-2 shadow-2xl border border-outline-variant/30 overflow-hidden">
                            <div className="px-3 py-2 border-b border-outline-variant/10 mb-1">
                              <p className="text-[10px] font-bold text-surface-on-variant uppercase tracking-widest">
                                {item.label}
                              </p>
                            </div>
                            <ul className="space-y-0.5">
                              {item.subItems.map((sub) => {
                                const subActive = isActive(sub.path);
                                return (
                                  <li key={sub.path}>
                                    <Link
                                      to={sub.path}
                                      className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group/sub ${
                                        subActive
                                          ? "bg-primary text-on-primary shadow-sm"
                                          : "text-surface-on-variant hover:bg-primary/10 hover:text-primary"
                                      }`}
                                    >
                                      <div className="scale-90 group-hover/sub:scale-110 transition-transform">
                                        {sub.icon}
                                      </div>
                                      <span className="text-xs font-bold whitespace-nowrap">
                                        {sub.label}
                                      </span>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ) : (
                          <span className="px-3 py-1.5 rounded-xl bg-surface-container-highest text-surface-on text-[11px] font-bold shadow-xl border border-outline-variant/30 whitespace-nowrap block">
                            {item.label}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                }

                return (
                  <li key={item.label}>
                    {hasSubItems ? (
                      <div>
                        <button
                          onClick={() => toggleSection(item.label)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300 group ${
                            active
                              ? "bg-primary text-on-primary shadow-md"
                              : item.highlight
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : item.emergency
                              ? "bg-error/10 text-error border border-error/20"
                              : "text-surface-on-variant hover:bg-primary/10 hover:text-primary"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="transition-transform duration-300 group-hover:scale-110 flex-shrink-0">
                              {item.icon}
                            </div>
                            <span className="font-medium text-sm whitespace-nowrap">
                              {item.label}
                            </span>
                          </div>
                          <svg
                            className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-64 mt-1" : "max-h-0"}`}
                        >
                          <ul className="space-y-1 ml-3 pl-3 border-l border-outline-variant/30">
                            {item.subItems.map((sub) => {
                              const subActive = isActive(sub.path);
                              return (
                                <li key={sub.path}>
                                  <Link
                                    to={sub.path}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 group ${
                                      subActive
                                        ? "bg-primary text-on-primary shadow-md"
                                        : "text-surface-on-variant hover:bg-primary/10 hover:text-primary"
                                    }`}
                                  >
                                    <div className="transition-transform duration-300 group-hover:scale-110 flex-shrink-0">
                                      {sub.icon}
                                    </div>
                                    <span className="font-medium text-sm whitespace-nowrap">
                                      {sub.label}
                                    </span>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${
                          active
                            ? "bg-primary text-on-primary shadow-md"
                            : item.highlight
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : item.emergency
                            ? "bg-error/10 text-error border border-error/20 hover:bg-error/20"
                            : "text-surface-on-variant hover:bg-primary/10 hover:text-primary"
                        }`}
                      >
                        <div className="transition-transform duration-300 group-hover:scale-110 flex-shrink-0">
                          {item.icon}
                        </div>
                        <span className="font-medium text-sm whitespace-nowrap">
                          {item.label}
                        </span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom Actions: Theme & Logout */}
      <div className="flex-shrink-0 border-t border-outline-variant/30 p-1.5 space-y-1">
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className={`group relative flex items-center gap-2 px-3 py-2 rounded-full text-surface-on-variant hover:bg-primary/10 hover:text-primary transition-all duration-300 ${
              isActuallyCollapsed ? "justify-center w-full" : "w-full"
            }`}
          >
            <div className="transition-transform duration-300 group-hover:rotate-12 flex-shrink-0">
              {theme === "dark" ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 16.95l.707.707M7.05 7.05l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              )}
            </div>
            {!isActuallyCollapsed && (
              <span className="font-medium text-xs whitespace-nowrap lowercase first-letter:uppercase">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
            )}

            {isActuallyCollapsed && (
              <span className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-surface-container-highest text-surface-on text-[11px] font-bold shadow-xl border border-outline-variant/30 pointer-events-none invisible opacity-0 -translate-x-2 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 z-50 whitespace-nowrap">
                {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
              </span>
            )}
          </button>
        )}

        <button
          onClick={onLogout}
          className={`group relative flex items-center gap-2 px-3 py-2 rounded-full text-surface-on-variant hover:bg-error/10 hover:text-error transition-all duration-300 ${
            isActuallyCollapsed ? "justify-center w-full" : "w-full"
          }`}
        >
          <div className="transition-transform duration-300 group-hover:scale-110 flex-shrink-0">
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </div>
          {!isActuallyCollapsed && (
            <span className="font-medium text-xs whitespace-nowrap">Logout</span>
          )}

          {isActuallyCollapsed && (
            <span className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-surface-container-highest text-surface-on text-[11px] font-bold shadow-xl border border-outline-variant/30 pointer-events-none invisible opacity-0 -translate-x-2 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 z-50 whitespace-nowrap">
              Logout
            </span>
          )}
        </button>
      </div>
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          path: PropTypes.string,
          label: PropTypes.string.isRequired,
          icon: PropTypes.node.isRequired,
          subItems: PropTypes.arrayOf(
            PropTypes.shape({
              path: PropTypes.string.isRequired,
              label: PropTypes.string.isRequired,
              icon: PropTypes.node.isRequired,
            }),
          ),
        }),
      ).isRequired,
    }),
  ),
  title: PropTypes.string,
  logo: PropTypes.string,
  onLogout: PropTypes.func.isRequired,
  collapsed: PropTypes.bool,
  onToggleCollapse: PropTypes.func.isRequired,
  mobileOpen: PropTypes.bool,
  onCloseMobile: PropTypes.func,
  onSearch: PropTypes.func,
  headerAction: PropTypes.node,
};

export default Sidebar;
