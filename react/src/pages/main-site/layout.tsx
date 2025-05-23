import React from "react";
import Nav from "./navbar";
import Topbar from "./topbar";

const layoutStyle: React.CSSProperties = {
  display: "flex",
  height: "100vh",
};

const contentLayoutStyle: React.CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
};

const pageContentStyle: React.CSSProperties = {
  flex: 1,
  padding: "20px",
  backgroundColor: "#f8f9fa",
};

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div style={layoutStyle}>
      <Nav />
      <div style={contentLayoutStyle}>
        <Topbar />
        <div style={pageContentStyle}>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
