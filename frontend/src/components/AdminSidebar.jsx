import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { LogOut } from "lucide-react";
import LottieLogo from "./LottieLogo";

const AdminSidebar = ({
  sections = [],
  title = "Nadi Admin",
  logo,
  onLogout,
  collapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
  onSearch,
  headerAction,
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

  useEffect(() => {
    if (isActuallyCollapsed) return;
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
  }, [location.pathname, sections, isActuallyCollapsed]);

  const toggleSection = (label) => {
    if (isActuallyCollapsed) {
      if (onToggleCollapse) onToggleCollapse();
      return;
    }
    setExpandedSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!isActuallyCollapsed && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        if (mobileOpen) {
          onCloseMobile();
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isActuallyCollapsed, sidebarRef, mobileOpen, onCloseMobile]);

  return (
    <>
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
        <div className={`h-16 flex items-center flex-shrink-0 ${isActuallyCollapsed ? "justify-center px-2" : "justify-between px-5"}`}>
          {!isActuallyCollapsed && (
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex-shrink-0 w-8 h-8 rounded-xl border border-outline-variant/30 overflow-hidden bg-surface-variant/10 flex items-center justify-center p-0.5">
                {logo ? (
                  <img src={`${import.meta.env.VITE_API_URL}/public/storage/${logo}`} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <LottieLogo className="w-full h-full" />
                )}
              </div>
              <h2 className="text-sm font-bold text-surface-on truncate tracking-tight">{title}</h2>
            </div>
          )}
          {showToggle && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-full hover:bg-surface-variant/40 text-surface-on-variant transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
        </div>

        {!isActuallyCollapsed && (onSearch || headerAction) && (
          <div className="px-4 pb-4 pt-1 space-y-3 border-b border-outline-variant/10">
            {onSearch && (
              <div className="relative">
                <input
                  type="text"
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder="Search Module..."
                  className="w-full pl-4 pr-3 py-2 text-[12px] font-medium bg-surface-container-highest/30 border border-outline-variant/20 rounded-xl focus:outline-none focus:border-primary/50"
                />
              </div>
            )}
            {headerAction && <div>{headerAction}</div>}
          </div>
        )}

        <nav className={`flex-1 ${isActuallyCollapsed ? "overflow-visible" : "overflow-y-auto"} py-2 custom-scrollbar`}>
          {sections.map((section, idx) => (
            <div key={idx} className="mb-2">
              {section.label && !isActuallyCollapsed && (
                <div className="px-6 py-2">
                  <h3 className="text-[10px] font-bold text-surface-on-variant uppercase tracking-widest">{section.label}</h3>
                </div>
              )}
              <ul className={`space-y-0.5 ${collapsed ? "px-2" : "px-3"}`}>
                {section.items.map((item) => {
                  const active = isChildActive(item);
                  const hasSubItems = !!item.subItems;

                  if (isActuallyCollapsed) {
                    const href = item.subItems ? item.subItems[0]?.path : item.path;
                    return (
                      <li key={item.label} className="relative group/sidebar-item">
                        <Link
                          to={href || "#"}
                          className={`flex items-center justify-center w-full p-2.5 rounded-xl transition-all duration-200 ${
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
                                        className={`flex items-center gap-3 px-3 py-1.5 rounded-xl transition-all duration-200 group/sub ${
                                          subActive
                                            ? "bg-primary/10 text-primary font-semibold"
                                            : "text-surface-on-variant hover:bg-surface-variant/50 hover:text-surface-on"
                                        }`}
                                      >
                                        <div className="scale-90 group-hover/sub:scale-110 transition-transform">
                                          {sub.icon}
                                        </div>
                                        <span className="text-[11px] font-medium whitespace-nowrap">
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
                    <li key={item.label}>
                      {hasSubItems ? (
                        <div>
                          <button
                            onClick={() => toggleSection(item.label)}
                            className={`w-full flex items-center justify-between px-4 py-1.5 rounded-xl transition-all ${
                              active ? "bg-primary/10 text-primary font-semibold border border-primary/20" : "text-surface-on-variant hover:bg-surface-variant/50 border border-outline-variant/5"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {item.icon}
                              <span className="text-xs font-medium">{item.label}</span>
                            </div>
                            <svg className={`w-4 h-4 transition-transform ${expandedSections[item.label] ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <div className={`overflow-hidden transition-all ${expandedSections[item.label] ? "max-h-96 mt-1" : "max-h-0"}`}>
                            <ul className="space-y-0.5 ml-4 pl-2 border-l border-outline-variant/20">
                              {item.subItems.map((sub) => (
                                <li key={sub.label}>
                                  <Link
                                    to={sub.path}
                                    className={`flex items-center gap-3 px-3 py-1 rounded-xl transition-all ${
                                      isActive(sub.path) ? "bg-primary/10 text-primary font-semibold" : "text-surface-on-variant hover:bg-surface-variant/50"
                                    }`}
                                  >
                                    {sub.icon}
                                    <span className="text-[11px] font-medium">{sub.label}</span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <Link
                          to={item.path}
                          className={`flex items-center gap-3 px-4 py-1.5 rounded-xl transition-all ${
                            active ? "bg-primary/10 text-primary font-semibold border border-primary/20" : "text-surface-on-variant hover:bg-surface-variant/50 border border-outline-variant/5"
                          }`}
                        >
                          {item.icon}
                          <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-2 border-t border-outline-variant/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-3 p-2 rounded-xl text-error hover:bg-error/10 font-bold transition-all"
          >
            <LogOut size={18} />
            {!isActuallyCollapsed && <span className="text-[11px]">Keluar Sistem</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

AdminSidebar.propTypes = {
  sections: PropTypes.array,
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

export default AdminSidebar;
