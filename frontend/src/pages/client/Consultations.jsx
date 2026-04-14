import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/Card";

const Consultations = () => {
  const [activeTab, setActiveTab] = useState("active");

  const consultations = {
    active: [
      {
        id: 1,
        title: "Lower Back Pain Follow-up",
        doctor: "Dr. Sarah Wilson",
        specialty: "Orthopedic Specialist",
        date: "Oct 25, 2024",
        time: "2:00 PM",
        status: "Scheduled",
        type: "Follow-up",
        duration: "30 minutes"
      }
    ],
    completed: [
      {
        id: 2,
        title: "General Health Consultation",
        doctor: "Dr. Michael Chen",
        specialty: "General Practitioner",
        date: "Oct 20, 2024",
        time: "10:15 AM",
        status: "Completed",
        type: "Initial",
        duration: "45 minutes",
        notes: "Patient showed improvement in symptoms. Continue current treatment plan."
      },
      {
        id: 3,
        title: "Nutrition Consultation",
        doctor: "Dr. Emily Rodriguez",
        specialty: "Nutritionist",
        date: "Oct 15, 2024",
        time: "3:30 PM",
        status: "Completed",
        type: "Consultation",
        duration: "30 minutes",
        notes: "Dietary recommendations provided. Follow-up in 4 weeks."
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-on mb-2">Consultations</h1>
          <p className="text-surface-on-variant">
            Manage your appointments and view consultation history
          </p>
        </div>
        <button className="px-4 py-2 bg-primary text-on-primary rounded-xl font-bold hover:brightness-110 transition-all">
          Book Consultation
        </button>
      </div>

      {/* Tabs */}
      <Card className="p-6 border border-outline-variant/30">
        <div className="flex gap-2">
          {[
            { key: "active", label: "Active", count: consultations.active.length },
            { key: "completed", label: "Completed", count: consultations.completed.length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
                activeTab === tab.key
                  ? "bg-primary text-on-primary"
                  : "bg-surface-variant/20 text-surface-on-variant hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {tab.label}
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                activeTab === tab.key
                  ? "bg-on-primary/20 text-on-primary"
                  : "bg-surface-variant/30 text-surface-on-variant"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </Card>

      {/* Consultations List */}
      <div className="space-y-4">
        {consultations[activeTab].map((consultation) => (
          <Card key={consultation.id} className="p-6 border border-outline-variant/30 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-3 h-3 rounded-full ${
                    consultation.status === "Scheduled" ? "bg-primary" :
                    consultation.status === "Completed" ? "bg-green-500" : "bg-surface-variant"
                  }`} />
                  <span className="text-xs font-bold text-surface-on-variant uppercase tracking-wider">
                    {consultation.type}
                  </span>
                  <span className="text-xs text-surface-on-variant">•</span>
                  <span className="text-xs text-surface-on-variant">
                    {consultation.date} at {consultation.time}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-surface-on mb-2">
                  {consultation.title}
                </h3>
                
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-surface-on">{consultation.doctor}</p>
                      <p className="text-xs text-surface-on-variant">{consultation.specialty}</p>
                    </div>
                  </div>
                </div>

                {consultation.notes && (
                  <p className="text-surface-on-variant text-sm mb-3 p-3 bg-surface-container-high rounded-lg">
                    <span className="font-bold">Notes: </span>
                    {consultation.notes}
                  </p>
                )}
                
                <div className="flex items-center gap-4 text-xs text-surface-on-variant">
                  <span>Duration: {consultation.duration}</span>
                  <span className={`px-2 py-1 rounded-full font-bold ${
                    consultation.status === "Scheduled" 
                      ? "bg-primary/10 text-primary" 
                      : consultation.status === "Completed"
                      ? "bg-green-500/10 text-green-600"
                      : "bg-surface-variant/20 text-surface-on-variant"
                  }`}>
                    {consultation.status}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                {consultation.status === "Scheduled" && (
                  <>
                    <button className="px-3 py-2 text-xs font-bold text-primary hover:bg-primary/10 rounded-lg transition-all">
                      Reschedule
                    </button>
                    <button className="px-3 py-2 text-xs font-bold text-error hover:bg-error/10 rounded-lg transition-all">
                      Cancel
                    </button>
                  </>
                )}
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

      {consultations[activeTab].length === 0 && (
        <Card className="p-12 text-center border border-outline-variant/30">
          <div className="w-16 h-16 bg-surface-variant/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-surface-on-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-surface-on mb-2">
            No {activeTab} consultations
          </h3>
          <p className="text-surface-on-variant mb-4">
            {activeTab === "active" 
              ? "You don't have any upcoming consultations scheduled."
              : "You haven't completed any consultations yet."
            }
          </p>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl font-bold hover:brightness-110 transition-all">
            Book Consultation
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </Card>
      )}
    </div>
  );
};

export default Consultations;