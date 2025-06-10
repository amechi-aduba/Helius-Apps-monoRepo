import React from "react";
import { FiRefreshCw, FiBell, FiUser } from "react-icons/fi";

const topbarStyle: React.CSSProperties = {
  display: "flex",
  fontFamily: "'Inter', sans-serif",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: "#4EC1E8",
  color: "#333",
  padding: "10px 20px",
  borderBottom: "1px solid #e0e0e0",
};

const leftGroupStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const dashboardTitleStyle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: "500",
  color: "#333",
};

const refreshIconStyle: React.CSSProperties = {
  cursor: "pointer",
  fontSize: "16px",
  color: "#555",
  marginLeft: "5px",
};

const rightGroupStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "20px",
};

const datePickerStyle: React.CSSProperties = {
  padding: "5px 10px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  minWidth: "150px",
};

const timePickerStyle: React.CSSProperties = {
  padding: "5px 10px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  marginLeft: "5px",
};

const iconStyle: React.CSSProperties = {
  cursor: "pointer",
  fontSize: "18px",
  color: "#555",
};

const Topbar: React.FC = () => {
  return (
    <div style={topbarStyle}>
      <div style={leftGroupStyle}>
        <span style={dashboardTitleStyle}></span>
        <FiRefreshCw style={refreshIconStyle} title="Refresh" />
      </div>

      <div style={rightGroupStyle}>
        <div style={{ display: "flex" }}>
          <div style={datePickerStyle}>January 1, 2025</div>
          <div style={timePickerStyle}>HH:MM</div>
        </div>
        <FiBell style={iconStyle} title="Notifications" />
        <FiUser style={iconStyle} title="Profile" />
      </div>
    </div>
  );
};

export default Topbar;
