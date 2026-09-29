import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useIdentityStore } from '@/stores/identityStore';
import { TabBar } from '@/components/TabBar';
import { ToastContainer } from '@/components/Toast';
import { ScanlineOverlay } from '@/components/ScanlineOverlay';
import { WelcomeScreen } from '@/screens/WelcomeScreen';
import { PhantmIDScreen } from '@/screens/PhantmIDScreen';
import { PassphraseScreen } from '@/screens/PassphraseScreen';
import { PassphraseConfirmScreen } from '@/screens/PassphraseConfirmScreen';
import { RecoverScreen } from '@/screens/RecoverScreen';
import { ChatsListScreen } from '@/screens/ChatsListScreen';
import { ChatDetailScreen } from '@/screens/ChatDetailScreen';
import { NewChatScreen } from '@/screens/NewChatScreen';
import { ContactsListScreen } from '@/screens/ContactsListScreen';
import { AddContactScreen } from '@/screens/AddContactScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';

function OnboardingLayout() {
  return (
    <div className="h-[100dvh] w-full relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <Routes>
        <Route path="welcome" element={<WelcomeScreen />} />
        <Route path="phantm-id" element={<PhantmIDScreen />} />
        <Route path="passphrase" element={<PassphraseScreen />} />
        <Route path="passphrase-confirm" element={<PassphraseConfirmScreen />} />
        <Route path="recover" element={<RecoverScreen />} />
        <Route path="*" element={<Navigate to="welcome" replace />} />
      </Routes>
    </div>
  );
}

function MainLayout() {
  const location = useLocation();
  const isChatDetail = location.pathname.startsWith('/chats/') && location.pathname !== '/chats' && location.pathname !== '/chats/new';
  const isAddContact = location.pathname === '/contacts/add';
  const showTabBar = !isChatDetail && !isAddContact;

  return (
    <div className="h-[100dvh] w-full flex flex-col relative" style={{ background: 'var(--bg-primary)' }}>
      <main className="flex-1 overflow-hidden">
        <Routes>
          <Route path="chats" element={<ChatsListScreen />} />
          <Route path="chats/new" element={<NewChatScreen />} />
          <Route path="chats/:id" element={<ChatDetailScreen />} />
          <Route path="contacts" element={<ContactsListScreen />} />
          <Route path="contacts/add" element={<AddContactScreen />} />
          <Route path="profile" element={<ProfileScreen />} />
          <Route path="settings" element={<SettingsScreen />} />
          <Route path="*" element={<Navigate to="chats" replace />} />
        </Routes>
      </main>
      {showTabBar && <TabBar />}
      <ToastContainer />
      <ScanlineOverlay />
    </div>
  );
}

export default function App() {
  const isOnboarded = useIdentityStore((s) => s.isOnboarded);

  return (
    <Routes>
      <Route
        path="/*"
        element={
          isOnboarded ? (
            <MainLayout />
          ) : (
            <OnboardingLayout />
          )
        }
      />
    </Routes>
  );
}
