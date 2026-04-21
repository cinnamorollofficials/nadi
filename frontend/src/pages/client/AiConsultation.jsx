import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../api/client";
import ChatInterface from "../../components/Chat/ChatInterface";
import { useChat } from "../../hooks/useChat";
import { Bot, History as HistoryIcon, PlusCircle, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

const AiConsultation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeChannelId, setActiveChannelId] = useState(id);

  // Create New Channel Mutation
  const createChannelMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post("/chat/channel", { mode: "consultation" });
      return response.data.data;
    },
    onSuccess: (newChannel) => {
      queryClient.invalidateQueries({ queryKey: ["chat-history"] });
      navigate(`/consultations/ai/${newChannel.id}`);
    },
  });

  // Messaging Hook
  const { messages, setMessages, sendMessage, isTyping, error } = useChat(activeChannelId, {
    onMessageDone: () => {
      // Refresh sidebar to get the new summarized title after the first exchange
      if (messages.length <= 2) {
        queryClient.invalidateQueries({ queryKey: ["chat-history"] });
      }
    }
  });

  // Load existing messages when channel changes
  useEffect(() => {
    if (activeChannelId) {
      const fetchMessages = async () => {
        try {
          const response = await apiClient.get(`/chat/history/${activeChannelId}`);
          setMessages(response.data.data.map(m => ({
            role: m.role,
            content: m.content,
            isDone: true
          })));
        } catch (err) {
          console.error("Failed to fetch messages", err);
        }
      };
      fetchMessages();
    }
  }, [activeChannelId, setMessages]);

  useEffect(() => {
    setActiveChannelId(id);
    
    // Auto-start new chat if landing on root AI page without an ID
    if (!id) {
      handleNewChat();
    }
  }, [id]);

  // Fetch history to check for empty chats
  const { data: history } = useQuery({
    queryKey: ["chat-history"],
    queryFn: async () => {
      const resp = await apiClient.get("/chat/history");
      return resp.data.data || [];
    }
  });

  const handleNewChat = () => {
    // Prevent multiple simultaneous creations
    if (createChannelMutation.isPending) return;

    // Check if the most recent chat is empty (no messages)
    const emptyChat = history?.find(h => h.message_count === 0);
    if (emptyChat) {
      if (id !== String(emptyChat.id)) {
        navigate(`/consultations/ai/${emptyChat.id}`);
      }
      return;
    }

    createChannelMutation.mutate();
  };

  return (
    <div className="flex h-full gap-0 lg:gap-6 p-0 lg:p-2">
      {/* Main: Chat Interface */}
      <div className="flex-1 overflow-hidden">
        {activeChannelId ? (
          <ChatInterface
            messages={messages}
            onSendMessage={sendMessage}
            isTyping={isTyping}
            error={error}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center text-primary/30 mb-6 mx-auto">
              <LayoutDashboard size={48} />
            </div>
            <h3 className="text-2xl font-bold text-surface-on">Nadi AI Consultation</h3>
            <p className="text-surface-on-variant mt-2 max-w-sm mx-auto text-sm">
              Pilih percakapan dari sidebar atau mulai konsultasi medis baru untuk mendapatkan bantuan AI.
            </p>
            <button
              onClick={handleNewChat}
              disabled={createChannelMutation.isPending}
              className="mt-8 px-8 py-3 bg-primary text-on-primary rounded-2xl font-bold hover:brightness-110 transition-all disabled:opacity-50"
            >
              {createChannelMutation.isPending ? "Memulai..." : "Mulai Chat Baru Sekarang"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiConsultation;
