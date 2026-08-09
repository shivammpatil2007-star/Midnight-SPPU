import { useState } from "react";
import { useMidnight } from "../hooks/useMidnight";
import type { Network } from "../types";
import "./WalletConnect.css";

export function WalletConnect() {
  const { connected, address, network, balance, error, connect, disconnect, switchNetwork, clearError, discoverWallets } = useMidnight();
  const [connecting, setConnecting] = useState(false);

  const networks: { id: Network; name: string; color: string }[] = [
    { id: "preview", name: "Preview", color: "#00d4aa" },
    { id: "testnet", name: "Testnet", color: "#ffd93d" },
    { id: "mainnet", name: "Mainnet", color: "#ff6b6b" },
    { id: "local", name: "Local", color: "#888899" },
  ];

  const handleConnect = async () => {
    setConnecting(true);
    clearError();
    await connect(network || "preview");
    setConnecting(false);
  };

  const handleSwitchNetwork = async (newNetwork: Network) => {
    if (newNetwork === network) return;
    await switchNetwork(newNetwork);
  };

  const formatBalance = (balance: bigint | null) => {
    if (!balance) return "0 DUST";
    const dust = Number(balance) / 1_000_000;
    return `${dust.toFixed(2)} DUST`;
  };

  const formatAddress = (addr: string) => {
    if (!addr || addr.length <= 10) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="wallet-connect">
      {error && (
        <div className="wallet-error" role="alert">
          <span>{error}</span>
          <button onClick={clearError} aria-label="Dismiss error">×</button>
        </div>
      )}

      {!connected ? (
        <div className="wallet-disconnected">
          <div className="wallet-icon">🔐</div>
          <h3>Connect Wallet</h3>
          <p>Connect your Midnight wallet to access the File Storage Tracker</p>
          
          <div className="network-selector">
            <label htmlFor="network-select">Network:</label>
            <select
              id="network-select"
              value={network || "preview"}
              onChange={() => { /* network is set via switchNetwork */ }}
              disabled={connecting}
            >
              {networks.map(n => (
                <option key={n.id} value={n.id}>{n.name}</option>
              ))}
            </select>
          </div>

          <button
            className="btn btn-primary btn-connect"
            onClick={handleConnect}
            disabled={connecting}
          >
            {connecting ? (
              <>
                <span className="spinner"></span>
                Connecting...
              </>
            ) : (
              "Connect Wallet"
            )}
          </button>

          {discoverWallets().length === 0 && (
            <p className="wallet-hint">
              No wallet detected. Install <a href="https://midnight.network/wallet" target="_blank" rel="noopener noreferrer">Midnight Lace</a> or a compatible wallet.
            </p>
          )}
        </div>
      ) : (
        <div className="wallet-connected">
          <div className="wallet-header">
            <div className="wallet-avatar">
              <span>{address ? address.slice(2, 4).toUpperCase() : "?"}</span>
            </div>
            <div className="wallet-info">
              <div className="wallet-address">{formatAddress(address || "")}</div>
              <div className="wallet-balance">{formatBalance(balance)}</div>
            </div>
          </div>

          <div className="network-badge" style={{ borderColor: networks.find(n => n.id === network)?.color }}>
            <span className="network-dot" style={{ backgroundColor: networks.find(n => n.id === network)?.color }}></span>
            {networks.find(n => n.id === network)?.name}
          </div>

          <div className="wallet-actions">
            <button
              className="btn btn-secondary"
              onClick={() => handleSwitchNetwork(network === "preview" ? "testnet" : "preview")}
            >
              Switch Network
            </button>
            <button
              className="btn btn-danger"
              onClick={disconnect}
            >
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}