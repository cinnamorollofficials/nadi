import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Bot, AlertCircle, Loader2, ArrowUp } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";
import LottieLogo from "../LottieLogo";
import Label from "../Label";

const DiseaseButton = ({ name, onClick }) => (
  <button
    onClick={() => onClick?.(name)}
    className="inline-flex items-center gap-1.5 mt-2 mb-1 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl font-bold text-xs transition-all active:scale-95 cursor-pointer"
  >
    <span>{name}</span>
    <ArrowUp size={10} className="rotate-45" />
  </button>
);

const DISEASE_PATTERN = /\[\[(.*?)\]\]/g;

const mdComponents = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  li: ({ children }) => <li className="mb-1">{children}</li>,
  ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
  h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
  h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
  h3: ({ children }) => <h3 className="text-md font-bold mb-2">{children}</h3>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary/30 pl-4 italic my-2">{children}</blockquote>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full border border-outline-variant/30 text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="border border-outline-variant/30 p-2 bg-surface-variant/20">{children}</th>,
  td: ({ children }) => <td className="border border-outline-variant/30 p-2">{children}</td>,
};

// Extract [[disease]] tags from content and return clean text + disease list
const extractDiseases = (content) => {
  const diseases = [];
  const cleanContent = content.replace(/\[\[(.*?)\]\]/g, (_, name) => {
    diseases.push(name.trim());
    return ''; // Remove from displayed text
  }).trim();
  return { cleanContent, diseases };
};

const MarkdownRenderer = ({ content }) => (
  <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
    {content}
  </ReactMarkdown>
);


const ChatInterface = ({ 
  messages, 
  onSendMessage, 
  onRetry, 
  isTyping, 
  error,
  disease,
  mode = "consultation",
  suggestions = [],
  onDiseaseClick
}) => {
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

  const isSymptomMode = mode === "symptom_check";

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-outline-variant scrollbar-track-transparent">
        {/* Topic/Mode Badge */}
        <div className="sticky top-0 z-10 flex flex-col items-center py-4 px-6 gap-2 pointer-events-none">
          {isSymptomMode && (
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="backdrop-blur-md px-1 py-1 rounded-full flex items-center gap-2 shadow-sm pointer-events-auto"
            >
              <Label variant="secondary" className="shadow-lg shadow-secondary/20">
                Symptom Identification Room
              </Label>
            </motion.div>
          )}
          {disease && (
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="backdrop-blur-md px-1 py-1 rounded-full flex items-center gap-2 shadow-sm pointer-events-auto"
            >
              <Label variant="primary" className="shadow-lg shadow-primary/20">
                Topik: {disease}
              </Label>
            </motion.div>
          )}
        </div>

        <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-10">
        <AnimatePresence initial={false}>
          {messages.length === 0 && !isTyping && (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center space-y-6"
            >
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center overflow-hidden p-3 shadow-inner ${isSymptomMode ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                {logo && !isSymptomMode ? (
                  <img src={`${import.meta.env.VITE_API_URL}/public/storage/${logo}`} alt="Nadi AI" className="w-full h-full object-contain" />
                ) : (
                  <Bot size={32} />
                )}
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-surface-on tracking-tight">
                  {isSymptomMode 
                    ? "Mari analisis gejala Anda" 
                    : (disease ? `Diskusi mengenai ${disease}` : "Apa yang ingin Anda tanyakan?")}
                </h3>
                <p className="text-surface-on-variant px-12 max-w-md mx-auto text-sm leading-relaxed opacity-70">
                  {isSymptomMode
                    ? "Jelaskan apa yang Anda rasakan. Saya akan menanyakan beberapa hal untuk memahami kondisi Anda."
                    : (disease 
                      ? `Asisten Nadi siap membantu Anda memahami lebih lanjut tentang ${disease}. Pilih pertanyaan di bawah atau ketik sendiri.`
                      : "Mulai konsultasi dengan menanyakan keluhan kesehatan, gejala, atau kebutuhan nutrisi Anda.")}
                </p>
              </div>

              {suggestions.length > 0 && (
                <div className="flex flex-col gap-3 w-full max-w-md px-4 mt-4">
                  {suggestions.map((s, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * (i + 1) }}
                      onClick={() => onSendMessage(s)}
                      className="text-left px-5 py-4 bg-surface-container-highest dark:bg-surface-container-high hover:bg-primary/10 hover:text-primary border border-outline-variant/30 rounded-2xl text-sm font-semibold transition-all group active:scale-95"
                    >
                      <span className="flex items-center justify-between">
                        {s}
                        <ArrowUp size={16} className="opacity-0 group-hover:opacity-100 -rotate-90 transition-all" />
                      </span>
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {messages.map((msg, index) => {
            const isBot = msg.role === "assistant";
            const { cleanContent, diseases } = isBot 
              ? extractDiseases(msg.content) 
              : { cleanContent: msg.content, diseases: [] };

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`flex flex-col ${isBot ? "items-start" : "items-end"} gap-2`}
              >
                <div className={`flex max-w-[85%] ${isBot ? "flex-row" : "flex-row-reverse"} gap-3`}>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center overflow-hidden transition-colors shadow-sm ${
                    !isBot ? "bg-primary text-white shadow-primary/20" : "bg-surface-container-highest text-primary p-2.5 border border-outline-variant/30 dark:border-outline-variant/10"
                  }`}>
                    {!isBot ? (
                      <User size={20} />
                    ) : logo ? (
                      <img src={`${import.meta.env.VITE_API_URL}/public/storage/${logo}`} alt="Nadi" className="w-full h-full object-contain dark:brightness-0 dark:invert opacity-80" />
                    ) : (
                      <Bot size={20} />
                    )}
                  </div>
                  
                  <div className={`px-5 py-4 rounded-[2rem] shadow-sm leading-relaxed transition-all ${
                    !isBot 
                      ? "bg-primary text-white rounded-tr-none" 
                      : "bg-surface-container-highest dark:bg-surface-container-high text-surface-on rounded-tl-none border border-outline-variant/60 dark:border-outline-variant/30 shadow-sm"
                  }`}>
                    <MarkdownRenderer content={cleanContent} />
                  </div>
                </div>

                {/* Disease suggestion buttons — shown below AI bubble */}
                {isBot && diseases.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap gap-2 pl-14"
                  >
                    {diseases.map((d, i) => (
                      <button
                        key={i}
                        onClick={() => onDiseaseClick?.(d)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl font-semibold text-xs transition-all active:scale-95"
                      >
                        {d}
                        <ArrowUp size={10} className="rotate-45" />
                      </button>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            );
          })}

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
              className="flex flex-col items-center gap-3 p-4"
            >
              <div className="bg-error/10 text-error px-4 py-2 rounded-2xl flex items-center gap-2 text-sm border border-error/20 max-w-md text-center">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
              <button 
                onClick={onRetry}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                Coba Kirim Ulang
              </button>
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
