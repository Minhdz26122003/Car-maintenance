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
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import axios from "axios";
import "./service.css"; // Import style riêng

const Service = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState({
    tendichvu: "",
    mota: "",
    gia: "",
    hinhanh: "",
    thoigianth: "",
  });
  const [openEdit, setOpenEdit] = useState(false); // Quản lý form sửa dich vu
  const [openAdd, setOpenAdd] = useState(false); // Quản lý form thêm dich vu

  useEffect(() => {
    fetchServices();
  }, []);
  const fetchServices = async () => {
    try {
      const response = await axios.get(
        "http://192.168.1.3/myapi/Dichvu/getDV.php"
      );
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching service:", error);
    }
  };

  // THÊM DỊCH VỤ
  const handleAddSubmit = async (newService) => {
    try {
      // Dữ liệu gửi đi dưới dạng JSON
      const formData = new FormData();
      formData.append("tendichvu", newService.tendichvu);
      formData.append("mota", newService.mota);
      formData.append("gia", parseFloat(newService.gia)); // Chuyển đổi thành số float
      formData.append("hinhanh", newService.hinhanh);
      formData.append("thoigianth", newService.thoigianth); // Bạn có thể cần xử lý định dạng thời gian nếu cần

      const response = await axios.post(
        "http://192.168.1.3/myapi/Dichvu/themdichvu.php",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        console.log("Thêm dịch vụ thành công");
      } else {
        console.error("Lỗi:", response.data.message);
      }

      // Đóng form và tải lại danh sách dịch vụ
      setOpenAdd(false);
      fetchServices();
    } catch (error) {
      console.error("Error adding service:", error);
    }
  };

  const handleAddClick = () => {
    setOpenAdd(true);
  };
  const handleAddClose = () => {
    setOpenAdd(false);
  };

  // SỬA DỊCH VỤ
  const handleEditSubmit = async () => {
    try {
      // Gửi dữ liệu đã sửa về server
      await axios.put(
        "http://192.168.1.3/myapi/Dichvu/suadichvu.php",
        selectedService
      );

      // Sau khi cập nhật thành công, đóng form và tải lại danh sách
      setOpenEdit(false);
      fetchServices();
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };
  const handleEdit = (service) => {
    setSelectedService(service);
    setOpenEdit(true);
  };
  const handleEditClose = () => {
    setOpenEdit(false);
    setSelectedService(null);
  };

  // XÓA DỊCH VỤ
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
      await axios.delete(`http://192.168.1.3/myapi/Dichvu/xoadichvu.php`, {
        data: { iddichvu: id }, // Gửi ID trong body của yêu cầu DELETE
      });

      // Cập nhật danh sách sau khi xóa
      setServices(services.filter((service) => service.iddichvu !== id));
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };
  const formatPrice = (giatri) => {
    if (giatri === undefined || giatri === null) {
      return "0 ₫"; // hoặc giá trị mặc định mà bạn muốn hiển thị khi giá trị không hợp lệ
    }
    return giatri.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
  };

  return (
    <div>
      <TableContainer component={Paper} className="service-table-container">
        <Table aria-label="service table" className="service-table">
          {/* Tiêu đề bảng*/}
          <TableHead className="head-service">
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên Dịch vụ</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Giá tiền</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Thời gian thực hiện</TableCell>

              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {services.map((service) => (
              <TableRow key={service.iddichvu}>
                <TableCell>{service.iddichvu}</TableCell>
                <TableCell>{service.tendichvu}</TableCell>
                <TableCell>{service.mota}</TableCell>
                <TableCell>{formatPrice(service.gia)}</TableCell>
                <TableCell>
                  <img
                    src={service.hinhanh} // URL của hình ảnh từ cơ sở dữ liệu
                    alt={service.tendichvu} // Tên dịch vụ
                    style={{ width: "100px", height: "auto" }} // Kiểm soát kích thước hình ảnh
                  />
                </TableCell>
                <TableCell>{service.thoigianth}</TableCell>
                <TableCell className="service-table-actions">
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(service)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(service.iddichvu)}
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
        <DialogTitle>Edit Service</DialogTitle>
        <DialogContent>
          {selectedService && (
            <>
              <TextField
                label="Tên dịch vụ"
                fullWidth
                margin="normal"
                value={selectedService.tendichvu}
                onChange={(e) =>
                  setSelectedService({
                    ...selectedService,
                    tendichvu: e.target.value,
                  })
                }
              />
              <TextField
                label="Mô tả"
                fullWidth
                margin="normal"
                value={selectedService.mota}
                onChange={(e) =>
                  setSelectedService({
                    ...selectedService,
                    mota: e.target.value,
                  })
                }
              />
              <TextField
                label="Giá tiền"
                fullWidth
                margin="normal"
                value={formatPrice(selectedService.gia)}
                onChange={(e) =>
                  setSelectedService({
                    ...selectedService,
                    gia: e.target.value,
                  })
                }
              />
              <TextField
                label="Hình ảnh"
                fullWidth
                margin="normal"
                value={selectedService.hinhanh}
                onChange={(e) =>
                  setSelectedService({
                    ...selectedService,
                    hinhanh: e.target.value,
                  })
                }
              />
              <TextField
                label="Thời gian thực hiện"
                fullWidth
                margin="normal"
                value={selectedService.thoigianth}
                onChange={(e) =>
                  setSelectedService({
                    ...selectedService,
                    thoigianth: e.target.value,
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
        <DialogTitle>Thêm dịch vụ</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên dịch vụ"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedService({
                ...selectedService,
                tendichvu: e.target.value,
              })
            }
          />
          <TextField
            label="Mô tả"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedService({
                ...selectedService,
                mota: e.target.value,
              })
            }
          />
          <TextField
            label="Giá tiền"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedService({
                ...selectedService,
                gia: e.target.value,
              })
            }
          />
          {/* Thay đổi: Nhập URL hình ảnh */}
          <TextField
            label="URL Hình ảnh"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedService({
                ...selectedService,
                hinhanh: e.target.value, // Nhập URL hình ảnh
              })
            }
          />
          <TextField
            label="Thời gian thực hiện"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedService({
                ...selectedService,
                thoigianth: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => handleAddSubmit(selectedService)}
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

export default Service;
