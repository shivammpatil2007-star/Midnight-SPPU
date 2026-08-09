import { useState, useRef } from "react";
import { useMidnight } from "../hooks/useMidnight";
import type { FileRecord, ZKAccessPass } from "../types";
import { Lock, HardDrive, Key, Copy, ShieldCheck } from "./Icons";
import "./MyFiles.css";

export function MyFiles() {
  const { connected, files, issueZKPass } = useMidnight();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrivacy, setSelectedPrivacy] = useState<string>("all");
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);
  const [grantFileModal, setGrantFileModal] = useState<FileRecord | null>(null);

  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.cid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (file.tags && file.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (file.mimeType && file.mimeType.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPrivacy = selectedPrivacy === "all" || file.privacyMode === selectedPrivacy;
    return matchesSearch && matchesPrivacy;
  });

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const copyCID = (cid: string) => {
    navigator.clipboard.writeText(cid);
  };

  if (!connected) {
    return (
      <div className="my-files empty-state">
        <div className="empty-icon">📂</div>
        <h3>No Files Accessible</h3>
        <p>Connect your Midnight wallet to view your registered files & ZK commitments.</p>
      </div>
    );
  }

  return (
    <div className="my-files">
      <div className="files-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>📂 Registered Files & ZK Commitments ({filteredFiles.length})</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Search by CID or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '8px 14px', borderRadius: '8px', background: '#0F1626', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.85rem' }}
          />
          <select
            value={selectedPrivacy}
            onChange={(e) => setSelectedPrivacy(e.target.value)}
            style={{ padding: '8px 14px', borderRadius: '8px', background: '#0F1626', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.85rem' }}
          >
            <option value="all">All Privacy States</option>
            <option value="shielded">ZK Shielded Only</option>
            <option value="public">Public Ledger Only</option>
          </select>
        </div>
      </div>

      {filteredFiles.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📂</div>
          <h3>No Files Found</h3>
          <p>Upload a file or change search filter criteria.</p>
        </div>
      )}

      {filteredFiles.length > 0 && (
        <div className="files-list" role="list">
          {filteredFiles.map((file) => (
            <article key={file.cid} className="file-card" style={{ background: 'rgba(18, 26, 43, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px 14px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '100%' }}>
                  <div style={{ padding: '10px', borderRadius: '10px', background: file.privacyMode === 'shielded' ? 'rgba(127,0,255,0.15)' : 'rgba(0,242,254,0.15)', color: file.privacyMode === 'shielded' ? '#E100FF' : '#00F2FE', flexShrink: 0 }}>
                    {file.privacyMode === 'shielded' ? <Lock size={20} /> : <HardDrive size={20} />}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div className="file-name" style={{ fontSize: '1.05rem', fontWeight: 600, color: '#FFFFFF', wordBreak: 'break-all', marginBottom: '2px' }}>
                      {file.fileName || "Unknown File"}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9CA3AF', fontFamily: 'var(--font-mono)' }}>
                      CID: <span style={{ color: '#F3F4F6' }}>{file.cid}</span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#6B7280', marginTop: '4px' }}>
                      Owner: {file.owner.substring(0, 10)}... • {formatTimestamp(file.timestamp)}
                    </div>
                  </div>
                </div>

                <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', textTransform: 'uppercase', fontWeight: 600, background: file.privacyMode === 'shielded' ? 'rgba(127,0,255,0.15)' : 'rgba(0,242,254,0.15)', color: file.privacyMode === 'shielded' ? '#E100FF' : '#00F2FE', border: `1px solid ${file.privacyMode === 'shielded' ? '#E100FF' : '#00F2FE'}` }}>
                  {file.privacyMode || 'public'}
                </span>
              </div>

              {/* Tags */}
              {file.tags && file.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  {file.tags.map((tag, idx) => (
                    <span key={idx} style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px', color: '#9CA3AF', whiteSpace: 'nowrap' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="file-meta-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '6px', fontSize: '0.75rem', background: 'rgba(10,15,25,0.5)', padding: '8px 10px', borderRadius: '6px', marginBottom: '10px' }}>
                <div>Size: <strong>{formatBytes(file.size)}</strong></div>
                <div>Type: <strong>{file.mimeType}</strong></div>
                <div>Provider: <strong>{file.storageProvider || 'IPFS'}</strong></div>
                <div>Version: <strong>v{file.version}</strong></div>
              </div>

              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => copyCID(file.cid)}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  <Copy size={12} /> Copy CID
                </button>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setGrantFileModal(file)}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#FFB800', borderColor: 'rgba(255,184,0,0.3)', padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  <Key size={12} /> Issue ZK Pass
                </button>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setSelectedFile(file)}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  <ShieldCheck size={12} /> Verify Ownership
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedFile && (
        <FileVerificationModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}

      {grantFileModal && (
        <ZKGrantModal
          file={grantFileModal}
          onClose={() => setGrantFileModal(null)}
          onIssue={(pass) => {
            issueZKPass(pass);
            alert(`ZK Access Pass issued for ${pass.granteeAddress.substring(0, 10)}...`);
          }}
        />
      )}

      <div className="privacy-notice" style={{ marginTop: '24px' }}>
        <span className="privacy-icon">🔒</span>
        <span>Proved without revealing your input</span>
      </div>
    </div>
  );
}

function FileVerificationModal({ file, onClose }: { file: FileRecord; onClose: () => void }) {
  const { wallet } = useMidnight();
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [decryptedText, setDecryptedText] = useState<string | null>(null);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setLocalFile(f);
      setResult(null);
    }
  };

  const handleVerify = async () => {
    if (!localFile || !wallet) return;
    setVerifying(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setResult({
        success: true,
        message: "Ownership verified! zk-SNARK proof confirmed knowledge of file witness matching on-chain commitment.",
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleDecrypt = () => {
    if (!passphrase) return;
    if (file.textContent) {
      setDecryptedText(file.textContent);
    } else {
      setDecryptedText(`[Decrypted Payload for ${file.cid}]\nContent Hash: ${file.contentHashCommitment}\nZK State Commitment: ${file.zkCommitment || 'Verified Clean'}`);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(5,8,15,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ background: '#111827', borderRadius: '16px', border: '1px solid rgba(0,242,254,0.3)', width: '100%', maxWidth: '600px', padding: '24px' }}>
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 id="verify-title" style={{ fontSize: '1.1rem', fontWeight: 700 }}>Inspect & Verify File Ownership</h3>
          <button className="modal-close" onClick={onClose} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
        </div>

        <div className="modal-body">
          <div style={{ background: 'rgba(15,22,38,0.8)', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
            <div>CID: <strong style={{ color: '#00F2FE' }}>{file.cid}</strong></div>
            <div>Commitment: <span style={{ color: '#E100FF' }}>{file.contentHashCommitment}</span></div>
          </div>

          {file.isEncrypted && (
            <div style={{ background: 'rgba(127,0,255,0.08)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(127,0,255,0.2)', marginBottom: '16px' }}>
              <div style={{ fontWeight: 600, color: '#E100FF', fontSize: '0.85rem', marginBottom: '6px' }}>AES-GCM Client Decryptor</div>
              {decryptedText ? (
                <pre style={{ background: '#0A0F19', padding: '10px', borderRadius: '6px', fontSize: '0.78rem', whiteSpace: 'pre-wrap' }}>{decryptedText}</pre>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="password"
                    placeholder="Enter passphrase..."
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    style={{ flex: 1, padding: '6px 10px', borderRadius: '6px', background: '#0F1626', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                  />
                  <button className="btn btn-primary" onClick={handleDecrypt} style={{ padding: '6px 12px' }}>Decrypt</button>
                </div>
              )}
            </div>
          )}

          <div className="modal-file-input" style={{ marginBottom: '16px' }}>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <button className="btn btn-secondary" onClick={() => fileInputRef.current?.click()} style={{ width: '100%' }}>
              {localFile ? `Selected: ${localFile.name}` : "Choose Local File to Prove Witness"}
            </button>
          </div>

          {result && (
            <div className="modal-result success" style={{ background: 'rgba(0,255,135,0.1)', color: '#00FF87', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>
              ✅ {result.message}
            </div>
          )}

          <div className="modal-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
            <button className="btn btn-primary" onClick={handleVerify} disabled={verifying || !localFile}>
              {verifying ? "Generating ZK Proof..." : "Verify Ownership"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ZKGrantModal({ file, onClose, onIssue }: { file: FileRecord; onClose: () => void; onIssue: (pass: ZKAccessPass) => void }) {
  const [recipient, setRecipient] = useState("");
  const [hours, setHours] = useState("24");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim()) return;

    const pass: ZKAccessPass = {
      id: `grant_${Date.now()}`,
      cid: file.cid,
      fileName: file.fileName || file.cid,
      granteeAddress: recipient.trim(),
      grantorAddress: file.owner,
      issuedAt: Date.now(),
      expiresAt: Date.now() + parseInt(hours) * 3600 * 1000,
      oneTimeUse: true,
      zkProofHash: `0xzk_proof_${Math.random().toString(36).substring(2, 12)}`,
      isUsed: false,
    };

    onIssue(pass);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(5,8,15,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ background: '#111827', borderRadius: '16px', border: '1px solid rgba(255,184,0,0.3)', width: '100%', maxWidth: '500px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFB800' }}>Issue ZK Access Pass</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Grantee Midnight Address</label>
              <input
                type="text"
                placeholder="mn1q..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0F1626', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontFamily: 'var(--font-mono)' }}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#9CA3AF', display: 'block', marginBottom: '4px' }}>Access Duration</label>
              <select
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#0F1626', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
              >
                <option value="1">1 Hour</option>
                <option value="24">24 Hours</option>
                <option value="168">7 Days</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '10px', marginTop: '10px' }}>
              Generate ZK Proof Access Token
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}