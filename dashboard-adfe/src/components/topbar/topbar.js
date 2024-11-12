import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, IconButton, Button } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
const TopBar = ({ username, onLogout }) => {
  return (
    <AppBar
      position="fixed"
      style={{
        background: "#fff",
        color: "#333",
        marginTop: 5,
        width: "82%",
        borderRadius: 20,
      }}
    >
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Admin Dashboard
        </Typography>
        <IconButton color="inherit">
          <NotificationsIcon />
        </IconButton>
        <IconButton color="inherit" style={{ display: "flex" }}>
          <Link to="/profile">
            <AccountCircleIcon />
            <Typography style={{ marginLeft: 5 }}>{username}</Typography>
          </Link>
        </IconButton>
        {/* Nút Đăng xuất */}
        <Button color="inherit" onClick={onLogout}>
          <LogoutIcon />
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
