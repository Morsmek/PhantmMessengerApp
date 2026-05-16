import { useEffect, useRef, useState } from 'react';
import { Lock } from 'lucide-react';

interface ShimmerBadgeProps {
  text?: string;
}

export function ShimmerBadge({ text = 'Encrypted' }: ShimmerBadgeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`shimmer-badge is-visible ${isVisible ? 'is-visible' : ''}`}
    >
      <Lock size={12} style={{ color: 'var(--accent-pink)' }} />
      <span className="text-xs font-medium" style={{ color: 'var(--accent-pink)' }}>
        {text}
      </span>
    </div>
  );
}
