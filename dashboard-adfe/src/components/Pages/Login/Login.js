import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import url from "../../../ipconfixad.js";

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(
    JSON.parse(localStorage.getItem("rememberMe")) || false
  );
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Hàm quản lý localStorage
  const handleLocalStorage = (remember, user = "", pass = "") => {
    if (remember) {
      localStorage.setItem("username", user);
      localStorage.setItem("password", pass);
      localStorage.setItem("rememberMe", true);
      sessionStorage.setItem("username", user);
    } else {
      localStorage.removeItem("username");
      localStorage.removeItem("password");
      localStorage.removeItem("rememberMe");
      sessionStorage.setItem("username", user);
    }
  };

  useEffect(() => {
    if (rememberMe) {
      const savedUsername = localStorage.getItem("username");
      const savedPassword = localStorage.getItem("password");
      if (savedUsername && savedPassword) {
        setUsername(savedUsername);
        setPassword(savedPassword);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${url}myapi/dangnhapad.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Không thể kết nối đến server.");
      }

      const data = await response.json();

      if (data.success) {
        onLogin(data.user, rememberMe);
        handleLocalStorage(rememberMe, username, password);
        navigate("/");
      } else {
        setError(data.message || "Đăng nhập thất bại.");
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: 300,
        margin: "auto",
        marginTop: "100px",
        padding: 3,
        boxShadow: 3,
        borderRadius: 2,
        textAlign: "center",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Đăng Nhập
      </Typography>
      <TextField
        label="Tên đăng nhập"
        variant="outlined"
        fullWidth
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Mật khẩu"
        variant="outlined"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        margin="normal"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
        }
        label="Ghi nhớ đăng nhập"
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Đăng Nhập
      </Button>
    </Box>
  );
};

export default LoginPage;
