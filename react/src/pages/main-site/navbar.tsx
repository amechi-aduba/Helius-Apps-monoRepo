// src/pages/main-site/navbar.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// ← adjust to wherever your file really lives relative to this component:
import HeliusLogo from "../../img/logo.png";

const navContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  fontFamily: "'Inter', sans-serif",
  backgroundColor: "#4EC1E8",
  color: "#fff",
  width: "200px",
  height: "100vh",
  paddingTop: "20px",
};

const baseNavItemStyle: React.CSSProperties = {
  height: "40px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  fontWeight: "bold",
  color: "black",
  borderRadius: "10px",
  margin: "5px 10px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  transition: "background-color 0.3s ease, transform 0.2s ease",
};

const logoContainerStyle: React.CSSProperties = {
  marginBottom: "30px",
  padding: "0 20px",
  display: "flex",
  justifyContent: "center",
};

const logoStyle: React.CSSProperties = {
  width: "100%", // or set a fixed px e.g. '150px'
  height: "auto",
};

const Nav: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "User Overview", path: "/user-overview" },
    { label: "Chatbot", path: "/chatbot" },
    { label: "Messages", path: "/messages" },
  ];

  return (
    <nav style={navContainerStyle}>
      <div style={logoContainerStyle}>
        <img src={HeliusLogo} alt="Helius Health" style={logoStyle} />
      </div>

      {navItems.map((item, index) => (
        <div
          key={item.path}
          onClick={() => navigate(item.path)}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={{
            ...baseNavItemStyle,
            backgroundColor: hoveredIndex === index ? "#3AAACF" : "transparent",
            transform: hoveredIndex === index ? "scale(1.03)" : "scale(1)",
          }}
        >
          {item.label}
        </div>
      ))}
    </nav>
  );
};

export default Nav;
