import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/Card";

const History = () => {
  const [filter, setFilter] = useState("all");

  const historyItems = [
    {
      id: 1,
      date: "Oct 24, 2024",
      time: "2:30 PM",
      type: "Symptom Check",
      title: "Lower Back Pain Assessment",
      status: "Completed",
      result: "Mild strain - Rest recommended",
      duration: "8 minutes"
    },
    {
      id: 2,
      date: "Oct 20, 2024", 
      time: "10:15 AM",
      type: "Consultation",
      title: "Follow-up Discussion",
      status: "Completed",
      result: "Improvement noted",
      duration: "15 minutes"
    },
    {
      id: 3,
      date: "Oct 18, 2024",
      time: "4:45 PM", 
      type: "Symptom Check",
      title: "Headache Analysis",
      status: "Completed",
      result: "Tension headache - Hydration advised",
      duration: "5 minutes"
    },
    {
      id: 4,
      date: "Oct 15, 2024",
      time: "11:20 AM",
      type: "Health Check",
      title: "General Wellness Review",
      status: "Completed", 
      result: "All indicators normal",
      duration: "12 minutes"
    }
  ];

  const filteredItems = filter === "all" 
    ? historyItems 
    : historyItems.filter(item => item.type.toLowerCase().includes(filter));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-on mb-2">History</h1>
          <p className="text-surface-on-variant">
            View your past consultations and symptom checks
          </p>
        </div>
        <Link
          to="/new-check"
          className="px-4 py-2 bg-primary text-on-primary rounded-xl font-bold hover:brightness-110 transition-all"
        >
          New Check
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-6 border border-outline-variant/30">
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-surface-on">Filter by:</span>
          <div className="flex gap-2">
            {[
              { key: "all", label: "All" },
              { key: "symptom", label: "Symptom Checks" },
              { key: "consultation", label: "Consultations" },
              { key: "health", label: "Health Checks" }
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`px-3 py-2 text-xs font-bold rounded-full transition-all ${
                  filter === filterOption.key
                    ? "bg-primary text-on-primary"
                    : "bg-surface-variant/20 text-surface-on-variant hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* History List */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="p-6 border border-outline-variant/30 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-full ${
                    item.type === "Symptom Check" ? "bg-primary" :
                    item.type === "Consultation" ? "bg-secondary" : "bg-tertiary"
                  }`} />
                  <span className="text-xs font-bold text-surface-on-variant uppercase tracking-wider">
                    {item.type}
                  </span>
                  <span className="text-xs text-surface-on-variant">•</span>
                  <span className="text-xs text-surface-on-variant">
                    {item.date} at {item.time}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-surface-on mb-2">
                  {item.title}
                </h3>
                
                <p className="text-surface-on-variant text-sm mb-3">
                  {item.result}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-surface-on-variant">
                  <span>Duration: {item.duration}</span>
                  <span className={`px-2 py-1 rounded-full font-bold ${
                    item.status === "Completed" 
                      ? "bg-primary/10 text-primary" 
                      : "bg-surface-variant/20 text-surface-on-variant"
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <button className="p-2 text-surface-on-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                <button className="p-2 text-surface-on-variant hover:text-primary hover:bg-primary/10 rounded-lg transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card className="p-12 text-center border border-outline-variant/30">
          <div className="w-16 h-16 bg-surface-variant/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-surface-on-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-surface-on mb-2">No history found</h3>
          <p className="text-surface-on-variant mb-4">
            No records match your current filter. Try adjusting your search criteria.
          </p>
          <Link
            to="/new-check"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl font-bold hover:brightness-110 transition-all"
          >
            Start New Check
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </Card>
      )}
    </div>
  );
};

export default History;