import React, { useState } from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import question from '../../../static/data/questions.json';

const styles = {
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default function Question5Layout({ changeStatus, count, changePoints, addUserAnswer }: any) {
  const [ansYes, setAnsYes] = useState(false);
  const [ansNo, setAnsNo] = useState(false);
  const [id, setId] = useState(0);
  const [counter, setCounter] = useState(count);
  const [pointValue, setPointValue] = useState(0);
  const [error, setError] = useState(false);
  const [value, setValue] = useState('');

  const handleClickYes = () => {
    if (!ansYes) {
      setAnsYes(true);
      setAnsNo(false);
      setError(false);
      setPointValue(question[id].p1);
      setValue('Yes');
    } else {
      setAnsYes(false);
    }
  };

  const handleClickNo = () => {
    if (!ansNo) {
      setAnsYes(false);
      setAnsNo(true);
      setError(false);
      setPointValue(question[id].p2);
      setValue('No');
    } else {
      setAnsNo(false);
    }
  };

  const handleSubmit = () => {
    if (!ansYes && !ansNo) {
      setError(true);
    } else {
      setAnsNo(false);
      setAnsYes(false);
      addUserAnswer({ label: question[id].label, result: value });
      changePoints(pointValue);
      if (question.length - 1 > id) {
        setId(id + 1);
        setCounter(counter + 1);
      } else {
        changeStatus('response');
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
          </Button>
          <Typography variant="h4" sx={{ marginTop: 1 }}>
            {question[id]?.title}
          </Typography>
          <Container
            sx={{
              marginTop: '1rem',
              display: 'flex',
              flexDirection: 'column',
              width: '50%',
            }}
          >
            <Button
              onClick={handleClickYes}
              variant={ansYes ? 'contained' : 'outlined'}
              sx={{ marginBottom: '1rem' }}
            >
              Yes
            </Button>
            <Button
              onClick={handleClickNo}
              variant={ansNo ? 'contained' : 'outlined'}
            >
              No
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
          <Button
            onClick={handleSubmit}
            type="submit"
            variant="contained"
            color="primary"
          >
            Continue
          </Button>
        </Container>
      </Box>
    </div>
  );
}
