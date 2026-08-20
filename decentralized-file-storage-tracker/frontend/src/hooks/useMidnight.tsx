import React, { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";
import type { WalletState, Network, FileRecord, ZKAccessPass } from "../types";

declare global {
  interface Window {
    midnight?: {
      [key: string]: WalletProvider;
    };
  }
}

interface WalletProvider {
  connect?(): Promise<Wallet>;
  enable?(): Promise<Wallet>;
  disconnect?(): Promise<void>;
  getAddress(): Promise<string>;
  getNetworkId(): Promise<string>;
  getBalance(): Promise<bigint>;
  on(event: "networkChange" | "accountChange" | "disconnect", handler: (data: any) => void): void;
  off(event: string, handler: (data: any) => void): void;
}

interface Wallet {
  getAddress(): Promise<string>;
  getNetworkId(): Promise<string>;
  getBalance(): Promise<bigint>;
  signTx(tx: any): Promise<any>;
  submitTx(tx: any): Promise<string>;
  disconnect(): Promise<void>;
}

const STORAGE_KEY = "midnight_file_tracker_records";
const WALLET_KEY = "midnight_wallet_connected";

const MOCK_INITIAL_FILES: FileRecord[] = [
  {
    cid: "bafybeic9x8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0",
    fileName: "Midnight_Architecture_Whitepaper.pdf",
    owner: "mn1q9x2v8k4y7p0m3w5z6l1a8c9e2f4r6t8u0i",
    timestamp: Math.floor(Date.now() / 1000) - 86400 * 2,
    size: 4852910,
    mimeType: "application/pdf",
    version: 1,
    contentHashCommitment: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    privacyMode: "shielded",
    storageProvider: "IPFS",
    isEncrypted: true,
    encryptionKeyHint: "AES-GCM 256-bit",
    tags: ["whitepaper", "midnight-protocol", "zk-snarks"],
    zkCommitment: "0xzk_f12a34b567c890d1e23f456a789b01c2",
    textContent: "Midnight Protocol Architecture: Zero-knowledge data protection for smart contracts using Compact and zk-SNARK proof systems.",
  },
  {
    cid: "bafybeif4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5",
    fileName: "Security_Audit_Report_2026.docx",
    owner: "mn1q9x2v8k4y7p0m3w5z6l1a8c9e2f4r6t8u0i",
    timestamp: Math.floor(Date.now() / 1000) - 86400 * 5,
    size: 1245900,
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    version: 2,
    contentHashCommitment: "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e",
    privacyMode: "shielded",
    storageProvider: "Arweave",
    isEncrypted: true,
    encryptionKeyHint: "AES-GCM (Passphrase: audit2026)",
    tags: ["audit", "security", "confidential"],
    zkCommitment: "0xzk_d90e1f2a3b4c5d6e7f8a9b0c1d2e3f4a",
  },
  {
    cid: "bafybeig0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9",
    fileName: "FileStorageTracker.compact",
    owner: "mn1q9x2v8k4y7p0m3w5z6l1a8c9e2f4r6t8u0i",
    timestamp: Math.floor(Date.now() / 1000) - 86400 * 10,
    size: 34500,
    mimeType: "text/plain",
    version: 1,
    contentHashCommitment: "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae",
    privacyMode: "public",
    storageProvider: "IPFS",
    isEncrypted: false,
    tags: ["compact", "smart-contract", "open-source"],
    zkCommitment: "0xzk_1234567890abcdef1234567890abcdef",
    textContent: "include \"ShieldedState\"; export ledger public_file_count: Uint<64>; circuit register_public_file() { ... }",
  },
];

const MidnightContext = createContext<ReturnType<typeof useMidnightInternal> | null>(null);

export function MidnightProvider({ children }: { children: React.ReactNode }) {
  const value = useMidnightInternal();
  return <MidnightContext.Provider value={value}>{children}</MidnightContext.Provider>;
}

export function useMidnight() {
  const context = useContext(MidnightContext);
  if (!context) throw new Error("useMidnight must be used within MidnightProvider");
  return context;
}

function useMidnightInternal(defaultNetwork: Network = "preview") {
  const [walletState, setWalletState] = useState<WalletState>(() => {
    const savedConnected = typeof window !== "undefined" && localStorage.getItem(WALLET_KEY) === "true";
    if (savedConnected) {
      return {
        connected: true,
        address: "mn1q9x2v8k4y7p0m3w5z6l1a8c9e2f4r6t8u0i",
        shieldedAddress: "mn_shielded_88a91c2b3d4e5f6g7h8i9j0k1l2m3n4o5p",
        network: defaultNetwork,
        balance: BigInt(12450750000),
        error: null,
      };
    }
    return {
      connected: false,
      address: null,
      shieldedAddress: null,
      network: null,
      balance: null,
      error: null,
    };
  });

  const [files, setFiles] = useState<FileRecord[]>(() => {
    if (typeof window === "undefined") return MOCK_INITIAL_FILES;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return MOCK_INITIAL_FILES;
      }
    }
    return MOCK_INITIAL_FILES;
  });

  const [accessPasses, setAccessPasses] = useState<ZKAccessPass[]>([]);
  const [provider, setProvider] = useState<WalletProvider | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const networkRef = useRef<Network>(defaultNetwork);
  const listenersRef = useRef<(() => void)[]>([]);

  // Persist files to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
    }
  }, [files]);

  // Discover wallet providers
  const discoverWallets = useCallback((): WalletProvider[] => {
    if (typeof window === "undefined") return [];
    const midnight = window.midnight;
    if (!midnight) return [];
    
    // Some wallets might inject directly at window.midnight
    const providers = [];
    if (typeof (midnight as any).enable === "function" || typeof (midnight as any).connect === "function") {
      providers.push(midnight as unknown as WalletProvider);
    }
    
    // Others inject under a namespace like window.midnight.mnLace
    const nestedProviders = Object.values(midnight).filter((w): w is WalletProvider => 
      w && (typeof (w as any).connect === "function" || typeof (w as any).enable === "function")
    );
    
    return [...providers, ...nestedProviders];
  }, []);

  // Connect to wallet (requires native extension)
  const connect = useCallback(async (network: Network = defaultNetwork) => {
    const providers = discoverWallets();
    
    if (providers.length === 0) {
      // Demo/Simulated Wallet Connection that requires MANUAL permission (for demo videos)
      const approved = window.confirm("Midnight Lace (Simulated Wallet)\n\nAllow decentralized-file-storage-tracker to connect to your wallet?");
      if (!approved) {
        setWalletState(prev => ({ 
          ...prev, 
          error: "Wallet connection request rejected by user." 
        }));
        return false;
      }

      setWalletState({
        connected: true,
        address: "mn1q9x2v8k4y7p0m3w5z6l1a8c9e2f4r6t8u0i",
        shieldedAddress: "mn_shielded_88a91c2b3d4e5f6g7h8i9j0k1l2m3n4o5p",
        network,
        balance: BigInt(12450750000),
        error: null,
      });
      localStorage.setItem(WALLET_KEY, "true");
      return true;
    }

    const selectedProvider = providers[0];
    setProvider(selectedProvider);
    try {
      setWalletState(prev => ({ ...prev, error: null, network }));
      networkRef.current = network;

      // Invoke the native authorization method to trigger the browser extension pop-up
      const connectedWallet = selectedProvider.connect 
        ? await selectedProvider.connect() 
        : await selectedProvider.enable!();
      setWallet(connectedWallet);

      const address = connectedWallet.getAddress ? await connectedWallet.getAddress() : "mn1q9x2v8k4y7p0m3w5z6l1a8c9e2f4r6t8u0i";
      const balance = connectedWallet.getBalance ? await connectedWallet.getBalance() : BigInt(0);

      setWalletState({
        connected: true,
        address,
        shieldedAddress: `mn_shielded_${address.substring(0, 10)}`,
        network,
        balance,
        error: null,
      });

      localStorage.setItem(WALLET_KEY, "true");
      return true;
    } catch (error) {
      console.warn("Wallet extension connect failed or rejected:", error);
      setWalletState(prev => ({ 
        ...prev, 
        error: "Wallet connection request rejected by user." 
      }));
      return false;
    }
  }, [discoverWallets, defaultNetwork]);

  // Disconnect wallet
  const disconnect = useCallback(async () => {
    if (wallet) {
      try {
        await wallet.disconnect();
      } catch (error) {
        console.error("Error disconnecting wallet:", error);
      }
    }
    
    listenersRef.current.forEach(off => off());
    listenersRef.current = [];

    setWalletState({
      connected: false,
      address: null,
      shieldedAddress: null,
      network: null,
      balance: null,
      error: null,
    });
    setWallet(null);
    setProvider(null);
    localStorage.removeItem(WALLET_KEY);
  }, [wallet]);

  // Switch network
  const switchNetwork = useCallback(async (network: Network) => {
    if (walletState.connected) {
      await disconnect();
    }
    return connect(network);
  }, [walletState.connected, connect, disconnect]);

  // Clear error
  const clearError = useCallback(() => {
    setWalletState(prev => ({ ...prev, error: null }));
  }, []);

  // Register new file record
  const registerFileRecord = useCallback((newRecord: FileRecord) => {
    setFiles(prev => [newRecord, ...prev]);
  }, []);

  // Issue ZK Access Pass
  const issueZKPass = useCallback((pass: ZKAccessPass) => {
    setAccessPasses(prev => [pass, ...prev]);
  }, []);

  return {
    ...walletState,
    wallet,
    provider,
    files,
    accessPasses,
    connect,
    disconnect,
    switchNetwork,
    clearError,
    registerFileRecord,
    issueZKPass,
    discoverWallets,
    network: networkRef.current,
  };
}