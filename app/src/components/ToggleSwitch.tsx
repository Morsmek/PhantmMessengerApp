interface ToggleSwitchProps {
  value: boolean;
  onChange: () => void;
  disabled?: boolean;
}

export function ToggleSwitch({ value, onChange, disabled = false }: ToggleSwitchProps) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className="relative inline-flex items-center rounded-full transition-colors duration-200"
      style={{
        width: 48,
        height: 28,
        background: value ? 'var(--accent-pink)' : 'var(--text-muted)',
        opacity: disabled ? 0.5 : 1,
      }}
      aria-checked={value}
      role="switch"
    >
      <span
        className="inline-block rounded-full transition-transform duration-200"
        style={{
          width: 22,
          height: 22,
          background: '#fff',
          transform: value ? 'translateX(24px)' : 'translateX(3px)',
        }}
      />
    </button>
  );
}
