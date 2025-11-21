import React, { useState } from "react";
import axios from "axios";
import "./components/AdminStyles.css";

const AdminLogin = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/admin/login", {
        username,
        password,
      });

      if (res.data.status === "ok") {
        localStorage.setItem("admin_token", res.data.token);
        onLoginSuccess(); // ❗ yönlendirmeyi props ile yapıyoruz
      } else {
        alert("Giriş başarısız: Kullanıcı adı veya şifre hatalı.");
      }
    } catch (err) {
      console.error("Sunucu hatası:", err);
      alert("Sunucuya bağlanılamadı.");
    }
  };

  return (
    <div className="admin-login">
      <h2>Admin Girişi</h2>
      <input
        placeholder="Kullanıcı adı"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Giriş Yap</button>
    </div>
  );
};

export default AdminLogin;
