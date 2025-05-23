import React, { useState } from "react";
import Layout from "./layout";
import { FaRobot, FaUser, FaPaperPlane } from "react-icons/fa";

const cardStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  padding: "20px",
  display: "flex",
  fontFamily: "'Inter', sans-serif",
  flexDirection: "column",
  height: "600px",
  maxWidth: "400px",
  margin: "auto",
};

const headerStyle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "bold",
  fontFamily: "'Inter', sans-serif",
  color: "#4c4c4c",
  marginBottom: "10px",
};

const chatBodyStyle: React.CSSProperties = {
  flex: 1,
  overflowY: "auto",
  marginBottom: "15px",
};

const msgRowStyle = (isUser: boolean): React.CSSProperties => ({
  display: "flex",
  justifyContent: isUser ? "flex-end" : "flex-start",
  alignItems: "flex-end",
  marginBottom: "10px",
});

const bubbleStyle = (isUser: boolean): React.CSSProperties => ({
  maxWidth: "70%",
  backgroundColor: isUser ? "#6b5b95" : "#f1f0f0",
  color: isUser ? "white" : "#333",
  padding: "10px 15px",
  borderRadius: "18px",
  borderTopLeftRadius: isUser ? "18px" : "0px",
  borderTopRightRadius: isUser ? "0px" : "18px",
});

const iconStyle: React.CSSProperties = {
  marginRight: "8px",
  fontSize: "18px",
  color: "#6b5b95",
};

const chatFormStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  borderTop: "1px solid #eee",
  paddingTop: "10px",
};

const chatInputStyle: React.CSSProperties = {
  flex: 1,
  padding: "10px",
  borderRadius: "20px",
  border: "1px solid #ccc",
  outline: "none",
};

const sendButtonStyle: React.CSSProperties = {
  marginLeft: "10px",
  padding: "10px 12px",
  borderRadius: "50%",
  backgroundColor: "#6b5b95",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const Chatbot: React.FC = () => {
  return (
    <Layout>
      <div style={headerStyle}>
        <div style={headerStyle}>Chatbot</div>
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <div style={cardStyle}>
          <div style={chatBodyStyle}>
            <div style={msgRowStyle(false)}>
              <FaRobot style={iconStyle} />
              <div style={bubbleStyle(false)}>
                Hello! I’m your assistant. How can I help you today?
              </div>
            </div>
            <div style={msgRowStyle(true)}>
              <div style={bubbleStyle(true)}>Sample user message...</div>
              <FaUser style={{ ...iconStyle, marginRight: 0, marginLeft: 8 }} />
            </div>
          </div>

          <form style={chatFormStyle}>
            <input
              type="text"
              placeholder="Type a message..."
              style={chatInputStyle}
            />
            <button type="submit" style={sendButtonStyle}>
              <FaPaperPlane />
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Chatbot;
