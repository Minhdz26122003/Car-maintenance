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
  Slider,
  Button,
  Fab,
  Typography,
  Box,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import axios from "axios";
import "./service.css"; // Import style riêng
import url from "../../../ipconfixad.js";

const Service = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState({
    tendichvu: "",
    mota: "",
    gia: "",
    hinhanh: "",
    thoigianth: "",
  });
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false); // Quản lý form thêm dich vu
  const [searchTerm, setSearchTerm] = useState(""); // Trạng thái từ khóa tìm kiếm
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${url}myapi/Dichvu/getDV.php`);
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching service:", error);
    }
  };

  const checkData = async (newService) => {
    if (
      !newService.tendichvu ||
      !newService.mota ||
      !newService.gia ||
      !newService.hinhanh ||
      !newService.thoigianth
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
  };
  //TÌM KIẾM DỊCH VỤ
  const searchServices = async (tendichvu, priceRange) => {
    try {
      const [minPrice, maxPrice] = priceRange;
      const response = await axios.get(`${url}myapi/Dichvu/tktheogia.php`, {
        params: {
          tendichvu: tendichvu,
          minPrice: minPrice, // Giá tối thiểu
          maxPrice: maxPrice, // Giá tối đa
        },
      });

      console.log("Full API Response:", response.data);
      const services = response.data.services;
      console.log("API Response - services:", services);
      setServices(services);
    } catch (error) {
      console.error("Error searching services:", error);
    }
  };

  // Gọi API để lấy tất cả khi component được load lần đầu
  useEffect(() => {
    if (searchTerm || priceRange) {
      console.log("Searching for:", searchTerm, "Price Range:", priceRange);
      searchServices(searchTerm, priceRange);
    } else {
      console.log("Fetching all services");
      fetchServices();
    }
  }, [searchTerm, priceRange]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    // console.log("Search Term:", event.target.value);
  };
  ////

  // THÊM DỊCH VỤ
  const handleAddSubmit = async (newService) => {
    try {
      checkData();

      const formData = new FormData();
      formData.append("tendichvu", newService.tendichvu);
      formData.append("mota", newService.mota);
      formData.append("gia", parseFloat(newService.gia));
      formData.append("hinhanh", newService.hinhanh);
      formData.append("thoigianth", newService.thoigianth);

      const response = await axios.post(
        `${url}myapi/Dichvu/themdichvu.php`,
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
      await axios.put(`${url}myapi/Dichvu/suadichvu.php`, selectedService);
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
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa tài khoản này không?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`${url}myapi/Dichvu/xoadichvu.php`, {
        data: { iddichvu: id },
      });

      setServices(services.filter((service) => service.iddichvu !== id));
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };
  const formatPrice = (giatri) => {
    if (giatri === undefined || giatri === null) {
      return "0 ₫";
    }
    return giatri.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
  };

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id], // Đảo trạng thái mở rộng/thu gọn
    }));
  };

  return (
    <div>
      {/* Thanh tìm kiếm */}
      <Box className="service-search-bar">
        <TextField
          className="service-search-text"
          label="Tìm kiếm dịch vụ"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Tìm kiếm theo tên dich vụ"
        />
        <Typography className="search-text"> Giá tiền</Typography>
        <Slider
          className="service-search-price"
          value={priceRange}
          onChange={(e, newValue) => setPriceRange(newValue)}
          valueLabelDisplay="auto"
          min={0}
          max={10000000}
          step={100000}
          valueLabelFormat={(value) =>
            new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(value)
          }
        />
      </Box>

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
            {services && services.length > 0 ? (
              services.map((service) => (
                <TableRow key={service.iddichvu}>
                  <TableCell>{service.iddichvu}</TableCell>
                  <TableCell>{service.tendichvu}</TableCell>
                  <TableCell>
                    {expandedRows[service.iddichvu] ? (
                      <>
                        {service.mota}{" "}
                        <Button
                          color="primary"
                          size="small"
                          onClick={() => toggleExpand(service.iddichvu)}
                        >
                          Thu gọn
                        </Button>
                      </>
                    ) : (
                      <>
                        {service.mota.length > 100
                          ? `${service.mota.slice(0, 100)}...`
                          : service.mota}
                        {service.mota.length > 100 && (
                          <Button
                            color="primary"
                            size="small"
                            onClick={() => toggleExpand(service.iddichvu)}
                          >
                            Xem thêm
                          </Button>
                        )}
                      </>
                    )}
                  </TableCell>
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Không có dịch vụ nào được tìm thấy
                </TableCell>
              </TableRow>
            )}
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
