/**
 * Cleans the transaction hash to ensure it contains no quotes or whitespace.
 */
export function cleanTxHash(rawTxHash: string): string {
  if (!rawTxHash) return '';
  return String(rawTxHash).trim().replace(/^"|"$/g, '');
}

/**
 * Returns a verifiable Cardanoscan explorer URL dynamically based on the network.
 */
export function getExplorerUrl(network: string | null | undefined, txHash: string): string {
  const cleanHash = cleanTxHash(txHash);
  if (!cleanHash) return '';

  if (network === 'testnet') {
    return `https://preprod.cardanoscan.io/transaction/${cleanHash}`;
  }
  if (network === 'mainnet') {
    return `https://cardanoscan.io/transaction/${cleanHash}`;
  }
  // Default to Preview
  return `https://preview.cardanoscan.io/transaction/${cleanHash}`;
}

/**
 * Returns a Midnight Network explorer URL (when available).
 */
export function getMidnightExplorerUrl(network: string | null | undefined, txHash: string): string {
  const cleanHash = cleanTxHash(txHash);
  if (!cleanHash) return '';
  const net = network || 'preview';
  return `https://explorer.${net}.midnight.network/tx/${cleanHash}`;
}

/**
 * Truncates a long transaction hash for UI display (e.g. 0a1b2c...7890)
 */
export function formatTxHash(txHash: string, startChars = 6, endChars = 6): string {
  const cleanHash = cleanTxHash(txHash);
  if (!cleanHash) return '';
  if (cleanHash.length <= startChars + endChars) return cleanHash;
  return `${cleanHash.substring(0, startChars)}...${cleanHash.substring(cleanHash.length - endChars)}`;
}
