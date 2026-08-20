import { NetworkId } from "@midnight-ntwrk/midnight-js-types";
import { createMidnightClient } from "@midnight-ntwrk/midnight-js-contracts";
import { Wallet } from "@midnight-ntwrk/wallet-api";
import { FileStorageTracker } from "../contracts/managed/FileStorageTracker/contract.js";

export type MidnightNetwork = "preview" | "testnet" | "mainnet" | "local";

export const NETWORK_CONFIG: Record<MidnightNetwork, {
  nodeUrl: string;
  indexerUrl: string;
  proofServerUrl: string;
  networkId: NetworkId;
  faucetUrl: string;
}> = {
  preview: {
    nodeUrl: "wss://node.preview.midnight.network:9944",
    indexerUrl: "https://indexer.preview.midnight.network",
    proofServerUrl: "https://proof-server.preview.midnight.network:6300",
    networkId: NetworkId.TestNet,
    faucetUrl: "https://faucet.preview.midnight.network",
  },
  testnet: {
    nodeUrl: "wss://node.preprod.midnight.network:9944",
    indexerUrl: "https://indexer.preprod.midnight.network",
    proofServerUrl: "https://proof-server.preprod.midnight.network:6300",
    networkId: NetworkId.TestNet,
    faucetUrl: "https://faucet.preprod.midnight.network",
  },
  mainnet: {
    nodeUrl: "wss://node.mainnet.midnight.network:9944",
    indexerUrl: "https://indexer.mainnet.midnight.network",
    proofServerUrl: "https://proof-server.mainnet.midnight.network:6300",
    networkId: NetworkId.MainNet,
    faucetUrl: "",
  },
  local: {
    nodeUrl: "ws://localhost:9944",
    indexerUrl: "http://localhost:8088",
    proofServerUrl: "http://localhost:6300",
    networkId: NetworkId.TestNet,
    faucetUrl: "",
  },
};

export function getNetworkConfig(network: MidnightNetwork) {
  return NETWORK_CONFIG[network];
}

export async function createContractClient(
  network: MidnightNetwork,
  wallet: Wallet,
  contractAddress?: string
) {
  const config = getNetworkConfig(network);
  
  const client = await createMidnightClient({
    networkId: config.networkId,
    nodeUrl: config.nodeUrl,
    indexerUrl: config.indexerUrl,
    proofServerUrl: config.proofServerUrl,
    wallet,
    contractAddress,
  });
  
  return client;
}

export function validateNetwork(network: string): MidnightNetwork {
  const validNetworks: MidnightNetwork[] = ["preview", "testnet", "mainnet", "local"];
  if (validNetworks.includes(network as MidnightNetwork)) {
    return network as MidnightNetwork;
  }
  throw new Error(`Invalid network: ${network}. Must be one of: ${validNetworks.join(", ")}`);
}
