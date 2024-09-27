// Dashboard.js
import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { Bar } from "react-chartjs-2"; // Sử dụng thư viện Chart.js
import "chart.js/auto"; // Để sử dụng các biểu đồ trong Chart.js
import "./dashboard.css"; // Import style riêng

const Dashboard = () => {
  // Dữ liệu biểu đồ mẫu
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Sales",
        data: [500, 10000, 7500, 20000, 1500, 25000],
        backgroundColor: "rgba(75, 192, 192, 100)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="dashboard-container">
      {/* Container for cards */}
      <div className="cards-container">
        <Card className="card green">
          <CardContent>
            <Typography variant="h5" component="div">
              Total Users
            </Typography>
            <Typography variant="h4">277</Typography>
          </CardContent>
        </Card>

        <Card className="card blue">
          <CardContent>
            <Typography variant="h5" component="div">
              Total Sales
            </Typography>
            <Typography variant="h4">$3,787,681.00</Typography>
          </CardContent>
        </Card>

        <Card className="card yellow">
          <CardContent>
            <Typography variant="h5" component="div">
              Total Orders
            </Typography>
            <Typography variant="h4">500</Typography>
          </CardContent>
        </Card>

        <Card className="card red">
          <CardContent>
            <Typography variant="h5" component="div">
              Total Service
            </Typography>
            <Typography variant="h4">12</Typography>
          </CardContent>
        </Card>
      </div>

      {/* Container for chart */}
      <div className="chart-container">
        <Card className="chart-card">
          <CardContent>
            <Typography variant="h5" component="div">
              Sales Chart
            </Typography>
            <div className="chart-content">
              <Bar data={data} options={options} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
