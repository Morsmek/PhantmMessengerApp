import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, MessageSquare } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';
import { useContactStore } from '@/stores/contactStore';
import { Avatar } from '@/components/Avatar';

export function ChatsListScreen() {
  const navigate = useNavigate();
  const conversations = useChatStore((s) => s.conversations);
  const contacts = useContactStore((s) => s.contacts);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return conversations;
    const q = search.toLowerCase();
    return conversations.filter((c) =>
      c.contactName.toLowerCase().includes(q) ||
      c.messages.some((m) => m.content.toLowerCase().includes(q))
    );
  }, [conversations, search]);

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const getPreview = (convId: string) => {
    const conv = conversations.find((c) => c.id === convId);
    if (!conv || conv.messages.length === 0) return 'No messages yet';
    const last = conv.messages[conv.messages.length - 1];
    return last.content;
  };

  return (
    <div className="flex flex-col h-full relative" style={{ background: 'var(--bg-primary)' }}>
      <div className="px-4 pt-4 pb-2">
        <h1
          className="text-2xl font-bold animate-fade-in"
          style={{ color: 'var(--text-primary)', animationFillMode: 'both' }}
        >
          Messages
        </h1>

        <div
          className="flex items-center mt-3 rounded-xl px-3 h-10 animate-slide-up"
          style={{ background: 'var(--bg-surface)', animationDelay: '100ms', animationFillMode: 'both' }}
        >
          <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="ml-2 flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 animate-fade-in" style={{ minHeight: '40vh' }}>
            <MessageSquare size={48} style={{ color: 'var(--text-muted)' }} />
            <p className="text-lg mt-4" style={{ color: 'var(--text-secondary)' }}>
              No conversations yet
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Tap + to start a secure chat
            </p>
          </div>
        ) : (
          filtered.map((conv, idx) => (
            <button
              key={conv.id}
              onClick={() => {
                useChatStore.getState().markAsRead(conv.id);
                navigate(`/chats/${conv.id}`);
              }}
              className={`flex items-start w-full px-4 py-4 text-left transition-colors active:bg-white/[0.04] animate-slide-in-right`}
              style={{
                borderBottom: '1px solid rgba(61, 61, 77, 0.5)',
                animationDelay: `${idx * 60}ms`,
                animationFillMode: 'both',
              }}
            >
              <Avatar name={conv.contactName} size={48} />
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                    {conv.contactName}
                  </span>
                  <span className="text-xs flex-shrink-0 ml-2" style={{ color: 'var(--text-muted)' }}>
                    {formatTime(conv.lastMessageAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                    {getPreview(conv.id)}
                  </p>
                  {conv.unreadCount > 0 && (
                    <span
                      className="flex-shrink-0 ml-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold animate-scale-in"
                      style={{
                        background: 'var(--accent-pink)',
                        color: '#fff',
                        boxShadow: '0 0 8px rgba(233, 30, 99, 0.5)',
                      }}
                    >
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => {
          if (contacts.length === 0) navigate('/contacts');
          else navigate('/chats/new');
        }}
        className="absolute right-4 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 animate-neon-glow-strong"
        style={{
          background: 'var(--accent-pink)',
          boxShadow: '0 4px 12px rgba(233, 30, 99, 0.3)',
          bottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
          zIndex: 50,
        }}
        aria-label="New conversation"
      >
        <Plus size={24} style={{ color: '#fff' }} />
      </button>
    </div>
  );
}
