import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex flex-col justify-end">
      <div
        className="absolute inset-0 bg-black/60 animate-[fade-in_200ms_ease]"
        onClick={onClose}
      />
      <div
        className="relative z-10 w-full animate-[slide-up_300ms_cubic-bezier(0.25,0.1,0.25,1)_forwards]"
        style={{
          background: 'var(--bg-elevated)',
          borderRadius: '24px 24px 0 0',
          maxHeight: '70vh',
          overflowY: 'auto',
        }}
      >
        <div className="flex items-center justify-between p-4 pb-2">
          {title && (
            <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              {title}
            </h3>
          )}
          <button onClick={onClose} className="p-1 ml-auto" aria-label="Close">
            <X size={20} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>
        <div className="p-4 pt-2">{children}</div>
      </div>
    </div>,
    document.body
  );
}
