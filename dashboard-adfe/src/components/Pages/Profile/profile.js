import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Alert,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Avatar,
  Grid,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import url from "../../../ipconfixad.js";
const Profile = ({ user }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const [selectedAccount, setSelectedAccount] = useState({
    username: "",
    email: "",
    password: "",
    sodienthoai: "",
    diachi: "",
  });
  useEffect(() => {
    if (user) {
      setUsername(user?.username || "");
      setEmail(user?.email || "");
      setPhone(user?.sodienthoai || "");
      setAddress(user?.diachi || "");
    }
  }, [user]);

  const handleEdit = () => {
    setSelectedAccount({
      username,
      email,
      sodienthoai: phone,
      diachi: address,
    });
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };

  const handleEditSubmit = async () => {
    try {
      const response = await axios.put(`${url}myapi/Taikhoan/suataikhoan.php`, {
        iduser: user.id,
        ...selectedAccount,
      });

      if (response.data?.success) {
        setSnackbarMessage("Sửa tài khoản thành công!");
        handleLogout();
      } else {
        setSnackbarMessage(response.data?.message || "Sửa tài khoản thất bại!");
      }

      setSnackbarOpen(true);
    } catch (error) {
      console.error("Lỗi khi sửa tài khoản:", error);
      setSnackbarMessage("Có lỗi xảy ra. Vui lòng thử lại.");
      setSnackbarOpen(true);
    } finally {
      setOpenEdit(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("username");
    localStorage.removeItem("rememberMe");
  };
  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải ít nhất 6 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    setError(""); // Xóa lỗi nếu có

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

      const data = await response.json();

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
        textAlign: "center",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h5">Thông Tin Tài Khoản</Typography>
        <Avatar sx={{ margin: "10px auto", width: 100, height: 100 }} />
        <Typography variant="h6">{username}</Typography>
      </Box>

      {/* Nút sửa thông tin và đổi mật khẩu */}
      <Box
        sx={{ display: "flex", justifyContent: "center", gap: 2, marginTop: 2 }}
      >
        <Button
          onClick={handleEdit}
          color="secondary"
          sx={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "8px",
            backgroundColor: "#009900",
            color: "#fff", // Màu chữ
            "&:hover": {
              backgroundColor: "#FF9900",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            },
            textTransform: "none",
            transition: "all 0.3s ease",
          }}
        >
          Sửa thông tin cá nhân
        </Button>

        <Button
          onClick={handleOpenDialog}
          color="secondary"
          sx={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "8px",
            backgroundColor: "#009900",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#FF9900",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            },
            textTransform: "none",
            transition: "all 0.3s ease",
          }}
        >
          Đổi mật khẩu
        </Button>
      </Box>

      {/* Dialog đổi mật khẩu */}

      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Đổi Mật Khẩu</DialogTitle>
        <DialogContent>
          <TextField
            label="Mật khẩu hiện tại"
            type="password"
            fullWidth
            margin="normal"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextField
            label="Mật khẩu mới"
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="Xác nhận mật khẩu mới"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <Typography color="error">{error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="warning">
            Hủy
          </Button>
          <Button onClick={handleChangePassword} color="primary">
            Đổi Mật Khẩu
          </Button>
        </DialogActions>
      </Dialog>
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
      >
        <Alert
          severity={
            snackbarMessage.includes("thành công") ? "success" : "error"
          }
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Dialog sửa*/}
      <Dialog open={openEdit} onClose={handleEditClose}>
        <DialogTitle>Edit Account</DialogTitle>
        <DialogContent>
          {selectedAccount && (
            <>
              <TextField
                label="Username"
                fullWidth
                margin="normal"
                value={selectedAccount.username || ""}
                onChange={(e) =>
                  setSelectedAccount({
                    ...selectedAccount,
                    username: e.target.value,
                  })
                }
              />
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                value={selectedAccount.email || ""}
                onChange={(e) =>
                  setSelectedAccount({
                    ...selectedAccount,
                    email: e.target.value,
                  })
                }
              />

              <TextField
                label="Phone"
                fullWidth
                margin="normal"
                value={selectedAccount.sodienthoai || ""}
                onChange={(e) =>
                  setSelectedAccount({
                    ...selectedAccount,
                    sodienthoai: e.target.value,
                  })
                }
              />
              <TextField
                label="Address"
                fullWidth
                margin="normal"
                value={selectedAccount.diachi || ""}
                onChange={(e) =>
                  setSelectedAccount({
                    ...selectedAccount,
                    diachi: e.target.value,
                  })
                }
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="warning">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Lưu thông tin
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Profile;
