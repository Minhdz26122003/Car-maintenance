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
  MenuItem,
  Select,
  InputLabel,
  Button,
  Fab,
  Box,
  Alert,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import axios from "axios";
import "./ServiceCen.css"; // Import style riêng
import url from "../../../ipconfixad.js";

const ServiceCen = () => {
  const [serviceCen, setServiceCen] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [centers, setCenters] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServiceCen();
    fetchCenters();
    fetchServices();
    if (selectedService?.idtrungtam) {
      fetchServices(selectedService.idtrungtam); // Lấy danh sách dịch vụ chưa có
    }
  }, [selectedService?.idtrungtam]);
  const fetchServiceCen = async () => {
    try {
      const response = await axios.get(
        `${url}myapi/Dichvu_trungtam/getall.php`
      );
      setServiceCen(response.data);
    } catch (error) {
      console.error("Error fetching sale:", error);
    }
  };

  const fetchCenters = async () => {
    try {
      const response = await axios.get(`${url}myapi/Trungtam/getTT.php`);
      setCenters(response.data);
    } catch (error) {
      console.error("Error fetching centers:", error);
    }
  };

  const fetchServices = async (centerId) => {
    if (!centerId) return; // Không làm gì nếu chưa có trung tâm được chọn
    try {
      const response = await axios.get(
        `${url}myapi/Dichvu_trungtam/getdichvu.php`,
        {
          params: { idtrungtam: centerId },
        }
      );
      setServices(response.data); // Cập nhật danh sách dịch vụ
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  // THÊM DỊCH VỤ
  const handleAddSubmit = async (newSale) => {
    try {
      const formData = new FormData();
      formData.append("iddichvu", newSale.iddichvu);
      formData.append("idtrungtam", newSale.idtrungtam);
      const response = await axios.post(
        `${url}myapi/Dichvu_trungtam/ThemDvinTt.php`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        window.alert("Thêm dịch vụ thành công");
      } else {
        console.error("Lỗi:", response.data.message);
      }
      setOpenAdd(false);
      fetchServiceCen();
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

  // XÓA DỊCH VỤ MÃI
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa dịch vụ này không?"
    );
    if (!confirmDelete) {
      return;
    }
    try {
      const response = await axios.delete(
        `${url}myapi/Dichvu_trungtam/xoaDvinTt.php`,
        {
          data: { iddvtt: id },
        }
      );
      if (response.data.success) {
        window.alert("Xóa dịch vụ thành công");
      } else {
        console.error("Lỗi:", response.data.message);
      }
      fetchServiceCen();
      setServiceCen(serviceCen.filter((service) => service.iddvtt !== id));
    } catch (error) {
      console.error("Error deleting serviceCen:", error);
    }
  };

  return (
    <div>
      <TableContainer component={Paper} className="serviceCen-table-container">
        <Table aria-label="serviceCen table" className="serviceCen-table">
          {/* Tiêu đề bảng*/}
          <TableHead className="head-serviceCen">
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Trung tâm</TableCell>
              <TableCell>Dịch vụ</TableCell>

              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Array.isArray(serviceCen) && serviceCen.length > 0 ? (
              serviceCen.map((service) => (
                <TableRow key={service.iddvtt}>
                  <TableCell>{service.iddvtt}</TableCell>
                  <TableCell>{service.tentrungtam}</TableCell>
                  <TableCell>{service.tendichvu}</TableCell>

                  <TableCell className="serviceCen-table-actions">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(service.iddvtt)}
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

      {/* Dialog thêm */}
      <Dialog fullWidth maxWidth="xs" open={openAdd} onClose={handleAddClose}>
        <DialogTitle>Thêm dịch vụ</DialogTitle>
        <DialogContent>
          <InputLabel>Trung tâm</InputLabel>
          <Select
            labelId="select-center-label"
            label="Trung tâm"
            fullWidth
            margin="normal"
            value={selectedService?.idtrungtam || ""}
            onChange={(e) => {
              const newCenterId = e.target.value;
              setSelectedService({
                ...selectedService,
                idtrungtam: newCenterId,
              });
            }}
          >
            {centers.map((center) => (
              <MenuItem key={center.idtrungtam} value={center.idtrungtam}>
                {center.tentrungtam}
              </MenuItem>
            ))}
          </Select>

          <InputLabel id="select-service-label">Dịch vụ</InputLabel>
          <Select
            labelId="select-service-label"
            label="Dịch vụ"
            fullWidth
            margin="normal"
            value={selectedService?.iddichvu || ""}
            onChange={(e) =>
              setSelectedService({
                ...selectedService,
                iddichvu: e.target.value,
              })
            }
          >
            {services.map((service) => (
              <MenuItem key={service.iddichvu} value={service.iddichvu}>
                {service.tendichvu}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleAddClose} color="secondary">
            Hủy
          </Button>
          <Button
            onClick={() => handleAddSubmit(selectedService)}
            color="primary"
          >
            Thêm
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

export default ServiceCen;
