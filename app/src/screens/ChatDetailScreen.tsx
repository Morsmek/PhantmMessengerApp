import { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, MoreVertical, ArrowUp, Copy, Trash2, Info, X, Lock } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { Avatar } from '@/components/Avatar';
import { ShimmerBadge } from '@/components/ShimmerBadge';
import { MessageBubble } from '@/components/MessageBubble';
import { BottomSheet } from '@/components/BottomSheet';
import { useToastStore } from '@/stores/toastStore';

export function ChatDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const conversations = useChatStore((s) => s.conversations);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const deleteMessage = useChatStore((s) => s.deleteMessage);
  const deleteConversation = useChatStore((s) => s.deleteConversation);
  const addToast = useToastStore((s) => s.addToast);

  const [input, setInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState<string | null>(null);
  const [dismissedBanner, setDismissedBanner] = useState(false);
  const [justSentId, setJustSentId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastCount = useRef(0);

  const conversation = useMemo(
    () => conversations.find((c) => c.id === id),
    [conversations, id]
  );

  useEffect(() => {
    const msgCount = conversation?.messages.length || 0;
    if (msgCount > lastCount.current && scrollRef.current) {
      const lastMsg = conversation?.messages[msgCount - 1];
      if (lastMsg?.isSent) {
        setJustSentId(lastMsg.id);
        setTimeout(() => setJustSentId(null), 500);
      }
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
    lastCount.current = msgCount;
  }, [conversation?.messages.length, conversation?.messages]);

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full" style={{ background: 'var(--bg-primary)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Conversation not found</p>
      </div>
    );
  }

  const handleSend = () => {
    if (!input.trim() || !id) return;
    sendMessage(id, input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopyMessage = (msgId: string) => {
    const msg = conversation.messages.find((m) => m.id === msgId);
    if (msg) {
      navigator.clipboard.writeText(msg.content).catch(() => {});
      addToast('Copied to clipboard', 'success');
    }
    setSelectedMsg(null);
  };

  const handleDeleteMessage = (msgId: string) => {
    if (id) deleteMessage(id, msgId);
    setSelectedMsg(null);
  };

  const handleDeleteChat = () => {
    if (id) {
      deleteConversation(id);
      navigate('/chats');
    }
    setShowMenu(false);
  };

  const isFirstChat = conversation.messages.length === 0;

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div
        className="flex items-center px-3 h-14 flex-shrink-0 animate-fade-in"
        style={{
          background: 'var(--bg-primary)',
          borderBottom: '1px solid rgba(61, 61, 77, 0.5)',
        }}
      >
        <button onClick={() => navigate('/chats')} className="p-2 -ml-1" aria-label="Back">
          <ChevronLeft size={24} style={{ color: 'var(--text-primary)' }} />
        </button>
        <Avatar name={conversation.contactName} size={36} className="ml-1" />
        <div className="ml-2 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
              {conversation.contactName}
            </span>
            <ShimmerBadge />
          </div>
        </div>
        <button onClick={() => setShowMenu(true)} className="p-2" aria-label="Menu">
          <MoreVertical size={24} style={{ color: 'var(--text-primary)' }} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-2">
        {isFirstChat && !dismissedBanner && (
          <div
            className="flex items-start gap-2 rounded-lg p-3 mb-4 animate-slide-up animate-neon-glow"
            style={{
              background: 'rgba(233, 30, 99, 0.06)',
              borderLeft: '3px solid var(--accent-pink)',
            }}
          >
            <Lock size={14} style={{ color: 'var(--accent-pink)', flexShrink: 0 }} className="mt-0.5" />
            <p className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>
              This conversation is end-to-end encrypted. No one except you and{' '}
              {conversation.contactName} can read these messages.
            </p>
            <button onClick={() => setDismissedBanner(true)} className="p-0.5 flex-shrink-0">
              <X size={16} style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>
        )}

        {conversation.messages.map((msg, idx) => (
          <div
            key={msg.id}
            className={justSentId === msg.id ? 'animate-message-pop' : idx === conversation.messages.length - 1 ? 'animate-fade-in' : ''}
            onContextMenu={(e) => {
              e.preventDefault();
              setSelectedMsg(msg.id);
            }}
          >
            <MessageBubble message={msg} />
          </div>
        ))}

        {conversation.messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 animate-fade-in">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center animate-float-slow"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid rgba(233, 30, 99, 0.2)',
              }}
            >
              <Lock size={24} style={{ color: 'var(--accent-pink)' }} />
            </div>
            <p className="text-sm mt-4" style={{ color: 'var(--text-secondary)' }}>
              Send your first encrypted message
            </p>
          </div>
        )}
      </div>

      {/* Input */}
      <div
        className="flex items-center gap-2 px-4 py-2 flex-shrink-0 animate-slide-up"
        style={{
          background: 'var(--bg-elevated)',
          borderTop: '1px solid rgba(61, 61, 77, 0.5)',
          minHeight: 56,
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a secure message..."
          className="flex-1 rounded-full px-4 py-2.5 text-base outline-none"
          style={{
            background: 'var(--bg-surface)',
            color: 'var(--text-primary)',
          }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
          style={{
            background: input.trim() ? 'var(--accent-pink)' : 'var(--text-muted)',
            opacity: input.trim() ? 1 : 0.5,
            boxShadow: input.trim() ? '0 0 12px rgba(233, 30, 99, 0.4)' : 'none',
          }}
          aria-label="Send message"
        >
          <ArrowUp size={20} style={{ color: '#fff' }} />
        </button>
      </div>

      {/* Message Action Sheet */}
      <BottomSheet isOpen={!!selectedMsg} onClose={() => setSelectedMsg(null)} title="Message">
        <div className="space-y-1">
          <button
            onClick={() => selectedMsg && handleCopyMessage(selectedMsg)}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-left active:bg-white/[0.04]"
          >
            <Copy size={20} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ color: 'var(--text-primary)' }}>Copy</span>
          </button>
          <button
            onClick={() => selectedMsg && handleDeleteMessage(selectedMsg)}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-left active:bg-white/[0.04]"
          >
            <Trash2 size={20} style={{ color: 'var(--error)' }} />
            <span style={{ color: 'var(--error)' }}>Delete</span>
          </button>
          <button
            onClick={() => setSelectedMsg(null)}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-left active:bg-white/[0.04]"
          >
            <Info size={20} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ color: 'var(--text-primary)' }}>Message Info</span>
          </button>
        </div>
      </BottomSheet>

      {/* Chat Menu */}
      <BottomSheet isOpen={showMenu} onClose={() => setShowMenu(false)} title="Options">
        <button
          onClick={handleDeleteChat}
          className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-left active:bg-white/[0.04]"
        >
          <Trash2 size={20} style={{ color: 'var(--error)' }} />
          <span style={{ color: 'var(--error)' }}>Delete Conversation</span>
        </button>
      </BottomSheet>
    </div>
  );
}
