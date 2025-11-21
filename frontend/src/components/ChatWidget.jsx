import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ChatWidget.css";
import { v4 as uuidv4 } from "uuid";
import { FaThumbsUp,FaThumbsDown } from "react-icons/fa";
const session_id = uuidv4();

const ChatWidget = () => {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Merhaba! Hacettepe Üniversitesi Kütüphane Botuna Hoşgeldin!",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [topSuggestion, setTopSuggestion] = useState("");
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [chatEnded, setChatEnded] = useState(false); // ✅ sohbet bitti mi

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (messages.length === 1 || last?.role === "user") {
      axios
        .post("http://localhost:5000/api/suggested_questions", {
          last_question: last?.text || "",
        })
        .then((res) => {
          setSuggestions(res.data.questions || []);
          setTopSuggestion(res.data.questions?.[0] || "");
        });
    }
  }, [messages]);

  const sendMessage = async (overrideText = null) => {
    const question = overrideText || input;
    if (!question.trim()) return;

    const newMessages = [
      ...messages,
      {
        role: "user",
        text: question,
        timestamp: new Date().toLocaleTimeString(),
      },
    ];
    setMessages(newMessages);
    setIsTyping(true);
    setAutocompleteSuggestions([]);

    try {
      const res = await axios.post("http://localhost:5000/chat", {
        question,
        chat_history: newMessages.map(({ role, text }) => ({ role, text })),
        session_id,
      });

      const replyMsg = {
        role: "bot",
        text:
          typeof res.data.answer === "string"
            ? res.data.answer
            : res.data.answer?.answer || "Cevap alınamadı.",
        timestamp: new Date().toLocaleTimeString(),
        question_id: res.data.question_id || null,
        response: res.data,
      };

      setMessages((prev) => [...prev, replyMsg]);
      setTopSuggestion(res.data.suggestions?.[0] || "");

      if (res.data.status === "ended") {
        setChatEnded(true); // ✅ sohbet bitti işareti
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Sunucudan cevap alınamadı.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }

    setIsTyping(false);
    setInput("");
  };

  const handleSuggestionClick = (text) => {
    setInput("");
    sendMessage(text);
  };

  const sendFeedback = async (question_id, isLiked) => {
    try {
      await axios.post("http://localhost:5000/api/feedback", {
        question_id,
        is_liked: isLiked,
        session_id,
      });
      alert("Geri bildiriminiz için teşekkürler!");
    } catch {
      alert("Geri bildirim gönderilemedi.");
    }
  };

  const fetchAutocomplete = async (text) => {
    if (!text.trim()) {
      setAutocompleteSuggestions([]);
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/autocomplete", {
        prefix: text,
      });
      setAutocompleteSuggestions(res.data.suggestions || []);
    } catch {
      setAutocompleteSuggestions([]);
    }
  };

  const restartChat = () => {
    setMessages([
      {
        role: "bot",
        text: "Merhaba! Yeni bir sohbete başlayalım!",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    setChatEnded(false);
    setInput("");
    setSuggestions([]);
    setTopSuggestion("");
    setAutocompleteSuggestions([]);
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="text">{msg.text}</div>
            <div className="timestamp">{msg.timestamp}</div>
            {msg.role === "bot" && msg.question_id && (
              <div className="feedback-buttons">
                <button onClick={() => sendFeedback(msg.question_id, true)}><FaThumbsUp /></button>
                <button onClick={() => sendFeedback(msg.question_id, false)}><FaThumbsDown /></button>
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="message bot typing-indicator">
            <div className="text">Yazıyor...</div>
          </div>
        )}

        {messages.length > 1 && topSuggestion && (
          <div className="top-suggestion">
            <strong>Bunu mu demek istediniz?</strong> <br />
            <button onClick={() => handleSuggestionClick(topSuggestion)}>
              {topSuggestion}
            </button>
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="suggested-questions sticky">
          <h4>Popüler Sorular</h4>
          <ul>
            {suggestions.map((q, i) => (
              <li key={i}>
                <button onClick={() => handleSuggestionClick(q)}>{q}</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ✅ Sohbet bitince mesaj kutusu yerine “yeniden başlat” butonu */}
      {chatEnded ? (
        <div className="chat-ended">
          <p>Görüşme sona erdi.</p>
          <button onClick={restartChat}>Yeni Sohbete Başla</button>
        </div>
      ) : (
        <div className="input-area">
          <div className="input-wrapper">
            <input
              value={input}
              onChange={(e) => {
                const val = e.target.value;
                setInput(val);
                fetchAutocomplete(val);
              }}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Bir şey yazın..."
            />

            {autocompleteSuggestions.length > 0 && (
              <ul className="autocomplete-list">
                {autocompleteSuggestions.map((s, i) => (
                  <li key={i} onClick={() => handleSuggestionClick(s)}>
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button onClick={() => sendMessage()}>Gönder</button>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
