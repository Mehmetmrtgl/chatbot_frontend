import React, { useState } from "react";
import ChatWidget from "./components/ChatWidget";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";

export default function App() {
  const [view, setView] = useState("chat");
  const isAdmin = localStorage.getItem("admin_token");

  return (
    <>
      <nav>
        <button onClick={() => setView("chat")}>ChatBot</button>
        <button onClick={() => setView("admin")}>Admin Giriş</button>
        {isAdmin && <button onClick={() => setView("dashboard")}>Admin Paneli</button>}
      </nav>

      {view === "chat" && <ChatWidget />}
      {view === "admin" && <AdminLogin onLoginSuccess={() => setView("dashboard")} />}
      {view === "dashboard" && isAdmin && <AdminDashboard />}
    </>
  );
}
