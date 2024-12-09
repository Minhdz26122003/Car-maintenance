import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Button,
  Box,
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";

const TopBar = ({ username, onLogout, title }) => {
  const navigate = useNavigate();
  const profile = () => {
    navigate("/profile");
  };
  return (
    <AppBar
      position="fixed"
      sx={{
        background: "#fff",
        color: "#333",
        boxShadow: 1,
        borderRadius: 5,
        width: "calc(100% - 280px)",
        margin: "10px auto",
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: "bold", color: "#333" }}
        >
          {title}
        </Typography>

        {/* Icon thông báo */}
        <IconButton color="inherit">
          <NotificationsIcon sx={{ color: "#666" }} />
        </IconButton>

        {/* Hiển thị tên và avatar */}
        <Button
          onClick={profile}
          sx={{ display: "flex", alignItems: "center", marginLeft: 2 }}
        >
          <Typography sx={{ marginRight: 1, fontWeight: "500" }}>
            {username}
          </Typography>
          <Avatar alt={username} sx={{ width: 36, height: 36 }} />
        </Button>

        {/* Nút đăng xuất */}
        <IconButton color="inherit" onClick={onLogout}>
          <LogoutIcon sx={{ color: "#666" }} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
