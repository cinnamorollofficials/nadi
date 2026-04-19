import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card";

const StartSelection = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState("clinical");
  const [prompt, setPrompt] = useState("");
  const [hasSelectedMode, setHasSelectedMode] = useState(false);

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    setHasSelectedMode(true);
  };

  const handleStart = () => {
    const path =
      selectedMode === "clinical" ? "/new-check" : "/new-check?mode=chat";
    navigate(path, { state: { initialPrompt: prompt } });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && prompt.trim()) {
      e.preventDefault();
      handleStart();
    }
  };

  const steps = [
    { id: 1, label: "Initial Assessment" },
    { id: 2, label: "Vitals Check" },
    { id: 3, label: "Analysis" },
    { id: 4, label: "Recommendations" },
  ];

  return (
    <div className="max-w-3xl mx-auto py-20 px-6 min-h-[70vh] flex flex-col items-center justify-center">
      <div className="text-center mb-8 animate-fade-in flex flex-col items-center gap-3">
        {hasSelectedMode && (
          <span className="text-xs font-bold text-primary px-4 py-1.5 bg-primary/10 rounded-full animate-fade-in border border-primary/20">
            {selectedMode === "clinical" ? "Clinical Protocol" : "General Health Chat"}
          </span>
        )}
        <h1 className="text-3xl font-bold text-surface-on tracking-tight transition-all duration-500">
          {hasSelectedMode ? (selectedMode === "clinical" ? "Start Clinical Evaluation" : "What's on your mind?") : "How can we help you today?"}
        </h1>
      </div>

      {hasSelectedMode && selectedMode === "clinical" && (
        <div className="w-full max-w-2xl mb-12 animate-fade-in-up">
          <div className="flex items-center justify-between relative px-4">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-outline-variant/10 -translate-y-1/2 -z-10" />
            
            {steps.map((step, idx) => (
              <div key={step.id} className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all duration-500 ${
                  idx === 0 
                  ? "bg-primary border-primary text-on-primary shadow-lg shadow-primary/20" 
                  : "bg-surface-container-low border-outline-variant/20 text-surface-on-variant/40"
                }`}>
                  {step.id}
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-widest whitespace-nowrap ${
                  idx === 0 ? "text-primary" : "text-surface-on-variant/40"
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mode Toggle Row */}
      {!hasSelectedMode && (
        <div className="flex gap-4 mb-8 animate-fade-in-up">
          <button
            onClick={() => handleModeSelect("clinical")}
            className="px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 border shadow-sm bg-surface-container-low text-surface-on-variant border-outline-variant/10 hover:border-primary/30"
          >
            <div className="w-2 h-2 rounded-full bg-surface-variant/40" />
            Symptom Checker
          </button>
          <button
            onClick={() => handleModeSelect("chat")}
            className="px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 border shadow-sm bg-surface-container-low text-surface-on-variant border-outline-variant/10 hover:border-primary/30"
          >
            <div className="w-2 h-2 rounded-full bg-surface-variant/40" />
            Health Assistant
          </button>
        </div>
      )}

      {/* Main Input Area & Suggestions - Only visible after selection */}
      {hasSelectedMode && (
        <div className="w-full flex flex-col items-center animate-fade-in">
          <div
            className="w-full max-w-2xl"
            style={{ animationDelay: "150ms" }}
          >
            <div className="relative group p-1 bg-surface-container-low rounded-[2.5rem] border border-outline-variant/10 focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/5 transition-all duration-300 shadow-xl shadow-black/5">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  selectedMode === "clinical"
                    ? "Describe your symptoms (e.g. 'I have a headache for 2 days')..."
                    : "Ask anything about health, nutrition, or wellness..."
                }
                className="w-full px-8 py-6 pr-20 bg-transparent rounded-[2.2rem] focus:outline-none resize-none min-h-[120px] max-h-[240px] text-lg font-medium text-surface-on placeholder:text-surface-on-variant/40"
                rows="1"
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
              />
              <div className="absolute right-4 bottom-4">
                <button
                  onClick={handleStart}
                  disabled={!prompt.trim()}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    prompt.trim()
                      ? "bg-primary text-on-primary shadow-lg shadow-primary/20 hover:scale-110 active:scale-95"
                      : "bg-surface-container-highest text-surface-on-variant/20 cursor-not-allowed"
                  }`}
                >
                  <svg
                    className="w-6 h-6 transform rotate-45 -translate-y-0.5 -translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Suggested Prompts */}
          <div
            className="mt-12 flex flex-wrap justify-center gap-3 animate-fade-in"
            style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
          >
            <p className="w-full text-center text-xs text-surface-on-variant/40 font-bold uppercase tracking-widest mb-2">
              Suggested Starters
            </p>
            {[
              "My chest feels tight",
              "Balanced vegetarian diet",
              "Improving sleep quality",
              "Persistent dry cough",
            ].map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(suggestion)}
                className="px-4 py-2 rounded-full border border-outline-variant/10 bg-surface-container-low/50 text-[11px] font-bold text-surface-on-variant hover:border-primary/30 hover:text-primary transition-all duration-300 active:scale-95"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StartSelection;
