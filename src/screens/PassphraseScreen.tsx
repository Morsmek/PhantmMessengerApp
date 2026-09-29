import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Copy, Check, ArrowRight, AlertTriangle } from 'lucide-react';
import { useIdentityStore } from '@/stores/identityStore';
import { WordChip } from '@/components/WordChip';
import { useToastStore } from '@/stores/toastStore';

interface LocationState {
  words: string[];
}

export function PassphraseScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const generateIdentity = useIdentityStore((s) => s.generateIdentity);
  const addToast = useToastStore((s) => s.addToast);
  const [words, setWords] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showWords, setShowWords] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      if (state?.words && state.words.length === 20) {
        setWords(state.words);
      } else {
        const mnemonic = generateIdentity();
        setWords(mnemonic.split(' '));
      }
      // Trigger staggered animation
      setTimeout(() => setShowWords(true), 100);
    }
  }, [generateIdentity, state]);

  const handleCopy = () => {
    const phrase = words.join(' ');
    navigator.clipboard.writeText(phrase).catch(() => {});
    setCopied(true);
    addToast('Copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="flex flex-col min-h-[100dvh] relative overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Subtle background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(233,30,99,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="flex-1 px-5 pt-6 pb-4 overflow-y-auto no-scrollbar relative z-10">
        <h1
          className="text-2xl font-bold animate-fade-in"
          style={{ color: 'var(--text-primary)', animationFillMode: 'both' }}
        >
          Your Recovery Phrase
        </h1>
        <p
          className="text-sm mt-2 animate-fade-in"
          style={{ color: 'var(--text-secondary)', animationDelay: '100ms', animationFillMode: 'both' }}
        >
          Write these 20 words down in order and store them somewhere safe.
        </p>

        {/* Word Grid - 4 columns x 5 rows with staggered entrance */}
        <div className="grid grid-cols-4 gap-2 mt-5 max-w-sm mx-auto">
          {words.map((word, i) => (
            <div
              key={i}
              className={showWords ? 'animate-scale-in' : 'opacity-0'}
              style={{
                animationDelay: `${150 + i * 40}ms`,
                animationFillMode: 'both',
              }}
            >
              <WordChip index={i + 1} word={word} />
            </div>
          ))}
        </div>

        {/* Copy button */}
        <div
          className="flex justify-center animate-fade-in"
          style={{ animationDelay: '1000ms', animationFillMode: 'both' }}
        >
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 mt-4 text-sm transition-colors active:opacity-70"
            style={{ color: 'var(--accent-pink)' }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
        </div>

        {/* Warning Box with glow border */}
        <div
          className="mt-6 rounded-xl p-4 animate-slide-up animate-border-glow"
          style={{
            background: 'rgba(245, 158, 11, 0.06)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            animationDelay: '1100ms',
            animationFillMode: 'both',
          }}
        >
          <div className="flex items-start gap-2">
            <AlertTriangle size={18} style={{ color: 'var(--warning)', flexShrink: 0 }} className="mt-0.5" />
            <p className="text-sm" style={{ color: 'var(--warning)' }}>
              If you lose access to your account, this mnemonic is the <strong>only</strong> way to recover it. Phantm cannot reset your account.
            </p>
          </div>
        </div>

        {/* Tick Box with slide in */}
        <label
          className="flex items-start gap-3 mt-5 cursor-pointer animate-slide-up"
          style={{ animationDelay: '1200ms', animationFillMode: 'both' }}
        >
          <div
            className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
            style={{
              borderColor: confirmed ? 'var(--accent-pink)' : 'var(--text-muted)',
              background: confirmed ? 'var(--accent-pink)' : 'transparent',
              boxShadow: confirmed ? '0 0 8px rgba(233, 30, 99, 0.4)' : 'none',
            }}
            onClick={() => setConfirmed(!confirmed)}
          >
            {confirmed && (
              <Check size={14} color="#fff" strokeWidth={3} />
            )}
          </div>
          <span className="text-sm leading-5" style={{ color: 'var(--text-secondary)' }}>
            I have read and understood this warning, and I have written down the words.
          </span>
        </label>
      </div>

      {/* Continue Button */}
      <div className="px-5 pb-8 relative z-10">
        <button
          onClick={() => navigate('/passphrase-confirm', { state: { words } })}
          disabled={!confirmed}
          className="w-full h-14 rounded-xl text-base font-semibold flex items-center justify-center gap-2 transition-all animate-fade-in"
          style={{
            background: confirmed ? 'var(--accent-pink)' : 'var(--text-muted)',
            color: confirmed ? '#fff' : 'var(--bg-primary)',
            opacity: confirmed ? 1 : 0.5,
            boxShadow: confirmed ? '0 0 20px rgba(233, 30, 99, 0.3)' : 'none',
            animationDelay: '1300ms',
            animationFillMode: 'both',
          }}
        >
          Continue
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
