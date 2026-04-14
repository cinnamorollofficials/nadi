import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/Card";
import Button from "../../components/Button";

const ClientDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const stats = [
    {
      label: "Profile Status",
      value: "Verified",
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
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Account Type",
      value: user?.role?.name || "Regular User",
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
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Member Since",
      value: user?.created_at
        ? new Date(user.created_at).toLocaleDateString()
        : "N/A",
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-primary-900 text-white p-8 md:p-12 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            Hello, {user?.name || user?.email?.split("@")[0]}!
          </h1>
          <p className="text-primary-100 text-lg mb-8 opacity-90 leading-relaxed">
            Welcome to your personal dashboard. Here you can manage your
            profile, access your files, and explore all the features we built
            for you.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/profile">
              <Button
                variant="primary"
                className="bg-white text-primary-900 hover:bg-primary-50 border-none px-6 py-3 rounded-2xl font-bold shadow-lg transition-all active:scale-95"
              >
                Manage Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-secondary-400/10 rounded-full blur-2xl" />
        <div className="absolute top-1/2 right-12 -translate-y-1/2 opacity-20 hidden lg:block">
          <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 100 100">
            <path d="M50 0 L100 50 L50 100 L0 50 Z" />
          </svg>
        </div>
      </div>

      {/* Grid of cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="p-6 border border-outline-variant/30 dark:border-transparent hover:border-primary/20 transition-all duration-300 group hover:shadow-xl hover:shadow-primary/5"
          >
            <div className="flex items-center gap-4 mb-3">
              <div
                className={`${stat.bg} ${stat.color} p-2.5 rounded-xl transition-transform group-hover:scale-110`}
              >
                {stat.icon}
              </div>
              <span className="text-xs font-bold text-surface-on-variant uppercase tracking-widest">
                {stat.label}
              </span>
            </div>
            <div className="text-2xl font-bold text-surface-on tracking-tight">
              {stat.value}
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity or Next Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8 border border-outline-variant/30 dark:border-transparent">
          <h3 className="text-xl font-bold mb-6 text-surface-on flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            Quick Actions
          </h3>
          <div className="space-y-4">
            <Link
              to="/profile"
              className="flex items-center justify-between p-4 rounded-2xl bg-surface-variant/20 hover:bg-surface-variant/40 transition-all border border-transparent hover:border-outline-variant/20 group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-lg group-hover:bg-primary/20 transition-colors">
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
                </div>
                <div>
                  <h4 className="font-bold text-sm">Update Profile</h4>
                  <p className="text-xs text-surface-on-variant">
                    Keep your information up to date
                  </p>
                </div>
              </div>
              <svg
                className="w-5 h-5 text-surface-on-variant group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
            <Link
              to="/storage"
              className="flex items-center justify-between p-4 rounded-2xl bg-surface-variant/20 hover:bg-surface-variant/40 transition-all border border-transparent hover:border-outline-variant/20 group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 text-secondary rounded-lg group-hover:bg-secondary/20 transition-colors">
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm">Cloud Storage</h4>
                  <p className="text-xs text-surface-on-variant">
                    Manage your uploaded files
                  </p>
                </div>
              </div>
              <svg
                className="w-5 h-5 text-surface-on-variant group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </Card>

        <Card className="p-8 border border-outline-variant/30 dark:border-transparent flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-primary opacity-40 shadow-sm"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold">New features coming soon</h3>
          <p className="text-sm text-surface-on-variant max-w-xs mx-auto">
            We're working hard to bring you more features. Stay tuned for
            updates in your portal!
          </p>
          <div className="pt-4 flex gap-2">
            <div
              className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ClientDashboard;
