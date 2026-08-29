import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Contact } from '@/types';

interface ContactState {
  contacts: Contact[];
  addContact: (phantmId: string, name?: string) => boolean;
  removeContact: (id: string) => void;
  renameContact: (id: string, name: string) => void;
  getContact: (id: string) => Contact | undefined;
}

function validatePhantmId(id: string): boolean {
  const clean = id.replace(/^phantm:\/\//, '').trim();
  return /^[0-9a-fA-F]{64}$/.test(clean);
}

export const useContactStore = create<ContactState>()(
  persist(
    (set, get) => ({
      contacts: [],

      addContact: (phantmId: string, name?: string) => {
        if (!validatePhantmId(phantmId)) return false;
        const cleanId = phantmId.replace(/^phantm:\/\//, '').trim().toLowerCase();
        if (get().contacts.find(c => c.id === cleanId)) return false;
        const displayName = name || `Contact ${cleanId.slice(0, 6)}`;
        set(state => ({
          contacts: [...state.contacts, { id: cleanId, name: displayName, addedAt: Date.now(), isVerified: false }],
        }));
        return true;
      },

      removeContact: (id: string) =>
        set(state => ({ contacts: state.contacts.filter(c => c.id !== id) })),

      renameContact: (id: string, name: string) =>
        set(state => ({
          contacts: state.contacts.map(c => c.id === id ? { ...c, name } : c),
        })),

      getContact: (id: string) => get().contacts.find(c => c.id === id),
    }),
    { name: 'phantm-contacts' }
  )
);
