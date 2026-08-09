import { Wallet } from "@midnight-ntwrk/wallet-api";
import { NetworkId } from "@midnight-ntwrk/midnight-js-types";
import { getNetworkConfig, validateNetwork, createContractClient } from "./network.js";
import { FileStorageTracker } from "../contracts/managed/FileStorageTracker/contract.js";
import { deployContract } from "@midnight-ntwrk/midnight-js-contracts";

export interface DeployResult {
  contractAddress: string;
  transactionHash: string;
  network: "preview" | "testnet" | "mainnet" | "local";
}

export async function deployContractToNetwork(
  networkName: string,
  wallet: Wallet,
  initialState?: any
): Promise<DeployResult> {
  const network = validateNetwork(networkName);
  const config = getNetworkConfig(network);
  
  console.log(`Deploying to ${network} network...`);
  console.log(`Node: ${config.nodeUrl}`);
  
  // Create client for deployment
  const client = await createContractClient(network, wallet);
  
  // Get the contract constructor
  const contract = new FileStorageTracker(client);
  
  // Deploy the contract
  console.log("Deploying contract...");
  const deployResult = await deployContract(contract, {
    // Initial state if needed
  });
  
  const contractAddress = deployResult.contractAddress;
  const transactionHash = deployResult.transactionHash;
  
  console.log(`✅ Contract deployed successfully!`);
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`Transaction Hash: ${transactionHash}`);
  console.log(`Network: ${network}`);
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    transactionHash,
    network,
    timestamp: new Date().toISOString(),
    nodeUrl: config.nodeUrl,
    indexerUrl: config.indexerUrl,
  };
  
  return deploymentInfo;
}

export async function verifyDeployment(
  networkName: string,
  wallet: Wallet,
  contractAddress: string
): Promise<boolean> {
  const network = validateNetwork(networkName);
  
  try {
    const client = await createContractClient(network, wallet, contractAddress);
    const contract = new FileStorageTracker(client);
    
    // Try to call a read-only circuit to verify contract is accessible
    // get_my_files is a good test as it doesn't modify state
    await contract.get_my_files();
    
    console.log(`✅ Contract verified at ${contractAddress}`);
    return true;
  } catch (error) {
    console.error(`❌ Contract verification failed:`, error);
    return false;
  }
}

export function printDeploymentSummary(result: DeployResult): void {
  console.log("\n" + "=".repeat(60));
  console.log("📋 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log(`Network:        ${result.network}`);
  console.log(`Contract ID:    ${result.contractAddress}`);
  console.log(`Tx Hash:        ${result.transactionHash}`);
  console.log("=".repeat(60));
  console.log("\n📝 NEXT STEPS:");
  console.log("1. Save the Contract ID to your .env.local:");
  console.log(`   VITE_CONTRACT_ADDRESS=${result.contractAddress}`);
  console.log("2. Update frontend/.env.local with the same value");
  console.log("3. Run frontend: npm run frontend:dev");
  console.log("=".repeat(60));
}
