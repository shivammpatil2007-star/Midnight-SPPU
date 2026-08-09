import { useState } from "react";
import { WalletConnect } from "./components/WalletConnect";
import { UploadFile } from "./components/UploadFile";
import { MyFiles } from "./components/MyFiles";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState<"upload" | "files">("upload");

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">🔐</span>
            <span className="logo-text">Midnight File Tracker</span>
          </div>
          <nav className="header-nav" role="navigation" aria-label="Main navigation">
            <button
              className={`nav-tab ${activeTab === "upload" ? "active" : ""}`}
              onClick={() => setActiveTab("upload")}
              aria-current={activeTab === "upload" ? "page" : undefined}
            >
              <span className="tab-icon">📤</span>
              <span>Upload</span>
            </button>
            <button
              className={`nav-tab ${activeTab === "files" ? "active" : ""}`}
              onClick={() => setActiveTab("files")}
              aria-current={activeTab === "files" ? "page" : undefined}
            >
              <span className="tab-icon">📂</span>
              <span>My Files</span>
            </button>
          </nav>
        </div>
        <WalletConnect />
      </header>

      <main className="app-main" role="main">
        <div className="container">
          {activeTab === "upload" && <UploadFile />}
          {activeTab === "files" && <MyFiles />}
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Built for <strong>INTO the Midnight — SPPU</strong> bootcamp
        </p>
        <p className="footer-links">
          <a href="https://midnight.network" target="_blank" rel="noopener noreferrer">Midnight Network</a>
          <span>·</span>
          <a href="https://github.com/midnightntwrk" target="_blank" rel="noopener noreferrer">GitHub</a>
          <span>·</span>
          <a href="https://docs.midnight.network" target="_blank" rel="noopener noreferrer">Documentation</a>
        </p>
        <p className="privacy-footer">
          🔒 All ownership proofs are zero-knowledge — your file content never leaves your device
        </p>
      </footer>
    </div>
  );
}

export default App;