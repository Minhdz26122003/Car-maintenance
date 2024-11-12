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
  Check as CheckIcon,
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

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${url}myapi/Lichhen/getallLh.php`);
      setAppointments(response.data.lichhen);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // TÌM KIẾM LỊCH HẸN
  const searchAppointments = async (date) => {
    try {
      const response = await axios.get(
        `${url}myapi/Lichhen/tkLichhen.php?ngay=${date}`
      );
      setAppointments(response.data.appointments); // Cập nhật danh sách lịch hẹn
    } catch (error) {
      console.error("Error searching appointments:", error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      searchAppointments(searchTerm);
    } else {
      fetchAppointments();
    }
  }, [searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // // THÊM LỊCH HẸN
  // const handleAddSubmit = async (newAppointment) => {
  //   try {
  //     const response = await axios.post(
  //       `${url}myapi/Lichhen/themlh.php`,
  //       newAppointment
  //     );

  //     if (response.data.success) {
  //       fetchAppointments();
  //       setOpenAdd(false);
  //     } else {
  //       console.error("Error:", response.data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error adding appointment:", error);
  //   }
  // };

  // const handleAddClick = () => {
  //   setSelectedAppointment({}); // Reset cho form thêm
  //   setOpenAdd(true);
  // };

  // const handleAddClose = () => {
  //   setOpenAdd(false);
  // };

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

  // XÁC NHẬN LỊCH HẸN
  const handleConfirm = async (id) => {
    try {
      await axios.post(`${url}myapi/Lichhen/xacnhanLh.php`, { idlichhen: id });
      fetchAppointments();
    } catch (error) {
      console.error("Error confirming appointment:", error);
    }
  };

  return (
    <div>
      <TextField
        className="center-search-bar"
        label="Tìm kiếm lịch hẹn"
        variant="outlined"
        type="date" // Đặt type là "date"
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        value={searchTerm}
        onChange={handleSearch}
      />

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
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <TableRow key={appointment.idlichhen}>
                  <TableCell>{appointment.idlichhen}</TableCell>
                  <TableCell>{appointment.iduser}</TableCell>
                  <TableCell>{appointment.idxe}</TableCell>
                  <TableCell>{appointment.idtrungtam}</TableCell>
                  <TableCell>{appointment.tendichvu}</TableCell>
                  <TableCell>{appointment.ngayhen}</TableCell>
                  <TableCell>{appointment.thoigianhen}</TableCell>
                  <TableCell>{appointment.trangthai}</TableCell>
                  <TableCell className="book-table-actions">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(appointment)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(appointment.idlichhen)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      color="success"
                      onClick={() => handleConfirm(appointment.idlichhen)}
                    >
                      <CheckIcon />
                    </IconButton>
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
