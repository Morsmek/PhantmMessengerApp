import { useNavigate } from 'react-router-dom';
import { useIdentityStore } from '@/stores/identityStore';
import { ParticleBackground } from '@/components/ParticleBackground';

export function WelcomeScreen() {
  const navigate = useNavigate();
  const isOnboarded = useIdentityStore((s) => s.isOnboarded);
  const generateIdentity = useIdentityStore((s) => s.generateIdentity);

  if (isOnboarded) {
    navigate('/chats', { replace: true });
    return null;
  }

  const handleCreate = () => {
    const mnemonic = generateIdentity();
    const words = mnemonic.split(' ');
    navigate('/phantm-id', { state: { words } });
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[100dvh] px-6 relative overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      <ParticleBackground />

      {/* Radial glow behind logo */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(233,30,99,0.15) 0%, transparent 70%)',
          animation: 'breathe 4s ease-in-out infinite',
        }}
      />

      <div className="flex flex-col items-center relative z-10" style={{ marginTop: '-10vh' }}>
        {/* Logo with float animation */}
        <div className="animate-float">
          <img
            src="/assets/phantm-logo-full.png"
            alt="Phantm"
            className="w-60 h-auto object-contain mb-8 drop-shadow-2xl"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(233, 30, 99, 0.4))',
            }}
          />
        </div>

        {/* Tagline with fade in */}
        <p
          className="text-sm mb-10 text-center tracking-widest uppercase animate-fade-in"
          style={{
            color: 'var(--text-secondary)',
            animationDelay: '200ms',
            animationFillMode: 'both',
          }}
        >
          Privacy First. Data Never.
        </p>

        {/* Create button with neon glow */}
        <div
          className="animate-scale-in"
          style={{ animationDelay: '400ms', animationFillMode: 'both' }}
        >
          <button
            onClick={handleCreate}
            className="w-72 h-14 rounded-xl text-base font-semibold transition-all active:scale-[0.97] active:opacity-90 animate-neon-glow"
            style={{
              background: 'var(--accent-pink)',
              color: '#fff',
            }}
          >
            Create Identity
          </button>
        </div>

        {/* Recover button with border glow */}
        <div
          className="animate-scale-in mt-3"
          style={{ animationDelay: '550ms', animationFillMode: 'both' }}
        >
          <button
            onClick={() => navigate('/recover')}
            className="w-72 h-14 rounded-xl text-base font-semibold transition-all active:scale-[0.97] active:opacity-90 animate-border-glow"
            style={{
              background: 'transparent',
              border: '1px solid rgba(233, 30, 99, 0.4)',
              color: 'var(--accent-pink)',
            }}
          >
            Recover Identity
          </button>
        </div>
      </div>

      {/* Bottom tagline */}
      <p
        className="absolute bottom-8 text-xs text-center z-10 animate-fade-in"
        style={{
          color: 'var(--text-muted)',
          animationDelay: '700ms',
          animationFillMode: 'both',
        }}
      >
        No phone number. No email. No data collected.
      </p>
    </div>
  );
}
