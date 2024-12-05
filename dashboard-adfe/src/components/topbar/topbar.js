import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, IconButton, Button } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import "../topbar/topbar.css"; // Import style riêng
import { useNavigate } from "react-router-dom";

const TopBar = ({ username, onLogout }) => {
  return (
    <AppBar
      position="fixed"
      className="topbar"
      style={{
        background: "#fff",
        color: "#333",
        marginTop: 5,
        width: "82%",
        borderRadius: 20,
      }}
    >
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1, fontWeight: "bold" }}>
          HỆ THỐNG QUẢN TRỊ APP
        </Typography>

        {/* Icon thông báo */}
        <IconButton color="inherit">
          <NotificationsIcon />
        </IconButton>

        {/* Icon tài khoản */}
        <div className="profile-icon">
          <Link
            to="/profile"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <AccountCircleIcon />
            <Typography style={{ marginLeft: 5 }}>{username}</Typography>
          </Link>
        </div>

        {/* Nút đăng xuất */}
        <Button color="inherit" className="logout-btn" onClick={onLogout}>
          <LogoutIcon />
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
