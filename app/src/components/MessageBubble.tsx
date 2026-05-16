import { Check, CheckCheck } from 'lucide-react';
import type { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isSent = message.isSent;
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex w-full ${isSent ? 'justify-end' : 'justify-start'}`}>
      <div className="flex flex-col max-w-[75%]">
        <div
          className="px-3.5 py-2.5 text-base leading-relaxed break-words"
          style={{
            background: isSent ? 'var(--accent-pink)' : 'var(--bg-surface)',
            color: isSent ? '#1A1218' : 'var(--text-primary)',
            borderRadius: isSent ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          }}
        >
          {message.content}
        </div>
        <div className={`flex items-center gap-1 mt-1 ${isSent ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {time}
          </span>
          {isSent && (
            <span style={{ color: 'var(--success)' }}>
              {message.status === 'delivered' ? (
                <CheckCheck size={14} />
              ) : (
                <Check size={14} />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
