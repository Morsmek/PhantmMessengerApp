import { useEffect, useState } from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
}

export function GlitchText({ text, className = '' }: GlitchTextProps) {
  const [phase, setPhase] = useState<'glitching' | 'settled' | 'done'>('glitching');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('settled'), 600);
    const t2 = setTimeout(() => setPhase('done'), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const classNames = ['glitch-text'];
  if (phase === 'glitching' || phase === 'settled') classNames.push('is-glitching');
  if (phase === 'settled' || phase === 'done') classNames.push('is-settled');

  return (
    <span className={`${classNames.join(' ')} ${className}`} data-text={text}>
      {text}
    </span>
  );
}
