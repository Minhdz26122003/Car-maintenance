import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography } from "@mui/material";
import url from "../../../ipconfixad.js";

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Gửi yêu cầu đăng nhập đến API
    try {
      const response = await fetch(`${url}myapi/dangnhapad.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }), // Gửi thông tin đăng nhập
      });

      const data = await response.json();

      if (data.success) {
        onLogin(data.user); // Lưu thông tin người dùng
        navigate("/"); // Điều hướng đến trang chính
      } else {
        setError(data.message); // Hiển thị thông báo lỗi
      }
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại."); // Xử lý lỗi
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
      {error && <Typography color="error">{error}</Typography>}
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Đăng Nhập
      </Button>
    </Box>
  );
};

export default LoginPage;
