import React from "react";
import Layout from "./layout";
import { SciChartSurface } from "scichart-react";
import { SciChartSurface as SciChartCore } from "scichart";
import MountainLine from "./graphs-charts/handleMountainLine";
import BarChart from "./graphs-charts/handleBar";

const dashboardGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gridTemplateRows: "auto auto",
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
  color: "#333",
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#333",
  marginBottom: "20px",
};

const metricValueStyle: React.CSSProperties = {
  fontSize: "32px",
  fontWeight: "bold",
  color: "#333",
  marginBottom: "5px",
};

const metricLabelStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#666",
  fontWeight: "normal",
};

const smallMetricValueStyle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#333",
  marginBottom: "5px",
};

const kpiContainerStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "15px",
  marginTop: "10px",
};

const metricItemStyle: React.CSSProperties = {
  textAlign: "center" as const,
};

const surveyCardStyle: React.CSSProperties = {
  ...cardStyle,
  position: "relative" as const,
};

const chartPlaceholderStyle: React.CSSProperties = {
  height: "120px",
  backgroundColor: "#f8f9fa",
  borderRadius: "5px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#999",
  fontSize: "14px",
  marginTop: "15px",
};

const engagementChartStyle: React.CSSProperties = {
  height: "150px",
  backgroundColor: "#f8f9fa",
  borderRadius: "5px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#999",
  fontSize: "14px",
  marginTop: "15px",
};

const acquisitionBarStyle: React.CSSProperties = {
  height: "120px",
  backgroundColor: "#f8f9fa",
  borderRadius: "5px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#999",
  fontSize: "14px",
  marginTop: "15px",
};

const todoSectionStyle: React.CSSProperties = {
  display: "flex",
  gap: "20px",
  marginTop: "15px",
};

const todoColumnStyle: React.CSSProperties = {
  flex: "1",
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  padding: "15px",
};

const todoColumnTitleStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#333",
  marginBottom: "10px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const todoItemStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#666",
  marginBottom: "8px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const todoIndicatorStyle: React.CSSProperties = {
  width: "20px",
  height: "16px",
  borderRadius: "3px",
  fontSize: "12px",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
};

const checkboxStyle: React.CSSProperties = {
  width: "14px",
  height: "14px",
  borderRadius: "2px",
  border: "2px solid #ddd",
  marginRight: "4px",
};

const completedCheckboxStyle: React.CSSProperties = {
  ...checkboxStyle,
  backgroundColor: "#28a745",
  borderColor: "#28a745",
};

const Home: React.FC = () => {
  return (
    <Layout>
      <div>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Dashboard</h2>
        </div>

        <div style={dashboardGridStyle}>
          {/* Key Performance Indicators Card */}
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>Key Performance Indicators</h3>
            <div style={kpiContainerStyle}>
              <div style={metricItemStyle}>
                <div style={metricValueStyle}>
                  1,000
                  <span
                    style={{
                      color: "#28a745",
                      fontSize: "16px",
                      marginLeft: "5px",
                    }}
                  >
                    ↑
                  </span>
                </div>
                <div style={metricLabelStyle}>Total Sign-ups (Monthly)</div>
              </div>
              <div style={metricItemStyle}>
                <div style={metricValueStyle}>
                  13.2%
                  <span
                    style={{
                      color: "#28a745",
                      fontSize: "16px",
                      marginLeft: "5px",
                    }}
                  >
                    ↑
                  </span>
                </div>
                <div style={metricLabelStyle}>Conversion Rate</div>
              </div>
              <div style={metricItemStyle}>
                <div style={smallMetricValueStyle}>4.6/5</div>
                <div style={metricLabelStyle}>Overall Satisfaction</div>
              </div>
              <div style={metricItemStyle}>
                <div style={smallMetricValueStyle}>
                  35
                  <span style={{ fontSize: "14px", fontWeight: "normal" }}>
                    {" "}
                    minutes
                  </span>
                </div>
                <div style={metricLabelStyle}>Avg. Session Duration</div>
              </div>
            </div>
          </div>

          {/* Survey Completion Rate Card */}
          <div style={surveyCardStyle}>
            <h3 style={cardTitleStyle}>Survey Completion Rate</h3>
            <MountainLine></MountainLine>
          </div>

          {/* User Engagement Card */}
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>User Engagement</h3>
            <MountainLine></MountainLine>
          </div>

          {/* Acquisition Channels Card */}
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>Acquisition Channels</h3>
            <BarChart></BarChart>
          </div>

          {/* To-do List Card - spans remaining columns */}
          <div style={{ ...cardStyle, gridColumn: "span 2" }}>
            <h3 style={cardTitleStyle}>To Do</h3>
            <div style={todoSectionStyle}>
              {/* To Do Column */}
              <div style={todoColumnStyle}>
                <div style={todoColumnTitleStyle}>
                  <div
                    style={{
                      ...todoIndicatorStyle,
                      backgroundColor: "#ffc107",
                    }}
                  >
                    3
                  </div>
                  To Do
                </div>
                <div style={todoItemStyle}>
                  <div style={checkboxStyle}></div>
                  Design new homepage mockup
                </div>
                <div style={todoItemStyle}>
                  <div style={checkboxStyle}></div>
                  Run reports for this month
                </div>
                <div style={todoItemStyle}>
                  <div style={checkboxStyle}></div>
                  Implement user testing
                </div>
              </div>

              {/* In Progress Column */}
              <div style={todoColumnStyle}>
                <div style={todoColumnTitleStyle}>
                  <div
                    style={{
                      ...todoIndicatorStyle,
                      backgroundColor: "#fd7e14",
                    }}
                  >
                    1
                  </div>
                  In Progress
                </div>
                <div style={todoItemStyle}>
                  <div style={checkboxStyle}></div>
                  Add new graphs
                </div>
              </div>

              {/* Completed Column */}
              <div style={todoColumnStyle}>
                <div style={todoColumnTitleStyle}>
                  <div
                    style={{
                      ...todoIndicatorStyle,
                      backgroundColor: "#fd7e14",
                    }}
                  >
                    2
                  </div>
                  Completed
                </div>
                <div style={todoItemStyle}>
                  <div style={completedCheckboxStyle}>✓</div>
                  Update website
                </div>
                <div style={todoItemStyle}>
                  <div style={completedCheckboxStyle}>✓</div>
                  Choose color scheme
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
