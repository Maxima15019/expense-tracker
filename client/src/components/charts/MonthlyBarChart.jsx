import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js elements
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const MonthlyBarChart = ({ trends }) => {
  // If no trends data is available, show placeholder
  const hasData = trends && trends.length > 0;

  // Prepare fallback data if empty
  const months = hasData ? trends.map((t) => t.month) : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const amounts = hasData ? trends.map((t) => t.amount) : [0, 0, 0, 0, 0, 0];

  const data = {
    labels: months,
    datasets: [
      {
        label: 'Monthly Expenditure',
        data: amounts,
        backgroundColor: 'rgba(99, 102, 241, 0.4)', // Faded Indigo
        borderColor: '#6366f1', // Solid Indigo
        borderWidth: 1.5,
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(99, 102, 241, 0.75)',
        hoverBorderColor: '#a855f7', // Glow purple on hover
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide label since it's obvious
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        padding: 12,
        bodyFont: {
          family: "'Inter', sans-serif",
        },
        callbacks: {
          label: (context) => {
            return ` Spend: $${context.raw.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
          font: {
            family: "'Inter', sans-serif",
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.04)',
        },
        ticks: {
          color: '#64748b',
          font: {
            family: "'Inter', sans-serif",
            size: 11,
          },
          callback: (value) => `$${value}`,
        },
        border: {
          dash: [4, 4],
        },
      },
    },
  };

  return (
    <div className="w-full h-64">
      {!hasData && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bg-slate-900/10">
          <p className="text-xs text-slate-500 font-medium">Add transactions to visualize monthly trends</p>
        </div>
      )}
      <Bar data={data} options={options} />
    </div>
  );
};

export default MonthlyBarChart;
