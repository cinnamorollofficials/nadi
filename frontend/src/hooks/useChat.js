import { useState, useEffect, useRef, useCallback } from 'react';

export const useChat = (channelId) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  const connect = useCallback(() => {
    if (!channelId) return;

    // In a real app, you'd get the token from localStorage
    const token = localStorage.getItem('token');
    const apiUrlSelection = import.meta.env.VITE_API_URL || 'http://localhost:8090/api/v1';
    const wsBaseUrl = apiUrlSelection.replace(/^http/, 'ws');
    const wsUrl = `${wsBaseUrl}/chat/ws?token=${token}`;

    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('Chat WebSocket Connected');
      setError(null);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'chunk') {
        setIsTyping(true);
        setMessages((prev) => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg && lastMsg.role === 'assistant' && !lastMsg.isDone) {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...lastMsg,
              content: lastMsg.content + data.content
            };
            return updated;
          } else {
            return [...prev, { role: 'assistant', content: data.content, isDone: false }];
          }
        });
      } else if (data.type === 'done') {
        setIsTyping(false);
        setMessages((prev) => {
          const updated = [...prev];
          if (updated.length > 0) {
            updated[updated.length - 1].isDone = true;
          }
          return updated;
        });
      } else if (data.type === 'error') {
        const rawError = data.content?.toLowerCase() || '';
        let errorMsg = "Terjadi kendala pada Nadi AI. Silakan coba beberapa saat lagi.";

        if (rawError.includes('deadline exceeded')) {
          errorMsg = "Koneksi melambat atau AI sedang sangat sibuk. Silakan coba kirim kembali pesan Anda.";
        } else if (rawError.includes('quota') || rawError.includes('limit')) {
          errorMsg = "Batas penggunaan harian Nadi AI telah tercapai. Silakan coba lagi besok.";
        } else if (rawError.includes('safety') || rawError.includes('blocked')) {
          errorMsg = "Maaf, permintaan Anda tidak dapat diproses karena berkaitan dengan konten sensitif atau melanggar kebijakan keamanan.";
        } else if (rawError.includes('api key') || rawError.includes('key not found')) {
          errorMsg = "Sistem AI sedang dalam pemeliharaan teknis. Mohon maaf atas ketidaknyamanannya.";
        } else if (rawError.includes('unavailable') || rawError.includes('overloaded')) {
          errorMsg = "Server AI sedang kelebihan beban. Mohon tunggu satu menit dan coba lagi.";
        } else if (rawError.includes('model not found')) {
          errorMsg = "Versi AI yang digunakan sedang diperbarui. Silakan refresh halaman.";
        }

        setError(errorMsg);
        setIsTyping(false);
      }
    };

    socket.onclose = () => {
      console.log('Chat WebSocket Disconnected');
    };

    socket.onerror = (err) => {
      console.error('WebSocket Error:', err);
      setError('Connection failed');
    };
  }, [channelId]);

  useEffect(() => {
    connect();
    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, [connect]);

  const sendMessage = (content) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      setError('Socket not connected');
      return;
    }

    const message = {
      type: 'message',
      channel_id: parseInt(channelId),
      content: content
    };

    setMessages((prev) => [...prev, { role: 'user', content }]);
    socketRef.current.send(JSON.stringify(message));
    setIsTyping(true);
  };

  return { messages, setMessages, sendMessage, isTyping, error };
};
