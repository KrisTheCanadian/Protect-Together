import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';

const styles = {
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default function Question4Layout() {
  const [ansOne, setAnsOne] = React.useState(false);
  const [ansTwo, setAnsTwo] = React.useState(false);
  const [ansThree, setAnsThree] = React.useState(false);
  const [value, setValue] = React.useState('false');
  const [error, setError] = React.useState(true);
  const handleClickOne = () => {
    if (ansOne !== true) {
      setAnsOne(true);
      setAnsTwo(false);
      setAnsThree(false);
      setValue('one');
    } else {
      setAnsOne(false);
      setValue('false');
    }
  };

  const handleClickTwo = () => {
    if (ansTwo !== true) {
      setAnsTwo(true);
      setAnsOne(false);
      setAnsThree(false);
      setValue('two');
    } else {
      setAnsTwo(false);
      setValue('false');
    }
  };

  const handleClickThree = () => {
    if (ansThree !== true) {
      setAnsThree(true);
      setAnsOne(false);
      setAnsTwo(false);
      setValue('three');
    } else {
      setAnsThree(false);
      setValue('false');
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Box
        minHeight="95vh"
        width="100%"
        flexDirection="column"
        sx={{ flexGrow: 1 }}
        style={styles.centered}
      >
        <Container
          sx={{
            marginLeft: '1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Button
            variant="contained"
            sx={{
              borderRadius: 8,
              fontSize: '17px',
              paddingBottom: '3px',
              paddingTop: '3px',
              minHeight: 0,
              minWidth: 0,
            }}
          >
            Question 2
          </Button>
          <Typography variant="h4" sx={{ marginTop: 1, marginBottom: 3 }}>
            What is the severity of your cough?
          </Typography>
          <Container sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <Button
              onClick={handleClickOne}
              variant={ansOne ? 'contained' : 'outlined'}
              sx={{ fontSize: '1.1rem' }}
            >
              Mild
            </Button>
            <Button
              onClick={handleClickTwo}
              variant={ansTwo ? 'contained' : 'outlined'}
              sx={{ fontSize: '1.1rem' }}
            >
              Moderate
            </Button>
            <Button
              onClick={handleClickThree}
              variant={ansThree ? 'contained' : 'outlined'}
              sx={{ fontSize: '1.1rem' }}
            >
              Severe
            </Button>
          </Container>
        </Container>
        <Container
          sx={{
            marginTop: '2rem',
          }}
          style={styles.centered}
        >
          <Button type="submit" variant="contained" color="primary">
            Continue
          </Button>
        </Container>
      </Box>
    </div>
  );
}
