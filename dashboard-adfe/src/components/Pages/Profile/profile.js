import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Paper,
  Snackbar,
} from "@mui/material";
import Changepass from "../Profile/changepass";
import url from "../../../ipconfixad.js";
const Profile = ({ user }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username || ""); // Kiểm tra và gán giá trị mặc định
      setEmail(user.email || "");
      setPhone(user.sodienthoai || "");
      setAddress(user.diachi || "");
    }
  }, [user]);

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleChangePassword = async ({ currentPassword, newPassword }) => {
    try {
      const response = await fetch(`${url}myapi/Taikhoan/dmk.php`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          iduser: user.id,
          currentPassword,
          newPassword,
        }),
      });

      const textResponse = await response.text();
      console.log("Raw response:", textResponse);

      const data = JSON.parse(textResponse);
      console.log("Parsed response:", data);

      if (data.success) {
        setSnackbarMessage("Đổi mật khẩu thành công!");
      } else {
        setSnackbarMessage(data.message || "Đổi mật khẩu thất bại!");
      }
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Lỗi khi đổi mật khẩu:", error);
      setSnackbarMessage("Có lỗi xảy ra. Vui lòng thử lại.");
      setSnackbarOpen(true);
    } finally {
      handleCloseDialog();
    }
  };

  if (!user) {
    return (
      <Typography>Vui lòng đăng nhập để xem thông tin cá nhân.</Typography>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 4,
        maxWidth: 800,
        margin: "auto",
        marginTop: 4,
        borderRadius: 3,
      }}
    >
      <Typography variant="h5" sx={{ textAlign: "center", marginBottom: 2 }}>
        Thông Tin Tài Khoản
      </Typography>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Avatar sx={{ width: 100, height: 100, marginBottom: 2 }} />
        <Typography variant="h6">{username}</Typography>
        <Button
          onClick={handleOpenDialog}
          variant="contained"
          color="success"
          sx={{ marginTop: 2 }}
        >
          Đổi mật khẩu
        </Button>
      </Box>

      {/* Dialog đổi mật khẩu */}
      <Changepass
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onChangePassword={handleChangePassword}
      />

      {/* Thông tin cơ bản */}
      <Grid container spacing={3} sx={{ marginTop: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Thông tin cơ bản
            </Typography>
            <Typography>
              <strong>Tên đăng nhập:</strong> {username}
            </Typography>
            <Typography>
              <strong>Địa chỉ:</strong> {address}
            </Typography>
          </Paper>
        </Grid>

        {/* Liên hệ */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Liên hệ
            </Typography>
            <Typography>
              <strong>Email:</strong> {email}
            </Typography>
            <Typography>
              <strong>Số điện thoại:</strong> {phone}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Snackbar hiển thị thông báo */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Paper>
  );
};

export default Profile;
