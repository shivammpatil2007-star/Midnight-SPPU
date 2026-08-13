# Decentralized File Storage Tracker

Upload files to IPFS and store their content hashes along with ownership metadata on the blockchain. Allow users to prove file ownership and integrity at any time by comparing the current file hash to the recorded one.

## Project Vision
The Decentralized File Storage Tracker solves a fundamental problem in digital asset management: proving you own a file without revealing its contents. Traditional solutions require either trusting a centralized authority or exposing the file itself to prove ownership. This project leverages Midnight's privacy-first network so that an on-chain observer only sees the public file CID and your ownership timestamp, but your actual file content and cryptographic hash remain completely private as zero-knowledge witnesses.

## Smart Contract Deployment
- **Network:** Preview
- **Deployed contract ID:** `02007f34a19b88219c6e5896a7985392d4715f212984578e9079fdfd7515a4e5`

> ✅ **Contract Status:** Compiled and deployed to the Midnight Preview testnet. Circuit artifacts are included under `contracts/managed/FileStorageTracker/`.

## Key Features
- **IPFS Integration**: Files stored on IPFS with content-addressed CIDs
- **On-Chain Registry**: File metadata (CID, owner, timestamp, size) stored publicly on the ledger
- **Zero-Knowledge Ownership Proof**: The private content hash (SHA-256) is committed on-chain but never revealed. Users prove file possession without exposing content.
- **Privacy-First UI**: "Proved without revealing your input" labels visually guarantee that your data is safe.

## Future Scope
- Multi-file batches for registering multiple files in a single ZK transaction.
- Encrypted file sharing with granular access control via Midnight passes.
- Mainnet deployment and mobile wallet support via Midnight Lace mobile.

## Tech Stack
- **Smart Contract**: Compact
- **Blockchain**: Midnight Network (Preview testnet)
- **Frontend**: React 18 + TypeScript + Vite
- **Wallet**: Midnight DApp Connector (window.midnight API)

## Local Development

### 1. Compile and Deploy (Requires WSL or Linux)
Because Windows intercepts the `compact` command, run these inside WSL:
```bash
npm run compile
npm run deploy -- --network preview
```
*Note: Ensure your Midnight Lace wallet has testnet DUST from the faucet before deploying.*

### 2. Configure Frontend
Copy the deployed contract address from the previous step and add it to `frontend/.env.local`:
```env
VITE_NETWORK=preview
VITE_CONTRACT_ADDRESS=<your_deployed_contract_address_here>
VITE_INDEXER_URL=https://indexer.preview.midnight.network
```

### 3. Run the Frontend
Switch the frontend to use the real integration logic (by replacing the mock code in `useMidnight.ts` with the code provided in `useMidnightReal.ts`), then run:
```bash
npm run frontend:dev
```
