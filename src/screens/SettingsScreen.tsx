import { useState } from 'react';
import { Moon, Bell, Eye, Lock, Trash2, Info, FileText, ChevronRight } from 'lucide-react';
import { useSettingsStore } from '@/stores/settingsStore';
import { ToggleSwitch } from '@/components/ToggleSwitch';
import { BottomSheet } from '@/components/BottomSheet';

export function SettingsScreen() {
  const settings = useSettingsStore();
  const [showAutoDelete, setShowAutoDelete] = useState(false);

  const autoDeleteOptions: { label: string; value: number | null }[] = [
    { label: 'Never', value: null },
    { label: '1 day', value: 1 },
    { label: '7 days', value: 7 },
    { label: '30 days', value: 30 },
  ];

  const autoDeleteLabel = autoDeleteOptions.find(
    (o) => o.value === settings.autoDeleteDays
  )?.label || 'Never';

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar" style={{ background: 'var(--bg-primary)' }}>
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Settings
        </h1>
      </div>

      {/* Appearance */}
      <div className="px-4 pt-6 pb-2">
        <p
          className="text-xs uppercase tracking-[0.1em]"
          style={{ color: 'var(--text-secondary)' }}
        >
          Appearance
        </p>
      </div>
      <SettingRow
        icon={<Moon size={20} style={{ color: 'var(--text-secondary)' }} />}
        label="Dark Mode"
        subtitle="Always on for privacy"
        right={<ToggleSwitch value={true} onChange={() => {}} disabled />}
      />

      {/* Notifications */}
      <div className="px-4 pt-6 pb-2">
        <p
          className="text-xs uppercase tracking-[0.1em]"
          style={{ color: 'var(--text-secondary)' }}
        >
          Notifications
        </p>
      </div>
      <SettingRow
        icon={<Bell size={20} style={{ color: 'var(--text-secondary)' }} />}
        label="Message Notifications"
        right={<ToggleSwitch value={settings.notificationsEnabled} onChange={settings.toggleNotifications} />}
      />
      <SettingRow
        icon={<Eye size={20} style={{ color: 'var(--text-secondary)' }} />}
        label="Notification Preview"
        subtitle="Show sender only"
        right={<ToggleSwitch value={settings.showNotificationPreview} onChange={settings.togglePreview} />}
      />

      {/* Security */}
      <div className="px-4 pt-6 pb-2">
        <p
          className="text-xs uppercase tracking-[0.1em]"
          style={{ color: 'var(--text-secondary)' }}
        >
          Security
        </p>
      </div>
      <SettingRow
        icon={<Lock size={20} style={{ color: 'var(--text-secondary)' }} />}
        label="App Lock"
        subtitle="Require biometric on open"
        right={<ToggleSwitch value={settings.appLockEnabled} onChange={settings.toggleAppLock} />}
      />
      <SettingRow
        icon={<Trash2 size={20} style={{ color: 'var(--text-secondary)' }} />}
        label="Auto-Delete Messages"
        subtitle={autoDeleteLabel}
        right={<ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />}
        onClick={() => setShowAutoDelete(true)}
      />

      {/* About */}
      <div className="px-4 pt-6 pb-2">
        <p
          className="text-xs uppercase tracking-[0.1em]"
          style={{ color: 'var(--text-secondary)' }}
        >
          About
        </p>
      </div>
      <SettingRow
        icon={<Info size={20} style={{ color: 'var(--text-secondary)' }} />}
        label="Version"
        subtitle="1.0.0"
      />
      <SettingRow
        icon={<FileText size={20} style={{ color: 'var(--text-secondary)' }} />}
        label="Privacy Policy"
        right={<ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />}
      />
      <SettingRow
        icon={<FileText size={20} style={{ color: 'var(--text-secondary)' }} />}
        label="Open Source Licenses"
        right={<ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />}
      />

      {/* Auto-Delete Picker */}
      <BottomSheet
        isOpen={showAutoDelete}
        onClose={() => setShowAutoDelete(false)}
        title="Auto-Delete Messages"
      >
        <div className="space-y-1">
          {autoDeleteOptions.map((option) => (
            <button
              key={option.label}
              onClick={() => {
                settings.setAutoDelete(option.value);
                setShowAutoDelete(false);
              }}
              className="flex items-center justify-between w-full px-3 py-3 rounded-lg text-left transition-colors active:bg-white/[0.04]"
            >
              <span style={{ color: 'var(--text-primary)' }}>{option.label}</span>
              {settings.autoDeleteDays === option.value && (
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--accent-pink)' }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="#1A1218" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}

function SettingRow({
  icon,
  label,
  subtitle,
  right,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  right?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center w-full px-4 py-3.5 text-left transition-colors active:bg-white/[0.04]"
      style={{ borderBottom: '1px solid rgba(61, 61, 77, 0.3)' }}
    >
      <div className="flex-shrink-0">{icon}</div>
      <div className="ml-3 flex-1 min-w-0">
        <p className="text-base" style={{ color: 'var(--text-primary)' }}>
          {label}
        </p>
        {subtitle && (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {subtitle}
          </p>
        )}
      </div>
      {right && <div className="flex-shrink-0 ml-2">{right}</div>}
    </button>
  );
}
