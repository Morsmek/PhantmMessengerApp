import { useState, useEffect } from 'react';
import { Check, Pencil, AlertTriangle } from 'lucide-react';
import { useIdentityStore } from '@/stores/identityStore';
import { useChatStore } from '@/stores/chatStore';
import { useContactStore } from '@/stores/contactStore';
import { DataPulse } from '@/components/DataPulse';
import { GlitchText } from '@/components/GlitchText';
import { WordChip } from '@/components/WordChip';
import { BottomSheet } from '@/components/BottomSheet';
import { useToastStore } from '@/stores/toastStore';

export function ProfileScreen() {
  const publicKey = useIdentityStore((s) => s.publicKey);
  const displayName = useIdentityStore((s) => s.displayName);
  const mnemonic = useIdentityStore((s) => s.mnemonic);
  const setDisplayName = useIdentityStore((s) => s.setDisplayName);
  const conversations = useChatStore((s) => s.conversations);
  const contacts = useContactStore((s) => s.contacts);
  const addToast = useToastStore((s) => s.addToast);

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(displayName);
  const [copied, setCopied] = useState(false);
  const [showPhrase, setShowPhrase] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [showRecoverySheet, setShowRecoverySheet] = useState(false);

  useEffect(() => {
    setIsActive(true);
    return () => setIsActive(false);
  }, []);

  const handleCopyId = () => {
    if (publicKey) {
      navigator.clipboard.writeText(`phantm://${publicKey}`).catch(() => {});
      setCopied(true);
      addToast('Copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveName = () => {
    if (nameInput.trim()) {
      setDisplayName(nameInput.trim());
    }
    setEditingName(false);
  };

  const totalMessages = conversations.reduce((sum, c) => sum + c.messages.length, 0);
  const sinceDate = (() => {
    const timestamps = [
      ...conversations.map((c) => c.lastMessageAt),
      ...contacts.map((c) => c.addedAt),
    ].filter(Boolean);
    if (timestamps.length === 0) return 'Now';
    const earliest = Math.min(...timestamps);
    return new Date(earliest).toLocaleDateString([], { month: 'short', year: 'numeric' });
  })();

  const words = mnemonic?.split(' ') || [];

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar" style={{ background: 'var(--bg-primary)' }}>
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Your Identity
        </h1>
      </div>

      {/* Identity Section */}
      <div className="flex flex-col items-center px-6 mt-4">
        <DataPulse isActive={isActive} />

        {editingName ? (
          <div className="flex items-center gap-2 mt-4">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
              autoFocus
              className="text-xl font-bold text-center bg-transparent outline-none border-b-2"
              style={{
                color: 'var(--text-primary)',
                borderColor: 'var(--accent-pink)',
                minWidth: 120,
              }}
            />
          </div>
        ) : (
          <button
            onClick={() => setEditingName(true)}
            className="flex items-center gap-2 mt-4"
          >
            <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {displayName}
            </span>
            <Pencil size={16} style={{ color: 'var(--text-secondary)' }} />
          </button>
        )}

        {publicKey && (
          <div className="mt-2 text-center">
            <GlitchText
              text={`phantm://${publicKey.slice(0, 20)}...${publicKey.slice(-8)}`}
              className="text-sm"
            />
          </div>
        )}

        <button
          onClick={handleCopyId}
          className="mt-3 px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-95"
          style={{
            background: 'transparent',
            border: '1px solid var(--accent-pink)',
            color: 'var(--accent-pink)',
          }}
        >
          {copied ? (
            <span className="flex items-center gap-1.5">
              <Check size={14} /> Copied
            </span>
          ) : (
            'Copy ID'
          )}
        </button>
      </div>

      {/* Recovery Phrase Card */}
      <div
        className="mx-4 mt-8 rounded-xl p-4"
        style={{ background: 'var(--bg-surface)' }}
      >
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} style={{ color: 'var(--warning)' }} />
          <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            Recovery Phrase
          </h3>
        </div>
        <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
          Your 12-word recovery phrase. Keep it secret. Keep it safe.
        </p>
        <button
          onClick={() => setShowRecoverySheet(true)}
          className="w-full mt-3 h-11 rounded-lg text-sm font-medium transition-all active:scale-[0.98]"
          style={{
            background: 'transparent',
            border: '1px solid var(--warning)',
            color: 'var(--warning)',
          }}
        >
          View Phrase
        </button>
      </div>

      {/* Stats */}
      <div className="flex justify-around mt-6 px-4">
        <div className="text-center">
          <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            {totalMessages}
          </p>
          <p className="text-xs uppercase tracking-wider mt-1" style={{ color: 'var(--text-secondary)' }}>
            Messages
          </p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            {contacts.length}
          </p>
          <p className="text-xs uppercase tracking-wider mt-1" style={{ color: 'var(--text-secondary)' }}>
            Contacts
          </p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            {sinceDate}
          </p>
          <p className="text-xs uppercase tracking-wider mt-1" style={{ color: 'var(--text-secondary)' }}>
            Since
          </p>
        </div>
      </div>

      {/* Recovery Phrase Bottom Sheet */}
      <BottomSheet
        isOpen={showRecoverySheet}
        onClose={() => {
          setShowRecoverySheet(false);
          setShowPhrase(false);
        }}
        title="Recovery Phrase"
      >
        {!showPhrase ? (
          <div className="text-center py-4">
            <AlertTriangle size={32} style={{ color: 'var(--warning)' }} className="mx-auto" />
            <p className="text-sm mt-3" style={{ color: 'var(--text-secondary)' }}>
              For security, please confirm you want to view your recovery phrase.
            </p>
            <button
              onClick={() => setShowPhrase(true)}
              className="w-full h-12 rounded-xl text-base font-semibold mt-4"
              style={{ background: 'var(--warning)', color: '#1A1218' }}
            >
              Show Phrase
            </button>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-3 gap-2">
              {words.map((word, i) => (
                <WordChip key={i} index={i + 1} word={word} />
              ))}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(words.join(' ')).catch(() => {});
                addToast('Copied to clipboard', 'success');
              }}
              className="w-full h-12 rounded-xl text-base font-semibold mt-4"
              style={{ background: 'var(--accent-pink)', color: '#1A1218' }}
            >
              Copy Phrase
            </button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
