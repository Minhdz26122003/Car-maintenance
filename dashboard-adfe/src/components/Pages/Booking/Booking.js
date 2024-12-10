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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reason, setReason] = useState("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
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
        return { confirm: true, cancel: true, action: "confirm" }; // Action cho từng trạng thái
      case 1:
        return { confirm: true, cancel: false, action: "complete" };
      case 2:
        return { confirm: true, cancel: false, action: "payment" };
      case 3:
        return { confirm: false, cancel: false, action: null };
      case 4:
        return { confirm: false, cancel: false, action: null };
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
      console.log(response);
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

      if (response.data.success) {
        setAppointments(response.data.appointments);
      } else {
        setAppointments([]);
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

  const openCancelModal = (idlichhen) => {
    setSelectedAppointmentId(idlichhen);
    setReason("");
    setIsModalVisible(true);
  };

  const closeCancelModal = () => {
    setIsModalVisible(false);
  };

  //HỦY LỊCH HẸN
  const Huylich = async (idlichhen, lyDo) => {
    try {
      const response = await axios.post(`${url}myapi/Lichhen/huylichhen.php`, {
        idlichhen,
        lydohuy: lyDo,
      });

      if (response.data.success) {
        console.log("Thành công", "Lịch hẹn đã được hủy thành công.");
        fetchAppointments();
        closeCancelModal();
      } else {
        console.log(
          "Lỗi",
          response.data.message || "Hủy lịch không thành công."
        );
      }
    } catch (error) {
      console.error(error);
      console.log("Lỗi", "Không thể kết nối với máy chủ.");
    }
  };

  const handleConfirm = (action, id) => {
    if (!id) {
      console.error("Thiếu id");
      return;
    }

    let message;
    switch (action) {
      case "confirm":
        message = "Bạn có chắc chắn muốn xác nhận lịch hẹn này?";
        break;
      case "complete":
        message = "Bạn có chắc chắn muốn hoàn thành lịch hẹn này?";
        break;
      case "payment":
        message = "Bạn có chắc chắn muốn thanh toán lịch hẹn này?";
        break;
      default:
        message = "Bạn có chắc chắn muốn thực hiện hành động này?";
    }

    const confirmAction = window.confirm(message);
    if (!confirmAction) {
      console.log("Hủy hành động");
      return;
    }

    switch (action) {
      case "confirm":
        ConfirmBook(id);
        break;
      case "complete":
        CompleteBook(id);
        break;
      case "payment":
        PayBook(id);
        break;
      default:
        console.warn("Hành động không hợp lệ:", action);
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
  // HOÀN THÀNH LỊCH HẸN
  const CompleteBook = async (id) => {
    try {
      await axios.post(`${url}myapi/Lichhen/hoanthanhLh.php`, {
        idlichhen: id,
      });
      fetchAppointments();
    } catch (error) {
      console.error("Error complete appointment:", error);
    }
  };
  // THANH TOÁN LỊCH HẸN
  const PayBook = async (id) => {
    try {
      await axios.post(`${url}myapi/Lichhen/thanhtoanLh.php`, {
        idlichhen: id,
      });
      fetchAppointments();
    } catch (error) {
      console.error("Error payment appointment:", error);
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
              {/* <TableCell>ID</TableCell> */}
              <TableCell>Tên người dùng</TableCell>
              <TableCell>Biển số xe</TableCell>
              <TableCell>Tên trung tâm</TableCell>
              <TableCell>Tên dịch Vụ</TableCell>
              <TableCell>Ngày hẹn</TableCell>
              <TableCell>Thời gian hẹn</TableCell>
              <TableCell>Trạng thái</TableCell>
              {value === 4 && <TableCell>Lý do hủy</TableCell>}
              {value != 4 && value != 3 && <TableCell>Hành động</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <TableRow key={appointment.idlichhen}>
                  {/* <TableCell>{appointment.idlichhen}</TableCell> */}
                  <TableCell>{appointment.username}</TableCell>
                  <TableCell>{appointment.idxe}</TableCell>
                  <TableCell>{appointment.tentrungtam}</TableCell>
                  <TableCell>{appointment.tendichvu}</TableCell>
                  <TableCell>{appointment.ngayhen}</TableCell>
                  <TableCell>{appointment.thoigianhen}</TableCell>
                  <TableCell>
                    {convertTrangThai(appointment.trangthai)}
                  </TableCell>
                  {value === 4 && (
                    <TableCell>
                      {appointment.lydohuy || "Chưa có lý do"}
                    </TableCell>
                  )}
                  <TableCell className="book-table-actions">
                    {confirm && (
                      <IconButton
                        color="success"
                        onClick={() =>
                          handleConfirm(
                            btnStatus(appointment.trangthai).action,
                            appointment.idlichhen
                          )
                        }
                        disabled={!btnStatus(value).confirm}
                      >
                        <CheckIcon />
                      </IconButton>
                    )}
                    {cancel && (
                      <IconButton
                        color="warning"
                        onClick={() => openCancelModal(appointment.idlichhen)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                    {/* Modal nhập lý do hủy */}
                    <Dialog open={isModalVisible} onClose={closeCancelModal}>
                      <DialogTitle>Nhập lý do hủy lịch</DialogTitle>
                      <DialogContent>
                        <TextField
                          label="Lý do"
                          multiline
                          rows={4}
                          fullWidth
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={closeCancelModal} color="secondary">
                          Đóng
                        </Button>
                        <Button
                          onClick={() => Huylich(selectedAppointmentId, reason)}
                          color="primary"
                        >
                          Hủy lịch
                        </Button>
                      </DialogActions>
                    </Dialog>
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
    </div>
  );
};

export default Booking;
