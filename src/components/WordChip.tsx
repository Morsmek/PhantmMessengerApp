interface WordChipProps {
  index: number;
  word: string;
}

export function WordChip({ index, word }: WordChipProps) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg py-2.5"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--text-muted)',
      }}
    >
      <span className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>
        {index}
      </span>
      <span
        className="text-sm font-medium"
        style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}
      >
        {word}
      </span>
    </div>
  );
}
