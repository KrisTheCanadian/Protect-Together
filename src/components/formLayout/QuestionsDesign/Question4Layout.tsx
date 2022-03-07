import React, { useEffect } from 'react';
import { Button, Container, Typography, Box, useMediaQuery, useTheme } from '@mui/material';
import questions from '../../../static/data/formIntensityQuestions.json';

const styles = {
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default function Question4Layout({ changeStatus, selection, count, changeCount }: any) {
  const [id, setId] = React.useState(0);
  const [ansOne, setAnsOne] = React.useState(false);
  const [ansTwo, setAnsTwo] = React.useState(false);
  const [ansThree, setAnsThree] = React.useState(false);
  const [value, setValue] = React.useState('false');
  const [error, setError] = React.useState(false);
  const [counter, setCounter] = React.useState(count);
  const theme = useTheme();
  const matchesSm = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOne = () => {
    if (ansOne !== true) {
      setAnsOne(true);
      setAnsTwo(false);
      setAnsThree(false);
      setError(false);
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
      if (selection.length - 1 > id) {
        setId(id + 1);
        setCounter(counter + 1);
      } else {
        changeCount(counter + 1);
        setValue('5');
      }
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
            Question
            {' '}
            {counter}
            {' '}
          </Button>
          <Typography variant="h4" sx={{ marginTop: 1, marginBottom: 3 }}>
            What is the severity of your
            {' '}
            {questions[selection[id]].label}
            {' '}
            ?
          </Typography>
          <Container sx={{ display: 'flex',
            justifyContent: 'space-around',
            width: matchesSm ? '100%' : '80%' }}
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
