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
  Typography,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import axios from "axios";
import "./centers.css"; // Import style riêng
import url from "../../../ipconfixad.js";

const Centers = () => {
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [openEdit, setOpenEdit] = useState(false); // Quản lý form sửa dich vu
  const [openAdd, setOpenAdd] = useState(false); // Quản lý form thêm dich vu
  const [searchTerm, setSearchTerm] = useState({ tentrungtam: "", diachi: "" });

  const handleSearch = (key, value) => {
    setSearchTerm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    try {
      const response = await axios.get(`${url}myapi/Trungtam/getTT.php`);
      setCenters(response.data);
    } catch (error) {
      console.error("Error fetching center:", error);
    }
  };

  //TÌM KIẾM TRUNG TÂM
  const searchCenters = async (searchParams) => {
    try {
      const query = new URLSearchParams(searchParams).toString();
      const response = await axios.get(
        `${url}myapi/Trungtam/tktrungtam.php?${query}`
      );
      const centers = response.data.centers;
      console.log("API Response:", centers);
      setCenters(centers);
    } catch (error) {
      console.error("Error searching centers:", error);
    }
  };

  // Gọi API để lấy tất cả khi component được load lần đầu
  useEffect(() => {
    const { tentrungtam, diachi } = searchTerm;
    if (tentrungtam || diachi) {
      // console.log("Searching with:", searchTerm);
      searchCenters(searchTerm);
    } else {
      fetchCenters();
    }
  }, [searchTerm]);

  // THÊM TRUNG TÂM
  const handleAddSubmit = async (newCenter) => {
    try {
      const formData = new FormData();
      formData.append("tentrungtam", newCenter.tentrungtam);
      formData.append("diachi", newCenter.diachi);
      formData.append("sodienthoai", newCenter.sodienthoai);
      formData.append("email", newCenter.email);

      if (newCenter.hinhanh) {
        formData.append("hinhanh", newCenter.hinhanh);
      }
      formData.append("toadox", parseFloat(newCenter.toadox));
      formData.append("toadoy", parseFloat(newCenter.toadoy));

      // Gửi yêu cầu thêm dịch vụ mới
      const response = await axios.post(
        `${url}/myapi/Trungtam/themtrungtam.php`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        console.log("Thêm trung tâm thành công");
      } else {
        console.error("Lỗi:", response.data.message);
      }
      // Sau khi thêm thành công, đóng form và tải lại danh sách
      setOpenAdd(false);
      fetchCenters();
    } catch (error) {
      console.error("Error adding center:", error);
    }
  };

  const handleAddClick = () => {
    setOpenAdd(true);
  };
  const handleAddClose = () => {
    setOpenAdd(false);
  };

  // SỬA TRUNG TÂM
  const handleEditSubmit = async () => {
    try {
      // Gửi dữ liệu đã sửa về server
      await axios.put(`${url}myapi/Trungtam/suatrungtam.php`, selectedCenter);

      // Sau khi cập nhật thành công, đóng form và tải lại danh sách
      setOpenEdit(false);
      fetchCenters();
    } catch (error) {
      console.error("Error updating center:", error);
    }
  };
  const handleEdit = (center) => {
    setSelectedCenter(center);
    setOpenEdit(true);
  };
  const handleEditClose = () => {
    setOpenEdit(false);
    setSelectedCenter(null);
  };

  // XÓA TRUNG TÂM
  const handleDelete = async (id) => {
    // Hiển thị hộp thoại xác nhận
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa trung tâm này không?"
    );

    if (!confirmDelete) {
      // Nếu người dùng chọn "Cancel", không làm gì cả
      return;
    }

    try {
      await axios.delete(`${url}/myapi/Trungtam/xoatrungtam.php`, {
        data: { idtrungtam: id }, // Gửi ID trong body của yêu cầu DELETE
      });

      // Cập nhật danh sách sau khi xóa
      setCenters(centers.filter((center) => center.idtrungtam !== id));
    } catch (error) {
      console.error("Error deleting center:", error);
    }
  };

  return (
    <div>
      {/* Thanh tìm kiếm */}

      <div className="center-search-bar">
        <TextField
          className="name-search-bar"
          label="Tìm kiếm theo tên trung tâm"
          variant="outlined"
          value={searchTerm.tentrungtam}
          onChange={(e) => handleSearch("tentrungtam", e.target.value)}
          placeholder="Nhập tên trung tâm"
        />

        {/* Ô tìm kiếm theo địa chỉ */}
        <TextField
          className="address-search-bar"
          label="Tìm kiếm theo địa chỉ"
          variant="outlined"
          value={searchTerm.diachi}
          onChange={(e) => handleSearch("diachi", e.target.value)}
          placeholder="Nhập địa chỉ"
        />
      </div>

      <TableContainer component={Paper} className="center-table-container">
        <Table aria-label="center table" className="center-table">
          {/* Tiêu đề bảng*/}
          <TableHead className="head-center">
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên trung tâm</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Tọa độ X</TableCell>
              <TableCell>Tọa độ Y</TableCell>

              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {centers && centers.length > 0 ? (
              centers.map((center) => (
                <TableRow key={center.idtrungtam}>
                  <TableCell>{center.idtrungtam}</TableCell>
                  <TableCell>{center.tentrungtam}</TableCell>
                  <TableCell>{center.diachi}</TableCell>
                  <TableCell>{center.sodienthoai}</TableCell>
                  <TableCell>{center.email}</TableCell>
                  <TableCell>
                    <img
                      src={center.hinhanh} // URL của hình ảnh từ cơ sở dữ liệu
                      alt={center.tentrungtam} // Tên dịch vụ
                      style={{ width: "100px", height: "auto" }} // Kiểm soát kích thước hình ảnh
                    />
                  </TableCell>
                  <TableCell>{center.toadox}</TableCell>
                  <TableCell>{center.toadoy}</TableCell>

                  <TableCell className="center-table-actions">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(center)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(center.idtrungtam)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Không có trung tâm nào đươc tìm thấy
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog sửa*/}
      <Dialog open={openEdit} onClose={handleEditClose}>
        <DialogTitle>Edit Centers</DialogTitle>
        <DialogContent>
          {selectedCenter && (
            <>
              <TextField
                label="Tên trung tâm"
                fullWidth
                margin="normal"
                value={selectedCenter.tentrungtam}
                onChange={(e) =>
                  setSelectedCenter({
                    ...selectedCenter,
                    tentrungtam: e.target.value,
                  })
                }
              />
              <TextField
                label="Địa chỉ"
                fullWidth
                margin="normal"
                value={selectedCenter.diachi}
                onChange={(e) =>
                  setSelectedCenter({
                    ...selectedCenter,
                    diachi: e.target.value,
                  })
                }
              />
              <TextField
                label="Số điện thoại"
                fullWidth
                margin="normal"
                value={selectedCenter.sodienthoai}
                onChange={(e) =>
                  setSelectedCenter({
                    ...selectedCenter,
                    sodienthoai: e.target.value,
                  })
                }
              />
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                value={selectedCenter.email}
                onChange={(e) =>
                  setSelectedCenter({
                    ...selectedCenter,
                    email: e.target.value,
                  })
                }
              />
              <TextField
                label="Hình ảnh"
                fullWidth
                margin="normal"
                value={selectedCenter.hinhanh}
                onChange={(e) =>
                  setSelectedCenter({
                    ...selectedCenter,
                    hinhanh: e.target.value,
                  })
                }
              />
              <TextField
                label="Tọa độ X"
                fullWidth
                margin="normal"
                value={selectedCenter.toadox}
                onChange={(e) =>
                  setSelectedCenter({
                    ...selectedCenter,
                    toadox: e.target.value,
                  })
                }
              />
              <TextField
                label="Tọa độ Y"
                fullWidth
                margin="normal"
                value={selectedCenter.toadoy}
                onChange={(e) =>
                  setSelectedCenter({
                    ...selectedCenter,
                    toadoy: e.target.value,
                  })
                }
              />
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
        <DialogTitle>Thêm trung tâm</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên trung tâm"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedCenter({
                ...selectedCenter,
                tentrungtam: e.target.value,
              })
            }
          />
          <TextField
            label="Địa chỉ"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedCenter({
                ...selectedCenter,
                diachi: e.target.value,
              })
            }
          />
          <TextField
            label="Số điện thoại"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedCenter({
                ...selectedCenter,
                sodienthoai: e.target.value,
              })
            }
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedCenter({
                ...selectedCenter,
                email: e.target.value,
              })
            }
          />

          {/* Thay đổi: Nhập URL hình ảnh */}
          <TextField
            label="URL Hình ảnh"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedCenter({
                ...selectedCenter,
                hinhanh: e.target.value, // Nhập URL hình ảnh
              })
            }
          />
          <TextField
            label="Tọa độ X"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedCenter({
                ...selectedCenter,
                toadox: e.target.value,
              })
            }
          />
          <TextField
            label="Tọa độ Y"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedCenter({
                ...selectedCenter,
                toadoy: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => handleAddSubmit(selectedCenter)}
            color="primary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Nút thêm dịch vụ */}
      <Box sx={{ position: "fixed", bottom: 30, right: 50 }}>
        <Fab color="primary" aria-label="add" onClick={handleAddClick}>
          <AddIcon />
        </Fab>
      </Box>
    </div>
  );
};

export default Centers;
