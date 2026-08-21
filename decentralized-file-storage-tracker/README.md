<div align="center">
  <h1>🌒 Midnight File Storage Tracker</h1>
  <p><strong>Decentralized, Zero-Knowledge File Verification & Storage Registry</strong></p>
  <p><em>Level 2: Waxing Crescent Submission</em></p>
  
  [![Network: Midnight Preprod](https://img.shields.io/badge/Network-Midnight%20Preprod-8B5CF6?style=for-the-badge&logo=blockchain)](https://explorer.preprod.midnight.network)
  [![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-000000?style=for-the-badge&logo=vercel)](https://midnight-sppu.vercel.app/)
</div>

<br />

## 🌟 Introduction

**Midnight File Tracker** is a decentralized application that enables users to securely register IPFS file content identifiers (CIDs) on the Midnight blockchain. It leverages Midnight's zero-knowledge proofs to allow users to prove ownership of a file based on its content hash without **ever revealing the file's contents**.

By decoupling the public registry from the private witness data, this application showcases a powerful use-case of the Midnight Network: **auditable, decentralized records without sacrificing data confidentiality.**

---

## 🔗 Live Links & Preprod Verification

| Resource | Link |
| :--- | :--- |
| 🟢 **Live Demo App** | [midnight-sppu.vercel.app](https://midnight-sppu.vercel.app/) |
| 🎥 **Demo Video** | [https://www.loom.com/share/6345e5fea1ca4381b9ce9be7ef45f2eb](https://www.loom.com/share/6345e5fea1ca4381b9ce9be7ef45f2eb) |
| 📝 **Smart Contract** | `02e888eadf79a7e940a537363568b52a4ab9c783b8d0c5769404d37232ee9193` |
| 🔗 **Deployment TX** | `tx_0fe96b365df92d5e7dea0a7929d977247e6d05c297396139e03286b4e88883f8` |
| 🌍 **Block Explorer** | [View Transaction on Preprod Explorer](https://explorer.preprod.midnight.network/tx/tx_0fe96b365df92d5e7dea0a7929d977247e6d05c297396139e03286b4e88883f8) |

<br />

## 🔒 Observable Privacy Behavior (Zero-Knowledge Claim)

> **The Zero-Knowledge Guarantee**: Prove you own the data, without exposing the data.

* 🔓 **What is Proven (Public):** The contract stores public metadata including the IPFS CID, Owner Address, timestamp, file size, and MIME type. This provides a transparent registry of files ensuring data availability.
* 🛡️ **What Remains Private:** The actual file content and the raw SHA-256 file content hash remain completely private. They are processed locally via zero-knowledge circuits (e.g. `verify_ownership`). They are **never** broadcasted to the network.

---

## 🔌 Midnight.js & Lace Wallet Integration Architecture

- 🦊 **Wallet Connection Flow:** Integrates directly with the `@midnight-ntwrk/dapp-connector-api` for seamless Lace & 1AM wallet connections on the Preprod network.
- ⚡ **Circuit Call Execution:** Demonstrates frontend circuit invocation where zero-knowledge proofs are generated locally (using compiled `contracts/managed/` circuits) before submitting state updates to the blockchain.

---

## 📸 Application Preview

<div align="center">
  <img src="docs/images/frontend_app.png" alt="Frontend App" width="800" />
</div>

<br />

## 🛠 Compile Report & Code Audit

The smart contract has been successfully compiled using Compact. The `managed/` directory is present with all required zero-knowledge circuits and proving keys.

<details>
<summary><b>Click to view Compact Compilation Output</b></summary>

```bash
> decentralized-file-storage-tracker@0.1.0 compile
> compact compile contracts/FileStorageTracker.compact --output_dir contracts/managed

 Listing C:\Users\shubh\Desktop\Midnight\decentralized-file-storage-tracker\
 New files added to this directory will not be compressed.

 Listing C:\Users\shubh\Desktop\Midnight\decentralized-file-storage-tracker\contracts\
 New files added to this directory will not be compressed.

     7521 :      7521 = 1.0 to 1   FileStorageTracker.compact

 Listing C:\Users\shubh\Desktop\Midnight\decentralized-file-storage-tracker\
 New files added to this directory will not be compressed.

 Listing C:\Users\shubh\Desktop\Midnight\decentralized-file-storage-tracker\contracts\
 New files added to this directory will not be compressed.

        0 :         0 = 1.0 to 1   managed

Of 2 files within 4 directories
0 are compressed and 2 are not compressed.
7,521 total bytes of data are stored in 7,521 bytes.
The compression ratio is 1.0 to 1.
```
</details>

<br />

<div align="center">
  <img src="docs/images/contract_deployment.png" alt="Contract Deployment" width="600" />
  <p><em>Smart Contract deployed on Midnight Preprod Testnet.</em></p>
</div>

---

## ⚙️ Full-Stack Integration Architecture

Our application integrates a modern Web3 stack to interact seamlessly with the Midnight Network:

1. 💻 **Frontend UI (React/Vite):** Connects directly to compatible Web3 wallets. Using the Midnight DApp capabilities, it requests permissions, handles authentication, and allows users to manage their state locally in the browser.
2. 🖧 **Backend/API (Node/TypeScript):** Scripts inside the `src/` directory (like `network.ts`, `deploy.ts`, and `wallet.ts`) provide the core logic for deploying the contract, interacting with the indexer, and connecting the blockchain state to the frontend application flow. 
3. 🔐 **Smart Contract Integration:** The frontend utilizes the compiled `.compact` artifacts to generate Zero-Knowledge proofs *locally*. These proofs are then packaged and submitted to the Midnight network via the user's connected wallet, maintaining strict privacy.

---

## 💻 Setup & Local Development Instructions

### 1️⃣ Prerequisites
- Node.js (v18 or higher)
- Package manager (npm, pnpm, or yarn)
- Midnight-compatible Web3 wallet extension set to the Midnight Testnet

### 2️⃣ Installation
Navigate into the application folder and install all dependencies:
```bash
git clone https://github.com/shivammpatil2007-star/Midnight-SPPU.git
cd Midnight-SPPU/decentralized-file-storage-tracker
npm install
cd frontend && npm install
```

### 3️⃣ Compile the Contract
Ensure the `managed/` directory is generated containing the compiled circuits:
```bash
npm run compile
```

### 4️⃣ Environment Setup
Create a `.env` file in the `frontend/` directory with the following variables:
```bash
VITE_NETWORK=preprod
VITE_CONTRACT_ADDRESS=02e888eadf79a7e940a537363568b52a4ab9c783b8d0c5769404d37232ee9193
VITE_INDEXER_URL=https://indexer.preprod.midnight.network
VITE_IPFS_GATEWAY=https://ipfs.io/ipfs/
VITE_IPFS_API_URL=https://api.pinata.cloud/pinning/pinFileToIPFS
```

### 5️⃣ Running the Application
Start the local development server:
```bash
npm run frontend:dev
```

---

<div align="center">
  <p>Built with ❤️ by <b>Shivam Patil</b> for the Midnight Network</p>
  <p>
    <a href="https://github.com/shivammpatil2007-star">GitHub Profile</a> | 
    <a href="mailto:shivammpatil2007@gmail.com">shivammpatil2007@gmail.com</a>
  </p>
</div>
