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
  Tabs,
  Tab,
  Box,
  Typography,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Check as CheckIcon,
  BorderAll,
} from "@mui/icons-material";

import axios from "axios";
import ".././Booking/Booking.css"; // Import style riêng
import url from "../../../ipconfixad.js";

const Booking = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [value, setValue] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Lọc lịch hẹn theo tab
  const filteredAppointments = appointments.filter((appointment) => {
    if (value === 0 && appointment.trangthai === 0) return true; // Chưa xác nhận
    if (value === 1 && appointment.trangthai === 1) return true; // Đang thực hiện
    if (value === 2 && appointment.trangthai === 2) return true; // Hoàn thành
    if (value === 3 && appointment.trangthai === 3) return true; // Đã thanh toán
    if (value === 4 && appointment.trangthai === 4) return true; // Đã hủy
    return false;
  });
  const btnStatus = (trangThai) => {
    switch (trangThai) {
      case 0:
        return { confirm: true, cancel: true, action: "confirm" }; // Action cho trạng thái 0
      case 1:
        return { confirm: true, cancel: false, action: "confirmActionFor1" };
      case 2:
        return { confirm: true, cancel: false, action: "confirmActionFor2" };
      case 3:
        return { confirm: false, cancel: false, action: null }; // Tắt hết khi trạng thái 3
      case 4:
        return { confirm: false, cancel: false, action: null }; // Tắt hết khi trạng thái 4
      default:
        return { confirm: false, cancel: false, action: null };
    }
  };

  const { confirm, cancel } = btnStatus(value);
  const convertTrangThai = (trangThai) => {
    const trangThaiMap = {
      0: "Chờ xác nhận",
      1: "Đang thực hiên",
      2: "Hoàn thành",
      3: "Đã thanh toán",
      4: "Đã hủy",
    };
    return trangThaiMap[trangThai] || "Không xác định";
  };
  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${url}myapi/Lichhen/getallLh.php`);
      setAppointments(response.data.lichhen);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // TÌM KIẾM LỊCH HẸN
  const searchAppointments = async (startDate, endDate) => {
    try {
      if (!startDate || !endDate) {
        console.error("Ngày bắt đầu và kết thúc không hợp lệ.");
        return;
      }
      const response = await axios.get(
        `${url}myapi/Lichhen/tkLichhen.php?start_date=${startDate}&end_date=${endDate}`
      );

      // Cập nhật lịch hẹn
      if (response.data.success) {
        setAppointments(response.data.appointments);
        console.log("Dữ liệu trả về:", response.data);
      } else {
        setAppointments([]); // Không có kết quả
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm lịch hẹn:", error);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      searchAppointments(startDate, endDate);
    } else {
      fetchAppointments();
    }
  }, [startDate, endDate]);

  // SỬA LỊCH HẸN
  const handleEditSubmit = async () => {
    try {
      console.log("Selected Appointment: ", selectedAppointment); // Kiểm tra dữ liệu trước khi gửi
      await axios.put(
        `${url}myapi/Lichhen/sualichhen.php`,
        selectedAppointment
      );
      fetchAppointments();
      setOpenEdit(false);
      console.log("thanhcong");
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setSelectedAppointment(null);
  };

  // XÓA LỊCH HẸN
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa lịch hẹn này không?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`${url}myapi/Lichhen/xoalichhen.php`, {
        data: { idlichhen: id },
      });

      setAppointments(
        appointments.filter((appointment) => appointment.idlichhen !== id)
      );
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };
  const handleConfirm = (action) => {
    switch (action) {
      case "confirm":
        // Gọi API cho trạng thái 0
        ConfirmBook();
        break;
      case "confirmActionFor1":
        // Gọi API cho trạng thái 1
        callApiForStatus1();
        break;
      case "confirmActionFor2":
        // Gọi API cho trạng thái 2
        callApiForStatus2();
        break;
      default:
        // Nếu không có action, không làm gì
        break;
    }
  };

  // XÁC NHẬN LỊCH HẸN
  const ConfirmBook = async (id) => {
    try {
      await axios.post(`${url}myapi/Lichhen/xacnhanLh.php`, { idlichhen: id });
      fetchAppointments();
    } catch (error) {
      console.error("Error confirming appointment:", error);
    }
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      {/* Tab chọn trạng thái */}
      <Tabs
        className="tabstatus"
        value={value}
        onChange={handleChange}
        aria-label="Appointment Status Tabs"
      >
        <Tab className="tabitem" label="Chưa xác nhận" />
        <Tab className="tabitem" label="Đang thực hiện" />
        <Tab className="tabitem" label="Hoàn thành" />
        <Tab className="tabitem" label="Đã thanh toán" />
        <Tab className="tabitem" label="Đã hủy" />
      </Tabs>

      {/* Tìm kiếm theo ngày */}

      <Box className="book-search-bar">
        <TextField
          className="book-search-start"
          label="Ngày bắt đầu"
          variant="outlined"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <TextField
          className="book-search-end"
          label="Ngày kết thúc"
          variant="outlined"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </Box>

      {/* Bảng lịch hẹn */}
      <TableContainer component={Paper} className="book-table-container">
        <Table aria-label="appointment table" className="book-table">
          <TableHead className="head-book">
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>ID Người dùng</TableCell>
              <TableCell>ID Xe</TableCell>
              <TableCell>ID Trung tâm</TableCell>
              <TableCell>Tên Dịch Vụ</TableCell>
              <TableCell>Ngày hẹn</TableCell>
              <TableCell>Thời gian hẹn</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <TableRow key={appointment.idlichhen}>
                  <TableCell>{appointment.idlichhen}</TableCell>
                  <TableCell>{appointment.iduser}</TableCell>
                  <TableCell>{appointment.idxe}</TableCell>
                  <TableCell>{appointment.idtrungtam}</TableCell>
                  <TableCell>{appointment.tendichvu}</TableCell>
                  <TableCell>{appointment.ngayhen}</TableCell>
                  <TableCell>{appointment.thoigianhen}</TableCell>
                  <TableCell>
                    {convertTrangThai(appointment.trangthai)}
                  </TableCell>
                  <TableCell className="book-table-actions">
                    {/* Hiển thị các nút dựa trên trạng thái */}
                    {confirm && (
                      <IconButton
                        color="success"
                        // onClick={() => handleConfirm(action)}
                      >
                        <CheckIcon />
                      </IconButton>
                    )}
                    {cancel && (
                      <IconButton
                        color="warning"
                        // onClick={() => handleConfirm(appointment.idlichhen)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Không có lịch hẹn nào được tìm thấy
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog sửa */}
      <Dialog open={openEdit} onClose={handleEditClose}>
        <DialogTitle>Sửa Lịch Hẹn</DialogTitle>
        <DialogContent>
          {selectedAppointment && (
            <>
              <TextField
                label="Ngày hẹn"
                fullWidth
                margin="normal"
                value={selectedAppointment.ngayhen}
                onChange={(e) =>
                  setSelectedAppointment({
                    ...selectedAppointment,
                    ngayhen: e.target.value,
                  })
                }
              />
              <TextField
                label="Thời gian hẹn"
                fullWidth
                margin="normal"
                value={selectedAppointment.thoigianhen}
                onChange={(e) =>
                  setSelectedAppointment({
                    ...selectedAppointment,
                    thoigianhen: e.target.value,
                  })
                }
              />
              <TextField
                label="Trạng thái"
                fullWidth
                margin="normal"
                value={selectedAppointment.trangthai}
                onChange={(e) =>
                  setSelectedAppointment({
                    ...selectedAppointment,
                    trangthai: e.target.value,
                  })
                }
              />
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleEditClose} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Booking;
