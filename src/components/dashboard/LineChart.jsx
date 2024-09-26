import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import API from '../../../utils/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './dashboard.css';

// Register the chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MultiAxisLineChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dynamic data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get("/dashboard"); // Example API endpoint
        const { income, expense, labels } = response.data;

        // Set the dynamic data
        setChartData({
          labels: labels || ['January', 'February', 'March', 'April', 'May', 'June'], // Adjust as per your API
          datasets: [
            {
              label: 'Income',
              data: income, // Income data from API
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              yAxisID: 'y-axis-1',
            },
            {
              label: 'Expenses',
              data: expense, // Expenses data from API
              borderColor: 'rgba(153, 102, 255, 1)',
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              yAxisID: 'y-axis-2',
            }
          ]
        });

        setLoading(false);
      } catch (error) {
        setError('Error fetching chart data');
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Fetch once when the component mounts

  const options = {
    responsive: true,
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        id: 'y-axis-1',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        id: 'y-axis-2',
        grid: {
          drawOnChartArea: false, // Disable grid for this axis
        }
      }
    }
  };

  if (loading) return <p>Loading chart data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='linechartOver'>
      <h2>Multi-Axis Line Chart</h2>
      {chartData && <Line data={chartData} options={options} />}
    </div>
  );
};

export default MultiAxisLineChart;
