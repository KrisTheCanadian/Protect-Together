import React, { useEffect, useState } from 'react';
import { Button, Container, Typography, Box, useMediaQuery, useTheme } from '@mui/material';
import questions from '../../static/data/formSymptomsIntensity.json';

const styles = {
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default function SymptomsIntensity({ changeStatus, selection }: any) {
  const [ansOne, setAnsOne] = useState(false);
  const [ansTwo, setAnsTwo] = useState(false);
  const [ansThree, setAnsThree] = useState(false);
  const [value, setValue] = useState('false');
  const [error, setError] = useState(false);
  const [pointValue, setPointValue] = useState(0);
  const theme = useTheme();
  const matchesSm = useMediaQuery(theme.breakpoints.down('sm'));

  console.log(selection);
  const handleClickOne = () => {
    if (ansOne !== true) {
      setAnsOne(true);
      setAnsTwo(false);
      setAnsThree(false);
      setError(false);
      // setPointValue(questions[id].p1);
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
      // setPointValue(questions[id].p2);
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
      // setPointValue(questions[id].p3);
    } else {
      setAnsThree(false);
    }
  };

  useEffect(() => {
    if (value !== 'false') {
      changeStatus(value);
    }
  }, [changeStatus, value]);

  const handleSubmit = () => {
    if (!ansOne && !ansTwo && !ansThree) {
      setError(true);
    } else {
      setAnsOne(false);
      setAnsTwo(false);
      setAnsThree(false);
      setValue('response');
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
          <Typography variant="h4" sx={{ marginTop: 1, marginBottom: 1 }}>
            What is the severity of your
          </Typography>
          {selection.map((symptom: number) => (
            <>
              <Typography variant="h4" sx={{ marginBottom: 3 }}>
                {' '}
                {questions[symptom]?.label}
                {' '}
              </Typography>
              <Container sx={{
                display: 'flex',
                justifyContent: 'space-around',
                width: matchesSm ? '100%' : '80%',
              }}
              >
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

            </>
          ))}
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
          <Button onClick={handleSubmit} type="submit" variant="contained" color="primary">
            Continue
          </Button>
        </Container>
      </Box>
    </div>
  );
}
