import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { ArcElement } from 'chart.js';
import Chart from 'chart.js/auto';

import {
  Typography,
} from '@mui/material';

Chart.register(ArcElement);

const DoctorStateChart = ({ assigned, notAssigned }: any) => {
  const data = {
    labels: ['Assigned Doctor', 'Not Assigned Doctor'],
    datasets: [{
      label: 'Patient Assigned Doctor State',
      data: [assigned, notAssigned],
      backgroundColor: [
        '#c19cf9',
        '#fce190',
      ],
      hoverOffset: 4,
    }],
  };

  return (
    <div className="App">
      <div>
        <Typography variant="body1">Assignment of Patients Distribution</Typography>
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

export default DoctorStateChart;
