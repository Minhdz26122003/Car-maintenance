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
import "./Payment.css"; // Import style riêng
import url from "../../../ipconfixad.js";
const Payment = () => {
  const [payments, setPayment] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchPayments = async () => {
    try {
      const response = await axios.get(`${url}myapi/Thanhtoan/gethoadon.php`);
      const data = response.data;
      if (Array.isArray(data)) {
        setPayment(data);
      } else {
        console.error("Dữ liệu trả về không phải là mảng:", data);
        setPayment([]);
      }
    } catch (error) {
      console.error("Error fetching payment:", error);
    }
  };
  useEffect(() => {
    if (startDate && endDate) {
      searchPayments(startDate, endDate);
    } else {
      fetchPayments();
    }
  }, [startDate, endDate]);

  const formatPrice = (giatri) => {
    if (giatri === undefined || giatri === null) {
      return "0 ₫";
    }
    return giatri.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
  };

  //TÌM KIẾM HÓA ĐƠN
  const searchPayments = async (startDate, endDate) => {
    try {
      if (!startDate || !endDate) {
        console.error("Ngày bắt đầu và kết thúc không hợp lệ.");
        return;
      }
      const response = await axios.get(
        `${url}myapi/Thanhtoan/tkhoadon.php?start_date=${startDate}&end_date=${endDate}`
      );
      console.log(response.data);

      if (response.data.success) {
        setPayment(response.data.payments);
      } else {
        setPayment([]);
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm lịch hẹn:", error);
    }
  };

  return (
    <div>
      {/* Thanh tìm kiếm */}

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

      <TableContainer component={Paper} className="payment-table-container">
        <Table aria-label="payment table" className="payment-table">
          {/* Tiêu đề bảng */}
          <TableHead className="head-payment">
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>ID Lịch hẹn</TableCell>
              <TableCell>Ngày thanh toán</TableCell>
              <TableCell>Hình thức</TableCell>
              <TableCell>Tổng tiền</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {payments && payments.length > 0 ? (
              payments.map((payment) => (
                <TableRow key={payment.idthanhtoan}>
                  <TableCell>{payment.idthanhtoan}</TableCell>
                  <TableCell>{payment.idlichhen}</TableCell>
                  <TableCell>
                    {new Date(payment.ngaythanhtoan).toLocaleDateString(
                      "en-GB",
                      { year: "numeric", month: "2-digit", day: "2-digit" }
                    )}
                  </TableCell>

                  <TableCell>{payment.hinhthuc}</TableCell>
                  <TableCell>{formatPrice(payment.tongtien)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Không có hóa đon nào được tìm thấy
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Payment;
