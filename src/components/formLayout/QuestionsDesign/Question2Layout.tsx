import React, { useState } from 'react';
import { Button, Container, Typography, Box, useMediaQuery, useTheme } from '@mui/material';

const styles = {
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default function Question2Layout({ changeStatus, changePoints, addUserAnswer }: any) {
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down('md'));
  const [ansOne, setAnsOne] = useState(false);
  const [ansTwo, setAnsTwo] = useState(false);
  const [ansThree, setAnsThree] = useState(false);
  const [error, setError] = useState(false);
  const [pointValue, setPointValue] = useState(0);
  const [userAnswer, setUserAnswer] = useState({ label: "Patient's situation", result: '' });

  const handleClickOne = () => {
    if (ansOne !== true) {
      setAnsOne(true);
      setAnsTwo(false);
      setAnsThree(false);
      setPointValue(2);
      setError(false);
      setUserAnswer({ ...userAnswer, result: 'Been in contact with a person who has COVID-19' });
    } else {
      setAnsOne(false);
    }
  };

  const handleClickTwo = () => {
    if (ansTwo !== true) {
      setAnsTwo(true);
      setAnsOne(false);
      setAnsThree(false);
      setError(false);
      setPointValue(5);
      setUserAnswer({ ...userAnswer, result: 'COVID-19 positive' });
    } else {
      setAnsTwo(false);
    }
  };

  const handleClickThree = () => {
    if (ansThree !== true) {
      setAnsThree(true);
      setAnsOne(false);
      setAnsTwo(false);
      setError(false);
      setPointValue(4);
      setUserAnswer({ ...userAnswer, result: 'One or more COVID-19 symptoms' });
    } else {
      setAnsThree(false);
    }
  };

  const handleClick = () => {
    if (!ansOne && !ansTwo && !ansThree) {
      setError(true);
    } else {
      changePoints(pointValue);
      addUserAnswer(userAnswer);
      changeStatus('3');
    }
  };

  return (
    <div style={{ display: 'flex', marginTop: matchesMd ? 10 : 0 }}>
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
            Which statement best describes your situation?
          </Typography>
          <Container sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '70%',
          }}
          >
            <Button
              onClick={handleClickOne}
              variant={ansOne ? 'contained' : 'outlined'}
              sx={{ marginBottom: '1rem', fontSize: '1.1rem' }}
            >
              I have been in contact with a person who has COVID-19.
            </Button>
            <Button
              onClick={handleClickTwo}
              variant={ansTwo ? 'contained' : 'outlined'}
              sx={{ marginBottom: '1rem', fontSize: '1.1rem' }}
            >
              I have tested positive for COVID-19
            </Button>
            <Button
              onClick={handleClickThree}
              variant={ansThree ? 'contained' : 'outlined'}
              sx={{ marginBottom: '1rem', fontSize: '1.1rem' }}
            >
              I have one or more symptoms of COVID-19.
            </Button>
          </Container>
        </Container>
        <Container
          sx={{
            marginLeft: '1rem',
            marginTop: '2rem',
            flexDirection: 'column',
          }}
          style={styles.centered}
        >
          {error && (
          <p className="validationError">Please select an option.</p>
          )}
          <Button onClick={handleClick} type="submit" variant="contained" color="primary">
            Continue
          </Button>
        </Container>
      </Box>
    </div>
  );
}
