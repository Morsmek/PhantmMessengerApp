# Phantm Messenger

Encrypted, decentralized privacy-first messaging web application with on-device cryptographic identity generation and zero-knowledge architecture.

## Overview

Phantm Messenger is built on privacy principles:
- **Zero Identity Requirements**: No phone numbers, no email addresses, and no personal identifiers.
- **Client-Side Cryptographic Identity**: Identities and public keys are derived locally on-device using standard 20-word BIP39 mnemonics and SHA-256 keys.
- **End-to-End Encrypted Messaging**: Local message persistence with delivery state tracking, full search, and conversation management.
- **Auto-Delete & Security Controls**: Configurable message retention periods (24 hours, 7 days, 30 days, or never) and app lock settings.
- **Dark Cyberpunk UI**: Distinctive dark cyan cyberpunk visual language with localized data pulses, shimmer badges, and glitch text effects.

## Core Features & Screens

1. **Onboarding & Recovery**:
   - Welcome Screen: High-impact hero screen with particle background and animated Phantm branding.
   - Phantm ID Screen: Displays public cryptographic identity derived from recovery phrase.
   - Passphrase Screen: 20-word recovery phrase generator with interactive word chips and copy utility.
   - Passphrase Confirmation: 3-round interactive quiz verifying the user has securely stored their mnemonic.
   - Recovery Screen: Instant wallet-style recovery of account via 20-word phrase.

2. **Messaging & Contacts**:
   - Chats List: Searchable conversations list, time formatting, and new chat launcher.
   - Chat Detail: End-to-end encrypted messaging stream with sent/delivered receipts, message options (copy, delete), and encrypted status indicators.
   - Contacts List: Contact cards with verified status, fast conversation start, and copy contact ID.
   - Add Contact: Phantm address parser with format validation and QR code scanning mode.

3. **Identity & Settings**:
   - Profile: Live identity card with DataPulse animation, glitch name display, editable pseudonym, message stats, and recovery phrase viewer.
   - Settings: Dark mode toggles, notification configurations, preview preferences, auto-delete lifecycle configuration, privacy manifesto, and open source licenses.

## Technology Stack

- **Framework**: React 19 + TypeScript
- **Routing**: React Router v7
- **State Management**: Zustand with persistent storage
- **Styling**: Tailwind CSS with custom cyberpunk animations
- **Icons**: Lucide React
- **Build**: Vite
