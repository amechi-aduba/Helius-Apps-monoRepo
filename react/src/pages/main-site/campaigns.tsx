import React, { useState } from "react";
import Nav from "../main-site/navbar";
import Layout from "./layout";

const dashboardGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "20px",
  marginTop: "20px",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  fontFamily: "'Inter', sans-serif",
  borderRadius: "10px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  padding: "20px",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  fontFamily: "'Inter', sans-serif",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "bold",
};

const Campaigns: React.FC = () => {
  return (
    <Layout>
      <div>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Campaigns</h2>
        </div>

        <div style={dashboardGridStyle}>
          <div style={cardStyle}>
            <h3>
              TODO: Create a "todo list" where you can create campaigns, give
              them dates for completion
            </h3>
          </div>
          <div style={cardStyle}>
            <h3>TODO: Create a calendar displaying each campaign</h3>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Campaigns;
