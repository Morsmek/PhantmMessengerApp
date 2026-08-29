# Phantm — Technical Specification

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.1 | UI framework |
| react-dom | ^19.1 | DOM renderer |
| react-router-dom | ^7.6 | Navigation (stack + tab) |
| zustand | ^5.0 | State management |
| @ionic/react | ^8.5 | Mobile UI primitives + gestures |
| @ionic/react-router | ^8.5 | Ionic integration with react-router |
| lucide-react | ^0.511 | Icon set |
| @capacitor/core | ^7.2 | Native bridge |
| @capacitor/android | ^7.2 | Android platform |
| @capacitor/ios | ^7.2 | iOS platform |
| @capacitor/preferences | ^6.0 | Encrypted local storage |
| @capacitor/haptics | ^6.0 | Touch feedback |
| @capacitor/keyboard | ^6.0 | Keyboard resize handling |
| @capacitor/status-bar | ^6.0 | Status bar styling |
| @capacitor/app | ^6.0 | Back button / app lifecycle |
| @capacitor/clipboard | ^6.0 | Copy phrase / ID |
| @capacitor/local-notifications | ^6.0 | Push notifications |
| bip39 | ^3.1 | BIP39 mnemonic generation / validation |
| react-window | ^1.8 | Message list virtualization |
| tailwindcss | ^4.1 | Utility-first CSS |
| @tailwindcss/vite | ^4.1 | Tailwind Vite integration |
| typescript | ^5.8 | Type safety |
| vite | ^6.3 | Build tool |
| @vitejs/plugin-react | ^4.5 | React Vite plugin |

No shadcn/ui — the design uses a fully custom dark cyan theme with custom components throughout. shadcn's default light-themed primitives would require complete override.

---

## Component Inventory

### Layout

| Component | Source | Notes |
|-----------|--------|-------|
| AppShell | Custom | Sets status bar, safe-area padding, holds router outlet |
| OnboardingNavigator | Custom | Stack router for onboarding screens; no tab bar |
| MainNavigator | Custom | Bottom tab bar with 4 tabs; hosts 4 stack/tab screens |
| TabBar | Custom | 64px + safe-area-inset-bottom, active cyan icon + label |

### Screens

| Screen | Route | Notes |
|--------|-------|-------|
| WelcomeScreen | /welcome | Logo + 2 buttons, no nav bar |
| PassphraseScreen | /passphrase | 12-word grid display, copy, checkbox gate |
| PassphraseConfirmScreen | /passphrase-confirm | 3 random word verification inputs |
| RecoverScreen | /recover | Full 12-word textarea recovery flow |
| ChatsListScreen | /chats | Conversation list, search, FAB, swipe-to-delete |
| ChatDetailScreen | /chats/:id | Message bubbles, input, encrypted header |
| ContactsListScreen | /contacts | Contact list, my ID card, FAB |
| AddContactScreen | /contacts/add | Segmented control: Enter ID / Scan QR |
| ProfileScreen | /profile | Identity card with DataPulse, glitch ID, recovery phrase gate |
| SettingsScreen | /settings | Grouped settings list with toggles |

### Reusable Components

| Component | Used By | Notes |
|-----------|---------|-------|
| ShimmerBadge | ChatDetailScreen | CSS ::after diagonal sweep, IntersectionObserver pause |
| GlitchText | ProfileScreen | CSS ::before/::after RGB-split, 0.6s settle via setTimeout |
| DataPulse | ProfileScreen | Shield icon + 2 expanding ring pseudo-elements |
| WordChip | PassphraseScreen, RecoverScreen | Numbered mnemonic display chip |
| Avatar | ChatsListScreen, ContactsListScreen, ChatDetailScreen | First-letter circle, auto-generated deterministic background color |
| MessageBubble | ChatDetailScreen | Sent (cyan) / received (surface) variants with timestamp + status |
| ToggleSwitch | SettingsScreen | 48x28px track, cyan active, disabled state support |
| Toast | Global | Auto-dismissing slide-up, 3 variants (info/success/error) |
| BottomSheet | ChatDetailScreen (message actions), ContactsListScreen (contact actions) | Slide-up modal with backdrop, uses createPortal |

### Hooks

| Hook | Purpose |
|------|---------|
| useInView | IntersectionObserver wrapper for shimmer pause, animation triggers |
| useHaptics | Wraps Capacitor Haptics with typed impact/notification calls |

---

## Animation Implementation

| Animation | Library | Implementation | Complexity |
|-----------|---------|----------------|------------|
| Encrypted Shimmer Badge | CSS @keyframes | ::after pseudo-element with linear-gradient, 3s ease-in-out infinite. IntersectionObserver toggles `is-visible` class to set `animation-play-state: paused` | Low |
| Glitch Name Reveal | CSS @keyframes | ::before (cyan clip) + ::after (red clip) with offset animations, 0.3s × 2 cycles. setTimeout adds `is-settled` class at 0.6s to fade pseudo-elements | Low |
| Local-Only Data Pulse | CSS @keyframes | 2 absolutely-positioned rings, 4s ease-out infinite with 2s stagger. Ionic lifecycle hooks (useIonViewDidEnter/Leave) toggle `is-paused` | Low |
| Tab switch icon scale | CSS transition | Scale 0.92 for 100ms on active press, spring easing | Low |
| Page stack push/pop | Ionic React | Built-in Ionic page transitions (iOS: slide from right + swipe-back; Android: Material elevation) | Low |
| Bottom sheet open/close | CSS transition | Transform translateY(100% → 0) + backdrop opacity, 300ms ease | Low |
| Invalid input shake | CSS @keyframes | translateX ±4px, 3 cycles, 150ms each | Low |
| Toast slide-in/out | CSS transition | Transform translateY(100px → 0) + opacity, 200ms ease-default | Low |
| FAB press | CSS transition | Scale 0.95, 100ms | Low |
| Swipe actions reveal | Ionic ItemSliding | Built-in ion-item-sliding component for conversation/message rows | Low |
| Pull-to-refresh spinner | Ionic Refresher | Built-in ion-refresher with cyan color override | Low |
| Keyboard slide | Capacitor Keyboard | Native keyboard resize, message list scroll-to-bottom on open | Low |

No animations require GSAP, Framer Motion, or any JS animation library. All are CSS-only or handled by Ionic's built-in primitives.

---

## State & Logic Plan

### Zustand Store Architecture

Four separate stores (not one) — they have independent lifecycles and no cross-cutting concerns that justify colocation:

**IdentityStore** — persisted to encrypted Preferences
- `mnemonic`, `publicKey`, `displayName`, `isOnboarded`
- `generateIdentity()`: calls bip39.generateMnemonic(), derives keypair via ed25519
- `recoverIdentity(mnemonic)`: validates BIP39 checksum, derives same keypair
- `setDisplayName(name)`, `resetIdentity()`

**ChatStore** — persisted to encrypted Preferences
- `conversations[]`, `activeConversationId`
- `sendMessage(convId, content)`: creates Message (ULID from timestamp + random), appends, updates lastMessageAt
- `deleteConversation(id)`, `deleteMessage(convId, msgId)`, `markAsRead(convId)`

**ContactStore** — persisted to encrypted Preferences
- `contacts[]`
- `addContact(phantmId, name?)`: validates 64-char hex format
- `removeContact(id)`, `renameContact(id, name)`

**SettingsStore** — persisted to encrypted Preferences
- `notificationsEnabled`, `showNotificationPreview`, `appLockEnabled`, `autoDeleteDays`
- Toggle actions

### Onboarding Flow Logic

App launch reads `isOnboarded` from Preferences (async). Until resolved, render nothing (or a blank splash). This is a single condition in AppShell that switches between OnboardingNavigator and MainNavigator.

Passphrase confirmation: store the full phrase in PassphraseScreen component state (not global store), pass it via router state to PassphraseConfirmScreen. Confirm screen selects 3 random indices (0–11), validates inputs against the passed phrase. On success, calls `generateIdentity()` and sets `isOnboarded: true`.

### Data Persistence Strategy

All Zustand stores use a custom `persist` middleware backed by `@capacitor/preferences` (which uses Android Keystore / iOS Keychain for encryption). No SQLite — Preferences with encrypted storage is sufficient for the data volume (text messages, contacts, settings).

### Native Bridge Integration Points

| Native Feature | Capacitor Plugin | Integration |
|---------------|------------------|-------------|
| Encrypted storage | @capacitor/preferences | Custom Zustand persist middleware |
| Haptic feedback | @capacitor/haptics | useHaptics hook, called on button press, send, error, success |
| Keyboard resize | @capacitor/keyboard | ChatDetail input docks above keyboard; list scrolls to bottom |
| Status bar | @capacitor/status-bar | Dark style, #030308 background, set on app init |
| Back button | @capacitor/app | Stack pop → tab root → exit toast with 2s debounce |
| Clipboard | @capacitor/clipboard | Copy phrase, copy Phantm ID |
| Screenshot block | @capacitor/app (Window API) | FLAG_SECURE on recovery phrase screens |
| Notifications | @capacitor/local-notifications | Optional message notifications when app is backgrounded |
