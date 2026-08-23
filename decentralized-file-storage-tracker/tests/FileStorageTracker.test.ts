import { describe, it, expect, beforeEach } from 'vitest';
import { createHash } from 'crypto';
import { Contract as FileStorageTrackerContract } from '../contracts/managed/FileStorageTracker/contract.js';

function sha256(data: Uint8Array | string): Uint8Array {
  const hash = createHash('sha256');
  hash.update(data);
  return new Uint8Array(hash.digest());
}

function padOrTruncate(arr: Uint8Array, length: number): Uint8Array {
  const result = new Uint8Array(length);
  result.set(arr.subarray(0, length));
  return result;
}

function encodeString(str: string, length: number): Uint8Array {
  const bytes = new TextEncoder().encode(str);
  return padOrTruncate(bytes, length);
}

describe('FileStorageTracker Contract', () => {
  let contract: any;
  let initialContext: any;

  beforeEach(() => {
    contract = new FileStorageTrackerContract({
      init_state: () => ({
        files: new Map(),
        total_files: 0n,
      }),
    });

    const state = contract.initialState({});
    initialContext = {
      state,
      originalCaller: encodeString('owner-address-1234567890123456789012', 32),
    };
  });

  it('1. Contract Initialization - starts with empty file ledger', () => {
    expect(initialContext.state.total_files).toBe(0n);
    expect(initialContext.state.files.size).toBe(0);
  });

  it('2. File Registration - registers file with public CID and private content hash commitment', async () => {
    const cidStr = 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco';
    const cid = encodeString(cidStr, 46);
    const size = 1024n;
    const mimeType = encodeString('application/pdf', 64);

    // Private witness: raw file content hash
    const rawFileContent = new TextEncoder().encode('Sample top-secret document content for testing');
    const privateContentHash = sha256(rawFileContent);

    // Public commitment: HASH(privateContentHash)
    const publicHashCommitment = sha256(privateContentHash);

    const { context } = await contract.circuits.register_file(
      initialContext,
      cid,
      size,
      mimeType,
      publicHashCommitment,
      privateContentHash
    );

    expect(context.state.total_files).toBe(1n);

    // Retrieve file record
    const getResult = await contract.circuits.get_file(context, cid);
    const fileRecord = getResult.result;

    expect(fileRecord.size).toBe(size);
    expect(fileRecord.version).toBe(1n);
    expect(fileRecord.content_hash_commitment).toEqual(publicHashCommitment);
  });

  it('3. ZK Ownership Verification - proves file possession without revealing file content', async () => {
    const cidStr = 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG';
    const cid = encodeString(cidStr, 46);
    const rawContentStr = 'Confidential financial audit report content';
    const rawContentBytes = new TextEncoder().encode(rawContentStr);
    const paddedContent = padOrTruncate(rawContentBytes, 1024);
    const contentLength = BigInt(rawContentBytes.length);

    const privateContentHash = sha256(rawContentBytes);
    const publicHashCommitment = sha256(privateContentHash);

    // 1. Register the file
    const { context: regContext } = await contract.circuits.register_file(
      initialContext,
      cid,
      2048n,
      encodeString('text/plain', 64),
      publicHashCommitment,
      privateContentHash
    );

    // 2. Verify ownership with private content witness
    const verifyResult = await contract.circuits.verify_ownership(
      regContext,
      cid,
      paddedContent,
      contentLength
    );

    expect(verifyResult.result).toBe(true);
  });

  it('4. Metadata & Version Update - updates file version when CID or content changes', async () => {
    const oldCid = encodeString('QmOldCID11111111111111111111111111111111111111', 46);
    const newCid = encodeString('QmNewCID22222222222222222222222222222222222222', 46);

    const oldHash = sha256('v1-content');
    const oldCommitment = sha256(oldHash);

    const newHash = sha256('v2-content');
    const newCommitment = sha256(newHash);

    // Register v1
    const { context: v1Context } = await contract.circuits.register_file(
      initialContext,
      oldCid,
      500n,
      encodeString('image/png', 64),
      oldCommitment,
      oldHash
    );

    // Update to v2
    const { context: v2Context } = await contract.circuits.update_file(
      v1Context,
      oldCid,
      newCid,
      1200n,
      encodeString('image/png', 64),
      newCommitment,
      newHash
    );

    const getResult = await contract.circuits.get_file(v2Context, newCid);
    expect(getResult.result.version).toBe(2n);
    expect(getResult.result.size).toBe(1200n);
  });

  it('5. Privacy Witness Isolation - confirms private witness inputs are not stored in public ledger state', async () => {
    const cid = encodeString('QmPrivacyTestCid11111111111111111111111111111', 46);
    const secretPrivateContent = 'SUPER_SECRET_WITNESS_CONTENT_DO_NOT_EXPOSE';
    const secretContentBytes = new TextEncoder().encode(secretPrivateContent);
    const privateHash = sha256(secretContentBytes);
    const commitment = sha256(privateHash);

    const { context } = await contract.circuits.register_file(
      initialContext,
      cid,
      100n,
      encodeString('text/plain', 64),
      commitment,
      privateHash
    );

    const fileRecord = (await contract.circuits.get_file(context, cid)).result;

    // Verify public ledger contains commitment, but NEVER contains the private content or uncommitted hash
    const recordString = JSON.stringify(fileRecord, (_, v) => (typeof v === 'bigint' ? v.toString() : v));
    expect(recordString).not.toContain(secretPrivateContent);
    expect(fileRecord.content_hash_commitment).not.toEqual(privateHash);
  });
});
// Level 3: Vitest automated test suite for Midnight File Storage Tracker
