import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { Settings, User as UserIcon, Moon, Sun, LogOut, ChevronUp, ArrowUpRight } from "lucide-react";
import LottieLogo from "./LottieLogo";
import UsageLimit from "./UsageLimit";
import Dropdown from "./Dropdown";

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
  profileTransition,
  usage,
  showToggle = true,
}) => {
  const sidebarRef = useRef(null);
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Only close if it's actually open/expanded and not on a mobile toggle
      if (!isActuallyCollapsed && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        if (mobileOpen) {
          onCloseMobile();
        } else if (!collapsed) {
          onToggleCollapse();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isActuallyCollapsed, sidebarRef, mobileOpen, collapsed, onCloseMobile, onToggleCollapse]);

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[60] lg:hidden transition-opacity duration-300"
          onClick={onCloseMobile}
        />
      )}

      <aside
        ref={sidebarRef}
        className={`flex-shrink-0 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] 
          ${isActuallyCollapsed ? "w-[72px]" : "w-[280px]"} 
          fixed inset-y-0 left-0 z-[70] lg:relative lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
          glass-sidebar shadow-xl lg:shadow-none`}
        style={{ overflow: (isActuallyCollapsed && !mobileOpen) ? "visible" : "hidden" }}
      >
      {/* Header with toggle button */}
      <div
        className={`h-16 flex items-center flex-shrink-0 ${isActuallyCollapsed ? "justify-center px-2" : "justify-between px-5"}`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {!isActuallyCollapsed && (
            <div
              className={`flex-shrink-0 transition-all duration-300 w-8 h-8 rounded-xl border border-outline-variant/30 overflow-hidden bg-surface-variant/10 flex items-center justify-center p-0.5`}
            >
              {logo ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}/public/storage/${logo}`}
                  alt="Logo"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.className = "hidden";
                  }}
                />
              ) : (
                <LottieLogo className="w-full h-full" />
              )}
            </div>
          )}
          {!isActuallyCollapsed && (
            <h2 className="text-sm font-bold text-surface-on truncate tracking-tight">
              {title}
            </h2>
          )}
        </div>
        {showToggle && (
          <button
            onClick={mobileOpen ? onCloseMobile : onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-full hover:bg-surface-variant/40 text-surface-on-variant transition-all duration-200 flex-shrink-0"
            title={mobileOpen ? "Close sidebar" : collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              className="w-5 h-5 transition-transform duration-300"
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
        )}
      </div>

      {/* Search & Action Section */}
      {!isActuallyCollapsed && (onSearch || headerAction) && (
        <div className="px-4 pb-4 pt-1 space-y-3">
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
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 text-[12px] font-medium bg-surface-container-highest/30 border border-outline-variant/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
              />
            </div>
          )}
          {headerAction && <div className="animate-fade-in">{headerAction}</div>}
        </div>
      )}


      {/* Navigation */}
      <nav className={`flex-1 ${isActuallyCollapsed ? "overflow-visible" : "overflow-y-auto overflow-x-hidden"} py-2 custom-scrollbar`}>
        {sections.map((section, idx) => (
          <div key={idx} className="mb-6">
            {section.label && !isActuallyCollapsed && (
              <div className="px-6 py-2">
                <h3 className="text-[10px] font-bold text-surface-on-variant uppercase tracking-widest">
                  {section.label}
                </h3>
              </div>
            )}
            {section.label && collapsed && (
              <div className="px-2 py-2">
                <div className="border-t border-outline-variant/30" />
              </div>
            )}
            <ul className={`space-y-0.5 ${collapsed ? "px-2" : "px-3"}`}>
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
                    <li key={item.id || item.path || item.label} className="relative group/sidebar-item">
                      <Link
                        to={href || "#"}
                        className={`flex items-center justify-center w-full p-3 rounded-xl transition-all duration-200 ${
                          active
                            ? "bg-primary text-on-primary shadow-lg shadow-primary/20"
                            : "text-surface-on-variant hover:bg-surface-variant/50 hover:text-surface-on"
                        }`}
                      >
                        {item.icon}
                      </Link>

                      {/* Floating Menu / Tooltip */}
                      <div className="absolute left-full top-0 ml-3 invisible opacity-0 -translate-x-4 group-hover/sidebar-item:visible group-hover/sidebar-item:opacity-100 group-hover/sidebar-item:translate-x-0 transition-all duration-500 z-50">
                        {hasSubItems ? (
                          <div className="w-56 bg-white dark:bg-navy-900 rounded-2xl p-2 border border-outline-variant/20 shadow-2xl overflow-hidden">
                            <div className="px-4 py-3 border-b border-outline-variant/10 mb-1">
                              <p className="text-[10px] font-bold text-surface-on-variant uppercase tracking-[0.2em]">
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
                                          ? "bg-primary/10 text-primary font-semibold"
                                          : "text-surface-on-variant hover:bg-surface-variant/50 hover:text-surface-on"
                                      }`}
                                    >
                                      <div className="scale-90 group-hover/sub:scale-110 transition-transform">
                                        {sub.icon}
                                      </div>
                                      <span className="text-xs font-medium whitespace-nowrap">
                                        {sub.label}
                                      </span>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ) : (
                          <span className="px-3 py-1.5 rounded-lg bg-surface-container-highest text-surface-on text-[11px] font-bold border border-outline-variant/20 shadow-lg whitespace-nowrap block">
                            {item.label}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                }

                return (
                  <li key={item.id || item.path || item.label}>
                    {hasSubItems ? (
                      <div>
                        <button
                          onClick={() => toggleSection(item.label)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group ${
                            active
                              ? "bg-primary/10 text-primary font-semibold"
                              : "text-surface-on-variant hover:bg-surface-variant/50 hover:text-surface-on"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="transition-transform duration-300 group-hover:scale-110 flex-shrink-0">
                              {item.icon}
                            </div>
                            <span className="text-sm font-medium whitespace-nowrap">
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
                          <ul className="space-y-0.5 ml-4 pl-2 border-l border-outline-variant/20">
                            {item.subItems.map((sub) => {
                              const subActive = sub.path ? isActive(sub.path) : false;
                              const content = (
                                <>
                                  <div className="transition-transform duration-300 group-hover:scale-110 flex-shrink-0">
                                    {sub.icon}
                                  </div>
                                  <span className="text-xs font-medium whitespace-nowrap">
                                    {sub.label}
                                  </span>
                                </>
                              );

                              return (
                                <li key={sub.label}>
                                  {sub.path ? (
                                    <Link
                                      to={sub.path}
                                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                                        ${subActive 
                                          ? "bg-primary/10 text-primary font-semibold" 
                                          : "text-surface-on-variant hover:bg-surface-variant/50 hover:text-surface-on"}`}
                                    >
                                      {content}
                                    </Link>
                                  ) : (
                                    <button
                                      onClick={sub.onClick}
                                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                                        text-surface-on-variant hover:bg-surface-variant/50 hover:text-surface-on ${sub.className || ""}`}
                                    >
                                      {content}
                                    </button>
                                  )}
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
                              ? "bg-primary/10 text-primary font-semibold"
                              : "text-surface-on-variant hover:bg-surface-variant/50 hover:text-surface-on"
                          }`}
                        >
                          {item.icon && (
                            <div className="transition-transform duration-300 group-hover:scale-110 flex-shrink-0">
                              {item.icon}
                            </div>
                          )}
                          <span className="text-sm font-medium whitespace-nowrap truncate flex-1">
                            {item.label}
                          </span>

                          {/* Item Actions (Ellipsis Menu) */}
                          {!isActuallyCollapsed && item.actions && item.actions.length > 0 && (
                            <div 
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Dropdown
                                trigger={
                                  <button className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-surface-on-variant/50 hover:text-surface-on transition-all">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                    </svg>
                                  </button>
                                }
                                actions={item.actions}
                                align="right"
                              />
                            </div>
                          )}
                        </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom Actions: Consolidated Settings */}
      <div className="p-3 border-t border-outline-variant/10 space-y-1">
        {usage && !isActuallyCollapsed && (
          <div className="px-3 py-2">
            <UsageLimit 
              used={usage.used} 
              limit={usage.limit} 
              percent={usage.percent} 
            />
          </div>
        )}

        <div 
          className="relative group/settings"
          onMouseEnter={() => !isActuallyCollapsed && setExpandedSections(prev => ({ ...prev, "Settings": true }))}
          onMouseLeave={() => !isActuallyCollapsed && setExpandedSections(prev => ({ ...prev, "Settings": false }))}
        >
          <button
            onClick={() => toggleSection("Settings")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group
              ${expandedSections["Settings"] 
                ? "bg-primary/10 text-primary font-semibold" 
                : "text-surface-on-variant hover:bg-surface-variant/50 hover:text-surface-on"}`}
          >
            {!isActuallyCollapsed && (
              <div className="flex items-center gap-3">
                <div className="transition-transform duration-300 group-hover:scale-110">
                  <Settings size={20} />
                </div>
                <span className="text-sm font-medium whitespace-nowrap">Settings</span>
              </div>
            )}
            
            {isActuallyCollapsed && (
              <div className="flex justify-center w-full">
                <Settings size={20} className="transition-transform duration-300 group-hover:scale-110" />
              </div>
            )}
            
            {/* Tooltip for collapsed mode is handled by the floating menu now */}
          </button>

          {/* Floating Settings Menu */}
          <div className={`absolute bottom-full left-0 pt-4 w-full lg:min-w-[240px] z-[100] transition-all duration-300 origin-bottom
            ${expandedSections["Settings"] 
              ? "opacity-100 translate-y-0 pointer-events-auto" 
              : "opacity-0 translate-y-4 pointer-events-none"}`}
          >
            <div className="glass-card shadow-2xl rounded-2xl border border-outline-variant/20 p-1.5 overflow-hidden mb-2">
              {/* Upgrade to PRO Card */}
              <div className="p-3 mb-2 rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent border border-purple-500/10 relative overflow-hidden group/upgrade">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-medical-grid" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-bold text-surface-on flex items-center gap-1.5">
                      Upgrade to 
                      <span className="bg-black text-white text-[10px] px-1.5 py-0.5 rounded-md tracking-wider font-extrabold uppercase">PRO</span>
                    </h4>
                  </div>
                  <p className="text-[11px] text-surface-on-variant leading-relaxed mb-3 opacity-70 font-medium">
                    Upgrade for image uploads, smarter AI, and more Pro Search.
                  </p>
                  
                  <button className="w-full bg-white dark:bg-white/10 py-2.5 px-4 rounded-xl flex items-center justify-between text-[12px] font-bold text-surface-on shadow-sm border border-black/5 hover:bg-slate-50 transition-all">
                    <span>Learn More</span>
                    <ArrowUpRight size={14} className="opacity-50" />
                  </button>
                </div>
              </div>

              <div className="px-3 py-2 border-b border-outline-variant/10 mb-1">
                <p className="text-[10px] font-bold text-surface-on-variant uppercase tracking-widest">
                  Account Setting
                </p>
              </div>
              <ul className="space-y-0.5">
                {/* Profile */}
                {profileTransition && (
                  <li>
                    <Link
                      to={profileTransition.path}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-surface-on-variant hover:bg-surface-variant/5 hover:text-surface-on"
                      onClick={() => setExpandedSections(prev => ({ ...prev, "Settings": false }))}
                    >
                      <UserIcon size={18} />
                      <span className="text-xs font-semibold">Account Profile</span>
                    </Link>
                  </li>
                )}
                
                {/* Theme Toggle */}
                {onToggleTheme && (
                  <li>
                    <button
                      onClick={(e) => {
                        onToggleTheme(e);
                        // Optional: keep menu open or close it
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-surface-on-variant hover:bg-surface-variant/5 hover:text-surface-on"
                    >
                      {theme === "dark" ? (
                        <Sun size={18} />
                      ) : (
                        <Moon size={18} />
                      )}
                      <span className="text-xs font-semibold">
                        {theme === "dark" ? "Light Mode" : "Dark Mode"}
                      </span>
                    </button>
                  </li>
                )}

                <div className="my-1 border-t border-outline-variant/10" />

                {/* Logout */}
                <li>
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-error hover:bg-error/10 font-bold"
                  >
                    <LogOut size={18} />
                    <span className="text-xs">Sign Out</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
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
  usage: PropTypes.shape({
    used: PropTypes.number,
    limit: PropTypes.number,
    percent: PropTypes.number,
  }),
};

export default Sidebar;
