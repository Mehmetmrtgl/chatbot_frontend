import React from "react";
import "./MessageBubble.css";

function MessageBubble({ message }) {
  const bubbleClass = message.sender === "user" ? "user-bubble" : "bot-bubble";

  const handleFeedback = async (liked) => {
    await fetch("http://localhost:5001/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: message.text,
        feedback: liked ? "like" : "dislike",
      }),
    });
  };

  return (
    <div className={`message-bubble ${bubbleClass}`}>
      {message.text}
      {message.sender === "bot" && (
        <div className="feedback-buttons">
          <button onClick={() => handleFeedback(true)}>👍</button>
          <button onClick={() => handleFeedback(false)}>👎</button>
        </div>
      )}
    </div>
  );
}

export default MessageBubble;
