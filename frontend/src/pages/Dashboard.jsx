import { Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Button from "../components/Button";
import Card from "../components/Card";
import { clearCache } from "../api/admin";
import { getDashboardStats } from "../api/statistics";
import logApi from "../api/log";

const Dashboard = () => {
  const clearCacheMutation = useMutation({
    mutationFn: clearCache,
    onSuccess: () => {
      toast.success("Cache cleared successfully!");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.meta?.message || "Failed to clear cache",
      );
    },
  });

  const handleClearCache = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all cache? This action cannot be undone.",
      )
    ) {
      clearCacheMutation.mutate();
    }
  };

  // Fetch real statistics from API
  const { data: statsData, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: getDashboardStats,
  });

  // Fetch recent audit logs
  const { data: auditData, isLoading: isLoadingAudit } = useQuery({
    queryKey: ["recent-audit"],
    queryFn: () => logApi.getAuditLogs({ limit: 5, page: 1 }),
  });

  // Statistics data with smooth colors - refined for both light and dark modes
  const stats = [
    {
      id: 1,
      title: "Total Users",
      value: statsData?.data?.total_users?.toString() || "0",
      icon: (
        <svg
          className="w-6 h-6"
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
      gradient:
        "from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10",
      iconBg:
        "bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-800/20 dark:to-indigo-800/20",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      id: 2,
      title: "Total Roles",
      value: statsData?.data?.total_roles?.toString() || "0",
      icon: (
        <svg
          className="w-6 h-6"
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
      gradient:
        "from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10",
      iconBg:
        "bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-800/20 dark:to-pink-800/20",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      id: 3,
      title: "Permissions",
      value: statsData?.data?.total_permissions?.toString() || "0",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
          />
        </svg>
      ),
      gradient:
        "from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10",
      iconBg:
        "bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-800/20 dark:to-orange-800/20",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
  ];

  const formatRelTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ── Page Header ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1 px-1">
        <h1 className="text-[10px] font-bold text-surface-on-variant uppercase tracking-[0.2em]">
          System Overview
        </h1>
        <h2 className="text-2xl font-bold text-surface-on tracking-tight">
          Dashboard
        </h2>
      </div>

      {/* ── Statistics Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading
          ? [1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-surface-container rounded-2xl p-5 border border-outline-variant/30 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-surface-variant/40" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-surface-variant/40 rounded w-2/3" />
                    <div className="h-6 bg-surface-variant/30 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))
          : stats.map((stat) => (
              <div
                key={stat.id}
                className="group relative bg-surface-container rounded-2xl border border-outline-variant/30 p-5 
                           transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 
                           active:scale-[0.98] overflow-hidden"
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className={`${stat.iconBg} ${stat.iconColor} p-3 rounded-xl transition-transform duration-300 group-hover:scale-110`}>
                    {stat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-surface-on-variant uppercase tracking-wider mb-0.5">
                      {stat.title}
                    </p>
                    <h3 className="text-2xl font-bold text-surface-on tracking-tight">
                      {stat.value}
                    </h3>
                  </div>
                </div>
                {/* Decorative background element inspired by SharePage icons */}
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
              </div>
            ))}
      </div>

      {/* ── Main Layout ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-surface-container rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-3 border-b border-outline-variant/20 bg-surface-container-low flex items-center justify-between">
            <h2 className="text-[10px] font-bold text-surface-on-variant uppercase tracking-widest">
              Recent Activity
            </h2>
            <span className="text-[10px] font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10">
              Live Feed
            </span>
          </div>
          <div className="p-3 space-y-1">
            {isLoadingAudit ? (
               [1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4 p-3 animate-pulse">
                    <div className="w-4 h-4 bg-surface-variant/40 rounded-full mt-1"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-3 bg-surface-variant/40 rounded w-3/4"></div>
                        <div className="h-2 bg-surface-variant/30 rounded w-1/4"></div>
                    </div>
                </div>
               ))
            ) : auditData?.data?.length > 0 ? (
                auditData.data.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-3 rounded-xl hover:bg-surface-variant/20
                               transition-all duration-200 group border border-transparent hover:border-outline-variant/10"
                  >
                    <div className="mt-1.5 p-1 rounded-full bg-primary/20 text-primary group-hover:scale-110 transition-transform">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-surface-on font-medium group-hover:text-primary transition-colors">
                        <span className="font-bold opacity-60 mr-1.5">{log.action}</span>
                        {log.module} by {log.user_email}
                      </p>
                      <p className="text-xs text-surface-on-variant opacity-60 flex items-center gap-1 mt-0.5">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatRelTime(log.created_at)}
                      </p>
                    </div>
                  </div>
                ))
            ) : (
                <div className="p-10 text-center text-surface-on-variant opacity-50">
                    <p className="text-xs">No recent activity found.</p>
                </div>
            )}
          </div>
        </div>

        {/* Quick Actions Container */}
        <div className="bg-surface-container rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-3 border-b border-outline-variant/20 bg-surface-container-low">
            <h2 className="text-[10px] font-bold text-surface-on-variant uppercase tracking-widest">
              Quick Actions
            </h2>
          </div>
          <div className="p-4 space-y-3">
            {[
              { to: "/admin/users", label: "Manage Users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", variant: 'primary' },
              { to: "/admin/roles", label: "Manage Roles", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", variant: 'surface' },
              { to: "/admin/permissions", label: "Permissions", icon: "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z", variant: 'surface' }
            ].map((action, i) => (
              <Link key={i} to={action.to} className="block group">
                <div className={`flex items-center gap-3 p-3 rounded-xl border border-outline-variant/20 transition-all duration-300
                               ${action.variant === 'primary' 
                                 ? 'bg-primary/5 hover:bg-primary/10 hover:border-primary/30 text-primary' 
                                 : 'bg-surface-variant/10 hover:bg-surface-variant/30 text-surface-on'} 
                               hover:shadow-md group-active:scale-[0.98]`}>
                  <div className={`p-2 rounded-lg ${action.variant === 'primary' ? 'bg-primary/20' : 'bg-surface-variant/30'} 
                                 transition-transform group-hover:scale-110`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                    </svg>
                  </div>
                  <span className="text-xs font-bold tracking-wide">{action.label}</span>
                </div>
              </Link>
            ))}

            <div className="pt-3 mt-3 border-t border-outline-variant/20">
              <button
                onClick={handleClearCache}
                disabled={clearCacheMutation.isPending}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-error/5 hover:bg-error/10 border border-error/20
                         text-error font-bold transition-all duration-300 hover:shadow-md hover:border-error/30
                         disabled:opacity-50 disabled:cursor-not-allowed group active:scale-[0.98]"
              >
                <div className="p-2 bg-error/10 rounded-lg group-hover:bg-error/20 transition-transform group-hover:rotate-12">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <span className="text-xs tracking-wide">
                  {clearCacheMutation.isPending ? "Clearing..." : "Clear Cache"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
