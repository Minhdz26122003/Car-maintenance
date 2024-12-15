import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Fab,
  Box,
  TextField,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import axios from "axios";
import "./Review.css"; // Import style riêng
import url from "../../../ipconfixad.js";

const Review = () => {
  const [reviews, setReview] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);
  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${url}myapi/Danhgia/getalldanhgia.php`);
      console.log(response.data.ratings);
      setReview(response.data.ratings);
    } catch (error) {
      console.error("Error fetching review:", error);
    }
  };

  // Hàm gọi API tìm kiếm và sắp xếp
  const searchAndSortReviews = async (term, sort) => {
    try {
      const response = await axios.get(
        `${url}myapi/Danhgia/tkiemdanhgia.php?noidung=${term}&sort=danhgia&order=${sort}`
      );
      setReview(response.data.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchAndSortReviews(value, sortOrder || "ASC");
  };

  const handleSortChange = (e) => {
    const order = e.target.value; // Lấy giá trị ASC hoặc DESC từ Select
    setSortOrder(order);
    searchAndSortReviews(searchTerm, order);
  };

  // XÓA KHUYẾN MÃI
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa bình luận này không?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`${url}myapi/Danhgia/xoadanhgiaid.php`, {
        data: { iddanhgia: id },
      });

      setReview(reviews.filter((review) => review.iddanhgia !== id));
    } catch (error) {
      console.error("Error deleting reviews:", error);
    }
  };

  return (
    <div>
      {/* Thanh tìm kiếm */}
      <div className="review-search-bar">
        <TextField
          className="review-search-nd"
          label="Tìm kiếm bình luận"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Nhập nội dung tìm kiếm"
        />

        {/* Dropdown lọc số sao */}
        <div className="review-search-select">
          <Select
            value={sortOrder}
            onChange={handleSortChange}
            displayEmpty
            fullWidth
            variant="outlined"
          >
            <MenuItem value="">Chọn sắp xếp</MenuItem>
            <MenuItem value="ASC">Sắp xếp tăng dần</MenuItem>
            <MenuItem value="DESC">Sắp xếp giảm dần</MenuItem>
          </Select>
        </div>
      </div>

      <TableContainer component={Paper} className="review-table-container">
        <Table aria-label="review table" className="review-table">
          {/* Tiêu đề bảng*/}
          <TableHead className="head-review">
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Trung tâm</TableCell>
              <TableCell>Người dùng</TableCell>
              <TableCell>Ngày bình luận</TableCell>
              <TableCell>Nội dung</TableCell>
              <TableCell>Số sao</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Array.isArray(reviews) && reviews.length > 0 ? (
              reviews.map((review) => (
                <TableRow key={review.iddanhgia}>
                  <TableCell>{review.iddanhgia}</TableCell>
                  <TableCell>{review.tentrungtam}</TableCell>
                  <TableCell>{review.username}</TableCell>
                  {/* <TableCell>
                    {new Date(review.ngaybinhluan).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </TableCell> */}
                  <TableCell>{review.ngaybinhluan}</TableCell>
                  <TableCell>{review.noidung}</TableCell>
                  <TableCell>{review.danhgia}</TableCell>

                  <TableCell className="sale-table-actions">
                    {/* <IconButton
                      color="primary"
                      onClick={() => handleEdit(review)}
                    >
                      <EditIcon />
                    </IconButton> */}
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(review.iddanhgia)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Không có bình luận nào đươc tìm thấy
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog sửa
      <Dialog open={openEdit} onClose={handleEditClose}>
        <DialogTitle>Edit Sale</DialogTitle>
        <DialogContent>
          {selectedReview && (
            <>
              <TextField
                label="Mô tả"
                fullWidth
                margin="normal"
                value={selectedReview.mota}
                onChange={(e) =>
                  setSelectedReview({
                    ...selectedReview,
                    mota: e.target.value,
                  })
                }
              />
              <TextField
                label="Giá tiền"
                fullWidth
                margin="normal"
                value={formatPrice(selectedReview.giatri)}
                onChange={(e) =>
                  setSelectedReview({
                    ...selectedReview,
                    giatri: e.target.value,
                  })
                }
              />
              <TextField
                label="Ngày bắt đầu"
                fullWidth
                margin="normal"
                value={selectedReview.ngaybatdau}
                onChange={(e) =>
                  setSelectedReview({
                    ...selectedReview,
                    ngaybatdau: e.target.value,
                  })
                }
              />
              <TextField
                label="Ngày kết thúc"
                fullWidth
                margin="normal"
                value={selectedReview.ngayketthuc}
                onChange={(e) =>
                  setSelectedReview({
                    ...selectedReview,
                    ngayketthuc: e.target.value,
                  })
                }
              />

              <TextField
                label="Trạng thái"
                fullWidth
                margin="normal"
                value={selectedReview.trangthai}
                onChange={(e) =>
                  setSelectedReview({
                    ...selectedReview,
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
      </Dialog> */}
    </div>
  );
};

export default Review;
