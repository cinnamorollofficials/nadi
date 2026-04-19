import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/Card";

const SymptomChecker = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content:
        "Hello! I'm your Clinical Assistant. I'm here to help you understand what might be causing your symptoms.",
      timestamp: new Date(),
    },
    {
      id: 2,
      type: "ai",
      content:
        "To get started, could you please describe what symptoms you are experiencing today and when they began?",
      timestamp: new Date(),
    },
  ]);

  const [currentInput, setCurrentInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const steps = [
    {
      id: 1,
      label: "Initial Assessment",
      description: "Describe how you're feeling.",
      status: "current",
    },
    {
      id: 2,
      label: "Vitals Check",
      description: "",
      status: "upcoming",
    },
    {
      id: 3,
      label: "Analysis",
      description: "",
      status: "upcoming",
    },
    {
      id: 4,
      label: "Recommendations",
      description: "",
      status: "upcoming",
    },
  ];

  const quickResponses = [
    "It stays in my back",
    "Radiates to right leg",
    "Radiates to left leg",
    "I also have numbness",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: currentInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: "ai",
        content:
          "I understand. Lower back pain can be quite uncomfortable. Does the pain radiate down either of your legs, or is it localized to your back?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleQuickResponse = (response) => {
    setCurrentInput(response);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-6rem)] lg:h-[calc(100vh-8rem)] gap-0 lg:gap-6 overflow-hidden">
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[40] lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar - Progress Steps (Drawer on Mobile) */}
      <div
        className={`
        fixed inset-y-0 left-0 w-80 bg-surface z-[50] transform transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0 lg:z-0 lg:w-80 flex-shrink-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <Card className="p-6 h-full border-0 lg:border border-outline-variant/30 rounded-none lg:rounded-md3-xl flex flex-col">
          <div className="mb-8 pl-1">
            <div className="flex items-center justify-between lg:block">
              <div>
                <h1 className="text-lg font-bold text-surface-on mb-1 tracking-tight">
                  Diagnostic Path
                </h1>
                <p className="text-surface-on-variant text-[9px] font-medium opacity-80 uppercase tracking-widest">
                  Clinical AI Protocol
                </p>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 rounded-full hover:bg-surface-variant/30 text-surface-on-variant"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {steps.map((step, index) => (
              <div key={step.id} className="group flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      step.status === "current"
                        ? "bg-primary text-on-primary shadow-lg shadow-primary/20 scale-110"
                        : step.status === "completed"
                          ? "bg-primary/20 text-primary"
                          : "bg-surface-container-highest text-surface-on-variant border border-outline-variant/30"
                    }`}
                  >
                    {step.status === "completed" ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-0.5 h-10 mt-2 rounded-full transition-colors duration-500 ${
                        step.status === "completed"
                          ? "bg-primary/40"
                          : "bg-outline-variant/30"
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1 pt-1.5 pb-2">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3
                      className={`text-[13px] sm:text-xs font-bold transition-colors ${
                        step.status === "current"
                          ? "text-surface-on"
                          : "text-surface-on-variant/60"
                      }`}
                    >
                      {step.label}
                    </h3>
                  </div>
                  {step.description && (
                    <p
                      className={`text-[11px] sm:text-[10px] leading-relaxed transition-opacity duration-300 ${
                        step.status === "current"
                          ? "text-surface-on-variant"
                          : "text-surface-on-variant/40"
                      }`}
                    >
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer (MD3 Style Card) */}
          <div className="mt-auto pt-6">
            <div className="p-4 bg-surface-container-highest/50 rounded-2xl border border-outline-variant/20 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-error/10 text-error rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <p className="text-[9px] uppercase font-bold tracking-wider text-surface-on-variant/70 leading-normal">
                  Non-substitution for medical advice. Protocol in development.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Card className="flex-1 flex flex-col border-0 lg:border border-outline-variant/30 rounded-none lg:rounded-md3-xl overflow-hidden bg-surface-container-low shadow-sm transition-all duration-300">
          {/* Chat Header */}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-0 lg:p-8 space-y-8 custom-scrollbar bg-surface/30">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex w-full gap-3 lg:gap-4 animate-fade-in-up ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 lg:w-9 lg:h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                    message.type === "ai"
                      ? "bg-primary text-on-primary ring-4 ring-primary/5"
                      : "bg-surface-container-highest text-surface-on-variant"
                  }`}
                >
                  {message.type === "ai" ? (
                    <svg
                      className="w-4 h-4 lg:w-5 lg:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 lg:w-5 lg:h-5"
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
                  )}
                </div>

                <div
                  className={`flex flex-col max-w-[85%] lg:max-w-[75%] ${message.type === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`p-4 lg:p-5 rounded-3xl shadow-sm leading-relaxed transition-all ${
                      message.type === "user"
                        ? "bg-primary text-on-primary rounded-tr-none border-0"
                        : "bg-surface-container-highest text-surface-on rounded-tl-none border border-outline-variant/10"
                    }`}
                  >
                    <p className="text-[13px] sm:text-[13px]">
                      {message.content}
                    </p>
                  </div>
                  <span className="mt-2 text-[10px] font-bold text-surface-on-variant/60 uppercase tracking-widest px-1">
                    {message.type === "user" ? "Patient" : "Clinical AI"} • JUST
                    NOW
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex w-full gap-3 lg:gap-4 animate-fade-in-up flex-row">
                <div className="w-8 h-8 lg:w-9 lg:h-9 bg-primary text-on-primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/10">
                  <svg
                    className="w-4 h-4 lg:w-5 lg:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div className="flex flex-col max-w-[75%] items-start">
                  <div className="p-4 rounded-3xl bg-surface-container-highest text-surface-on rounded-tl-none border border-outline-variant/20 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "200ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "400ms" }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-bold text-primary/70 uppercase tracking-widest">
                        Processing Clinical Context...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Response & Input Area Wrapper */}
          <div className="flex flex-col flex-shrink-0 bg-surface-container-low/80 backdrop-blur-xl border-t border-outline-variant/20 p-4 lg:p-6 pb-6 lg:pb-8">
            {/* Quick Response Buttons */}
            {quickResponses.length > 0 && (
              <div className="mb-4 overflow-x-auto no-scrollbar">
                <div className="flex gap-2 min-w-max">
                  {quickResponses.map((response, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickResponse(response)}
                      className="px-4 py-2.5 text-[11px] sm:text-[10px] font-bold bg-surface-container-highest/60 hover:bg-primary/10 hover:text-primary border border-outline-variant/30 hover:border-primary/40 rounded-full transition-all duration-300 whitespace-nowrap active:scale-95"
                    >
                      {response}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Island */}
            <div className="relative flex items-end gap-3 lg:gap-4 max-w-5xl mx-auto w-full group">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe your symptoms professionally..."
                  className="w-full px-6 py-4 pr-14 bg-surface-container-highest/40 border border-outline-variant/40 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all resize-none shadow-sm min-h-[56px] max-h-[160px] text-sm"
                  rows="1"
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                />
                <button className="absolute right-4 bottom-3 p-2 text-surface-on-variant/50 hover:text-primary transition-colors rounded-full hover:bg-primary/5">
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
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                </button>
              </div>

              <button
                onClick={handleSendMessage}
                disabled={!currentInput.trim() || isTyping}
                className={`p-4 h-14 w-14 lg:h-[56px] lg:w-[56px] rounded-full flex items-center justify-center transition-all duration-300 shadow-lg shadow-primary/20 ${
                  !currentInput.trim() || isTyping
                    ? "bg-surface-container-highest text-surface-on-variant/30 cursor-not-allowed shadow-none border border-outline-variant/20"
                    : "bg-primary text-on-primary hover:brightness-110 active:scale-90 scale-100 hover:scale-105"
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
        </Card>
      </div>
    </div>
  );
};

export default SymptomChecker;
