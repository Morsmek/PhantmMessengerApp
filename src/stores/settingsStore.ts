import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  notificationsEnabled: boolean;
  showNotificationPreview: boolean;
  appLockEnabled: boolean;
  autoDeleteDays: number | null;
  toggleNotifications: () => void;
  togglePreview: () => void;
  toggleAppLock: () => void;
  setAutoDelete: (days: number | null) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      notificationsEnabled: true,
      showNotificationPreview: false,
      appLockEnabled: false,
      autoDeleteDays: null,
      toggleNotifications: () => set((s) => ({ notificationsEnabled: !s.notificationsEnabled })),
      togglePreview: () => set((s) => ({ showNotificationPreview: !s.showNotificationPreview })),
      toggleAppLock: () => set((s) => ({ appLockEnabled: !s.appLockEnabled })),
      setAutoDelete: (days: number | null) => set({ autoDeleteDays: days }),
    }),
    { name: 'phantm-settings' }
  )
);
