import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const categoryColors = {
  Food: '#fbbf24',          // Amber
  Travel: '#38bdf8',        // Sky
  Shopping: '#f472b6',      // Pink
  Bills: '#f87171',         // Red
  Entertainment: '#c084fc',  // Purple
  Health: '#34d399',        // Emerald
  Others: '#94a3b8',        // Slate
};

const CategoryPieChart = ({ breakdown }) => {
  const categories = Object.keys(breakdown);
  const amounts = Object.values(breakdown);
  const total = amounts.reduce((sum, val) => sum + val, 0);

  // If no expenses have been recorded, return a placeholder or empty state
  const hasExpenses = total > 0;

  const data = {
    labels: categories,
    datasets: [
      {
        data: hasExpenses ? amounts : [1],
        backgroundColor: hasExpenses 
          ? categories.map((cat) => categoryColors[cat] || '#94a3b8')
          : ['rgba(148, 163, 184, 0.1)'],
        borderColor: hasExpenses
          ? '#1e293b' // Dark background matching border
          : 'rgba(148, 163, 184, 0.2)',
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#94a3b8',
          font: {
            family: "'Inter', sans-serif",
            size: 11,
          },
          padding: 16,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        enabled: hasExpenses,
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        bodyFont: {
          family: "'Inter', sans-serif",
        },
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(1);
            return ` $${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
    cutout: '72%',
  };

  return (
    <div className="relative w-full h-64 flex items-center justify-center">
      {/* Center Text displaying overall total */}
      {hasExpenses && (
        <div className="absolute flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Total spent</span>
          <span className="text-xl sm:text-2xl font-bold font-heading text-slate-100">${total.toFixed(0)}</span>
        </div>
      )}
      
      {!hasExpenses && (
        <div className="absolute flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs text-slate-500 font-medium">No transactions</span>
        </div>
      )}

      <Doughnut data={data} options={options} />
    </div>
  );
};

export default CategoryPieChart;
