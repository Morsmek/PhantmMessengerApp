import { useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, Users, Shield, Settings } from 'lucide-react';

const TABS = [
  { path: '/chats', label: 'Chats', Icon: MessageSquare },
  { path: '/contacts', label: 'Contacts', Icon: Users },
  { path: '/profile', label: 'Profile', Icon: Shield },
  { path: '/settings', label: 'Settings', Icon: Settings },
];

export function TabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/chats') return currentPath.startsWith('/chats');
    if (path === '/contacts') return currentPath.startsWith('/contacts');
    return currentPath === path;
  };

  return (
    <nav
      className="shrink-0 z-50 flex items-center justify-around"
      style={{
        height: 'calc(64px + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        background: 'var(--bg-surface)',
        borderTop: '1px solid rgba(61, 61, 77, 0.5)',
      }}
    >
      {TABS.map((tab) => {
        const active = isActive(tab.path);
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className="flex flex-col items-center justify-center gap-0.5 w-16 h-14 transition-transform active:scale-[0.92]"
            style={{
              color: active ? 'var(--accent-pink)' : 'var(--text-muted)',
            }}
            aria-label={tab.label}
          >
            <tab.Icon size={24} strokeWidth={active ? 2.5 : 1.5} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
