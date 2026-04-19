import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card";

const StartSelection = () => {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState("clinical");
  const [prompt, setPrompt] = useState("");

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

  return (
    <div className="max-w-3xl mx-auto py-20 px-6 min-h-[70vh] flex flex-col items-center justify-center">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-3xl font-bold text-surface-on mb-3 tracking-tight">
          How can we help you today?
        </h1>
      </div>

      {/* Mode Toggle Row */}
      <div className="flex bg-surface-container-low p-1.5 rounded-[2rem] border border-outline-variant/10 mb-8 animate-fade-in-up shadow-sm">
        <button
          onClick={() => setSelectedMode("clinical")}
          className={`px-8 py-3 rounded-[1.8rem] text-sm font-bold transition-all duration-300 flex items-center gap-3 ${
            selectedMode === "clinical"
              ? "bg-primary text-on-primary shadow-lg shadow-primary/20 scale-100"
              : "text-surface-on-variant hover:text-primary"
          }`}
        >
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Symptom Checker
        </button>
        <button
          onClick={() => setSelectedMode("chat")}
          className={`px-8 py-3 rounded-[1.8rem] text-sm font-bold transition-all duration-300 flex items-center gap-3 ${
            selectedMode === "chat"
              ? "bg-primary text-on-primary shadow-lg shadow-primary/20 scale-100"
              : "text-surface-on-variant hover:text-primary"
          }`}
        >
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
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          Health Assistant
        </button>
      </div>

      {/* Main Input Area */}
      <div
        className="w-full max-w-2xl animate-fade-in-up"
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
        className="mt-12 flex flex-wrap justify-center gap-3 animate-fade-in opacity-0"
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
  );
};

export default StartSelection;
