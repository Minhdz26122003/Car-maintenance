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
  LabelList,
  Line,
  LineChart,
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
  const [revenue, setRevenue] = useState([]);
  const [datayear, setDataYear] = useState([]);
  const [price, setPrice] = useState([]);

  useEffect(() => {
    TkeMonth();
    TkeYear();
    TkeDthu();
    fetchUser();
    fetchService();
    fetchCenter();
    fetchAppointment();
    fetchRenvenue();
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
  const fetchRenvenue = async () => {
    try {
      const response = await axios.get(
        `${url}myapi/Thongke/tkedoanhthusort.php`
      );
      console.log(response.data);
      if (response.data.success) {
        setPrice(response.data.doanhthu);
      }
    } catch (error) {
      console.error("Error fetching doanh thu :", error);
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
  const TkeDthu = async () => {
    try {
      const response = await axios.get(
        `${url}myapi/Thongke/tkedoanhthu.php?&year=${year}`
      );
      console.log("API response:", response.data);

      if (
        response.data.success &&
        Array.isArray(response.data.statistics?.monthly_revenue)
      ) {
        const chartDatas2 = response.data.statistics.monthly_revenue.map(
          (item) => ({
            pay_month: item.pay_month, // Tháng
            total_revenue: parseFloat(item.total_revenue), // Doanh thu
          })
        );
        setRevenue(chartDatas2);
      } else {
        console.error(
          "Invalid data structure or empty monthly_revenue:",
          response.data
        );
        setRevenue([]);
      }
    } catch (error) {
      console.error("Error fetching revenue:", error);
      setRevenue([]);
    }
  };
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
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
            <Typography variant="h5">{user}</Typography>
          </CardContent>
        </Card>

        <Card className="card blue">
          <CardContent>
            <Typography variant="h6" component="div">
              Doanh thu
            </Typography>
            <Typography variant="h5">{formatCurrency(price)}</Typography>
          </CardContent>
        </Card>

        <Card className="card yellow">
          <CardContent>
            <Typography variant="h6" component="div">
              Tổng dịch vụ
            </Typography>
            <Typography variant="h5">{service}</Typography>
          </CardContent>
        </Card>

        <Card className="card red">
          <CardContent>
            <Typography variant="h6" component="div">
              Số trung tâm
            </Typography>
            <Typography variant="h5">{center}</Typography>
          </CardContent>
        </Card>
        <Card className="card purple ">
          <CardContent>
            <Typography variant="h6" component="div">
              Tổng lượt đặt
            </Typography>
            <Typography variant="h5">{appointments}</Typography>
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
        {/* Biểu đồ doanh thu (LineChart) */}
        <div className="area-chart-container">
          <Typography variant="h6" component="div" className="chart-title">
            Biểu đồ tổng doanh thu trong tháng
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenue}
              margin={{ left: 40, right: 20, top: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="pay_month" />
              <YAxis
                label={{
                  value: "Doanh thu",
                  angle: -90,
                  position: "insideLeft",
                }}
                tickFormatter={formatCurrency} //
              />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Area
                type="monotone"
                dataKey="total_revenue"
                stroke="#8884d8"
                fill="#8884d8"
                name="Tổng doanh thu trong tháng"
              >
                <LabelList
                  dataKey="total_revenue"
                  position="top"
                  formatter={(value) => formatCurrency(value)}
                />
              </Area>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Biểu đồ thanh (BarChart) */}
        <div className="bar-chart-container">
          <Typography variant="h6" component="div" className="chart-title">
            Biểu đồ tổng lịch hẹn theo tháng
          </Typography>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={datayear}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="appointment_month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="total_appoinments_month"
                fill="#f03232"
                name="Số lịch hẹn trong tháng"
              >
                <LabelList dataKey="total_appoinments_month" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Biểu đồ kết hợp (ComposedChart) */}
      <div className="composed-chart-container">
        <Typography variant="h6" component="div" className="chart-title">
          Biểu đồ tổng hợp lịch hẹn và người dùng trong tháng
        </Typography>
        <ResponsiveContainer width="100%" height="100%">
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
            <Bar
              dataKey="total_user"
              barSize={20}
              fill="#413ea0"
              name="Số người dùng"
            >
              <LabelList dataKey="total_user" position="top" />
            </Bar>
            <Line
              type="total_appoinments"
              dataKey="total_appoinments"
              stroke="#ff7300"
              name="Số lịch hẹn"
            >
              <LabelList dataKey="total_appoinments" position="top" />
            </Line>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
