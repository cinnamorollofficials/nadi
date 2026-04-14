import { useState } from "react";
import Card from "../../components/Card";

const HealthStats = () => {
  const [timeRange, setTimeRange] = useState("week");

  const stats = {
    vitals: {
      heartRate: { value: 72, unit: "bpm", status: "normal", trend: "stable" },
      bloodPressure: { value: "120/80", unit: "mmHg", status: "normal", trend: "stable" },
      temperature: { value: 98.6, unit: "°F", status: "normal", trend: "stable" },
      weight: { value: 165, unit: "lbs", status: "normal", trend: "down" }
    },
    activity: {
      steps: { value: 8420, goal: 10000, unit: "steps" },
      calories: { value: 2150, goal: 2200, unit: "cal" },
      sleep: { value: 7.5, goal: 8, unit: "hours" },
      water: { value: 1.8, goal: 2.5, unit: "liters" }
    }
  };

  const weeklyData = [
    { day: "Mon", steps: 8200, calories: 2100, sleep: 7.2, water: 1.6 },
    { day: "Tue", steps: 9500, calories: 2300, sleep: 8.1, water: 2.1 },
    { day: "Wed", steps: 7800, calories: 2000, sleep: 6.8, water: 1.4 },
    { day: "Thu", steps: 10200, calories: 2400, sleep: 7.9, water: 2.3 },
    { day: "Fri", steps: 8900, calories: 2200, sleep: 7.5, water: 1.9 },
    { day: "Sat", steps: 6500, calories: 1900, sleep: 8.5, water: 2.0 },
    { day: "Sun", steps: 8420, calories: 2150, sleep: 7.5, water: 1.8 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "normal": return "text-green-600 bg-green-500/10";
      case "warning": return "text-yellow-600 bg-yellow-500/10";
      case "critical": return "text-red-600 bg-red-500/10";
      default: return "text-surface-on-variant bg-surface-variant/20";
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "up":
        return <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
        </svg>;
      case "down":
        return <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
        </svg>;
      default:
        return <svg className="w-4 h-4 text-surface-on-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-on mb-2">Health Stats</h1>
          <p className="text-surface-on-variant">
            Monitor your health metrics and track progress over time
          </p>
        </div>
        <div className="flex gap-2">
          {[
            { key: "week", label: "Week" },
            { key: "month", label: "Month" },
            { key: "year", label: "Year" }
          ].map((range) => (
            <button
              key={range.key}
              onClick={() => setTimeRange(range.key)}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                timeRange === range.key
                  ? "bg-primary text-on-primary"
                  : "bg-surface-variant/20 text-surface-on-variant hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vital Signs */}
      <div>
        <h2 className="text-lg font-bold text-surface-on mb-4">Vital Signs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(stats.vitals).map(([key, vital]) => (
            <Card key={key} className="p-6 border border-outline-variant/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-surface-on capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                {getTrendIcon(vital.trend)}
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold text-surface-on">
                  {vital.value}
                </span>
                <span className="text-sm text-surface-on-variant">
                  {vital.unit}
                </span>
              </div>
              <span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusColor(vital.status)}`}>
                {vital.status.toUpperCase()}
              </span>
            </Card>
          ))}
        </div>
      </div>

      {/* Activity Metrics */}
      <div>
        <h2 className="text-lg font-bold text-surface-on mb-4">Daily Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(stats.activity).map(([key, activity]) => {
            const percentage = (activity.value / activity.goal) * 100;
            return (
              <Card key={key} className="p-6 border border-outline-variant/30">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-surface-on capitalize">
                    {key}
                  </h3>
                  <span className="text-xs text-surface-on-variant">
                    {Math.round(percentage)}%
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold text-surface-on">
                      {activity.value}
                    </span>
                    <span className="text-sm text-surface-on-variant">
                      / {activity.goal} {activity.unit}
                    </span>
                  </div>
                  
                  <div className="w-full bg-surface-variant/20 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        percentage >= 100 ? 'bg-green-500' :
                        percentage >= 75 ? 'bg-primary' :
                        percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Weekly Trends */}
      <Card className="p-6 border border-outline-variant/30">
        <h2 className="text-lg font-bold text-surface-on mb-6">Weekly Trends</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Steps Chart */}
          <div>
            <h3 className="text-sm font-bold text-surface-on mb-4">Daily Steps</h3>
            <div className="flex items-end justify-between h-32 gap-2">
              {weeklyData.map((day, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="w-full bg-surface-variant/20 rounded-t-lg relative overflow-hidden" style={{ height: '100px' }}>
                    <div 
                      className="absolute bottom-0 w-full rounded-t-lg transition-all duration-1000 bg-primary"
                      style={{ height: `${(day.steps / 12000) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-surface-on-variant mt-2 font-medium">
                    {day.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sleep Chart */}
          <div>
            <h3 className="text-sm font-bold text-surface-on mb-4">Sleep Hours</h3>
            <div className="flex items-end justify-between h-32 gap-2">
              {weeklyData.map((day, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="w-full bg-surface-variant/20 rounded-t-lg relative overflow-hidden" style={{ height: '100px' }}>
                    <div 
                      className="absolute bottom-0 w-full rounded-t-lg transition-all duration-1000 bg-secondary"
                      style={{ height: `${(day.sleep / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-surface-on-variant mt-2 font-medium">
                    {day.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Health Insights */}
      <Card className="p-6 border border-outline-variant/30 bg-surface-container-high">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-surface-on mb-2">Health Insights</h3>
            <div className="space-y-3">
              <div className="p-3 bg-surface-container rounded-lg">
                <p className="text-sm text-surface-on-variant">
                  <span className="font-bold text-primary">Great progress!</span> Your step count has increased by 15% this week compared to last week.
                </p>
              </div>
              <div className="p-3 bg-surface-container rounded-lg">
                <p className="text-sm text-surface-on-variant">
                  <span className="font-bold text-yellow-600">Attention needed:</span> Your water intake is below the recommended daily amount. Try to drink more throughout the day.
                </p>
              </div>
              <div className="p-3 bg-surface-container rounded-lg">
                <p className="text-sm text-surface-on-variant">
                  <span className="font-bold text-green-600">Excellent:</span> Your sleep pattern is consistent and within the healthy range.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HealthStats;