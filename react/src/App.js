import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import LoginPage from "./pages/login.js";
import CreateAcctPage from "./pages/createacct.js";
import TermsCond from "./pages/termscond.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/create" element={<CreateAcctPage />} />
        <Route path="/create/termsandconditions" element={<TermsCond />} />
      </Routes>
    </Router>
  );
}

export default App;
