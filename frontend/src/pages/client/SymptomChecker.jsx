import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/Card";

const SymptomChecker = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello! I'm your Clinical Assistant. I'm here to help you understand what might be causing your symptoms.",
      timestamp: new Date(),
    },
    {
      id: 2,
      type: 'ai',
      content: "To get started, could you please describe what symptoms you are experiencing today and when they began?",
      timestamp: new Date(),
    }
  ]);
  
  const [currentInput, setCurrentInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const steps = [
    {
      id: 1,
      label: "Initial Assessment",
      description: "Describe how you're feeling.",
      status: "current"
    },
    {
      id: 2,
      label: "Vitals Check",
      description: "",
      status: "upcoming"
    },
    {
      id: 3,
      label: "Analysis",
      description: "",
      status: "upcoming"
    },
    {
      id: 4,
      label: "Recommendations",
      description: "",
      status: "upcoming"
    }
  ];

  const quickResponses = [
    "It stays in my back",
    "Radiates to right leg", 
    "Radiates to left leg",
    "I also have numbness"
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
      type: 'user',
      content: currentInput,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'ai',
        content: "I understand. Lower back pain can be quite uncomfortable. Does the pain radiate down either of your legs, or is it localized to your back?",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleQuickResponse = (response) => {
    setCurrentInput(response);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Left Sidebar - Progress Steps */}
      <div className="w-80 flex-shrink-0">
        <Card className="p-6 h-full border border-outline-variant/30">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-surface-on mb-2">Checkup</h1>
            <p className="text-surface-on-variant text-sm">
              Analyze your symptoms with our Clinical AI assistant.
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step.status === 'current' 
                      ? 'bg-primary text-on-primary' 
                      : step.status === 'completed'
                      ? 'bg-primary/20 text-primary'
                      : 'bg-surface-variant/30 text-surface-on-variant'
                  }`}>
                    {step.status === 'completed' ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-0.5 h-8 mt-2 ${
                      step.status === 'completed' ? 'bg-primary/30' : 'bg-surface-variant/30'
                    }`} />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`text-sm font-bold ${
                      step.status === 'current' ? 'text-surface-on' : 'text-surface-on-variant'
                    }`}>
                      {step.label}
                    </h3>
                    {step.status === 'current' && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full">
                        CURRENT
                      </span>
                    )}
                    {step.status === 'upcoming' && (
                      <span className="px-2 py-0.5 bg-surface-variant/20 text-surface-on-variant text-xs font-bold rounded-full">
                        UPCOMING
                      </span>
                    )}
                  </div>
                  {step.description && (
                    <p className="text-xs text-surface-on-variant">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="mt-8 p-4 bg-surface-container-high rounded-xl border border-outline-variant/20">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-surface-on-variant leading-relaxed">
                  This tool is for information purposes and not a substitute for professional medical advice.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <Card className="flex-1 flex flex-col border border-outline-variant/30 overflow-hidden">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-outline-variant/20 bg-surface-container-low">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-surface-on">Clinical Assistant</h2>
                  <p className="text-xs text-surface-on-variant">AI-powered symptom analysis</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link 
                  to="/dashboard"
                  className="text-xs text-primary font-bold hover:underline"
                >
                  ← Back to Dashboard
                </Link>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.type === 'ai' && (
                  <div className="w-8 h-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                )}
                
                <div className={`max-w-md ${message.type === 'user' ? 'order-first' : ''}`}>
                  <div className={`p-4 rounded-2xl ${
                    message.type === 'user' 
                      ? 'bg-primary text-on-primary ml-auto' 
                      : 'bg-surface-container-high text-surface-on'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  <div className={`flex items-center gap-2 mt-2 text-xs text-surface-on-variant ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    <span className="font-bold uppercase tracking-wider">
                      {message.type === 'user' ? 'YOU' : 'CLINICAL AI'}
                    </span>
                    <span>•</span>
                    <span>{message.type === 'ai' ? 'JUST NOW' : '1M AGO'}</span>
                  </div>
                </div>

                {message.type === 'user' && (
                  <div className="w-8 h-8 bg-surface-variant/30 text-surface-on rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="max-w-md">
                  <div className="p-4 rounded-2xl bg-surface-container-high text-surface-on">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-xs text-surface-on-variant">AI is analyzing your input...</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-surface-on-variant">
                    <span className="font-bold uppercase tracking-wider">CLINICAL AI</span>
                    <span>•</span>
                    <span>TYPING...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Response Buttons */}
          {quickResponses.length > 0 && (
            <div className="px-6 py-3 border-t border-outline-variant/20 bg-surface-container-low/50">
              <div className="flex flex-wrap gap-2">
                {quickResponses.map((response, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickResponse(response)}
                    className="px-3 py-2 text-xs font-medium bg-surface-container-high hover:bg-primary/10 hover:text-primary border border-outline-variant/30 hover:border-primary/30 rounded-full transition-all duration-200"
                  >
                    {response}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-6 border-t border-outline-variant/20 bg-surface-container-low">
            <div className="flex items-end gap-4">
              <button className="p-3 text-surface-on-variant hover:text-primary hover:bg-primary/10 rounded-xl transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your response here..."
                  className="w-full px-4 py-3 pr-12 bg-surface-variant/20 border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all resize-none"
                  rows="1"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-surface-on-variant hover:text-primary transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
              </div>

              <button
                onClick={handleSendMessage}
                disabled={!currentInput.trim() || isTyping}
                className="p-3 bg-primary text-on-primary rounded-xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>

            <div className="flex items-center justify-between mt-3 text-xs text-surface-on-variant">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  <div className="w-1 h-1 bg-surface-variant rounded-full"></div>
                </div>
                <span>AI is analyzing your input...</span>
              </div>
              <button className="text-primary font-bold hover:underline">
                View session history
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SymptomChecker;