import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useContactStore } from '@/stores/contactStore';
import { useChatStore } from '@/stores/chatStore';
import { Avatar } from '@/components/Avatar';

export function NewChatScreen() {
  const navigate = useNavigate();
  const contacts = useContactStore((s) => s.contacts);
  const createConversation = useChatStore((s) => s.createConversation);

  const handleSelect = (contactId: string, name: string) => {
    const convId = createConversation(contactId, name);
    navigate(`/chats/${convId}`);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg-primary)' }}>
      <div
        className="flex items-center justify-between px-4 h-14 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(61, 61, 77, 0.5)' }}
      >
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          New Chat
        </h2>
        <button onClick={() => navigate('/chats')} className="p-2" aria-label="Close">
          <X size={24} style={{ color: 'var(--text-primary)' }} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-6">
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              No contacts yet
            </p>
            <button
              onClick={() => navigate('/contacts/add')}
              className="mt-4 px-6 py-3 rounded-xl text-base font-semibold"
              style={{ background: 'var(--accent-pink)', color: '#1A1218' }}
            >
              Add Contact
            </button>
          </div>
        ) : (
          contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => handleSelect(contact.id, contact.name)}
              className="flex items-center w-full px-4 py-3 text-left transition-colors active:bg-white/[0.04]"
              style={{ borderBottom: '1px solid rgba(61, 61, 77, 0.3)' }}
            >
              <Avatar name={contact.name} size={44} />
              <div className="ml-3">
                <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {contact.name}
                </p>
                <p
                  className="text-xs truncate max-w-[240px]"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}
                >
                  phantm://{contact.id.slice(0, 12)}...
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
