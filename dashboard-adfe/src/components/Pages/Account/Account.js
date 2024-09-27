import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Fab,
  Box,
  Select,
  MenuItem,
} from "@mui/material";

import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import axios from "axios";
import "./Accounts.css"; // Import style riêng

const Account = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState({
    username: "",
    email: "",
    password: "",
    sodienthoai: "",
    diachi: "",
    vaitro: 0, // Giá trị mặc định cho vaitro
  });
  const [openEdit, setOpenEdit] = useState(false); // Quản lý form sửa tài khoản
  const [openAdd, setOpenAdd] = useState(false); // Quản lý form thêm tài khoản
  const [filteredAccounts, setFilteredAccounts] = useState([]); // Danh sách tài khoản sau khi lọc
  const [searchTerm, setSearchTerm] = useState(""); // Biến lưu từ khóa tìm kiếm

  useEffect(() => {
    fetchAccounts();
  }, []);
  const roleMapping = {
    0: "Người dùng",
    1: "Nhân viên",
    2: "Quản lý",
  };

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(
        "http://192.168.1.3/myapi/Taikhoan/getTK.php"
      );
      const accounts = response.data; // Giữ vaitro là số
      setAccounts(accounts);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  // TÌM KIẾM
  const handleSearch = async (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    try {
      const response = await axios.get(
        `http://192.168.1.3/myapi/Taikhoan/tktaikhoan.php`,
        {
          params: {
            username: value,
          },
        }
      );

      console.log(response.data); // Thêm dòng này để kiểm tra phản hồi

      if (response.data.success) {
        setFilteredAccounts(response.data.accounts);
      } else {
        setFilteredAccounts([]);
      }
    } catch (error) {
      console.error("Error searching accounts:", error);
    }
  };

  //  THÊM TÀI KHOẢN
  const handleAddSubmit = async (newAccount) => {
    try {
      // Gửi yêu cầu thêm tài khoản mới
      await axios.post(
        "http://192.168.1.3/myapi/Taikhoan/themtaikhoan.php",
        newAccount
      );

      // Sau khi thêm tài khoản thành công, đóng form và tải lại danh sách tài khoản
      setOpenAdd(false);
      fetchAccounts();
    } catch (error) {
      console.error("Error adding account:", error);
    }
  };
  const handleAddClick = () => {
    setOpenAdd(true);
  };
  const handleAddClose = () => {
    setOpenAdd(false);
  };

  // SỬA TÀI KHOẢN
  const handleEditSubmit = async () => {
    try {
      // Gửi dữ liệu đã sửa về server
      await axios.put(
        "http://192.168.1.3/myapi/Taikhoan/suataikhoan.php",
        selectedAccount
      );

      // Sau khi cập nhật thành công, đóng form và tải lại danh sách tài khoản
      setOpenEdit(false);
      fetchAccounts();
      console.log("thanhcong");
    } catch (error) {
      console.error("Error updating account:", error);
    }
  };
  const handleEdit = (account) => {
    setSelectedAccount(account);
    setOpenEdit(true);
  };

  const handleEditClose = (account) => {
    setOpenEdit(false);
    setSelectedAccount({
      username: "",
      email: "",
      password: "",
      sodienthoai: "",
      diachi: "",
      vaitro: 2,
    });
  };

  // XÓA TÀI KHOẢN
  const handleDelete = async (id) => {
    // Hiển thị hộp thoại xác nhận
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa tài khoản này không?"
    );

    if (!confirmDelete) {
      // Nếu người dùng chọn "Cancel", không làm gì cả
      return;
    }

    try {
      await axios.delete(`http://192.168.1.3/myapi/Taikhoan/xoataikhoan.php`, {
        data: { iduser: id }, // Gửi ID trong body của yêu cầu DELETE
      });

      // Cập nhật danh sách sau khi xóa
      setAccounts(accounts.filter((account) => account.iduser !== id));
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <div>
      {/* Thanh tìm kiếm */}
      <TextField
        className="account-search-bar"
        label="Tìm kiếm tài khoản"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Tìm kiếm theo tên hoặc email"
      />

      <TableContainer component={Paper} className="account-table-container">
        <Table aria-label="account table" className="account-table">
          {/* Tiêu đề bảng*/}
          <TableHead className="head-account">
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {(searchTerm ? filteredAccounts : accounts).map((account) => (
              <TableRow key={account.iduser}>
                <TableCell>{account.iduser}</TableCell>
                <TableCell>{account.username}</TableCell>
                <TableCell>{account.email}</TableCell>
                <TableCell>{account.password}</TableCell>
                <TableCell>{account.sodienthoai}</TableCell>
                <TableCell>{account.diachi}</TableCell>
                <TableCell>
                  {roleMapping[account.vaitro] !== undefined
                    ? roleMapping[account.vaitro]
                    : "Unknown"}
                </TableCell>

                <TableCell className="account-table-actions">
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(account)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(account.iduser)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
                label="Password"
                fullWidth
                margin="normal"
                value={selectedAccount.password || ""}
                onChange={(e) =>
                  setSelectedAccount({
                    ...selectedAccount,
                    password: e.target.value,
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

              <Select
                label="Role"
                fullWidth
                margin="normal"
                value={selectedAccount.vaitro} // Giá trị hiện tại của vai trò
                onChange={(e) =>
                  setSelectedAccount({
                    ...selectedAccount,
                    vaitro: e.target.value, // Lưu giá trị vai trò là số 0, 1, hoặc 2
                  })
                }
              >
                <MenuItem value={0}>Người dùng</MenuItem>
                <MenuItem value={1}>Nhân viên</MenuItem>
                <MenuItem value={2}>Quản lý</MenuItem>
              </Select>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog thêm */}
      <Dialog open={openAdd} onClose={handleAddClose}>
        <DialogTitle>Add Account</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
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
            onChange={(e) =>
              setSelectedAccount({
                ...selectedAccount,
                email: e.target.value,
              })
            }
          />
          <TextField
            label="Password"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedAccount({
                ...selectedAccount,
                password: e.target.value,
              })
            }
          />
          <TextField
            label="Phone"
            fullWidth
            margin="normal"
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
            onChange={(e) =>
              setSelectedAccount({
                ...selectedAccount,
                diachi: e.target.value,
              })
            }
          />

          <Select
            label="Role"
            fullWidth
            margin="normal"
            value={selectedAccount.vaitro} // Giá trị hiện tại của vai trò
            onChange={(e) =>
              setSelectedAccount({
                ...selectedAccount,
                vaitro: e.target.value, // Lưu giá trị vai trò là số 0, 1, hoặc 2
              })
            }
          >
            <MenuItem value={0}>Người dùng</MenuItem>
            <MenuItem value={1}>Nhân viên</MenuItem>
            <MenuItem value={2}>Quản lý</MenuItem>
          </Select>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleAddClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => handleAddSubmit(selectedAccount)}
            color="primary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Nút thêm tài khoản */}
      <Box sx={{ position: "fixed", bottom: 30, right: 50 }}>
        <Fab color="primary" aria-label="add" onClick={handleAddClick}>
          <AddIcon />
        </Fab>
      </Box>
    </div>
  );
};

export default Account;
