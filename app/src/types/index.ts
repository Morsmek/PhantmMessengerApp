export interface Message {
  id: string;
  content: string;
  timestamp: number;
  isSent: boolean;
  status: 'sent' | 'delivered';
}

export interface Conversation {
  id: string;
  contactName: string;
  messages: Message[];
  lastMessageAt: number;
  unreadCount: number;
}

export interface Contact {
  id: string;
  name: string;
  addedAt: number;
  isVerified: boolean;
}

export interface ToastData {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error';
}
