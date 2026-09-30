import { AuditLogEntry, HashVerificationResult } from '../types/audit';

/**
 * Computes SHA-256 hash using native Web Crypto API
 */
export async function computeSha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Constructs canonical string and hashes an audit block
 */
export async function computeAuditBlockHash(
  index: number,
  prevHash: string,
  timestamp: string,
  actorId: string,
  entityId: string,
  action: string,
  module: string,
  description: string,
  payloadString: string
): Promise<string> {
  const canonicalData = [
    index,
    prevHash,
    timestamp,
    actorId,
    entityId,
    action,
    module,
    description,
    payloadString
  ].join('||');
  return computeSha256(canonicalData);
}

/**
 * Verifies the entire cryptographic hash chain of the Audit Vault.
 * Detects if any record was modified, added, removed, or has a broken previous hash.
 */
export async function verifyAuditChain(entries: AuditLogEntry[]): Promise<HashVerificationResult> {
  if (!entries || entries.length === 0) {
    return {
      valid: true,
      totalBlocks: 0,
      verifiedAt: new Date().toISOString()
    };
  }

  // Genesis block must point to 64 zeros or predefined genesis hash
  let expectedPrevHash = '0000000000000000000000000000000000000000000000000000000000000000';

  for (let i = 0; i < entries.length; i++) {
    const block = entries[i];

    // Check index sequencing
    if (block.index !== i) {
      return {
        valid: false,
        totalBlocks: entries.length,
        compromisedIndex: i,
        reason: `Index mismatch at block #${i}. Found index ${block.index}.`,
        verifiedAt: new Date().toISOString()
      };
    }

    // Check prevHash match
    if (i > 0 && block.prevHash !== expectedPrevHash) {
      return {
        valid: false,
        totalBlocks: entries.length,
        compromisedIndex: i,
        reason: `Broken chain link at block #${i}. prevHash does not match hash of block #${i - 1}.`,
        verifiedAt: new Date().toISOString()
      };
    }

    // Recompute block hash
    const payloadStr = JSON.stringify({
      before: block.beforeState || null,
      after: block.afterState || null
    });

    const calculatedHash = await computeAuditBlockHash(
      block.index,
      block.prevHash,
      block.timestamp,
      block.actorId,
      block.entityId,
      block.action,
      block.module,
      block.description,
      payloadStr
    );

    if (calculatedHash !== block.hash) {
      return {
        valid: false,
        totalBlocks: entries.length,
        compromisedIndex: i,
        reason: `Cryptographic tamper detected at block #${i}! Stored hash (${block.hash.slice(0, 10)}...) does not match recomputed hash (${calculatedHash.slice(0, 10)}...).`,
        verifiedAt: new Date().toISOString()
      };
    }

    expectedPrevHash = block.hash;
  }

  return {
    valid: true,
    totalBlocks: entries.length,
    verifiedAt: new Date().toISOString()
  };
}
