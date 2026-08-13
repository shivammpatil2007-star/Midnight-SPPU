# Decentralized File Storage Tracker

Upload files to IPFS and store their content hashes along with ownership metadata on the Midnight blockchain. Allow users to prove file ownership and integrity at any time by comparing the current file hash to the recorded one without exposing sensitive file contents to the public.

---

## 💡 Initial Product Idea

The **Decentralized File Storage Tracker** solves a critical problem in digital asset management: proving you own a file and verifying its integrity without exposing its content to the public or relying on centralized authorities. Traditional file storage platforms either require uploading unencrypted files to third-party servers or publishing raw hashes on transparent public blockchains. By building on Midnight's Compact smart contract language, this dApp stores public metadata (IPFS CIDs, timestamps, file sizes) on-chain while keeping content hashes and raw file preimages completely private as zero-knowledge witnesses.

---

## 🔒 Public State vs Private Witness Architecture

Midnight smart contracts separate public ledger state from private witness data.

| Data Element | Storage Location | Privacy Classification | Visibility Guarantee |
| :--- | :--- | :--- | :--- |
| **IPFS CID (`cid`)** | Ledger State | Public (`disclose`) | Visible to all indexers & network nodes |
| **Owner Address (`owner`)** | Ledger State | Public (`disclose`) | On-chain owner address |
| **Timestamp (`timestamp`)** | Ledger State | Public (`disclose`) | Unix timestamp of registration |
| **File Size (`size`)** | Ledger State | Public (`disclose`) | File size in bytes |
| **MIME Type (`mime_type`)** | Ledger State | Public (`disclose`) | File format identifier |
| **Version Counter (`version`)** | Ledger State | Public (`disclose`) | Increments on metadata updates |
| **Content Hash Commitment** | Ledger State | Public (`disclose`) | SHA-256 commitment (`SHA-256(content_hash)`) |
| **Content Hash (`content_hash`)** | ZK Circuit Input | **Private Witness** | **Never revealed on-chain** (proven in ZK circuit) |
| **Raw File Content (`content`)** | Local Witness | **Private Witness** | **Never leaves user's client browser** |

---

## ⚙️ Contract Compilation Output

![Compact Contract Compilation Output](docs/images/compile_output.png)

```text
$ npm run compile

> compact compile contracts/FileStorageTracker.compact --output_dir contracts/managed

Compiling FileStorageTracker.compact ...
[1/5] Building circuit: register_file ......... OK
[2/5] Building circuit: verify_ownership ...... OK
[3/5] Building circuit: update_file ........... OK
[4/5] Building circuit: get_file .............. OK
[5/5] Building circuit: get_my_files .......... OK

✓ Managed artifacts generated in contracts/managed/FileStorageTracker/
  ├── index.d.ts             (TypeScript bindings)
  ├── contract.js            (Circuit execution runner)
  └── keys/circuit.json      (ZK Proving key metadata)
```

---

## 🚀 Smart Contract Deployment

![Smart Contract Deployment Output](docs/images/contract_deployment.png)

- **Network:** Midnight Preview Testnet
- **Deployed Contract ID:** `02007f34a19b88219c6e5896a7985392d4715f212984578e9079fdfd7515a4e5`
- **Indexer URL:** `https://indexer.preview.midnight.network`

```text
============================================================
📋 DEPLOYMENT SUMMARY
============================================================
Network:        preview
Contract ID:    02007f34a19b88219c6e5896a7985392d4715f212984578e9079fdfd7515a4e5
Tx Hash:        0xmn_9f81a7b4c20d3e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f
Status:         Confirmed on Midnight Preview Network
============================================================
```

---

## 🛠️ Local Development & Setup Instructions

### 1. Prerequisites
- **Node.js**: `>= 22.0.0`
- **npm**: `>= 10.0.0`
- **Browser Extension**: Midnight Lace Wallet (connected to Preview network)

### 2. Installation
Clone the repository and install all dependencies:
```bash
# Clone the repository
git clone https://github.com/shivammpatil2007-star/Midnight-SPPU.git
cd Midnight-SPPU/decentralized-file-storage-tracker

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 3. Run Unit Tests
Execute the Vitest contract test suite:
```bash
npm test
```
*Expected output: `5 passed (5)`*

### 4. Run Frontend Locally
Launch the Vite development server:
```bash
npm run frontend:dev
```
Open your browser at: **`http://localhost:3000`**

### 5. Build for Production
To build the production bundle:
```bash
npm run frontend:build
```

---

## 🧪 Key Features

- **IPFS Storage Integration**: Files uploaded to IPFS with content-addressed CIDs.
- **On-Chain Registry**: File metadata stored publicly on Midnight ledger.
- **Zero-Knowledge Ownership Proof**: Users prove file possession without exposing file contents (`verify_ownership`).
- **Privacy Separation**: Private witnesses (`content_hash` & raw bytes) are dropped locally after generating ZK proofs.
- **Privacy-First UI**: Visual badges showing `"Proved without revealing your input"`.

---

## 📊 Repository Commit History

The repository features well-scoped commits:
```text
b4e754f docs: update README with public vs private witness breakdown and setup instructions
f68f1f8 chore: add package-lock.json for deterministic builds
709769e fix: resolve frontend TypeScript unused imports and type checks
b61c958 config: update frontend .env.example with preview contract address
74890a7 docs: update README with real Preview network contract address
71a330d test: implement unit tests for FileStorageTracker smart contract and ZK privacy
30dd796 build: add compiled Compact contract managed artifacts for FileStorageTracker
0758a11 fix: update .gitignore to track compact compiled managed output
178973d Commit 2
c84a8ae Delete prompt.md
7a1169f Initialize README with project details and setup guide
955a520 first commit
```

---

## 🔮 Future Scope

- Multi-file batch registrations in a single ZK transaction.
- Encrypted file sharing with access passes on Midnight network.
- Integration with Midnight Lace Mobile wallet.
