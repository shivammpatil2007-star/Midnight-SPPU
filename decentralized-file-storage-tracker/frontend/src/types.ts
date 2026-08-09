export interface FileRecord {
  cid: string;
  fileName?: string;
  owner: string;
  timestamp: number;
  size: number;
  mimeType: string;
  version: number;
  contentHashCommitment: string;
  privacyMode?: PrivacyMode;
  storageProvider?: StorageProvider;
  isEncrypted?: boolean;
  encryptionKeyHint?: string;
  tags?: string[];
  textContent?: string;
  zkCommitment?: string;
}

export type PrivacyMode = 'public' | 'shielded';

export type StorageProvider = 'IPFS' | 'Arweave' | 'Filecoin';

export interface NetworkConfig {
  nodeUrl: string;
  indexerUrl: string;
  proofServerUrl: string;
  networkId: string;
  faucetUrl: string;
}

export type Network = "preview" | "testnet" | "mainnet" | "local";

export interface ZKAccessPass {
  id: string;
  cid: string;
  fileName: string;
  granteeAddress: string;
  grantorAddress: string;
  issuedAt: number;
  expiresAt: number;
  oneTimeUse: boolean;
  zkProofHash: string;
  isUsed: boolean;
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  shieldedAddress?: string | null;
  network: Network | null;
  balance: bigint | null;
  error: string | null;
}

export interface TransactionState {
  loading: boolean;
  txHash: string | null;
  error: string | null;
}

export interface UploadState {
  file: File | null;
  cid: string | null;
  uploading: boolean;
  progress: number;
  error: string | null;
}

export interface VerificationResult {
  success: boolean;
  cid: string;
  message: string;
}

export interface StorageStats {
  totalFiles: number;
  totalSizeBytes: number;
  publicFilesCount: number;
  shieldedFilesCount: number;
  activeZkKeys: number;
  ipfsPinnedCount: number;
}

export const NETWORK_CONFIGS: Record<Network, NetworkConfig> = {
  preview: {
    nodeUrl: "wss://node.preview.midnight.network:9944",
    indexerUrl: "https://indexer.preview.midnight.network",
    proofServerUrl: "https://proof-server.preview.midnight.network:6300",
    networkId: "TestNet",
    faucetUrl: "https://faucet.preview.midnight.network",
  },
  testnet: {
    nodeUrl: "wss://node.testnet.midnight.network:9944",
    indexerUrl: "https://indexer.testnet.midnight.network",
    proofServerUrl: "https://proof-server.testnet.midnight.network:6300",
    networkId: "TestNet",
    faucetUrl: "https://faucet.testnet.midnight.network",
  },
  mainnet: {
    nodeUrl: "wss://node.mainnet.midnight.network:9944",
    indexerUrl: "https://indexer.mainnet.midnight.network",
    proofServerUrl: "https://proof-server.mainnet.midnight.network:6300",
    networkId: "MainNet",
    faucetUrl: "",
  },
  local: {
    nodeUrl: "ws://localhost:9944",
    indexerUrl: "http://localhost:8088",
    proofServerUrl: "http://localhost:6300",
    networkId: "TestNet",
    faucetUrl: "",
  },
};

export function getNetworkConfig(network: Network): NetworkConfig {
  return NETWORK_CONFIGS[network];
}

export function formatAddress(address: string): string {
  if (!address || address.length <= 10) return address || "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
}

export function cidToBytes(cid: string): Uint8Array {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(cid);
  const result = new Uint8Array(46);
  result.set(bytes.slice(0, 46));
  return result;
}

export function bytesToCid(bytes: Uint8Array): string {
  const decoder = new TextDecoder();
  const str = decoder.decode(bytes);
  return str.replace(/\0/g, "");
}

export function stringToBytes32(str: string): Uint8Array {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  const result = new Uint8Array(32);
  result.set(bytes.slice(0, 32));
  return result;
}

export function mimeTypeToBytes(mimeType: string): Uint8Array {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(mimeType);
  const result = new Uint8Array(64);
  result.set(bytes.slice(0, 64));
  return result;
}