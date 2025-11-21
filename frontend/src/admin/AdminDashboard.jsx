// src/admin/AdminDashboard.jsx
import React, { useState } from "react";
import UnapprovedQuestions from "./components/UnapprovedQuestions";
import ChatHistory from "./components/ChatHistory";
import FeedbackManager from "./components/FeedbackManager";
import AnalyticsPanel from "./components/AnalyticsPanel";
import AnswerEditor  from "./components/AnswerEditor";
import "./components/AdminStyles.css";
import axios from "axios";
const AdminDashboard = () => {
  const [view, setView] = useState("unapproved");

  return (
    <div className="admin-dashboard">
      <h2>Admin Paneli</h2>
      <nav>
        <button className={view === "unapproved" ? "active" : ""} onClick={() => setView("unapproved")}>Onaysız Sorular</button>

        <button onClick={() => setView("history")}>Konuşma Geçmişi</button>
        <button onClick={() => setView("feedback")}>Geri Bildirimler</button>
        <button onClick={() => setView("analytics")}>İstatistikler</button><button onClick={() => {localStorage.removeItem("isAdmin");window.location.reload();}}>Çıkış Yap</button>
        <button onClick={() => setView("editor")}>Cevap Düzenleyici</button>
          <button
  onClick={async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/export_finetune_data");
      alert(`Export tamamlandı. Yeni eklenen: ${res.data.exported}`);
    } catch (err) {
      alert("Export sırasında hata oluştu");
    }
  }}
>
  Fine-tuning verilerini dışa aktar
</button>
          <button
  onClick={() => window.open("http://localhost:5000/api/download_fine_tune_data")}
>
  📤 Fine-Tuning Verisini İndir
</button>


      </nav>

      {view === "unapproved" && <UnapprovedQuestions />}
      {view === "history" && <ChatHistory />}
      {view === "feedback" && <FeedbackManager />}
      {view === "analytics" && <AnalyticsPanel />}
        {view === "editor" && <AnswerEditor />}
    </div>
  );
};

export default AdminDashboard;
