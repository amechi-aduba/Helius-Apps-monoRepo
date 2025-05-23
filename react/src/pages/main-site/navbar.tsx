import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const navContainerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  fontFamily: "'Inter', sans-serif",
  backgroundColor: "#4EC1E8",
  color: "#fff",
  width: "200px",
  height: "100vh",
  paddingTop: "20px",
  fontFamily: "sans-serif",
};

const baseNavItemStyle: React.CSSProperties = {
  height: "40px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "'Inter', sans-serif",
  cursor: "pointer",
  fontWeight: "bold",
  color: "black",
  borderRadius: "10px",
  margin: "5px 10px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  transition: "background-color 0.3s ease, transform 0.2s ease",
};

const logoStyle: React.CSSProperties = {
  fontSize: "20px",
  fontFamily: "'Inter', sans-serif",
  marginBottom: "30px",
  padding: "0 20px",
};

const Nav: React.FC = () => {
  const navigate = useNavigate();

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navItems = [
    { label: "Home", path: "/" },
    { label: "User Overview", path: "/user-overview" },
    { label: "Analytics", path: "/analytics" },
    { label: "Reports", path: "/reports" },
    { label: "Campaigns", path: "/campaigns" },
    { label: "Chatbot", path: "/chatbot" },
  ];

  return (
    <nav style={navContainerStyle}>
      <div style={logoStyle}>
        <span>HELIUS</span>
      </div>
      {navItems.map((item, index) => (
        <div
          key={index}
          onClick={() => navigate(item.path)}
          style={{
            ...baseNavItemStyle,
            backgroundColor: hoveredIndex === index ? "#3AAACF" : "transparent",
            transform: hoveredIndex === index ? "scale(1.03)" : "scale(1)",
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <span>{item.label}</span>
        </div>
      ))}
    </nav>
  );
};

export default Nav;
