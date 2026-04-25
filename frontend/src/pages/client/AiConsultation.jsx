import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../api/client";
import ChatInterface from "../../components/Chat/ChatInterface";
import { useChat } from "../../hooks/useChat";
import { Bot, History as HistoryIcon, PlusCircle, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

const AiConsultation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [activeChannelId, setActiveChannelId] = useState(id);
  const [activeMode, setActiveMode] = useState("consultation");

  // Create New Channel Mutation
  const createChannelMutation = useMutation({
    mutationFn: async (mode = "consultation") => {
      const response = await apiClient.post("/chat/channel", { mode });
      return response.data.data;
    },
    onSuccess: (newChannel) => {
      queryClient.invalidateQueries({ queryKey: ["chat-history"] });
      navigate(`/consultations/ai/${newChannel.uid}`);
    },
  });

  // Messaging Hook
  const { messages, setMessages, sendMessage, resendLastMessage, isTyping, error } = useChat(activeChannelId, {
    onMessageDone: () => {
      // Refresh sidebar to get the new summarized title after the first exchange
      if (messages.length <= 2) {
        queryClient.invalidateQueries({ queryKey: ["chat-history"] });
      }
    }
  });

  // Load existing messages when channel changes
  useEffect(() => {
    if (activeChannelId && activeChannelId !== "undefined") {
      const fetchMessages = async () => {
        try {
          const response = await apiClient.get(`/chat/history/${activeChannelId}`);
          const { messages: historyMsgs, channel } = response.data.data;
          
          setActiveMode(channel?.mode || "consultation");
          setMessages(historyMsgs.map(m => ({
            role: m.role,
            content: m.content,
            isDone: true
          })));
        } catch (err) {
          console.error("Failed to fetch messages", err);
          // Redirect to root if access is denied or channel not found
          navigate("/consultations/ai");
        }
      };
      fetchMessages();
    }
  }, [activeChannelId, setMessages, navigate]);

  useEffect(() => {
    setActiveChannelId(id);
  }, [id]);

  // Handle auto-start for Symptom Checker
  useEffect(() => {
    // If it's a new Symptom Check session (no messages), trigger AI to start
    if (activeChannelId && activeMode === "symptom_check" && messages.length === 0 && !isTyping) {
      // Small delay to ensure socket is connected and ready
      const timer = setTimeout(() => {
        sendMessage("[MULAI_CEK_GEJALA]", true); // isRetry=true means it won't be added to local messages list (hidden)
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [activeChannelId, activeMode, messages.length, sendMessage, isTyping]);

  // Handle initial message after navigation
  useEffect(() => {
    if (activeChannelId && location.state?.initialMessage) {
      // Small delay to ensure socket is ready
      const timer = setTimeout(() => {
        sendMessage(location.state.initialMessage, false, location.state.prefix || '');
        // Clear state so it doesn't resend on refresh
        navigate(location.pathname, { replace: true, state: {} });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [activeChannelId, location.state, sendMessage, navigate, location.pathname]);

  // Fetch history to check for empty chats
  const { data: history } = useQuery({
    queryKey: ["chat-history"],
    queryFn: async () => {
      const resp = await apiClient.get("/chat/history");
      return resp.data.data || [];
    }
  });

  const handleNewChat = (mode = "consultation") => {
    // Prevent multiple simultaneous creations
    if (createChannelMutation.isPending) return;

    createChannelMutation.mutate(mode);
  };

  const handleSendMessage = async (content) => {
    // If disease context exists, add a hidden instruction for the first message
    const diseaseContext = location.state?.disease;
    const prefix = diseaseContext 
      ? `[SISTEM: Diskusi ini bersifat TERBATAS hanya untuk topik "${diseaseContext}". JANGAN menjawab pertanyaan yang tidak ada kaitannya dengan ${diseaseContext}. Jika user bertanya hal lain yang tidak relevan, ingatkan user untuk tetap pada topik ${diseaseContext}. Namun, jika user menanyakan penyakit lain, sarankan user untuk berdiskusi tentang penyakit tersebut secara terpisah dengan memberikan button berformat [[Tanya tentang Nama Penyakit]]. Berikan informasi medis yang akurat].`
      : '';

    if (!activeChannelId) {
      // 1. Create channel first (default to consultation for manual typing from empty state)
      try {
        const mode = location.state?.mode || "consultation";
        const newChannel = await createChannelMutation.mutateAsync(mode);
        
        // 1.5 Rename channel if disease context exists
        if (diseaseContext) {
          try {
            await apiClient.put(`/chat/rename/${newChannel.uid}`, {
              title: `${diseaseContext}: ${content}`
            });
          } catch (renameErr) {
            console.error("Failed to rename channel", renameErr);
            // Non-critical, continue
          }
        }

        // 2. Keep disease context for UI label, but ensure prefix is only for initialMessage
        const newState = { ...location.state };
        
        // 3. Navigate to new UID
        navigate(`/consultations/ai/${newChannel.uid}`, { 
          replace: true,
          state: { ...newState, initialMessage: content, prefix: prefix } 
        });
      } catch (err) {
        console.error("Failed to start chat", err);
      }
    } else {
      sendMessage(content, false, location.state?.prefix || '');
      // Clear ONLY prefix from state after first use in existing channel
      if (location.state?.prefix) {
        navigate(location.pathname, { replace: true, state: { ...location.state, prefix: '' } });
      }
    }
  };

  // Extract suggestions and disease name for UI
  const suggestions = location.state?.suggestions || [];
  const activeDisease = location.state?.disease; 

  const handleDiseaseClick = (fullQuery) => {
    // Extract disease name if it has "Tanya tentang " prefix
    const diseaseName = fullQuery.replace(/^Tanya tentang /i, "").trim();
    
    navigate('/consultations/ai', {
      state: {
        disease: diseaseName,
        mode: "consultation",
        suggestions: [
          `Apa saja gejala awal ${diseaseName} yang harus diwaspadai?`,
          `Bagaimana cara menangani ${diseaseName} di rumah secara mandiri?`,
          `Kapan saya harus segera ke dokter jika terkena ${diseaseName}?`,
        ],
      }
    });
  };
  
  return (
    <div className="flex h-full gap-0 lg:gap-6 p-0 lg:p-2">
      {/* Main: Chat Interface */}
      <div className="flex-1 overflow-hidden">
        {activeChannelId || activeDisease ? (
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            onRetry={resendLastMessage}
            isTyping={isTyping || createChannelMutation.isPending}
            error={error}
            disease={activeDisease}
            mode={activeMode || location.state?.mode}
            suggestions={suggestions}
            onDiseaseClick={handleDiseaseClick}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto custom-scrollbar">
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="max-w-2xl w-full text-center"
             >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 border border-primary/20">
                  <Bot size={14} className="animate-bounce" />
                  <span>CERDAS • PERSONAL • AKURAT</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-black text-surface-on tracking-tight mb-4">
                  Halo! Saya <span className="text-primary italic">Nadi AI</span>.
                </h2>
                <p className="text-surface-on-variant mb-12 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
                  Pilih cara Anda ingin memulai hari ini. Saya siap membantu Anda memahami kondisi kesehatan Anda dengan lebih baik.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  {/* Mode: Consultation */}
                  <motion.button
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNewChat("consultation")}
                    disabled={createChannelMutation.isPending}
                    className="p-6 rounded-3xl bg-surface border border-surface-variant/50 hover:border-primary/50 transition-all shadow-sm hover:shadow-xl hover:shadow-primary/10 group flex flex-col h-full"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <Bot size={30} />
                    </div>
                    <h4 className="text-lg font-bold text-surface-on mb-2">AI Consultation</h4>
                    <p className="text-xs text-surface-on-variant leading-relaxed mb-6 flex-1">
                      Tanyakan apa saja tentang kesehatan, nutrisi, atau penjelasan medis secara umum dengan bahasa santai.
                    </p>
                    <div className="flex items-center text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                      Mulai Konsultasi →
                    </div>
                  </motion.button>

                  {/* Mode: Symptom Checker */}
                  <motion.button
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNewChat("symptom_check")}
                    disabled={createChannelMutation.isPending}
                    className="p-6 rounded-3xl bg-surface border border-surface-variant/50 hover:border-secondary/50 transition-all shadow-sm hover:shadow-xl hover:shadow-secondary/10 group flex flex-col h-full"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-6 group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                      <LayoutDashboard size={30} />
                    </div>
                    <h4 className="text-lg font-bold text-surface-on mb-2">Symptom Checker</h4>
                    <p className="text-xs text-surface-on-variant leading-relaxed mb-6 flex-1">
                      Bantu saya menganalisis gejala Anda melalui tanya jawab terstruktur untuk perkiraan kondisi kesehatan.
                    </p>
                    <div className="flex items-center text-xs font-bold text-secondary group-hover:translate-x-1 transition-transform">
                      Cek Gejala Sekarang →
                    </div>
                  </motion.button>
                </div>

                <div className="mt-16 pt-8 border-t border-surface-variant/30 flex flex-wrap justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all">
                   <div className="flex items-center gap-2 font-black text-xs tracking-widest uppercase">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      Privasi Terjaga
                   </div>
                   <div className="flex items-center gap-2 font-black text-xs tracking-widest uppercase">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      Respons Cepat
                   </div>
                   <div className="flex items-center gap-2 font-black text-xs tracking-widest uppercase">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      Edukasi Medis
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiConsultation;
