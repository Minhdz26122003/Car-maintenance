import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import url from "../../../ipconfixad.js";

const Profile = ({ user, onUpdate }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username || ""); // Kiểm tra và gán giá trị mặc định
      setEmail(user.email || "");
      setPhone(user.sodienthoai || "");
      setAddress(user.diachi || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault(); // Ngăn chặn reload trang

    try {
      const response = await fetch(`${url}myapi/suaThongTin.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          iduser: user.id,
          username,
          email,
          phone,
          address,
        }), // Gửi tất cả thông tin
      });

      const data = await response.json();

      if (data.success) {
        onUpdate(data.user);
        console.log("Cập nhật thành công");
      } else {
        console.error(data.message); // Hiển thị thông báo lỗi
      }
    } catch (err) {
      console.error("Có lỗi xảy ra khi cập nhật thông tin:", err);
    }
  };

  // Nếu user là null, có thể trả về một thông báo hoặc component khác
  if (!user) {
    return (
      <Typography>Vui lòng đăng nhập để xem thông tin cá nhân.</Typography>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleUpdateProfile}
      sx={{
        width: 400,
        margin: "auto",
        marginTop: "100px",
        padding: 3,
        boxShadow: 3,
        borderRadius: 2,
        textAlign: "center",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Thông Tin Cá Nhân
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
        label="Email"
        variant="outlined"
        type="email"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Số điện thoại"
        variant="outlined"
        fullWidth
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Địa chỉ"
        variant="outlined"
        fullWidth
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        margin="normal"
      />
      {error && <Typography color="error">{error}</Typography>}{" "}
      {/* Hiển thị thông báo lỗi nếu có */}
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Cập Nhật
      </Button>
    </Box>
  );
};

export default Profile;
