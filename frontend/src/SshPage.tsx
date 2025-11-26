import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import SshTerminal from "./components/SshTerminal";
import type { Connection } from "./components/types";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import {
  workspaceStyle,
  tabContainer,
  tab,
  activeTab,
  tabContent,
  newTabButton,
  connectionCounter,
  // Header Styles
  header,
  mobileHeader,
  headerContent,
  mobileHeaderContent,
  logoSection,
  logoContainer,
  logo,
  mobileLogo,
  brandText,
  brandTitle,
  brandSubtitle,
  headerActions,
  mobileHeaderActions,
  closeAllButton,
  newConnectionButton,
  mobileNewConnectionButton,
  // Empty State Styles
  emptyStateContent,
  appTitleContainer,
  appTitleMain,
  appTitleAccent,
  appTitleSubtitle,
  emptyStateTitle,
  emptyStateDescription,
  emptyStateBtn,
  mobileEmptyStateBtn,
} from "./components/styles";

// Import logo
import seatrium_logo from "../public/seatrium_logo_white.png";

// Mobile-specific styles
const mobileTabContainer: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  background: "rgba(15, 23, 42, 0.9)",
  borderBottom: `1px solid #334155`,
  padding: "6px 8px 0 8px",
  gap: 2,
  flexShrink: 0,
  minHeight: 36,
  overflowX: "auto",
  fontFamily: "'Poppins', sans-serif",
};

const mobileTab: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  padding: "8px 12px",
  background: "rgba(30, 41, 59, 0.6)",
  color: "#cbd5e1",
  border: `1px solid #334155`,
  borderBottom: "none",
  borderRadius: "6px 6px 0 0",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 400,
  minWidth: 100,
  maxWidth: 150,
  transition: "all 0.2s ease",
  position: "relative",
  fontFamily: "'Poppins', sans-serif",
};

const mobileActiveTab: React.CSSProperties = {
  ...mobileTab,
  background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  color: "#f8fafc",
  borderColor: "#334155",
  borderBottom: `1px solid #0f172a`,
  marginBottom: "-1px",
  fontWeight: 600,
};

const mobileNewTabButton: React.CSSProperties = {
  background: "rgba(30, 41, 59, 0.6)",
  color: "#cbd5e1",
  border: `1px solid #334155`,
  borderRadius: 4,
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 600,
  width: 28,
  height: 28,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease",
  marginLeft: 6,
  fontFamily: "'Poppins', sans-serif",
};

// Background logo style used in the empty state
const emptyStateBackgroundLogo: React.CSSProperties = {
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "900px",
  opacity: 0.03,
  pointerEvents: "none",
};

const mobileEmptyStateBackgroundLogo: React.CSSProperties = {
  ...emptyStateBackgroundLogo,
  width: "400px", // Lebih kecil untuk mobile
};

// Responsive workspace style
const responsiveWorkspaceStyle: React.CSSProperties = {
  ...workspaceStyle,
  overflow: "hidden", // Tetap hidden untuk desktop
  height: "100vh",
};

const mobileWorkspaceStyle: React.CSSProperties = {
  ...workspaceStyle,
  height: "100vh",
  overflow: "hidden", // Container utama tetap hidden
  position: "relative",
};

// Tab content yang bisa di-scroll di mobile
const mobileTabContent: React.CSSProperties = {
  flex: 1,
  background: "#0f172a",
  overflow: "hidden",
  position: "relative",
  fontFamily: "'Poppins', sans-serif",
};

// Scrollable container untuk form di mobile
const mobileScrollContainer: React.CSSProperties = {
  height: "100%",
  overflowY: "auto",
  WebkitOverflowScrolling: "touch", // Smooth scrolling untuk iOS
  paddingBottom: "20px", // Ruang untuk scroll
};

const SshPage: React.FC = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    const userFromUrl = urlParams.get("user");

    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      if (userFromUrl) {
        localStorage.setItem("user", userFromUrl);
      }

      window.history.replaceState({}, document.title, window.location.pathname);
      console.log("✅ Token received from Portal");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.log("❌ No token found");
      window.location.href = "http://localhost:3000/login";
      return;
    }

    // PENTING: Verifikasi token ke backend Portal
    fetch("http://localhost:4000/users/verify-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Token invalid");
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ Token valid:", data);
      })
      .catch((err) => {
        console.error("❌ Token verification failed:", err);
        // HAPUS token yang invalid
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "http://localhost:3000/login";
      });
  }, []);

  useEffect(() => {
    // Listener untuk detect logout dari Portal di tab lain
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" && e.newValue === null) {
        console.log("🔓 Logout detected - token removed");
        // Redirect ke Portal login
        window.location.href = "http://localhost:3000/login";
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Check mobile screen size dengan threshold yang lebih baik
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
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
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      zIndex: 1,
      minimized: false,
      maximized: false,
    };

    setConnections((prev) => [...prev, newConnection]);
    setActiveTabId(id);
  };

  const updateConnection = (id: string, updates: Partial<Connection>) =>
    setConnections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );

  const removeConnection = (id: string) => {
    setConnections((prev) => {
      const newConnections = prev.filter((c) => c.id !== id);

      if (id === activeTabId) {
        if (newConnections.length > 0) {
          const last = newConnections[newConnections.length - 1];
          if (last) {
            setActiveTabId(last.id);
          } else {
            setActiveTabId(null);
          }
        } else {
          setActiveTabId(null);
        }
      }

      return newConnections;
    });
  };

  const closeAllConnections = async () => {
    if (connections.length === 0) return;

    const result = await Swal.fire({
      title: "Close All Connections?",
      text: `You have ${connections.length} active connections.`,
      icon: "warning",
      background: "#0f172a",
      color: "#f8fafc",
      showCancelButton: true,
      confirmButtonText: "Yes, close all",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
      customClass: {
        popup: "poppins-popup",
        title: "poppins-title",
        htmlContainer: "poppins-text",
        confirmButton: "poppins-confirm",
        cancelButton: "poppins-cancel",
      },
    });

    if (result.isConfirmed) {
      setConnections([]);
      setActiveTabId(null);

      Swal.fire({
        title: "All connections closed",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
        background: "#0f172a",
        color: "#f8fafc",
        customClass: {
          popup: "poppins-popup",
          title: "poppins-title",
        },
      });
    }
  };

  // Fungsi untuk handle logout dengan konfirmasi
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout from SSH Terminal?",
      icon: "question",
      background: "#0f172a",
      color: "#f8fafc",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#e14526ff",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
      customClass: {
        popup: "poppins-popup",
        title: "poppins-title",
        htmlContainer: "poppins-text",
        confirmButton: "poppins-confirm",
        cancelButton: "poppins-cancel",
      },
    });

    if (result.isConfirmed) {
      // Hapus token dan user dari localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Tampilkan notifikasi sukses
      await Swal.fire({
        title: "Logged Out",
        text: "You have been successfully logged out",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        background: "#0f172a",
        color: "#f8fafc",
        customClass: {
          popup: "poppins-popup",
          title: "poppins-title",
          htmlContainer: "poppins-text",
        },
      });

      // Redirect ke halaman login
      window.location.href = "http://localhost:3000/login";
    }
  };

  const switchTab = (id: string) => {
    setActiveTabId(id);
  };

  const getTabTitle = (conn: Connection) => {
    if (conn.connected && conn.host && conn.username) {
      // Untuk mobile, tampilkan host saja jika terlalu panjang
      if (isMobile && `${conn.username}@${conn.host}`.length > 12) {
        return conn.host;
      }
      return `${conn.username}@${conn.host}`;
    }
    return conn.connected ? "Connected" : "New Connection";
  };

  return (
    <div style={isMobile ? mobileWorkspaceStyle : responsiveWorkspaceStyle}>
      {/* Header */}
      <header style={isMobile ? mobileHeader : header}>
        <div style={isMobile ? mobileHeaderContent : headerContent}>
          {/* Logo dan Brand */}
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

          {/* Actions */}
          <div style={isMobile ? mobileHeaderActions : headerActions}>
            {/* Close All Button */}
            {connections.length > 0 && (
              <button
                style={
                  isMobile
                    ? { ...closeAllButton, padding: "6px 8px", fontSize: 12 }
                    : closeAllButton
                }
                onClick={closeAllConnections}
                title="Close All Connections"
              >
                {!isMobile && (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <path d="M2.146 2.854a.5.5 0 11.708-.708L8 7.293l5.146-5.147a.5.5 0 01.708.708L8.707 8l5.147 5.146a.5.5 0 01-.708.708L8 8.707l-5.146 5.147a.5.5 0 01-.708-.708L7.293 8 2.146 2.854z" />
                    </svg>
                    Close All
                  </>
                )}
                {isMobile && "✕ Close All"}
              </button>
            )}

            {/* New Connection Button */}
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

            {/* Logout Button */}
            <button
              style={{
                padding: isMobile ? "6px 10px" : "8px 12px",
                fontSize: isMobile ? 12 : 14,
                backgroundColor: "#e14526ff", // Warna merah/orange
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: isMobile ? 4 : 6,
                transition: "all 0.2s ease",
                fontFamily: "'Poppins', sans-serif",
                whiteSpace: "nowrap",
              }}
              onClick={handleLogout}
              title="Logout"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#c13a1eff";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#e14526ff";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <svg
                width={isMobile ? 12 : 14}
                height={isMobile ? 12 : 14}
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 011 1v8a1 1 0 01-1 1h1a1 1 0 110 2H3a2 2 0 01-2-2V4a2 2 0 012-2h1a1 1 0 010 2H3zm9.707 3.293a1 1 0 010 1.414L11.414 9H15a1 1 0 110 2h-3.586l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {!isMobile && "Logout"}
            </button>
          </div>
        </div>
      </header>

      {/* Tab Container */}
      {connections.length > 0 && (
        <div style={isMobile ? mobileTabContainer : tabContainer}>
          {connections.map((conn) => (
            <div
              key={conn.id}
              style={
                conn.id === activeTabId
                  ? isMobile
                    ? mobileActiveTab
                    : activeTab
                  : isMobile
                  ? mobileTab
                  : tab
              }
              onClick={() => switchTab(conn.id)}
            >
              <span
                style={{
                  fontSize: isMobile ? 10 : 12,
                  marginRight: isMobile ? 4 : 6,
                  opacity: conn.connected ? 1 : 0.6,
                }}
              >
                {conn.connected ? "🔗" : "📄"}
              </span>
              <span
                style={{
                  fontSize: isMobile ? 10 : 13,
                  fontWeight: conn.id === activeTabId ? 600 : 400,
                  fontFamily: "'Poppins', sans-serif",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {getTabTitle(conn)}
              </span>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#ffffff",
                  cursor: "pointer",
                  fontSize: isMobile ? 14 : 16,
                  marginLeft: isMobile ? 4 : 8,
                  width: isMobile ? 14 : 16,
                  height: isMobile ? 14 : 16,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Poppins', sans-serif",
                  flexShrink: 0,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeConnection(conn.id);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(239, 68, 68, 0.3)";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "none";
                  e.currentTarget.style.color = "#ffffff";
                }}
              >
                ×
              </button>
            </div>
          ))}

          {/* New Tab Button */}
          <button
            style={isMobile ? mobileNewTabButton : newTabButton}
            onClick={addConnection}
            title="New Connection"
          >
            +
          </button>
        </div>
      )}

      {/* Tab Content */}
      <div style={isMobile ? mobileTabContent : tabContent}>
        {connections.map((conn) => (
          <div
            key={conn.id}
            style={{
              display: conn.id === activeTabId ? "flex" : "none",
              flexDirection: "column",
              height: "100%",
              background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
              overflow: "hidden",
            }}
          >
            {/* Untuk mobile, tambahkan scroll container */}
            {isMobile && !conn.connected ? (
              <div style={mobileScrollContainer}>
                <SshTerminal
                  connection={conn}
                  onUpdate={updateConnection}
                  onClose={() => removeConnection(conn.id)}
                  isMobile={isMobile}
                />
              </div>
            ) : (
              <SshTerminal
                connection={conn}
                onUpdate={updateConnection}
                onClose={() => removeConnection(conn.id)}
                isMobile={isMobile}
              />
            )}
          </div>
        ))}

        {/* Empty State - Diperbaiki untuk mobile scrolling */}
        {connections.length === 0 && (
          <div
            style={{
              ...emptyStateContent,
              position: "relative",
              height: "100%",
              overflowY: isMobile ? "auto" : "hidden",
              WebkitOverflowScrolling: isMobile ? "touch" : "auto",
              padding: isMobile ? "20px 16px" : "40px 20px",
            }}
          >
            {/* LOGO BESAR SANGAT TRANSPARAN */}
            <img
              src={seatrium_logo}
              alt="background logo"
              style={
                isMobile
                  ? mobileEmptyStateBackgroundLogo
                  : emptyStateBackgroundLogo
              }
            />

            {/* Foreground Content */}
            <div
              style={{
                ...appTitleContainer,
                marginBottom: isMobile ? "32px" : "48px",
              }}
            >
              <h1
                style={{
                  ...appTitleMain,
                  fontSize: isMobile ? "1.8rem" : "3rem",
                  lineHeight: isMobile ? "1.2" : "1.1",
                }}
              >
                Secure<span style={appTitleAccent}>Shell</span>
              </h1>
              <div
                style={{
                  ...appTitleSubtitle,
                  fontSize: isMobile ? "0.8rem" : "1.15rem",
                  marginTop: isMobile ? "4px" : "6px",
                }}
              >
                TERMINAL
              </div>
            </div>

            <h2
              style={{
                ...emptyStateTitle,
                fontSize: isMobile ? "1rem" : "1.3rem",
                marginTop: isMobile ? "0px" : "-20px",
                marginBottom: isMobile ? "8px" : "5px",
              }}
            >
              No Active Connections
            </h2>
            <p
              style={{
                ...emptyStateDescription,
                fontSize: isMobile ? "0.85rem" : "1rem",
                padding: isMobile ? "0 10px" : "0",
                marginBottom: isMobile ? "24px" : "32px",
                lineHeight: isMobile ? "1.5" : "1.6",
              }}
            >
              Create a new SSH connection to manage your remote servers
            </p>

            <button
              style={
                isMobile
                  ? {
                      ...mobileEmptyStateBtn,
                      marginBottom: "20px", // Tambah margin bottom untuk mobile
                    }
                  : emptyStateBtn
              }
              onClick={addConnection}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
                style={{ marginRight: 8 }}
              >
                <path d="M8 2a1 1 0 00-1 1v4H3a1 1 0 100 2h4v4a1 1 0 102 0V9h4a1 1 0 100-2H9V3a1 1 0 00-1-1z" />
              </svg>
              Create New Connection
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SshPage;
