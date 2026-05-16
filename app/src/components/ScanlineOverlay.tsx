export function ScanlineOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none opacity-[0.03]"
      style={{ zIndex: 9998 }}
    >
      <div
        className="w-full h-[2px]"
        style={{
          background: 'linear-gradient(180deg, transparent, var(--accent-pink), transparent)',
          animation: 'scanline 8s linear infinite',
        }}
      />
    </div>
  );
}
