import type { CSSProperties } from "react";

// Color Palette - Dark Blue Theme
const colors = {
  primary: "#1e293b",
  secondary: "#0f172a",
  accent: "#3b82f6",
  accentDark: "#1d4ed8",
  text: "#f8fafc",
  textSecondary: "#cbd5e1",
  textMuted: "#64748b",
  border: "#334155",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  background: "#0f1216",
};

// Font Family Poppins untuk semua elemen
const fontFamily =
  "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif";

export const workspaceStyle: CSSProperties = {
  position: "relative",
  height: "100vh",
  width: "100%",
  overflow: "hidden",
  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  display: "flex",
  flexDirection: "column",
  fontFamily: fontFamily,
};

// ==================== HEADER STYLES ====================
export const header: CSSProperties = {
  width: "100%",
  background: colors.primary,
  padding: "0 24px", // ⭐ tambah padding kiri-kanan (AMAN UNTUK LOGO & BUTTON)
  height: 64,
  display: "flex",
  alignItems: "center",
  boxSizing: "border-box",
};

export const mobileHeader: CSSProperties = {
  ...header,
  padding: "10px 20px",
};

export const headerContent: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  maxWidth: "100%", // biar tidak center
  margin: 0,
};

export const mobileHeaderContent: CSSProperties = {
  ...headerContent,
  flexDirection: "row",
  gap: 12,
};

export const logoSection: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 16,
  flexShrink: 0,
};

export const logoContainer: CSSProperties = {
  display: "flex",
  alignItems: "center",
};

export const logo: CSSProperties = {
  height: 32,
  width: "auto",
  filter: "brightness(0) invert(1)",
};

export const mobileLogo: CSSProperties = {
  ...logo,
  height: 24,
};

export const brandText: CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

export const brandTitle: CSSProperties = {
  color: colors.text,
  fontSize: 18,
  fontWeight: 700,
  fontFamily: fontFamily,
  background: "linear-gradient(135deg, #f8fafc, #cbd5e1)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  whiteSpace: "nowrap",
};

export const brandSubtitle: CSSProperties = {
  color: colors.textMuted,
  fontSize: 12,
  fontWeight: 400,
  fontFamily: fontFamily,
  marginTop: 2,
  whiteSpace: "nowrap",
};

export const headerActions: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  flexShrink: 0,
  // Hapus margin-left: auto dan ganti dengan:
  marginLeft: "auto",
  marginRight: 0, // Pastikan 0
};

export const mobileHeaderActions: CSSProperties = {
  ...headerActions,
  gap: 8,
  marginRight: 0, // Pastikan 0 untuk mobile juga
};

export const closeAllButton: CSSProperties = {
  background: "rgba(255, 255, 255, 0.1)",
  color: "#ffffff",
  border: `1px solid rgba(255, 255, 255, 0.2)`,
  padding: "8px 16px",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 500,
  display: "flex",
  alignItems: "center",
  gap: 6,
  transition: "all 0.2s ease",
  fontFamily: fontFamily,
  whiteSpace: "nowrap",
};

export const closeAllButtonHover: CSSProperties = {
  ...closeAllButton,
  background: "rgba(255, 255, 255, 0.15)",
};

export const newConnectionButton: CSSProperties = {
  background: "#1d4ed8", // biru gelap solid
  color: "#ffffff",
  border: "none",
  padding: "8px 16px",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  gap: 8,
  transition: "all 0.2s ease",
  boxShadow: "none", // hilangkan efek terang
  fontFamily: fontFamily,
  whiteSpace: "nowrap",
};

export const newConnectionButtonHover: CSSProperties = {
  ...newConnectionButton,
  transform: "translateY(-1px)",
  boxShadow: "0 6px 16px rgba(59, 130, 246, 0.4)",
};

export const mobileNewConnectionButton: CSSProperties = {
  ...newConnectionButton,
  padding: "6px 8px",
  fontSize: 12,
};

// ==================== TAB STYLES ====================
export const tabContainer: CSSProperties = {
  display: "flex",
  alignItems: "center",
  background: "rgba(15, 23, 42, 0.9)",
  borderBottom: `1px solid ${colors.border}`,
  padding: "8px 12px 0 12px",
  gap: 2,
  flexShrink: 0,
  minHeight: 40,
  overflowX: "auto",
  fontFamily: fontFamily,
};

export const tab: CSSProperties = {
  display: "flex",
  alignItems: "center",
  padding: "10px 16px",
  background: "rgba(30, 41, 59, 0.6)",
  color: colors.textSecondary,
  border: `1px solid ${colors.border}`,
  borderBottom: "none",
  borderRadius: "8px 8px 0 0",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 400,
  minWidth: 120,
  maxWidth: 200,
  transition: "all 0.2s ease",
  position: "relative",
  fontFamily: fontFamily,
};

export const activeTab: CSSProperties = {
  ...tab,
  background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  color: colors.text,
  borderColor: colors.border,
  borderBottom: `1px solid #0f172a`,
  marginBottom: "-1px",
  fontWeight: 600,
};

export const tabContent: CSSProperties = {
  flex: 1,
  background: "#0f172a",
  overflow: "hidden",
  fontFamily: fontFamily,
};

export const newTabButton: CSSProperties = {
  background: "rgba(30, 41, 59, 0.6)",
  color: colors.textSecondary,
  border: `1px solid ${colors.border}`,
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 16,
  fontWeight: 600,
  width: 32,
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease",
  marginLeft: 8,
  fontFamily: fontFamily,
};

// ==================== CONNECTION FORM STYLES ====================
export const connectionForm: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  padding: "40px 20px",
  fontFamily: fontFamily,
};

export const mobileConnectionForm: CSSProperties = {
  ...connectionForm,
  padding: "20px 16px",
  alignItems: "flex-start",
};

export const formContainer: CSSProperties = {
  background: "rgba(15, 23, 42, 0.8)",
  border: `1px solid ${colors.border}`,
  borderRadius: 12,
  padding: "40px",
  width: "100%",
  maxWidth: 500,
  backdropFilter: "blur(10px)",
};

export const mobileFormContainer: CSSProperties = {
  ...formContainer,
  padding: "24px 20px",
  maxWidth: "100%",
};

export const formHeader: CSSProperties = {
  textAlign: "center",
  marginBottom: 32,
};

export const formTitle: CSSProperties = {
  color: colors.text,
  fontSize: "1.5rem",
  fontWeight: 700,
  margin: "0 0 8px 0",
  fontFamily: fontFamily,
  letterSpacing: "0.1em",
};

export const formSubtitle: CSSProperties = {
  color: colors.textMuted,
  fontSize: "0.875rem",
  fontWeight: 400,
  margin: 0,
  fontFamily: fontFamily,
};

export const formGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px",
  marginBottom: 32,
};

export const mobileFormGrid: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  marginBottom: 24,
};

export const formGroup: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

export const formLabel: CSSProperties = {
  color: colors.text,
  fontSize: "0.875rem",
  fontWeight: 600,
  fontFamily: fontFamily,
};

export const formInput: CSSProperties = {
  padding: "12px 16px",
  borderRadius: 8,
  border: `1px solid ${colors.border}`,
  background: "rgba(30, 41, 59, 0.6)",
  color: colors.text,
  fontSize: "0.875rem",
  transition: "all 0.2s ease",
  outline: "none",
  fontFamily: fontFamily,
};

export const mobileFormInput: CSSProperties = {
  ...formInput,
  padding: "14px 16px",
  fontSize: "1rem",
};

export const connectButton: CSSProperties = {
  background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentDark})`,
  color: colors.text,
  border: "none",
  padding: "14px 28px",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s ease",
  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
  width: "100%",
  fontFamily: fontFamily,
};

export const mobileConnectButton: CSSProperties = {
  ...connectButton,
  padding: "16px 28px",
  fontSize: "1.1rem",
};

export const connectButtonDisabled: CSSProperties = {
  opacity: 0.6,
  cursor: "not-allowed",
};

export const loadingSpinner: CSSProperties = {
  width: "16px",
  height: "16px",
  border: "2px solid transparent",
  borderTop: "2px solid currentColor",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  marginRight: "8px",
};

// ==================== EMPTY STATE STYLES ====================
export const emptyStateContent: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  textAlign: "center",
  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  padding: "40px 20px",
  fontFamily: fontFamily,
};

export const appTitleContainer: CSSProperties = {
  marginBottom: 48,
  textAlign: "center",
};

export const appTitleMain: CSSProperties = {
  fontSize: "3rem",
  fontWeight: 800,
  fontStyle: "italic",
  background: "linear-gradient(135deg, #f8fafc 0%, #cbd5e1 50%, #94a3b8 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  margin: 0,
  lineHeight: 1.1,
  fontFamily: fontFamily,
  letterSpacing: "-0.02em",
};

export const appTitleAccent: CSSProperties = {
  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontStyle: "italic",
};

export const appTitleSubtitle: CSSProperties = {
  fontSize: "1.15rem",
  fontWeight: 700,
  color: colors.accent,
  letterSpacing: "0.3em",
  textTransform: "uppercase",
  marginTop: 6,

  fontFamily: fontFamily,
};

export const emptyStateTitle: CSSProperties = {
  color: colors.text,
  fontSize: "1.3rem",
  fontWeight: 600,
  marginBottom: 5,
  marginTop: "-20px", // ⬅⬅ naikkan teks judul 20px
  fontFamily: fontFamily,
};

export const emptyStateDescription: CSSProperties = {
  color: colors.textMuted,
  fontSize: "1rem",
  marginBottom: 32,
  maxWidth: 400,
  lineHeight: 1.6,
  fontFamily: fontFamily,
};

export const emptyStateBtn: CSSProperties = {
  background: "#1d4ed8", // biru gelap (blue-700)
  color: colors.text,
  border: "none",
  padding: "13px 24px",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  transition: "none", // hilangkan efek cerah/hover
  boxShadow: "none", // hilangkan glow biru
  fontFamily: fontFamily,
};

export const mobileEmptyStateBtn: CSSProperties = {
  ...emptyStateBtn,
  padding: "14px 30px",
  fontSize: "1rem",
  width: "100%",
  maxWidth: 280,
  justifyContent: "center",
};

export const connectionCounter: CSSProperties = {
  background: "rgba(30, 41, 59, 0.8)",
  color: colors.textSecondary,
  padding: "6px 12px",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 600,
  border: `1px solid ${colors.border}`,
  fontFamily: fontFamily,
};

// Export semua styles dalam satu object untuk kemudahan impor
const styles = {
  toolbar: header,
  btnPrimary: newConnectionButton,
  tab,
  activeTab,
  tabContainer,
  newTabButton,
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
  loadingSpinner,
  connectionCounter,
  // Header
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
  // Empty State
  emptyStateContent,
  appTitleContainer,
  appTitleMain,
  appTitleAccent,
  appTitleSubtitle,
  emptyStateTitle,
  emptyStateDescription,
  emptyStateBtn,
  mobileEmptyStateBtn,
};

export default styles;
