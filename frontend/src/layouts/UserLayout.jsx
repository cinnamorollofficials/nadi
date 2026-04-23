import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, Outlet, useLocation, Link } from "react-router-dom";
import UserSidebar from "../components/UserSidebar";
import { getMe } from "../api/admin";
import { useTheme } from "../context/ThemeContext";
import {
  Plus,
  MessageSquare,
  Share2,
  Edit2,
  Pin,
  Trash2,
  MoreVertical,
  History as HistoryIcon,
  Activity,
  Bot,
  User as UserIcon,
} from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import { PERMS } from "../utils/permissions";
import { safeStringify, safeParse } from "../utils/json";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/client";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import TextField from "../components/TextField";
import Button from "../components/Button";
import Label from "../components/Label";
import { toast } from "react-hot-toast";

const UserLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const { app_name, logo } = useSettings();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Action States
  const [activeChat, setActiveChat] = useState(null);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Fetch AI Chat History globally
  const { data: chatHistory } = useQuery({
    queryKey: ["chat-history"],
    queryFn: async () => {
      try {
        const response = await apiClient.get("/chat/history");
        return response.data.data || [];
      } catch (err) {
        console.error("Failed to fetch chat history", err);
        return [];
      }
    },
    refetchInterval: 30000, // Refetch every 30s to keep sidebar fresh
  });

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  const refreshUserData = useCallback(async () => {
    try {
      const response = await getMe();
      if (response.success && response.data) {
        const updatedUser = response.data;
        console.log("[User Data]", updatedUser); // Debug log
        setUser(updatedUser);
        localStorage.setItem("user", safeStringify(updatedUser));
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(refreshUserData, 60000);
    return () => clearInterval(interval);
  }, [refreshUserData]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      navigate("/login");
      return;
    }

    if (userData) {
      try {
        setUser(safeParse(userData));
      } catch (err) {
        console.error("Layout auth parsing error:", err);
        localStorage.removeItem("user");
        navigate("/login");
      }
    }
    refreshUserData();
  }, [navigate, refreshUserData]);

  const handleLogout = async () => {
    try {
      const { logoutApi } = await import("../api/auth");
      await logoutApi("user_clicked");
    } catch (err) {
      console.error("Logout API failed:", err);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  // Action Handlers
  const handleShare = useCallback((chat) => {
    const url = `${window.location.origin}/consultations/ai/${chat.id}`;
    navigator.clipboard.writeText(url);
    toast.success("Link percakapan disalin!");
  }, []);

  const handleRenameClick = useCallback((chat) => {
    setActiveChat(chat);
    // If title has "Label: Question" format, only pre-fill the question part
    if (chat.title.includes(": ")) {
      const parts = chat.title.split(": ");
      setNewTitle(parts.slice(1).join(": ")); // everything after first ": "
    } else {
      setNewTitle(chat.title);
    }
    setIsRenameModalOpen(true);
  }, []);

  // Extract disease label prefix from active chat title if present
  const activeChatLabelPrefix = activeChat?.title?.includes(": ")
    ? activeChat.title.split(": ")[0]
    : null;

  const handleRenameSubmit = async () => {
    if (!newTitle.trim() || !activeChat) return;
    setIsActionLoading(true);
    try {
      // Prepend the disease label back if it existed
      const finalTitle = activeChatLabelPrefix
        ? `${activeChatLabelPrefix}: ${newTitle.trim()}`
        : newTitle.trim();
      await apiClient.put(`/chat/rename/${activeChat.uid}`, { title: finalTitle });
      await queryClient.invalidateQueries({ queryKey: ["chat-history"] });
      toast.success("Nama berhasil diubah");
      setIsRenameModalOpen(false);
    } catch (err) {
      console.error("Failed to rename chat:", err);
      toast.error(err.response?.data?.message || "Gagal mengubah nama");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handlePin = useCallback(async (chat) => {
    try {
      await apiClient.patch(`/chat/pin/${chat.uid}`);
      await queryClient.invalidateQueries({ queryKey: ["chat-history"] });
      toast.success(chat.is_pinned ? "Pin dilepas" : "Percakapan di-pin");
    } catch (err) {
      console.error("Failed to toggle pin:", err);
      toast.error("Gagal mengubah status pin");
    }
  }, [queryClient]);

  const handleDeleteClick = useCallback((chat) => {
    setActiveChat(chat);
    setIsDeleteOpen(true);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!activeChat) return;
    setIsActionLoading(true);
    try {
      await apiClient.delete(`/chat/delete/${activeChat.uid}`);
      await queryClient.invalidateQueries({ queryKey: ["chat-history"] });
      toast.success("Percakapan dihapus");
      setIsDeleteOpen(false);
      
      // If we are currently viewing the deleted chat, navigate away
      if (location.pathname.includes(`/consultations/ai/${activeChat.uid}`)) {
        navigate("/consultations/ai");
      }
    } catch (err) {
      console.error("Failed to delete chat:", err);
      toast.error(err.response?.data?.message || "Gagal menghapus");
    } finally {
      setIsActionLoading(false);
    }
  };

  // Determine dynamic page title based on route
  const pageTitle = useMemo(() => {
    const path = location.pathname;
    let title = "Nadi AI";

    if (path.includes("/profile")) {
      title = "Profile Saya";
    } else if (path.includes("/consultations/ai/")) {
      // Find the specific chat title from history
      const chatId = path.split("/").pop();
      const currentChat = chatHistory?.find((c) => String(c.uid) === String(chatId));
      const rawTitle = currentChat ? currentChat.title : "Konsultasi AI";
      title = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
    } else if (path.includes("/consultations/ai")) {
      title = "Konsultasi AI";
    }

    return title;
  }, [location.pathname, chatHistory]);

  // Update document title dynamically
  useEffect(() => {
    document.title = `${pageTitle} | ${app_name}`;
  }, [pageTitle, app_name]);

  const navigationSections = useMemo(() => {
    // Map AI Chat History to sidebar items
    const aiHistoryItems = (chatHistory || [])
      .filter((chat) => {
        const isSearchMatch = chat.title.toLowerCase().includes(searchQuery.toLowerCase());
        const isGhost = chat.title === "New Conversation" && chat.message_count === 0;
        const isCurrent = String(chat.uid) === String(location.pathname.split('/').pop());
        
        return isSearchMatch && (!isGhost || isCurrent);
      })
      .sort((a, b) => {
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;
        return 0; // Maintain relative order for same pin status (which is updated_at DESC from backend)
      })
      .slice(0, 15) // Show more items now that pinning is available
      .map((chat) => {
        const title = chat.title.charAt(0).toUpperCase() + chat.title.slice(1);
        return {
          id: `chat-${chat.uid}`,
          label: title,
          path: `/consultations/ai/${chat.uid}`,
          isPinned: chat.is_pinned,
          actions: [
            {
              label: "Bagikan",
              icon: <Share2 size={14} />,
              className: "hover:bg-primary/10 hover:text-error",
              onClick: () => handleShare(chat)
            },
            {
              label: "Ubah Nama",
              icon: <Edit2 size={14} />,
              className: "hover:bg-primary/10 hover:text-error",
              onClick: () => handleRenameClick(chat)
            },
            {
              label: chat.is_pinned ? "Lepas Pin" : "Pin",
              icon: <Pin size={14} className={chat.is_pinned ? "fill-current" : ""} />,
              onClick: () => handlePin(chat),
              className: "hover:bg-primary/10 hover:text-error",
            },
            {
              label: "Hapus",
              icon: <Trash2 size={14} />,
              className: "text-error hover:bg-error/10 hover:text-error",
              onClick: () => handleDeleteClick(chat)
            }
          ]
        };
      });

    return [
      {
        items: [
          {
            label: "Mulai Konsultasi Baru",
            path: "/consultations/ai",
            icon: <Plus size={18} />,
          },
        ],
      },
      {
        label: "Konsultasi Terbaru",
        items: aiHistoryItems,
      },
    ];
  }, [searchQuery, chatHistory]);

  // Filter navigation based on user permissions
  const filteredNavigation = useMemo(() => {
    if (!user) return [];
    return navigationSections;
  }, [user, navigationSections]);

  if (!user) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-primary-500 animate-pulse">
          Loading User Portal...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <UserSidebar
        sections={navigationSections}
        title={app_name}
        logo={logo}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={toggleTheme}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onSearch={setSearchQuery}
        profileTransition={{ path: "/profile", label: "Profile" }}
        usage={user?.usage}
      />
      <div className="flex-1 flex flex-col min-w-0 bg-surface relative">
        <header className="flex h-16 items-center justify-between px-4 lg:px-6 bg-surface sticky top-0 z-10 transition-colors">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-surface-variant/30 text-surface-on-variant transition-all duration-200 active:scale-95"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="flex items-center gap-6 flex-1">
              <div className="flex flex-col gap-0.5">
                <h1 className="text-base font-bold text-surface-on leading-tight">
                  {pageTitle && pageTitle.includes(": ") ? (
                    <div className="flex items-center gap-2">
                      <Label variant="primary" className="!py-0.5 !px-1.5 !text-[10px]">
                        {pageTitle.split(": ")[0]}
                      </Label>
                      <span className="truncate">{pageTitle.split(": ")[1]}</span>
                    </div>
                  ) : (
                    pageTitle
                  )}
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-4">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-xs font-bold text-surface-on truncate max-w-[150px]">
                  {user.email}
                </span>
              </div>
              <Link
                to="/profile"
                className="relative group p-0.5 rounded-xl border border-outline-variant/30 hover:border-primary/50 transition-all overflow-hidden"
              >
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs overflow-hidden">
                  {user.picture || user.avatar ? (
                    <img
                      src={user.picture || user.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.innerText = user.email
                          .charAt(0)
                          .toUpperCase();
                      }}
                    />
                  ) : (
                    user.email.charAt(0).toUpperCase()
                  )}
                </div>
              </Link>
            </div>
          </div>
        </header>

        <main className={`flex-1 ${location.pathname.includes('/consultations/ai') ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          <div className={`animate-fade-in-up ${location.pathname.includes('/consultations/ai') ? 'h-full' : 'px-4 lg:px-10 py-6 max-w-screen-2xl mx-auto pb-10'}`}>
            <Outlet />
          </div>
        </main>
      </div>

      {/* Rename Modal */}
      <Modal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        title="Ubah Nama Percakapan"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          {activeChatLabelPrefix && (
            <div className="flex items-center gap-2 px-1">
              <span className="text-xs text-surface-on-variant">Label terkunci:</span>
              <Label variant="primary" className="!py-0.5 !px-1.5 !text-[9px]">
                {activeChatLabelPrefix}
              </Label>
            </div>
          )}
          <TextField
            label="Nama Percakapan"
            name="title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Masukkan nama baru..."
          />
          <div className="flex justify-end gap-2">
            <Button variant="tonal" onClick={() => setIsRenameModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleRenameSubmit} disabled={isActionLoading}>
              Simpan
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Percakapan"
        message={`Apakah Anda yakin ingin menghapus percakapan "${activeChat?.title}"? Tindakan ini tidak dapat dibatalkan.`}
        loading={isActionLoading}
      />
    </div>
  );
};

export default UserLayout;
