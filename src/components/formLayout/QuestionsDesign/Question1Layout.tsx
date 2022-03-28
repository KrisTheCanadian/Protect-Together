import React, { useState } from 'react';
import {
  Button,
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';

const styles = {
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default function Question1Layout({ changeStatus, addSymptoms, setUrgentState }: any) {
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down('md'));
  const [ansYes, setAnsYes] = useState(false);
  const [ansNo, setAnsNo] = useState(false);
  const [value, setValue] = useState('false');
  const [error, setError] = useState(false);

  const handleClickYes = () => {
    if (!ansYes) {
      setAnsYes(true);
      setAnsNo(false);
      setError(false);
      setValue('response0');
    } else {
      setAnsYes(false);
      setValue('false');
    }
  };

  const handleClickNo = () => {
    if (!ansNo) {
      setAnsYes(false);
      setAnsNo(true);
      setError(false);
      setValue('2');
    } else {
      setAnsNo(false);
      setValue('false');
    }
  };

  const handleClick = () => {
    if (value === 'false') {
      setError(true);
    } else {
      if (value === 'response0') {
        addSymptoms(['Severe difficulty breathing', 'Severe chest pain', 'Losing consciousness'], 0);
        setUrgentState(true);
      }
      changeStatus(value);
    }
  };

  return (
    <div style={{
      display: 'flex',
      marginTop: matchesMd ? 60 : 0,
    }}
    >
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
            className="steps-button"
            sx={{
              borderRadius: 8,
              fontSize: '17px',
              paddingBottom: '3px',
              paddingTop: '3px',
              minHeight: 0,
              minWidth: 0,
            }}
          >
            Question 1
          </Button>
          <Typography variant="h4" sx={{ marginTop: 1 }}>
            Have you experienced any of the following symptoms?
          </Typography>
          <List sx={{ marginBottom: 1 }}>
            <ListItem>
              <ListItemText>
                <Typography variant="subtitle1" sx={{ color: '#202020' }}>
                  <CircleIcon sx={{ fontSize: '9px' }} />
                  {' '}
                  Severe difficulty breathing (struggling to breathe or speaking in single words)
                </Typography>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <Typography variant="subtitle1" sx={{ color: '#202020' }}>
                  <CircleIcon sx={{ fontSize: '9px' }} />
                  {' '}
                  Severe chest pain (constant tightness or crushing sensation)
                </Typography>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <Typography variant="subtitle1" sx={{ color: '#202020' }}>
                  <CircleIcon sx={{ fontSize: '9px' }} />
                  {' '}
                  Losing consciousness
                </Typography>
              </ListItemText>
            </ListItem>
          </List>
          <Container
            sx={{
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
              sx={{ marginBottom: '1rem' }}
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
          <Button onClick={handleClick} type="submit" variant="contained" color="primary">
            Continue
          </Button>
        </Container>
      </Box>
    </div>
  );
}
