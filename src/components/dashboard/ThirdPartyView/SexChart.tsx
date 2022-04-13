import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js';

import {
  Typography,
} from '@mui/material';

Chart.register(ArcElement);

const SexChart = () => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    setChartOptions({
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
        title: {
          display: true,
          text: 'Patient Sex',
        },
      },
    });
  }, []);

  const chart = () => {
    const sex = ['male', 'female'];
    const sexData = [12, 23];
    setChartData({
      labels: sex,
      datasets: [
        {
          label: 'Patient Sex',
          data: sexData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
          ],
        },
      ],
    });
    setChartOptions({
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
        title: {
          display: true,
          text: 'Patient Sex',
        },
      },
    });
  };

  const data = {
    labels: ['male', 'female', 'not diclosed'],
    datasets: [{
      label: 'Patient Sex',
      data: [12, 23, 2],
      backgroundColor: [
        'rgb(54, 162, 235)',
        'rgb(255, 99, 132)',
        'rgb(255, 205, 86)',
      ],
      hoverOffset: 4,
    }],
  };

  useEffect(() => {
    chart();
  }, []);

  return (
    <div className="App">
      <div>
        {/* <Typography variant="h6">Patient Sex</Typography> */}
        <Pie
          data={data}
          options={chartOptions}
        />
      </div>
    </div>
  );
};

export default SexChart;
