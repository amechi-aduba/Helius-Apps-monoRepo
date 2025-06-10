import React, { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule,
  ColDef,
  ICellRendererParams,
} from "ag-grid-community";
import Layout from "./layout";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

ModuleRegistry.registerModules([AllCommunityModule]);

// Type definition for row data
interface UserData {
  name: string;
  type: string;
  email: string;
  phone: string;
  specialty: string;
  status: "Active" | "Inactive";
  last_active_date: Date;
}

const containerStyle: React.CSSProperties = {
  height: "100%",
  width: "100%",
  padding: "24px",
  fontFamily: "'Inter', sans-serif",
  backgroundColor: "#f8f9fa",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  overflow: "hidden",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  fontFamily: "'Inter', sans-serif",
  alignItems: "center",
  marginBottom: "24px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "28px",
  fontWeight: "600",
  fontFamily: "'Inter', sans-serif",
  color: "#2c3e50",
  margin: 0,
};

const topBarStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 24px",
  borderBottom: "1px solid #e9ecef",
};

const filterBarStyle: React.CSSProperties = {
  display: "flex",
  gap: "8px",
  alignItems: "center",
};

const buttonStyle = (active: boolean): React.CSSProperties => ({
  backgroundColor: active ? "#FF8C42" : "transparent",
  color: active ? "#fff" : "#6c757d",
  border: active ? "1px solid #FF8C42" : "1px solid #dee2e6",
  borderRadius: "20px",
  padding: "8px 16px",
  fontFamily: "'Inter', sans-serif",
  cursor: "pointer",
  fontWeight: active ? "600" : "500",
  fontSize: "14px",
  transition: "all 0.2s ease",
});

const searchContainerStyle: React.CSSProperties = {
  position: "relative",
  display: "flex",
  alignItems: "center",
};

const searchInputStyle: React.CSSProperties = {
  padding: "8px 40px 8px 16px",
  border: "1px solid #dee2e6",
  borderRadius: "6px",
  fontSize: "14px",
  fontFamily: "'Inter', sans-serif",
  width: "250px",
  outline: "none",
};

const searchIconStyle: React.CSSProperties = {
  position: "absolute",
  right: "12px",
  color: "#6c757d",
  pointerEvents: "none",
};

const filterIconStyle: React.CSSProperties = {
  marginLeft: "12px",
  padding: "8px",
  border: "1px solid #dee2e6",
  borderRadius: "6px",
  backgroundColor: "#fff",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

// Custom cell renderer for status
const StatusCellRenderer = (params: ICellRendererParams<UserData, string>) => {
  const isActive = params.value === "Active";
  const statusStyle: React.CSSProperties = {
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
    backgroundColor: isActive ? "#d4edda" : "#f8d7da",
    color: isActive ? "#155724" : "#721c24",
    display: "inline-block",
  };

  return <span style={statusStyle}>{params.value}</span>;
};

// Custom cell renderer for info icon
const InfoCellRenderer = () => {
  const iconStyle: React.CSSProperties = {
    cursor: "pointer",
    color: "#6c757d",
    fontSize: "16px",
  };

  return <span style={iconStyle}>ℹ️</span>;
};

const UserOverview: React.FC = () => {
  const [filter, setFilter] = useState("All");
  const [searchText, setSearchText] = useState("");

  const columnDefs = useMemo<ColDef<UserData>[]>(
    () => [
      {
        headerName: "Name",
        field: "name",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 120,
      },
      {
        headerName: "Type",
        field: "type",
        sortable: true,
        filter: true,
        flex: 1,
        minWidth: 100,
      },
      {
        headerName: "E-Mail",
        field: "email",
        sortable: true,
        filter: true,
        flex: 1.5,
        minWidth: 180,
      },
      {
        headerName: "Phone",
        field: "phone",
        sortable: true,
        flex: 1.2,
        minWidth: 140,
      },
      {
        headerName: "Recommended Specialty",
        field: "specialty",
        sortable: true,
        flex: 1.5,
        minWidth: 180,
      },
      {
        headerName: "Status",
        field: "status",
        sortable: true,
        cellRenderer: StatusCellRenderer,
        flex: 1,
        minWidth: 100,
      },
      // {
      //   headerName: "",
      //   field: "info",
      //   cellRenderer: InfoCellRenderer,
      //   width: 50,
      //   sortable: false,
      //   filter: false,
      // },
    ],
    []
  );

  const specialties: string[] = [
    "Emergency Room",
    "Home Health",
    "Telehealth",
    "Parent-Child",
    "Psychiatric",
    "Rehabilitation",
    "Critical Care",
    "Public Health",
    "Home Health",
  ];

  const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");

  const rowData = useMemo<UserData[]>(() => {
    return storedUsers
      .map((user: any) => ({
        name: user.name,
        type: user.role,
        email: user.email,
        phone: user.phone,
        specialty: specialties[Math.floor(Math.random() * specialties.length)],
        status: Math.random() > 0.5 ? "Active" : "Inactive",
        last_active_date: new Date(
          Date.now() - Math.floor(Math.random() * 10000000000)
        ),
      }))
      .filter((row: UserData) => {
        const matchesFilter =
          filter === "All"
            ? true
            : row.type.toLowerCase() === filter.toLowerCase();

        const matchesSearch =
          searchText === ""
            ? true
            : Object.values(row).some((value) =>
                value
                  .toString()
                  .toLowerCase()
                  .includes(searchText.toLowerCase())
              );

        return matchesFilter && matchesSearch;
      });
  }, [filter, searchText]);

  const gridOptions = {
    headerHeight: 48,
    rowHeight: 52,
    suppressCellFocus: true,
    suppressRowClickSelection: true,
    rowStyle: {
      borderBottom: "1px solid #f1f3f4",
    },
    defaultColDef: {
      resizable: true,
    },
  };

  return (
    <Layout>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>User Database</h1>
        </div>

        <div style={cardStyle}>
          <div style={topBarStyle}>
            <div style={filterBarStyle}>
              {[
                { label: "All", value: "All" },
                { label: "Nurses", value: "Nurse" },
                { label: "Students", value: "Student" },
              ].map(({ label, value }) => (
                <button
                  key={label}
                  style={buttonStyle(filter === value)}
                  onClick={() => setFilter(value)}
                >
                  {label}
                </button>
              ))}
              <div style={filterIconStyle}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
              </div>
            </div>

            <div style={searchContainerStyle}>
              <input
                type="text"
                placeholder="Search"
                style={searchInputStyle}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <div style={searchIconStyle}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
            </div>
          </div>

          <div
            className="ag-theme-alpine"
            style={{
              height: 500,
              width: "100%",
            }}
          >
            <AgGridReact
              columnDefs={columnDefs}
              rowData={rowData}
              gridOptions={gridOptions}
              pagination={true}
              paginationPageSize={10}
              suppressPaginationPanel={false}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserOverview;
