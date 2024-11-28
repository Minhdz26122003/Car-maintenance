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
import url from "../../../ipconfixad.js";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [openEdit, setOpenEdit] = useState(false); // Quản lý form sửa dich vu
  const [openAdd, setOpenAdd] = useState(false); // Quản lý form thêm dich vu
  const [searchTerm, setSearchTerm] = useState(""); // Trạng thái từ khóa tìm kiếm

  useEffect(() => {
    fetchSales();
  }, []);
  const fetchSales = async () => {
    try {
      const response = await axios.get(`${url}myapi/Khuyenmai/getKM.php`);
      setSales(response.data);
    } catch (error) {
      console.error("Error fetching sale:", error);
    }
  };

  //TÌM KIẾM
  const searchSales = async (giatri) => {
    try {
      const response = await axios.get(
        `${url}myapi/Khuyenmai/tkiemmakm.php?giatri=${giatri}`
      );
      const sales = response.data.sales;
      console.log("API Response:", sales);
      setSales(sales);
    } catch (error) {
      console.error("Error searching sales:", error);
    }
  };
  // Gọi API để lấy tất cả khi component được load lần đầu
  useEffect(() => {
    if (searchTerm) {
      console.log("Searching for:", searchTerm);
      searchSales(searchTerm);
    } else {
      console.log("Fetching all sale");
      fetchSales();
    }
  }, [searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    // console.log("Search Term:", event.target.value);
  };
  ////

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
        `${url}myapi/Khuyenmai/themmakm.php`,
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
      await axios.put(`${url}myapi/Khuyenmai/suamakm.php`, selectedSale);

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
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa dịch vụ này không?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`${url}myapi/Khuyenmai/xoamakm.php`, {
        data: { idkm: id },
      });

      setSales(sales.filter((sale) => sale.idkm !== id));
    } catch (error) {
      console.error("Error deleting sale:", error);
    }
  };

  const formatPrice = (giatri) => {
    if (giatri === undefined || giatri === null) {
      return "0 ₫";
    }
    return giatri.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
  };

  return (
    <div>
      {/* Thanh tìm kiếm */}
      <TextField
        className="sale-search-bar"
        label="Tìm kiếm mã giảm giá"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Tìm kiếm theo giá  "
      />
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
            {Array.isArray(sales) && sales.length > 0 ? (
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Không có mã nào đươc tìm thấy
                </TableCell>
              </TableRow>
            )}
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
