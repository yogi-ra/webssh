// src/App.tsx → VERSI FINAL YANG 100% WORK!

import "./index.css";
import SshPage from "./SshPage";
import { useEffect, useState } from "react";

export function App() {
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await fetch("http://localhost:8000/health", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Unauthorized");
      }
      setLoading(false);
    } catch (err) {
      window.location.href = "http://localhost:3000/login?return_to=" + encodeURIComponent(window.location.href);
    }
  };

  checkAuth();

  // Optional: cek setiap 30 detik
  const interval = setInterval(checkAuth, 30000);
  return () => clearInterval(interval);
}, []);

  // Tampilkan loading sementara cek auth
  if (loading) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
        color: "#fff",
        fontFamily: "Poppins, sans-serif",
        flexDirection: "column",
        gap: "1rem"
      }}>
        <div style={{ fontSize: "1.5rem" }}> Checking authentication...</div>
        <div style={{ fontSize: "0.9rem", opacity: 0.7 }}>Please wait</div>
      </div>
    );
  }

  return <SshPage />;
}

export default App;