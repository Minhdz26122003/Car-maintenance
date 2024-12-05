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
    sessionStorage.getItem("username") || null
  );

  const handleLogin = (userData, rememberMe) => {
    setLoggedInUser(userData.username);
    setUser(userData);

    // Nếu "Ghi nhớ đăng nhập",  lưu vào localStorage
    if (rememberMe) {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("username", userData.username);
      localStorage.setItem("rememberMe", rememberMe);
      sessionStorage.removeItem("user", JSON.stringify(userData));
    } else {
      // Nếu không, lưu vào sessionStorage
      sessionStorage.setItem("user", JSON.stringify(userData));
      sessionStorage.setItem("username", userData.username);
      localStorage.setItem("rememberMe", rememberMe);
      sessionStorage.removeItem("user", JSON.stringify(userData));
    }
  };

  const handleUpdateProfile = (updatedUser) => {
    setUser(updatedUser);
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
  };
  const handleLogout = () => {
    setLoggedInUser(null);
    setUser(null);

    // Xóa thông tin đăng nhập khỏi localStorage nếu không có "Ghi nhớ đăng nhập"
    if (!JSON.parse(localStorage.getItem("rememberMe"))) {
      localStorage.removeItem("user");
      localStorage.removeItem("username");
      localStorage.removeItem("rememberMe");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("username");
    }
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
