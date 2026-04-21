import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Bot, AlertCircle, Loader2, ArrowUp } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";
import LottieLogo from "../LottieLogo";

const MarkdownRenderer = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
        li: ({ children }) => <li className="mb-1">{children}</li>,
        h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
        h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
        h3: ({ children }) => <h3 className="text-md font-bold mb-2">{children}</h3>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary/30 pl-4 italic my-2">
            {children}
          </blockquote>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="min-w-full border border-outline-variant/30 text-sm">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => <th className="border border-outline-variant/30 p-2 bg-surface-variant/20">{children}</th>,
        td: ({ children }) => <td className="border border-outline-variant/30 p-2">{children}</td>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

const ChatInterface = ({ messages, onSendMessage, isTyping, error }) => {
  const { logo } = useSettings();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const content = inputRef.current.value.trim();
    if (content && !isTyping) {
      onSendMessage(content);
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-outline-variant scrollbar-track-transparent">
        <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-10">
        <AnimatePresence initial={false}>
          {messages.length === 0 && !isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center space-y-4"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary overflow-hidden p-3">
                {logo ? (
                  <img src={`${import.meta.env.VITE_API_URL}/public/storage/${logo}`} alt="Nadi AI" className="w-full h-full object-contain" />
                ) : (
                  <Bot size={32} />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-surface-on">How can I help you today?</h3>
                <p className="text-surface-on-variant px-12 capitalize">
                  Start a consultation by asking about your health concerns, symptoms, or nutritional needs.
                </p>
              </div>
            </motion.div>
          )}

          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex max-w-[85%] ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                } gap-3`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center overflow-hidden transition-colors shadow-sm ${
                  msg.role === "user" ? "bg-primary text-white shadow-primary/20" : "bg-surface-container-highest text-primary p-2.5 border border-outline-variant/30 dark:border-outline-variant/10"
                }`}>
                  {msg.role === "user" ? (
                    <User size={20} />
                  ) : logo ? (
                    <img src={`${import.meta.env.VITE_API_URL}/public/storage/${logo}`} alt="Nadi" className="w-full h-full object-contain dark:brightness-0 dark:invert opacity-80" />
                  ) : (
                    <Bot size={20} />
                  )}
                </div>
                
                <div className={`px-5 py-4 rounded-[2rem] shadow-sm leading-relaxed transition-all ${
                  msg.role === "user" 
                    ? "bg-primary text-white rounded-tr-none" 
                    : "bg-surface-container-highest dark:bg-surface-container-high text-surface-on rounded-tl-none border border-outline-variant/60 dark:border-outline-variant/30 shadow-sm"
                }`}>
                  <MarkdownRenderer content={msg.content} />
                </div>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex flex-row gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden p-0.5">
                  <LottieLogo className="w-9 h-9" />
                </div>
                <div className="p-4 bg-surface-container-highest dark:bg-surface-container-high text-surface-on rounded-3xl rounded-tl-none flex items-center gap-1 border border-outline-variant/60 dark:border-outline-variant/20 shadow-sm">
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-2 h-2 bg-primary rounded-full"
                  />
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    className="w-2 h-2 bg-primary rounded-full"
                  />
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    className="w-2 h-2 bg-primary rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center p-4"
            >
              <div className="bg-error/10 text-error px-4 py-2 rounded-full flex items-center gap-2 text-sm border border-error/20">
                <AlertCircle size={16} />
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
    </div>

      <div className="p-4 lg:p-6 bg-transparent">
        <form onSubmit={handleSubmit} className="relative group max-w-4xl mx-auto flex items-center">
          <div className="relative w-full">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask something.."
              disabled={isTyping}
              className="w-full bg-surface-container-highest dark:bg-surface-container-highest text-surface-on px-7 py-4 rounded-full border border-outline-variant/20 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-50 text-base shadow-sm"
            />
            <button
              type="submit"
              disabled={isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center hover:brightness-110 active:scale-95 transition-all disabled:bg-surface-variant"
            >
              {isTyping ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <ArrowUp size={20} className="stroke-[3px]" />
              )}
            </button>
          </div>
        </form>
        <p className="text-[10px] text-surface-on-variant mt-3 text-center opacity-40">
          Nadi AI memberikan informasi kesehatan umum. Selalu konsultasikan dengan dokter untuk keadaan darurat.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
