const COLORS = [
  '#1a3a5c', '#2d1b4e', '#1b4d3e', '#4d1b1b', '#3d3d1b',
  '#1b3d4d', '#4d2d1b', '#2d4d1b', '#3d1b4d', '#1b4d2d',
];

function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

interface AvatarProps {
  name: string;
  size?: number;
  className?: string;
}

export function Avatar({ name, size = 48, className = '' }: AvatarProps) {
  const letter = (name?.[0] || '?').toUpperCase();
  const bg = getColor(name || '?');

  return (
    <div
      className={`flex items-center justify-center rounded-full flex-shrink-0 font-semibold ${className}`}
      style={{
        width: size,
        height: size,
        background: bg,
        color: 'var(--text-primary)',
        fontSize: size * 0.42,
      }}
      aria-label={`${name} avatar`}
    >
      {letter}
    </div>
  );
}
