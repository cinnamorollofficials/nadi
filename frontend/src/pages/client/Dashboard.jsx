import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/Card";

const ClientDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Mock data for the health dashboard
  const weeklyActivity = [
    { day: "Mon", value: 20 },
    { day: "Tue", value: 35 },
    { day: "Wed", value: 25 },
    { day: "Thu", value: 80 },
    { day: "Fri", value: 45 },
    { day: "Sat", value: 30 },
    { day: "Sun", value: 25 },
  ];

  const recentActivity = [
    {
      id: 1,
      title: "Persistent Cough",
      date: "Oct 24, 2024",
      type: "AI Analysis Completed",
      status: "Stable",
      icon: "🔍",
    },
    {
      id: 2,
      title: "Dietary Advice",
      date: "Oct 22, 2024",
      type: "Consultation Log",
      status: "Follow-up",
      icon: "🥗",
    },
    {
      id: 3,
      title: "Activity Log",
      date: "Oct 20, 2024",
      type: "System Sync",
      status: "Optimal",
      icon: "📊",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Welcome Section */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-surface-on mb-1">
          Hello, {user?.name?.split(' ')[0] || user?.email?.split("@")[0] || "Julian"}
        </h1>
        <p className="text-surface-on-variant text-sm">
          Your health indicators are looking stable today. How can we assist you?
        </p>
      </div>

      {/* Main Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* New Symptom Check Card */}
        <Card className="relative overflow-hidden bg-primary text-on-primary p-6 border-0">
          <div className="relative z-10">
            <div className="w-10 h-10 bg-on-primary/20 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-1">New Symptom Check</h3>
            <p className="text-on-primary/80 text-sm mb-4">
              Start a precise, AI-guided clinical evaluation of your current symptoms.
            </p>
            <Link
              to="/new-check"
              className="inline-flex items-center gap-2 text-sm font-bold hover:gap-3 transition-all"
            >
              Start Check
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="absolute top-4 right-4 opacity-20">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </div>
        </Card>

        {/* Health Consultation Card */}
        <Card className="relative overflow-hidden bg-surface-container-low/20 p-6 border border-outline-variant/10">
          <div className="relative z-10">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-1 text-surface-on">Start Health Consultation</h3>
            <p className="text-surface-on-variant text-sm mb-4">
              Connect instantly with our AI medical specialists for detailed guidance.
            </p>
            <Link
              to="/new-check?mode=chat"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all"
            >
              Start Chat
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="absolute top-4 right-4 opacity-10">
            <svg className="w-16 h-16 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
          </div>
        </Card>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart */}
        <div className="lg:col-span-2">
          <Card className="p-5 border border-outline-variant/10 bg-surface-container-low/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-surface-on">Weekly Activity</h3>
                <p className="text-xs text-surface-on-variant">Past 7 Days</p>
              </div>
            </div>
            
            {/* Simple Bar Chart */}
            <div className="flex items-end justify-between h-28 gap-2">
              {weeklyActivity.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="w-full bg-surface-variant/20 rounded-t-lg relative overflow-hidden" style={{ height: '80px' }}>
                    <div 
                      className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-1000 ${
                        index === 3 ? 'bg-primary' : 'bg-surface-variant/60'
                      }`}
                      style={{ height: `${item.value}%` }}
                    />
                  </div>
                  <span className="text-xs text-surface-on-variant mt-2 font-medium">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Symptom Trends */}
          <Card className="p-5 border border-outline-variant/10 bg-surface-container-low/10 mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-surface-on">Symptom Trends</h3>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-surface-on-variant">Recovery</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-surface-variant"></div>
                  <span className="text-surface-on-variant">Incidence</span>
                </div>
              </div>
            </div>
            
            {/* Simple Wave Chart Representation */}
            <div className="h-24 relative overflow-hidden rounded-lg bg-surface-variant/10">
              <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                <path
                  d="M0,60 Q100,20 200,40 T400,30"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-primary"
                />
                <path
                  d="M0,80 Q100,70 200,60 T400,65"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-surface-variant opacity-60"
                />
              </svg>
            </div>
          </Card>
        </div>

        {/* Water Intake & Recent Activity */}
        <div className="space-y-4">
          {/* Water Intake */}
          <Card className="p-5 border border-outline-variant/10 bg-surface-container-low/10">
            <h3 className="text-base font-bold text-surface-on mb-3">Water Intake</h3>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-surface-variant/20"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${72 * 2.51} ${251.2}`}
                    className="text-primary"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xl font-bold text-surface-on">1.8</div>
                    <div className="text-xs text-surface-on-variant">Liters</div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-surface-on-variant text-center">
              72% of daily goal reached
            </p>
          </Card>

          {/* Recent Activity */}
          <Card className="p-4 border border-outline-variant/10 bg-surface-container-low/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-surface-on">Recent Activity</h3>
              <Link to="/profile" className="text-xs text-primary font-bold hover:underline">
                View all history
              </Link>
            </div>
            
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-variant/20 transition-colors">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-sm">
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-surface-on truncate">
                      {activity.title}
                    </h4>
                    <p className="text-xs text-surface-on-variant">
                      {activity.date} • {activity.type}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                    activity.status === 'Stable' ? 'bg-primary/10 text-primary' :
                    activity.status === 'Follow-up' ? 'bg-surface-variant/20 text-surface-on-variant' :
                    'bg-primary/10 text-primary'
                  }`}>
                    {activity.status}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Daily Tip */}
      <Card className="p-4 border border-outline-variant/10 bg-surface-container-low/30">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-surface-on mb-1">Daily Personalized Tip</h3>
            <p className="text-surface-on-variant text-sm mb-4">
              Increasing your hydration by just 500ml today could improve your focus levels by up to 15%. 
              Your current trend shows a slight dip in the afternoon — try a glass of water at 2:00 PM.
            </p>
            <button className="text-sm font-bold text-primary hover:underline">
              Dismiss
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ClientDashboard;