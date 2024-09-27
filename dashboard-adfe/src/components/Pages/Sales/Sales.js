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
import "./Sale.css"; // Import style riêng

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [openEdit, setOpenEdit] = useState(false); // Quản lý form sửa dich vu
  const [openAdd, setOpenAdd] = useState(false); // Quản lý form thêm dich vu

  useEffect(() => {
    fetchSales();
  }, []);
  const fetchSales = async () => {
    try {
      const response = await axios.get(
        "http://10.40.2.115/myapi/Khuyenmai/getKM.php"
      );
      setSales(response.data);
    } catch (error) {
      console.error("Error fetching sale:", error);
    }
  };

  // THÊM KHUYẾN MÃI
  const handleAddSubmit = async (newSale) => {
    try {
      const formData = new FormData();
      formData.append("mota", newSale.mota);
      formData.append("giatri", parseFloat(newSale.giatri));
      formData.append("ngaybatdau", newSale.ngaybatdau);
      formData.append("ngayketthuc", newSale.ngayketthuc);
      formData.append("trangthai", newSale.trangthai);

      // Gửi yêu cầu thêm km mới
      const response = await axios.post(
        "http://10.40.2.115/myapi/Khuyenmai/themmakm.php",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        console.log("Thêm km thành công");
      } else {
        console.error("Lỗi:", response.data.message);
      }

      // Sau khi thêm thành công, đóng form và tải lại danh sách
      setOpenAdd(false);
      fetchSales();
    } catch (error) {
      console.error("Error adding sale:", error);
    }
  };

  const handleAddClick = () => {
    setOpenAdd(true);
  };
  const handleAddClose = () => {
    setOpenAdd(false);
  };

  // SỬA KHUYẾN MÃI
  const handleEditSubmit = async () => {
    try {
      // Gửi dữ liệu đã sửa về server
      await axios.put(
        "http://10.40.2.115/myapi/Khuyenmai/suamakm.php",
        selectedSale
      );

      // Sau khi cập nhật thành công, đóng form và tải lại danh sách
      setOpenEdit(false);
      fetchSales();
    } catch (error) {
      console.error("Error updating sale:", error);
    }
  };
  const handleEdit = (sale) => {
    setSelectedSale(sale);
    setOpenEdit(true);
  };
  const handleEditClose = () => {
    setOpenEdit(false);
    setSelectedSale(null);
  };

  // XÓA KHUYẾN MÃI
  const handleDelete = async (id) => {
    // Hiển thị hộp thoại xác nhận
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa dịch vụ này không?"
    );

    if (!confirmDelete) {
      // Nếu người dùng chọn "Cancel", không làm gì cả
      return;
    }

    try {
      await axios.delete(`http://10.40.2.115/myapi/Khuyenmai/xoamakm.php`, {
        data: { idkm: id }, // Gửi ID trong body của yêu cầu DELETE
      });

      // Cập nhật danh sách sau khi xóa
      setSales(sales.filter((sale) => sale.idkm !== id));
    } catch (error) {
      console.error("Error deleting sale:", error);
    }
  };

  const formatPrice = (giatri) => {
    if (giatri === undefined || giatri === null) {
      return "0 ₫"; // hoặc giá trị mặc định mà bạn muốn hiển thị khi giá trị không hợp lệ
    }
    return giatri.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
  };
  // const VND = new Intl.NumberFomart("vi-VN", {
  //   style: "currency",
  //   currency: "VND",
  // });
  return (
    <div>
      <TableContainer component={Paper} className="sale-table-container">
        <Table aria-label="sale table" className="sale-table">
          {/* Tiêu đề bảng*/}
          <TableHead className="head-sale">
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Giá tiền</TableCell>
              <TableCell>Ngày bắt đầu</TableCell>
              <TableCell>Ngày kết thúc</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Array.isArray(sales) &&
              sales.map((sale) => (
                <TableRow key={sale.idkm}>
                  <TableCell>{sale.idkm}</TableCell>
                  <TableCell>{sale.mota}</TableCell>
                  <TableCell>{formatPrice(sale.giatri)}</TableCell>
                  <TableCell>{sale.ngaybatdau}</TableCell>
                  <TableCell>{sale.ngayketthuc}</TableCell>
                  <TableCell>{sale.trangthai}</TableCell>

                  <TableCell className="sale-table-actions">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(sale)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(sale.idkm)}
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
        <DialogTitle>Edit Sale</DialogTitle>
        <DialogContent>
          {selectedSale && (
            <>
              <TextField
                label="Mô tả"
                fullWidth
                margin="normal"
                value={selectedSale.mota}
                onChange={(e) =>
                  setSelectedSale({
                    ...selectedSale,
                    mota: e.target.value,
                  })
                }
              />
              <TextField
                label="Giá tiền"
                fullWidth
                margin="normal"
                value={formatPrice(selectedSale.giatri)}
                onChange={(e) =>
                  setSelectedSale({
                    ...selectedSale,
                    giatri: e.target.value,
                  })
                }
              />
              <TextField
                label="Ngày bắt đầu"
                fullWidth
                margin="normal"
                value={selectedSale.ngaybatdau}
                onChange={(e) =>
                  setSelectedSale({
                    ...selectedSale,
                    ngaybatdau: e.target.value,
                  })
                }
              />
              <TextField
                label="Ngày kết thúc"
                fullWidth
                margin="normal"
                value={selectedSale.ngayketthuc}
                onChange={(e) =>
                  setSelectedSale({
                    ...selectedSale,
                    ngayketthuc: e.target.value,
                  })
                }
              />

              <TextField
                label="Trạng thái"
                fullWidth
                margin="normal"
                value={selectedSale.trangthai}
                onChange={(e) =>
                  setSelectedSale({
                    ...selectedSale,
                    trangthai: e.target.value,
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
            label="Mô tả"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedSale({
                ...selectedSale,
                mota: e.target.value,
              })
            }
          />
          <TextField
            label="Giá tiền"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedSale({
                ...selectedSale,
                giatri: e.target.value,
              })
            }
          />

          <TextField
            label="Ngày bắt đầu"
            type="date" // Đổi type thành date để chọn ngày
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true, // Đảm bảo nhãn không bị trùng với giá trị ngày
            }}
            onChange={(e) =>
              setSelectedSale({
                ...selectedSale,
                ngaybatdau: e.target.value, // Ghi nhận giá trị ngày
              })
            }
          />

          <TextField
            label="Ngày kết thúc"
            type="date" // Đổi type thành date để chọn ngày
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true, // Đảm bảo nhãn không bị trùng với giá trị ngày
            }}
            onChange={(e) =>
              setSelectedSale({
                ...selectedSale,
                ngayketthuc: e.target.value, // Ghi nhận giá trị ngày
              })
            }
          />

          <TextField
            label="Trạng thái"
            fullWidth
            margin="normal"
            onChange={(e) =>
              setSelectedSale({
                ...selectedSale,
                trangthai: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={() => handleAddSubmit(selectedSale)} color="primary">
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

export default Sales;
