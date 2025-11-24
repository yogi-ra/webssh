import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import SshTerminal from "./components/SshTerminal";
import type { Connection } from "./components/types";
import { 
  workspaceStyle, 
  tabContainer,
  tab,
  activeTab,
  tabContent,
  newTabButton,
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
  mobileEmptyStateBtn
} from "./components/styles";

const SshPage: React.FC = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
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
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c)),
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

  const closeAllConnections = () => {
    if (connections.length === 0) return;
    
    if (window.confirm(`Close all ${connections.length} connections?`)) {
      setConnections([]);
      setActiveTabId(null);
      toast.success('All connections closed');
    }
  };

  const switchTab = (id: string) => {
    setActiveTabId(id);
  };

  const getTabTitle = (conn: Connection) => {
    if (conn.connected && conn.host && conn.username) {
      return `${conn.username}@${conn.host}`;
    }
    return conn.connected ? "Connected" : "New Connection";
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.style.display = 'none';
    
    const logoContainer = target.parentElement;
    if (logoContainer && !logoContainer.querySelector('.logo-fallback')) {
      const fallback = document.createElement('div');
      fallback.className = 'logo-fallback';
      fallback.textContent = '';
      fallback.style.cssText = `
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        color: white;
      `;
      logoContainer.appendChild(fallback);
    }
  };

  return (
    <div style={workspaceStyle}>
      {/* Header Baru dengan Layout Fixed */}
      <header style={isMobile ? mobileHeader : header}>
        <div style={isMobile ? mobileHeaderContent : headerContent}>
          {/* Logo dan Brand di POJOK KIRI */}
          <div style={logoSection}>
            <div style={logoContainer}>
              <img 
                src="/seatrium_logo_white.png"
                alt="Seatrium Logo"
                style={isMobile ? mobileLogo : logo}
                onError={handleImageError}
              />
            </div>
            {!isMobile && (
              <div style={brandText}>
                <div style={brandTitle}>SSH Terminal</div>
                <div style={brandSubtitle}>Secure remote server access</div>
              </div>
            )}
          </div>
          
          {/* Actions di POJOK KANAN */}
          <div style={isMobile ? mobileHeaderActions : headerActions}>
            {connections.length > 0 && !isMobile && (
              <button 
                style={closeAllButton}
                onClick={closeAllConnections}
                title="Close All Connections"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M2.146 2.854a.5.5 0 11.708-.708L8 7.293l5.146-5.147a.5.5 0 01.708.708L8.707 8l5.147 5.146a.5.5 0 01-.708.708L8 8.707l-5.146 5.147a.5.5 0 01-.708-.708L7.293 8 2.146 2.854z"/>
                </svg>
                Close All
              </button>
            )}
            <button 
              style={isMobile ? mobileNewConnectionButton : newConnectionButton}
              onClick={addConnection}
              title="New Connection"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(59, 130, 246, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)";
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 2a1 1 0 00-1 1v4H3a1 1 0 100 2h4v4a1 1 0 102 0V9h4a1 1 0 100-2H9V3a1 1 0 00-1-1z"/>
              </svg>
              {!isMobile && "New Connection"}
            </button>
          </div>
        </div>
      </header>

      {/* Tab Container */}
      {connections.length > 0 && (
        <div style={tabContainer}>
          {connections.map((conn) => (
            <div
              key={conn.id}
              style={conn.id === activeTabId ? activeTab : tab}
              onClick={() => switchTab(conn.id)}
            >
              <span style={{ 
                fontSize: 12, 
                marginRight: 6,
                opacity: conn.connected ? 1 : 0.6 
              }}>
                {conn.connected ? "🔗" : "📄"}
              </span>
              <span style={{ 
                fontSize: 13, 
                fontWeight: conn.id === activeTabId ? 600 : 400,
                fontFamily: "'Poppins', sans-serif"
              }}>
                {getTabTitle(conn)}
              </span>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#ffffff",
                  cursor: "pointer",
                  fontSize: 16,
                  marginLeft: 8,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Poppins', sans-serif"
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
          
          <button
            style={newTabButton}
            onClick={addConnection}
            title="New Connection"
          >
            +
          </button>
        </div>
      )}

      {/* Tab Content */}
      <div style={tabContent}>
        {connections.map((conn) => (
          <div
            key={conn.id}
            style={{
              display: conn.id === activeTabId ? "flex" : "none",
              flexDirection: "column",
              height: "100%",
              background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            }}
          >
            <SshTerminal 
              connection={conn} 
              onUpdate={updateConnection}
              onClose={() => removeConnection(conn.id)}
              isMobile={isMobile}
            />
          </div>
        ))}
        
        {connections.length === 0 && (
          <div style={emptyStateContent}>
            <div style={appTitleContainer}>
              <h1 style={appTitleMain}>Secure<span style={appTitleAccent}>Shell</span></h1>
              <div style={appTitleSubtitle}>TERMINAL</div>
            </div>

            <h2 style={emptyStateTitle}>No Active Connections</h2>
            <p style={emptyStateDescription}>
              Create a new SSH connection to manage your remote servers
            </p>
            
            <button style={isMobile ? mobileEmptyStateBtn : emptyStateBtn} onClick={addConnection}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{marginRight: '8px'}}>
                <path d="M8 2a1 1 0 00-1 1v4H3a1 1 0 100 2h4v4a1 1 0 102 0V9h4a1 1 0 100-2H9V3a1 1 0 00-1-1z"/>
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