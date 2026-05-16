import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Conversation, Message } from '@/types';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  createConversation: (contactId: string, contactName: string) => string;
  deleteConversation: (id: string) => void;
  sendMessage: (conversationId: string, content: string) => void;
  deleteMessage: (conversationId: string, messageId: string) => void;
  markAsRead: (conversationId: string) => void;
  setActiveConversation: (id: string | null) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,

      createConversation: (contactId: string, contactName: string) => {
        const exists = get().conversations.find(c => c.id === contactId);
        if (exists) {
          set({ activeConversationId: contactId });
          return contactId;
        }
        const conv: Conversation = {
          id: contactId,
          contactName,
          messages: [],
          lastMessageAt: Date.now(),
          unreadCount: 0,
        };
        set(state => ({
          conversations: [conv, ...state.conversations],
          activeConversationId: contactId,
        }));
        return contactId;
      },

      deleteConversation: (id: string) =>
        set(state => ({
          conversations: state.conversations.filter(c => c.id !== id),
          activeConversationId: state.activeConversationId === id ? null : state.activeConversationId,
        })),

      sendMessage: (conversationId: string, content: string) => {
        const msg: Message = {
          id: generateId(),
          content,
          timestamp: Date.now(),
          isSent: true,
          status: 'sent',
        };
        set(state => ({
          conversations: state.conversations.map(c =>
            c.id === conversationId
              ? { ...c, messages: [...c.messages, msg], lastMessageAt: msg.timestamp }
              : c
          ),
        }));

        setTimeout(() => {
          set(state => ({
            conversations: state.conversations.map(c =>
              c.id === conversationId
                ? {
                    ...c,
                    messages: c.messages.map(m =>
                      m.id === msg.id ? { ...m, status: 'delivered' as const } : m
                    ),
                  }
                : c
            ),
          }));
        }, 500);
      },

      deleteMessage: (conversationId: string, messageId: string) =>
        set(state => ({
          conversations: state.conversations.map(c =>
            c.id === conversationId
              ? { ...c, messages: c.messages.filter(m => m.id !== messageId) }
              : c
          ),
        })),

      markAsRead: (conversationId: string) =>
        set(state => ({
          conversations: state.conversations.map(c =>
            c.id === conversationId ? { ...c, unreadCount: 0 } : c
          ),
        })),

      setActiveConversation: (id: string | null) => set({ activeConversationId: id }),
    }),
    { name: 'phantm-chats' }
  )
);
