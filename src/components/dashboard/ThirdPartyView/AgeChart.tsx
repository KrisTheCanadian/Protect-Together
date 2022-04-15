import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { ArcElement } from 'chart.js';
import Chart from 'chart.js/auto';

import {
  Typography,
} from '@mui/material';

Chart.register(ArcElement);

interface AgeDataInterface {
    underTwenty: number,
    underFourty: number,
    underSixty: number,
    underEighty: number,
    old: number,
};

const AgeChart = (ageData: AgeDataInterface) => {
  const data = {
    labels: ['under 20', '20 to 40', '40 to 60', '60 to 80', '80 + '],
    datasets: [{
      label: 'Patients Age Distribution',
      data: [ageData.underTwenty, ageData.underFourty, ageData.underSixty, ageData.underEighty, ageData.old],
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
      ],
      hoverOffset: 4,
    }],
  };

  return (
    <div className="App">
      <div>
        <Typography variant="body1">Patients Age Distribution</Typography>
        <Bar
          data={data}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                ticks: {
                  autoSkip: true,
                  maxTicksLimit: 10,
                },
              },
              x: {
                grid: {
                  display: false,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default AgeChart;
