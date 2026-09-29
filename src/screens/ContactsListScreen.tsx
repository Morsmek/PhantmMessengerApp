import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Copy, Check, UserPlus, QrCode, Share2 } from 'lucide-react';
import { useIdentityStore } from '@/stores/identityStore';
import { useContactStore } from '@/stores/contactStore';
import { Avatar } from '@/components/Avatar';
import { BottomSheet } from '@/components/BottomSheet';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { useToastStore } from '@/stores/toastStore';

export function ContactsListScreen() {
  const navigate = useNavigate();
  const publicKey = useIdentityStore((s) => s.publicKey);
  const contacts = useContactStore((s) => s.contacts);
  const removeContact = useContactStore((s) => s.removeContact);
  const addToast = useToastStore((s) => s.addToast);

  const [copied, setCopied] = useState(false);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [showMyQR, setShowMyQR] = useState(false);
  const [showContactQR, setShowContactQR] = useState<string | null>(null);

  const handleCopyId = () => {
    if (publicKey) {
      navigator.clipboard.writeText(`phantm://${publicKey}`).catch(() => {});
      setCopied(true);
      addToast('Copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRemove = () => {
    if (selectedContact) {
      removeContact(selectedContact);
      setSelectedContact(null);
      addToast('Contact removed', 'info');
    }
  };

  const selected = contacts.find((c) => c.id === selectedContact);
  const contactForQR = contacts.find((c) => c.id === showContactQR);

  const myShareUrl = publicKey ? `phantm://${publicKey}` : '';

  return (
    <div className="flex flex-col h-full relative" style={{ background: 'var(--bg-primary)' }}>
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Contacts
        </h1>

        {/* My ID Card */}
        <div
          className="mt-3 rounded-xl p-4"
          style={{ background: 'var(--bg-surface)' }}
        >
          <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
            Your ID
          </p>
          <div className="flex items-center gap-2">
            <p
              className="text-sm truncate flex-1"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-pink)' }}
            >
              {publicKey ? `phantm://${publicKey.slice(0, 16)}...` : 'Generating...'}
            </p>
            <button onClick={handleCopyId} className="p-1.5 flex-shrink-0" aria-label="Copy ID">
              {copied ? (
                <Check size={16} style={{ color: 'var(--success)' }} />
              ) : (
                <Copy size={16} style={{ color: 'var(--text-secondary)' }} />
              )}
            </button>
          </div>
          {/* QR Share Button */}
          <button
            onClick={() => setShowMyQR(true)}
            className="flex items-center gap-2 mt-3 text-sm font-medium"
            style={{ color: 'var(--accent-pink)' }}
          >
            <QrCode size={16} />
            Show My QR Code
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6" style={{ minHeight: '40vh' }}>
            <UserPlus size={48} style={{ color: 'var(--text-muted)' }} />
            <p className="text-lg mt-4" style={{ color: 'var(--text-secondary)' }}>
              No contacts yet
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Add your first contact to start chatting
            </p>
          </div>
        ) : (
          contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => navigate(`/chats/${contact.id}`)}
              onContextMenu={(e) => {
                e.preventDefault();
                setSelectedContact(contact.id);
              }}
              className="flex items-center w-full px-4 py-3 text-left transition-colors active:bg-white/[0.04]"
              style={{ borderBottom: '1px solid rgba(61, 61, 77, 0.3)' }}
            >
              <div className="relative">
                <Avatar name={contact.name} size={44} />
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {contact.name}
                </p>
                <p
                  className="text-xs truncate"
                  style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}
                >
                  phantm://{contact.id.slice(0, 12)}...
                </p>
              </div>
            </button>
          ))
        )}
      </div>

      {/* FAB - Fixed with proper positioning */}
      <button
        onClick={() => navigate('/contacts/add')}
        className="absolute right-4 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95"
        style={{
          background: 'var(--accent-pink)',
          boxShadow: '0 4px 12px rgba(233, 30, 99, 0.3)',
          bottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
          zIndex: 50,
        }}
        aria-label="Add contact"
      >
        <Plus size={24} style={{ color: '#fff' }} />
      </button>

      {/* Contact Action Sheet */}
      <BottomSheet
        isOpen={!!selectedContact}
        onClose={() => setSelectedContact(null)}
        title={selected?.name || 'Contact'}
      >
        <div className="space-y-1">
          <button
            onClick={() => {
              if (selected) {
                navigator.clipboard.writeText(`phantm://${selected.id}`).catch(() => {});
                addToast('ID copied', 'success');
              }
              setSelectedContact(null);
            }}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-left active:bg-white/[0.04]"
          >
            <Copy size={20} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ color: 'var(--text-primary)' }}>Copy ID</span>
          </button>
          <button
            onClick={() => {
              setSelectedContact(null);
              if (selected) setShowContactQR(selected.id);
            }}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-left active:bg-white/[0.04]"
          >
            <QrCode size={20} style={{ color: 'var(--accent-pink)' }} />
            <span style={{ color: 'var(--text-primary)' }}>Show QR Code</span>
          </button>
          <button
            onClick={() => {
              if (selected) {
                navigator.clipboard.writeText(`phantm://${selected.id}`).catch(() => {});
                addToast('Share link copied', 'success');
              }
              setSelectedContact(null);
            }}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-left active:bg-white/[0.04]"
          >
            <Share2 size={20} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ color: 'var(--text-primary)' }}>Share Contact</span>
          </button>
          <button
            onClick={handleRemove}
            className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-left active:bg-white/[0.04]"
          >
            <span style={{ color: 'var(--error)' }}>Remove Contact</span>
          </button>
        </div>
      </BottomSheet>

      {/* My QR Code Sheet */}
      <BottomSheet
        isOpen={showMyQR}
        onClose={() => setShowMyQR(false)}
        title="Your QR Code"
      >
        <div className="flex flex-col items-center py-4">
          <QRCodeDisplay data={myShareUrl} size={200} />
          <p className="text-sm mt-4 text-center px-4" style={{ color: 'var(--text-secondary)' }}>
            Others can scan this to add you as a contact
          </p>
          <p
            className="text-xs mt-2 text-center px-4 truncate max-w-full"
            style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-pink)' }}
          >
            {myShareUrl}
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(myShareUrl).catch(() => {});
              addToast('ID copied to clipboard', 'success');
            }}
            className="flex items-center gap-2 mt-4 px-6 py-2.5 rounded-lg text-sm font-medium"
            style={{
              background: 'var(--accent-pink)',
              color: '#fff',
            }}
          >
            <Copy size={16} />
            Copy ID
          </button>
        </div>
      </BottomSheet>

      {/* Contact QR Code Sheet */}
      <BottomSheet
        isOpen={!!showContactQR}
        onClose={() => setShowContactQR(null)}
        title={contactForQR ? `${contactForQR.name}'s QR` : 'Contact QR'}
      >
        {contactForQR && (
          <div className="flex flex-col items-center py-4">
            <Avatar name={contactForQR.name} size={64} />
            <p className="text-lg font-semibold mt-3" style={{ color: 'var(--text-primary)' }}>
              {contactForQR.name}
            </p>
            <div className="mt-4">
              <QRCodeDisplay data={`phantm://${contactForQR.id}`} size={200} />
            </div>
            <p className="text-sm mt-4 text-center px-4" style={{ color: 'var(--text-secondary)' }}>
              Scan to add this contact on another device
            </p>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
