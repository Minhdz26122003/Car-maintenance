// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/sidebar/sidebar";
import TopBar from "./components/topbar/topbar";
import Dashboard from "./components/Pages/Dashboard/Dashboard";
import Account from "./components/Pages/Account/Account";
import Service from "./components/Pages/Services/service";
import Center from "./components/Pages/Centers/centers";
import Sale from "./components/Pages/Sales/Sales";
import { Box } from "@mui/material";
import "./App.css";

function App() {
  return (
    <div className="App">
      <div className="AppGlass">
        <Router>
          <Sidebar />
          <Box sx={{ flexGrow: 1, padding: "20px" }}>
            <TopBar className="Topbarall" />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/account" element={<Account />} />
              <Route path="/service" element={<Service />} />
              <Route path="/center" element={<Center />} />
              <Route path="/sale" element={<Sale />} />
            </Routes>
          </Box>
        </Router>
      </div>
    </div>
  );
}

export default App;
