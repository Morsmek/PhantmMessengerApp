import { useToastStore } from '@/stores/toastStore';

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="fixed bottom-20 left-4 right-4 z-[100] flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto animate-[toast-in_200ms_ease-out]"
        >
          <div
            className="rounded-xl px-5 py-3 text-sm font-medium shadow-lg"
            style={{
              background: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
              borderLeft: `3px solid ${
                toast.type === 'success'
                  ? 'var(--success)'
                  : toast.type === 'error'
                  ? 'var(--error)'
                  : 'var(--accent-pink)'
              }`,
            }}
          >
            {toast.message}
          </div>
        </div>
      ))}
    </div>
  );
}
