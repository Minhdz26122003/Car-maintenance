// Dashboard.js
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Legend,
  ComposedChart,
  Area,
  Line,
  ResponsiveContainer,
} from "recharts";

import axios from "axios";
import "./dashboard.css"; // Import style riêng
import url from "../../../ipconfixad.js";

const Dashboard = () => {
  const [month, setMonth] = useState(12);
  const [data, setData] = useState("");
  const [user, setTotalUsers] = useState(0);
  const [service, setTotalServices] = useState(0);
  const [center, setTotalCenters] = useState(0);
  const [appointments, setTotalAppointments] = useState(0);
  const [year, setYear] = useState(2024);
  const [datamonth, setDataMonth] = useState([]);
  const [datayear, setDataYear] = useState([]);
  useEffect(() => {
    TkeMonth();
    TkeYear();
    fetchUser();
    fetchService();
    fetchCenter();
    fetchAppointment();
  }, [month, year]);
  const fetchUser = async () => {
    try {
      const response = await axios.get(`${url}myapi/Thongke/tkenguoidung.php`);
      if (response.data.success) {
        setTotalUsers(response.data.total_user);
      }
    } catch (error) {
      console.error("Error fetching user statistics:", error);
    }
  };
  const fetchService = async () => {
    try {
      const response = await axios.get(`${url}myapi/Thongke/tkedichvu.php`);
      if (response.data.success) {
        setTotalServices(response.data.total_services);
      }
    } catch (error) {
      console.error("Error fetching service statistics:", error);
    }
  };
  const fetchCenter = async () => {
    try {
      const response = await axios.get(`${url}myapi/Thongke/tketrungtam.php`);
      if (response.data.success) {
        setTotalCenters(response.data.total_centers);
      }
    } catch (error) {
      console.error("Error fetching center statistics:", error);
    }
  };
  const fetchAppointment = async (year) => {
    try {
      const response = await axios.get(`${url}myapi/Thongke/tkelichhen.php?`);
      if (response.data.success) {
        setTotalAppointments(response.data.solich);
      }
    } catch (error) {
      console.error("Error fetching appointment statistics:", error);
    }
  };

  const TkeMonth = async () => {
    try {
      const response = await axios.get(
        `${url}myapi/Thongke/tkelichhenthang.php?month=${month}&year=${year}`
      );
      if (response.data.success) {
        const chartData = response.data.statistics.daily_appointments.map(
          (item) => ({
            appointment_date: item.appointment_date,
            appointments: parseInt(item.daily_appointments, 10),

            total_daily_appointments: parseInt(item.daily_appointments, 10),
            total_user: parseInt(item.total_users, 10),
            total_appoinments: parseInt(item.total_appointments, 10),
          })
        );
        setDataMonth(chartData);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };
  const TkeYear = async () => {
    try {
      const response = await axios.get(
        `${url}myapi/Thongke/tkelichhennam.php?&year=${year}`
      );
      if (response.data.success) {
        const chartDatas = response.data.statistics.monthly_appointments.map(
          (item) => ({
            appointment_month: item.appointment_month,
            total_appoinments_month: parseInt(item.total_appointments, 10),
          })
        );
        setDataYear(chartDatas);
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };
  return (
    <div className="dashboard-container">
      {/* Container for cards */}
      <div className="cards-container">
        <Card className="card green">
          <CardContent>
            <Typography variant="h6" component="div">
              Tổng người dùng
            </Typography>
            <Typography variant="h4">{user}</Typography>
          </CardContent>
        </Card>

        <Card className="card blue">
          <CardContent>
            <Typography variant="h6" component="div">
              Doanh thu
            </Typography>
            <Typography variant="h4">$3,787</Typography>
          </CardContent>
        </Card>

        <Card className="card yellow">
          <CardContent>
            <Typography variant="h6" component="div">
              Tổng dịch vụ
            </Typography>
            <Typography variant="h4">{service}</Typography>
          </CardContent>
        </Card>

        <Card className="card red">
          <CardContent>
            <Typography variant="h6" component="div">
              Số trung tâm
            </Typography>
            <Typography variant="h4">{center}</Typography>
          </CardContent>
        </Card>
        <Card className="card purple ">
          <CardContent>
            <Typography variant="h6" component="div">
              Tổng lượt đặt
            </Typography>
            <Typography variant="h4">{appointments}</Typography>
          </CardContent>
        </Card>
      </div>
      <div className="date-picker-container">
        <FormControl sx={{ minWidth: 120, margin: "0 10px" }}>
          <InputLabel>Tháng</InputLabel>
          <Select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            label="Tháng"
          >
            {[...Array(12)].map((_, index) => (
              <MenuItem key={index} value={index + 1}>
                Tháng {index + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120, margin: "0 10px" }}>
          <InputLabel>Năm</InputLabel>
          <Select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            label="Năm"
          >
            {[2023, 2024].map((yearOption) => (
              <MenuItem key={yearOption} value={yearOption}>
                {yearOption}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {/* Biểu đồ ComposedChart */}
      <div className="chart-container">
        {/* Biểu đồ tổng hợp lịch hẹn */}
        <div className="composed-chart-container">
          <Typography variant="h6" component="div" className="chart-title">
            Biểu đồ tổng hợp lịch hẹn
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <ComposedChart data={datamonth}>
              <XAxis
                dataKey="appointment_date"
                tickFormatter={(date) => {
                  const [year, month, day] = date.split("-");
                  return `${day}-${month}-${year}`;
                }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid stroke="#f5f5f5" />
              {/* <Area
              type="monotone"
              dataKey="total_daily_appointments"
              fill="#32f075"
              stroke="#32f075"
            /> */}
              <Bar dataKey="total_user" barSize={20} fill="#413ea0" />
              <Line
                type="total_appoinments"
                dataKey="total_appoinments"
                stroke="#ff7300"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Biểu đồ AreaChart */}
        <div className="area-chart-container">
          <Typography variant="h6" component="div" className="chart-title">
            Biểu đồ người dùng đặt lịch trong ngày
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart
              data={datamonth}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="appointment_date"
                tickFormatter={(date) => {
                  const [year, month, day] = date.split("-");
                  return `${day}-${month}-${year}`;
                }}
              />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="total_user"
                stroke="#323bf0"
                fill="#ff7300"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Biểu đồ BarChart */}
        <div className="bar-chart-container">
          <Typography variant="h6" component="div" className="chart-title">
            Biểu đồ tổng lịch hẹn theo tháng
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={datayear}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="appointment_month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_appoinments_month" fill="#f03232" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
