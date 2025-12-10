import React from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const SystemActivityChart = ({ theme }) => {
  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Users",
        data: [40, 55, 25, 45, 60, 20],
        backgroundColor: "#75BEBF",
        borderRadius: 8,
      },
    ],
  };

  const lineData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Assessments",
        data: [20, 30, 40, 55, 50, 35],
        borderColor: "#27ae60",
        borderWidth: 3,
        tension: 0.4,
        fill: false,
      },
    ],
  };

  return (
    <>
      <h5 style={{ color: theme.text }} className="fw-semibold mb-3">
        System Activity Snapshot
      </h5>

      <p className="m-0 mb-2" style={{ color: theme.text }}>
        User Created Today
      </p>
      <Bar data={barData} height={80} />

      <p className="mt-4 m-0 mb-2" style={{ color: theme.text }}>
        Assessments Taken Today
      </p>
      <Line data={lineData} height={80} />

      <div
        className="p-3 mt-4"
        style={{
          background: "#eef5ff",
          borderRadius: "12px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span style={{ color: theme.text }}>Jobs Posted Today</span>
        <span className="fw-bold text-primary">24</span>
      </div>
    </>
  );
};

export default SystemActivityChart;
 