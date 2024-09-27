// Sidebar.js
import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
} from "@mui/material";
import "./sidebar.css";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SettingsIcon from "@mui/icons-material/Settings";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import PersonIcon from "@mui/icons-material/Person";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const items = [
    { text: "Dashboard", icon: <DashboardIcon />, link: "/" },
    { text: "Accounts", icon: <PersonIcon />, link: "/account" },
    { text: "Services", icon: <RoomServiceIcon />, link: "/service" },
    { text: "Centers", icon: <MapsHomeWorkIcon />, link: "/center" },
    { text: "Sales", icon: <LoyaltyIcon />, link: "/sale" },
    { text: "Settings", icon: <SettingsIcon />, link: "/settings" },
  ];
  return (
    <Drawer classes={{ paper: "sidebar-container" }} variant="permanent">
      <List>
        {items.map((item, index) => (
          <ListItem
            button
            component={Link}
            to={item.link}
            key={index}
            className={`sidebar-item ${
              location.pathname === item.link ? "active" : ""
            }`}
          >
            <ListItemIcon
              className={`sidebar-icon ${
                location.pathname === item.link ? "active" : ""
              }`}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
