# Midnight-SPPU: Decentralized File Storage Tracker

A privacy-focused Web3 application built on the **Midnight Network** that enables secure tracking, indexing, and verification of decentralized file storage states. Designed with zero-knowledge capabilities, wallet authentication, and direct transaction monitoring via the official Midnight Block Explorer.

---

## 🌐 Live Links & Repository Info

- **GitHub Repository:** (https://github.com/shivammpatil2007-star/Midnight-SPPU)
- **Midnight Block Explorer:** [Midnight Testnet Explorer](https://explorer.preview.midnight.network)

---

## 🚀 Key Features

- **Midnight Network Integration:** Native connectivity with Midnight Network smart contracts and zero-knowledge privacy features.
- **Midnight Wallet Connection:** Connects directly with compatible Midnight wallets (e.g., Midnight / 1AM Wallet) for signing transactions and state updates.
- **Decentralized File Tracking:** Store, manage, and verify decentralized file metadata and storage states on-chain.
- **Direct Midnight Explorer Verification:** Clickable transaction tracking routed directly to `https://explorer.preview.midnight.network`.
- **Integrated Full-Stack Architecture:** Connected frontend and backend API pipelines handling pending, indexing, and confirmed transaction states.

---

## 📜 Network & Smart Contract Specifications

| Parameter | Specification |
| :--- | :--- |
| **Primary Network** | Midnight Testnet (Preview) |
| **Block Explorer** | `https://explorer.preview.midnight.network` |
| **Transaction Route** | `https://explorer.preview.midnight.network/tx/{txHash}` |
| **Contract / Address** | `[Your Deployed Midnight Contract Address]` |

---

## 📁 Repository Structure

```text
Midnight-SPPU/
├── decentralized-file-storage-tracker/   # Core application (Frontend & Backend)
│   ├── src/                              # Midnight SDK & Web3 integration logic
│   ├── package.json                      # Project dependencies
│   └── .env.example                      # Environment variables template
├── prompt.md                             # AI Agent execution prompts
└── README.md                             # Project documentation
⚙️ Getting Started
1. Prerequisites
Node.js (v18 or higher)

Package manager (npm, pnpm, or yarn)

Midnight-compatible Web3 wallet extension set to the Midnight Testnet

2. Installation
Navigate into the application folder and install dependencies:

Bash
cd decentralized-file-storage-tracker
npm install
3. Environment Setup
Create a .env.local file inside the decentralized-file-storage-tracker directory:

Code snippet
# Midnight Network Configuration
NEXT_PUBLIC_NETWORK=midnight-testnet
NEXT_PUBLIC_MIDNIGHT_EXPLORER_URL=[https://explorer.preview.midnight.network/tx/](https://explorer.preview.midnight.network/tx/)

# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
4. Running the Application
Start the local development server:

Bash
npm run dev
Open http://localhost:3000 in your browser to interact with the application.

👤 Author & Maintainer
Shivam Patil

GitHub: @shivammpatil2007-star

Repository: https://github.com/shivammpatil2007-star/Midnight-SPPU
