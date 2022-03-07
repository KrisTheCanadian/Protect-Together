import React from 'react';
import { Button, Container, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';

const styles = {
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default function Question2Layout(props: any) {
  const [ansOne, setAnsOne] = React.useState(false);
  const [ansTwo, setAnsTwo] = React.useState(false);
  const [ansThree, setAnsThree] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [value, setValue] = React.useState('false');
  const handleClickOne = () => {
    if (ansOne !== true) {
      setAnsOne(true);
      setAnsTwo(false);
      setAnsThree(false);
      setValue('3');
      setError(false);
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
      setValue('3');
      setError(false);
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
      setValue('3');
      setError(false);
    } else {
      setAnsThree(false);
      setValue('false');
    }
  };

  const handleClick = () => {
    if (value === 'false') {
      setError(true);
    }
    if (value !== 'false') {
      props.changeStatus(value);
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
