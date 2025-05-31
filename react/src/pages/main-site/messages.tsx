import React, { useState } from "react";
import Layout from "./layout";
import { FaRobot, FaUser, FaPaperPlane } from "react-icons/fa";

const containerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  marginTop: "20px",
  gap: "20px",
};

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
  flex: 1,
};

const userListStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  borderRadius: "10px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  padding: "20px",
  fontFamily: "'Inter', sans-serif",
  height: "600px",
  width: "200px",
  overflowY: "auto",
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

const addUserBoxStyle: React.CSSProperties = {
  marginTop: "10px",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  backgroundColor: "#f9f9f9",
};

const inputStyle: React.CSSProperties = {
  width: "95%",
  padding: "8px",
  marginBottom: "8px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const addButtonStyle: React.CSSProperties = {
  marginTop: "10px",
  padding: "8px 12px",
  backgroundColor: "#6b5b95",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const Messages: React.FC = () => {
  const [users, setUsers] = useState<
    { email: string; name: string; phone: string; role: string }[]
  >([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    phone: "",
    role: "Student",
  });

  const handleAddUser = () => {
    if (!newUser.email || !newUser.name || !newUser.phone) return;
    setUsers([...users, newUser]);
    setNewUser({ email: "", name: "", phone: "", role: "Student" });
    setShowAddUser(false);
    setSelectedUser(users.length);
  };

  return (
    <Layout>
      <div style={headerStyle}>Messages</div>
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={chatBodyStyle}>
            {selectedUser === null ? (
              <p style={{ color: "#888", textAlign: "center" }}>
                No users selected.
              </p>
            ) : (
              <>
                <div style={msgRowStyle(false)}>
                  <FaRobot style={iconStyle} />
                  <div style={bubbleStyle(false)}>
                    Sample message from {users[selectedUser].name}
                  </div>
                </div>
                <div style={msgRowStyle(true)}>
                  <div style={bubbleStyle(true)}>
                    Hello {users[selectedUser].name}! How can I assist you?
                  </div>
                  <FaUser
                    style={{ ...iconStyle, marginRight: 0, marginLeft: 8 }}
                  />
                </div>
              </>
            )}
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

          <button
            onClick={() => setShowAddUser(!showAddUser)}
            style={{ ...addButtonStyle, marginTop: "15px" }}
          >
            ➕ Add User
          </button>

          {showAddUser && (
            <div style={addUserBoxStyle}>
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                style={inputStyle}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                style={inputStyle}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Phone"
                value={newUser.phone}
                style={inputStyle}
                onChange={(e) =>
                  setNewUser({ ...newUser, phone: e.target.value })
                }
              />
              <select
                value={newUser.role}
                style={inputStyle}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
              >
                <option value="Student">Student</option>
                <option value="Nurse">Nurse</option>
              </select>
              <button onClick={handleAddUser} style={addButtonStyle}>
                Add
              </button>
            </div>
          )}
        </div>

        <div style={userListStyle}>
          <h4 style={{ marginBottom: "10px" }}>Users</h4>
          {users.length === 0 ? (
            <p style={{ color: "#999" }}>No users available</p>
          ) : (
            users.map((user, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedUser(idx)}
                style={{
                  padding: "8px",
                  marginBottom: "6px",
                  borderRadius: "6px",
                  backgroundColor: idx === selectedUser ? "#e0e0f0" : "#f5f5f5",
                  cursor: "pointer",
                }}
              >
                {user.name} ({user.role})<br />
                <span style={{ fontSize: "12px", color: "#777" }}>
                  {user.email}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
