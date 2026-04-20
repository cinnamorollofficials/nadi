import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Bot, AlertCircle, Loader2 } from "lucide-react";
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
        <div className="max-w-4xl mx-auto p-4 lg:p-6 space-y-6">
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
                <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center overflow-hidden ${
                  msg.role === "user" ? "bg-primary text-on-primary shadow-lg shadow-primary/20" : "bg-secondary text-on-secondary shadow-lg shadow-secondary/20 p-2"
                }`}>
                  {msg.role === "user" ? (
                    <User size={20} />
                  ) : logo ? (
                    <img src={`${import.meta.env.VITE_API_URL}/public/storage/${logo}`} alt="Nadi" className="w-full h-full object-contain brightness-0 invert" />
                  ) : (
                    <Bot size={20} />
                  )}
                </div>
                
                <div className={`p-4 rounded-3xl shadow-sm ${
                  msg.role === "user" 
                    ? "bg-primary text-on-primary rounded-tr-none" 
                    : "bg-surface-container-high text-surface-on rounded-tl-none border border-outline-variant/20"
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
                <div className="p-4 bg-surface-container-high text-surface-on rounded-3xl rounded-tl-none flex items-center gap-1 border border-outline-variant/20">
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

      {/* Input Area */}
      <div className="p-4 lg:p-6 bg-transparent">
        <form onSubmit={handleSubmit} className="relative group max-w-4xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            placeholder="Ketik pesan Anda di sini..."
            disabled={isTyping}
            className="w-full bg-surface-container-highest text-surface-on pl-6 pr-16 py-5 rounded-3xl border border-outline-variant/50 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm disabled:opacity-50 text-base"
          />
          <button
            type="submit"
            disabled={isTyping}
            className="absolute right-2 bottom-2 w-12 h-12 bg-primary text-on-primary rounded-2xl flex items-center justify-center hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/25 disabled:bg-surface-variant disabled:shadow-none"
          >
            {isTyping ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          </button>
        </form>
        <p className="text-[10px] text-surface-on-variant mt-3 text-center opacity-40">
          Nadi AI memberikan informasi kesehatan umum. Selalu konsultasikan dengan dokter untuk keadaan darurat.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;
