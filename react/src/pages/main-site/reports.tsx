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
  borderRadius: "10px",
  fontFamily: "'Inter', sans-serif",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  padding: "20px",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  fontFamily: "'Inter', sans-serif",
  alignItems: "center",
  marginBottom: "20px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "bold",
};

const Reports: React.FC = () => {
  return (
    <Layout>
      <div>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Reports</h2>
        </div>

        <div style={dashboardGridStyle}>
          <div style={cardStyle}>
            <h3>
              TODO: Create grid displaying the supabase data tables, with
              functions to export into csvs
            </h3>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
