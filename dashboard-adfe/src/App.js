import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/sidebar/sidebar";
import TopBar from "./components/topbar/topbar";
import Dashboard from "./components/Pages/Dashboard/Dashboard";
import Account from "./components/Pages/Account/Account";
import Service from "./components/Pages/Services/service";
import Center from "./components/Pages/Centers/centers";
import Sale from "./components/Pages/Sales/Sales";
import Booking from "./components/Pages/Booking/Booking";
import Login from "./components/Pages/Login/Login"; // Import the login page
import Profile from "./components/Pages/Profile/profile"; // Import the login page
import { Box } from "@mui/material";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(
    localStorage.getItem("username") || null
  );

  // const handleLogin = (username, userData) => {
  //   setLoggedInUser(username);
  //   setUser(userData);
  //   localStorage.setItem("username", username);
  // };
  const handleLogin = (userData) => {
    setLoggedInUser(userData.username); // Lưu tên đăng nhập
    setUser(userData); // Lưu thông tin người dùng

    // Lưu thông tin người dùng vào localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("username", userData.username); // Lưu tên đăng nhập nếu cần
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem("username");
  };
  const handleUpdateProfile = (updatedUser) => {
    setUser(updatedUser); // Cập nhật thông tin người dùng
    localStorage.setItem("user", JSON.stringify(updatedUser)); // Cập nhật localStorage
  };

  const PrivateRoute = ({ element }) => {
    return loggedInUser ? element : <Navigate to="/login" />;
  };

  return (
    <div className="App">
      <div className="AppGlass">
        <Router>
          {loggedInUser && <Sidebar className="side" />}
          <Box sx={{ flexGrow: 1, padding: "20px" }}>
            {loggedInUser && (
              <TopBar username={loggedInUser} onLogout={handleLogout} />
            )}
            <Routes>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route
                path="/"
                element={<PrivateRoute element={<Dashboard />} />}
              />
              <Route
                path="/account"
                element={<PrivateRoute element={<Account />} />}
              />
              <Route
                path="/service"
                element={<PrivateRoute element={<Service />} />}
              />
              <Route
                path="/center"
                element={<PrivateRoute element={<Center />} />}
              />
              <Route
                path="/sale"
                element={<PrivateRoute element={<Sale />} />}
              />
              <Route
                path="/booking"
                element={<PrivateRoute element={<Booking />} />}
              />
              <Route
                path="/profile"
                element={<Profile user={user} onUpdate={handleUpdateProfile} />}
              />{" "}
            </Routes>
          </Box>
        </Router>
      </div>
    </div>
  );
}

export default App;
