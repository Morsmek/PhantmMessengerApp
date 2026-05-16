interface DataPulseProps {
  isActive?: boolean;
}

export function DataPulse({ isActive = true }: DataPulseProps) {
  return (
    <div className={`pulse-container ${!isActive ? 'is-paused' : ''}`}>
      <div className="pulse-ring pulse-ring-1" />
      <div className="pulse-ring pulse-ring-2" />
      <div className="pulse-core">
        <img
          src="/assets/phantm-icon.png"
          alt="Phantm"
          className="w-8 h-8 object-contain"
        />
      </div>
    </div>
  );
}
