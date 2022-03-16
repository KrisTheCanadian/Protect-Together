import React from 'react';
import { Container, Typography, Box, CardMedia, Button } from '@mui/material';
import Hospital from '../../static/style/images/Hospital.png';
import Symptoms from '../../static/style/images/Symptoms.png';
import Doctor from '../../static/style/images/Doctor.png';
import data from '../../static/data/responses.json';

const styles = {
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default function ResponseLayout({ selection, requestDoctor }: any) {
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
          <CardMedia
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {selection === 0 && (
              <img
                src={Hospital}
                style={{ maxWidth: '50%' }}
                alt="Emergency Room"
              />
            )}
            {selection === 1 && (
              <img src={Symptoms} style={{ maxWidth: '60%' }} alt="Symptoms" />
            )}
            {selection === 2 && (
              <img src={Doctor} style={{ maxWidth: '40%' }} alt="Doctor" />
            )}
          </CardMedia>
          <Container>
            <Typography
              variant="h4"
              sx={{
                marginTop: 1,
                flexGrow: 1,
                textAlign: 'center',
              }}
            >
              {data[selection]?.title}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                marginTop: 1,
                flexGrow: 1,
                textAlign: 'center',
                marginBottom: 2,
              }}
            >
              {data[selection]?.subTitle}
            </Typography>
          </Container>
          <Container
            sx={{
              position: 'fixed',
              bottom: 10,
              width: '100%',
              height: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: 4,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                color: '#383737',
                marginRight: '1rem',
              }}
            >
              Would you like to be contacted by one of our doctors?
            </Typography>
            <Button
              variant="text"
              onClick={() => {
                requestDoctor();
              }}
            >
              Yes
            </Button>
            <Button variant="text">No</Button>
          </Container>
        </Container>
      </Box>
    </div>
  );
}
