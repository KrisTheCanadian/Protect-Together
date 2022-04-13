import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { ArcElement } from 'chart.js';
import Chart from 'chart.js/auto';

import {
  Typography,
} from '@mui/material';

Chart.register(ArcElement);

const SexChart = ({ maleSex, femaleSex, thirdSex } : any) => {
  const data = {
    labels: ['Male', 'Female', 'Not Disclosed'],
    datasets: [{
      label: 'Patient Sex',
      data: [maleSex, femaleSex, thirdSex],
      backgroundColor: [
        'rgb(54, 162, 235)',
        'rgb(255, 99, 132)',
        'rgb(255, 205, 86)',
      ],
      hoverOffset: 4,
    }],
  };

  return (
    <div className="App">
      <div>
        <Typography variant="h6">Patient Sex</Typography>
        <Pie
          data={data}
        />
      </div>
    </div>
  );
};

export default SexChart;
