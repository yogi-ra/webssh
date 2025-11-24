import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";     
import "@xterm/xterm/css/xterm.css";
import toast from "react-hot-toast";
import type { Connection } from "./types";
import { 
  connectionForm,
  mobileConnectionForm,
  formContainer,
  mobileFormContainer,
  formHeader,
  formTitle,
  formSubtitle,
  formGrid,
  mobileFormGrid,
  formGroup,
  formLabel,
  formInput,
  mobileFormInput,
  connectButton,
  mobileConnectButton,
  connectButtonDisabled,
  loadingSpinner
} from "./styles";

const SshTerminal: React.FC<{
  connection: Connection;
  onUpdate: (id: string, updates: Partial<Connection>) => void;
  onClose: () => void;
  isMobile: boolean;
}> = ({ connection, onUpdate, onClose, isMobile }) => {
  const termDiv = useRef<HTMLDivElement>(null);  
  const termRef = useRef<Terminal>(null);        
  const fitRef = useRef<FitAddon>(null);
  const wsRef = useRef<WebSocket>(null);

  const { id, connected, connecting, host, port, username, password } = connection;

  useEffect(() => {
    if (!connected) return;
    
    const ws = new WebSocket("ws://localhost:8000/ws/ssh");
    ws.binaryType = "arraybuffer";

    const term = new Terminal({
      cursorBlink: true,
      fontSize: isMobile ? 12 : 14, // Font size lebih kecil di mobile
      fontFamily: "'Fira Code', 'Cascadia Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
      theme: { 
        background: "#0f172a",
        foreground: "#e2e8f0",
        cursor: "#3b82f6",
        selectionBackground: "rgba(59, 130, 246, 0.3)",
        black: "#1e293b",
        red: "#ef4444",
        green: "#10b981",
        yellow: "#f59e0b",
        blue: "#3b82f6",
        magenta: "#8b5cf6",
        cyan: "#06b6d4",
        white: "#e2e8f0"
      },
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(termDiv.current!);
    
    // Delay fit untuk memastikan container sudah ter-render
    setTimeout(() => {
      fit.fit();
    }, 100);
    
    term.focus();

    termRef.current = term;
    fitRef.current = fit;
    wsRef.current = ws;

    const decoder = new TextDecoder("utf-8", { fatal: false });

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "connect",
          data: { host, port, username, password },
        }),
      );
    };

    ws.onmessage = (evt) => {
      if (typeof evt.data === "string") {        
        try {
          const msg = JSON.parse(evt.data);      
          if (msg.type === "connected") {        
            term.write("\r\n\x1b[32m✅ Connected successfully!\x1b[0m\r\n"); 
          } else if (msg.type === "error") {     
            const errMsg = `\r\n\x1b[31m❌ Connection failed: ${msg.data}\x1b[0m\r\n`;
            term.write(errMsg);
            toast.error(msg.data);
            setTimeout(() => {
              onUpdate(id, {
                connected: false,
                connecting: false,
                error: msg.data,
              });
            }, 1500);
          }
        } catch {
          term.write(evt.data);
        }
      } else if (evt.data instanceof ArrayBuffer) {
        const text = decoder.decode(evt.data, { stream: true });
        term.write(text);
      }
    };

    term.onData((data) => {
      if (ws.readyState === WebSocket.OPEN)      
        ws.send(JSON.stringify({ type: "data", data }));
    });

    // Handle window resize untuk terminal
    const handleResize = () => {
      setTimeout(() => {
        if (fitRef.current) {
          fitRef.current.fit();
        }
      }, 50);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      ws.close();
      term.dispose();
    };
  }, [connected, isMobile]); // Tambah isMobile ke dependency

  useEffect(() => {
    if (fitRef.current) {
      setTimeout(() => fitRef.current?.fit(), 100);
    }
  }, [isMobile]); // Refit ketika ukuran layar berubah

  if (!connected) {
    return (
      <div style={isMobile ? mobileConnectionForm : connectionForm}>
        <div style={isMobile ? mobileFormContainer : formContainer}>
          <div style={formHeader}>
            <h2 style={{
              ...formTitle,
              fontSize: isMobile ? "1.2rem" : "1.5rem"
            }}>
              SSH CONNECTION
            </h2>
            <p style={{
              ...formSubtitle,
              fontSize: isMobile ? "0.8rem" : "0.875rem",
              padding: isMobile ? "0 10px" : "0"
            }}>
              Enter your server credentials to establish a secure connection
            </p>
          </div>

          {connection.error && (
            <div style={{ 
              color: "#f87171", 
              fontWeight: 500, 
              marginBottom: "16px", 
              fontFamily: "'Poppins', sans-serif", 
              fontSize: isMobile ? "11px" : "13px",
              textAlign: "center",
              padding: isMobile ? "0 10px" : "0"
            }}>
              {connection.error}
            </div>
          )}

          <div style={isMobile ? mobileFormGrid : formGrid}>
            <div style={formGroup}>
              <label style={formLabel}>Host Address</label>
              <input
                placeholder="Enter Host Address"
                value={host}
                onChange={(e) =>
                  onUpdate(id, { host: e.target.value, error: undefined })
                }
                style={isMobile ? mobileFormInput : formInput}
              />
            </div>

            <div style={formGroup}>
              <label style={formLabel}>Port</label>
              <input
                placeholder="22"
                type="number"
                value={port}
                onChange={(e) =>
                  onUpdate(id, { port: Number(e.target.value), error: undefined })
                }
                style={isMobile ? mobileFormInput : formInput}
              />
            </div>

            <div style={formGroup}>
              <label style={formLabel}>Username</label>
              <input
                placeholder="Enter your username"
                value={username}
                onChange={(e) =>
                  onUpdate(id, { username: e.target.value, error: undefined })
                }
                style={isMobile ? mobileFormInput : formInput}
              />
            </div>

            <div style={formGroup}>
              <label style={formLabel}>Password</label>
              <input
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) =>
                  onUpdate(id, { password: e.target.value, error: undefined })
                }
                style={isMobile ? mobileFormInput : formInput}
              />
            </div>
          </div>

          <button
            style={{
              ...(isMobile ? mobileConnectButton : connectButton),
              ...((!host || !username || !password) ? connectButtonDisabled : {})
            }}
            disabled={connecting || !host || !username || !password}
            onClick={() => {
              onUpdate(id, {
                connecting: true,
                connected: true,
                error: undefined,
              });
            }}
          >
            {connecting ? (
              <>
                <div style={loadingSpinner}></div>
                Connecting...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{marginRight: '8px'}}>
                  <path d="M4.715 6.542L3.343 7.914a3 3 0 104.243 4.243l1.828-1.829A3 3 0 008.586 5.5L8 6.086a1.002 1.002 0 00-.154.199 2 2 0 01.861 3.337L6.88 11.45a2 2 0 11-2.83-2.83l.793-.792a4.018 4.018 0 01-.128-1.287z"/>
                  <path d="M6.586 4.672A3 3 0 007.414 9.5l.775-.776a2 2 0 01-.896-3.346L9.12 3.55a2 2 0 112.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 10-4.243-4.243L6.586 4.672z"/>
                </svg>
                Connect to Server
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100%",
      background: "#0f172a",
      overflow: "hidden"
    }}>
      <div style={{
        padding: isMobile ? "8px 12px" : "12px 16px",
        background: "rgba(15, 23, 42, 0.8)",
        borderBottom: `1px solid #334155`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexShrink: 0
      }}>
        <div style={{ 
          color: "#10b981", 
          fontSize: isMobile ? 11 : 13, 
          fontWeight: 600, 
          fontFamily: "'Poppins', sans-serif",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flex: 1,
          marginRight: 8
        }}>
          🔗 Connected to {username}@{host}:{port}
        </div>
        <button
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: `1px solid rgba(255, 255, 255, 0.2)`,
            color: "#ffffff",
            cursor: "pointer",
            fontSize: isMobile ? 11 : 13,
            padding: isMobile ? "4px 8px" : "6px 12px",
            borderRadius: 6,
            transition: "all 0.2s ease",
            fontFamily: "'Poppins', sans-serif",
            flexShrink: 0
          }}
          onClick={onClose}
          title="Close Tab"
        >
          {isMobile ? "Close" : "Close Tab"}
        </button>
      </div>
      <div 
        ref={termDiv} 
        style={{ 
          flex: 1, 
          width: "100%",
          padding: isMobile ? "2px" : "0", // Sedikit padding untuk mobile
          boxSizing: "border-box"
        }} 
      />
    </div>
  );
};

export default SshTerminal;