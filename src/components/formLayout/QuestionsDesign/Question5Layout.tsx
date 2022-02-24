import React, { useEffect } from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import question from '../../../static/data/questions.json';

const styles = {
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default function QuestionsLayout({ changeStatus, selection } : any) {
  const [ansYes, setAnsYes] = React.useState(false);
  const [buttonClicked, setButtonClicked] = React.useState(false);
  const [value, setValue] = React.useState(question[selection].value);

  const handleClickYes = () => {
    setAnsYes(true);
    setButtonClicked(true);
  };

  const handleClickNo = () => {
    setAnsYes(false);
    setButtonClicked(true);
  };

  const handleClick = () => {
    setButtonClicked(false);
    setAnsYes(false);
    changeStatus(question[selection].value);
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
            {question[selection].number}
          </Button>
          <Typography variant="h4" sx={{ marginTop: 1 }}>
            {question[selection].title}
          </Typography>
          <Button
            onClick={handleClickYes}
            variant={ansYes && buttonClicked ? 'contained' : 'outlined'}
            sx={{ marginBottom: '1rem' }}
          >
            Yes
          </Button>
          <Button
            onClick={handleClickNo}
            variant={!ansYes && buttonClicked ? 'contained' : 'outlined'}
            sx={{ marginBottom: '1rem' }}
          >
            No
          </Button>
        </Container>
        <Container
          sx={{
            marginTop: '2rem',
          }}
          style={styles.centered}
        >
          <Button
            onClick={handleClick}
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
