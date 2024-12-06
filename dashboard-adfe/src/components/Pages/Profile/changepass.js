import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
} from "@mui/material";

const Changepass = ({ open, onClose, onChangePassword }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }
    // Reset lỗi nếu đúng
    setError("");

    // Gửi dữ liệu mật khẩu đến hàm cha xử lý
    onChangePassword({ currentPassword, newPassword });
  };

  return (
    <Dialog open={open} onClose={onClose}>
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
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button onClick={handleChangePassword} color="primary">
          Đổi Mật Khẩu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Changepass;
