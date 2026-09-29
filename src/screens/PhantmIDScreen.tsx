import { useNavigate, useLocation } from 'react-router-dom';
import { Copy, Check, ArrowRight, Fingerprint } from 'lucide-react';
import { useState } from 'react';
import { useIdentityStore } from '@/stores/identityStore';
import { useToastStore } from '@/stores/toastStore';
import { GlitchText } from '@/components/GlitchText';

interface LocationState {
  words: string[];
}

export function PhantmIDScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const publicKey = useIdentityStore((s) => s.publicKey);
  const addToast = useToastStore((s) => s.addToast);
  const [copied, setCopied] = useState(false);

  const words = state?.words || [];
  const fullId = publicKey ? `phantm://${publicKey}` : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(fullId).catch(() => {});
    setCopied(true);
    addToast('Phantm ID copied', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="flex flex-col min-h-[100dvh] relative overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Subtle radial glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(233,30,99,0.1) 0%, transparent 70%)',
        }}
      />

      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* Logo with scale in */}
        <div
          className="animate-scale-in"
          style={{ animationDelay: '100ms', animationFillMode: 'both' }}
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mb-6 animate-neon-glow-strong"
            style={{
              background: 'var(--bg-surface)',
              border: '2px solid rgba(233, 30, 99, 0.3)',
            }}
          >
            <img
              src="/assets/phantm-icon.png"
              alt="Phantm"
              className="w-14 h-14 object-contain"
            />
          </div>
        </div>

        <h1
          className="text-2xl font-bold text-center animate-fade-in"
          style={{
            color: 'var(--text-primary)',
            animationDelay: '200ms',
            animationFillMode: 'both',
          }}
        >
          Your Phantm ID
        </h1>

        <p
          className="text-sm text-center mt-3 max-w-xs animate-fade-in"
          style={{
            color: 'var(--text-secondary)',
            animationDelay: '300ms',
            animationFillMode: 'both',
          }}
        >
          This is your unique identity on Phantm. Share it so others can add you as a contact.
        </p>

        {/* ID Card with neon glow */}
        <div
          className="w-full max-w-sm mt-8 rounded-xl p-5 animate-scale-in animate-neon-glow"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid rgba(233, 30, 99, 0.25)',
            animationDelay: '400ms',
            animationFillMode: 'both',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Fingerprint size={16} style={{ color: 'var(--accent-pink)' }} />
            <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--accent-pink)' }}>
              Identity
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <GlitchText
                text={publicKey ? `phantm://${publicKey.slice(0, 12)}...${publicKey.slice(-8)}` : '...'}
                className="text-sm block"
              />
            </div>
            <button
              onClick={handleCopy}
              className="p-2 flex-shrink-0 rounded-lg transition-colors active:bg-white/[0.04] animate-scale-in"
              style={{ animationDelay: '600ms', animationFillMode: 'both' }}
              aria-label="Copy Phantm ID"
            >
              {copied ? (
                <Check size={18} style={{ color: 'var(--success)' }} />
              ) : (
                <Copy size={18} style={{ color: 'var(--text-secondary)' }} />
              )}
            </button>
          </div>
        </div>

        <p
          className="text-xs text-center mt-6 max-w-xs animate-fade-in"
          style={{
            color: 'var(--text-muted)',
            animationDelay: '500ms',
            animationFillMode: 'both',
          }}
        >
          Your ID is derived from your recovery phrase. Nobody — not even Phantm — can access your account without it.
        </p>
      </div>

      {/* Continue Button */}
      <div className="px-5 pb-8 relative z-10">
        <button
          onClick={() => navigate('/passphrase', { state: { words } })}
          className="w-full h-14 rounded-xl text-base font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.97] animate-scale-in animate-neon-glow"
          style={{
            background: 'var(--accent-pink)',
            color: '#fff',
            animationDelay: '600ms',
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
