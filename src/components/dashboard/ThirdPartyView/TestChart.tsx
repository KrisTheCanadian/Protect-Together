import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { ArcElement } from 'chart.js';
import Chart from 'chart.js/auto';

import {
  Typography,
} from '@mui/material';

Chart.register(ArcElement);

const TestChart = ({ positiveCases, negativeCases }: any) => {
  const data = {
    labels: ['Covid Positive', 'Covid Negative'],
    datasets: [{
      label: 'Patient Covid Results',
      data: [positiveCases, negativeCases],
      backgroundColor: [
        'rgb(255,109,105)',
        '#82d8d8',
      ],
      hoverOffset: 4,
    }],
  };

  return (
    <div className="App">
      <div>
        <Typography variant="body1">Patient Test Results Distribution</Typography>
        <Pie
          data={data}
        />
      </div>
    </div>
  );
};

export default TestChart;
