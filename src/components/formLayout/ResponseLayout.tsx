import React from 'react';
import { Container, Typography, Box, CardMedia } from '@mui/material';
import Image0 from '../../static/style/images/Hospital.png';
import Image1 from '../../static/style/images/Symptoms.png';
import Image2 from '../../static/style/images/Doctor.png';
import data from '../../static/data/responses.json';

const styles = {
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default function ResponseLayout({ selection } : any) {
  return (
    <div style={{ display: 'flex' }}>
      <Box
        minHeight="95vh"
        width="100%"
        sx={{ flexGrow: 1 }}
        style={styles.centered}
      >
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CardMedia sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {selection === 0 && <img src={Image0} style={{ maxWidth: '50%' }} alt="Emergency Room" />}
            {selection === 1 && <img src={Image1} style={{ maxWidth: '40%' }} alt="Symptoms" />}
            {selection === 2 && <img src={Image2} style={{ maxWidth: '40%' }} alt="Doctor" />}
          </CardMedia>
          <Container>
            <Typography
              variant="h4"
              sx={{ marginTop: 1,
                flexGrow: 1,
                textAlign: 'center' }}
            >
              {data[selection].title}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ marginTop: 1,
                flexGrow: 1,
                textAlign: 'center' }}
            >
              {data[selection].subTitle}
            </Typography>
          </Container>

        </Container>
      </Box>
    </div>
  );
}
