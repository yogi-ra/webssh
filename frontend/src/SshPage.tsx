import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import toast from "react-hot-toast";
import seatrium_logo from "../public/seatrium_logo_white.png";

interface Connection {
  id: string;
  host: string;
  port: number;
  username: string;
  password: string;
  connected: boolean;
  connecting: boolean;
  error?: string;
}

const SshPage: React.FC = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  // Styles untuk empty state yang baru
  const emptyState: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    color: "#94a3b8",
    background: "#0f172a",
    padding: "40px 20px",
    minHeight: "min-content",
    position: "relative",
    overflow: "hidden",
  };

  const emptyStateBackgroundLogo: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.06,
    zIndex: 0,
    pointerEvents: "none",
  };

  const emptyStateLogoImage: React.CSSProperties = {
    width: "90%",
    height: "90%",
    maxWidth: "900px",
    maxHeight: "900px",
    objectFit: "contain",
    filter: "brightness(0) invert(1)",
  };

  const emptyStateContent: React.CSSProperties = {
    textAlign: "center",
    maxWidth: "500px",
    padding: "40px 20px",
    position: "relative",
    zIndex: 2,
  };

  const appTitleContainer: React.CSSProperties = {
    marginBottom: "30px",
  };

  const appTitleMain: React.CSSProperties = {
    fontSize: "40px",
    fontWeight: "800",
    color: "#ffffff",
    fontFamily: "'Poppins', sans-serif",
    margin: "0 0 8px 0",
    background:
      "linear-gradient(135deg, #3b82f6 0%, #1e40af 50%, #60a5fa 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    lineHeight: 1.1,
    fontStyle: "italic",
    letterSpacing: "-0.5px",
  };

  const appTitleAccent: React.CSSProperties = {
    fontStyle: "italic",
    background: "linear-gradient(135deg, #f6f6f6ff 0%, #faf7f5ff 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  const appTitleSubtitle: React.CSSProperties = {
    fontSize: "15px",
    fontWeight: "300",
    color: "#94a3b8",
    fontFamily: "'Poppins', sans-serif",
    letterSpacing: "8px",
    textTransform: "uppercase",
    marginTop: "8px",
  };

  const emptyStateTitle: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: "600",
    color: "#e2e8f0",
    marginBottom: "16px",
    fontFamily: "'Poppins', sans-serif",
    background: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  const emptyStateDescription: React.CSSProperties = {
    fontSize: "14px",
    lineHeight: 1.6,
    marginBottom: "32px",
    color: "#94a3b8",
    fontFamily: "'Poppins', sans-serif",
    fontWeight: "400",
    maxWidth: "400px",
    margin: "0 auto 32px auto",
  };

  const emptyStateBtn: React.CSSProperties = {
    background: "#0831b6", // biru solid
    color: "#ffffff",
    border: "none",
    padding: "14px 28px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
    fontFamily: "'Poppins', sans-serif",
    boxShadow: "none", // hilangkan cahaya
  };

  const mobileemptyStateBtn: React.CSSProperties = {
    background: "#0831b6", // biru solid
    color: "#ffffff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "11px", // ukuran font diperkecil
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
    fontFamily: "'Poppins', sans-serif",
    boxShadow: "none", // hilangkan cahaya
  };

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const addConnection = () => {
    const id = crypto.randomUUID();
    const newConnection: Connection = {
      id,
      host: "",
      port: 22,
      username: "",
      password: "",
      connected: false,
      connecting: false,
    };

    setConnections((prev) => [...prev, newConnection]);
    setActiveTab(id);
  };

  const updateConnection = (id: string, updates: Partial<Connection>) =>
    setConnections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    );

  const removeConnection = (id: string) => {
    const remaining = connections.filter((c) => c.id !== id);
    setConnections(remaining);

    if (activeTab !== null && activeTab === id) {
      const first = remaining[0];
      if (first) {
        setActiveTab(first.id);
      } else {
        setActiveTab(null);
      }
    }
  };

  const closeAllConnections = () => {
    setConnections([]);
    setActiveTab(null);
  };

  const activeConnection = connections.find((c) => c.id === activeTab);

  return (
    <div style={container}>
      {/* Header seperti Edge */}
      <header style={isMobile ? mobileHeader : header}>
        <div style={isMobile ? mobileHeaderContent : headerContent}>
          <div style={logoSection}>
            <div style={logoContainer}>
              <img
                src={seatrium_logo}
                alt="Seatrium Logo"
                style={isMobile ? mobileLogo : logo}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            </div>
            {!isMobile && (
              <div style={brandText}>
                <div style={brandTitle}>SSH Terminal</div>
                <div style={brandSubtitle}>Secure remote server access</div>
              </div>
            )}
          </div>

          <div style={isMobile ? mobileHeaderActions : headerActions}>
            {connections.length > 0 && !isMobile && (
              <button
                style={closeAllButton}
                onClick={closeAllConnections}
                title="Close All Connections"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M2.146 2.854a.5.5 0 11.708-.708L8 7.293l5.146-5.147a.5.5 0 01.708.708L8.707 8l5.147 5.146a.5.5 0 01-.708.708L8 8.707l-5.146 5.147a.5.5 0 01-.708-.708L7.293 8 2.146 2.854z" />
                </svg>
                Close All
              </button>
            )}
            <button
              style={isMobile ? mobileNewConnectionButton : newConnectionButton}
              onClick={addConnection}
              title="New Connection"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 2a1 1 0 00-1 1v4H3a1 1 0 100 2h4v4a1 1 0 102 0V9h4a1 1 0 100-2H9V3a1 1 0 00-1-1z" />
              </svg>
              {!isMobile && "New Connection"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div style={mainContent}>
        {/* Background Logo Transparan */}
        <div style={backgroundLogo}>
          <img
            src={seatrium_logo}
            alt="Seatrium Background Logo"
            style={backgroundLogoImage}
          />
        </div>

        <div style={contentWrapper}>
          {/* Tab Bar dengan style Edge */}
          {connections.length > 0 && (
            <div style={isMobile ? mobileTabBar : tabBar}>
              <div style={isMobile ? mobileTabsContainer : tabsContainer}>
                {/* Tab pertama dengan lekukan kiri */}
                {!isMobile && connections.length > 0 && (
                  <div style={tabFirstSpacer}></div>
                )}

                {connections.map((conn, index) => (
                  <React.Fragment key={conn.id}>
                    <div
                      style={{
                        ...(isMobile ? mobileTabStyle : tabStyle),
                        ...(activeTab === conn.id
                          ? isMobile
                            ? mobileActiveTabStyle
                            : activeTabStyle
                          : {}),
                        ...(index === 0
                          ? isMobile
                            ? mobileFirstTabStyle
                            : firstTabStyle
                          : {}),
                        ...(index === connections.length - 1
                          ? isMobile
                            ? mobileLastTabStyle
                            : lastTabStyle
                          : {}),
                      }}
                      onClick={() => setActiveTab(conn.id)}
                    >
                      <div style={isMobile ? mobileTabContent : tabContent}>
                        <div
                          style={
                            conn.connected
                              ? connectedIndicator
                              : disconnectedIndicator
                          }
                        >
                          {conn.connected ? "●" : "○"}
                        </div>
                        <span style={isMobile ? mobileTabTitle : tabTitle}>
                          {conn.username && conn.host
                            ? isMobile
                              ? conn.host
                              : `${conn.username}@${conn.host}`
                            : "New Connection"}
                        </span>
                      </div>
                      {!isMobile && (
                        <button
                          style={{
                            ...tabCloseBtn,
                            ...(activeTab === conn.id ? activeTabCloseBtn : {}),
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            removeConnection(conn.id);
                          }}
                          title="Close tab"
                        >
                          ×
                        </button>
                      )}
                    </div>

                    {/* Tab spacer antara tab */}
                    {!isMobile && index < connections.length - 1 && (
                      <div style={tabSpacer}></div>
                    )}
                  </React.Fragment>
                ))}

                {/* New Tab Button dengan style Edge */}
                <div
                  style={
                    isMobile
                      ? mobileNewTabButtonContainer
                      : newTabButtonContainer
                  }
                >
                  <button
                    style={isMobile ? mobileNewTabButton : newTabButton}
                    onClick={addConnection}
                    title="New tab"
                  >
                    <svg
                      width={isMobile ? "14" : "18"}
                      height={isMobile ? "14" : "18"}
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M8 2a1 1 0 00-1 1v4H3a1 1 0 100 2h4v4a1 1 0 102 0V9h4a1 1 0 100-2H9V3a1 1 0 00-1-1z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Content Area dengan scroll */}
          <div style={contentArea}>
            {activeConnection ? (
              <SshTerminal
                connection={activeConnection}
                onUpdate={updateConnection}
                isMobile={isMobile}
              />
            ) : (
              <div style={emptyState}>
                {/* Background Logo Transparan */}
                <div style={emptyStateBackgroundLogo}>
                  <img
                    src={seatrium_logo}
                    alt="Seatrium Logo"
                    style={emptyStateLogoImage}
                  />
                </div>

                <div style={emptyStateContent}>
                  {/* Judul Aplikasi dengan Desain Italic dan Gradient */}
                  <div style={appTitleContainer}>
                    <h1 style={appTitleMain}>
                      Secure<span style={appTitleAccent}>Shell</span>
                    </h1>
                    <div style={appTitleSubtitle}>TERMINAL</div>
                  </div>

                  <h2 style={emptyStateTitle}>No Active Connections</h2>
                  <p style={emptyStateDescription}>
                    Create a new SSH connection to manage your remote servers
                  </p>

                  <button
                    style={isMobile ? mobileEmptyStateBtn : emptyStateBtn}
                    onClick={addConnection}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      style={{ marginRight: "8px" }}
                    >
                      <path d="M8 2a1 1 0 00-1 1v4H3a1 1 0 100 2h4v4a1 1 0 102 0V9h4a1 1 0 100-2H9V3a1 1 0 00-1-1z" />
                    </svg>
                    Create New Connection
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SshTerminal: React.FC<{
  connection: Connection;
  onUpdate: (id: string, updates: Partial<Connection>) => void;
  isMobile: boolean;
}> = ({ connection, onUpdate, isMobile }) => {
  const termDiv = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitRef = useRef<FitAddon | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const { id, connected, connecting, host, port, username, password } =
    connection;

  useEffect(() => {
    if (!connected) return;

    const ws = new WebSocket("ws://localhost:8000/ws/ssh");
    ws.binaryType = "arraybuffer";

    wsRef.current = ws;

    const term = new Terminal({
      cursorBlink: true,
      fontSize: isMobile ? 12 : 14,
      fontFamily:
        "'Poppins', 'Cascadia Code', 'Consolas', 'Courier New', monospace",
      theme: {
        background: "#0f172a",
        foreground: "#e2e8f0",
        cursor: "#3b82f6",
        selectionBackground: "#475569",
        black: "#1e293b",
        red: "#dc2626",
        green: "#16a34a",
        yellow: "#d97706",
        blue: "#2563eb",
        magenta: "#9333ea",
        cyan: "#0891b2",
        white: "#e2e8f0",
        brightBlack: "#475569",
        brightRed: "#ef4444",
        brightGreen: "#22c55e",
        brightYellow: "#f59e0b",
        brightBlue: "#3b82f6",
        brightMagenta: "#a855f7",
        brightCyan: "#06b6d4",
        brightWhite: "#f8fafc",
      },
    });
    term.open(termDiv.current!);
    termRef.current = term;

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    fitAddon.fit();
    fitRef.current = fitAddon;

    setTimeout(() => {
      fitAddon.fit();
    }, 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "+" || e.key === "=") {
          e.preventDefault();
          const currentFontSize = term.options.fontSize as number;
          term.options.fontSize = currentFontSize + 1;
          setTimeout(() => {
            fitAddon.fit();
            const ws = wsRef.current;
            if (ws && ws.readyState === WebSocket.OPEN) {
              ws.send(
                JSON.stringify({
                  type: "resize",
                  data: { cols: term.cols, rows: term.rows },
                }),
              );
            }
          }, 10);
        } else if (e.key === "-") {
          e.preventDefault();
          const currentFontSize = term.options.fontSize as number;
          if (currentFontSize > 8) {
            term.options.fontSize = currentFontSize - 1;
            setTimeout(() => {
              fitAddon.fit();
              const ws = wsRef.current;
              if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(
                  JSON.stringify({
                    type: "resize",
                    data: { cols: term.cols, rows: term.rows },
                  }),
                );
              }
            }, 10);
          }
        } else if (e.key === "0") {
          e.preventDefault();
          term.options.fontSize = isMobile ? 12 : 14;
          setTimeout(() => {
            fitAddon.fit();
            const ws = wsRef.current;
            if (ws && ws.readyState === WebSocket.OPEN) {
              ws.send(
                JSON.stringify({
                  type: "resize",
                  data: { cols: term.cols, rows: term.rows },
                }),
              );
            }
          }, 10);
        }
      }
    };

    const terminalContainer = termDiv.current;
    if (terminalContainer) {
      terminalContainer.addEventListener("keydown", handleKeyDown);
    }

    ws.onopen = () => {
      console.log("Connected to SSH WebSocket");
      term.write("\n\x1b[32mConnecting to SSH server...\x1b[0m\n");

      ws.send(
        JSON.stringify({
          type: "connect",
          data: { host, port, username, password },
        }),
      );

      setTimeout(() => {
        if (term && fitAddon) {
          fitAddon.fit();
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(
              JSON.stringify({
                type: "resize",
                data: { cols: term.cols, rows: term.rows },
              }),
            );
          }
        }
      }, 500);
    };

    ws.onmessage = (evt) => {
      if (typeof evt.data === "string") {
        try {
          const msg = JSON.parse(evt.data);
          if (msg.type === "connected") {
            term.write("\r\x1b[32mConnected to SSH server!\x1b[0m\n");
            term.write("\r\n");
            term.focus();
          } else if (msg.type === "error") {
            const errMsg = `\r\n\x1b[31m${msg.data}\x1b[0m\r\n`;
            term.write(errMsg);
            setTimeout(() => {
              onUpdate(id, {
                connected: false,
                connecting: false,
                error: msg.data,
              });
            }, 1500);
          }
        } catch (e) {
          console.error("Error parsing message:", e);
        }
      } else {
        const buffer = new Uint8Array(evt.data);
        term.write(buffer);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      term.write("\r\n\x1b[31mWebSocket connection error\x1b[0m\n");
    };

    ws.onclose = () => {
      console.log("Disconnected from SSH WebSocket");
      term.write("\r\n\x1b[31mDisconnected from SSH server\x1b[0m\n");
      onUpdate(id, { connected: false, connecting: false });
      wsRef.current = null;
    };

    term.onData((data) => {
      if (ws.readyState === WebSocket.OPEN)
        ws.send(JSON.stringify({ type: "data", data }));
    });

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      term.dispose();

      if (terminalContainer) {
        terminalContainer.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [connected, host, port, username, password, id, onUpdate, isMobile]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(() => {
        const terminalElement = termDiv.current;
        if (!terminalElement) return;

        const fitAddon = fitRef.current;
        if (!fitAddon) return;

        fitAddon.fit();

        const term = termRef.current;
        if (!term) return;

        const ws = wsRef.current;
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              type: "resize",
              data: { cols: term.cols, rows: term.rows },
            }),
          );
        }
      }, 100);
    });

    if (termDiv.current) {
      resizeObserver.observe(termDiv.current);
    }

    const preventZoom = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "=" || e.key === "-" || e.key === "0")
      ) {
        e.preventDefault();
        return false;
      }
    };

    const preventWheelZoom = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const preventPinchZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", preventZoom, { passive: false });
    window.addEventListener("wheel", preventWheelZoom, { passive: false });
    document.addEventListener("touchstart", preventPinchZoom, {
      passive: false,
    });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("keydown", preventZoom);
      window.removeEventListener("wheel", preventWheelZoom);
      document.removeEventListener("touchstart", preventPinchZoom);
    };
  }, [connected, wsRef]);

  if (!connected) {
    return (
      <div style={isMobile ? mobileConnectionForm : connectionForm}>
        <div style={isMobile ? mobileFormContainer : formContainer}>
          <div style={formHeader}>
            <h2 style={formTitle}>SSH CONNECTION</h2>
            <p style={formSubtitle}>
              Enter your server credentials to establish a secure connection
            </p>
          </div>

          {connection.error && (
            <div
              style={{
                color: "#f87171",
                fontWeight: 500,
                marginBottom: "20px",
                fontFamily: "'Poppins', sans-serif",
                fontSize: isMobile ? "12px" : "13px",
                textAlign: "center",
              }}
            >
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
                  onUpdate(id, {
                    port: Number(e.target.value),
                    error: undefined,
                  })
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
              ...(!host || !username || !password ? connectButtonDisabled : {}),
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
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  style={{ marginRight: "8px" }}
                >
                  <path d="M4.715 6.542L3.343 7.914a3 3 0 104.243 4.243l1.828-1.829A3 3 0 008.586 5.5L8 6.086a1.002 1.002 0 00-.154.199 2 2 0 01.861 3.337L6.88 11.45a2 2 0 11-2.83-2.83l.793-.792a4.018 4.018 0 01-.128-1.287z" />
                  <path d="M6.586 4.672A3 3 0 007.414 9.5l.775-.776a2 2 0 01-.896-3.346L9.12 3.55a2 2 0 112.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 10-4.243-4.243L6.586 4.672z" />
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
    <div
      ref={termDiv}
      style={isMobile ? mobileTerminalContainer : terminalContainer}
    />
  );
};

// Updated Styles dengan perbaikan responsif
const container: React.CSSProperties = {
  height: "100vh",
  width: "100%",
  background: "#0f172a",
  display: "flex",
  flexDirection: "column",
  fontFamily: "'Poppins', system-ui, sans-serif",
  color: "#ffffff",
  overflow: "hidden",
};

const header: React.CSSProperties = {
  height: "70px",
  background: "#1e293b",
  borderBottom: "1px solid #334155",
  display: "flex",
  alignItems: "center",
  padding: "0 24px",
  flexShrink: 0,
};

const mobileHeader: React.CSSProperties = {
  height: "60px",
  background: "#1e293b",
  borderBottom: "1px solid #334155",
  display: "flex",
  alignItems: "center",
  padding: "0 16px",
  flexShrink: 0,
};

const headerContent: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
};

const mobileHeaderContent: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
};

const logoSection: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const brandText: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  lineHeight: 1.2,
};

const brandTitle: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: 600,
  color: "#ffffff",
  fontFamily: "'Poppins', sans-serif",
};

const brandSubtitle: React.CSSProperties = {
  fontSize: "12px",
  color: "#94a3b8",
  fontWeight: 400,
  fontFamily: "'Poppins', sans-serif",
};

const logoContainer: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
};

const logo: React.CSSProperties = {
  height: "32px",
  width: "auto",
  filter: "brightness(0) invert(1)",
};

const mobileLogo: React.CSSProperties = {
  height: "28px",
  width: "auto",
  filter: "brightness(0) invert(1)",
};

const headerActions: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const mobileHeaderActions: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const closeAllButton: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.1)",
  color: "#ffffff",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  cursor: "pointer",
  padding: "8px 16px",
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: 500,
  display: "flex",
  alignItems: "center",
  gap: "6px",
  transition: "all 0.2s ease",
  fontFamily: "'Poppins', sans-serif",
};

const newConnectionButton: React.CSSProperties = {
  background: "#1e40af",
  color: "#ffffff",
  border: "none",
  cursor: "pointer",
  padding: "8px 16px",
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: 500,
  display: "flex",
  alignItems: "center",
  gap: "6px",
  transition: "all 0.2s ease",
  fontFamily: "'Poppins', sans-serif",
};

const mobileNewConnectionButton: React.CSSProperties = {
  background: "#1e40af",
  color: "#ffffff",
  border: "none",
  cursor: "pointer",
  padding: "8px 12px",
  borderRadius: "6px",
  fontSize: "12px",
  fontWeight: 500,
  display: "flex",
  alignItems: "center",
  gap: "4px",
  transition: "all 0.2s ease",
  fontFamily: "'Poppins', sans-serif",
};

const mainContent: React.CSSProperties = {
  flex: 1,
  position: "relative",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

const backgroundLogo: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  overflow: "hidden",
  pointerEvents: "none",
};

const backgroundLogoImage: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
  opacity: 0.03,
  transform: "scale(0.75)",
};

const contentWrapper: React.CSSProperties = {
  position: "relative",
  zIndex: 10,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const tabBar: React.CSSProperties = {
  height: "48px",
  background: "#1e293b",
  borderBottom: "1px solid #334155",
  display: "flex",
  alignItems: "center",
  padding: "0 16px",
  flexShrink: 0,
};

const mobileTabBar: React.CSSProperties = {
  height: "44px",
  background: "#1e293b",
  borderBottom: "1px solid #334155",
  display: "flex",
  alignItems: "center",
  padding: "0 12px",
  flexShrink: 0,
  overflowX: "auto",
};

const tabsContainer: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  flex: 1,
  gap: "0px",
  overflowX: "auto",
};

const mobileTabsContainer: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  flex: 1,
  gap: "4px",
  overflowX: "auto",
  minWidth: "max-content",
};

const tabStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "8px 16px",
  background: "rgba(255, 255, 255, 0.05)",
  borderRadius: "8px 8px 0 0",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 400,
  color: "#94a3b8",
  border: "1px solid transparent",
  borderBottom: "none",
  minWidth: "140px",
  maxWidth: "220px",
  transition: "all 0.2s ease",
  position: "relative",
  fontFamily: "'Poppins', sans-serif",
  marginBottom: "-1px",
};

const mobileTabStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  padding: "6px 12px",
  background: "rgba(255, 255, 255, 0.05)",
  borderRadius: "6px 6px 0 0",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: 400,
  color: "#94a3b8",
  border: "1px solid transparent",
  borderBottom: "none",
  minWidth: "80px",
  maxWidth: "120px",
  transition: "all 0.2s ease",
  position: "relative",
  fontFamily: "'Poppins', sans-serif",
  marginBottom: "-1px",
  flexShrink: 0,
};

const activeTabStyle: React.CSSProperties = {
  background: "#0f172a",
  color: "#3b82f6",
  border: "1px solid #334155",
  borderBottom: "1px solid #0f172a",
};

const mobileActiveTabStyle: React.CSSProperties = {
  background: "#0f172a",
  color: "#3b82f6",
  border: "1px solid #334155",
  borderBottom: "1px solid #0f172a",
};

const firstTabStyle: React.CSSProperties = {
  marginLeft: "0px",
};

const mobileFirstTabStyle: React.CSSProperties = {
  marginLeft: "0px",
};

const lastTabStyle: React.CSSProperties = {
  marginRight: "0px",
};

const mobileLastTabStyle: React.CSSProperties = {
  marginRight: "0px",
};

const tabSpacer: React.CSSProperties = {
  width: "1px",
  height: "16px",
  background: "rgba(255, 255, 255, 0.1)",
  margin: "0 2px",
};

const tabFirstSpacer: React.CSSProperties = {
  width: "8px",
};

const tabContent: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  flex: 1,
  minWidth: 0,
};

const mobileTabContent: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  flex: 1,
  minWidth: 0,
};

const connectedIndicator: React.CSSProperties = {
  color: "#10b981",
  fontSize: "12px",
  flexShrink: 0,
  fontWeight: "bold",
};

const disconnectedIndicator: React.CSSProperties = {
  color: "#64748b",
  fontSize: "10px",
  flexShrink: 0,
};

const tabTitle: React.CSSProperties = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  flex: 1,
  fontWeight: 500,
  fontFamily: "'Poppins', sans-serif",
};

const mobileTabTitle: React.CSSProperties = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  flex: 1,
  fontWeight: 500,
  fontFamily: "'Poppins', sans-serif",
  fontSize: "11px",
};

const tabCloseBtn: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "#64748b",
  cursor: "pointer",
  width: "18px",
  height: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "3px",
  flexShrink: 0,
  fontSize: "14px",
  transition: "all 0.2s ease",
  fontFamily: "'Poppins', sans-serif",
};

const activeTabCloseBtn: React.CSSProperties = {
  color: "#94a3b8",
};

const newTabButtonContainer: React.CSSProperties = {
  marginLeft: "8px",
};

const mobileNewTabButtonContainer: React.CSSProperties = {
  marginLeft: "4px",
};

const newTabButton: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px dashed rgba(255, 255, 255, 0.2)",
  color: "#94a3b8",
  cursor: "pointer",
  width: "36px",
  height: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "6px",
  transition: "all 0.2s ease",
};

const mobileNewTabButton: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px dashed rgba(255, 255, 255, 0.2)",
  color: "#94a3b8",
  cursor: "pointer",
  width: "32px",
  height: "28px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "4px",
  transition: "all 0.2s ease",
  flexShrink: 0,
};

const contentArea: React.CSSProperties = {
  flex: 1,
  background: "#0f172a",
  overflow: "auto",
  display: "flex",
  minHeight: 0,
};

const connectionForm: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  width: "100%",
  background: "#0f172a",
  padding: "40px 20px",
  minHeight: "min-content",
  overflow: "auto",
};

const mobileConnectionForm: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  width: "100%",
  background: "#0f172a",
  padding: "20px 16px",
  minHeight: "min-content",
  overflow: "auto",
};

const formContainer: React.CSSProperties = {
  background: "#1e293b",
  padding: "32px",
  borderRadius: "12px",
  border: "1px solid #334155",
  width: "100%",
  maxWidth: "440px",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
  margin: "auto",
};

const mobileFormContainer: React.CSSProperties = {
  background: "#1e293b",
  padding: "24px 20px",
  borderRadius: "10px",
  border: "1px solid #334155",
  width: "100%",
  maxWidth: "100%",
  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
  margin: "auto",
};

const formHeader: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "24px",
};

const formTitle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: 600,
  color: "#ffffff",
  margin: "0 0 8px 0",
  fontFamily: "'Poppins', sans-serif",
};

const formSubtitle: React.CSSProperties = {
  fontSize: "14px",
  color: "#94a3b8",
  margin: 0,
  lineHeight: 1.5,
  fontFamily: "'Poppins', sans-serif",
};

const formGrid: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  marginBottom: "24px",
};

const mobileFormGrid: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginBottom: "20px",
};

const formGroup: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const formLabel: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 500,
  color: "#cbd5e1",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  fontFamily: "'Poppins', sans-serif",
};

const formInput: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "8px",
  border: "1px solid #475569",
  background: "#334155",
  color: "#ffffff",
  fontSize: "14px",
  transition: "all 0.2s ease",
  boxSizing: "border-box",
  fontFamily: "'Poppins', sans-serif",
};

const mobileFormInput: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "6px",
  border: "1px solid #475569",
  background: "#334155",
  color: "#ffffff",
  fontSize: "14px",
  transition: "all 0.2s ease",
  boxSizing: "border-box",
  fontFamily: "'Poppins', sans-serif",
};

const connectButton: React.CSSProperties = {
  width: "100%",
  background: "#1e40af",
  color: "#ffffff",
  border: "none",
  padding: "14px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 500,
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  transition: "all 0.2s ease",
  fontFamily: "'Poppins', sans-serif",
};

const mobileConnectButton: React.CSSProperties = {
  width: "100%",
  background: "#1e40af",
  color: "#ffffff",
  border: "none",
  padding: "12px 16px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: 500,
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
  transition: "all 0.2s ease",
  fontFamily: "'Poppins', sans-serif",
};

const connectButtonDisabled: React.CSSProperties = {
  opacity: 0.6,
  cursor: "not-allowed",
  background: "#475569",
};

const loadingSpinner: React.CSSProperties = {
  width: "16px",
  height: "16px",
  border: "2px solid transparent",
  borderTop: "2px solid #ffffff",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

const emptyState: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  width: "100%",
  color: "#94a3b8",
  background: "#0f172a",
  padding: "40px 20px",
  minHeight: "min-content",
};

const emptyStateContent: React.CSSProperties = {
  textAlign: "center",
  maxWidth: "480px",
  padding: "40px",
};

const emptyStateIcon: React.CSSProperties = {
  color: "#3b82f6",
  marginBottom: "20px",
  opacity: 0.8,
};

const emptyStateTitle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: 600,
  color: "#ffffff",
  marginBottom: "12px",
  fontFamily: "'Poppins', sans-serif",
};

const emptyStateDescription: React.CSSProperties = {
  fontSize: "16px",
  lineHeight: 1.6,
  marginBottom: "24px",
  color: "#94a3b8",
  fontFamily: "'Poppins', sans-serif",
};

const emptyStateBtn: React.CSSProperties = {
  background: "#1e40af",
  color: "#ffffff",
  border: "none",
  padding: "12px 24px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 500,
  fontSize: "14px",
  transition: "all 0.2s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto",
  fontFamily: "'Poppins', sans-serif",
};

const mobileEmptyStateBtn: React.CSSProperties = {
  background: "#1e40af",
  color: "#ffffff",
  border: "none",
  padding: "12px 20px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: 500,
  fontSize: "14px",
  transition: "all 0.2s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto",
  fontFamily: "'Poppins', sans-serif",
};

const terminalContainer: React.CSSProperties = {
  width: "100%",
  height: "100%",
  background: "#0f172a",
  padding: "0px",
  display: "flex",
  flexDirection: "column",
  flex: 1,
};

const mobileTerminalContainer: React.CSSProperties = {
  width: "100%",
  height: "100%",
  background: "#0f172a",
  padding: "0px",
  display: "flex",
  flexDirection: "column",
  flex: 1,
  fontSize: "12px",
};

// Add CSS animation for spinner
const styles = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

/* Mobile responsive adjustments */
@media (max-width: 768px) {
  .xterm-viewport {
    overflow-y: auto !important;
  }
  
  .xterm-screen {
    min-width: 100% !important;
  }
}

/* Prevent zoom on mobile */
@media (max-width: 768px) {
  input, select, textarea {
    font-size: 16px !important;
  }
}
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default SshPage;
